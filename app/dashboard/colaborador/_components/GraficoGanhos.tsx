import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GraficoVisual from "../../_components/GraficoVisual";

interface CustomSession {
  user?: { id_usuario: number };
}

export default async function GraficoGanhos() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const idUsuario = session?.user?.id_usuario;

  if (!idUsuario) return null;

  // 1. Define o período: 12 meses atrás até hoje
  const dataInicio = new Date();
  dataInicio.setMonth(dataInicio.getMonth() - 11);
  dataInicio.setDate(1);
  dataInicio.setHours(0, 0, 0, 0);

  // 2. Busca pagamentos APENAS deste colaborador
  const pagamentos = await prisma.pagamentos.findMany({
    where: {
      id_usuario: Number(idUsuario), // Filtro essencial para o colaborador
      criado_em: { gte: dataInicio }
    },
    select: { total_valor: true, criado_em: true },
    orderBy: { criado_em: 'asc' }
  });

  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 3. Monta a estrutura dos últimos 12 meses cronologicamente
  // Usamos um array para manter a ordem exata sem depender de sorteio de chaves de objeto
  const dataFinal = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    
    const mesIndex = d.getMonth();
    const ano = d.getFullYear();
    const label = mesesNomes[mesIndex];

    // Calculamos o total para este mês específico
    const totalMes = pagamentos
      .filter(p => {
        const pData = new Date(p.criado_em!);
        return pData.getMonth() === mesIndex && pData.getFullYear() === ano;
      })
      .reduce((sum, current) => sum + Number(current.total_valor), 0);

    dataFinal.push({
      mes: label,
      total: totalMes
    });
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-black italic uppercase text-slate-800">Histórico de Ganhos</h3>
        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Últimos 12 meses</p>
      </div>
      
      <div className="h-[300px] w-full">
        <GraficoVisual data={dataFinal} />
      </div>
    </div>
  );
}