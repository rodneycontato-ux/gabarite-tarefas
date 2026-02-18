"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function editarPauta(id: number, formData: FormData) {
  try {
    // 1. Extração dos dados
    const titulo = formData.get("titulo") as string;
    const texto = formData.get("texto") as string;
    const status = formData.get("status") as string;
    const precoRaw = formData.get("preco") as string;
    
    // PEGANDO AS DATAS (Adicionadas para bater com o Form)
    const dataInicioRaw = formData.get("data_inicio") as string;
    const dataConclusaoRaw = formData.get("data_conclusao") as string;
    
    // PEGANDO OS IDS (Usando exatamente os nomes que você definiu)
    const idUsuarioRaw = formData.get("id_usuario");
    const idSiteRaw = formData.get("id_site");
    const idCategoriaRaw = formData.get("id_categoria");

    // 2. Tratamento numérico e de Datas (Conversão obrigatória para o Prisma)
    // Corrigido: Agora o Number() usa as variáveis Raw que você extraiu acima
    const preco = precoRaw ? parseFloat(precoRaw.replace(',', '.')) : null;
    const id_usuario = idUsuarioRaw ? Number(idUsuarioRaw) : null;
    const id_site = idSiteRaw ? Number(idSiteRaw) : null;
    const id_categoria = idCategoriaRaw ? Number(idCategoriaRaw) : null;

    // Tratamento das Datas
    const data_inicio = dataInicioRaw ? new Date(dataInicioRaw) : null;
    const data_conclusao = dataConclusaoRaw ? new Date(dataConclusaoRaw) : null;

    // 3. Atualização no banco de dados
    await prisma.pauta.update({
      where: {
        id_pauta: id,
      },
      data: {
        titulo,
        texto,
        preco,
        status,
        // Usando as constantes tratadas (id_usuario, id_site, id_categoria)
        id_usuario, 
        id_site,
        id_categoria,
        // Salvando as novas datas
        data_inicio,
        data_conclusao,
      },
    });

    // 4. Limpa o cache para refletir as mudanças na listagem
    revalidatePath("/dashboard/tarefas");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao editar pauta:", error);
    return { error: "Falha ao atualizar a pauta no banco de dados." };
  }
}