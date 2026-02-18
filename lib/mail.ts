// app/lib/mail.ts
import sgMail from '@sendgrid/mail';

// Configura a chave de API que você pegou no painel do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Interface para definir quais dados a função precisa receber.
 * Adicionamos 'copiaOculta' como opcional (indicado pelo ?)
 */
interface EmailParams {
  para: string;
  assunto: string;
  conteudoHtml: string;
  copiaOculta?: string[]; // Uma lista (Array) de e-mails que ficarão escondidos
}

export async function enviarEmail({ para, assunto, conteudoHtml, copiaOculta }: EmailParams) {
  
  // Montamos o objeto da mensagem seguindo o padrão da documentação do SendGrid
  const msg = {
    to: para, // Destinatário principal
    from: process.env.SENDGRID_FROM_EMAIL as string, // Seu e-mail verificado no SendGrid
    subject: assunto, // Título do e-mail
    html: conteudoHtml, // O corpo do e-mail em formato HTML
    
    // O campo 'bcc' (Blind Carbon Copy) envia para as pessoas sem mostrar o e-mail delas.
    // Se a variável 'copiaOculta' existir, ela é adicionada aqui.
    ...(copiaOculta && { bcc: copiaOculta }),
  };

  try {
    // O 'await' faz o código esperar o SendGrid responder (sucesso ou erro)
    await sgMail.send(msg);
    
    // Se chegou aqui, o e-mail foi aceito pelo servidor do SendGrid
    return { success: true };
    
  } catch (error: any) {
    // Em caso de erro, exibimos o motivo real no terminal para você conseguir consertar
    // Geralmente o erro está em 'error.response.body' (ex: e-mail de remetente não verificado)
    console.error("❌ Erro ao enviar e-mail:", error.response?.body || error.message);
    
    return { success: false };
  }
}