
import React, { useState, useEffect } from 'react';
import { AppView, PlanType, UserRole, Alert } from '../types';

interface DashboardProps {
  setView: (view: AppView) => void;
  isLoggedIn: boolean;
  onLogin: (plan: PlanType, role: UserRole) => void;
  condoName?: string;
  condoLogo?: string;
  alerts?: Alert[];
  isBillingActive?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, condoName, alerts = [], isBillingActive = true }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const sortedAlerts = [...alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const displayAlerts = sortedAlerts.slice(0, 5);

  const getAlertStyle = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    const isToday = timestamp.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = timestamp.toDateString() === yesterday.toDateString();

    if (diffInHours > 24) {
      return { 
        color: 'bg-rose-50 text-rose-600 border-rose-100', 
        label: 'ATRASADO', 
        dot: 'bg-rose-500' 
      };
    }
    if (isToday) {
      return { 
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
        label: 'HOJE', 
        dot: 'bg-emerald-500' 
      };
    }
    if (isYesterday) {
      return { 
        color: 'bg-blue-50 text-blue-600 border-blue-100', 
        label: 'ONTEM', 
        dot: 'bg-blue-500' 
      };
    }
    
    return { 
      color: 'bg-slate-50 text-slate-500 border-slate-100', 
      label: 'REGISTRADO', 
      dot: 'bg-slate-400' 
    };
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Aviso de Inadimplência ou Bloqueio */}
      {!isBillingActive && (
        <div className="bg-rose-600 text-white rounded-[2rem] p-6 shadow-xl flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
                 <i className="fas fa-hand-holding-dollar"></i>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Acesso Limitado</p>
                <p className="text-sm font-medium opacity-90">Detectamos pendência financeira. Alguns recursos foram desativados para este condomínio.</p>
              </div>
           </div>
           <button onClick={() => setView(AppView.PLANS)} className="bg-white text-rose-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">Regularizar Agora</button>
        </div>
      )}

      {/* Hero Banner Dinâmico */}
      <div className={`rounded-[4rem] p-12 text-white shadow-[0_50px_100px_-30px_rgba(15,23,42,0.3)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group transition-all duration-700 ${isBillingActive ? 'bg-slate-900' : 'bg-slate-700 grayscale'}`}>
        
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/20 rounded-full -mr-[25rem] -mt-[25rem] blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full -ml-[15rem] -mb-[15rem] blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 space-y-6 text-center md:text-left flex-1 min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-4">
             <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-inner group-hover:rotate-12 transition-transform">
               <i className={`fas ${isBillingActive ? 'fa-hand-sparkles text-indigo-400' : 'fa-lock text-rose-400'}`}></i>
             </div>
             <div className="flex flex-col">
               <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] drop-shadow-sm leading-none">{getGreeting()}</p>
               <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1.5">Sua gestão centralizada no CondoSmart AI</p>
             </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none truncate drop-shadow-2xl">
              {condoName || 'Novo Condomínio'}
            </h2>
            <div className="flex flex-col md:flex-row gap-5 items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${isBillingActive ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-rose-600/20 border-rose-500/30'}`}>
                <span className={`w-2 h-2 rounded-full ${isBillingActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                <p className={`${isBillingActive ? 'text-indigo-100' : 'text-rose-100'} text-[11px] font-black uppercase tracking-widest`}>
                  {isBillingActive ? 'Painel Operacional Ativo' : 'Painel Suspenso'}
                </p>
              </div>
              <button 
                onClick={() => setView(AppView.PATRIMONY)}
                className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <i className="fas fa-cog group-hover:rotate-90 transition-transform"></i> Configurações
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-4 bg-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl border border-white/10 shadow-2xl min-w-[280px] group-hover:bg-white/10 transition-colors">
           <div className="w-full flex justify-between items-center px-2 mb-2">
              <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em]">Huso Horário Local</span>
              <span className="text-[9px] font-bold text-slate-500">Auto-sync</span>
           </div>
           <div className="text-center">
             <p className="text-6xl md:text-7xl font-black tracking-tighter text-white tabular-nums drop-shadow-xl">
               {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
             </p>
             <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-4 border-t border-white/5 pt-5 w-full">
               {currentTime.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0]}
             </p>
           </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-10 ${!isBillingActive && 'opacity-50 pointer-events-none'}`}>
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end px-6">
             <div>
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                 Mural de Avisos
                 <span className="bg-indigo-600 text-white text-[11px] px-3 py-1 rounded-xl shadow-lg shadow-indigo-100">{alerts.length}</span>
               </h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 italic">Acompanhe as últimas notificações do condomínio.</p>
             </div>
          </div>

          <div className="grid gap-6">
            {displayAlerts.length === 0 ? (
              <div className="bg-white p-24 rounded-[4rem] border border-dashed border-slate-200 text-center space-y-6">
                 <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2.8rem] flex items-center justify-center mx-auto text-4xl">
                    <i className="fas fa-bell-slash"></i>
                 </div>
                 <div className="space-y-2">
                   <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Nenhum Aviso</p>
                   <p className="text-xs text-slate-300 font-medium italic">Seu condomínio ainda não publicou comunicados.</p>
                 </div>
              </div>
            ) : (
              displayAlerts.map((alert) => {
                const style = getAlertStyle(alert.timestamp);
                return (
                  <div key={alert.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${style.dot} opacity-20`}></div>
                    
                    <div className={`w-18 h-18 rounded-[1.8rem] flex items-center justify-center text-3xl shrink-0 transition-all shadow-lg ${style.color}`}>
                       <i className={alert.type === 'RECIBO' ? 'fas fa-receipt' : alert.type === 'ORCAMENTO' ? 'fas fa-calculator' : 'fas fa-poll-h'}></i>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                       <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <h4 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase leading-tight">{alert.title}</h4>
                          <div className="flex items-center gap-2">
                            {alert.completed && (
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 tracking-widest shadow-sm">CONCLUÍDO</span>
                            )}
                            <span className={`text-[10px] font-black border px-4 py-2 rounded-2xl tracking-[0.2em] whitespace-nowrap shadow-sm ${style.color}`}>
                              {style.label}
                            </span>
                          </div>
                       </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10 group overflow-hidden relative">
             <div className="flex items-center gap-4 border-b border-slate-50 pb-8 relative z-10">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <i className="fas fa-bolt text-sm"></i>
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Atalhos de Gestão</h4>
                </div>
             </div>

             <div className="space-y-10 relative z-10">
                <StatItem icon="fas fa-box" label="Encomendas" value="Módulo Bloqueado" color="text-amber-500" bgColor="bg-amber-50" onClick={() => {}} />
                <StatItem icon="fas fa-car" label="Veículos" value="Módulo Bloqueado" color="text-indigo-500" bgColor="bg-indigo-50" onClick={() => {}} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ icon: string, label: string, value: string, color: string, bgColor: string, onClick: () => void }> = ({ icon, label, value, color, bgColor, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between group cursor-pointer hover:translate-x-3 transition-transform duration-500">
    <div className="flex items-center gap-6">
      <div className={`w-16 h-16 ${bgColor} ${color} rounded-[1.6rem] flex items-center justify-center text-3xl transition-all group-hover:scale-110 shadow-sm border border-black/5 group-hover:rotate-6`}>
        <i className={icon}></i>
      </div>
      <div>
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] leading-none mb-2.5">{label}</p>
        <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
