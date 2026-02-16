"use client";

import React from 'react';
import { AppView, User } from '@/services/types';
import { Menu, LogOut } from 'lucide-react';

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

const Header: React.FC<HeaderProps> = ({ currentView, isLoggedIn, onLogin, onLogout, onMenuToggle, currentUser, condoName, isDemoMode }) => {
  const getTitle = () => {
    switch (currentView) {
      case AppView.LANDING: return 'Apresentação';
      case AppView.DASHBOARD: return 'Painel';
      case AppView.SERVICES: return 'Central';
      case AppView.CONCIERGE: return 'Portaria IA';
      case AppView.PLANS: return 'Planos';
      case AppView.RESIDENTS: return 'Moradores';
      case AppView.PATRIMONY: return 'Patrimônio';
      case AppView.BILLING: return 'Faturamento';
      default: return 'CondoSmarTI';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle} 
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <img src="/logo-icon.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
          <h1 className="font-black text-xl tracking-tighter">CondoSmarTI</h1>
        </div>
      </div>
      
      <div className="text-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block leading-none mb-1">
          {isDemoMode ? 'Modo Demonstração' : (condoName || 'CondoSmarTI')}
        </span>
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{getTitle()}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <button 
            onClick={onLogin} 
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
               <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
               <p className="text-[9px] font-black uppercase text-indigo-600">{currentUser?.plan}</p>
            </div>
            <img src={currentUser?.photo} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="Profile" />
            <button 
              onClick={onLogout} 
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;