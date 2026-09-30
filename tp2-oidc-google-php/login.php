<?php
session_start();
require('config.php');

// Anti-CSRF : state vérifié au retour de Google
$_SESSION['oauth_state'] = bin2hex(random_bytes(16));

$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
    'response_type' => 'code',
    'client_id' => GOOGLE_ID,
    'redirect_uri' => REDIRECT_URI,
    'scope' => 'openid email profile',
    'state' => $_SESSION['oauth_state'],
    'access_type' => 'online',
    'prompt' => 'consent',
]);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion OIDC Google</title>
</head>
<body>
  <h1>TP OIDC Google</h1>
  <a href="<?= htmlspecialchars($authUrl) ?>">Se connecter via Google</a>
</body>
</html>
