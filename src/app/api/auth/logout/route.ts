import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Remove o cookie definindo uma data de expiração no passado
  cookieStore.delete("auth_token");

  return NextResponse.json({ message: "Logout realizado com sucesso" });
}