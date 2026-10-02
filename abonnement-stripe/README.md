# abonnement-stripe

Cas pratique 2 : abonnements récurrents Basic (10 €), Premium (25 €)
et Pro (50 €) avec Stripe Checkout et webhooks.

## Stack
- Next.js 14 (App Router)
- Prisma + SQLite - modèles User et Subscription
- NextAuth.js - Credentials uniquement (email + mot de passe)
- Stripe Checkout `mode: 'subscription'` + 3 événements webhook

## Webhooks gérés
- `checkout.session.completed` : crée l'abonnement et fixe le plan
- `invoice.payment_succeeded` : met à jour la fin de période
- `customer.subscription.deleted` : supprime l'abonnement, plan à null

## Sécurité appliquée
- Signature du webhook vérifiée (`constructEvent`)
- Routes API protégées par `getServerSession()`
- Annulation limitée aux abonnements de l'utilisateur connecté
- Mises à niveau uniquement (champ `level` des plans)

## Étapes pour reproduire
1. `cd abonnement-stripe && npm install`
2. Copier `.env.example` vers `.env` et remplir les clés
3. Dashboard Stripe : créer 3 produits récurrents (10, 25, 50 €)
4. Copier les 3 `price_...` dans `.env` (`NEXT_PUBLIC_PRICE_*`)
5. `npx prisma migrate dev`
6. `npm run dev`
7. `stripe listen --forward-to localhost:3000/api/stripe/webhook`
8. Inscription, choix d'un plan, carte test `4242 4242 4242 4242`
