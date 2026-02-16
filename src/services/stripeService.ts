import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe (Live)
const STRIPE_PUBLIC_KEY = "pk_live_51T17SS3FKB6XMKTEBZSjXN61qXREmQA7KOyZe6vtEeFgTClqhpV5zgOZ66NiFA7o3WpJ3Kl8PBVYVjWLN7gfvCRT00rtaMcEow";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (planPriceId: string, customerEmail?: string) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe não carregado');

  // Em uma aplicação real, você chamaria sua API backend aqui para criar a sessão de checkout
  // e obter o sessionId ou a URL de redirecionamento.
  console.log(`Iniciando checkout para o plano: ${planPriceId} para o email: ${customerEmail}`);
  
  // Nota: O redirecionamento real requer uma URL de sessão gerada pelo servidor (Stripe Checkout)
  return { success: true, url: 'https://checkout.stripe.com/pay/...' };
};