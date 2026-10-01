import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Paiement Stripe",
  description: "Démonstrateur de paiement en ligne avec Stripe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
