"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function excluirCategoria(id: number) {
  try {
    await prisma.categoria.delete({
      where: { id: id },
    });
    revalidatePath("/dashboard/configuracoes/categorias");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir:", error);
    return { error: "Não é possível excluir: esta categoria possui pautas vinculadas." };
  }
}