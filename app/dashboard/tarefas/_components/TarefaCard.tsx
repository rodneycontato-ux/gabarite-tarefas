"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getStatusPauta } from "@/lib/status";
import { atualizarStatusPauta } from "../_actions/atualizar-status";

export default function TarefaCard({ tarefa }: { tarefa: any }) {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

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
    <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all border-b-4 border-b-slate-200 relative min-h-[320px] ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      
      {isPending && (
        <div className="absolute inset-0 bg-white/40 z-10 rounded-[2.5rem] flex items-center justify-center">
          <span className="text-[10px] font-black uppercase text-slate-400 animate-pulse">Validando...</span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-grow">
        {/* HEADER: STATUS NA ESQUERDA + ID/DATA NA DIREITA */}
        <div className="flex justify-between items-start mb-4">
          <div className="scale-90 origin-left">
            {getStatusPauta(tarefa.status)}
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black text-slate-200 italic leading-none">#{tarefa.id_pauta}</span>
            <span className="text-[8px] font-bold text-slate-300 uppercase mt-1">Criada: {formatarData(tarefa.data)}</span>
          </div>
        </div>

        <h2 className="text-lg font-black italic text-slate-800 uppercase leading-[1.3] mb-3 line-clamp-2">
          {tarefa.titulo || "Sem título"}
        </h2>

        {/* BOTÃO BRIEFING */}
        <button
          onClick={() => setShowDesc(!showDesc)}
          className="group/btn text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 flex items-center gap-1.5 mb-4 transition-colors cursor-pointer w-fit"
        >
          <span className="text-sm">{showDesc ? "👇" : "👉"}</span>
          <span className="border-b border-blue-200 group-hover/btn:border-blue-600">
            {showDesc ? "Fechar Detalhes" : "Ver Descrição / Briefing"}
          </span>
        </button>

        {/* ÁREA DO BRIEFING COM TRAVA PARA NÃO ESTOURAR */}
        {showDesc && (
          <div className="bg-slate-50 rounded-2xl p-5 mb-5 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
            
            {/* Div de texto com quebra de link e scroll vertical */}
            <div className="text-[11px] font-medium text-slate-600 mb-5 leading-relaxed break-words break-all max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <div dangerouslySetInnerHTML={{ __html: tarefa.texto || "Sem descrição." }} />
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200/50">
              <div className="flex flex-wrap gap-2">
                <span className="text-[8px] font-black uppercase bg-white text-blue-600 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                  📌 {tarefa.site_relacionado?.nome_site || "SEM PROJETO"}
                </span>
                <span className="text-[8px] font-black uppercase bg-white text-slate-500 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                  📁 {tarefa.categoria_relacionada?.nome_categoria || "SEM CATEGORIA"}
                </span>
              </div>

              {tarefa.site_relacionado?.url_admin && (
                <a 
                  href={tarefa.site_relacionado.url_admin}
                  target="_blank"
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-blue-600 transition-all w-fit flex items-center gap-2"
                >
                  🔗 Acessar Painel
                </a>
              )}
            </div>
          </div>
        )}

        {/* RODAPÉ: USUÁRIO + DATAS */}
        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-slate-50">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[12px] border border-slate-200 shadow-sm flex-shrink-0">
            👤
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black uppercase text-slate-700 leading-tight truncate">
              {tarefa.usuario?.nome || "Disponível"}
            </span>
            <div className="flex gap-2 mt-0.5">
              <span className="text-[8px] font-bold uppercase text-slate-400">Início: {formatarData(tarefa.data_inicio)}</span>
              <span className="text-[8px] font-bold uppercase text-slate-400">•</span>
              <span className="text-[8px] font-bold uppercase text-slate-400">Fim: {formatarData(tarefa.data_conclusao)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AÇÕES E VALOR */}
      <div className="p-7 pt-0">
        <div className="flex items-center justify-between bg-slate-50 rounded-3xl p-3 border border-slate-100/50">
          <div className="pl-2">
            <span className="block text-[8px] font-black uppercase text-slate-400">Valor</span>
            <span className="text-base font-black text-slate-900 block leading-none">
              R$ {tarefa.preco ? Number(tarefa.preco).toFixed(2) : "0,00"}
            </span>
          </div>

          <div className="flex gap-2">
            {nivel === 1 ? (
              <a
                href={`/dashboard/tarefas/editar/${tarefa.id_pauta}`}
                className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase hover:bg-slate-700 transition-all"
              >
                Editar
              </a>
            ) : (
              <div className="flex gap-2">
                {tarefa.status == 2 ? (
                  <button
                    onClick={() => handleAction(3)}
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase hover:bg-emerald-500 shadow-md transition-all"
                  >
                    🚀 Iniciar
                  </button>
                ) : tarefa.status == 3 ? (
                  <>
                    <button
                      onClick={() => handleAction(2)}
                      className="bg-white text-rose-600 border border-rose-100 px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase hover:bg-rose-50 transition-all"
                    >
                      🏳️ Desistir
                    </button>
                    <Link
                      href={`/dashboard/tarefas/concluir/${tarefa.id_pauta}`}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase hover:bg-blue-500 transition-all shadow-lg shadow-blue-100"
                    >
                      ✅ Concluir
                    </Link>
                  </>
                ) : (
                  <span className="text-[9px] font-black uppercase text-slate-300 italic pr-2">Finalizada</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}