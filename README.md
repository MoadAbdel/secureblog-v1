# secureblog-v1

## Rôle
Démonstrateur d'authentification sécurisée : inscription, connexion et
session, illustrant les 5 étapes du parcours (enregistrement,
identification, authentification, autorisation, contrôle d'accès).

## Stack
- Node.js / Express — serveur HTTP minimal
- bcrypt — hachage lent et salé des mots de passe (jamais de clair, jamais réversible)
- express-session — session côté serveur, cookie opaque `sid`
- better-sqlite3 — stockage simple des utilisateurs et articles
- Docker — exécution reproductible en local

## Sécurité appliquée
- Mot de passe haché avec bcrypt (coût 12), jamais stocké en clair
- Cookie de session : `HttpOnly` (inaccessible en JS), `SameSite=lax` (anti-CSRF),
  `Secure` en production (HTTPS uniquement)
- Contrôle d'accès à chaque requête : un utilisateur ne voit que ses propres articles
- Principe de moindre privilège : aucune route n'expose plus que nécessaire

## Lancer en local
```
docker compose up --build
```
Puis ouvrir `http://localhost:3000`.

Sans Docker :
```
npm install
npm start
```

## Variables d'environnement
| Variable | Description | Exemple |
|---|---|---|
| SESSION_SECRET | Clé de signature du cookie de session | un secret long et aléatoire |
| NODE_ENV | Active `Secure` sur le cookie en production | production |
| PORT | Port d'écoute du serveur | 3000 |

## Endpoints principaux
| Méthode | Route | Description |
|---|---|---|
| POST | /api/register | Crée un compte (hachage bcrypt) |
| POST | /api/login | Vérifie le mot de passe, crée la session |
| POST | /api/logout | Détruit la session |
| GET | /api/me | Route protégée : profil de l'utilisateur connecté |
| GET | /api/articles | Liste les articles de l'utilisateur connecté |
| POST | /api/articles | Publie un article |

## Critère de réussite
Aucune trace de mot de passe en clair, à aucun moment (logs, base, réseau).
