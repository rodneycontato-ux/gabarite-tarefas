import { prisma } from "@/lib/prisma";
import Link from 'next/link';

export default async function ResumoAdmin() {
  // Buscamos todos os dados do banco em paralelo
  const [pagamentosAgregado, dadosProducao, totalFluxo, resultadoPendentes] = await Promise.all([
    // 1. Dados de Pagamentos Pendentes
    prisma.pagamentos.aggregate({
      where: { status: "pendente" },
      _count: { id_pagamento: true },
      _sum: { total_valor: true },
    }),
    // 2. Dados de Tarefas Iniciadas (Status 3)
    prisma.pauta.aggregate({
      where: { status: "3" },
      _count: { id_pauta: true },
      _sum: { preco: true },
    }),
    // 3. Contagem total para o fluxo (Status 2 e 3)
    prisma.pauta.count({
      where: { status: { in: ["2", "3"] } }
    }),
    // 4. Dados de Tarefas Pendentes (Status 2)
    prisma.pauta.aggregate({
      where: { status: "2" },
      _count: { id_pauta: true },
      _sum: { preco: true },
    })
  ]);

  // Formatação
  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* CARD 1: TAREFAS PENDENTES */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Tarefas Pendentes
            </p>
            <h3 className="text-3xl font-black text-slate-900 italic font-mono">
              {(resultadoPendentes._count.id_pauta || 0).toString().padStart(2, "0")}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-300 uppercase italic">Custo Previsto</p>
            <p className="text-sm font-black text-slate-700">
              {formatador.format(resultadoPendentes._sum.preco || 0)}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-amber-600 mt-4 font-black uppercase flex items-center gap-1">
          <span className="animate-pulse">⚡</span> Aguardando Início
        </p>
        <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none text-slate-900">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* CARD 2: TAREFAS ABERTAS (INICIADAS) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Tarefas Abertas
            </p>
            <h3 className="text-3xl font-black text-slate-900 italic font-mono">
              {(dadosProducao._count.id_pauta || 0).toString().padStart(2, "0")}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-300 uppercase italic">Custo Previsto</p>
            <p className="text-sm font-black text-blue-600">
              {formatador.format(dadosProducao._sum.preco || 0)}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-red-600 mt-4 font-black uppercase flex items-center gap-1">
          <span className="animate-pulse">⚡</span> Iniciadas Agora
        </p>
        <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none text-blue-900">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
      </div>

      {/* CARD 3: PAGAMENTOS PENDENTES */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Tarefas Concluídas
            </p>
            <h3 className="text-3xl font-black text-slate-900 italic font-mono">
              {(pagamentosAgregado._count.id_pagamento || 0).toString().padStart(2, "0")}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-300 uppercase italic">Total à Pagar</p>
            <p className="text-lg font-black text-emerald-600 italic">
              {formatador.format(Number(pagamentosAgregado._sum.total_valor) || 0)}
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/pagamentos"
          className="w-full py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 relative z-10 flex items-center justify-center text-center"
        >
          Efetuar Pagamentos
        </Link>
        <div className="absolute -right-2 -top-2 opacity-[0.05] pointer-events-none text-emerald-900">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      </div>

    </div>
  );
}