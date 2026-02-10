
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
    { id: 'moradores', title: 'Moradores', icon: 'fas fa-users', cat: 'social', color: 'bg-indigo-600', desc: 'Gestão completa de cadastros, unidades e acesso.', action: () => setView(AppView.RESIDENTS) },
    { id: 'encomendas', title: 'Encomendas', icon: 'fas fa-box', cat: 'operacional', color: 'bg-amber-500', desc: 'Registre e notifique entregas recebidas.', action: () => setView(AppView.DELIVERIES) },
    { id: 'reservas', title: 'Reservas', icon: 'fas fa-calendar-check', cat: 'social', color: 'bg-emerald-500', desc: 'Reserve salão de festas, churrasqueiras e mais.', action: () => setView(AppView.RESERVATIONS) },
    { id: 'v-moradores', title: 'Veículos', icon: 'fas fa-car', cat: 'seguranca', color: 'bg-indigo-500', desc: 'Gestão da frota de moradores cadastrados.', action: () => setView(AppView.VEHICLES) },
    { id: 'ocorrencias', title: 'Ocorrências', icon: 'fas fa-book', cat: 'social', color: 'bg-rose-500', desc: 'Registro formal de eventos e reclamações.' },
    { id: 'v-visitantes', title: 'Visitantes', icon: 'fas fa-car-side', cat: 'seguranca', color: 'bg-blue-400', desc: 'Pré-autorize visitas e veículos externos.' },
    { id: 'boletos', title: 'Boletos', icon: 'fas fa-barcode', cat: 'financeiro', color: 'bg-slate-800', desc: 'Acesse segundas vias e histórico financeiro.' },
    { id: 'os', title: 'Ordens de Serviço', icon: 'fas fa-tasks', cat: 'operacional', color: 'bg-orange-600', desc: 'Abra chamados para manutenções técnicas.' },
    { id: 'avisos', title: 'Comunicados', icon: 'fas fa-bullhorn', cat: 'social', color: 'bg-purple-500', desc: 'Mural digital de avisos do síndico.' },
    { id: 'documentos', title: 'Regimentos', icon: 'fas fa-file-pdf', cat: 'gestao', color: 'bg-teal-600', desc: 'Documentação legal e regimento interno.' }
  ];

  const filtered = SERVICES_LIST.filter(s => 
    (activeCategory === 'todos' || s.cat === activeCategory) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Minha Central</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Encontre serviços, processos e solicitações de forma rápida.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="O que você está procurando?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-sm focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm transition-all"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <i className={cat.icon}></i>
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
            className="group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-start text-left h-full relative overflow-hidden"
          >
            <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform`}>
               <i className={s.icon}></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase group-hover:text-indigo-600 transition-colors">{s.title}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1 line-clamp-2">{s.desc}</p>
            
            <div className="flex items-center justify-between w-full pt-4 border-t border-slate-50">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.cat}</span>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <i className="fas fa-arrow-right text-[10px]"></i>
               </div>
            </div>
          </button>
        ))}
      </div>

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
    alert('Operação registrada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-scaleIn overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Módulo: {id}</h3>
           <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
             <i className="fas fa-times text-xl"></i>
           </button>
        </div>
        
        <form onSubmit={handleAction} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Observações ou Detalhes</label>
            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm h-32 focus:ring-4 focus:ring-indigo-50 outline-none" placeholder="Escreva aqui os detalhes..." />
          </div>
          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-check-circle"></i>}
            Confirmar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default Services;
