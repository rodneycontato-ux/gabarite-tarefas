import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// A função GET é o "ponto de entrada". Quando o Cron acessa a URL, ele cai aqui.
export async function GET(request: Request) {
  
  // --- 1. CAMADA DE SEGURANÇA ---
  // COMENTE estas linhas no route.ts para testar no Chrome:
  /*
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  */

  try {
    // --- 2. CÁLCULO DO PERÍODO ---
    const hoje = new Date();
    
    // Criamos uma data baseada no "mês - 1". Se hoje é Fevereiro (1), vira Janeiro (0).
    const dataMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    
    // Extraímos o mês e ano para usar nos filtros e na gravação do registro.
    const mes = dataMesPassado.getMonth() + 1; // Ajustamos pois JS conta meses de 0 a 11.
    const ano = dataMesPassado.getFullYear();

    // --- 3. INTELIGÊNCIA DE DADOS (PRISMA) ---
    // O groupBy é poderoso: ele percorre a tabela 'pauta', filtra e já faz a soma.
    const pautasConcluidas = await prisma.pauta.groupBy({
      by: ['id_usuario'], // Agrupa os resultados por colaborador
      where: {
        status: "1",      // Critério: Apenas pautas com status 'Concluído'
        id_usuario: { not: null }, // Segurança: Ignora pautas sem dono
        data_conclusao: {
          // Filtra pautas concluídas entre o dia 1 do mês passado e o dia 1 deste mês
          gte: new Date(ano, mes - 1, 1),
          lt: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
        }
      },
      _sum: {
        preco: true      // Soma o campo 'preco' (total_valor)
      },
      _count: {
        id_pauta: true   // Conta quantas pautas foram feitas (total_itens)
      }
    });

    // Criamos uma lista vazia para registrar o que aconteceu em cada processamento.
    const resultados = [];

    // --- 4. GRAVAÇÃO NO BANCO DE DADOS ---
    // Percorremos o resumo de cada colaborador encontrado no passo anterior.
    for (const resumo of pautasConcluidas) {
      const idUsuario = resumo.id_usuario!;
      const totalValor = resumo._sum.preco || 0;
      const totalItens = resumo._count.id_pauta;

      // VERIFICAÇÃO DE DUPLICIDADE (Crucial para produção):
      // O findUnique usa a chave 'id_usuario_ano_mes' que o Prisma criou 
      // automaticamente por causa do seu @@unique no schema.
      const existe = await prisma.pagamentos.findUnique({
        where: {
          id_usuario_ano_mes: {
            id_usuario: idUsuario,
            ano: ano,
            mes: mes
          }
        }
      });

      // Se o pagamento não existe e o colaborador produziu algo (valor > 0):
      if (!existe && totalValor > 0) {
        // Criamos o registro na tabela de pagamentos.
        await prisma.pagamentos.create({
          data: {
            id_usuario: idUsuario,
            ano: ano,
            mes: mes,
            total_itens: totalItens,
            total_valor: totalValor,
            status: "pendente", // Status inicial do seu Enum
            criado_em: new Date()
          }
        });
        resultados.push({ usuario: idUsuario, status: "Gerado" });
      } else {
        // Se já existia, o código pula este usuário para não duplicar o valor.
        resultados.push({ usuario: idUsuario, status: "Pulado (Já existe ou valor 0)" });
      }
    }

    // Retornamos um JSON com o resumo de tudo o que foi feito.
    return NextResponse.json({ 
      success: true, 
      periodo: `${mes}/${ano}`, 
      relatorio: resultados 
    });

  } catch (error: any) {
    // Se houver qualquer erro no MySQL ou no código, ele cai aqui.
    console.error("ERRO NO FECHAMENTO:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}