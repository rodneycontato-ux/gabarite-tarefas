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
    }
  });

  if (!pauta) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      {/* HEADER ORIGINAL */}
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">
          Concluir Tarefa
        </h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Após enviar, a tarefa será travada e enviada para aprovação.
        </p>
      </header>

      {/* CARD ÚNICO CONSOLIDADO VIA FORM */}
      {/* O action preventDefault ou o submit padrão vai respeitar o required da textarea */}
      <form className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 border-b-4 border-b-slate-200 space-y-6">
        
        {/* INFO SUPERIOR DA PAUTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 rounded-2xl p-4 border border-slate-100/70">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100 w-fit">
              {pauta.site_relacionado?.nome_site || "SEM PROJETO"}
            </span>
            <h2 className="text-base font-black uppercase text-slate-800 tracking-tight leading-tight mt-1 line-clamp-1">
              {pauta.titulo}
            </h2>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-[9px] font-black uppercase text-slate-400 font-mono">Valor a Receber</span>
            <span className="text-xl font-black text-emerald-600 italic">
              R$ {pauta.preco ? Number(pauta.preco).toFixed(2) : "0,00"}
            </span>
          </div>
        </div>

        {/* CAMPO DE TEXTO VERDADEIRAMENTE OBRIGATÓRIO */}
        <div className="flex flex-col">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 font-mono tracking-wider">
            Relato da Execução <span className="text-rose-500">* (Obrigatório)</span>
          </label>
          <textarea 
            name="relato_colaborador"
            id="relato_colaborador"
            required
            placeholder="O que você fez nesta tarefa? Deu tudo certo ou faltou alguma coisa? Deixe um resumo breve antes de enviar..."
            className="w-full min-h-35 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all resize-none"
          />
        </div>

        {/* PAINEL DE AÇÕES INFERIOR */}
        <div className="flex flex-col gap-3 pt-2">
          {/* O componente BotaoConcluirTarefa DEVE renderizar um <button type="submit"> interno */}
          <BotaoConcluirTarefa pautaId={pauta.id_pauta} />
          
          <Link 
            href="/dashboard/tarefas" 
            className="text-center py-3 text-[10px] font-black uppercase text-slate-300 hover:text-slate-500 transition-all italic tracking-widest"
          >
            ← Voltar sem salvar
          </Link>
        </div>

      </form>
    </div>
  );
}