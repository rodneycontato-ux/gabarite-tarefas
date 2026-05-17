import { prisma } from "@/lib/prisma";

export default async function UltimasTarefasConcluidas() {
  // Busca as últimas 10 pautas concluídas do sistema geral (Gerente)
  const ultimasPautas = await prisma.pauta.findMany({
    where: {
      status: "1", // Status de concluída conforme seu padrão
    },
    include: {
      usuario: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: {
      data_conclusao: "desc", // Traz as mais recentes primeiro
    },
    take: 6, // Limita nas últimas 10 para não estourar a tela
  });

  // Helper para formatar em formato de dinheiro (R$)
  const money = (valor: number | null) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);

  // Helper para formatar datas (DD/MM/AAAA às HH:MM)
  const formatarData = (data: Date | null) => {
    if (!data) return "--/--/----";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data));
  };

  return (
    <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-black italic uppercase text-slate-800">
          Últimas Entregas
        </h3>
        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
          Histórico recente de pautas concluídas
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ultimasPautas.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-4">
            Nenhuma tarefa concluída encontrada.
          </p>
        ) : (
          ultimasPautas.map((pauta) => (
            <div
              key={pauta.id_pauta}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-200"
            >
              {/* Informações da Pauta e Quem Fez */}
              <div className="flex flex-col gap-1 max-w-xl">
                <span className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-1">
                  {pauta.titulo || "Tarefa sem título"}
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 font-bold">
                  <span className="text-blue-600 uppercase italic">
                    {pauta.usuario?.nome || "Colaborador Externo"}
                  </span>
                  <span>•</span>
                  <span>Início: {formatarData(pauta.data_inicio)}</span>
                  <span>•</span>
                  <span className="text-emerald-600">Fim: {formatarData(pauta.data_conclusao)}</span>
                </div>
              </div>

              {/* Valor Recebido/Pago */}
              <div className="text-left sm:text-right shrink-0">
                <span className="text-base font-black text-slate-900 font-mono block">
                  {money(pauta.preco)}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Concluída
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}