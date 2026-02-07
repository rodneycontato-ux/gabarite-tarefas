"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function criarNotificacaoAction(data: { id_usuario: number | null, mensagem: string }) {
  // 1. Validação de Segurança (Somente Gerente/Nível 1)
  const session: any = await getServerSession(authOptions);
  if (Number(session?.user?.nivel) !== 1) {
    return { success: false, error: "Acesso negado: Apenas gerentes podem criar notificações." };
  }

  // 2. Validação de Conteúdo
  if (!data.mensagem || data.mensagem === "<p><br></p>") {
    return { success: false, error: "A mensagem não pode estar vazia." };
  }

  try {
    // 3. Inserção no Banco
    await prisma.notificacao.create({
      data: {
        id_usuario: data.id_usuario, // null = Global
        mensagem: data.mensagem,      // HTML vindo do Quill
        data_envio: new Date(),
      }
    });

    // 4. Atualizar a listagem automaticamente
    revalidatePath("/dashboard/notificacoes"); 
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar notificação:", error);
    return { success: false, error: "Erro interno ao salvar no banco de dados." };
  }
}