"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function excluirSite(id: number) {
  try {
    // Como o banco é produção/legado, o Prisma só deletará se não houver pautas vinculadas
    await prisma.site.delete({
      where: { id_site: id },
    });
    
    revalidatePath("/dashboard/configuracoes/sites");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir site:", error);
    return { 
      error: "Não é possível excluir este site porque ele já possui pautas cadastradas vinculadas a ele." 
    };
  }
}