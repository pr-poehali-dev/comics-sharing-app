interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface FetchResult<T = any> {
  data?: T;
  error?: string;
  status: number;
}

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        ...fetchOptions,
        timeout,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers
        }
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
        }
        throw new ApiError(response.status, errorMessage);
      }

      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      return {
        data,
        status: response.status
      };
    } catch (error) {
      lastError = error as Error;

      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return {
          error: error.message,
          status: error.status
        };
      }

      if (attempt < retries) {
        const delayMs = retryDelay * Math.pow(2, attempt);
        await delay(delayMs);
        continue;
      }
    }
  }

  const errorMessage = lastError?.name === 'AbortError'
    ? 'Превышено время ожидания'
    : lastError?.message || 'Ошибка сети';

  return {
    error: errorMessage,
    status: 0
  };
}

export async function apiGet<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

export async function apiPost<T = any>(
  url: string,
  body: any,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function apiPut<T = any>(
  url: string,
  body: any,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

export async function apiDelete<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

export const API_ENDPOINTS = {
  WALLET: 'https://functions.poehali.dev/96f956be-cd72-474f-9b1e-937015b11dbc',
  PAYMENT: 'https://functions.poehali.dev/bee1b44c-67c7-46cf-a0c5-f54c4771d51d',
  ADMIN: 'https://functions.poehali.dev/72e3bc71-5445-45ce-ad1f-11671e687ca7'
};
