import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";

export default async function ResumoAdmin() {
  // Mantemos a validação apenas para garantir que existe uma sessão ativa
  const session = await getServerSession(authOptions);
  if (!session) return null;

  try {
    // Buscamos todos os dados globais do banco em paralelo (Sem filtros de usuário e sem filtros de data)
    const [pendentesData, iniciadasData, concluidasData] = await Promise.all([
      // 1. TAREFAS DISPONÍVEIS GERAL (Status 2)
      prisma.pauta.aggregate({
        where: { status: "2" },
        _count: true,
      }),

      // 2. TAREFAS INICIADAS GERAL (Status 3)
      prisma.pauta.aggregate({
        where: { status: "3" },
        _count: true,
      }),

      // 3. TAREFAS FINALIZADAS GERAL (Status 1)
      prisma.pauta.aggregate({
        where: { status: "1" },
        _count: true,
      }),
    ]);

    // Totais acumulados de todo o sistema
    const totalPendentes = pendentesData._count || 0;
    const totalIniciadas = iniciadasData._count || 0;
    const totalConcluidas = concluidasData._count || 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: DISPONÍVEIS */}
        <div className="h-32 bg-white border border-slate-100 rounded-4xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Tarefas Disponíveis
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                {totalPendentes}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase italic">Pendentes</span>
            </div>
          </div>
        </div>

        {/* CARD 2: INICIADAS */}
        <div className="h-32 bg-white border border-slate-100 rounded-4xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-8 h-8" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Tarefas Iniciadas
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                {totalIniciadas}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase italic">Abertas</span>
            </div>
          </div>
        </div>

        {/* CARD 3: FINALIZADAS */}
        <div className="h-32 bg-white border border-slate-100 rounded-4xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Total Concluídas
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                {totalConcluidas}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase italic">Concluídas</span>
            </div>
          </div>
        </div>

      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar resumo administrativo:", error);
    return null;
  }
}