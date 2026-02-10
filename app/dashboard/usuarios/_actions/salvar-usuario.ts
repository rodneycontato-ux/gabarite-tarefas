"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarUsuario(formData: FormData, id?: number) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const nivel = Number(formData.get("nivel"));
  const pix = formData.get("pix") as string;

  try {
    if (id) {
      await prisma.usuario.update({
        where: { id_usuario: id },
        data: { nome, email, nivel, pix },
      });
    } else {
      await prisma.usuario.create({
        data: { 
          nome, email, nivel, pix, 
          status: 1, 
          data: new Date(),
          senha: "123" // Senha padrão para novos
        },
      });
    }
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao salvar usuário." };
  }
}

export async function excluirUsuario(id: number) {
  try {
    await prisma.usuario.delete({ where: { id_usuario: id } });
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2003") {
      return { error: "Não é possível excluir: este usuário possui pautas ou pagamentos vinculados." };
    }
    return { error: "Erro ao excluir usuário." };
  }
}