
import React from 'react';
import { AppView, PlanType, User } from '../services/types';

interface HeaderProps {
  currentView: AppView;
  onMenuToggle: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  currentUser: User | null;
  condoName?: string;
  condoLogo?: string;
  isDemoMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, isLoggedIn, onLogin, onLogout, onMenuToggle, currentUser, condoName, condoLogo, isDemoMode }) => {
  const getTitle = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return 'Painel';
      case AppView.SERVICES: return 'Central de Serviços';
      case AppView.CONCIERGE: return 'Portaria Digital';
      case AppView.CREATIVE: return 'Gerador Inteligente';
      case AppView.PLANS: return 'Planos';
      case AppView.ABOUT: return 'Sobre';
      case AppView.RESIDENTS: return 'Moradores';
      case AppView.PATRIMONY: return 'Patrimônio';
      default: return 'CondoSmart';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 md:px-12 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex-1 flex items-center">
        <button onClick={onMenuToggle} className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <i className="fas fa-city text-indigo-600 text-xl"></i>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tighter">
            CondoSmart AI
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {isDemoMode ? (
            <span className="text-[9px] font-black bg-rose-600 text-white px-2 py-0.5 rounded uppercase tracking-[0.2em] animate-pulse shadow-sm">
              MODO DEMONSTRAÇÃO
            </span>
          ) : (
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-fadeIn">
              {condoName || 'Defina o nome no Patrimônio'}
            </span>
          )}
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{getTitle()}</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-end gap-4">
        {!isLoggedIn ? (
          <button onClick={onLogin} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-xs font-bold text-gray-900">{currentUser?.name}</span>
               <span className="text-[9px] font-black uppercase text-indigo-600">{currentUser?.plan}</span>
            </div>
            <div className="relative">
              <img src={currentUser?.photo} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="Profile" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <button onClick={onLogout} title="Sair da sessão" className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
