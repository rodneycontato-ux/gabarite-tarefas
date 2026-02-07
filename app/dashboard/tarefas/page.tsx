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

async function getTarefas(nivel?: number, idUsuario?: number) {
  try {
    let whereCondition: any = {};

    if (nivel === 2) {
      whereCondition = {
        OR: [
          { id_usuario: idUsuario ? Number(idUsuario) : 0 },
          { id_usuario: null }
        ]
      };
    }

    const tarefas = await prisma.pauta.findMany({
      where: whereCondition,
      // ORDENAÇÃO: Status 3 primeiro, depois 2, depois 1. 
      // Se os status forem iguais, ordena pela data mais recente.
      orderBy: [
        { status: 'desc' }, 
        { data: 'desc' }
      ],
      take: 20,
      include: {
        usuario: true 
      }
    });
    return tarefas;
  } catch (error) {
    console.error("Erro Prisma:", error);
    return [];
  }
}

export default async function MuralTarefasPage() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const nivel = session?.user?.nivel;
  const idUsuario = session?.user?.id_usuario;

  const tarefas = await getTarefas(nivel, idUsuario);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* HEADER COM TÍTULO E BOTÃO NOVO */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 leading-none">Tarefas</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">PROJETOS DISPONÍVEIS PARA PRODUÇÃO</p>
        </div>

        {/* EXIBIR BOTÃO DE CADASTRO APENAS PARA GERENTE (NÍVEL 1) */}
        {nivel === 1 && (
          <Link 
            href="/dashboard/tarefas/cadastrar" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 flex items-center gap-3 active:scale-95 w-fit"
          >
            <span className="text-lg">+</span>
            Nova Tarefa
          </Link>
        )}

      </div>

      {/* Grid chamando o componente de Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {tarefas.map((tarefa) => (
          <TarefaCard key={tarefa.id_pauta} tarefa={tarefa} />
        ))}
      </div>

      {/* Empty State */}
      {tarefas.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <p className="text-slate-300 font-black uppercase italic">Nenhuma pauta encontrada no banco de dados.</p>
        </div>
      )}
    </div>
  );
}