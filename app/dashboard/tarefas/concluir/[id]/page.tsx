import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BotaoConcluirTarefa from "../../_components/BotaoConcluir"; 

export default async function PaginaAprovarPauta({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pautaId = parseInt(id);

  const pauta = await prisma.pauta.findUnique({
    where: { id_pauta: pautaId },
    include: { 
      usuario: true,
      site_relacionado: true,
      categoria_relacionada: true 
    }
  });

  if (!pauta) return notFound();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">
          Concluir Tarefa
        </h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Confirmação de envio para aprovação
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* CARD DO BRIEFING */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 border-b-4 border-b-slate-200">
            <div className="flex gap-2 mb-6">
              <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                {pauta.site_relacionado?.nome_site || "SEM PROJETO"}
              </span>
              <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                {pauta.categoria_relacionada?.nome_categoria || "SEM CATEGORIA"}
              </span>
            </div>

            <h2 className="text-2xl font-black italic text-slate-800 uppercase leading-tight mb-6 text-wrap break-words">
              {pauta.titulo}
            </h2>

            {pauta.texto && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 overflow-hidden">
                <span className="block text-[10px] font-black uppercase text-slate-400 mb-3 font-mono">Conteúdo / Briefing</span>
                <div 
                  className="text-xs font-medium text-slate-600 leading-relaxed prose prose-slate max-w-none break-all"
                  dangerouslySetInnerHTML={{ __html: pauta.texto }} 
                />
              </div>
            )}
          </div>

          {/* CARD SEPARADO: RELATO DO COLABORADOR */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 border-b-4 border-b-slate-200">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 font-mono">
              Observações ou Relato do Colaborador (Opcional)
            </label>
            <textarea 
              name="relato_colaborador"
              placeholder="Caso precise relatar algo sobre a execução desta pauta..."
              className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 border-b-4 border-b-slate-200">
            <h3 className="text-[11px] font-black uppercase text-slate-400 mb-6 border-b border-slate-50 pb-2">
              Resumo Financeiro
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400">Colaborador</span>
                <span className="text-sm font-black text-slate-700 italic uppercase text-right">
                  {pauta.usuario?.nome?.split(' ')[0]} {pauta.usuario?.nome?.split(' ').pop()}
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-slate-400">Referência</span>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </span>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                <span className="text-[10px] font-black uppercase text-slate-400">Valor a Receber</span>
                <span className="text-xl font-black text-emerald-600 italic">
                  R$ {pauta.preco ? Number(pauta.preco).toFixed(2) : "0,00"}
                </span>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 mb-6 border border-rose-100">
                <p className="text-[9px] font-bold uppercase text-rose-600 leading-tight">
                    🔒 Ao concluir, esta pauta será travada para edição e enviada para a fila de aprovação.
                </p>
            </div>

            <div className="flex flex-col gap-3">
              <BotaoConcluirTarefa pautaId={pauta.id_pauta} />
              <Link 
                href="/dashboard/tarefas" 
                className="text-center py-3 text-[10px] font-black uppercase text-slate-300 hover:text-slate-500 transition-all italic"
              >
                ← Voltar sem salvar
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}