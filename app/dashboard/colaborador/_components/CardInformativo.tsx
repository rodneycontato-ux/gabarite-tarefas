export default function CardInformativo() {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm h-[480px] flex flex-col">
      {/* Header Fixo */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
            🚀
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">
              Bem-vindo à Plataforma
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Entenda como funciona nossa produção
            </p>
          </div>
        </div>
      </div>

      {/* Área com Scroll */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
        
        {/* Resumo da Plataforma e Gabarite */}
        <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed">
            Esta é a nossa plataforma de produção de conteúdo. Aqui, você assume tarefas publicadas por nossa equipe e será remunerado por cada item finalizado. 
            <br /><br />
            🎯 <strong>Fluxo de Trabalho:</strong> Ao iniciar e concluir uma tarefa, o valor (que varia conforme a complexidade) é contabilizado no seu saldo. O objetivo é fornecer conteúdos ricos, como comentários de questões e simulados, com mais detalhes do que já existe na web.
          </p>
        </section>

        {/* Central de Tutoriais em Destaque */}
        <a 
          href="https://drive.google.com/drive/folders/1hMQ7Zel988gbZ6Wmzo8OFHy4clZw7na5" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-700 p-5 rounded-2xl text-white shadow-lg hover:brightness-110 transition-all overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 font-black uppercase italic text-sm tracking-wide">
              ▶️ Tutoriais de Publicação
            </h3>
            <p className="text-[11px] opacity-80 font-medium mt-1">
              Aprenda a publicar simulados, questões, notícias, comentários entre outros.
            </p>
          </div>
          <span className="text-xl group-hover:translate-x-1 transition-transform">🔗</span>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </a>

        <div className="space-y-4">
          {/* Regras de Pagamento */}
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex gap-4">
            <span className="text-xl">💰</span>
            <div className="text-sm text-emerald-900 leading-relaxed font-medium">
              <strong>Pagamentos:</strong> A produção do mês atual é paga até o <strong>dia 10 do mês seguinte</strong>. Os valores são ajustados de acordo com a originalidade e dificuldade técnica de cada tarefa.
            </div>
          </div>

          {/* Regra de Qualidade (A única que sobrou da lista) */}
          <div className="flex gap-4 p-3">
            <span className="text-xl">⚠️</span>
            <div className="text-sm text-slate-600 leading-relaxed italic">
              <strong>Qualidade e Originalidade:</strong> Não aceitamos plágio ou textos automáticos. A IA pode auxiliar, mas a verificação e a curadoria humana são essenciais para garantir a precisão das informações.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}