export const siteConfig = {
  // Dados Gerais
  name: "Gabarite Tarefas",
  url: "https://tarefas.gabarite.com.br",
  description: "Sistema de gestão de pautas e tarefas para colaboradores e gerentes",
  
  // Informações de Contato
  contact: {
    phone: "(11) 99999-9999",
    whatsapp: "5511999999999", // Apenas números para link do zap
    email: "contato@gabarite.com.br",
    address: "Rua Exemplo, 123, São Paulo - SP",
  },

  // Redes Sociais
  social: {
    instagram: "https://instagram.com/gabarite",
    facebook: "https://facebook.com/gabarite",
  },

  // Versão do Sistema (bom para exibir na Sidebar/Footer)
  version: "2.0",
};

export type SiteConfig = typeof siteConfig;