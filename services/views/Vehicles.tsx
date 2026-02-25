import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ArrowLeft } from 'lucide-react';

interface VehicleData {
  id: string;
  residentName: string;
  model: string;
  plate: string;
  observations: string;
  type: 'Carro' | 'Moto' | 'Outro';
}

const INITIAL_VEHICLES: VehicleData[] = [
  { id: '1', residentName: 'João Silva', model: 'Toyota Corolla - Prata', plate: 'ABC-1234', observations: 'Vaga 101-A. Possui adesivo de acesso.', type: 'Carro' },
  { id: '2', residentName: 'Pedro Santos', model: 'Honda Civic - Preto', plate: 'XYZ-9876', observations: 'Vaga 42 (Subsolo 1).', type: 'Carro' },
  { id: '3', residentName: 'Maria Oliveira', model: 'Honda Biz - Vermelha', plate: 'KJH-5544', observations: 'Área de motos bloco B.', type: 'Moto' },
];

interface VehiclesProps {
  currentUser: User | null;
  onBack?: () => void;
}

const Vehicles: React.FC<VehiclesProps> = ({ currentUser, onBack }) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>(INITIAL_VEHICLES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formVehicle, setFormVehicle] = useState<VehicleData>({
    id: '',
    residentName: '',
    model: '',
    plate: '',
    observations: '',
    type: 'Carro'
  });

  const filtered = vehicles.filter(v => 
    v.residentName.toLowerCase().includes(search.toLowerCase()) || 
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormVehicle({ id: '', residentName: '', model: '', plate: '', observations: '', type: 'Carro' });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: VehicleData) => {
    setEditingId(vehicle.id);
    setFormVehicle({ ...vehicle });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVehicle.residentName || !formVehicle.model || !formVehicle.plate) {
      alert("Preencha Proprietário, Modelo e Placa.");
      return;
    }

    if (editingId) {
      setVehicles(prev => prev.map(v => v.id === editingId ? { ...formVehicle } : v));
      alert("Veículo atualizado!");
    } else {
      setVehicles([{ ...formVehicle, id: Date.now().toString() }, ...vehicles]);
      alert("Veículo cadastrado!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remover este veículo?")) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const isAdmin = currentUser?.role !== UserRole.RESIDENT;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <ArrowLeft size={14} /> Voltar para Central
        </button>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gestão de Veículos</h2>
          <p className="text-sm text-slate-500 font-medium italic mt-2">Controle da frota interna do condomínio.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-80 group">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Buscar por placa ou morador..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm transition-all"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={openAddModal}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> Novo Veículo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors"></div>
            
            {isAdmin && (
              <div className="absolute top-6 right-6 flex gap-2 z-10">
                <button onClick={() => openEditModal(v)} className="w-9 h-9 bg-white text-slate-600 rounded-xl shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                  <i className="fas fa-edit text-xs"></i>
                </button>
                <button onClick={() => handleDelete(v.id)} className="w-9 h-9 bg-white text-red-500 rounded-xl shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            )}

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${v.type === 'Moto' ? 'bg-amber-500' : 'bg-slate-800'}`}>
                   <i className={`fas ${v.type === 'Moto' ? 'fa-motorcycle' : 'fa-car'}`}></i>
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Placa</h4>
                   <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">{v.plate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Proprietário</h4>
                  <p className="text-sm font-bold text-slate-700">{v.residentName}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Veículo</h4>
                  <p className="text-sm font-medium text-slate-600 italic">{v.model}</p>
                </div>
                {v.observations && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Observações</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{v.observations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {editingId ? 'Editar Veículo' : 'Cadastrar Veículo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                  <select 
                    value={formVehicle.type} 
                    onChange={e => setFormVehicle({...formVehicle, type: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                  >
                    <option value="Carro">Carro</option>
                    <option value="Moto">Moto</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Placa</label>
                  <input 
                    required 
                    type="text" 
                    value={formVehicle.plate} 
                    onChange={e => setFormVehicle({...formVehicle, plate: e.target.value.toUpperCase()})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black uppercase outline-none focus:ring-2 focus:ring-indigo-600" 
                    placeholder="ABC-1234" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proprietário (Nome)</label>
                <input 
                  required 
                  type="text" 
                  value={formVehicle.residentName} 
                  onChange={e => setFormVehicle({...formVehicle, residentName: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600" 
                  placeholder="Ex: João da Silva" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo / Cor</label>
                <input 
                  required 
                  type="text" 
                  value={formVehicle.model} 
                  onChange={e => setFormVehicle({...formVehicle, model: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600" 
                  placeholder="Ex: Toyota Corolla Prata" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observações</label>
                <textarea 
                  value={formVehicle.observations} 
                  onChange={e => setFormVehicle({...formVehicle, observations: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm h-28 outline-none focus:ring-2 focus:ring-indigo-600 transition-all" 
                  placeholder="Ex: Vaga 102. Autorizado entrar sem revista." 
                />
              </div>

              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-600 active:scale-95 transition-all">
                {editingId ? 'Salvar Alterações' : 'Concluir Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;