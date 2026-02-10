"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarSite(formData: FormData, id?: number) {
  try {
    const nome_site = formData.get("nome_site") as string;
    const url_home = formData.get("url_home") as string;
    const url_admin = formData.get("url_admin") as string;
    const ordem = formData.get("ordem") ? Number(formData.get("ordem")) : null;

    const data = { nome_site, url_home, url_admin, ordem };

    if (id) {
      // MODO EDIÇÃO
      await prisma.site.update({
        where: { id_site: id },
        data: data,
      });
    } else {
      // MODO CADASTRO
      await prisma.site.create({
        data: data,
      });
    }

    revalidatePath("/dashboard/configuracoes/sites");
    return { success: true };
  } catch (error) {
    console.error("Erro ao processar site:", error);
    return { error: "Erro ao salvar no banco de dados." };
  }
}