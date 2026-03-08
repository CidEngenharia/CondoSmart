import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ResidentData {
  id: string;
  name: string;
  type: 'Casa' | 'Apartamento';
  unit: string;
  phone: string;
  photo: string;
  hasVehicle: boolean;
  vehicleBrand?: string;
  vehiclePlate?: string;
  qrCode?: string;
  nfcTag?: string;
  observations?: string;
}

const INITIAL_RESIDENTS: ResidentData[] = [
  { id: '1', name: 'João Silva', type: 'Apartamento', unit: '101', phone: '5571999999999', photo: 'https://i.pravatar.cc/150?u=joao', hasVehicle: true, vehicleBrand: 'Toyota Corolla', vehiclePlate: 'ABC-1234', qrCode: 'QR-A1B2C3' },
  { id: '2', name: 'Maria Oliveira', type: 'Apartamento', unit: '304', phone: '5571988888888', photo: 'https://i.pravatar.cc/150?u=maria', hasVehicle: false },
  { id: '3', name: 'Pedro Santos', type: 'Casa', unit: '12', phone: '5571977777777', photo: 'https://i.pravatar.cc/150?u=pedro', hasVehicle: true, vehicleBrand: 'Honda Civic', vehiclePlate: 'XYZ-9876', nfcTag: 'NFC-X9Y8Z7' },
];

interface ResidentsProps {
  currentUser: User | null;
  onBack?: () => void;
}

