# secureblog-v2

## Rôle
Démonstrateur d'authentification sécurisée : inscription, connexion et
authentification par JWT, illustrant les 5 étapes du parcours (enregistrement,
identification, authentification, autorisation, contrôle d'accès).

## Stack
- Node.js / Express — serveur HTTP minimal
- bcrypt — hachage lent et salé des mots de passe (jamais de clair, jamais réversible)
- jsonwebtoken — JWT signé HS256, API stateless (aucune session côté serveur)
- cookie-parser — lecture du cookie `token` côté serveur
- better-sqlite3 — stockage simple des utilisateurs et articles
- Docker — exécution reproductible en local

## Sécurité appliquée
- Mot de passe haché avec bcrypt (coût 12), jamais stocké en clair
- JWT signé (HS256), expiration courte (15 minutes), vérifié à chaque requête protégée
- Cookie `token` : `HttpOnly` (inaccessible en JS), `SameSite=lax` (anti-CSRF),
  `Secure` en production (HTTPS uniquement)
- Tout JWT expiré ou altéré (signature invalide) est systématiquement rejeté (401)
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
| JWT_SECRET | Clé de signature du JWT | un secret long et aléatoire |
| NODE_ENV | Active `Secure` sur le cookie en production | production |
| PORT | Port d'écoute du serveur | 3000 |

## Endpoints principaux
| Méthode | Route | Description |
|---|---|---|
| POST | /api/register | Crée un compte (hachage bcrypt) |
| POST | /api/login | Vérifie le mot de passe, émet un JWT (cookie `token`) |
| POST | /api/logout | Efface le cookie `token` |
| GET | /api/me | Route protégée : profil de l'utilisateur connecté |
| GET | /api/articles | Liste les articles de l'utilisateur connecté |
| POST | /api/articles | Publie un article |

## Critère de réussite
Un JWT expiré ou altéré est systématiquement rejeté (401), et aucune trace de
mot de passe en clair n'apparaît à aucun moment (logs, base, réseau).
