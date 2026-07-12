import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaUserRepository } from "@/infra/repositories/prisma-user.repository";
import { LoginUseCase } from "@/core/use-cases/login.use-case";
import { loginSchema } from "@/shared/auth.schema";
import { SignJWT } from "jose"; // Biblioteca leve para JWT no Next.js

const userRepository = new PrismaUserRepository();
const loginUseCase = new LoginUseCase(userRepository);

// Chave secreta para o JWT (deve estar no seu .env depois)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "chave-secreta-padrao-para-desenvolvimento"
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // 1. Tenta autenticar
    const user = await loginUseCase.execute(validatedData);

    // 2. Gera o Token JWT usando 'jose'
    const token = await new SignJWT({ 
        id: user.id, 
        email: user.email, 
        role: user.role 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h") // Token dura 2 horas
      .sign(JWT_SECRET);

    // 3. Prepara a resposta
    const response = NextResponse.json({ 
      message: "Login realizado com sucesso",
      user 
    });

    // 4. Define o cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 horas em segundos
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("ERRO NO LOGIN:", error);
    const message = error.errors ? error.errors[0].message : error.message;
    return NextResponse.json({ error: message }, { status: 401 });
  }
}