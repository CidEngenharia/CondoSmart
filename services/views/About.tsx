import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn py-12">
      <section className="text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-indigo-100">
          <i className="fas fa-city"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">O que é o CondoSmarTI?</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          O sistema que trabalha por você e pelos moradores de condomínio. Simplifique sua rotina, tenha maior controle na comunicação e na gestão em um único sistema, para múltiplos condomínios.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-indigo-600">Gestão Simplificada</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Personalize a área administrativa do seu condomínio com as informações dos seus colaboradores. Aqui o morador tem mais facilidade e transparência na Gestão do condomínio.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-indigo-600">Tour Gratuito</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Faça um tour gratuito pelo nosso Sistema e conheça o CondoSmarTI. Descubra como a Inteligência Artificial pode transformar a convivência e a administração do seu espaço.
          </p>
        </div>
      </div>

      <section className="bg-gray-300 rounded-[2rem] p-8 text-black shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full border-2 border-indigo-500/50 overflow-hidden shrink-0 shadow-lg bg-gray-400">
             <img src="https://storage.googleapis.com/demos_ai/sidney_sales_avatar.png" className="w-full h-full object-cover object-top" alt="Sidney Sales" onError={(e) => {
               e.currentTarget.src = "https://i.pravatar.cc/150?u=sidney_new";
             }} />
          </div>
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div>
              <h3 className="text-sm font-black text-black">Desenvolvido por CidEngenharia360 - by Sidney Sales</h3>
              <p className="text-xs text-gray-800 font-bold mt-1">
                Desenvolvedor Especialista em desenvolvimento de aplicações de alta performance com IA e Web3.
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <a 
                href="https://cidengenharia360.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/50 text-black border border-black/20 rounded-lg text-xs font-bold hover:bg-white/70 transition-all flex items-center gap-2"
              >
                Cidengenharia360° <i className="fas fa-external-link-alt text-[10px] opacity-70"></i>
              </a>
              <a 
                href="https://wa.me/5571984184782?text=gostaria%20de%20um%20or%C3%A7amento%20de%20uma%20aplica%C3%A7%C3%A3o%20personalizada" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-lg text-xs font-bold hover:bg-[#25D366]/30 transition-all flex items-center gap-2"
              >
                Solicitar Aplicação <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-black/5 blur-3xl -mr-24 -mt-24"></div>
      </section>
    </div>
  );
};

export default About;