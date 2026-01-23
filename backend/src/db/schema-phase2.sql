-- Phase 2 Schema Extensions for Lavatec ERP

-- ==========================================
-- MÓDULO FINANCEIRO - Financial Module
-- ==========================================

-- Accounts Payable (Contas a Pagar)
CREATE TABLE IF NOT EXISTS accounts_payable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  vendor_id UUID REFERENCES vendors(id),
  description VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  document_url TEXT,
  notes TEXT,
  recurrence_type VARCHAR(20), -- none, weekly, monthly, quarterly, yearly
  recurrence_end_date DATE,
  parent_id UUID REFERENCES accounts_payable(id), -- for recurring entries
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts Receivable (Contas a Receber)
CREATE TABLE IF NOT EXISTS accounts_receivable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  customer_id UUID REFERENCES customers(id),
  invoice_id UUID REFERENCES invoices(id),
  order_id UUID REFERENCES orders(id),
  description VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  received_date DATE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, received, overdue, cancelled, partial
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cash Flow Transactions
CREATE TABLE IF NOT EXISTS cash_flow_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  type VARCHAR(20) NOT NULL, -- income, expense, transfer
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description VARCHAR(500) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  transaction_date DATE NOT NULL,
  payment_method VARCHAR(50),
  reference_id UUID, -- Can reference order, invoice, etc.
  reference_type VARCHAR(50), -- order, invoice, expense, manual
  account_payable_id UUID REFERENCES accounts_payable(id),
  account_receivable_id UUID REFERENCES accounts_receivable(id),
  balance_after DECIMAL(12, 2),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Categories
CREATE TABLE IF NOT EXISTS financial_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL, -- income, expense
  parent_id UUID REFERENCES financial_categories(id),
  color VARCHAR(20),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank Accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  agency VARCHAR(20),
  account_type VARCHAR(50), -- checking, savings, investment
  initial_balance DECIMAL(12, 2) DEFAULT 0,
  current_balance DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank Reconciliation
CREATE TABLE IF NOT EXISTS bank_reconciliations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id),
  statement_date DATE NOT NULL,
  statement_balance DECIMAL(12, 2) NOT NULL,
  system_balance DECIMAL(12, 2) NOT NULL,
  difference DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, reconciled, discrepancy
  reconciled_by UUID REFERENCES users(id),
  reconciled_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MÓDULO ADMINISTRATIVO - Administrative Module
-- ==========================================

-- System Configuration
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
  category VARCHAR(100),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- System roles cannot be deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  module VARCHAR(100), -- orders, customers, financial, admin, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id), -- Optional: role specific to branch
  PRIMARY KEY (user_id, role_id)
);

-- Multi-Branch Configuration
ALTER TABLE branches ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES branches(id);
ALTER TABLE branches ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'store'; -- headquarters, store, franchise
ALTER TABLE branches ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id);
ALTER TABLE branches ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- PAGAR.ME INTEGRATION
-- ==========================================

-- Pagar.me Transactions
CREATE TABLE IF NOT EXISTS pagarme_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  pagarme_id VARCHAR(100) UNIQUE,
  status VARCHAR(50) NOT NULL, -- processing, authorized, paid, refunded, refused, chargedback
  amount INTEGER NOT NULL, -- Amount in cents
  paid_amount INTEGER DEFAULT 0,
  refunded_amount INTEGER DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL, -- credit_card, debit_card, boleto, pix
  installments INTEGER DEFAULT 1,
  card_brand VARCHAR(50),
  card_last_digits VARCHAR(4),
  card_holder_name VARCHAR(255),
  boleto_url TEXT,
  boleto_barcode VARCHAR(100),
  boleto_expiration_date DATE,
  pix_qr_code TEXT,
  pix_expiration_date TIMESTAMP,
  authorization_code VARCHAR(50),
  nsu VARCHAR(50), -- Unique sequential number
  soft_descriptor VARCHAR(50),
  antifraud_score INTEGER,
  metadata JSONB DEFAULT '{}',
  postback_url TEXT,
  error_code VARCHAR(50),
  error_message TEXT,
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pagar.me Customers (sync with local customers)
CREATE TABLE IF NOT EXISTS pagarme_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  pagarme_id VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pagar.me Webhook Logs
CREATE TABLE IF NOT EXISTS pagarme_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  transaction_id UUID REFERENCES pagarme_transactions(id),
  pagarme_transaction_id VARCHAR(100),
  payload JSONB NOT NULL,
  signature VARCHAR(255),
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- NF-e FISCAL INTEGRATION
-- ==========================================

