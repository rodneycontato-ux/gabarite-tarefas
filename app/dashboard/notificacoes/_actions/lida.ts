"use server";

import { prisma } from "@/lib/prisma";

export async function marcarComoLidasAction(idUsuario: number) {
  // 1. Garantia de Tipagem
  // Forçamos o ID a ser um número para evitar erros em bancos de dados SQL tradicionais
  const userId = Number(idUsuario);
  if (isNaN(userId)) return;

  try {
    // 2. Lógica de Busca de Pendências
    // Precisamos descobrir quais notificações este usuário deve ver, mas ainda não viu.
    const naoLidas = await prisma.notificacao.findMany({
      where: {
        AND: [
          // Filtro A: A notificação deve ser para este usuário específico OU ser Global (null)
          {
            OR: [
              { id_usuario: userId },
              { id_usuario: null }
            ]
          },
          // Filtro B: Não deve existir nenhum registro deste usuário na tabela de visualizações
          {
            notificacao_visualizada: {
              none: { id_usuario: userId }
            }
          }
        ]
      },
      // Pegamos apenas o ID para economizar memória e performance
      select: { id_notificacao: true }
    });

    // 3. Verificação de necessidade
    // Se a lista estiver vazia, paramos aqui para não abrir uma transação desnecessária no banco.
    if (naoLidas.length === 0) return;

    // 4. Gravação em Massa (Bulk Create)
    // Criamos todos os registros de uma vez na tabela de visualização.
    await prisma.notificacao_visualizada.createMany({
      data: naoLidas.map(n => ({
        id_notificacao: n.id_notificacao,
        id_usuario: userId,
        // O campo 'data_visualizacao' é omitido para usar o @default(now()) do seu banco MySQL.
      })),
      // Segurança para produção: se o usuário der refresh muito rápido e o ID já existir, 
      // o skipDuplicates evita que a aplicação retorne Erro 500.
      skipDuplicates: true
    });
    
    // NOTA: O revalidatePath foi removido daqui. 
    // Como esta função roda no servidor ANTES da busca de dados da página, 
    // os dados lidos em seguida já estarão atualizados no banco.

  } catch (error) {
    // Erros aqui são logados no servidor, mas não quebram a experiência do usuário.
    console.error("Erro técnico ao processar visualizações:", error);
  }
}