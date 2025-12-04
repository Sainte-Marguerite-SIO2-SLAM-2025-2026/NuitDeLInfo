<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jeu de Gestion de Licences</title>
    <link rel="stylesheet" href="../css/Licences.css">
    <!-- Chemin correct si les dossiers jeux, css, js et data sont au même niveau -->
</head>
<body>
<div class="container">
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
<script>
    // Si le chargement JSON échoue, vérifiez que vous utilisez un serveur local
    // Pour tester sans serveur, décommentez la ligne suivante :
    // window.USE_INLINE_DATA = true;
</script>
</body>
</html>