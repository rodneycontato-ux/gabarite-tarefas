import { prisma } from "@/lib/prisma";

export default async function TarefasPendentes() {
  // 1. Consulta otimizada: O banco MySQL/PostgreSQL faz a conta e nos entrega só o resultado
  const resultado = await prisma.pauta.aggregate({
    where: {
      status: "2", // 0 = Aguardando início de produção
    },
    _count: {
      id_pauta: true, // Total de itens
    },
    _sum: {
      preco: true, // Soma total do valor dessas pautas
    },
  });

  const quantidade = resultado._count.id_pauta || 0;
  const valorTotal = resultado._sum.preco || 0;

  // 2. Formatação para moeda brasileira (R$)
  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Tarefas Pendentes
          </p>
          <h3 className="text-3xl font-black text-slate-900 italic font-mono">
            {quantidade.toString().padStart(2, "0")}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-300 uppercase italic">
            Custo Previsto
          </p>
          <p className="text-sm font-black text-slate-700">
            {formatador.format(valorTotal)}
          </p>
        </div>
      </div>
      
      <p className="text-[10px] text-amber-600 mt-4 font-black uppercase flex items-center gap-1">
        <span className="animate-pulse">⚡</span> Aguardando Início
      </p>

      {/* Marca d'água sutil no fundo */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none text-slate-900">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
}