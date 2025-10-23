export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Пароль должен содержать минимум 6 символов' };
  }
  if (password.length > 100) {
    return { valid: false, error: 'Пароль слишком длинный' };
  }
  return { valid: true };
};

export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (name.length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'Имя слишком длинное' };
  }
  return { valid: true };
};

export const validateAmount = (amount: number, min: number, max?: number): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Введите корректную сумму' };
  }
  if (amount < min) {
    return { valid: false, error: `Минимальная сумма ${min}₽` };
  }
  if (max && amount > max) {
    return { valid: false, error: `Максимальная сумма ${max}₽` };
  }
  return { valid: true };
};

export const validateCardNumber = (cardNumber: string): { valid: boolean; error?: string } => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (cleaned.length < 4) {
    return { valid: false, error: 'Введите последние 4 цифры карты' };
  }
  
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: 'Номер карты должен содержать только цифры' };
  }
  
  return { valid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
