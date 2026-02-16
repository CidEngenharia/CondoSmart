"use client";

import React from 'react';
import { AppView, PlanType, User, UserRole } from '@/services/types';
import { X, LayoutDashboard, Briefcase, Users, Building2, ShieldCheck, CreditCard, Info, LogIn } from 'lucide-react';

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
    { view: AppView.DASHBOARD, label: 'Painel', icon: LayoutDashboard, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.SERVICES, label: 'Central', icon: Briefcase, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.RESIDENTS, label: 'Moradores', icon: Users, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.PATRIMONY, label: 'Patrimônio', icon: Building2, roles: [UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.CONCIERGE, label: 'Portaria IA', icon: ShieldCheck, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.BILLING, label: 'Faturamento', icon: CreditCard, roles: [UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN] },
    { view: AppView.ABOUT, label: 'Sobre', icon: Info, roles: [UserRole.RESIDENT, UserRole.CONDO_ADMIN, UserRole.SUPER_ADMIN], public: true },
  ];

  const userRole = currentUser?.role || UserRole.RESIDENT;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full bg-white w-72 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Building2 size={20} />
              </div>
              <span className="font-black text-xl tracking-tighter">CondoSmarTI</span>
            </div>
            <button onClick={onToggle} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {!isLoggedIn && (
              <button
                onClick={() => { onViewChange(AppView.LOGIN); onToggle(); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
              >
                <LogIn size={20} />
                <span>Entrar</span>
              </button>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isAllowed = item.public || (isLoggedIn && item.roles.includes(userRole));
              
              if (!isAllowed) return null;

              return (
                <button
                  key={item.view}
                  onClick={() => { onViewChange(item.view); onToggle(); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                    currentView === item.view 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {isLoggedIn && (
            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
              <img 
                src={currentUser?.photo || "https://ui-avatars.com/api/?name=User"} 
                className="w-12 h-12 rounded-full border-2 border-indigo-100" 
                alt="Profile" 
              />
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{currentUser?.name}</p>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{currentUser?.plan}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;