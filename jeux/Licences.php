<?php
session_start();

// Gérer la validation du jeu
if (isset($_POST['validate_game']) && $_POST['validate_game'] === 'licences') {
    if (!isset($_SESSION['jeuxValides'])) {
        $_SESSION['jeuxValides'] = [];
    }
    $_SESSION['jeuxValides']['licences'] = true;

    // Retourner une réponse simple
    echo "success";
    exit;
}

// Réinitialiser le statut du jeu au chargement de la page (seulement en GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['jeuxValides'])) {
        $_SESSION['jeuxValides'] = [];
    }
    $_SESSION['jeuxValides']['licences'] = false;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jeu de Gestion de Licences</title>
    <link rel="stylesheet" href="../css/Licences.css">
</head>
<body>
<div class="container">
    <div class="header-controls">
        <a href="../index.php" class="btn btn-home">🏠 Accueil</a>
    </div>

    <h1>🎮 Jeu de Gestion de Licences</h1>

    <div class="game-header">
        <div class="budget-info">
            <div class="budget-item">
                <h3>Budget Total</h3>
                <div class="value" id="total-budget">0 €</div>
            </div>
            <div class="budget-item">
                <h3>Dépensé</h3>
                <div class="value" id="spent-budget">0 €</div>
            </div>
            <div class="budget-item" id="remaining-budget-card">
                <h3>Restant</h3>
                <div class="value" id="remaining-budget">0 €</div>
            </div>
        </div>

        <div class="requirements">
            <h2>📋 Exigences du Projet</h2>
            <div class="requirement-list" id="requirements-list"></div>
        </div>
    </div>

    <div class="licenses-grid" id="licenses-grid"></div>

    <div class="actions">
        <button class="btn btn-validate" onclick="validateSelection()">✓ Valider la Sélection</button>
        <button class="btn btn-reset" onclick="resetGame()">↻ Réinitialiser</button>
        <button class="btn btn-new" onclick="newGame()">🎲 Nouvelle Partie</button>
    </div>
</div>

<div class="modal" id="result-modal">
    <div class="modal-content" id="modal-content">
        <h2 id="modal-title"></h2>
        <p id="modal-message"></p>
        <button class="btn btn-validate close-modal" onclick="closeModal()">Fermer</button>
    </div>
</div>

<script src="../js/Licences.js"></script>
</body>
</html>