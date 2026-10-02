"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SuccessPage() {
  const { update } = useSession();

  // Rafraîchit le plan une fois le webhook traité
  useEffect(() => {
    const t = setTimeout(() => update(), 2000);
    return () => clearTimeout(t);
  }, [update]);

  return (
    <main>
      <h1>Abonnement confirmé 🎉</h1>
      <p>Le webhook Stripe active votre plan en quelques secondes.</p>
      <Link href="/dashboard">Voir mon abonnement</Link>
    </main>
  );
}
