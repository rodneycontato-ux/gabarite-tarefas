import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CustomSession {
  user?: { id_usuario: number };
}

export default async function ProducaoPotencial() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const idUsuario = session?.user?.id_usuario;

  if (!idUsuario) return null;

  const pautasProduzindo = await prisma.pauta.findMany({
    where: {
      id_usuario: Number(idUsuario),
      status: "3",
    },
    select: { 
      preco: true 
    }
  });

  const totalPotencial = pautasProduzindo.reduce((acc, curr) => acc + (curr.preco || 0), 0);

  const money = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="h-32 bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
      {/* Ícone discreto em cinza/azul */}
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-3xl group-hover:text-blue-500 transition-colors">
        ⏳
      </div>
      
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
          Tarefas Iniciadas
        </p>
        
        <div className="flex flex-col">
          {/* Quantidade em destaque principal */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">
              {pautasProduzindo.length}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase italic">
              Abertas
            </span>
          </div>
          
          {/* Valor financeiro bem discreto e pequeno */}
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            Previsão: {money(totalPotencial)}
          </p>
        </div>
      </div>
    </div>
  );
}