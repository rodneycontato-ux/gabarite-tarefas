"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function editarPauta(id: number, formData: FormData) {
  try {
    // 1. Extração dos dados e conversão para os tipos corretos
    const titulo = formData.get("titulo") as string;
    
    // PEGAMOS OS IDS (que devem vir dos names "id_site" e "id_categoria" no seu FormPauta)
    const idSiteRaw = formData.get("id_site");
    const idCategoriaRaw = formData.get("id_categoria");
    
    const precoRaw = formData.get("preco") as string;
    const status = formData.get("status") as string;
    const texto = formData.get("texto") as string;

    // 2. Tratamento numérico (O Prisma exige Int para IDs e Float/Decimal para preço)
    const preco = precoRaw ? parseFloat(precoRaw) : 0;
    const id_site = idSiteRaw ? Number(idSiteRaw) : null;
    const id_categoria = idCategoriaRaw ? Number(idCategoriaRaw) : null;

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
        // ATUALIZANDO AS CHAVES ESTRANGEIRAS (IDs)
        id_site: id_site,
        id_categoria: id_categoria,
        
      },
    });

    // 4. Limpa o cache
    revalidatePath("/dashboard/tarefas");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao editar pauta:", error);
    return { error: "Falha ao atualizar a pauta no banco de dados." };
  }
}