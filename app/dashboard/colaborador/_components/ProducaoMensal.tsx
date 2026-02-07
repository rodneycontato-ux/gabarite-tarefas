import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CustomSession {
  user?: { id_usuario: number };
}

export default async function ProducaoMensal() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const idUsuario = session?.user?.id_usuario;

  if (!idUsuario) return null;

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Busca apenas pautas concluídas (Status 1) deste usuário
  const pautasConcluidas = await prisma.pauta.findMany({
    where: {
      id_usuario: Number(idUsuario),
      status: "1",
    },
    select: { 
      preco: true, 
      data_conclusao: true 
    }
  });

  // Soma apenas o que foi concluído dentro do mês e ano vigentes
  const totalMes = pautasConcluidas
    .filter(p => {
      if (!p.data_conclusao) return false;
      const d = new Date(p.data_conclusao);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    })
    .reduce((acc, curr) => acc + (curr.preco || 0), 0);

  const money = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="h-32 bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
      {/* Ícone fixo em Verde */}
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl">
        💰
      </div>
      
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">
          Produção (Mensal)
        </p>
        
        <div className="flex flex-col">
          <span className="text-3xl font-black text-slate-900 leading-none tracking-tight">
            {money(totalMes)}
          </span>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase italic">
            Saldo de {hoje.toLocaleString('pt-BR', { month: 'long' })}
          </p>
        </div>
      </div>
    </div>
  );
}