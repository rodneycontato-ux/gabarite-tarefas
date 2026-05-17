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

  // Pegamos o mês e ano atual para comparar qual é o mês corrente
  const hoje = new Date();
  const mesAtualIndex = hoje.getMonth();
  const anoAtualAtual = hoje.getFullYear();

  // 1. Define o período: 12 meses atrás até hoje
  const dataInicio = new Date();
  dataInicio.setMonth(dataInicio.getMonth() - 11);
  dataInicio.setDate(1);
  dataInicio.setHours(0, 0, 0, 0);

  // 2. Busca pagamentos APENAS deste colaborador
  const pagamentos = await prisma.pagamentos.findMany({
    where: {
      id_usuario: Number(idUsuario), 
      criado_em: { gte: dataInicio }
    },
    select: { total_valor: true, criado_em: true },
    orderBy: { criado_em: 'asc' }
  });

  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Helper para formatar em formato de dinheiro (R$)
  const money = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  // 3. Monta a estrutura dos últimos 12 meses cronologicamente
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

    // Identifica se este mês do loop é exatamente o mês atual
    const isMesAtual = mesIndex === mesAtualIndex && ano === anoAtualAtual;

    dataFinal.push({
      mes: label,
      total: totalMes,
      isMesAtual: isMesAtual
    });
  }

  return (
    <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-black italic uppercase text-slate-800">Histórico de Pagamentos</h3>
        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Últimos 12 meses</p>
      </div>
      
      {/* Gráfico Visual */}
      <div className="h-75 w-full">
        <GraficoVisual data={dataFinal} />
      </div>

      {/* Lista com os valores em formato de dinheiro e mês atual em cor diferente */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
        {dataFinal.map((item, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-xl border flex flex-col justify-center text-center transition-all ${
              item.isMesAtual 
                ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" // Mês atual com cor diferente
                : "bg-slate-50/50 border-slate-100 text-slate-700"
            }`}
          >
            <span className={`text-xs font-black uppercase tracking-wider ${item.isMesAtual ? "text-blue-600" : "text-slate-400"}`}>
              {item.mes}
            </span>
            <span className="text-sm font-bold mt-1">
              {money(item.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}