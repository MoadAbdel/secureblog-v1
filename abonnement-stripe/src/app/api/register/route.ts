import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email invalide ou mot de passe trop court (8 caractères minimum)" },
      { status: 400 }
    );
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, hashedPassword } });
  return NextResponse.json({ message: "Compte créé" }, { status: 201 });
}
