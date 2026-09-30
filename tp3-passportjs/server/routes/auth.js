const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get("/login/success", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Non authentifié" });
  }
  res.json({ success: true, user: req.user });
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "Échec de l'authentification" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect(CLIENT_URL));
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

module.exports = router;
