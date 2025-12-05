<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PC Builder - Assemblez votre ordinateur</title>
    <link rel="stylesheet" href="css/index.css">
</head>
<body>

<?php
session_start();
// Initialiser le tableau des jeux validés
if(!isset($_SESSION['jeuxValides']))
{
    $_SESSION['jeuxValides'] = [
            'licences' => false,
            'abonnement' => false,
            'SysExp' => false,
            'stockage' => false
    ];
}

// Initialiser les composants placés
if(!isset($_SESSION['composantsPlaces']))
{
    $_SESSION['composantsPlaces'] = [];
}

// Gérer le retour d'une page avec validation
if(isset($_GET['validated'])) {
    $component = $_GET['validated'];

    // Mapping des composants aux clés de session
    $componentMapping = [
            'motherboard' => 'SysExp',
            'ram' => 'licences',
            'gpu' => 'abonnement',
            'cooling' => 'stockage'
    ];

    if(isset($componentMapping[$component])) {
        $_SESSION['jeuxValides'][$componentMapping[$component]] = true;
    }

    // Rediriger pour nettoyer l'URL
    header("Location: index.php");
    exit();
}

// Gérer l'enregistrement du nom du jeu
if(isset($_POST['setGameName'])) {
    $gameName = $_POST['gameName'];
    $_SESSION['jeuxSelectionne'] = $gameName;
    echo json_encode(['success' => true, 'gameName' => $gameName]);
    exit();
}

// Gérer la sélection d'un composant via AJAX
if(isset($_POST['selectComponent'])) {
    $component = $_POST['component'];
    $_SESSION['composantSelectionne'] = $component;

    if(!in_array($component, $_SESSION['composantsPlaces'])) {
        $_SESSION['composantsPlaces'][] = $component;
    }

    echo json_encode(['success' => true, 'page' => 'video.php']);
    exit();
}

// Fermer le modal de bienvenue
if(isset($_POST['closeWelcome'])) {
    $_SESSION['welcomeClosed'] = true;
    header("Location: index.php");
    exit();
}

$welcomeClosed = isset($_SESSION['welcomeClosed']) ? $_SESSION['welcomeClosed'] : false;
$composantsPlacesJson = json_encode($_SESSION['composantsPlaces']);
$jeuxValidesJson = json_encode($_SESSION['jeuxValides']);
?>

<div class="container">
    <h1>🖥️ Assemblez votre PC</h1>

    <div class="game-area">
        <div class="components-left" id="componentsLeft"></div>

        <div class="pc-container">
            <svg class="pc-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                <!-- Boîtier PC -->
                <rect x="50" y="50" width="300" height="400" rx="10" fill="#2c3e50" stroke="#34495e" stroke-width="3"/>
                <rect x="60" y="60" width="280" height="380" rx="8" fill="#34495e"/>

                <!-- Zone Carte Mère -->
                <rect class="drop-zone" id="motherboard-zone" data-component="motherboard" x="90" y="90" width="220" height="100" rx="5" fill="#1abc9c" opacity="0.3" stroke="#16a085" stroke-width="2"/>
                <text x="200" y="145" text-anchor="middle" fill="white" font-size="14" font-weight="bold">CARTE MÈRE</text>

                <!-- Zone RAM -->
                <rect class="drop-zone" id="ram-zone" data-component="ram" x="120" y="210" width="160" height="40" rx="5" fill="#9b59b6" opacity="0.3" stroke="#8e44ad" stroke-width="2"/>
                <text x="200" y="235" text-anchor="middle" fill="white" font-size="14" font-weight="bold">RAM</text>

                <!-- Zone GPU -->
                <rect class="drop-zone" id="gpu-zone" data-component="gpu" x="120" y="270" width="160" height="70" rx="5" fill="#e74c3c" opacity="0.3" stroke="#c0392b" stroke-width="2"/>
                <text x="200" y="310" text-anchor="middle" fill="white" font-size="14" font-weight="bold">GPU</text>

                <!-- Zone Refroidissement -->
                <rect class="drop-zone" id="cooling-zone" data-component="cooling" x="120" y="360" width="160" height="60" rx="5" fill="#3498db" opacity="0.3" stroke="#2980b9" stroke-width="2"/>
                <text x="200" y="395" text-anchor="middle" fill="white" font-size="14" font-weight="bold">REFROIDISSEMENT</text>
            </svg>
        </div>

        <div class="components-right" id="componentsRight"></div>
    </div>
</div>

<!-- Modal de bienvenue -->
<?php if(!$welcomeClosed): ?>
    <div class="modal active" id="welcomeModal">
        <div class="modal-content">
            <h2>Bienvenue ! 🎮</h2>
            <p>Glissez-déposez les composants sur les zones appropriées du boîtier PC pour assembler votre ordinateur.</p>
            <p><strong>4 composants à placer :</strong><br>Carte Mère, RAM, GPU et Refroidissement</p>
            <p>Une fois un composant correctement placé, vous pourrez découvrir plus d'informations à son sujet !</p>
            <form method="POST">
                <button type="submit" name="closeWelcome" class="btn btn-primary">Commencer</button>
            </form>
        </div>
    </div>
<?php endif; ?>

<!-- Modal de confirmation -->
<div class="modal" id="confirmModal">
    <div class="modal-content">
        <h2 id="modalTitle">Bien joué ! 🎉</h2>
        <p id="modalText">Vous avez placé le composant correctement !</p>
        <p><strong>Voulez-vous en savoir plus sur ce composant ?</strong></p>
        <div class="modal-buttons">
            <button class="btn btn-secondary" onclick="stayOnPage()">Rester ici</button>
            <button class="btn btn-primary" onclick="goToPage()">En savoir plus</button>
        </div>
    </div>
</div>

<!-- Modal finale (tous les composants validés) -->
<div class="modal" id="finalModal">
    <div class="modal-content">
        <h2>🎉 Félicitations ! 🎉</h2>
        <p>Vous avez assemblé tous les composants de votre PC !</p>
        <p><strong>Vous avez débloqué le jeu final :</strong></p>
        <p style="font-size: 1.5em; font-weight: bold; color: #667eea;">⚙️ Matériel Obsolète</p>
        <p>Êtes-vous prêt pour le défi ultime ?</p>
        <div class="modal-buttons">
            <button class="btn btn-primary" onclick="goToFinalGame()">Jouer maintenant !</button>
        </div>
    </div>
</div>

<script>
    // Passer les composants déjà placés au JavaScript
    const composantsPlaces = <?= $composantsPlacesJson ?>;
    const jeuxValides = <?= $jeuxValidesJson ?>;
</script>
<script src="js/index.js"></script>
</body>
</html>