-- Fiscal Configuration
CREATE TABLE IF NOT EXISTS fiscal_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id),
  cnpj VARCHAR(20) NOT NULL,
  inscricao_estadual VARCHAR(20),
  inscricao_municipal VARCHAR(20),
  regime_tributario INTEGER DEFAULT 1, -- 1=Simples Nacional, 2=Simples Excesso, 3=Normal
  crt INTEGER DEFAULT 1, -- Código de Regime Tributário
  ambiente INTEGER DEFAULT 2, -- 1=Produção, 2=Homologação
  serie_nfe INTEGER DEFAULT 1,
  ultimo_numero_nfe INTEGER DEFAULT 0,
  serie_nfce INTEGER DEFAULT 1,
  ultimo_numero_nfce INTEGER DEFAULT 0,
  certificado_pfx_base64 TEXT,
  certificado_senha VARCHAR(255),
  certificado_validade DATE,
  csc_id VARCHAR(10), -- ID do Código de Segurança do Contribuinte (NFC-e)
  csc_token VARCHAR(100), -- Token CSC para NFC-e
  logo_base64 TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fiscal Documents (NF-e, NFC-e)
CREATE TABLE IF NOT EXISTS fiscal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id),
  order_id UUID REFERENCES orders(id),
  invoice_id UUID REFERENCES invoices(id),
  customer_id UUID REFERENCES customers(id),
  tipo VARCHAR(10) NOT NULL, -- NFE, NFCE, NFSE
  serie INTEGER NOT NULL,
  numero INTEGER NOT NULL,
  chave_acesso VARCHAR(44),
  protocolo_autorizacao VARCHAR(20),
  data_emissao TIMESTAMP NOT NULL,
  data_autorizacao TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- pending, authorized, rejected, cancelled
  valor_total DECIMAL(12, 2) NOT NULL,
  valor_produtos DECIMAL(12, 2),
  valor_servicos DECIMAL(12, 2),
  valor_desconto DECIMAL(12, 2) DEFAULT 0,
  valor_frete DECIMAL(12, 2) DEFAULT 0,
  valor_icms DECIMAL(12, 2) DEFAULT 0,
  valor_pis DECIMAL(12, 2) DEFAULT 0,
  valor_cofins DECIMAL(12, 2) DEFAULT 0,
  valor_iss DECIMAL(12, 2) DEFAULT 0,
  xml_content TEXT,
  pdf_url TEXT,
  pdf_base64 TEXT,
  danfe_url TEXT,
  motivo_cancelamento TEXT,
  cancelamento_protocolo VARCHAR(20),
  cancelamento_data TIMESTAMP,
  contingencia BOOLEAN DEFAULT false,
  retorno_sefaz JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, tipo, serie, numero)
);