const Residents: React.FC<ResidentsProps> = ({ currentUser, onBack }) => {
  const [residents, setResidents] = useState<ResidentData[]>(INITIAL_RESIDENTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formResident, setFormResident] = useState<ResidentData>({
    id: '',
    name: '',
    type: 'Apartamento',
    unit: '',
    phone: '',
    photo: '',
    hasVehicle: false,
    vehicleBrand: '',
    vehiclePlate: '',
    observations: ''
  });

  const filtered = residents.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.unit.toLowerCase().includes(search.toLowerCase())
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormResident({ ...formResident, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormResident({ id: '', name: '', type: 'Apartamento', unit: '', phone: '', photo: '', hasVehicle: false, vehicleBrand: '', vehiclePlate: '', observations: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (resident: ResidentData) => {
    setEditingId(resident.id);
    setFormResident({ ...resident });
    setIsModalOpen(true);
  };

  const handleSaveResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formResident.name || !formResident.phone || !formResident.unit) {
      alert("Por favor, preencha o Nome, Telefone e Unidade.");
      return;
    }
    
    if (editingId) {
      setResidents(prev => prev.map(r => r.id === editingId ? { ...formResident } : r));
      alert("Morador atualizado com sucesso!");
    } else {
      const residentToAdd = { ...formResident, id: Date.now().toString() };
      setResidents([residentToAdd, ...residents]);
      alert("Morador cadastrado com sucesso!");
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteResident = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este morador?")) {
      setResidents(prev => prev.filter(r => r.id !== id));
    }
  };

  const generateAccessCode = (id: string, type: 'QR' | 'NFC') => {
    setResidents(prev => prev.map(r => {
      if (r.id === id) {
        const randomId = Math.random().toString(36).substr(2, 6).toUpperCase();
        return type === 'QR' 
          ? { ...r, qrCode: `QR-${randomId}` }
          : { ...r, nfcTag: `NFC-${randomId}` };
      }
      return r;
    }));
    alert(`${type} gerado com sucesso!`);
  };

  const isAdmin = currentUser?.role === UserRole.CONDO_ADMIN || currentUser?.role === UserRole.SUPER_ADMIN;

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
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Gestão de Moradores</h2>
          <p className="text-sm text-gray-500 font-medium italic mt-2">Controle de acesso e cadastros da comunidade.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-80 group">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Buscar por nome ou unidade..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm transition-all"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={openAddModal}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-user-plus"></i> Novo Morador
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((resident) => (
          <div key={resident.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            
            {/* Admin Actions Overlay */}
            {isAdmin && (
              <div className="absolute top-6 right-6 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(resident)} className="w-9 h-9 bg-white text-indigo-600 rounded-xl shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                  <i className="fas fa-pencil-alt text-xs"></i>
                </button>
                <button onClick={() => handleDeleteResident(resident.id)} className="w-9 h-9 bg-white text-red-500 rounded-xl shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            )}

            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <img 
                  src={resident.photo || `https://ui-avatars.com/api/?name=${resident.name}&background=6366f1&color=fff`} 
                  className="w-20 h-20 rounded-3xl object-cover shadow-lg border-2 border-white" 
                  alt={resident.name} 
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-md border-2 border-white ${resident.type === 'Casa' ? 'bg-amber-500' : 'bg-indigo-600'} text-white`}>
                  <i className={`fas ${resident.type === 'Casa' ? 'fa-home' : 'fa-building'}`}></i>
                </div>
              </div>
              <div className="flex-1 min-w-0 pr-12">
                <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">{resident.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-widest">
                    {resident.type} {resident.unit}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                   <a href={`https://wa.me/${resident.phone}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-500 hover:text-green-600 flex items-center gap-2 transition-colors">
                     <i className="fab fa-whatsapp text-green-500"></i> {resident.phone}
                   </a>
                   {resident.hasVehicle && (
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg w-fit">
                       <i className="fas fa-car text-indigo-400"></i> 
                       <span className="truncate max-w-[80px]">{resident.vehicleBrand}</span> 
                       <span className="text-indigo-600 font-black">{resident.vehiclePlate}</span>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => generateAccessCode(resident.id, 'QR')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${resident.qrCode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-indigo-50 hover:text-indigo-600'}`}
              >
                <i className="fas fa-qrcode"></i> {resident.qrCode ? 'Ver QR Code' : 'Gerar QR'}
              </button>
              <button 
                onClick={() => generateAccessCode(resident.id, 'NFC')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${resident.nfcTag ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <i className="fas fa-mobile-alt"></i> {resident.nfcTag ? 'TAG Ativa' : 'Gerar TAG'}
              </button>
            </div>
            
            {(resident.qrCode || resident.nfcTag) && (
              <div className="mt-3 flex justify-center gap-3">
                {resident.qrCode && <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">ID: {resident.qrCode}</span>}
                {resident.nfcTag && <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">CHIP: {resident.nfcTag}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                {editingId ? 'Editar Cadastro' : 'Novo Cadastro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveResident} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                  {formResident.photo ? (
                    <img src={formResident.photo} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <i className="fas fa-user text-2xl text-gray-200"></i>
                  )}
                  <label className="absolute inset-0 bg-indigo-600/80 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-camera text-white"></i>
                    <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                  </label>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto do Morador</span>
              </div>

              <div className="space-y-4">
                <InputGroup label="Nome Completo">
                  <input required type="text" value={formResident.name} onChange={e => setFormResident({...formResident, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all" placeholder="Nome do morador" />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Tipo de Unidade">
                    <select 
                      value={formResident.type} 
                      onChange={e => setFormResident({...formResident, type: e.target.value as any})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-50 outline-none appearance-none font-bold text-gray-700 cursor-pointer"
                    >
                      <option value="Apartamento">Apartamento</option>
                      <option value="Casa">Casa</option>
                    </select>
                  </InputGroup>
                  <InputGroup label="Número / Unidade">
                    <input required type="text" value={formResident.unit} onChange={e => setFormResident({...formResident, unit: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-50 outline-none font-black" placeholder="Ex: 101" />
                  </InputGroup>
                </div>

                <InputGroup label="Telefone / WhatsApp">
                  <input required type="text" value={formResident.phone} onChange={e => setFormResident({...formResident, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-50 outline-none" placeholder="55719..." />
                </InputGroup>

                <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Possui Veículo?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formResident.hasVehicle} 
                        onChange={e => setFormResident({...formResident, hasVehicle: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {formResident.hasVehicle && (
                    <div className="grid grid-cols-2 gap-3 animate-slideDown">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Marca / Modelo</label>
                        <input type="text" value={formResident.vehicleBrand} onChange={e => setFormResident({...formResident, vehicleBrand: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Ex: Toyota Corolla" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Placa</label>
                        <input type="text" value={formResident.vehiclePlate} onChange={e => setFormResident({...formResident, vehiclePlate: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-600 outline-none font-black uppercase" placeholder="ABC-1234" />
                      </div>
                    </div>
                  )}
                </div>

                <InputGroup label="Observações">
                  <textarea value={formResident.observations} onChange={e => setFormResident({...formResident, observations: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm h-20 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" placeholder="Informações adicionais..." />
                </InputGroup>
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                {editingId ? 'Salvar Alterações' : 'Finalizar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">{label}</label>
    {children}
  </div>
);

export default Residents;