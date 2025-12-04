<?php
session_start();
// Réinitialiser le statut du jeu au chargement de la page (seulement en GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['jeuxValides'])) {
        $_SESSION['jeuxValides'] = [
            'licences' => false,
        ];
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <p><?= 'aaaaa'. $_SESSION['jeuxValides']['licences']; ?></p>
</body>
</html>
