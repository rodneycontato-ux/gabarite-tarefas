"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function pagarColaboradorAction(idPagamento: number) {
  try {
    // 1. Busca os dados no banco legado para validação
    const pag = await prisma.pagamentos.findUnique({
      where: { id_pagamento: idPagamento },
    });

    if (!pag) {
      return { error: "Este pagamento não existe no banco de dados." };
    }

    if (pag.status === 'pago') {
      return { error: "Este pagamento já foi processado anteriormente." };
    }

    // 2. ATUALIZAÇÃO NO BANCO LEGADO
    // Apenas mudamos o status e registramos a data
    await prisma.pagamentos.update({
      where: { id_pagamento: idPagamento },
      data: {
        status: 'pago',
        data_pagamento: new Date(),
      }
    });

    // 3. Revalida o cache da página de listagem
    revalidatePath("/dashboard/pagamentos");
    
    return { success: true };

  } catch (error: any) {
    console.error("ERRO AO ATUALIZAR STATUS NO BANCO:", error);
    return { error: "Erro de conexão com o banco de dados legado." };
  }
}