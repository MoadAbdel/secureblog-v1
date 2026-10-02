"use client";

import { useState } from "react";

export default function SubscribeButton({ priceId, label }: { priceId: string; label: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Erreur lors de la création de l'abonnement");
        return;
      }
      window.location.href = data.url; // Page de paiement Stripe
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Redirection..." : label}
    </button>
  );
}