-- Fiscal Document Items
CREATE TABLE IF NOT EXISTS fiscal_document_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fiscal_document_id UUID NOT NULL REFERENCES fiscal_documents(id) ON DELETE CASCADE,
  numero_item INTEGER NOT NULL,
  codigo_produto VARCHAR(60),
  descricao VARCHAR(500) NOT NULL,
  ncm VARCHAR(10),
  cest VARCHAR(10),
  cfop VARCHAR(10),
  unidade VARCHAR(10) DEFAULT 'UN',
  quantidade DECIMAL(15, 4) NOT NULL,
  valor_unitario DECIMAL(15, 4) NOT NULL,
  valor_total DECIMAL(15, 2) NOT NULL,
  valor_desconto DECIMAL(15, 2) DEFAULT 0,
  cst_icms VARCHAR(3),
  origem INTEGER DEFAULT 0,
  base_icms DECIMAL(15, 2) DEFAULT 0,
  aliquota_icms DECIMAL(5, 2) DEFAULT 0,
  valor_icms DECIMAL(15, 2) DEFAULT 0,
  cst_pis VARCHAR(3),
  base_pis DECIMAL(15, 2) DEFAULT 0,
  aliquota_pis DECIMAL(5, 4) DEFAULT 0,
  valor_pis DECIMAL(15, 2) DEFAULT 0,
  cst_cofins VARCHAR(3),
  base_cofins DECIMAL(15, 2) DEFAULT 0,
  aliquota_cofins DECIMAL(5, 4) DEFAULT 0,
  valor_cofins DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TEF - Physical Card Machine Integration
-- ==========================================

-- TEF Terminals
CREATE TABLE IF NOT EXISTS tef_terminals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id),
  terminal_id VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- sitef, paygo, stone_tef, etc.
  name VARCHAR(100),
  serial_number VARCHAR(100),
  model VARCHAR(100),
  ip_address VARCHAR(50),
  port INTEGER,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, maintenance
  last_ping TIMESTAMP,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, terminal_id)
);

-- TEF Transactions
CREATE TABLE IF NOT EXISTS tef_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  terminal_id UUID NOT NULL REFERENCES tef_terminals(id),
  order_id UUID REFERENCES orders(id),
  invoice_id UUID REFERENCES invoices(id),
  type VARCHAR(20) NOT NULL, -- payment, cancellation, refund
  payment_type VARCHAR(50) NOT NULL, -- credit, debit, voucher, pix
  amount INTEGER NOT NULL, -- Amount in cents
  installments INTEGER DEFAULT 1,
  status VARCHAR(50) NOT NULL, -- pending, approved, denied, cancelled, error
  nsu VARCHAR(50),
  authorization_code VARCHAR(50),
  card_brand VARCHAR(50),
  card_bin VARCHAR(6),
  card_last_digits VARCHAR(4),
  card_holder_name VARCHAR(255),
  acquirer VARCHAR(50),
  acquirer_nsu VARCHAR(50),
  receipt_customer TEXT,
  receipt_merchant TEXT,
  error_code VARCHAR(20),
  error_message TEXT,
  raw_response JSONB,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- KPIs & DASHBOARDS
-- ==========================================

-- Daily Metrics Snapshot (for fast dashboard queries)
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  metric_date DATE NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  total_expenses DECIMAL(12, 2) DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  returning_customers INTEGER DEFAULT 0,
  average_order_value DECIMAL(10, 2) DEFAULT 0,
  orders_completed INTEGER DEFAULT 0,
  orders_cancelled INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  weight_processed DECIMAL(10, 2) DEFAULT 0,
  deliveries_completed INTEGER DEFAULT 0,
  payment_received DECIMAL(12, 2) DEFAULT 0,
  accounts_receivable_total DECIMAL(12, 2) DEFAULT 0,
  accounts_payable_total DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, metric_date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_payable_status ON accounts_payable(status);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_due_date ON accounts_payable(due_date);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_status ON accounts_receivable(status);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_due_date ON accounts_receivable(due_date);
