import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { stripeCurrentPeriodEnd: "desc" },
  });
  if (!sub) return NextResponse.json({ status: "none" });

  // Statut en temps réel depuis Stripe
  const live = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
  return NextResponse.json({
    status: live.status,
    subscriptionId: live.id,
    currentPeriodEnd: sub.stripeCurrentPeriodEnd,
  });
}
