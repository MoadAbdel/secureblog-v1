<?php
// Identifiants OAuth fournis par Google Cloud Console
define('GOOGLE_ID', getenv('GOOGLE_ID') ?: 'votre-client-id.apps.googleusercontent.com');
define('GOOGLE_SECRET', getenv('GOOGLE_SECRET') ?: 'votre-client-secret');
define('REDIRECT_URI', getenv('REDIRECT_URI') ?: 'http://localhost:8000/connect.php');
