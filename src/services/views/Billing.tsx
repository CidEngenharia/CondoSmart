import React, { useState } from 'react';
import { CondoData, PlanType, SubscriptionStatus } from '../types';
import { ArrowLeft } from 'lucide-react';

interface BillingProps {
  condoData: CondoData;
  onManagePlan: () => void;
  onBack?: () => void;
}

const Billing: React.FC<BillingProps> = ({ condoData, onManagePlan, onBack }) => {
  const [history] = useState([
    { id: '1', date: new Date().toLocaleDateString('pt-BR'), amount: 'R$ 399,00', status: 'Pago', method: 'Cartão •••• 4455' },
  ]);

  // Calcula a próxima renovação (30 dias a partir de hoje)
  const getNextRenewalDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: SubscriptionStatus | undefined) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE: return 'bg-emerald-500 text-white';
      case SubscriptionStatus.PENDING: return 'bg-amber-500 text-white';
      case SubscriptionStatus.PAST_DUE: return 'bg-rose-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn py-6">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <ArrowLeft size={14} /> Voltar para Central
        </button>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Faturamento</h2>
          <p className="text-sm text-slate-500 font-medium italic mt-2">Gerencie sua assinatura e métodos de pagamento.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl shadow-lg ${condoData.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
             <i className="fas fa-gem"></i>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{condoData.currentPlan}</h3>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${getStatusColor(condoData.subscriptionStatus)}`}>
                {condoData.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'Ativo' : 'Pendente'}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Sua próxima renovação será em <span className="font-bold text-slate-900">{getNextRenewalDate()}</span>.</p>
            <button onClick={onManagePlan} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline pt-2">Alterar Plano de Assinatura</button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Valor Mensal</p>
            <h4 className="text-3xl font-black">R$ 399,00</h4>
          </div>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-6">Baixar Última NF</button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter px-4">Histórico de Cobrança</h3>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Data</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Valor</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Método</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 text-sm font-bold text-slate-700">{item.date}</td>
                  <td className="p-6 text-sm font-black text-slate-900">{item.amount}</td>
                  <td className="p-6 text-xs text-slate-500">{item.method}</td>
                  <td className="p-6 text-right">
                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;