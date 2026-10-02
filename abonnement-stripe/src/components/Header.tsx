"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="header">
      <nav>
        <Link href="/">Accueil</Link>
        <Link href="/pricing">Plans</Link>
        <Link href="/dashboard">Mon abonnement</Link>
      </nav>
      <div className="header-user">
        {session ? (
          <>
            <span>{session.user?.email}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })}>Se déconnecter</button>
          </>
        ) : (
          <Link href="/login">Se connecter</Link>
        )}
      </div>
    </header>
  );
}
