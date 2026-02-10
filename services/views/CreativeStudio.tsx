
import React, { useState } from 'react';

interface CreativeStudioProps {
  onAddAlert: (alert: { 
    id: string,
    type: 'RECIBO' | 'ORCAMENTO' | 'ENQUETE', 
    title: string, 
    description: string,
    timestamp: Date,
    completed: boolean,
    pollOptions?: string[],
    pollVotes?: number[],
    deadline?: string
  }) => void;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onAddAlert }) => {
  const [activeTab, setActiveTab] = useState<'recibo' | 'orcamento' | 'enquete'>('recibo');
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [customDate, setCustomDate] = useState(new Date().toISOString().slice(0, 16));

  // States dos formulários
  const [reciboData, setReciboData] = useState({ para: '', valor: '', desc: '' });
  const [orcamentoData, setOrcamentoData] = useState({ servico: '', prestador: '', total: '', desc: '' });
  const [enqueteData, setEnqueteData] = useState({ pergunta: '', opcoes: '', prazo: '7 dias', desc: '' });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Delay de processamento simulado
    await new Promise(r => setTimeout(r, 1200));

    const common = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(customDate),
      completed: isCompleted
    };

    if (activeTab === 'recibo') {
      onAddAlert({
        ...common,
        type: 'RECIBO',
        title: `Recibo: ${reciboData.para}`,
        description: reciboData.desc || `Referente ao pagamento de R$ ${reciboData.valor}`
      });
    } else if (activeTab === 'orcamento') {
      onAddAlert({
        ...common,
        type: 'ORCAMENTO',
        title: `Orçamento: ${orcamentoData.servico}`,
        description: orcamentoData.desc || `Emitido para ${orcamentoData.prestador} • Valor: R$ ${orcamentoData.total}`
      });
    } else {
      const optionsArray = enqueteData.opcoes.split('\n').filter(opt => opt.trim() !== '');
      onAddAlert({
        ...common,
        type: 'ENQUETE',
        title: enqueteData.pergunta,
        description: enqueteData.desc || `Nova votação disponível. Prazo: ${enqueteData.prazo}`,
        pollOptions: optionsArray,
        pollVotes: optionsArray.map(() => 0),
        deadline: enqueteData.prazo
      });
    }

    setLoading(false);
    alert('Comunicado publicado com sucesso no mural!');
    
    // Reset de estado pós-envio
    setIsCompleted(false);
    setReciboData({ para: '', valor: '', desc: '' });
    setOrcamentoData({ servico: '', prestador: '', total: '', desc: '' });
    setEnqueteData({ pergunta: '', opcoes: '', prazo: '7 dias', desc: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-10">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <TabButton active={activeTab === 'recibo'} onClick={() => setActiveTab('recibo')} icon="fas fa-file-invoice-dollar" label="Recibo" />
          <TabButton active={activeTab === 'orcamento'} onClick={() => setActiveTab('orcamento')} icon="fas fa-calculator" label="Orçamento" />
          <TabButton active={activeTab === 'enquete'} onClick={() => setActiveTab('enquete')} icon="fas fa-poll-h" label="Enquete" />
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Status e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                    <i className="fas fa-check-double"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Status</p>
                    <p className="text-sm font-black text-slate-900 uppercase">Concluído?</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsCompleted(true)} 
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isCompleted ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
                  >
                    Sim
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsCompleted(false)} 
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isCompleted ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
                  >
                    Não
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Data e Horário</label>
                <input 
                  type="datetime-local" 
                  value={customDate} 
                  onChange={e => setCustomDate(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50" 
                />
              </div>
            </div>

            {/* Campos Dinâmicos */}
            {activeTab === 'recibo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <InputGroup label="Destinatário">
                  <input required value={reciboData.para} onChange={e => setReciboData({...reciboData, para: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Nome" />
                </InputGroup>
                <InputGroup label="Valor (R$)">
                  <input required value={reciboData.valor} onChange={e => setReciboData({...reciboData, valor: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-black" placeholder="0,00" />
                </InputGroup>
                <div className="md:col-span-2">
                  <InputGroup label="Descrição Completa">
                    <textarea required value={reciboData.desc} onChange={e => setReciboData({...reciboData, desc: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none h-32" placeholder="Detalhes do comunicado..." />
                  </InputGroup>
                </div>
              </div>
            )}

            {activeTab === 'orcamento' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <InputGroup label="Serviço">
                  <input required value={orcamentoData.servico} onChange={e => setOrcamentoData({...orcamentoData, servico: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Ex: Pintura Fachada" />
                </InputGroup>
                <InputGroup label="Valor Total (R$)">
                  <input required value={orcamentoData.total} onChange={e => setOrcamentoData({...orcamentoData, total: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-black" placeholder="0,00" />
                </InputGroup>
                <div className="md:col-span-2">
                  <InputGroup label="Descrição do Projeto">
                    <textarea required value={orcamentoData.desc} onChange={e => setOrcamentoData({...orcamentoData, desc: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none h-32" placeholder="Detalhes técnicos..." />
                  </InputGroup>
                </div>
              </div>
            )}

            {activeTab === 'enquete' && (
              <div className="space-y-6 animate-fadeIn">
                <InputGroup label="Título da Enquete">
                  <input required value={enqueteData.pergunta} onChange={e => setEnqueteData({...enqueteData, pergunta: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Pergunta" />
                </InputGroup>
                <InputGroup label="Contextualização">
                  <textarea value={enqueteData.desc} onChange={e => setEnqueteData({...enqueteData, desc: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none h-24" placeholder="Explique os motivos..." />
                </InputGroup>
                <InputGroup label="Opções (Uma por linha)">
                  <textarea required value={enqueteData.opcoes} onChange={e => setEnqueteData({...enqueteData, opcoes: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm h-32 outline-none font-bold" placeholder="Sim&#10;Não" />
                </InputGroup>
              </div>
            )}

            <button disabled={loading} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
              {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bullhorn"></i>}
              Publicar no Mural
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-3 py-6 px-4 transition-all border-b-4 font-black uppercase text-[10px] tracking-widest ${active ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
    <i className={icon}></i> {label}
  </button>
);

const InputGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    {children}
  </div>
);

export default CreativeStudio;
