"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function excluirPauta(id: number) {
  try {
    await prisma.pauta.delete({
      where: { id_pauta: id },
    });
  } catch (error) {
    return { error: "Não foi possível excluir a pauta. Verifique se ela possui dependências." };
  }

  revalidatePath("/dashboard/tarefas");
  redirect("/dashboard/tarefas"); // Redireciona após excluir
}