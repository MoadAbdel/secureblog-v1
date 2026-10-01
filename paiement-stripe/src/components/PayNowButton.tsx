"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "");

export default function PayNowButton({ productId }: { productId?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // 1. Appel API pour créer la session Stripe
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productId ? { productId } : {}),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Erreur lors de la création du paiement");
        return;
      }
      // 2. Redirection vers Stripe qui gère l'interface de paiement sécurisée
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Redirection..." : productId ? "Acheter" : "Payer maintenant"}
    </button>
  );
}
