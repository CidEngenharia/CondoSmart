import { supabase } from '../js/supabase';

export const createCheckoutSession = async (planPriceId: string, customerEmail?: string) => {
  // Invoca a Edge Function do Supabase que criamos
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { priceId: planPriceId, email: customerEmail },
  });

  if (error) {
    console.error('Erro ao chamar a função de checkout:', error);
    throw new Error('Não foi possível iniciar o checkout. Verifique se a função está implantada.');
  }

  return data; // Retorna { url: '...' }
};