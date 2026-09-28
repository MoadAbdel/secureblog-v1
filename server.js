import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const BCRYPT_COST = 12; // volontairement lent, résistant à la force brute

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Cookie de session : HttpOnly (inaccessible en JS), SameSite (anti-CSRF)
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // HTTPS requis en prod
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

// Middleware : contrôle d'accès, vérifie que la session est valide
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  next();
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

// Connexion : vérification par bcrypt.compare, création de la session
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

  req.session.userId = user.id;
  req.session.email = user.email;

  res.json({ message: "Connecté", email: user.email });
});

// Route protégée : accessible uniquement si la session est valide
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ email: req.session.email });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ message: "Déconnecté" });
  });
});

// Un utilisateur authentifié ne voit que SES articles (moindre privilège)
app.get("/api/articles", requireAuth, (req, res) => {
  const articles = db
    .prepare("SELECT id, title, content, created_at FROM articles WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.session.userId);
  res.json(articles);
});

app.post("/api/articles", requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Titre et contenu requis" });
  }
  const result = db
    .prepare("INSERT INTO articles (user_id, title, content) VALUES (?, ?, ?)")
    .run(req.session.userId, title, content);
  res.status(201).json({ id: result.lastInsertRowid });
});

app.listen(PORT, () => {
  console.log(`SecureBlog v1 démarré sur http://localhost:${PORT}`);
});
