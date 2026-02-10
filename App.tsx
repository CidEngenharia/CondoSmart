
import React, { useState, useEffect } from 'react';
import { AppView, PlanType, User, UserRole, CondoData, Alert, SubscriptionStatus } from './services/types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './services/views/Dashboard';
import Services from './services/views/Services';
import Concierge from './services/views/Concierge';
import CreativeStudio from './services/views/CreativeStudio';
import Plans from './services/views/Plans';
import About from './services/views/About';
import Residents from './services/views/Residents';
import Vehicles from './services/views/Vehicles';
import Deliveries from './services/views/Deliveries';
import Reservations from './services/views/Reservations';
import Patrimony from './services/views/Patrimony';
import Login from './services/views/Login';
import CreateCondo from './services/views/CreateCondo';
import Billing from './services/views/Billing';
import { supabase } from './js/supabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PLANS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [condoData, setCondoData] = useState<CondoData>({
    name: 'CondoSmart',
    cnpj: '',
    adminName: '',
    syndicName: '',
    staff: [],
    subscriptionStatus: SubscriptionStatus.PENDING,
    currentPlan: PlanType.NONE
  });

  const fetchFullUserProfile = async (supabaseUser: any) => {
    if (!supabaseUser) return;

    try {
      const { data: profile, error } = await supabase
        .from('usuarios')
        .select('*, condominios(*)')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) console.warn("Erro ao buscar perfil:", error.message);

      let finalProfile = profile;
      if (!profile) {
        const defaultName = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário';
        const { data: newProfile } = await supabase
          .from('usuarios')
          .insert({ id: supabaseUser.id, nome: defaultName, tipo: 'sindico' })
          .select().single();
        finalProfile = newProfile;
      }

      const role = finalProfile?.tipo === 'sindico' ? UserRole.CONDO_ADMIN : UserRole.RESIDENT;
      const condo = finalProfile?.condominios;
      
      setCurrentUser({
        id: supabaseUser.id,
        name: finalProfile?.nome || supabaseUser.email?.split('@')[0],
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalProfile?.nome || supabaseUser.email)}&background=6366f1&color=fff`,
        role: role,
        plan: (condo?.plano_ativo as PlanType) || PlanType.NONE,
        condominio_id: finalProfile?.condominio_id
      });

      setIsLoggedIn(true);

      if (role === UserRole.CONDO_ADMIN && !finalProfile?.condominio_id) {
        setCurrentView(AppView.CREATE_CONDO);
      } else if (condo) {
        setCondoData({
          id: condo.id,
          name: condo.nome,
          cnpj: condo.cnpj || '',
          adminName: '',
          syndicName: finalProfile.nome,
          staff: [],
          subscriptionStatus: (condo.status_assinatura as SubscriptionStatus) || SubscriptionStatus.PENDING,
          currentPlan: (condo.plano_ativo as PlanType) || PlanType.NONE
        });

        const isInactive = condo.status_assinatura !== 'active' && condo.status_assinatura !== 'trial';
        if (role === UserRole.CONDO_ADMIN && isInactive && currentView !== AppView.CREATE_CONDO && currentView !== AppView.BILLING) {
           setCurrentView(AppView.PLANS);
        } else if (currentView === AppView.LOGIN || currentView === AppView.PLANS || currentView === AppView.CREATE_CONDO) {
           setCurrentView(AppView.DASHBOARD);
        }
      } else {
        if (currentView === AppView.LOGIN || currentView === AppView.PLANS) {
          setCurrentView(AppView.DASHBOARD);
        }
      }
    } catch (err) {
      console.error("Erro no fluxo de autenticação:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchFullUserProfile(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchFullUserProfile(session.user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCondoData({ name: 'CondoSmart', cnpj: '', adminName: '', syndicName: '', staff: [], subscriptionStatus: SubscriptionStatus.PENDING, currentPlan: PlanType.NONE });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDemoLogin = (role: UserRole) => {
    setCurrentUser({
      name: 'Usuário Demo',
      photo: `https://ui-avatars.com/api/?name=Demo&background=6366f1&color=fff`,
      role: role,
      plan: PlanType.PREMIUM_AI
    });
    setCondoData(prev => ({ ...prev, name: 'Condomínio Demonstrativo', subscriptionStatus: SubscriptionStatus.ACTIVE, currentPlan: PlanType.PREMIUM_AI }));
    setIsLoggedIn(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView(AppView.PLANS);
  };

  const handleCondoCreated = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await fetchFullUserProfile(session.user);
  };

  if (currentView === AppView.LOGIN) {
    return <Login onDemoLogin={handleDemoLogin} onBackToHome={() => setCurrentView(AppView.PLANS)} />;
  }

  const isBillingRestricted = isLoggedIn && 
                              currentUser?.role === UserRole.CONDO_ADMIN && 
                              condoData.subscriptionStatus !== SubscriptionStatus.ACTIVE &&
                              condoData.subscriptionStatus !== SubscriptionStatus.TRIAL &&
                              currentView !== AppView.CREATE_CONDO;

  return (
    <div className="relative h-screen bg-[#F8FAFC] overflow-hidden flex flex-col font-sans animate-fadeIn">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          currentView={currentView} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isLoggedIn={isLoggedIn}
          onLogin={() => setCurrentView(AppView.LOGIN)}
          onLogout={handleLogout}
          currentUser={currentUser}
          condoName={condoData.name}
          condoLogo={condoData.logoUrl}
        />
        
        {isBillingRestricted && currentView !== AppView.PLANS && currentView !== AppView.BILLING && (
          <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-center gap-3 animate-slideDown">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Sua assinatura está pendente. Regularize para liberar todos os recursos.</span>
            <button onClick={() => setCurrentView(AppView.PLANS)} className="bg-white text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all">Ver Planos</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full pb-24 md:pb-8">
            {currentView === AppView.PLANS && (
              <Plans 
                onSelectPlan={() => setCurrentView(AppView.LOGIN)} 
                currentPlan={condoData.currentPlan || PlanType.NONE} 
                isLoggedIn={isLoggedIn}
                isCondoAdmin={currentUser?.role === UserRole.CONDO_ADMIN}
              />
            )}

            {currentView === AppView.ABOUT && <About />}

            {isLoggedIn ? (
              <>
                {currentView === AppView.DASHBOARD && (
                  <Dashboard 
                    setView={setCurrentView} 
                    isLoggedIn={isLoggedIn} 
                    onLogin={() => {}} 
                    condoName={condoData.name}
                    condoLogo={condoData.logoUrl}
                    alerts={alerts}
                    isBillingActive={condoData.subscriptionStatus === SubscriptionStatus.ACTIVE || condoData.subscriptionStatus === SubscriptionStatus.TRIAL}
                  />
                )}
                {currentView === AppView.SERVICES && <Services user={currentUser} condoData={condoData} setView={setCurrentView} />}
                {currentView === AppView.RESIDENTS && <Residents currentUser={currentUser} />}
                {currentView === AppView.VEHICLES && <Vehicles currentUser={currentUser} />}
                {currentView === AppView.DELIVERIES && <Deliveries currentUser={currentUser} />}
                {currentView === AppView.RESERVATIONS && <Reservations currentUser={currentUser} />}
                {currentView === AppView.PATRIMONY && <Patrimony condoData={condoData} setCondoData={setCondoData} isAdmin={currentUser?.role !== UserRole.RESIDENT} />}
                {currentView === AppView.CONCIERGE && <Concierge />}
                {currentView === AppView.CREATIVE && <CreativeStudio onAddAlert={(a: any) => setAlerts(p => [a, ...p])} />}
                {currentView === AppView.CREATE_CONDO && <CreateCondo onSuccess={handleCondoCreated} onBack={() => setCurrentView(AppView.DASHBOARD)} />}
                {currentView === AppView.BILLING && <Billing condoData={condoData} onManagePlan={() => setCurrentView(AppView.PLANS)} />}
              </>
            ) : (
              (currentView !== AppView.PLANS && currentView !== AppView.ABOUT) && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                   <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl">
                      <i className="fas fa-lock"></i>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase">Acesso Restrito</h2>
                      <p className="text-slate-500 max-w-xs mx-auto mt-2">Conecte-se para gerenciar sua unidade ou condomínio.</p>
                   </div>
                   <button onClick={() => setCurrentView(AppView.LOGIN)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100">Entrar agora</button>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
