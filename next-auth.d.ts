import { DefaultSession } from "next-auth";

// O 'declare module' serve para "avisar" ao TypeScript que vamos adicionar
// campos novos em um módulo que já existe (no caso, o next-auth).
declare module "next-auth" {
  
  // Aqui estamos modificando o objeto Session (o que você recebe no frontend/backend)
  interface Session {
    // Definimos que 'user' será a junção da nossa interface 'User' abaixo
    // com os campos padrão do Next-Auth (name, email, image) vindos do DefaultSession.
    user: User & DefaultSession["user"]; 
  }

  // Aqui definimos a estrutura do Usuário para o TypeScript.
  // IMPORTANTE: Esses nomes devem bater com o que seu Banco de Produção espera.
  interface User {
     id_usuario?: string; // ID único do seu banco legado (ex: '123')
     nivel?: number;      // Nível de acesso (ex: 1 para admin, 2 para redator)
     
     // Campos opcionais do Next-Auth para não dar erro se vierem nulos
     name?: string | null;
     email?: string | null;
     image?: string | null;
  }
}