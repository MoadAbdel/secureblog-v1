import { getServerSession } from "next-auth";
import PayNowButton from "@/components/PayNowButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await getServerSession(authOptions);

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { hasPaid: true },
      })
    : null;

  const hasActiveSubscription = Boolean(user?.hasPaid);

  return (
    <main>
      <h1>Accès Premium — 4,99 €</h1>
      {!session && <p>Connectez-vous pour acheter l&apos;accès premium.</p>}
      {session && !hasActiveSubscription && <PayNowButton />}
      {session && hasActiveSubscription && (
        <div>
          <p>✅ Vous avez déjà un accès Premium !</p>
          <ul>
            <li>Accès à des contenus exclusifs</li>
            <li>Des réductions sur les produits</li>
            <li>Une expérience utilisateur améliorée</li>
          </ul>
        </div>
      )}
    </main>
  );
}
