<?php
session_start();
require 'vendor/autoload.php';
require('config.php');

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

// Le state doit correspondre à celui émis par login.php
if (!isset($_GET['state'], $_SESSION['oauth_state']) || !hash_equals($_SESSION['oauth_state'], $_GET['state'])) {
    http_response_code(400);
    exit('State invalide : requête rejetée.');
}
unset($_SESSION['oauth_state']);

if (!isset($_GET['code'])) {
    http_response_code(400);
    exit('Code d\'autorisation manquant.');
}

$client = new Client(['timeout' => 5.0]);

// Discovery OIDC : récupère les endpoints du provider
$res = $client->request('GET', 'https://accounts.google.com/.well-known/openid-configuration');
$discovery = json_decode((string) $res->getBody());
$tokenEndpoint = $discovery->token_endpoint;
$userInfoEndpoint = $discovery->userinfo_endpoint;

try {
    // Échange du code contre un access token et un ID token
    $tokenResponse = $client->request('POST', $tokenEndpoint, [
        'form_params' => [
            'code' => $_GET['code'],
            'client_id' => GOOGLE_ID,
            'client_secret' => GOOGLE_SECRET,
            'redirect_uri' => REDIRECT_URI,
            'grant_type' => 'authorization_code',
        ],
    ]);

    $tokens = json_decode((string) $tokenResponse->getBody());

    // L'access token sert à interroger le resource server
    $userResponse = $client->request('GET', $userInfoEndpoint, [
        'headers' => ['Authorization' => 'Bearer ' . $tokens->access_token],
    ]);

    $userInfos = json_decode((string) $userResponse->getBody());

    if (isset($userInfos->email_verified) && $userInfos->email_verified === true) {
        session_regenerate_id(true); // évite la fixation de session
        $_SESSION['email'] = $userInfos->email;
        $_SESSION['sub'] = $userInfos->sub;
        $_SESSION['picture'] = $userInfos->picture ?? null;
        header('Location: secret.php');
        exit;
    }

    exit('Adresse e-mail non vérifiée par le provider.');
} catch (ClientException $exception) {
    http_response_code(502);
    exit('Erreur lors de l\'échange du token.');
}
