"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function editarPauta(id: number, formData: FormData) {
  try {
    // 1. Extração dos dados do FormData (Incluindo o Novo Título)
    const titulo = formData.get("titulo") as string;
    const site = formData.get("site") as string;
    const categoria = formData.get("categoria") as string;
    const precoRaw = formData.get("preco") as string;
    const status = formData.get("status") as string;
    const texto = formData.get("texto") as string;

    // 2. Tratamento do preço para o formato do banco (Decimal/Float)
    const preco = precoRaw ? parseFloat(precoRaw) : 0;

    // 3. Atualização no banco legado usando o Prisma
    await prisma.pauta.update({
      where: {
        id_pauta: id,
      },
      data: {
        titulo,    // ATUALIZANDO O TÍTULO
        site,
        categoria,
        preco,
        status,
        texto,
      },
    });

    // 4. Limpa o cache para os dados novos aparecerem no mural
    // Ajustei o path para pegar a raiz de tarefas onde ficam os cards
    revalidatePath("/dashboard/tarefas");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao editar pauta:", error);
    return { error: "Falha ao atualizar a pauta no banco de dados." };
  }
}