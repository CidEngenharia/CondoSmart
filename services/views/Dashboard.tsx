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
    const isToday = timestamp.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = timestamp.toDateString() === yesterday.toDateString();

    if (isToday) return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'HOJE', dot: 'bg-emerald-500' };
    if (isYesterday) return { color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'ONTEM', dot: 'bg-blue-500' };
    return { color: 'bg-slate-50 text-slate-500 border-slate-100', label: 'REGISTRADO', dot: 'bg-slate-400' };
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {!isBillingActive && (
        <div className="bg-rose-600 text-white rounded-[2rem] p-6 shadow-xl flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
                 <i className="fas fa-hand-holding-dollar"></i>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Acesso Limitado</p>
                <p className="text-sm font-medium opacity-90">Detectamos pendência financeira. Regularize para liberar todos os recursos.</p>
              </div>
           </div>
           <button onClick={() => setView(AppView.PLANS)} className="bg-white text-rose-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">Regularizar</button>
        </div>
      )}

      <div className={`rounded-[4rem] p-12 text-white shadow-[0_50px_100px_-30px_rgba(15,23,42,0.3)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group transition-all duration-700 ${isBillingActive ? 'bg-slate-900' : 'bg-slate-700 grayscale'}`}>
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/20 rounded-full -mr-[25rem] -mt-[25rem] blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

        <div className="relative z-10 space-y-6 text-center md:text-left flex-1 min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-4">
             <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-inner">
               <i className={`fas ${isBillingActive ? 'fa-hand-sparkles text-indigo-400' : 'fa-lock text-rose-400'}`}></i>
             </div>
             <div className="flex flex-col">
               <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] leading-none">{getGreeting()}</p>
               <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1.5">Gestão CondoSmart AI</p>
             </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-tight drop-shadow-2xl break-words">
              {condoName || 'Novo Condomínio'}
            </h2>
            <div className="flex flex-col md:flex-row gap-5 items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${isBillingActive ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-rose-600/20 border-rose-500/30'}`}>
                <span className={`w-2 h-2 rounded-full ${isBillingActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                <p className={`${isBillingActive ? 'text-indigo-100' : 'text-rose-100'} text-[11px] font-black uppercase tracking-widest`}>
                  {isBillingActive ? 'Painel Ativo' : 'Painel Suspenso'}
                </p>
              </div>
              <button onClick={() => setView(AppView.PATRIMONY)} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-cog group-hover:rotate-90 transition-transform"></i> Configurações
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-4 bg-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl border border-white/10 shadow-2xl min-w-[280px]">
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
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 px-6">
            Mural de Avisos
            <span className="bg-indigo-600 text-white text-[11px] px-3 py-1 rounded-xl shadow-lg">{alerts.length}</span>
          </h3>

          <div className="grid gap-6">
            {displayAlerts.length === 0 ? (
              <div className="bg-white p-24 rounded-[4rem] border border-dashed border-slate-200 text-center">
                 <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Nenhum Aviso</p>
              </div>
            ) : (
              displayAlerts.map((alert) => {
                const style = getAlertStyle(alert.timestamp);
                return (
                  <div key={alert.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${style.dot} opacity-20`}></div>
                    <div className={`w-18 h-18 rounded-[1.8rem] flex items-center justify-center text-3xl shrink-0 ${style.color}`}>
                       <i className={alert.type === 'RECIBO' ? 'fas fa-receipt' : alert.type === 'ORCAMENTO' ? 'fas fa-calculator' : 'fas fa-poll-h'}></i>
                    </div>
                    <div className="flex-1">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{alert.title}</h4>
                       <p className="text-sm text-slate-500 mt-2">{alert.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] border-b border-slate-50 pb-8">Atalhos Rápidos</h4>
           <div className="space-y-10">
              <StatItem icon="fas fa-box" label="Encomendas" value="12 Pendentes" color="text-amber-500" bgColor="bg-amber-50" onClick={() => setView(AppView.DELIVERIES)} />
              <StatItem icon="fas fa-car" label="Veículos" value="45 Ativos" color="text-indigo-500" bgColor="bg-indigo-50" onClick={() => setView(AppView.VEHICLES)} />
           </div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ icon: string, label: string, value: string, color: string, bgColor: string, onClick: () => void }> = ({ icon, label, value, color, bgColor, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between group cursor-pointer hover:translate-x-3 transition-transform duration-500">
    <div className="flex items-center gap-6">
      <div className={`w-16 h-16 ${bgColor} ${color} rounded-[1.6rem] flex items-center justify-center text-3xl shadow-sm border border-black/5`}>
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