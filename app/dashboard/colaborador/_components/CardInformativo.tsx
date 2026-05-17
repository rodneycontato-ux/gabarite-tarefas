export default function CardInformativo() {
  return (
    <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-sm h-fit">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
            🚀
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic leading-none">
              Central de Ajuda
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Dúvidas frequentes e orientações
            </p>
          </div>
        </div>
      </header>

      {/* Área de Conteúdo (Sem scroll fixo para acompanhar a altura) */}
      <div className="space-y-1">
        
        {/* FAQ: INTRODUÇÃO GERAL */}
        <details className="group border-b border-slate-50 py-4">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
            <span>🔹 O que é e como usar este painel?</span>
            <span className="text-slate-300 group-open:rotate-180 transition-transform text-[10px]">▼</span>
          </summary>
          <div className="text-xs text-slate-500 mt-3 ml-5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <p>
              Este é o seu <strong>Mural de Tarefas</strong>. Aqui você escolhe as pautas disponíveis, produz o conteúdo e, ao final, recebe por cada entrega realizada.
            </p>
            <p>
              <strong>O processo é simples:</strong> escolha uma pauta em "Pendente", clique em 🚀 <strong>Iniciar</strong> e o status mudará para "Aberto". A partir daí, a tarefa é sua e você terá acesso ao briefing e ao link do painel para publicar.
            </p>
          </div>
        </details>      


        {/* FAQ: LIMITES */}
        <details className="group border-b border-slate-50 py-4">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
            <span>🔹 Quantas tarefas posso pegar por vez?</span>
            <span className="text-slate-300 group-open:rotate-180 transition-transform text-[10px]">▼</span>
          </summary>
          <p className="text-xs text-slate-500 mt-3 ml-5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            O limite é de <strong>3 tarefas abertas</strong> ao mesmo tempo. Conclua uma para liberar espaço para a próxima.
          </p>
        </details>

        {/* FAQ: DESISTÊNCIA */}
        <details className="group border-b border-slate-50 py-4">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
            <span>🔹 Posso desistir de uma tarefa assumida?</span>
            <span className="text-slate-300 group-open:rotate-180 transition-transform text-[10px]">▼</span>
          </summary>
          <p className="text-xs text-slate-500 mt-3 ml-5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            Sim. Clique em <strong>"Desistir"</strong> no card da tarefa e ela volta imediatamente para o status Pendente.
          </p>
        </details>

        {/* FAQ: PRAZO DAS TAREFAS */}
        <details className="group border-b border-slate-50 py-4">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
            <span>🔹 Qual o prazo para concluir as tarefas?</span>
            <span className="text-slate-300 group-open:rotate-180 transition-transform text-[10px]">▼</span>
          </summary>
          <p className="text-xs text-slate-500 mt-3 ml-5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            Atualmente <strong>não trabalhamos com um prazo fixo</strong>, então você pode produzir no seu tempo. No entanto, pedimos bom senso: se perceber que não vai conseguir finalizar, use o botão <strong>"Desistir"</strong> para que outro colaborador possa assumir e a produção não fique travada.
          </p>
        </details>

        {/* FAQ: ONDE PUBLICAR */}
        <details className="group border-b border-slate-50 py-4">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
            <span>🔹 Onde devo publicar o conteúdo?</span>
            <span className="text-slate-300 group-open:rotate-180 transition-transform text-[10px]">▼</span>
          </summary>
          <div className="text-xs text-slate-500 mt-3 ml-5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="mb-3">
              Dentro do <strong>"Briefing"</strong> de cada tarefa, você encontrará o botão 
              <span className="mx-1 px-2 py-0.5 bg-slate-900 text-white text-[9px] rounded-md font-black uppercase">🔗 Acessar Painel</span>.
            </p>
            <p>
              Ao clicar, você será levado ao painel do site correspondente. Utilize o 
              <span className="text-slate-800 font-bold uppercase italic"> login e senha</span> que foram fornecidos individualmente para cada projeto para realizar a postagem.
            </p>
          </div>
        </details>

        {/* FAQ: PAGAMENTO */}
        <details className="group border-b border-slate-50 py-4">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
            <span>🔹 Quando e como recebo meus pagamentos?</span>
            <span className="text-slate-300 group-open:rotate-180 transition-transform text-[10px]">▼</span>
          </summary>
          <p className="text-xs text-slate-500 mt-3 ml-5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            Toda a sua produção aprovada no mês é somada e o pagamento ocorre até o <strong>dia 10 do mês seguinte</strong>.
          </p>
        </details>

        {/* LINK DRIVE */}
        <div className="pt-6">
          <a 
            href="https://drive.google.com/drive/folders/1hMQ7Zel988gbZ6Wmzo8OFHy4clZw7na5" 
            target="_blank" 
            className="flex items-center justify-between p-5 bg-slate-900 rounded-4xl text-white hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📂</span>
              <div>
                <p className="text-[11px] font-black uppercase italic tracking-wider">
                  Tutoriais e Documentos (Drive)
                </p>
                <p className="text-[10px] opacity-60 uppercase font-bold">
                  Materiais de apoio para as tarefas
                </p>
              </div>
            </div>
            <span className="text-white/50">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}