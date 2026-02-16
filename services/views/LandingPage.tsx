"use client";

import React from 'react';
import { AppView } from '../types';
import { Shield, Zap, Users, BarChart3, MessageSquare, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest animate-fadeIn">
              <Zap size={14} /> A Revolução na Gestão Condominial
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 animate-slideUp">
              O Futuro do seu Condomínio é <span className="text-indigo-600 italic">Inteligente.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed animate-slideUp [animation-delay:200ms]">
              Simplifique a rotina, aumente a segurança e transforme a convivência com a primeira plataforma de gestão movida por Inteligência Artificial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slideUp [animation-delay:400ms]">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Começar Agora <ArrowRight size={16} />
              </button>
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
              >
                Acessar Portal
              </button>
            </div>
          </div>

          {/* Mockup Preview */}
          <div className="mt-20 relative animate-fadeIn [animation-delay:600ms]">
            <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] border border-slate-800">
              <div className="bg-slate-800 rounded-[1.8rem] overflow-hidden aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200" 
                  alt="Dashboard Preview" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 text-center space-y-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto shadow-xl">
                      <Shield size={32} />
                    </div>
                    <p className="text-white font-black uppercase tracking-widest text-sm">Interface de Alta Performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Tudo o que você precisa em um só lugar</h2>
            <p className="text-slate-500 font-medium">Recursos avançados para síndicos, administradores e moradores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="text-indigo-600" />}
              title="Portaria IA 24h"
              desc="Atendimento inteligente por voz e chat para visitantes e moradores, integrado ao Google Gemini."
            />
            <FeatureCard 
              icon={<Smartphone className="text-indigo-600" />}
              title="App do Morador"
              desc="Reservas, comunicados, boletos e encomendas na palma da mão com interface intuitiva."
            />
            <FeatureCard 
              icon={<Shield className="text-indigo-600" />}
              title="Segurança Avançada"
              desc="Controle de acesso por QR Code, biometria facial e registro completo de veículos."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-indigo-600" />}
              title="Gestão Financeira"
              desc="Emissão de boletos, controle de inadimplência e relatórios detalhados em tempo real."
            />
            <FeatureCard 
              icon={<Users className="text-indigo-600" />}
              title="Assembleia Virtual"
              desc="Realize votações e assembleias de forma digital com validade jurídica e transparência."
            />
            <FeatureCard 
              icon={<Zap className="text-indigo-600" />}
              title="Estúdio Criativo"
              desc="Gere comunicados e artes profissionais para o condomínio usando nossa IA generativa."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem value="+500" label="Condomínios" />
            <StatItem value="+50k" label="Moradores" />
            <StatItem value="99.9%" label="Uptime" />
            <StatItem value="24/7" label="Suporte IA" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white text-center space-y-10 relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight relative z-10">
              Pronto para transformar seu condomínio?
            </h2>
            
            <p className="text-indigo-100 text-lg font-medium max-w-2xl mx-auto relative z-10">
              Junte-se a centenas de condomínios que já utilizam o CondoSmarTI para uma gestão mais eficiente e segura.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                Experimentar Grátis
              </button>
              <div className="flex items-center gap-2 text-indigo-100 text-sm font-bold">
                <CheckCircle2 size={18} /> Sem cartão de crédito
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.jpg" alt="Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-black text-lg tracking-tighter">CondoSmarTI</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2024 CondoSmarTI - Desenvolvido por CidEngenharia
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fab fa-instagram text-xl"></i></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fab fa-linkedin text-xl"></i></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fab fa-whatsapp text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

const StatItem: React.FC<{ value: string, label: string }> = ({ value, label }) => (
  <div className="space-y-2">
    <p className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tighter">{value}</p>
    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{label}</p>
  </div>
);

export default LandingPage;