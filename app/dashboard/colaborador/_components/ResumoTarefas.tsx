import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CustomSession {
  user?: { id_usuario: number };
}

export default async function ResumoFinanceiro() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const idUsuario = session?.user?.id_usuario;

  if (!idUsuario) return null;

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  try {
    // Buscamos todos os dados necessários em paralelo
    const [pendentesData, iniciadasData, concluidasData] = await Promise.all([
      // 1. TAREFAS DISPONÍVEIS (Status 2)
      prisma.pauta.aggregate({
        where: {
          status: "2",
          OR: [{ id_usuario: Number(idUsuario) }, { id_usuario: null }],
        },
        _count: true,
        _sum: { preco: true },
      }),

      // 2. TAREFAS INICIADAS (Status 3)
      prisma.pauta.findMany({
        where: { id_usuario: Number(idUsuario), status: "3" },
        select: { preco: true },
      }),

      // 3. TAREFAS FINALIZADAS (Status 1)
      prisma.pauta.findMany({
        where: { id_usuario: Number(idUsuario), status: "1" },
        select: { preco: true, data_conclusao: true },
      }),
    ]);

    // Cálculos Pendentes
    const totalPendentes = pendentesData._count || 0;
    const valorPendentes = pendentesData._sum.preco || 0;

    // Cálculos Iniciadas
    const totalIniciadas = iniciadasData.length;
    const valorIniciadas = iniciadasData.reduce((acc, curr) => acc + (curr.preco || 0), 0);

    // Cálculos Finalizadas (Filtrando mês atual)
    const pautasDoMes = concluidasData.filter((p) => {
      if (!p.data_conclusao) return false;
      const d = new Date(p.data_conclusao);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });
    const totalConcluidas = pautasDoMes.length;
    const valorConcluidas = pautasDoMes.reduce((acc, curr) => acc + (curr.preco || 0), 0);

    // Helper para moeda
    const money = (valor: number) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: DISPONÍVEIS */}
        <div className="h-32 bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
            📝
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Tarefas Disponíveis
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                {totalPendentes}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase italic">Pendentes</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Total: R$ {valorPendentes.toFixed(2)}
            </p>
          </div>
        </div>

        {/* CARD 2: INICIADAS */}
        <div className="h-32 bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-3xl group-hover:text-blue-500 transition-colors">
            ⏳
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Tarefas Iniciadas
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                {totalIniciadas}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase italic">Abertas</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Total: {money(valorIniciadas)}
            </p>
          </div>
        </div>

        {/* CARD 3: FINALIZADAS */}
        <div className="h-32 bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
            💰
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Tarefas Finalizadas
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
                {totalConcluidas}
              </span>
              <span className="text-sm font-bold text-slate-400 uppercase italic">Concluídas</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Total: <span className="text-emerald-600 font-black">{money(valorConcluidas)}</span>
            </p>
          </div>
        </div>

      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar resumo financeiro:", error);
    return null;
  }
}