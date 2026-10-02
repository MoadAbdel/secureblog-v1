import { getServerSession } from "next-auth";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";
import { authOptions } from "@/lib/auth";
import { findPlan, plans } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { stripePriceId: true } })
    : null;
  const current = findPlan(user?.stripePriceId);

  return (
    <main>
      <h1>Choisissez votre plan</h1>
      <div className="plans">
        {plans.map((plan) => (
          <div key={plan.name} className="plan">
            <h2>{plan.name}</h2>
            <p className="price">{plan.price} €/mois</p>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {!session && <Link href="/login">Se connecter</Link>}
            {session && current?.name === plan.name && <p>✅ Plan actuel</p>}
            {session && current && plan.level > current.level && (
              <SubscribeButton priceId={plan.priceId} label="Passer à ce plan" />
            )}
            {session && !current && <SubscribeButton priceId={plan.priceId} label="S'abonner" />}
          </div>
        ))}
      </div>
    </main>
  );
}
