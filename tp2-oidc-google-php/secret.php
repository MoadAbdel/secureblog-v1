<?php
session_start();

// Contrôle d'accès : page réservée aux sessions authentifiées
if (!isset($_SESSION['email'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page secrète</title>
</head>
<body>
  <h1>Page secrète, non accessible aux utilisateurs non connectés</h1>
  <p>Connecté en tant que <strong><?= htmlspecialchars($_SESSION['email']) ?></strong></p>
  <?php if (!empty($_SESSION['picture'])): ?>
    <img src="<?= htmlspecialchars($_SESSION['picture']) ?>" alt="" width="96">
  <?php endif; ?>
  <p><a href="logout.php">Se déconnecter</a></p>
</body>
</html>
