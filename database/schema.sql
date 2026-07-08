-- FutureFinance AI Database Schema
-- PostgreSQL 14+

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_language CHECK (language IN ('en', 'hi'))
);

CREATE INDEX idx_users_email ON users(email);

-- Financial Data Table
CREATE TABLE IF NOT EXISTS financial_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monthly_salary DECIMAL(12, 2),
    monthly_expenses DECIMAL(12, 2),
    current_savings DECIMAL(12, 2),
    existing_emi DECIMAL(12, 2),
    credit_score INTEGER,
    loan_amount DECIMAL(12, 2),
    loan_tenure INTEGER,
    interest_rate DECIMAL(5, 2),
    investment_amount DECIMAL(12, 2),
    investment_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_financial_data_user_id ON financial_data(user_id);
CREATE INDEX idx_financial_data_created_at ON financial_data(created_at);

-- Analysis Results Table
CREATE TABLE IF NOT EXISTS analysis_results (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL,
    input_data TEXT,
    result_data TEXT,
    recommendation TEXT,
    risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_analysis_type CHECK (analysis_type IN ('LOAN', 'INVESTMENT', 'PURCHASE', 'RETIREMENT', 'GOAL', 'HEALTH', 'SIMULATOR')),
    CONSTRAINT chk_risk_level CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH'))
);

CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_analysis_results_type ON analysis_results(analysis_type);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at);

-- Investment Options Table
CREATE TABLE IF NOT EXISTS investment_options (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) UNIQUE NOT NULL,
    annual_return DECIMAL(5, 2),
    risk_level VARCHAR(20),
    liquidity VARCHAR(20),
    tax_treatment VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Information Table
CREATE TABLE IF NOT EXISTS insurance_info (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insurance_type VARCHAR(50),
    coverage_amount DECIMAL(12, 2),
    premium_amount DECIMAL(12, 2),
    policy_start_date DATE,
    policy_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insurance_info_user_id ON insurance_info(user_id);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    goal_amount DECIMAL(12, 2) NOT NULL,
    target_date DATE,
    current_progress DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Loan Information Table
CREATE TABLE IF NOT EXISTS loans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    loan_type VARCHAR(50),
    loan_amount DECIMAL(12, 2),
    disbursement_date DATE,
    tenure_months INTEGER,
    interest_rate DECIMAL(5, 2),
    emi_amount DECIMAL(12, 2),
    remaining_balance DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);

-- Financial Health Score History
CREATE TABLE IF NOT EXISTS health_score_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score DECIMAL(5, 2),
    income_stability_score DECIMAL(5, 2),
    savings_habit_score DECIMAL(5, 2),
    investment_score DECIMAL(5, 2),
    debt_management_score DECIMAL(5, 2),
    emergency_fund_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_score_user_id ON health_score_history(user_id);
CREATE INDEX idx_health_score_created_at ON health_score_history(created_at);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id BIGINT,
    changes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Insert default investment options
INSERT INTO investment_options (type, annual_return, risk_level, liquidity, tax_treatment, description)
VALUES
    ('fd', 6.5, 'LOW', 'MEDIUM', 'SLAB', 'Fixed Deposit - Guaranteed returns, low risk'),
    ('mutual_fund', 12.0, 'MEDIUM', 'HIGH', 'LTCG', 'Mutual Fund - Diversified investments'),
    ('gold', 5.5, 'LOW', 'MEDIUM', 'SLAB', 'Gold - Traditional safe investment'),
    ('stocks', 15.0, 'HIGH', 'HIGH', 'LTCG', 'Stocks - High returns, high risk')
ON CONFLICT (type) DO NOTHING;
