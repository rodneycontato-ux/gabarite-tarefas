import { prisma } from "@/lib/prisma";

export default async function TarefasIniciadas() {
  // 1. Buscamos os dados necessários no banco legado
  // Buscamos o total de status 3 (Em Produção) e status 2 (Aguardando Revisão/Ajuste, por exemplo)
  const [dadosProducao, dadosTotalFluxo] = await Promise.all([
    // Apenas o que está em produção agora (Status 3)
    prisma.pauta.aggregate({
      where: { status: "3" },
      _count: { id_pauta: true },
      _sum: { preco: true },
    }),
    // O total do fluxo ativo (Status 2 + Status 3)
    prisma.pauta.count({
      where: {
        status: { in: ["2", "3"] }
      }
    })
  ]);

  const totalStatus3 = dadosProducao._count.id_pauta || 0;
  const custoStatus3 = dadosProducao._sum.preco || 0;
  const totalFluxo = dadosTotalFluxo || 0;

  // 2. Cálculo da Porcentagem
  // Evitamos divisão por zero se o fluxo estiver vazio
  const porcentagemFluxo = totalFluxo > 0 
    ? Math.round((totalStatus3 / totalFluxo) * 100) 
    : 0;

  // 3. Formatação de Moeda
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(custoStatus3);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Tarefas Abertas
          </p>
          <h3 className="text-3xl font-black text-slate-900 italic font-mono">
            {totalStatus3.toString().padStart(2, "0")}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-300 uppercase italic">
            Custo Previsto
          </p>
          <p className="text-sm font-black text-blue-600">
            {valorFormatado}
          </p>
        </div>
      </div>

      

      <p className="text-[10px] text-red-600 mt-4 font-black uppercase flex items-center gap-1">
        <span className="animate-pulse">⚡</span> Iniciadas Agora
      </p>

      {/* Ícone decorativo de engrenagem/processo */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none text-blue-900">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
    </div>
  );
}