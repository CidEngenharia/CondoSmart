
import React, { useState } from 'react';
import { PlanType, SubscriptionStatus } from '../types';
import { supabase } from '../../js/supabase';

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
    period: '/mês',
    description: 'Perfeito para condomínios pequenos buscando organização básica.',
    features: ['Gestão de Encomendas', 'Reserva de Áreas', 'Comunicados Push', 'App para Moradores', 'Acesso Web'],
    color: 'bg-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 text-white',
    highlight: false,
  },
  {
    type: PlanType.PROFESSIONAL,
    name: 'Profissional',
    price: 'R$ 300',
    period: '/mês',
    description: 'Gestão completa com ferramentas financeiras e assembleias.',
    features: ['Tudo do Essencial', 'Assembleia Virtual', 'Boletos Automáticos', 'Gestão Financeira', 'Relatórios Mensais', 'Suporte Prioritário'],
    color: 'bg-indigo-600 text-white',
    btnColor: 'bg-white text-indigo-600',
    highlight: true,
  },
  {
    type: PlanType.PREMIUM_AI,
    name: 'Premium AI',
    price: 'R$ 399',
    period: '/mês',
    description: 'A vanguarda tecnológica com inteligência artificial completa.',
    features: ['Tudo do Profissional', 'Portaria IA 24h', 'Biometria Facial', 'Busca de Voz Gemini', 'Previsão de Gastos', 'Gestão de Patrimônio'],
    color: 'bg-slate-900 text-white',
    btnColor: 'bg-indigo-500 text-white',
    highlight: false,
  }
];

const Plans: React.FC<PlansProps> = ({ onSelectPlan, currentPlan, isLoggedIn, isCondoAdmin }) => {
  const [loading, setLoading] = useState<PlanType | null>(null);

  const handlePlanAction = async (plan: any) => {
    if (!isLoggedIn) {
      onSelectPlan(plan.type);
      return;
    }

    if (!isCondoAdmin) {
      alert("Apenas o Síndico Administrador pode gerenciar a assinatura do condomínio.");
      return;
    }

    setLoading(plan.type);
    
    try {
      // 1. Obter usuário e condomínio vinculado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão inválida.");

      const { data: profile } = await supabase
        .from('usuarios')
        .select('condominio_id')
        .eq('id', user.id)
        .single();

      if (!profile?.condominio_id) {
        alert("Condomínio não encontrado. Por favor, crie um condomínio primeiro.");
        return;
      }

      // 2. Simulação de Checkout (Delay de processamento bancário)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Atualizar status no Supabase
      const { error } = await supabase
        .from('condominios')
        .update({ 
          status_assinatura: 'active',
          plano_ativo: plan.type
        })
        .eq('id', profile.condominio_id);

      if (error) throw error;

      alert(`Sucesso! O plano ${plan.name} foi ativado para o seu condomínio.`);
      window.location.reload(); // Recarrega para aplicar as mudanças de acesso
    } catch (err: any) {
      console.error(err);
      alert("Erro ao processar assinatura: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn py-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">A Gestão que seu condomínio merece</h2>
        <p className="text-slate-500 text-lg font-medium italic">Escalabilidade, segurança e Inteligência Artificial em um só lugar.</p>
        
        {isLoggedIn && !isCondoAdmin && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl inline-block shadow-sm">
             <p className="text-xs font-bold text-amber-700">Acesso de morador: Apenas o síndico pode realizar alterações financeiras.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, i) => (
          <div key={i} className={`rounded-[3rem] p-10 flex flex-col shadow-2xl border transition-all hover:-translate-y-2 duration-500 ${plan.color} ${currentPlan === plan.type ? 'ring-8 ring-indigo-500/20 border-indigo-400' : 'border-slate-100'}`}>
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{plan.name}</h3>
                {currentPlan === plan.type && (
                  <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl tracking-widest shadow-sm ${plan.highlight ? 'bg-white/20' : 'bg-indigo-600 text-white'}`}>Ativo</span>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-indigo-100' : 'text-slate-500 font-medium italic'}`}>{plan.description}</p>
            </div>
            
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
              <span className={`text-xs font-black uppercase tracking-widest ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.period}</span>
            </div>

            <div className="flex-1 space-y-5 mb-12">
              {plan.features.map((feat, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center text-[10px] shadow-sm ${plan.highlight ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                    <i className="fas fa-check"></i>
                  </div>
                  <span className="text-sm font-bold tracking-tight">{feat}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handlePlanAction(plan)}
              disabled={(isLoggedIn && !isCondoAdmin) || loading !== null}
              className={`w-full py-6 rounded-[1.8rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all ${plan.btnColor} hover:scale-105 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50`}
            >
              {loading === plan.type ? (
                <i className="fas fa-circle-notch animate-spin text-lg"></i>
              ) : (
                <>
                  <i className={`fas ${isLoggedIn ? 'fa-credit-card' : 'fa-rocket'}`}></i>
                  {isLoggedIn ? (currentPlan === plan.type ? 'Renovar Plano' : 'Assinar Agora') : 'Começar Agora'}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-8 space-y-4">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Pagamento Seguro & Criptografia 256-bit</p>
         <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <i className="fab fa-cc-visa text-3xl"></i>
            <i className="fab fa-cc-mastercard text-3xl"></i>
            <i className="fab fa-cc-stripe text-3xl"></i>
            <i className="fas fa-barcode text-3xl"></i>
            <i className="fas fa-qrcode text-3xl"></i>
         </div>
      </div>
    </div>
  );
};

export default Plans;
