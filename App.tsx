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
import { supabase } from './js/supabase';
import ToastProvider from './src/components/ToastProvider';
import toast from 'react-hot-toast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PLANS);
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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      toast.success('Pagamento processado com sucesso!');
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleDemoLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setIsDemoMode(true);
    const demoUser: User = {
      id: 'demo-admin',
      name: 'Administrador Demo',
      photo: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
      role: role,
      plan: PlanType.PREMIUM_AI
    };
    setCurrentUser(demoUser);
    setCondoData({
      name: 'Condomínio Demo',
      cnpj: '00.000.000/0001-00',
      adminName: 'Gestão Demo',
      syndicName: 'Admin Demo',
      staff: [],
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      currentPlan: PlanType.PREMIUM_AI
    });
    setCurrentView(AppView.DASHBOARD);
    toast.success('Entrou como Administrador de Teste');
  };

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchFullUserProfile(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) fetchFullUserProfile(session.user);
      else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!isDemoMode) await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsDemoMode(false);
    setCurrentView(AppView.PLANS);
    toast.success('Sessão encerrada.');
  };

  const handleBackToServices = () => setCurrentView(AppView.SERVICES);

  if (currentView === AppView.LOGIN) {
    return <Login onDemoLogin={handleDemoLogin} onBackToHome={() => setCurrentView(AppView.PLANS)} />;
  }

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
          isDemoMode={isDemoMode}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full pb-24 md:pb-8">
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
                    onLogin={() => {}} 
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
              (currentView !== AppView.PLANS && currentView !== AppView.ABOUT) && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
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