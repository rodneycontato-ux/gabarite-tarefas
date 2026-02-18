"use server";

import { prisma } from "@/lib/prisma";

//usado para carregar o modal de edição de usuário
export async function buscarUsuarioPorId(id: number) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: id },
    });
    return usuario;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}