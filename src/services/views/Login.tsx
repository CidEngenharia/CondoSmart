import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../js/supabase';
import { UserRole } from '../types';
import toast from 'react-hot-toast';

interface LoginProps {
  onDemoLogin: (role: UserRole) => void;
  onBackToHome: () => void;
}

const Login: React.FC<LoginProps> = ({ onDemoLogin, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('sindico');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (email.toLowerCase() === 'admin' && password === 'admin') {
      setLoading(true);
      setTimeout(() => {
        onDemoLogin(UserRole.SUPER_ADMIN);
        setLoading(false);
      }, 800);
      return;
    }

    if (!isSupabaseConfigured()) {
      toast.error("Configuração do Supabase ausente.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: password.trim() 
      });

      if (error) throw error;
      toast.success(`Bem-vindo de volta, ${data.user?.email?.split('@')[0]}!`);
    } catch (err: any) {
      toast.error("Erro ao entrar: " + (err.message || "Verifique suas credenciais."));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password: password.trim(),
        options: {
          data: {
            full_name: name.trim(),
            role: role
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("already registered") || signUpError.status === 400) {
          toast.error("Este e-mail já está cadastrado.");
          setIsRegistering(false);
          return;
        }
        throw signUpError;
      }

      if (data.user) {
        await supabase.from("usuarios").upsert({ 
          id: data.user.id, 
          nome: name.trim(), 
          tipo: role 
        });

        const userTypeLabel = role === 'sindico' ? 'Administrador' : 'Morador';
        toast.success(`Parabéns usuário: ${userTypeLabel} cadastrado com sucesso!`, {
          duration: 6000,
          icon: '🎉'
        });

        if (!data.session) {
          toast.success("Verifique seu e-mail para confirmar a conta.");
          setIsRegistering(false);
        }
      }
    } catch (err: any) {
      toast.error("Erro ao cadastrar: " + (err.message || "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-fadeIn">
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 mb-4">
            <i className="fas fa-city text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">CondoSmart <span className="text-indigo-600">AI</span></h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 p-8 md:p-10">
          
          <button 
            onClick={onBackToHome}
            className="text-slate-400 hover:text-indigo-600 mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Voltar
          </button>

          <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">
            {isRegistering ? 'Novo Cadastro' : 'Acessar Conta'}
          </h2>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
            {isRegistering && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all placeholder-slate-400"
                  placeholder="Nome completo"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isRegistering ? 'E-mail' : 'Usuário ou E-mail'}</label>
              <input 
                required
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all placeholder-slate-400"
                placeholder={isRegistering ? "exemplo@email.com" : "admin"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            {isRegistering && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Acesso</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="sindico">Síndico / Admin</option>
                  <option value="morador">Morador</option>
                </select>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-600 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? <i className="fas fa-circle-notch animate-spin text-lg"></i> : (
                <>
                  <i className={`fas ${isRegistering ? 'fa-user-plus' : 'fa-sign-in-alt'}`}></i>
                  {isRegistering ? 'Criar Cadastro' : 'Entrar no Portal'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              {isRegistering ? 'Já possui conta? Entrar' : 'Não tem conta? Cadastrar-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;