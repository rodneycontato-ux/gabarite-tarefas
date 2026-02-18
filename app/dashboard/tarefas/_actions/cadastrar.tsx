"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { enviarEmail } from "@/lib/mail";
import { emailTemplates } from "@/lib/emailTemplates";

export async function criarPauta(formData: FormData) {
  // 1. Verificação de Segurança (Session)
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.id_usuario) {
    return { error: "Acesso negado. Faça login novamente." };
  }

  // 2. Coleta de dados do formulário
  const titulo = formData.get("titulo") as string;
  const precoRaw = formData.get("preco") as string;
  const dataInicioRaw = formData.get("data_inicio") as string;
  const dataConclusaoRaw = formData.get("data_conclusao") as string;
  const texto = formData.get("texto") as string;
  const status = (formData.get("status") as string) || "3";

  // IDs para relacionamentos no Banco Legado (Tratados como Numbers)
  const idColaboradorRaw = formData.get("id_usuario"); 
  const idSiteRaw = formData.get("id_site"); 
  const idCategoriaRaw = formData.get("id_categoria");

  try {
    const idUsuarioFinal = idColaboradorRaw ? Number(idColaboradorRaw) : null;

    // 3. Persistência no Prisma (Inclui o usuário para pegar o nome/email depois)
    const novaPauta = await prisma.pauta.create({
      data: {
        id_usuario: idUsuarioFinal,
        titulo: titulo,
        texto: texto,
        status: status,
        preco: precoRaw ? parseFloat(precoRaw.replace(',', '.')) : null,
        id_site: idSiteRaw ? Number(idSiteRaw) : null,
        id_categoria: idCategoriaRaw ? Number(idCategoriaRaw) : null,
        data: new Date(),
        data_inicio: dataInicioRaw ? new Date(dataInicioRaw) : null,
        data_conclusao: dataConclusaoRaw ? new Date(dataConclusaoRaw) : null,
      },
      include: {
        usuario: true 
      }
    });

    // 4. Lógica de Notificação (Diferencia Mural de Atribuição Direta)
    let listaEmails: string[] = [];
    let nomeParaSaudacao = "Colaborador"; // Valor padrão para o Mural

    if (idUsuarioFinal && novaPauta.usuario?.email) {
      // Cenário: A pauta já tem um dono definido
      listaEmails.push(novaPauta.usuario.email);
      nomeParaSaudacao = novaPauta.usuario.nome || "Colaborador";
    } else {
      // Cenário: Pauta vai para o Mural (busca todos os usuários ativos)
      const usuariosMural = await prisma.usuario.findMany({
        where: { 
          email: { contains: "@" }, 
          status: 1,
          nivel: { not: 1 } // <--- RETIRA NÍVEL 1- GERENTE
        },
        select: { email: true }
      });
      listaEmails = usuariosMural.map(u => u.email);
    }

    // 5. Disparo do E-mail usando o Novo Dicionário de Templates
    if (listaEmails.length > 0) {
      const eMailAssunto = idUsuarioFinal 
        ? `📑 Nova tarefa atribuída: ${titulo}` 
        : `🔔 Nova tarefa disponível no Mural!`;

      await enviarEmail({
        // Se for direta, envia para o primeiro da lista. Se mural, usa o remetente e oculta os outros.
        para: idUsuarioFinal ? listaEmails[0] : (process.env.SENDGRID_FROM_EMAIL as string),
        copiaOculta: idUsuarioFinal ? undefined : listaEmails,
        assunto: eMailAssunto,
        
        /* CHAMADA DO TEMPLATE LIMPO:
          - nomeParaSaudacao: Personaliza o "Olá, [Nome]!"
          - titulo: O conteúdo que entra no template sem o rótulo fixo "Título:"
        */
        conteudoHtml: emailTemplates.newAssignment(nomeParaSaudacao, titulo)
      });
    }

    // 6. Atualização da Interface
    revalidatePath("/dashboard/tarefas");
    return { success: true }; 

  } catch (error: any) {
    console.error("Erro na Server Action criarPauta:", error);
    return { error: "Falha ao processar. Verifique os logs do servidor." };
  }
}