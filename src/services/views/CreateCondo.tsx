import React, { useState } from 'react';
import { supabase } from '../../js/supabase';

interface CreateCondoProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CreateCondo: React.FC<CreateCondoProps> = ({ onSuccess, onBack }) => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !endereco.trim()) {
      alert("Por favor, preencha o Nome e o Endereço para continuar.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
      }

      // Criação com status TRIAL para evitar bloqueio imediato
      const { data: condo, error: condoError } = await supabase
        .from("condominios")
        .insert([{
          nome: nome.trim(),
          endereco: endereco.trim(),
          sindico_id: user.id,
          status_assinatura: 'trial',
          plano_ativo: 'Essencial'
        }])
        .select()
        .single();

      if (condoError) throw condoError;

      const { error: userUpdateError } = await supabase
        .from("usuarios")
        .update({
          condominio_id: condo.id,
          tipo: "sindico" 
        })
        .eq("id", user.id);

      if (userUpdateError) throw userUpdateError;

      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert("Houve um problema na configuração: " + (error.message || "Verifique sua conexão."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full animate-fadeIn">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-200 relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-8 shadow-xl shadow-indigo-100">
                <i className="fas fa-rocket"></i>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">Configuração Inicial</h2>
              <p className="text-sm text-slate-500 font-medium">Cadastre seu condomínio para liberar o período de teste grátis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Nome do Condomínio</label>
                <input 
                  required 
                  type="text" 
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Edifício Green Park"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 text-slate-900 font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Endereço Completo</label>
                <input 
                  required 
                  type="text" 
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 text-slate-900 font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder-slate-300"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
              >
                {loading ? <i className="fas fa-circle-notch animate-spin text-lg"></i> : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Finalizar e Iniciar Teste
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCondo;