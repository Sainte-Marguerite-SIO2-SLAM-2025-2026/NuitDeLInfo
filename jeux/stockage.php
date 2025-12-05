<?php
session_start();

// Traitement de la validation du jeu
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données POST
    $postData = file_get_contents('php://input');
    parse_str($postData, $data);

    if (isset($data['validated'])) {
        if (!isset($_SESSION['jeuxValides'])) {
            $_SESSION['jeuxValides'] = [];
        }

        // La variable de session est mise à jour en fonction de la valeur string 'true' ou 'false' reçue du JS.
        // Convertit la chaîne 'true' en booléen true, et 'false' en booléen false.
        $validationResult = ($data['validated'] === 'true');

        // Clé : 'Stockage'
        $_SESSION['jeuxValides']['stockage'] = $validationResult;

        echo json_encode(['success' => true]);
    }
    exit();
}

// Pour une requête GET (chargement de la page), nous nous assurons que la variable existe
// et l'initialisons à false si elle n'a jamais été définie (première visite).
if (!isset($_SESSION['jeuxValides']['stockage'])) {
    if (!isset($_SESSION['jeuxValides'])) {
        $_SESSION['jeuxValides'] = [];
    }
    $_SESSION['jeuxValides']['stockage'] = false;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stockage - Classification des données</title>
    <link rel="stylesheet" href="../css/Stockage.css">
</head>
<body>
<div class="container">
    <header>
        <h1>🔒 Stockage des Données</h1>
        <p>Classez les éléments selon qu'ils concernent le stockage dans l'UE ou hors UE</p>
    </header>

    <div class="game-content">
        <div class="items-pool" id="itemsPool">
            <h2>📋 Éléments à classer</h2>
            <!-- Les items seront ajoutés ici par JavaScript -->
        </div>

        <div class="drop-zones">
            <div class="drop-zone eu" id="euZone">
                <h3>🇪🇺 Stockage dans l'UE</h3>
                <!-- Les items déposés ici -->
            </div>

            <div class="drop-zone hors-eu" id="horsEuZone">
                <h3>🌍 Stockage hors UE</h3>
                <!-- Les items déposés ici -->
            </div>
        </div>
    </div>

    <div class="navigation">
        <button id="validateBtn" class="btn-validate" disabled>Valider mes réponses</button>
    </div>
</div>

<div id="modal" class="modal">
    <div class="modal-content">
        <h2 id="modalTitle"></h2>
        <p id="modalScore"></p>
        <p id="modalMessage"></p>
        <button id="modalBtn" class="btn-modal">Retour à l'accueil</button>
    </div>
</div>

<script src="../js/Stockage.js"></script>
</body>
</html>