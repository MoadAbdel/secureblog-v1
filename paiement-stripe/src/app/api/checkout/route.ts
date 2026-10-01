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

  const body = await req.json().catch(() => ({}));
  const productId = typeof body?.productId === "string" ? body.productId : undefined;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Un client Stripe est créé une seule fois par utilisateur, puis réutilisé
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string };
      unit_amount: number;
    };
    quantity: number;
  }>;
  let metadata: Record<string, string>;

  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }
    lineItems = [
      {
        price_data: {
          currency: "eur",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100), // Stripe attend des CENTIMES
        },
        quantity: 1,
      },
    ];
    metadata = { userId: user.id, purchaseType: "product", productId: product.id };
  } else {
    lineItems = [
      {
        price_data: {
          currency: "eur",
          product_data: { name: "Accès Premium" },
          unit_amount: 499, // 4.99€ en CENTIMES
        },
        quantity: 1,
      },
    ];
    metadata = { userId: user.id, purchaseType: "premium" };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId, // Client Stripe
    mode: "payment", // Paiement unique
    line_items: lineItems,
    success_url: `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cancel`,
    metadata, // Pour le webhook
  });

  return NextResponse.json({ id: stripeSession.id });
}
