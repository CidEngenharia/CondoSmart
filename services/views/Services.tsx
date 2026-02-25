
import React, { useState } from 'react';
import { PlanType, User, UserRole, CondoData, AppView } from '../types';

interface ServicesProps {
  user: User | null;
  condoData: CondoData;
  setView: (view: AppView) => void;
}

const Services: React.FC<ServicesProps> = ({ user, condoData, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const CATEGORIES = [
    { id: 'todos', label: 'Todos', icon: 'fas fa-th-large' },
    { id: 'operacional', label: 'Operacional', icon: 'fas fa-cogs' },
    { id: 'social', label: 'Social', icon: 'fas fa-users' },
    { id: 'seguranca', label: 'Segurança', icon: 'fas fa-shield-alt' },
    { id: 'financeiro', label: 'Financeiro', icon: 'fas fa-wallet' },
    { id: 'gestao', label: 'Gestão', icon: 'fas fa-user-tie' },
  ];

  const SERVICES_LIST = [
    { 
      id: 'moradores', 
      title: 'Moradores', 
      icon: 'fas fa-users', 
      cat: 'social', 
      color: 'bg-indigo-600', 
      desc: 'Gestão completa de cadastros, unidades e acesso.', 
      action: () => setView(AppView.RESIDENTS) 
    },
    { 
      id: 'encomendas', 
      title: 'Encomendas', 
      icon: 'fas fa-box', 
      cat: 'operacional', 
      color: 'bg-amber-500', 
      desc: 'Registre e notifique entregas recebidas.', 
      action: () => setView(AppView.DELIVERIES) 
    },
    { 
      id: 'reservas', 
      title: 'Reservas', 
      icon: 'fas fa-calendar-check', 
      cat: 'social', 
      color: 'bg-emerald-500', 
      desc: 'Reserve salão de festas, churrasqueiras e mais.', 
      action: () => setView(AppView.RESERVATIONS) 
    },
    { 
      id: 'v-moradores', 
      title: 'Veículos', 
      icon: 'fas fa-car', 
      cat: 'seguranca', 
      color: 'bg-indigo-500', 
      desc: 'Gestão da frota de moradores cadastrados.', 
      action: () => setView(AppView.VEHICLES) 
    },
    { 
      id: 'portaria-ia', 
      title: 'Portaria IA', 
      icon: 'fas fa-robot', 
      cat: 'seguranca', 
      color: 'bg-blue-600', 
      desc: 'Atendimento por voz e controle inteligente de acessos.', 
      action: () => setView(AppView.CONCIERGE) 
    },
    { 
      id: 'faturamento', 
      title: 'Financeiro', 
      icon: 'fas fa-barcode', 
      cat: 'financeiro', 
      color: 'bg-slate-800', 
      desc: 'Acesse segundas vias de boletos e histórico de taxas.', 
      action: () => setView(AppView.BILLING) 
    },
    { 
      id: 'estudio-ia', 
      title: 'Estúdio IA', 
      icon: 'fas fa-wand-magic-sparkles', 
      cat: 'gestao', 
      color: 'bg-purple-600', 
      desc: 'Gere comunicados, recibos e enquetes com Inteligência Artificial.', 
      action: () => setView(AppView.CREATIVE) 
    },
    { 
      id: 'patrimonio', 
      title: 'Patrimônio', 
      icon: 'fas fa-building', 
      cat: 'gestao', 
      color: 'bg-slate-700', 
      desc: 'Dados estruturais, funcionários e configurações do condomínio.', 
      action: () => setView(AppView.PATRIMONY) 
    },
    { 
      id: 'ocorrencias', 
      title: 'Ocorrências', 
      icon: 'fas fa-book', 
      cat: 'social', 
      color: 'bg-rose-500', 
      desc: 'Registro formal de eventos, sugestões e reclamações.' 
    },
    { 
      id: 'os', 
      title: 'Manutenção', 
      icon: 'fas fa-tools', 
      cat: 'operacional', 
      color: 'bg-orange-600', 
      desc: 'Abra chamados para reparos técnicos e manutenções.' 
    },
    { 
      id: 'documentos', 
      title: 'Documentos', 
      icon: 'fas fa-file-pdf', 
      cat: 'gestao', 
      color: 'bg-teal-600', 
      desc: 'Regimento interno, atas de assembleia e normas.',
      action: () => setView(AppView.ABOUT)
    },
    { 
      id: 'planos', 
      title: 'Assinatura', 
      icon: 'fas fa-gem', 
      cat: 'financeiro', 
      color: 'bg-indigo-400', 
      desc: 'Gerencie o plano do condomínio e recursos ativos.',
      action: () => setView(AppView.PLANS)
    }
  ];

  const filtered = SERVICES_LIST.filter(s => 
    (activeCategory === 'todos' || s.cat === activeCategory) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCardClick = (service: any) => {
    if (service.action) {
      service.action();
    } else {
      setActiveModal(service.id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Minha Central</h2>
            <p className="text-sm text-slate-500 mt-3 font-medium italic">Selecione um serviço para gerenciar sua unidade ou o condomínio.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
             <i className="fas fa-info-circle text-indigo-500"></i>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plano Ativo: <span className="text-indigo-600">{condoData.currentPlan}</span></span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group w-full">
            <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="O que você precisa resolver agora?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-3xl py-5 pl-16 pr-6 text-sm font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none shadow-sm transition-all placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  activeCategory === cat.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' 
                  : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <i className={`${cat.icon} text-xs`}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(s => (
          <button 
            key={s.id}
            onClick={() => handleCardClick(s)}
            className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-start text-left h-full relative overflow-hidden"
          >
            <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-8 shadow-2xl shadow-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
               <i className={s.icon}></i>
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase group-hover:text-indigo-600 transition-colors">{s.title}</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 flex-1 line-clamp-2 italic">{s.desc}</p>
            
            <div className="flex items-center justify-between w-full pt-6 border-t border-slate-50">
               <span className="text-[10px] font-black uppercase text-indigo-600/40 tracking-[0.2em]">{s.cat}</span>
               <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <i className="fas fa-chevron-right text-[10px]"></i>
               </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto text-3xl">
              <i className="fas fa-search"></i>
           </div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum serviço encontrado para sua busca.</p>
        </div>
      )}

      {activeModal && (
        <ServiceModal id={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

const ServiceModal: React.FC<{ id: string, onClose: () => void }> = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    alert('Sua solicitação foi registrada e enviada para a administração!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-scaleIn overflow-y-auto max-h-[90vh] border border-white/20">
        <div className="flex justify-between items-center mb-10">
           <div>
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Módulo: {id}</h3>
             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Solicitação Direta</p>
           </div>
           <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
             <i className="fas fa-times text-2xl"></i>
           </button>
        </div>
        
        <form onSubmit={handleAction} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Descreva sua solicitação</label>
            <textarea 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-6 text-sm font-medium h-48 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all resize-none shadow-inner" 
              placeholder="Explique detalhadamente o que você precisa..." 
            />
          </div>
          <button disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
            {loading ? <i className="fas fa-circle-notch animate-spin text-lg"></i> : <i className="fas fa-paper-plane text-sm"></i>}
            Enviar para Administração
          </button>
        </form>
      </div>
    </div>
  );
};

export default Services;
