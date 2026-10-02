"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Identifiants invalides");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <main>
      <div className="auth-card">
        <h1>{mode === "login" ? "Connexion" : "Inscription"}</h1>
        <form onSubmit={handleCredentials}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe (8 caractères minimum)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{mode === "login" ? "Se connecter" : "Créer le compte"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Créer un compte" : "J'ai déjà un compte"}
        </p>
      </div>
    </main>
  );
}
