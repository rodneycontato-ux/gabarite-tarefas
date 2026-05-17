"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getStatusPauta } from "@/lib/status";
import { atualizarStatusPauta } from "../_actions/atualizar-status";

export default function TarefaCard({ tarefa }: { tarefa: any }) {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const nivel = (session?.user as any)?.nivel;

  const handleAction = async (status: number) => {
    const acaoTexto = status === 2 ? "desistir desta tarefa" : "iniciar esta tarefa";
    if (!confirm(`Tem certeza que deseja ${acaoTexto}?`)) return;

    setIsPending(true);
    try {
      const result = await atualizarStatusPauta(tarefa.id_pauta, status);
      if (result && !result.success) {
        alert(result.error || "Não foi possível realizar esta ação.");
        return; 
      }
    } catch (error) {
      alert("Erro crítico ao processar alteração.");
    } finally {
      setIsPending(false);
    }
  };

  const formatarData = (data: any) => {
    if (!data) return "--/--/--";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all border-b-4 border-b-slate-200 relative min-h-80 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      
      {isPending && (
        <div className="absolute inset-0 bg-white/40 z-10 rounded-[2.5rem] flex items-center justify-center">
          <span className="text-[10px] font-black uppercase text-slate-400 animate-pulse">Validando...</span>
        </div>
      )}

      {/* BLOCO SUPERIOR */}
      <div className="p-7 flex flex-col grow justify-between">
        
        {/* TOP: TITULO + BOTÃO BRIEFING ORIGINAL */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-black italic text-slate-800 uppercase leading-[1.3] line-clamp-2">
            {tarefa.titulo || "Sem título"}
          </h2>

          <button
            onClick={() => setOpenModal(true)}
            className="group/btn text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer w-fit"
          >
            <span>👉</span>
            <span className="border-b border-blue-200 group-hover/btn:border-blue-600 text-left leading-tight">
              Ver Descrição / Briefing
            </span>
          </button>
        </div>

    
  

{/* MIOLO: VERSÃO HORIZONTAL COMPACTA NO BOX CINZA (SEM LINHAS DIVISÓRIAS) */}
        <div className="bg-slate-50/70 border border-slate-100/60 rounded-3xl p-4 flex flex-col gap-4 my-auto mt-4 mb-2 text-[10px] font-black uppercase text-slate-400">
          
          {/* LINHA 1: ID DA TAREFA EM PRIMEIRO + STATUS LADO A LADO */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-mono text-[11px] bg-white px-2 py-0.5 rounded-md tracking-normal border border-slate-100/50 shadow-sm">
              #{tarefa.id_pauta}
            </span>
            <div className="flex items-center gap-2">
              <div>{getStatusPauta(tarefa.status)}</div>
            </div>
          </div>

          {/* LINHA 2: PROGRESSO DO CRONOGRAMA HORIZONTAL */}
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2 relative before:absolute before:left-2 before:right-2 before:top-1 before:h-0.5 before:bg-slate-200/40">
              {/* Criação */}
              <div className="relative pt-3 text-[10px] font-black uppercase text-slate-400 before:absolute before:left-1.5 before:top-0 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-300">
                <span className="block text-slate-400/80 text-[8px] tracking-wider">Criada em</span>
                <span className="text-slate-700 font-mono block mt-0.5">{formatarData(tarefa.data)}</span>
              </div>
              {/* Início */}
              <div className="relative pt-3 text-[10px] font-black uppercase text-slate-400 before:absolute before:left-1.5 before:top-0 before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-400">
                <span className="block text-slate-400/80 text-[8px] tracking-wider">Iniciada em</span>
                <span className="text-slate-700 font-mono block mt-0.5">{formatarData(tarefa.data_inicio)}</span>
              </div>
              {/* Entrega */}
              <div className="relative pt-3 text-[10px] font-black uppercase text-slate-400 before:absolute before:left-1.5 before:top-0 before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-400">
                <span className="block text-slate-400/80 text-[8px] tracking-wider">Entrega</span>
                <span className="text-slate-600 font-mono block mt-0.5">{formatarData(tarefa.data_conclusao)}</span>
              </div>
            </div>
          </div>

          {/* LINHA 3: FINANCEIRO E EXECUTOR LADO A LADO */}
          <div className="grid grid-cols-2 gap-4">
            {/* Orçamento */}
            <div className="flex flex-col">
              <span className="text-slate-400/60 tracking-wider text-[8.5px]">Orçamento</span>
              <span className="text-slate-800 font-mono text-sm font-black tracking-tight mt-0.5">
                R$ {tarefa.preco ? Number(tarefa.preco).toFixed(2) : "0,00"}
              </span>
            </div>
            {/* Executor */}
            <div className="flex flex-col">
              <span className="text-slate-400/60 tracking-wider text-[8.5px]">Responsável</span>
              <span className="text-slate-700 truncate font-bold normal-case text-xs block mt-0.5">
                👤 {tarefa.usuario?.nome || "Disponível"}
              </span>
            </div>
          </div>

        </div>



      </div>

      {/* BOTOES EM BAIXO (LARGURA TOTAL) */}
      <div className="p-7 pt-0">
        <div className="w-full">
          {nivel === 1 ? (
            <a
              href={`/dashboard/tarefas/editar/${tarefa.id_pauta}`}
              className="bg-slate-800 text-white w-full py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-700 transition-all text-center block tracking-wider"
            >
              Editar Projeto
            </a>
          ) : (
            <div className="w-full">
              {tarefa.status == 2 ? (
                <button
                  onClick={() => handleAction(3)}
                  className="bg-emerald-600 text-white w-full py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-500 transition-all text-center tracking-wider shadow-md"
                >
                  🚀 Iniciar Tarefa
                </button>
              ) : tarefa.status == 3 ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAction(2)}
                    className="bg-white text-rose-600 border border-rose-100 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-rose-50 transition-all text-center tracking-wider"
                  >
                    🏳️ Desistir
                  </button>
                  <Link
                    href={`/dashboard/tarefas/concluir/${tarefa.id_pauta}`}
                    className="bg-blue-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-500 transition-all text-center tracking-wider shadow-lg shadow-blue-100"
                  >
                    ✅ Concluir
                  </Link>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 w-full text-center">
                  <span className="text-[10px] font-black uppercase text-slate-300 italic">
                    Tarefa Finalizada
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL AJUSTADO (APENAS DESCRIÇÃO + X EM CIMA + PAINEL EM BAIXO ALINHADO) */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[85vh] text-left relative">
            
            {/* BOTÃO DE FECHAR (X) NO TOPO DIREITO */}
            <button 
              onClick={() => setOpenModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Descrição do Briefing
              </span>
              <h2 className="text-lg font-black italic uppercase text-slate-800 tracking-tight mt-2 pr-8 line-clamp-2">
                {tarefa.titulo || "Sem título"}
              </h2>
            </div>

            {/* APENAS O TEXTO DO BRIEFING */}
            <div className="overflow-y-auto pr-2 text-xs font-medium text-slate-600 leading-relaxed max-h-64 custom-scrollbar py-3 border-y border-slate-100">
              <div dangerouslySetInnerHTML={{ __html: tarefa.texto || "Sem descrição." }} />
            </div>

            {/* RODAPÉ: TUDO NA MESMA LINHA (TAGS E BOTÃO PAINEL) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-2">
                <span className="text-[8px] font-black uppercase bg-slate-50 text-blue-600 px-2.5 py-1.5 rounded-md border border-slate-100 shadow-sm">
                  📌 {tarefa.site_relacionado?.nome_site || "SEM PROJETO"}
                </span>
                <span className="text-[8px] font-black uppercase bg-slate-50 text-slate-500 px-2.5 py-1.5 rounded-md border border-slate-100 shadow-sm">
                  📁 {tarefa.categoria_relacionada?.nome_categoria || "SEM CATEGORIA"}
                </span>
              </div>

              {tarefa.site_relacionado?.url_admin && (
                <a 
                  href={tarefa.site_relacionado.url_admin}
                  target="_blank"
                  className="bg-slate-950 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1.5 shadow-sm"
                >
                  🔗 Acessar Painel
                </a>
              )}
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}