import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BCRYPT_COST = 12;

// Inscription par email/mot de passe, pour le CredentialsProvider de NextAuth
export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email invalide ou mot de passe trop court (8 caractères minimum)" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);
  await prisma.user.create({ data: { name, email, hashedPassword } });

  return NextResponse.json({ message: "Compte créé" }, { status: 201 });
}
