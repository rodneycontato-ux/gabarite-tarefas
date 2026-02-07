//Arquivo que proteje as rotas, só usuário logado

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // O NextAuth usa nomes diferentes para desenvolvimento (http) e produção (https)
  const token = 
    request.cookies.get('next-auth.session-token') || 
    request.cookies.get('__Secure-next-auth.session-token');

  const { pathname } = request.nextUrl;

  // Protege tudo que começa com /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Se NÃO tem o cookie do NextAuth, manda de volta para o login
    if (!token) {
      const loginUrl = new URL('/entrar', request.url);
      
      // Adiciona o callbackUrl para o usuário voltar para onde estava após logar
      loginUrl.searchParams.set('callbackUrl', pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configuração para o middleware rodar APENAS nas rotas do dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};