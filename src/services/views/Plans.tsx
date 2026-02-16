"use client";

import React, { useState } from 'react';
import { PlanType, UserRole } from '@/services/types';
import { supabase } from '@/js/supabase';
import { createCheckoutSession } from '../stripeService';
import { Check, CreditCard, ShieldCheck } from 'lucide-react';

interface PlansProps {
  onSelectPlan: (plan: PlanType) => void;
  currentPlan: PlanType;
  isLoggedIn?: boolean;
  isCondoAdmin?: boolean;
}

const PLANS = [
  {
    type: PlanType.ESSENTIAL,
    name: 'Essencial',
    price: 'R$ 250',
    priceId: 'price_essential_id',
    directLink: 'https://buy.stripe.com/28EfZad956Je2rgaCuf3a00',
    description: 'Organização básica para condomínios pequenos.',
    features: ['Gestão de Encomendas', 'Reserva de Áreas', 'Comunicados Push', 'App Moradores'],
    color: 'bg-slate-50 text-slate-900',
    btnColor: 'bg-slate-900 text-white',
  },
  {
    type: PlanType.PROFESSIONAL,
    name: 'Profissional',
    price: 'R$ 300',
    priceId: 'price_professional_id',
    description: 'Gestão completa com ferramentas financeiras.',
    features: ['Tudo do Essencial', 'Assembleia Virtual', 'Boletos Automáticos', 'Relatórios Mensais'],
    color: 'bg-indigo-600 text-white',
    btnColor: 'bg-white text-indigo-600',
    highlight: true,
  },
  {
    type: PlanType.PREMIUM_AI,
    name: 'Premium AI',
    price: 'R$ 399',
    priceId: 'price_premium_id',
    description: 'Vanguarda tecnológica com IA completa.',
    features: ['Tudo do Profissional', 'Portaria IA 24h', 'Biometria Facial', 'Busca de Voz Gemini'],
    color: 'bg-slate-900 text-white',
    btnColor: 'bg-indigo-500 text-white',
  }
];

const Plans: React.FC<PlansProps> = ({ onSelectPlan, currentPlan, isLoggedIn, isCondoAdmin }) => {
  const [loading, setLoading] = useState<PlanType | null>(null);

  const handlePlanAction = async (plan: any) => {
    // Se houver um link direto (como o do plano Essencial), redireciona imediatamente
    if (plan.directLink) {
      window.location.href = plan.directLink;
      return;
    }

    if (!isLoggedIn) {
      onSelectPlan(plan.type);
      return;
    }

    if (!isCondoAdmin) {
      alert("Apenas o Síndico pode gerenciar a assinatura.");
      return;
    }

    setLoading(plan.type);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão inválida.");

      const session = await createCheckoutSession(plan.priceId, user.email);
      
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao processar pagamento: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn py-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Escolha seu Plano</h2>
        <p className="text-slate-500 text-lg font-medium italic">Escalabilidade e Inteligência Artificial para seu condomínio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, i) => (
          <div key={i} className={`rounded-[3rem] p-10 flex flex-col shadow-2xl border transition-all hover:-translate-y-2 duration-500 ${plan.color} ${currentPlan === plan.type ? 'ring-8 ring-indigo-500/20 border-indigo-400' : 'border-slate-100'}`}>
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">{plan.name}</h3>
                {currentPlan === plan.type && (
                  <span className="text-[9px] font-black uppercase px-3 py-1.5 bg-indigo-600 text-white rounded-xl tracking-widest">Ativo</span>
                )}
              </div>
              <p className="text-sm opacity-80 font-medium italic">{plan.description}</p>
            </div>
            
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
              <span className="text-xs font-black uppercase tracking-widest opacity-60">/mês</span>
            </div>

            <div className="flex-1 space-y-5 mb-12">
              {plan.features.map((feat, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Check size={14} className="text-indigo-500" />
                  </div>
                  <span className="text-sm font-bold">{feat}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handlePlanAction(plan)}
              disabled={loading !== null}
              className={`w-full py-6 rounded-[1.8rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all ${plan.btnColor} hover:scale-105 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50`}
            >
              {loading === plan.type ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size={18} />
                  {isLoggedIn ? (currentPlan === plan.type ? 'Renovar' : 'Assinar') : 'Começar'}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-4 pt-8">
         <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pagamento Seguro via Stripe</span>
         </div>
      </div>
    </div>
  );
};

export default Plans;