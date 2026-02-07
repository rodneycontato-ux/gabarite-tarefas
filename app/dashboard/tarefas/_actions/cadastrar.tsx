"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function criarPauta(formData: FormData) {
  const session = await getServerSession(authOptions) as any;

  if (!session?.user?.id_usuario) {
    return { error: "Acesso negado. Faça login novamente." };
  }

  // Extraindo os campos do FormData
  const titulo = formData.get("titulo") as string; // NOVO CAMPO
  const precoRaw = formData.get("preco") as string;
  const dataInicioRaw = formData.get("data_inicio") as string;
  const dataConclusaoRaw = formData.get("data_conclusao") as string;

  try {
    await prisma.pauta.create({
      data: {
        id_usuario: Number(session.user.id_usuario),
        titulo: titulo, // SALVANDO O TÍTULO NO BANCO
        site: formData.get("site") as string,
        categoria: formData.get("categoria") as string,
        status: (formData.get("status") as string) || "3", // No banco legado costuma ser o ID (string ou number)
        texto: formData.get("texto") as string,
        preco: precoRaw ? parseFloat(precoRaw) : null,
        data: new Date(),
        data_inicio: dataInicioRaw ? new Date(dataInicioRaw) : null,
        data_conclusao: dataConclusaoRaw ? new Date(dataConclusaoRaw) : null,
      }
    });

    return { success: true }; 
  } catch (error) {
    console.error("Erro ao inserir pauta:", error);
    return { error: "Falha ao salvar no banco legado. Verifique se o campo 'titulo' existe na tabela." };
  }
}