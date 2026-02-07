import { prisma } from "@/lib/prisma";
import GraficoVisual from "../../_components/GraficoVisual";

export default async function GraficoCustos() {
  // 1. Define a data de 12 meses atrás
  const dozeMesesAtras = new Date();
  dozeMesesAtras.setMonth(dozeMesesAtras.getMonth() - 11);
  dozeMesesAtras.setDate(1); // Começa no dia 1 do mês

  // 2. Busca apenas pagamentos desse período
  const pagamentos = await prisma.pagamentos.findMany({
    where: {
      criado_em: { gte: dozeMesesAtras }
    },
    select: { total_valor: true, criado_em: true },
    orderBy: { criado_em: 'asc' }
  });

  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // 3. Cria um mapa com todos os últimos 12 meses zerados (para não faltar mês no gráfico)
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

  // 5. Converte para o formato do gráfico mantendo a ordem cronológica
  const dataFinal = Object.keys(ultimos12Meses)
    .reverse() // Inverte para o mês atual ser o último
    .map(mes => ({
      mes: mes,
      total: ultimos12Meses[mes]
    }));

  return <GraficoVisual data={dataFinal} />;
}