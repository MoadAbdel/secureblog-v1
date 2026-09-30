require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./passport");
const authRoutes = require("./routes/auth");
const { posts } = require("./data");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// credentials:true car le cookie de session traverse les origines
app.use(cors({ origin: CLIENT_URL, methods: "GET,POST,PUT,DELETE", credentials: true }));

app.use("/auth", authRoutes);

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  next();
}

// Liste publique : uniquement les résumés
app.get("/api/posts", (req, res) => {
  res.json(posts.map(({ id, title, img, desc }) => ({ id, title, img, desc })));
});

// Détail protégé : le contrôle se fait côté serveur, pas côté React
app.get("/api/posts/:id", requireAuth, (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.id));
  if (!post) {
    return res.status(404).json({ message: "Article introuvable" });
  }
  res.json(post);
});

app.listen(PORT, () => {
  console.log(`Serveur PassportJS démarré sur http://localhost:${PORT}`);
});
