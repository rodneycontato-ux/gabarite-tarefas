"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarUsuario(formData: FormData, id?: number) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const pix = formData.get("pix") as string;
  const nivelRaw = formData.get("nivel");

  try {
    if (id) {
      const dadosUpdate: any = { 
        nome: nome || "", 
        email: email || "", 
        pix: pix || "" 
      };

      if (nivelRaw !== null && nivelRaw !== undefined) {
        dadosUpdate.nivel = Number(nivelRaw);
      }

      await prisma.usuario.update({
        where: { id_usuario: Number(id) },
        data: dadosUpdate,
      });
    } else {
      await prisma.usuario.create({
        data: {
          nome: nome || "",
          email: email || "",
          pix: pix || "",
          nivel: nivelRaw !== null ? Number(nivelRaw) : 2,
          status: 1,
          data: new Date(), 
          senha: "123",
        },
      });
    }

    revalidatePath("/dashboard/usuarios");
    revalidatePath("/"); 
    return { success: true };

  } catch (error: any) {
    console.error("ERRO PRISMA:", error);
    return { error: "Erro ao salvar: Verifique se o e-mail já existe." };
  }
}

// --- FUNÇÃO DE EXCLUSÃO QUE ESTAVA FALTANDO ---
export async function excluirUsuario(id: number) {
  try {
    // Aprendizado: No seu banco de produção, se o usuário tiver pautas ou 
    // pagamentos vinculados (Foreign Key), o banco vai impedir a exclusão.
    // Usamos Number(id) para garantir que o tipo coincida com o schema.
    await prisma.usuario.delete({
      where: { id_usuario: Number(id) }
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };

  } catch (error: any) {
    console.error("ERRO AO EXCLUIR:", error);

    // Aprendizado: Erro P2003 do Prisma indica violação de integridade.
    // Isso acontece se ele tiver pautas/notificações gravadas com o ID dele.
    if (error.code === 'P2003') {
        return { error: "Não é possível excluir: Este usuário possui registros (pautas/pagamentos) vinculados." };
    }

    return { error: "Erro interno ao tentar excluir o usuário." };
  }
}