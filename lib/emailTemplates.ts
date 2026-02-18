const baseLayout = (content: string) => `
  <div style="font-family: sans-serif; color: #333; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #1e293b; padding: 20px; text-align: center;">
      <h2 style="color: white; margin: 0; font-size: 18px;">Gabarite Produtora</h2>
    </div>
    <div style="padding: 30px;">
      ${content}
    </div>
    <div style="background-color: #f9f9f9; padding: 10px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0; font-size: 10px; color: #ccc;">Sistema de Notificação Automática</p>
    </div>
  </div>
`;

export const emailTemplates = {
  
  /**
   * Notificação de nova tarefa/mural
   */
  newAssignment: (nome: string, conteudo: string) => {
    return baseLayout(`
      <p>Olá, <strong>${nome}</strong>!</p>
      <p>Uma nova publicação foi feita no sistema:</p>
      <div style="font-size: 18px; font-weight: bold; color: #1e293b; margin: 15px 0;">
        ${conteudo}
      </div>
      <div style="margin-top: 25px; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard/tarefas" 
           style="background-color: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
           Acessar Sistema
        </a>
      </div>
    `);
  },

  /**
   * Notificação de tarefa concluída (para o Admin)
   */
  taskCompleted: (nomeAdmin: string, nomeRedator: string, conteudo: string, relato?: string) => {
    return baseLayout(`
      <p>Olá, <strong>${nomeAdmin}</strong>!</p>
      <h2 style="color: #166534; font-size: 18px;">✅ Atividade Concluída</h2>
      <p>O colaborador <strong>${nomeRedator}</strong> finalizou o trabalho:</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-weight: bold; color: #1e293b;">${conteudo}</p>
        ${relato ? `<p style="margin-top: 10px; font-size: 14px; color: #64748b; border-top: 1px solid #eee; padding-top: 10px;">${relato}</p>` : ''}
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard/admin/pautas" 
           style="background-color: #1e293b; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
           Revisar no Painel
        </a>
      </div>
    `);
  }
};