/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "chave-secreta-padrao-para-desenvolvimento"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname, method } = request.nextUrl;

  // 1. Definir rotas que exigem proteção (apenas métodos de escrita)
  const isProductMutation = pathname.startsWith('/api/products');
  const isWriteMethod = ['POST', 'PATCH', 'DELETE'].includes(method);

  // 2. Se for uma tentativa de alterar produtos
  if (isProductMutation && isWriteMethod) {
    if (!token) {
      return NextResponse.json({ error: "Acesso negado. Faça login como administrador." }, { status: 401 });
    }

    try {
      // Verifica se o token é válido e se é um ADMIN
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      if (payload.role !== 'ADMIN') {
        return NextResponse.json({ error: "Apenas administradores podem realizar esta ação." }, { status: 403 });
      }
      
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }
  }

  // 3. Deixa passar requisições GET (Públicas para Convidados)
  return NextResponse.next();
}

// Configura em quais caminhos o middleware deve rodar
export const config = {
  matcher: ['/api/products/:path*'],
};