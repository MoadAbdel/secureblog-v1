import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  // 1. Vérifier que la requête vient bien de Stripe
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  // 2. Traiter l'événement
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const purchaseType = session.metadata?.purchaseType;
      if (!userId) break;

      if (purchaseType === "product") {
        const productId = session.metadata?.productId;
        const product = productId ? await prisma.product.findUnique({ where: { id: productId } }) : null;
        if (product) {
          // Créer une commande avec ses items
          await prisma.order.create({
            data: {
              userId,
              status: "paid",
              total: product.price,
              items: {
                create: [{ productId: product.id, quantity: 1, price: product.price }],
              },
            },
          });
        }
      } else {
        // Activer l'accès premium
        await prisma.user.update({
          where: { id: userId },
          data: { hasPaid: true },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
