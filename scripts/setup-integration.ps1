# setup-integration.ps1
# Script para configurar automaticamente o ambiente do CondoSmart AI

Write-Host "🚀 Iniciando configuração automática do CondoSmart AI..." -ForegroundColor Cyan

# 1. Verificação de Vínculo com o Vercel
Write-Host "`n1. Verificando vínculo com o projeto no Vercel..." -ForegroundColor Yellow

# Tenta listar envs para verificar se está vinculado
$checkLink = npx -y vercel env ls 2>&1
if ($checkLink -match "isn't linked to a project") {
    Write-Host "❌ Erro: O seu projeto local não está vinculado a um projeto no Vercel." -ForegroundColor Red
    Write-Host "Por favor, execute o comando abaixo e siga as instruções (pressione ENTER para tudo se já tiver o projeto no Vercel):" -ForegroundColor Cyan
    Write-Host "`n   npx vercel link`n" -ForegroundColor Yellow
    Write-Host "Após vincular, execute este script de configuração novamente.`n" -ForegroundColor Cyan
    exit
}

Write-Host "✅ Projeto vinculado com sucesso!" -ForegroundColor Green

# 2. Configurando Variáveis de Ambiente
Write-Host "`n2. Configurando Variáveis de Ambiente no Vercel..." -ForegroundColor Yellow
$projectName = "condosmart-ai" # Altere se o nome do projeto no Vercel for diferente

function Set-VercelEnv($key, $value) {
    if ($value) {
        Write-Host "Configurando $key..."
        npx -y vercel env add $key production --value $value
    }
    else {
        Write-Host "Aviso: $key não fornecida. Pulando..." -ForegroundColor Gray
    }
}

# Solicitar chaves se não estiverem em variáveis de ambiente locais
$stripeSecret = Read-Host "Digite sua STRIPE_SECRET_KEY"
$stripeWebhook = Read-Host "Digite seu STRIPE_WEBHOOK_SECRET"
$supabaseUrl = Read-Host "Digite sua SUPABASE_URL"
$supabaseServiceKey = Read-Host "Digite sua SUPABASE_SERVICE_ROLE_KEY"

# Preços do Stripe (Exemplos)
$priceEssential = Read-Host "Digite o ID do Preço Essential do Stripe"
$priceProfessional = Read-Host "Digite o ID do Preço Professional do Stripe"
$pricePremium = Read-Host "Digite o ID do Preço Premium AI do Stripe"

Set-VercelEnv "STRIPE_SECRET_KEY" $stripeSecret
Set-VercelEnv "STRIPE_WEBHOOK_SECRET" $stripeWebhook
Set-VercelEnv "SUPABASE_URL" $supabaseUrl
Set-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" $supabaseServiceKey
Set-VercelEnv "STRIPE_PRICE_ESSENTIAL" $priceEssential
Set-VercelEnv "STRIPE_PRICE_PROFESSIONAL" $priceProfessional
Set-VercelEnv "STRIPE_PRICE_PREMIUM_AI" $pricePremium

Write-Host "`n✅ Configuração do Vercel concluída!" -ForegroundColor Green

# 3. Lembrete do Supabase
Write-Host "`n3. Configuração do Supabase (Manual)..." -ForegroundColor Yellow
Write-Host "Por favor, execute o conteúdo do arquivo 'supabase_migration.sql' no SQL Editor do seu projeto Supabase."

# 4. Lembrete do Stripe Webhook
Write-Host "`n4. Configuração de Webhook no Stripe..." -ForegroundColor Yellow
Write-Host "Configure o endpoint de Webhook no Stripe para apontar para: https://$projectName.vercel.app/api/webhook/stripe"
Write-Host "Eventos necessários: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed"

Write-Host "`n✨ Tudo pronto! Seu ambiente está configurado." -ForegroundColor Cyan
