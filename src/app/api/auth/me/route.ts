import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "chave-secreta-padrao-para-desenvolvimento"
);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ role: "GUEST" });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ 
      id: payload.id,
      email: payload.email,
      role: payload.role 
    });
  } catch (err) {
    return NextResponse.json({ role: "GUEST" });
  }
}