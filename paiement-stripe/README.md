# paiement-stripe

Démonstrateur de paiement en ligne : accès premium à 4,99 € ou achat de
produits à l'unité, via Stripe Checkout.

## Stack
- Next.js 14 (App Router)
- Prisma + SQLite — modèles User, Product, Order, OrderItem
- NextAuth.js — GitHub, Google, Credentials (email + mot de passe)
- Stripe Checkout + Webhook — paiement unique, synchronisation BDD

## Sécurité appliquée
- Mot de passe haché avec bcryptjs, jamais stocké en clair
- Signature du webhook Stripe vérifiée (`stripe.webhooks.constructEvent`) :
  aucune requête falsifiée ne peut activer un accès premium ou créer une commande
- Les prix envoyés à Stripe sont toujours en centimes (`unit_amount`)
- Un seul client Stripe par utilisateur (`stripeCustomerId`), créé à la demande

## Étapes pour reproduire
1. `cd paiement-stripe`
2. `npm install`
3. Copier `.env.example` → `.env` et remplir les clés (Stripe, OAuth, `NEXTAUTH_SECRET`)
4. `npx prisma migrate dev` (crée les tables)
5. `npm run db:seed` (pré-remplit les produits)
6. `npm run dev` (lance le serveur sur http://localhost:3000)
7. `stripe listen --forward-to localhost:3000/api/webhook`
8. Créer un compte → Acheter → Carte test : `4242 4242 4242 4242`

## Note sur bcrypt
Le schéma d'origine du cours utilise `bcrypt` (module natif). Ce projet
utilise `bcryptjs` à la place : même API, implémentation pure JS, aucune
compilation native requise (évite les soucis de toolchain C++/node-gyp
rencontrés avec `bcrypt`/`better-sqlite3` sur cette machine).
