"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarPauta(formData: FormData) {
  const session = await getServerSession(authOptions) as any;

  if (!session?.user?.id_usuario) {
    return { error: "Acesso negado. Faça login novamente." };
  }

  // 1. Extração dos dados e conversão para os tipos do Schema
  const titulo = formData.get("titulo") as string;
  const precoRaw = formData.get("preco") as string;
  const dataInicioRaw = formData.get("data_inicio") as string;
  const dataConclusaoRaw = formData.get("data_conclusao") as string;

  // PEGAMOS OS IDS (convertendo para Number, pois o Prisma exige Int no banco)
  const idSiteRaw = formData.get("id_site"); 
  const idCategoriaRaw = formData.get("id_categoria");

  try {
    await prisma.pauta.create({
      data: {
        id_usuario: Number(session.user.id_usuario),
        titulo: titulo,
        
        // SALVANDO AS RELAÇÕES (Chaves Estrangeiras)
        id_site: idSiteRaw ? Number(idSiteRaw) : null,
        id_categoria: idCategoriaRaw ? Number(idCategoriaRaw) : null,

        status: (formData.get("status") as string) || "2", // Geralmente inicia como disponível (2) ou aguardando (3)
        texto: formData.get("texto") as string,
        preco: precoRaw ? parseFloat(precoRaw) : null,
        data: new Date(),
        data_inicio: dataInicioRaw ? new Date(dataInicioRaw) : null,
        data_conclusao: dataConclusaoRaw ? new Date(dataConclusaoRaw) : null,
      }
    });

    // Limpa o cache para a nova pauta aparecer imediatamente no mural
    revalidatePath("/dashboard/tarefas");

    return { success: true }; 
  } catch (error) {
    console.error("Erro ao inserir pauta:", error);
    return { error: "Falha ao salvar no banco. Verifique as chaves estrangeiras." };
  }
}