import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const BCRYPT_COST = 12; // volontairement lent, résistant à la force brute

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const JWT_EXPIRES_IN = "15m";
const COOKIE_MAX_AGE = 1000 * 60 * 15; // doit correspondre à JWT_EXPIRES_IN

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware : contrôle d'accès, vérifie et décode le JWT (API stateless)
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    // Signature invalide ou token expiré : rejeté dans tous les cas
    return res.status(401).json({ error: "Session invalide ou expirée" });
  }
}

// Inscription : hachage bcrypt, jamais de mot de passe en clair stocké
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Email invalide ou mot de passe trop court (8 caractères minimum)" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Cet email est déjà utilisé" });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, passwordHash);

  res.status(201).json({ message: "Compte créé" });
});

// Connexion : vérification par bcrypt.compare, émission d'un JWT signé
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // HTTPS requis en prod
    maxAge: COOKIE_MAX_AGE,
  });

  res.json({ message: "Connecté", email: user.email });
});

// Route protégée : accessible uniquement avec un JWT valide et non expiré
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ email: req.user.email });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Déconnecté" });
});

// Un utilisateur authentifié ne voit que SES articles (moindre privilège)
app.get("/api/articles", requireAuth, (req, res) => {
  const articles = db
    .prepare("SELECT id, title, content, created_at FROM articles WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.userId);
  res.json(articles);
});

app.post("/api/articles", requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Titre et contenu requis" });
  }
  const result = db
    .prepare("INSERT INTO articles (user_id, title, content) VALUES (?, ?, ?)")
    .run(req.user.userId, title, content);
  res.status(201).json({ id: result.lastInsertRowid });
});

app.listen(PORT, () => {
  console.log(`SecureBlog v2 démarré sur http://localhost:${PORT}`);
});
