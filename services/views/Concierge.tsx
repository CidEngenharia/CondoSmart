import React, { useState, useEffect, useRef } from 'react';
import { chatWithGemini, getLocalInfoWithMaps, complexReasoning } from '../geminiService';
import LiveVoice from '../../components/LiveVoice';
import { ArrowLeft } from 'lucide-react';

interface ConciergeProps {
  onBack?: () => void;
}

const Concierge: React.FC<ConciergeProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, sources?: string[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      let responseText = '';
      let sources: string[] = [];

      if (useThinking) {
        responseText = await complexReasoning(userMsg);
      } else if (userMsg.toLowerCase().includes('perto') || userMsg.toLowerCase().includes('onde')) {
        const res = await getLocalInfoWithMaps(userMsg);
        responseText = res.text;
        sources = res.sources;
      } else {
        responseText = await chatWithGemini(userMsg);
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText, sources }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema ao processar sua solicitação.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Voltar para Central
        </button>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="font-bold">Concierge Inteligente</h3>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online agora
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isVoiceActive ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-indigo-600 text-white shadow-lg'
            }`}
          >
            <i className={`fas ${isVoiceActive ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            {isVoiceActive ? 'Encerrar Voz' : 'Conversar por Voz'}
          </button>
        </div>
      </div>

      {isVoiceActive ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
          <LiveVoice onClose={() => setIsVoiceActive(false)} />
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400 text-3xl">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Como posso ajudar?</h4>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">Pergunte sobre horários, reservas, regras do condomínio ou lugares próximos.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200/20">
                      <p className="text-[10px] font-bold uppercase mb-2 opacity-70">Fontes sugeridas:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((url, j) => (
                          <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/20 px-2 py-1 rounded hover:bg-white/40 truncate max-w-[150px]">
                            {new URL(url).hostname}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-3">
               <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={useThinking} 
                  onChange={(e) => setUseThinking(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">Modo Pensamento (Complexo)</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida aqui..."
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-indigo-600 text-white w-12 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Concierge;