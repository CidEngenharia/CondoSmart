import React, { useState } from 'react';
import { CondoData } from '../types';
import { ArrowLeft } from 'lucide-react';

interface PatrimonyProps {
  condoData: CondoData;
  setCondoData: (data: CondoData) => void;
  isAdmin: boolean;
  onBack?: () => void;
}

const Patrimony: React.FC<PatrimonyProps> = ({ condoData, setCondoData, isAdmin, onBack }) => {
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    phone: '',
    email: ''
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCondoData({ ...condoData, logoUrl: url });
    }
  };

  const openAddStaff = () => {
    setEditingStaffId(null);
    setStaffForm({ name: '', role: '', phone: '', email: '' });
    setIsStaffModalOpen(true);
  };

  const openEditStaff = (staff: any) => {
    setEditingStaffId(staff.id);
    setStaffForm({ ...staff });
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaffId) {
      setCondoData({
        ...condoData,
        staff: condoData.staff.map(s => s.id === editingStaffId ? { ...s, ...staffForm } : s)
      });
    } else {
      setCondoData({
        ...condoData,
        staff: [...condoData.staff, { id: Date.now().toString(), ...staffForm }]
      });
    }
    setIsStaffModalOpen(false);
  };

  const deleteStaff = (id: string) => {
    if (window.confirm("Deseja remover este funcionário?")) {
      setCondoData({
        ...condoData,
        staff: condoData.staff.filter(s => s.id !== id)
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn py-6 pb-20">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <ArrowLeft size={14} /> Voltar para Central
        </button>
      )}

      {/* Header & General Data */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-[80px] opacity-60"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
          {/* Logo Section */}
          <div className="shrink-0 flex flex-col items-center gap-4">
             <div className="w-40 h-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                {condoData.logoUrl ? (
                  <img src={condoData.logoUrl} className="w-full h-full object-contain p-4" alt="Condo Logo" />
                ) : (
                  <i className="fas fa-building text-4xl text-slate-200"></i>
                )}
                {isAdmin && (
                  <label className="absolute inset-0 bg-indigo-600/80 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                     <i className="fas fa-camera text-white text-xl"></i>
                     <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                  </label>
                )}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo do Condomínio</p>
          </div>

          {/* Fields Section */}
          <div className="flex-1 w-full space-y-8">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Dados Identitários</h2>
                <p className="text-sm text-slate-500 font-medium italic mt-2">Identificação oficial e administração.</p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => setEditingGeneral(!editingGeneral)} 
                  className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${editingGeneral ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {editingGeneral ? 'Salvar Alterações' : 'Editar Dados'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PatrimonyInput 
                label="Nome do Condomínio" 
                value={condoData.name} 
                onChange={v => setCondoData({...condoData, name: v})} 
                editable={editingGeneral} 
                placeholder="Ex: Vivendas dos Pássaros" 
              />
              <PatrimonyInput 
                label="CNPJ" 
                value={condoData.cnpj} 
                onChange={v => setCondoData({...condoData, cnpj: v})} 
                editable={editingGeneral} 
                placeholder="00.000.000/0001-00" 
              />
              <PatrimonyInput 
                label="Nome do Administrador" 
                value={condoData.adminName} 
                onChange={v => setCondoData({...condoData, adminName: v})} 
                editable={editingGeneral} 
                placeholder="Nome da Administradora" 
              />
              <PatrimonyInput 
                label="Nome do Síndico" 
                value={condoData.syndicName} 
                onChange={v => setCondoData({...condoData, syndicName: v})} 
                editable={editingGeneral} 
                placeholder="Síndico Atual" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Section */}
      <div className="space-y-6">
         <div className="flex justify-between items-center px-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Funcionários & Equipe</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Controle de acesso operacional.</p>
            </div>
            {isAdmin && (
              <button 
                onClick={openAddStaff} 
                className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 active:scale-95 transition-all"
              >
                <i className="fas fa-user-plus mr-2"></i> Adicionar Funcionário
              </button>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {condoData.staff.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum funcionário cadastrado.</p>
              </div>
            ) : (
              condoData.staff.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                         <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openEditStaff(s)} className="w-8 h-8 rounded-lg bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                            <i className="fas fa-pencil-alt text-xs"></i>
                         </button>
                         <button onClick={() => deleteStaff(s.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                            <i className="fas fa-trash-alt text-xs"></i>
                         </button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tighter uppercase">{s.name}</h4>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{s.role}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-50">
                         <div className="flex items-center gap-3 text-slate-500">
                            <i className="fas fa-phone text-[10px]"></i>
                            <span className="text-xs font-bold">{s.phone}</span>
                         </div>
                         <div className="flex items-center gap-3 text-slate-500">
                            <i className="fas fa-envelope text-[10px]"></i>
                            <span className="text-xs font-bold truncate">{s.email}</span>
                         </div>
                      </div>

                      <a 
                        href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} 
                        target="_blank"
                        className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <i className="fab fa-whatsapp"></i> Chamar no WhatsApp
                      </a>
                   </div>
                </div>
              ))
            )}
         </div>
      </div>

      {/* Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {editingStaffId ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-6">
              <PatrimonyInput 
                label="Nome Completo" 
                value={staffForm.name} 
                onChange={v => setStaffForm({...staffForm, name: v})} 
                editable={true} 
                placeholder="Ex: João Silva" 
              />
              <PatrimonyInput 
                label="Função / Cargo" 
                value={staffForm.role} 
                onChange={v => setStaffForm({...staffForm, role: v})} 
                editable={true} 
                placeholder="Ex: Zelador, Porteiro, etc." 
              />
              <div className="grid grid-cols-2 gap-4">
                <PatrimonyInput 
                  label="Telefone / WhatsApp" 
                  value={staffForm.phone} 
                  onChange={v => setStaffForm({...staffForm, phone: v})} 
                  editable={true} 
                  placeholder="55719..." 
                />
                <PatrimonyInput 
                  label="E-mail" 
                  value={staffForm.email} 
                  onChange={v => setStaffForm({...staffForm, email: v})} 
                  editable={true} 
                  placeholder="email@condo.com" 
                />
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
                {editingStaffId ? 'Salvar Alterações' : 'Concluir Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PatrimonyInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, editable: boolean, placeholder?: string }> = ({ label, value, onChange, editable, placeholder }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    {editable ? (
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all" 
      />
    ) : (
      <div className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-black text-slate-900 tracking-tight">
        {value || 'Não preenchido'}
      </div>
    )}
  </div>
);

export default Patrimony;