
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface DeliveryData {
  id: string;
  recipientName: string;
  unit: string;
  description: string;
  trackingCode?: string;
  receivedAt: string;
  status: 'Pendente' | 'Entregue';
  deliveredTo?: string;
  deliveredAt?: string;
  observations?: string;
}

const INITIAL_DELIVERIES: DeliveryData[] = [
  { 
    id: '1', 
    recipientName: 'João Silva', 
    unit: '101A', 
    description: 'Pacote Amazon (Grande)', 
    trackingCode: 'BR123456789', 
    receivedAt: '2023-10-25T10:30', 
    status: 'Pendente' 
  },
  { 
    id: '2', 
    recipientName: 'Maria Oliveira', 
    unit: '304B', 
    description: 'Envelope Mercado Livre', 
    receivedAt: '2023-10-24T15:20', 
    status: 'Entregue',
    deliveredTo: 'Maria Oliveira (Própria)',
    deliveredAt: '2023-10-24T18:45',
    observations: 'Entregue na portaria para o filho dela.'
  },
];

interface DeliveriesProps {
  currentUser: User | null;
}

const Deliveries: React.FC<DeliveriesProps> = ({ currentUser }) => {
  const [deliveries, setDeliveries] = useState<DeliveryData[]>(INITIAL_DELIVERIES);
  const [search, setSearch] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);

  // Form states
  const [formRegister, setFormRegister] = useState({ recipientName: '', unit: '', description: '', trackingCode: '' });
  const [formDelivery, setFormDelivery] = useState({ deliveredTo: '', deliveredAt: '', observations: '' });

  const filtered = deliveries.filter(d => 
    d.recipientName.toLowerCase().includes(search.toLowerCase()) || 
    d.unit.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const isAdmin = currentUser?.role !== UserRole.RESIDENT;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newDelivery: DeliveryData = {
      id: Date.now().toString(),
      ...formRegister,
      receivedAt: new Date().toISOString().slice(0, 16),
      status: 'Pendente'
    };
    setDeliveries([newDelivery, ...deliveries]);
    setIsRegisterModalOpen(false);
    setFormRegister({ recipientName: '', unit: '', description: '', trackingCode: '' });
    alert('Encomenda registrada com sucesso!');
  };

  const openDeliveryModal = (delivery: DeliveryData) => {
    setSelectedDelivery(delivery);
    setFormDelivery({ 
      deliveredTo: delivery.recipientName, 
      deliveredAt: new Date().toLocaleString('sv-SE').slice(0, 16), // Formato YYYY-MM-DDTHH:mm
      observations: '' 
    });
    setIsDeliveryModalOpen(true);
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    setDeliveries(prev => prev.map(d => 
      d.id === selectedDelivery.id 
      ? { 
          ...d, 
          status: 'Entregue', 
          deliveredTo: formDelivery.deliveredTo, 
          deliveredAt: formDelivery.deliveredAt, 
          observations: formDelivery.observations 
        } 
      : d
    ));

    setIsDeliveryModalOpen(false);
    setSelectedDelivery(null);
    alert('Baixa de encomenda realizada!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente remover este registro?")) {
      setDeliveries(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gestão de Encomendas</h2>
          <p className="text-sm text-slate-500 font-medium italic mt-2">Controle de recebimento e entrega de pacotes.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-80 group">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Buscar por morador ou unidade..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm transition-all"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> Receber Encomenda
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((d) => (
          <div key={d.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all relative overflow-hidden group">
            
            <div className={`w-20 h-20 rounded-3xl shrink-0 flex items-center justify-center text-2xl shadow-lg ${d.status === 'Pendente' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
               <i className={`fas ${d.status === 'Pendente' ? 'fa-box-open animate-bounce' : 'fa-check-double'}`}></i>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Morador / Unidade</h4>
                    <p className="text-lg font-black text-slate-900 tracking-tighter">{d.recipientName} • <span className="text-indigo-600">{d.unit}</span></p>
                 </div>
                 <div className="flex gap-2">
                    {isAdmin && (
                      <button onClick={() => handleDelete(d.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                 </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descrição</h4>
                <p className="text-sm font-medium text-slate-600">{d.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                 <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chegada</h4>
                    <p className="text-xs font-bold text-slate-700">{new Date(d.receivedAt).toLocaleString('pt-BR')}</p>
                 </div>
                 {d.status === 'Entregue' && (
                   <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retirada</h4>
                      <p className="text-xs font-bold text-emerald-600">{new Date(d.deliveredAt!).toLocaleString('pt-BR')}</p>
                   </div>
                 )}
              </div>

              {d.status === 'Entregue' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                   <div>
                      <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Entregue a:</h4>
                      <p className="text-xs font-black text-slate-800 uppercase">{d.deliveredTo}</p>
                   </div>
                   {d.observations && (
                     <div>
                        <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Observações:</h4>
                        <p className="text-[11px] text-slate-500 italic leading-relaxed">{d.observations}</p>
                     </div>
                   )}
                </div>
              )}

              {d.status === 'Pendente' && isAdmin && (
                <button 
                  onClick={() => openDeliveryModal(d)}
                  className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                >
                  Confirmar Retirada
                </button>
              )}
            </div>

            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest ${d.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
               {d.status}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Cadastro de Encomenda */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Receber Encomenda</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Morador (Nome)">
                  <input required value={formRegister.recipientName} onChange={e => setFormRegister({...formRegister, recipientName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Ex: João Silva" />
                </InputGroup>
                <InputGroup label="Unidade">
                  <input required value={formRegister.unit} onChange={e => setFormRegister({...formRegister, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Ex: 101-A" />
                </InputGroup>
              </div>
              <InputGroup label="Descrição do Volume">
                <input required value={formRegister.description} onChange={e => setFormRegister({...formRegister, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Ex: Caixa Amazon, Envelope Sedex..." />
              </InputGroup>
              <InputGroup label="Código de Rastreio (Opcional)">
                <input value={formRegister.trackingCode} onChange={e => setFormRegister({...formRegister, trackingCode: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="BR123456789" />
              </InputGroup>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
                Salvar e Notificar Morador
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Entrega (Baixa) */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Confirmar Entrega</h3>
              <button onClick={() => setIsDeliveryModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest mb-1">Encomenda</p>
               <p className="text-sm font-bold text-amber-900">{selectedDelivery?.description}</p>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-6">
              <InputGroup label="Entregue a (Nome)">
                <input required value={formDelivery.deliveredTo} onChange={e => setFormDelivery({...formDelivery, deliveredTo: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black uppercase outline-none focus:ring-2 focus:ring-indigo-600" placeholder="Nome de quem retirou" />
              </InputGroup>
              
              <InputGroup label="Data e Horário da Retirada">
                <input required type="datetime-local" value={formDelivery.deliveredAt} onChange={e => setFormDelivery({...formDelivery, deliveredAt: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
              </InputGroup>

              <InputGroup label="Observações Adicionais">
                <textarea value={formDelivery.observations} onChange={e => setFormDelivery({...formDelivery, observations: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 outline-none focus:ring-2 focus:ring-indigo-600 transition-all" placeholder="Ex: Entregue para a secretária. Pacote estava levemente amassado." />
              </InputGroup>

              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">
                Finalizar e Arquivar
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
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    {children}
  </div>
);

export default Deliveries;
