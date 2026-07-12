/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "chave-secreta-padrao-para-desenvolvimento"
);

const PROTECTED_PREFIXES = ['/api/products', '/api/categories'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isProtectedResource = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isWriteMethod = ['POST', 'PATCH', 'DELETE'].includes(method);

  if (isProtectedResource && isWriteMethod) {
    if (!token) {
      return NextResponse.json({ error: "Acesso negado. Faça login como administrador." }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      if (payload.role !== 'ADMIN') {
        return NextResponse.json({ error: "Apenas administradores podem realizar esta ação." }, { status: 403 });
      }

      return NextResponse.next();
    } catch (err) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/products/:path*', '/api/categories/:path*'],
};