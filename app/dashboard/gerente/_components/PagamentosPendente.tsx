import { prisma } from "@/lib/prisma";
import Link from 'next/link'; // Não esqueça de importar no topo do arquivo

export default async function PagamentosPendente() {
  const agregado = await prisma.pagamentos.aggregate({
    where: {
      status: "pendente",
    },
    _count: {
      id_pagamento: true,
    },
    _sum: {
      total_valor: true,
    },
  });

  const quantidadePendentes = agregado._count.id_pagamento || 0;
  const valorTotal = Number(agregado._sum.total_valor) || 0;

  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    /* ADICIONADO: relative e overflow-hidden para o ícone não estourar a página */
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Pagamentos Pendentes
          </p>
          <h3 className="text-3xl font-black text-slate-900 italic font-mono">
            {quantidadePendentes.toString().padStart(2, "0")}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-300 uppercase italic">
            Total Pendente
          </p>
          <p className="text-lg font-black text-emerald-600 italic">
            {formatador.format(valorTotal)}
          </p>
        </div>
      </div>

      <Link 
      href="/dashboard/pagamentos"
      className="w-full py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 relative z-10 flex items-center justify-center text-center"
    >
      Efetuar Pagamentos
    </Link>
      
      {/* O ícone agora está contido pelo overflow-hidden da div pai */}
      <div className="absolute -right-2 -top-2 opacity-[0.05] pointer-events-none text-emerald-900">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    </div>
  );
}