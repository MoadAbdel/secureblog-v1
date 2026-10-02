"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { findPlan } from "@/lib/plans";

type Status = { status: string; subscriptionId?: string; currentPeriodEnd?: string };

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const [sub, setSub] = useState<Status | null>(null);

  const loadStatus = () =>
    fetch("/api/stripe/get-subscription-status")
      .then((res) => res.json())
      .then(setSub);

  useEffect(() => {
    if (status === "authenticated") loadStatus();
  }, [status]);

  const handleCancel = async () => {
    if (!sub?.subscriptionId || !confirm("Annuler l'abonnement ?")) return;
    await fetch("/api/stripe/cancel-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId: sub.subscriptionId }),
    });
    // Laisse le webhook mettre la BDD à jour
    setTimeout(async () => {
      await update();
      await loadStatus();
    }, 2000);
  };

  if (status === "loading") return <main>Chargement...</main>;
  if (!session) return <main><Link href="/login">Connectez-vous</Link></main>;

  const plan = findPlan(session.user.stripePriceId);

  return (
    <main>
      <h1>Mon abonnement</h1>
      {plan ? (
        <>
          <p>Plan : {plan.name}</p>
          <p>Prix : {plan.price} €/mois</p>
          <p>Statut : {sub?.status ?? "..."}</p>
          {sub?.currentPeriodEnd && (
            <p>Prochain renouvellement : {new Date(sub.currentPeriodEnd).toLocaleDateString("fr-FR")}</p>
          )}
          <button onClick={handleCancel}>Annuler l&apos;abonnement</button>
          <p><Link href="/pricing">Changer de plan</Link></p>
        </>
      ) : (
        <p>Aucun abonnement actif. <Link href="/pricing">Voir les plans</Link></p>
      )}
    </main>
  );
}
