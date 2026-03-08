
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveVoiceProps {
  onClose: () => void;
}

const LiveVoice: React.FC<LiveVoiceProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Helper functions for audio processing
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  useEffect(() => {
    let sessionPromise: any = null;
    let microphoneStream: MediaStream | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;
        
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setIsActive(true);
              const source = inputCtx.createMediaStreamSource(microphoneStream!);
              scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session: any) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioBase64) {
                const ctx = audioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => console.error("Live API Error:", e),
            onclose: () => setIsActive(false),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'You are a friendly and helpful residential concierge. Help residents with their daily needs via voice.',
          }
        });
      } catch (err) {
        console.error("Failed to start voice session:", err);
      }
    };

    startSession();

    return () => {
      if (microphoneStream) microphoneStream.getTracks().forEach(t => t.stop());
      if (scriptProcessor) scriptProcessor.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 text-center animate-pulse">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-indigo-600 scale-110 shadow-indigo-200' : 'bg-gray-200'} shadow-2xl relative`}>
        <i className="fas fa-microphone text-white text-4xl"></i>
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping"></div>
            <div className="absolute -inset-4 rounded-full border-2 border-indigo-200 animate-pulse"></div>
          </>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{isActive ? 'Ouvindo...' : 'Iniciando...'}</h3>
        <p className="text-gray-500 mt-2">Fale naturalmente com seu assistente de condomínio.</p>
      </div>
      <button 
        onClick={onClose}
        className="px-8 py-3 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 transition-all"
      >
        Desativar
      </button>
    </div>
  );
};

export default LiveVoice;
