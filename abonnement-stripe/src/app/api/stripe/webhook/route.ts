import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const periodEnd = (s: Stripe.Subscription) => new Date(s.current_period_end * 1000);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    // 1. Premier paiement réussi
    case "checkout.session.completed": {
      const checkout = event.data.object as Stripe.Checkout.Session;
      const userId = checkout.metadata?.userId;
      if (!userId || !checkout.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(checkout.subscription as string);
      const priceId = subscription.items.data[0].price.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: checkout.customer as string, stripePriceId: priceId },
      });
      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        create: {
          userId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: periodEnd(subscription),
        },
        update: { stripePriceId: priceId, stripeCurrentPeriodEnd: periodEnd(subscription) },
      });
      break;
    }

    // 2. Renouvellement réussi
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const priceId = subscription.items.data[0].price.id;

      // Le checkout crée la ligne : on ignore si absente
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { stripePriceId: priceId, stripeCurrentPeriodEnd: periodEnd(subscription) },
      });
      break;
    }

    // 3. Annulation
    case "customer.subscription.deleted": {
      const deleted = event.data.object as Stripe.Subscription;
      await prisma.subscription.deleteMany({ where: { stripeSubscriptionId: deleted.id } });
      await prisma.user.updateMany({
        where: { stripeCustomerId: deleted.customer as string },
        data: { stripePriceId: null },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
