import Link from "next/link";

export default function CancelPage() {
  return (
    <main>
      <h1>Paiement annulé</h1>
      <p>Aucun montant n&apos;a été débité.</p>
      <Link href="/pricing">Retour aux plans</Link>
    </main>
  );
}