CREATE INDEX IF NOT EXISTS idx_cash_flow_date ON cash_flow_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_pagarme_transactions_status ON pagarme_transactions(status);
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_status ON fiscal_documents(status);
CREATE INDEX IF NOT EXISTS idx_fiscal_documents_chave ON fiscal_documents(chave_acesso);
CREATE INDEX IF NOT EXISTS idx_tef_transactions_status ON tef_transactions(status);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Insert default roles
INSERT INTO roles (name, display_name, description, is_system) VALUES
  ('admin', 'Administrador', 'Acesso total ao sistema', true),
  ('manager', 'Gerente', 'Gerenciamento de unidade', true),
  ('supervisor', 'Supervisor', 'Supervisão de operações', true),
  ('cashier', 'Caixa', 'Operações de caixa e PDV', true),
  ('attendant', 'Atendente', 'Atendimento ao cliente', true),
  ('driver', 'Motorista', 'Entregas e coletas', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, display_name, description, module) VALUES
  -- Orders
  ('orders.view', 'Visualizar Pedidos', 'Pode visualizar pedidos', 'orders'),
  ('orders.create', 'Criar Pedidos', 'Pode criar novos pedidos', 'orders'),
  ('orders.edit', 'Editar Pedidos', 'Pode editar pedidos', 'orders'),
  ('orders.delete', 'Excluir Pedidos', 'Pode excluir pedidos', 'orders'),
  ('orders.cancel', 'Cancelar Pedidos', 'Pode cancelar pedidos', 'orders'),
  -- Customers
  ('customers.view', 'Visualizar Clientes', 'Pode visualizar clientes', 'customers'),
  ('customers.create', 'Criar Clientes', 'Pode criar clientes', 'customers'),
  ('customers.edit', 'Editar Clientes', 'Pode editar clientes', 'customers'),
  ('customers.delete', 'Excluir Clientes', 'Pode excluir clientes', 'customers'),
  -- Financial
  ('financial.view', 'Visualizar Financeiro', 'Pode visualizar módulo financeiro', 'financial'),
  ('financial.create', 'Criar Lançamentos', 'Pode criar lançamentos', 'financial'),
  ('financial.edit', 'Editar Lançamentos', 'Pode editar lançamentos', 'financial'),
  ('financial.delete', 'Excluir Lançamentos', 'Pode excluir lançamentos', 'financial'),
  ('financial.reports', 'Relatórios Financeiros', 'Pode acessar relatórios financeiros', 'financial'),
  -- Admin
  ('admin.users', 'Gerenciar Usuários', 'Pode gerenciar usuários', 'admin'),
  ('admin.roles', 'Gerenciar Papéis', 'Pode gerenciar papéis e permissões', 'admin'),
  ('admin.branches', 'Gerenciar Unidades', 'Pode gerenciar unidades', 'admin'),
  ('admin.settings', 'Configurações do Sistema', 'Pode alterar configurações', 'admin'),
  ('admin.fiscal', 'Configurações Fiscais', 'Pode gerenciar configurações fiscais', 'admin'),
  -- Reports
  ('reports.view', 'Visualizar Relatórios', 'Pode visualizar relatórios', 'reports'),
  ('reports.export', 'Exportar Relatórios', 'Pode exportar relatórios', 'reports'),
  -- POS
  ('pos.access', 'Acessar PDV', 'Pode acessar o ponto de venda', 'pos'),
  ('pos.discount', 'Aplicar Descontos', 'Pode aplicar descontos no PDV', 'pos'),
  ('pos.cancel', 'Cancelar Itens', 'Pode cancelar itens no PDV', 'pos'),
  ('pos.close_cash', 'Fechar Caixa', 'Pode fechar o caixa', 'pos')
ON CONFLICT (name) DO NOTHING;

-- Insert default financial categories
INSERT INTO financial_categories (name, type, color) VALUES
  ('Vendas', 'income', '#10B981'),
  ('Serviços', 'income', '#06B6D4'),
  ('Outros Recebimentos', 'income', '#8B5CF6'),
  ('Salários', 'expense', '#EF4444'),
  ('Aluguel', 'expense', '#F59E0B'),
  ('Água e Luz', 'expense', '#6366F1'),
  ('Materiais', 'expense', '#EC4899'),
  ('Manutenção', 'expense', '#14B8A6'),
  ('Marketing', 'expense', '#F97316'),
  ('Impostos', 'expense', '#DC2626'),
  ('Outros', 'expense', '#6B7280')
ON CONFLICT DO NOTHING;
