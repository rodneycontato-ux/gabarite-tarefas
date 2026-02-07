import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; //se eu qusier usar google
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

// @ts-ignore
export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials: any): Promise<any> { // Adicionei : Promise<any> aqui
        if (!credentials?.email || !credentials?.senha) return null; //null se não existir no login local

        const user = await prisma.usuario.findFirst({
          where: {
            email: credentials.email,
            senha: credentials.senha,
          },
        });

        //atribui meus nomes a sessao
        if (user) {
          return { 
            id: String(user.id_usuario),
            name: user.nome,
            email: user.email,
            role: user.nivel
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    //adiciona campos não padrão
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    //adiciona campos não padrão a sessão
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id_usuario = token.id;
        session.user.nivel = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };