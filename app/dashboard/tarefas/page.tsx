import { prisma } from "@/lib/prisma";
import TarefaCard from "./_components/TarefaCard";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CustomSession {
  user?: {
    id_usuario?: number;
    nivel?: number;
  };
}

// Adicionamos o parâmetro 'status' na busca
async function getTarefas(nivel?: number, idUsuario?: number, statusFiltro?: string) {
  try {
    let whereCondition: any = {};

    // Filtro de Nível/Usuário (sua regra existente)
    if (nivel === 2) {
      whereCondition = {
        OR: [
          { id_usuario: idUsuario ? Number(idUsuario) : 0 },
          { id_usuario: null }
        ]
      };
    }

    // NOVO: Filtro de Status vindo da URL
    if (statusFiltro && statusFiltro !== "todos") {
      whereCondition.status = statusFiltro;
    }

    const tarefas = await prisma.pauta.findMany({
      where: whereCondition,
      orderBy: [
        { status: 'desc' }, 
        { data: 'desc' }
      ],
      take: 50,
      include: {
        usuario: true,
        site_relacionado: true,
        categoria_relacionada: true
      }
    });
    return tarefas;
  } catch (error) {
    console.error("Erro Prisma ao buscar tarefas:", error);
    return [];
  }
}

export default async function MuralTarefasPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ status?: string }> 
}) {
  const { status } = await searchParams;
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const nivel = session?.user?.nivel;
  const idUsuario = session?.user?.id_usuario;

  // Passamos o status atual para a função de busca
  const tarefas = await getTarefas(nivel, idUsuario, status);

  // Definição dos botões de filtro para o mapeamento
  const filtros = [
    { label: "Todos", value: "todos", color: "bg-slate-200 text-slate-600" },
    { label: "Pendente", value: "2", color: "bg-blue-100 text-blue-600" }, // Status 2 conforme sua lógica
    { label: "Aberto", value: "3", color: "bg-amber-100 text-amber-600" }, // Status 3
    { label: "Concluído", value: "1", color: "bg-emerald-100 text-emerald-600" }, // Status 1
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 leading-none">Tarefas</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">PROJETOS DISPONÍVEIS PARA PRODUÇÃO</p>
        </div>

        {nivel === 1 && (
          <Link 
            href="/dashboard/tarefas/cadastrar" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 flex items-center gap-3 active:scale-95 w-fit"
          >
            <span className="text-lg">+</span> Nova Tarefa
          </Link>
        )}
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filtros.map((f) => (
          <Link
            key={f.value}
            href={`/dashboard/tarefas?status=${f.value}`}
            className={`
              px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all
              ${(!status && f.value === "todos") || status === f.value 
                ? `${f.color} ring-2 ring-offset-2 ring-slate-200` 
                : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
              }
            `}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {tarefas.map((tarefa) => (
          <TarefaCard key={tarefa.id_pauta} tarefa={tarefa} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {tarefas.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <p className="text-slate-300 font-black uppercase italic">Nenhuma tarefa encontrada com este status.</p>
        </div>
      )}
    </div>
  );
}