"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { enviarEmail } from "@/lib/mail";
import { emailTemplates } from "@/lib/emailTemplates";

export async function atualizarStatusPauta(id_pauta: any, novoStatus: number, relato?: string) {
  try {
    const session = await getServerSession(authOptions) as any;
    const idUsuarioLogado = session?.user?.id_usuario;
    const nomeUsuario = session?.user?.name || "Um colaborador";

    if (!idUsuarioLogado) {
      return { success: false, error: "Sessão expirada." };
    }

    const id = Number(id_pauta);
    const dadosParaAtualizar: any = {
      status: String(novoStatus),
    };

    // --- REGRA: DESISTIR DA TAREFA (STATUS 2) ---
    if (novoStatus === 2) {
      dadosParaAtualizar.id_usuario = null;
      dadosParaAtualizar.data_inicio = null;
      dadosParaAtualizar.data_conclusao = null;
    }

    // --- REGRA: INICIAR TAREFA (STATUS 3) ---
    else if (novoStatus === 3) {
      const totalEmAndamento = await prisma.pauta.count({
        where: {
          id_usuario: Number(idUsuarioLogado),
          status: "3",
        },
      });

      if (totalEmAndamento >= 3) {
        return { success: false, error: "Você já possui 3 tarefas iniciadas." };
      }

      dadosParaAtualizar.id_usuario = Number(idUsuarioLogado);
      dadosParaAtualizar.data_inicio = new Date();
      dadosParaAtualizar.data_conclusao = null;
    }

    // --- REGRA: CONCLUIR TAREFA (STATUS 1) ---
    else if (novoStatus === 1) {
      dadosParaAtualizar.data_conclusao = new Date();
      
      if (relato) {
        dadosParaAtualizar.relato_colaborador = relato;
      }

      // 1. BUSCAMOS OS DADOS DA PAUTA PARA O E-MAIL
      const pautaAtual: any = await prisma.pauta.findUnique({
        where: { id_pauta: id },
        select: { titulo: true }
      });

      // 2. DISPARAMOS O E-MAIL USANDO O NOVO DICIONÁRIO
      if (pautaAtual) {
        await enviarEmail({
          para: process.env.SENDGRID_FROM_EMAIL as string,
          assunto: `✅ Tarefa Concluída: ${pautaAtual.titulo}`,
          // Parâmetros: (nomeAdmin, nomeRedator, conteudo, relato)
          conteudoHtml: emailTemplates.taskCompleted(
            "Administrador", 
            nomeUsuario, 
            pautaAtual.titulo, 
            relato
          )
        });
      }
    }

    // Execução do Update no banco legado
    await prisma.pauta.update({
      where: { id_pauta: id },
      data: dadosParaAtualizar,
    });

    revalidatePath("/dashboard/tarefas"); 
    return { success: true };

  } catch (error) {
    console.error("Erro na Action atualizarStatusPauta:", error);
    return { success: false, error: "Erro ao atualizar banco de dados." };
  }
}