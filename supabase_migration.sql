-- Adicionar colunas para integração com Stripe na tabela de condomínios
ALTER TABLE condominios 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Garantir que as colunas de status e plano existam (caso não existam)
-- ALTER TABLE condominios 
-- ADD COLUMN IF NOT EXISTS status_assinatura TEXT DEFAULT 'inactive',
-- ADD COLUMN IF NOT EXISTS plano_ativo TEXT;

-- Criar índices para busca rápida (opcional, recomendado para performance)
CREATE INDEX IF NOT EXISTS idx_condominios_stripe_customer ON condominios(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_condominios_stripe_subscription ON condominios(stripe_subscription_id);
