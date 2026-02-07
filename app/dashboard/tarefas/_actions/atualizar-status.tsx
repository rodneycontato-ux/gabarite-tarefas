"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth"; // Importação necessária para pegar a sessão
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ajuste o caminho conforme seu projeto

export async function atualizarStatusPauta(id_pauta: any, novoStatus: number) {
  try {
    // 1. Pegamos a sessão atual para saber quem está logado
    const session = await getServerSession(authOptions) as any;
    const idUsuarioLogado = session?.user?.id_usuario;

    // 2. Garantimos que o ID da pauta seja um número
    const id = Number(id_pauta);

    // 3. Montamos o objeto de atualização
    const dadosParaAtualizar: any = {
      status: String(novoStatus),
    };

    // REGRA SOLICITADA: Se status for 3 (Iniciar), assume a autoria da tarefa
    if (novoStatus === 3) {
      if (!idUsuarioLogado) {
        return { success: false, error: "Usuário não identificado." };
      }
      
      dadosParaAtualizar.id_usuario = Number(idUsuarioLogado); // Atribui ao usuário logado
      dadosParaAtualizar.data_inicio = new Date(); // Registra o início
    }

    // Se status for 1 (Concluído), grava data_conclusao
    if (novoStatus === 1) {
      dadosParaAtualizar.data_conclusao = new Date();
    }

    // 4. Fazemos o update no banco legado
    await prisma.pauta.update({
      where: { 
        id_pauta: id 
      },
      data: dadosParaAtualizar,
    });

    // 5. Atualiza o cache da página
    revalidatePath("/dashboard/tarefas"); 
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status e usuário no banco:", error);
    return { success: false };
  }
}