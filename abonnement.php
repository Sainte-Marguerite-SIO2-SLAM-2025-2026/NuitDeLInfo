<?php
session_start();

// Gérer la validation du jeu
if (isset($_POST['validate_game']) && $_POST['validate_game'] === 'abonnement') {
    if (!isset($_SESSION['jeuxValides'])) {
        $_SESSION['jeuxValides'] = [];
    }
    $_SESSION['jeuxValides']['abonnement'] = true;

    // Retourner une réponse simple
    echo "success";
    exit;
}

// Réinitialiser le statut du jeu au chargement de la page (seulement en GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['jeuxValides'])) {
        $_SESSION['jeuxValides'] = [];
    }
    $_SESSION['jeuxValides']['abonnement'] = false;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Match des Logiciels</title>
    <link rel="stylesheet" href="css/abonnement.css">
</head>
<body>
<div class="container">
    <h1>🎮 Match des Logiciels</h1>
    <div class="instructions">
        Reliez chaque logiciel payant à son équivalent open source en cliquant sur les paires correspondantes
    </div>
    <div class="score">Paires trouvées: <span id="score">0</span> / <span id="total">0</span></div>

    <div class="game-area" id="gameArea">
        <svg id="linesSvg"></svg>
        <div class="column">
            <div class="column-title proprietary-title">💰 Logiciels Payants</div>
            <div id="proprietaryList"></div>
        </div>
        <div class="column">
            <div class="column-title opensource-title">🔓 Open Source</div>
            <div id="opensourceList"></div>
        </div>
    </div>

    <div class="buttons">
        <button class="validate-btn" id="validateBtn">✓ Valider mes réponses</button>
        <button class="reset-btn" id="resetBtn">↻ Recommencer</button>
        <button class="home-btn" id="homeBtn">Accueil</button>
    </div>

    <div class="result" id="result"></div>
</div>

<script src="js/abonnement.js"></script>
</body>
</html>