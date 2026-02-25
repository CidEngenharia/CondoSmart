import React, { useState, useEffect } from 'react';
import { AppView, PlanType, User, UserRole, CondoData, Alert, SubscriptionStatus } from './services/types';
import Sidebar from './src/components/Sidebar';
import Header from './src/components/Header';
import Dashboard from './services/views/Dashboard';
import Services from './services/views/Services';
import Concierge from './services/views/Concierge';
import CreativeStudio from './services/views/CreativeStudio';
import Plans from './src/services/views/Plans';
import About from './services/views/About';
import Residents from './services/views/Residents';
import Vehicles from './services/views/Vehicles';
import Deliveries from './services/views/Deliveries';
import Reservations from './services/views/Reservations';
import Patrimony from './services/views/Patrimony';
import Login from './services/views/Login';
import CreateCondo from './services/views/CreateCondo';
import Billing from './services/views/Billing';
import LandingPage from './services/views/LandingPage';
import { supabase } from './js/supabase';
import ToastProvider from './src/components/ToastProvider';
import toast from 'react-hot-toast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [condoData, setCondoData] = useState<CondoData>({
    name: 'CondoSmarTI',
    cnpj: '',
    adminName: '',
    syndicName: '',
    staff: [],
    subscriptionStatus: SubscriptionStatus.PENDING,
    currentPlan: PlanType.NONE
  });

  const DEMO_EXPIRATION_MINUTES = 30;

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      toast.success('Pagamento processado com sucesso!');
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const fetchFullUserProfile = async (supabaseUser: any) => {
    if (!supabaseUser) return;
    try {
      const { data: profile } = await supabase
        .from('usuarios')
        .select('*, condominios(*)')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      const role = profile?.tipo === 'sindico' ? UserRole.CONDO_ADMIN : UserRole.RESIDENT;
      const condo = profile?.condominios;

      setCurrentUser({
        id: supabaseUser.id,
        name: profile?.nome || supabaseUser.email?.split('@')[0],
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.nome || supabaseUser.email)}&background=6366f1&color=fff`,
        role: role,
        plan: (condo?.plano_ativo as PlanType) || PlanType.NONE,
        condominio_id: profile?.condominio_id
      });

      setIsLoggedIn(true);
      setIsDemoMode(false);

      if (role === UserRole.CONDO_ADMIN && !profile?.condominio_id) {
        setCurrentView(AppView.CREATE_CONDO);
      } else if (condo) {
        setCondoData({
          id: condo.id,
          name: condo.nome,
          cnpj: condo.cnpj || '',
          adminName: '',
          syndicName: profile.nome,
          staff: [],
          subscriptionStatus: (condo.status_assinatura as SubscriptionStatus) || SubscriptionStatus.PENDING,
          currentPlan: (condo.plano_ativo as PlanType) || PlanType.NONE
        });
        setCurrentView(AppView.DASHBOARD);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Verificar expiração de demo
    const demoExpiry = localStorage.getItem('condosmart_demo_expiry');
    if (demoExpiry && Date.now() > parseInt(demoExpiry)) {
      handleLogout();
      alert("Sessão de demonstração expirada. Por favor, entre novamente.");
      return;
    }

    // Tentar restaurar demo do storage se existir
    const demoActive = localStorage.getItem('condosmart_demo_active');
    if (demoActive === 'true' && demoExpiry) {
      handleDemoLogin(UserRole.SUPER_ADMIN, false); // false para não resetar o timer
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchFullUserProfile(session.user);
      } else if (event === 'SIGNED_OUT' || !demoActive) {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Timer de verificação de expiração periódica
  useEffect(() => {
    if (isDemoMode) {
      const interval = setInterval(() => {
        const expiry = localStorage.getItem('condosmart_demo_expiry');
        if (expiry && Date.now() > parseInt(expiry)) {
          handleLogout();
          alert("Sua sessão de demonstração expirou.");
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isDemoMode]);

  const handleDemoLogin = (role: UserRole, resetTimer: boolean = true) => {
    setCurrentUser({
      name: 'Admin Demonstração',
      photo: `https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff`,
      role: role,
      plan: PlanType.PREMIUM_AI
    });
    setCondoData({
      name: 'Condomínio de Demonstração',
      cnpj: '00.000.000/0001-99',
      adminName: 'Cid Engenharia',
      syndicName: 'Admin Demo',
      staff: [
        { id: '1', name: 'Zelador Exemplo', phone: '5571999999999', email: 'zelador@demo.com', role: 'Zelador' }
      ],
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      currentPlan: PlanType.PREMIUM_AI
    });

    if (resetTimer) {
      const expiry = Date.now() + (DEMO_EXPIRATION_MINUTES * 60 * 1000);
      localStorage.setItem('condosmart_demo_expiry', expiry.toString());
      localStorage.setItem('condosmart_demo_active', 'true');
    }

    setIsDemoMode(true);
    setIsLoggedIn(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    if (!isDemoMode) await supabase.auth.signOut();
    localStorage.removeItem('condosmart_demo_expiry');
    localStorage.removeItem('condosmart_demo_active');
    setIsDemoMode(false);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsDemoMode(false);
    setCurrentView(AppView.LANDING);
    toast.success('Sessão encerrada.');
  };

  const handleBackToServices = () => setCurrentView(AppView.SERVICES);

  if (currentView === AppView.LOGIN) {
    return <Login onDemoLogin={handleDemoLogin} onBackToHome={() => setCurrentView(AppView.LANDING)} />;
  }

  const isBillingRestricted = isLoggedIn &&
    !isDemoMode &&
    currentUser?.role === UserRole.CONDO_ADMIN &&
    condoData.subscriptionStatus !== SubscriptionStatus.ACTIVE &&
    condoData.subscriptionStatus !== SubscriptionStatus.TRIAL &&
    currentView !== AppView.CREATE_CONDO;
  return (
    <div className="relative h-screen bg-[#F8FAFC] overflow-hidden flex flex-col font-sans">
      <ToastProvider />
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
          isDemoMode={isDemoMode}
        />

        {isDemoMode && (
          <div className="bg-indigo-600 text-white px-6 py-2 flex items-center justify-center gap-3 animate-pulse">
            <i className="fas fa-clock"></i>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sessão de Demonstração Ativa - Expira em breve</span>
          </div>
        )}

        {isBillingRestricted && currentView !== AppView.PLANS && currentView !== AppView.BILLING && (
          <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-center gap-3 animate-slideDown">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Sua assinatura está pendente. Regularize para liberar todos os recursos.</span>
            <button onClick={() => setCurrentView(AppView.PLANS)} className="bg-white text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all">Ver Planos</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className={`${currentView === AppView.LANDING ? '' : 'max-w-7xl mx-auto p-4 md:p-8'} h-full pb-24 md:pb-8`}>
            {currentView === AppView.LANDING && (
              <LandingPage
                onStart={() => setCurrentView(AppView.PLANS)}
                onLogin={() => setCurrentView(AppView.LOGIN)}
              />
            )}

            {currentView === AppView.PLANS && (
              <Plans
                onSelectPlan={() => setCurrentView(AppView.LOGIN)}
                currentPlan={condoData.currentPlan || PlanType.NONE}
                isLoggedIn={isLoggedIn}
                isCondoAdmin={currentUser?.role === UserRole.CONDO_ADMIN || isDemoMode}
              />
            )}

            {isLoggedIn ? (
              <>
                {currentView === AppView.DASHBOARD && (
                  <Dashboard
                    setView={setCurrentView}
                    isLoggedIn={isLoggedIn}
                    onLogin={() => { }}
                    condoName={condoData.name}
                    alerts={alerts}
                    isBillingActive={condoData.subscriptionStatus === SubscriptionStatus.ACTIVE || condoData.subscriptionStatus === SubscriptionStatus.TRIAL}
                  />
                )}
                {currentView === AppView.SERVICES && <Services user={currentUser} condoData={condoData} setView={setCurrentView} />}
                {currentView === AppView.RESIDENTS && <Residents currentUser={currentUser} onBack={handleBackToServices} />}
                {currentView === AppView.VEHICLES && <Vehicles currentUser={currentUser} onBack={handleBackToServices} />}
                {currentView === AppView.DELIVERIES && <Deliveries currentUser={currentUser} onBack={handleBackToServices} />}
                {currentView === AppView.RESERVATIONS && <Reservations currentUser={currentUser} onBack={handleBackToServices} />}
                {currentView === AppView.PATRIMONY && <Patrimony condoData={condoData} setCondoData={setCondoData} isAdmin={currentUser?.role !== UserRole.RESIDENT} onBack={handleBackToServices} />}
                {currentView === AppView.CONCIERGE && <Concierge onBack={handleBackToServices} />}
                {currentView === AppView.CREATIVE && <CreativeStudio onAddAlert={(a: any) => setAlerts(p => [a, ...p])} onBack={handleBackToServices} />}
                {currentView === AppView.CREATE_CONDO && <CreateCondo onSuccess={() => fetchFullUserProfile(currentUser)} onBack={() => setCurrentView(AppView.DASHBOARD)} />}
                {currentView === AppView.BILLING && <Billing condoData={condoData} onManagePlan={() => setCurrentView(AppView.PLANS)} onBack={handleBackToServices} />}
                {currentView === AppView.ABOUT && <About onBack={handleBackToServices} />}
              </>
            ) : (
              (currentView !== AppView.LANDING && currentView !== AppView.PLANS && currentView !== AppView.ABOUT) && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl">
                    <i className="fas fa-lock"></i>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Acesso Restrito</h2>
                  <button onClick={() => setCurrentView(AppView.LOGIN)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Entrar agora</button>
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