import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Abonnements Stripe</h1>
      <p>Basic, Premium ou Pro : facturation mensuelle récurrente.</p>
      <Link href="/pricing">Voir les plans</Link>
    </main>
  );
}
