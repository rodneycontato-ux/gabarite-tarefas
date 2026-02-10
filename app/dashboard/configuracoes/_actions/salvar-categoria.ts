"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarCategoria(formData: FormData, id?: number) {
  try {
    const nome_categoria = formData.get("nome_categoria") as string;

    if (id) {
      // MODO EDIÇÃO
      await prisma.categoria.update({
        where: { id: id },
        data: { nome_categoria },
      });
    } else {
      // MODO CADASTRO
      await prisma.categoria.create({
        data: { nome_categoria },
      });
    }

    revalidatePath("/dashboard/configuracoes/categorias");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    return { error: "Erro ao processar categoria no banco." };
  }
}