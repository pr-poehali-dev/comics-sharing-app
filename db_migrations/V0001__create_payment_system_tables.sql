CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(10),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'reader',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    balance DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, currency)
);

CREATE TABLE IF NOT EXISTS platform_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    wallet_id INTEGER NOT NULL REFERENCES wallets(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB' NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    payment_method VARCHAR(50),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commission_splits (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id),
    recipient_type VARCHAR(50) NOT NULL,
    recipient_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    subscriber_id INTEGER NOT NULL REFERENCES users(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    plan_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS works (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    genre VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10, 2) DEFAULT 0.00,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    work_id INTEGER NOT NULL REFERENCES works(id),
    transaction_id INTEGER NOT NULL REFERENCES transactions(id),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, work_id)
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    wallet_id INTEGER NOT NULL REFERENCES wallets(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB NOT NULL,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_commission_splits_transaction_id ON commission_splits(transaction_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_author_id ON subscriptions(author_id);
CREATE INDEX IF NOT EXISTS idx_works_author_id ON works(author_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_work ON purchases(user_id, work_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_status ON withdrawals(user_id, status);

INSERT INTO platform_settings (key, value, description) VALUES
    ('platform_owner_account', '', 'Реквизиты владельца платформы для получения 20% комиссии'),
    ('platform_commission_percentage', '20', 'Процент комиссии платформы'),
    ('author_commission_percentage', '80', 'Процент выплаты автору'),
    ('min_withdrawal_amount', '500', 'Минимальная сумма для вывода в рублях')
ON CONFLICT (key) DO NOTHING;
