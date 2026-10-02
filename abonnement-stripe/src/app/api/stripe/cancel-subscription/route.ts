import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscriptionId } = await req.json().catch(() => ({}));
  // Vérifie que l'abonnement appartient bien à l'utilisateur
  const owned = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId, userId: session.user.id },
  });
  if (!owned) {
    return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 });
  }

  // Le webhook subscription.deleted nettoie la BDD
  await stripe.subscriptions.cancel(subscriptionId);
  return NextResponse.json({ canceled: true });
}
