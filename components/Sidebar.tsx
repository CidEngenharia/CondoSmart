
import React from 'react';
import { AppView, PlanType, User, UserRole } from '../services/types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentUser: User | null;
  isLoggedIn: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle, currentUser, isLoggedIn }) => {
  const navItems = [
    { view: AppView.PLANS, label: 'Planos', icon: 'fas fa-tags', minPlan: PlanType.NONE, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN], public: true },
    { view: AppView.DASHBOARD, label: 'Painel', icon: 'fas fa-chart-line', minPlan: PlanType.NONE, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.SERVICES, label: 'Central', icon: 'fas fa-tasks', minPlan: PlanType.ESSENTIAL, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.RESIDENTS, label: 'Moradores', icon: 'fas fa-users', minPlan: PlanType.ESSENTIAL, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.PATRIMONY, label: 'Patrimônio', icon: 'fas fa-building', minPlan: PlanType.PROFESSIONAL, roles: [UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.CONCIERGE, label: 'Portaria IA', icon: 'fas fa-shield-alt', minPlan: PlanType.PREMIUM_AI, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.BILLING, label: 'Faturamento', icon: 'fas fa-credit-card', minPlan: PlanType.ESSENTIAL, roles: [UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.ABOUT, label: 'Saiba Mais', icon: 'fas fa-info-circle', minPlan: PlanType.NONE, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN], public: true },
  ];

  const userPlan = currentUser?.plan || PlanType.NONE;
  const userRole = currentUser?.role || UserRole.RESIDENT;

  const isLocked = (item: any) => {
    if (item.public) return false;
    if (!isLoggedIn) return true;
    if (userRole === UserRole.SUPER_ADMIN) return false;
    if (!item.roles.includes(userRole)) return true;
    if (item.minPlan === PlanType.NONE) return false;
    if (userPlan === PlanType.PREMIUM_AI) return false;
    if (userPlan === PlanType.PROFESSIONAL && (item.minPlan === PlanType.ESSENTIAL || item.minPlan === PlanType.PROFESSIONAL)) return false;
    if (userPlan === PlanType.ESSENTIAL && item.minPlan === PlanType.ESSENTIAL) return false;
    return true;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden" onClick={onToggle}/>
      )}

      <div className={`fixed z-50 transition-all duration-300 ease-in-out md:left-6 md:top-1/2 md:-translate-y-1/2 md:flex md:flex-col ${isOpen ? 'left-0 top-0 bottom-0 h-full flex flex-col' : '-left-full md:left-6'}`}>
        <div className={`bg-slate-100/95 backdrop-blur-xl border border-slate-200 shadow-2xl transition-all duration-300 md:rounded-[2.5rem] md:p-3 md:flex-none h-full md:h-auto flex flex-col gap-4 p-6 md:p-3 ${isOpen ? 'w-64 md:w-56' : 'w-0 md:w-20 overflow-hidden md:overflow-visible'}`}>
          
          <div className="flex items-center justify-between md:hidden mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center text-white"><i className="fas fa-city"></i></div>
              <span className="font-bold text-slate-900">CondoSmart</span>
            </div>
            <button onClick={onToggle} className="text-slate-400 hover:text-slate-900 p-2"><i className="fas fa-times"></i></button>
          </div>

          <button onClick={onToggle} className="hidden md:flex w-full h-12 items-center justify-center text-indigo-400 hover:text-indigo-600 transition-colors mb-2">
            <div className="bg-indigo-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-city'}`}></i>
            </div>
          </button>

          <nav className="flex flex-col gap-2">
            {!isLoggedIn && (
              <button
                onClick={() => {
                  onViewChange(AppView.LOGIN);
                  if (window.innerWidth < 768) onToggle();
                }}
                className={`group relative w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
              >
                <i className={`fas fa-sign-in-alt text-lg w-6 text-center shrink-0`}></i>
                <span className={`font-black text-[10px] uppercase tracking-widest truncate transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>Login</span>
              </button>
            )}

            {navItems.map((item) => {
              const locked = isLocked(item);
              return (
                <button
                  key={item.view}
                  title={!isOpen ? item.label : undefined}
                  onClick={() => {
                    if (locked) return;
                    onViewChange(item.view);
                    if (window.innerWidth < 768) onToggle();
                  }}
                  className={`group relative w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-200 ${
                    currentView === item.view 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : locked ? 'text-slate-300 cursor-not-allowed' : 'text-black hover:bg-white/50 hover:text-indigo-600'
                  }`}
                >
                  <i className={`${item.icon} text-lg w-6 text-center shrink-0 ${currentView === item.view ? 'text-white' : 'text-black group-hover:text-indigo-600'}`}></i>
                  <span className={`font-bold text-sm truncate transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'} ${currentView === item.view ? 'text-white' : 'text-slate-800'}`}>{item.label}</span>
                  {locked && isOpen && <i className="fas fa-lock text-[10px] ml-auto text-slate-300"></i>}
                  
                  {!isOpen && (
                    <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-2xl border border-white/10 hidden md:block">
                      {item.label}
                      <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45 border-l border-b border-white/10"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className={`mt-auto md:mt-4 pt-4 border-t border-slate-200 flex flex-col items-center gap-4 transition-all duration-300 ${!isOpen && 'md:opacity-100'}`}>
             <button className={`group relative w-12 h-12 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${userPlan === PlanType.PREMIUM_AI ? 'border-indigo-500 shadow-lg' : 'border-slate-300'}`}>
               <img src={currentUser?.photo || "https://ui-avatars.com/api/?name=V&background=f1f5f9&color=94a3b8"} className="w-full h-full object-cover" alt="Profile" />
             </button>
             {isOpen && (
               <div className="text-center animate-fadeIn px-2">
                 <p className="text-xs font-bold text-slate-900 truncate w-full">{currentUser?.name || 'Visitante'}</p>
                 <p className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${userPlan === PlanType.PREMIUM_AI ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {currentUser?.role?.replace('_', ' ') || 'VISITANTE'}
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
