import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CustomSession {
  user?: {
    id_usuario: number;
  };
}

export default async function PautasDisponiveis() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const idUsuario = session?.user?.id_usuario;

  if (!idUsuario) return null;

  try {
    // 1. Filtro base (o mesmo para contagem e soma)
    const filtro = {
      status: "2",
      OR: [
        { id_usuario: Number(idUsuario) },
        { id_usuario: null }
      ]
    };

    // 2. Buscamos a contagem e a soma dos preços simultaneamente
    const [total, soma] = await Promise.all([
      prisma.pauta.count({ where: filtro }),
      prisma.pauta.aggregate({
        where: filtro,
        _sum: {
          preco: true
        }
      })
    ]);

    const valorPrevisao = soma._sum.preco || 0;

    return (
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
              {total}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase italic">
              Pendentes
            </span>
          </div>
          
          {/* TEXTINHO COM A PREVISÃO DE VALOR */}
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            Previsão: R$ {valorPrevisao.toFixed(2)}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro Prisma PautasDisponiveis:", error);
    return null;
  }
}