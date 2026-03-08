import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ReservationData {
  id: string;
  area: string;
  residentName: string;
  unit: string;
  date: string;
  time: string;
  peopleCount: number;
  purpose: 'Aniversário' | 'Reunião' | 'Culto' | 'Outro';
  observations: string;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

const AREAS = [
  'Salão de Festas',
  'Churrasqueira A',
  'Churrasqueira B',
  'Espaço Gourmet',
  'Quadra Poliesportiva',
  'Sala de Reuniões'
];

const INITIAL_RESERVATIONS: ReservationData[] = [
  {
    id: '1',
    area: 'Salão de Festas',
    residentName: 'Carlos Eduardo',
    unit: '502C',
    date: '2023-11-15',
    time: '18:00',
    peopleCount: 45,
    purpose: 'Aniversário',
    observations: 'Festa infantil, buffet externo autorizado.',
    status: 'Confirmada'
  },
  {
    id: '2',
    area: 'Sala de Reuniões',
    residentName: 'Ana Paula',
    unit: '101A',
    date: '2023-11-10',
    time: '14:00',
    peopleCount: 8,
    purpose: 'Reunião',
    observations: 'Reunião de condomínio do bloco A.',
    status: 'Pendente'
  }
];

interface ReservationsProps {
  currentUser: User | null;
  onBack?: () => void;
}

const Reservations: React.FC<ReservationsProps> = ({ currentUser, onBack }) => {
  const [reservations, setReservations] = useState<ReservationData[]>(INITIAL_RESERVATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<ReservationData, 'id' | 'status'>>({
    area: AREAS[0],
    residentName: currentUser?.name || '',
    unit: '',
    date: '',
    time: '',
    peopleCount: 1,
    purpose: 'Outro',
    observations: ''
  });

  const isAdmin = currentUser?.role === UserRole.CONDO_ADMIN || currentUser?.role === UserRole.SUPER_ADMIN;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      area: AREAS[0],
      residentName: currentUser?.name || '',
      unit: '',
      date: '',
      time: '',
      peopleCount: 1,
      purpose: 'Outro',
      observations: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (res: ReservationData) => {
    setEditingId(res.id);
    setFormData({
      area: res.area,
      residentName: res.residentName,
      unit: res.unit,
      date: res.date,
      time: res.time,
      peopleCount: res.peopleCount,
      purpose: res.purpose,
      observations: res.observations
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja cancelar e excluir esta reserva?")) {
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setReservations(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r));
      alert('Reserva atualizada com sucesso!');
    } else {
      const newReservation: ReservationData = {
        ...formData,
        id: Date.now().toString(),
        status: 'Pendente'
      };
      setReservations([newReservation, ...reservations]);
      alert('Sua solicitação de reserva foi enviada para análise!');
    }
    
    setIsModalOpen(false);
  };

  const getPurposeIcon = (purpose: string) => {
    switch (purpose) {
      case 'Aniversário': return 'fa-cake-candles text-pink-500';
      case 'Reunião': return 'fa-briefcase text-blue-500';
      case 'Culto': return 'fa-hands-praying text-amber-500';
      default: return 'fa-calendar-day text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Reservas de Áreas</h2>
          <p className="text-sm text-slate-500 font-medium italic mt-2">Agende espaços comuns para seus eventos.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <i className="fas fa-calendar-plus"></i> Nova Reserva
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
            
            {/* Actions overlay for admin or owner */}
            <div className="absolute top-6 right-6 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(res)} className="w-9 h-9 bg-white text-indigo-600 rounded-xl shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <i className="fas fa-pencil-alt text-xs"></i>
              </button>
              <button onClick={() => handleDelete(res.id)} className="w-9 h-9 bg-white text-red-500 rounded-xl shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shrink-0">
                 <span className="text-[10px] font-black uppercase text-slate-400">{res.date.split('-')[2]}</span>
                 <span className="text-xl font-black text-slate-900">{new Date(res.date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '')}</span>
              </div>
              
              <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="pr-16">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{res.area}</h3>
                      <p className="text-xs font-bold text-indigo-600">{res.residentName} • Unidade {res.unit}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${
                      res.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-700' : 
                      res.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {res.status}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <i className="fas fa-clock text-xs"></i>
                       </div>
                       <span className="text-xs font-bold text-slate-600">{res.time}h</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <i className="fas fa-users text-xs"></i>
                       </div>
                       <span className="text-xs font-bold text-slate-600">{res.peopleCount} Pessoas</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <i className={`fas ${getPurposeIcon(res.purpose)}`}></i>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{res.purpose}</span>
                    {res.observations && (
                      <span className="text-[10px] text-slate-400 italic ml-auto truncate max-w-[150px]">"{res.observations}"</span>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-scaleIn max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {editingId ? 'Editar Reserva' : 'Solicitar Reserva'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Área Comum</label>
                <select 
                  required
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50"
                >
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Data da Reserva</label>
                <input 
                  required
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Horário de Início</label>
                <input 
                  required
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Qtd. de Pessoas</label>
                <input 
                  required
                  type="number"
                  min="1"
                  value={formData.peopleCount}
                  onChange={e => setFormData({...formData, peopleCount: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Finalidade</label>
                <select 
                  required
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                >
                  <option value="Aniversário">Aniversário</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Culto">Culto</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Morador (Nome)</label>
                <input 
                  required
                  type="text"
                  value={formData.residentName}
                  onChange={e => setFormData({...formData, residentName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Unidade</label>
                <input 
                  required
                  type="text"
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                  placeholder="Ex: 502C"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Observações</label>
                <textarea 
                  value={formData.observations}
                  onChange={e => setFormData({...formData, observations: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm h-28 outline-none focus:ring-4 focus:ring-indigo-50"
                  placeholder="Ex: Necessário autorização para entrada de buffet móvel."
                />
              </div>

              <button type="submit" className="md:col-span-2 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition-all mt-4">
                {editingId ? 'Salvar Alterações' : 'Confirmar Solicitação de Reserva'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;