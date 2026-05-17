import { prisma } from "@/lib/prisma";
import GraficoVisual from "../../_components/GraficoVisual";

export default async function GraficoCustos() {
  // Pegamos o mês atual para comparar na listagem visual
  const hoje = new Date();
  const mesAtualIndex = hoje.getMonth();

  // 1. Define a data de 12 meses atrás
  const dozeMesesAtras = new Date();
  dozeMesesAtras.setMonth(dozeMesesAtras.getMonth() - 11);
  dozeMesesAtras.setDate(1); // Começa no dia 1 do mês

  // 2. Busca apenas pagamentos desse período (Todos os dados para o gerente)
  const pagamentos = await prisma.pagamentos.findMany({
    where: {
      criado_em: { gte: dozeMesesAtras }
    },
    select: { total_valor: true, criado_em: true },
    orderBy: { criado_em: 'asc' }
  });

  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Helper para formatar em formato de dinheiro (R$)
  const money = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  // 3. Cria um mapa com todos os últimos 12 meses zerados (Sua lógica original do gerente)
  const ultimos12Meses: { [key: string]: number } = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const nome = mesesNomes[d.getMonth()];
    ultimos12Meses[nome] = 0;
  }

  // 4. Preenche com os valores do banco
  pagamentos.forEach((item) => {
    if (item.criado_em) {
      const nomeMes = mesesNomes[item.criado_em.getMonth()];
      if (ultimos12Meses[nomeMes] !== undefined) {
        ultimos12Meses[nomeMes] += Number(item.total_valor);
      }
    }
  });

  // 5. Converte para o formato do gráfico mantendo a sua ordem cronológica e o isMesAtual
  const dataFinal = Object.keys(ultimos12Meses)
    .reverse() // Inverte para o mês atual ser o último
    .map(mes => {
      const isMesAtual = mes === mesesNomes[mesAtualIndex];

      return {
        mes: mes,
        total: ultimos12Meses[mes],
        isMesAtual: isMesAtual
      };
    });

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