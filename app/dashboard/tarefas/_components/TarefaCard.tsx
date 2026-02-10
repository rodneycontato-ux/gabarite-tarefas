"use client";
import { useState } from "react"; 
import { getStatusPauta } from "@/lib/status";
import { useSession } from "next-auth/react";
import { atualizarStatusPauta } from "../_actions/atualizar-status";

export default function TarefaCard({ tarefa }: { tarefa: any }) {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false); 
  const [showDesc, setShowDesc] = useState(false);
  
  const nivel = (session?.user as any)?.nivel;

  const handleAction = async (status: number) => {
    if (!confirm("Confirmar alteração?")) return;
    setIsPending(true);
    await atualizarStatusPauta(tarefa.id_pauta, status);
    setIsPending(false);
  };

  const formatarData = (data: any) => {
    if (!data) return "--/--/--";
    return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all border-b-4 border-b-slate-200 relative min-h-[320px]">
      
      <div className="p-7 flex flex-col flex-grow">
        {/* Header - PUXANDO DOS RELACIONAMENTOS DO SCHEMA */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 text-white">
            {/* Puxa nome_site da relação vinculada ao id_site */}
            <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
              {tarefa.site_relacionado?.nome_site || "SEM PROJETO"}
            </span>

            {/* Puxa nome_categoria da relação vinculada ao id_categoria */}
            <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {tarefa.categoria_relacionada?.nome_categoria || "SEM CATEGORIA"}
            </span>
          </div>
          <span className="text-[10px] font-black text-slate-200">#{tarefa.id_pauta}</span>
        </div>

        {/* Título */}
        <h2 className="text-lg font-black italic text-slate-800 uppercase leading-[1.3] mb-2 line-clamp-2">
          {tarefa.titulo || "Sem título"}
        </h2>

        {/* Botão Ver Descrição */}
        <button 
          onClick={() => setShowDesc(!showDesc)}
          className="group/btn text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 flex items-center gap-1.5 mb-3 transition-colors cursor-pointer w-fit"
        >
          <span className="text-sm transition-transform group-hover/btn:translate-x-0.5">
            {showDesc ? "👇" : "👉"}
          </span>
          <span className="border-b border-blue-200 group-hover/btn:border-blue-600">
            {showDesc ? "Fechar Detalhes" : "Ver Descrição / Briefing"}
          </span>
        </button>

        {showDesc && (
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-xs font-medium text-slate-600 max-h-[180px] overflow-y-auto custom-scrollbar border border-slate-100">
            <div dangerouslySetInnerHTML={{ __html: tarefa.texto || "Sem descrição." }} />
          </div>
        )}

        <div className="mt-auto pt-2 flex flex-col gap-4">
          <div>{getStatusPauta(tarefa.status)}</div>
          
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[12px] border border-slate-200 shadow-sm flex-shrink-0">
              👤
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black uppercase text-slate-700 leading-tight truncate">
                {tarefa.usuario?.nome || "Disponível"}
              </span>
              <div className="flex gap-2 mt-0.5">
                <span className="text-[8px] font-bold uppercase text-slate-400">
                  Início: {formatarData(tarefa.data_inicio)}
                </span>
                <span className="text-[8px] font-bold uppercase text-slate-400">•</span>
                <span className="text-[8px] font-bold uppercase text-slate-400">
                  Fim: {formatarData(tarefa.data_conclusao)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-7 pt-0">
        <div className="flex items-center justify-between bg-slate-50 rounded-3xl p-3 border border-slate-100/50">
          <div className="pl-2">
            <span className="block text-[8px] font-black uppercase text-slate-400">Valor</span>
            <span className="text-base font-black text-slate-900 block leading-none">
              R$ {tarefa.preco ? Number(tarefa.preco).toFixed(2) : '0,00'}
            </span>
          </div>

          <div className="flex gap-2">
            {nivel === 1 ? (
              <a 
                href={`/dashboard/tarefas/editar/${tarefa.id_pauta}`} 
                className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase cursor-pointer hover:bg-slate-700 transition-all"
              >
                Editar
              </a>
            ) : (
              tarefa.status == 2 ? (
                <button onClick={() => handleAction(3)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase cursor-pointer hover:bg-emerald-500">🚀 Iniciar</button>
              ) : tarefa.status == 3 ? (
                <button onClick={() => handleAction(1)} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase cursor-pointer hover:bg-blue-500">✅ Concluir</button>
              ) : (
                <span className="text-[9px] font-black uppercase text-slate-300 italic pr-2">Finalizada</span>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}