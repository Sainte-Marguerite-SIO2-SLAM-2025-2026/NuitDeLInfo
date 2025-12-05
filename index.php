<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PC Builder - Assemblez votre ordinateur</title>
    <link rel="stylesheet" href="css/index.css">
    <style>
        .component-disabled {
            position: relative;
        }

        .component-disabled::after {
            content: '✓ Validé';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 12px;
        }
    </style>
</head>
<body>

<?php
session_start();

// Option de reset (pour le développement)
if(isset($_GET['reset'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}

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

        // Ajouter le composant à la liste des composants placés s'il n'y est pas déjà
        if(!in_array($component, $_SESSION['composantsPlaces'])) {
            $_SESSION['composantsPlaces'][] = $component;
        }
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

// Marquer tous les composants comme validés
if(isset($_POST['allComponentsValidated'])) {
    $_SESSION['allComponentsValidated'] = true;
    echo json_encode(['success' => true]);
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

// Vérifier si tous les composants ont été validés
$allComponentsValidated = count($_SESSION['composantsPlaces']) >= 4;
$showFinalModal = $allComponentsValidated && !isset($_SESSION['finalModalShown']);

// Marquer la modale finale comme affichée
if($showFinalModal) {
    $_SESSION['finalModalShown'] = true;
}
?>

<div class="container">
    <h1>🖥️ Assemblez votre PC</h1>

    <!-- Bouton de debug (à retirer en production) -->
    <div style="text-align: center; margin-bottom: 20px;">
        <a href="?reset" class="btn btn-secondary">🔄 Réinitialiser</a>
    </div>

    <div class="game-area">
        <div class="components-left" id="componentsLeft"></div>

        <div class="pc-container">
            <svg data-name="Calque 2" version="1.1" viewBox="0 0 548.59 569.95" xmlns="http://www.w3.org/2000/svg">
                <image xlink:href="images/boitier.svg" x="0" y="0" width="100%" height="100%" id="image-fond" style="pointer-events: none;"/>

                <g id="carte_mere">
                    <image id="carte_mere_image" x="290.45" y="325.54" width="149.51" height="133.28" xlink:href="" />
                    <rect class="drop-zone" x="290.45" y="325.54" width="149.51" height="133.28" fill="transparent" stroke="#4caf50"  stroke-width="3" stroke-dasharray="5,5"/>
                </g>

                <g id="ram">
                    <image id="ram_image" x="78.569" y="267.26" width="150.7" height="35.421" xlink:href="" />
                    <rect class="drop-zone" x="78.569" y="267.26" width="150.7" height="35.421" fill="transparent" stroke="#4caf50"  stroke-width="3" stroke-dasharray="5,5"/>
                </g>

                <g id="gpu">
                    <image id="gpu_image" x="184.19" y="235.06" width="293.56" height="87.984" xlink:href="" />
                    <rect class="drop-zone" x="184.19" y="235.06" width="293.56" height="87.984" fill="transparent" stroke="#4caf50"  stroke-width="3" stroke-dasharray="5,5" />
                </g>

                <g id="cooling">
                    <image id="cooling_image" x="101.75" y="96.602" width="163" height="124" xlink:href="" />
                    <rect class="drop-zone" x="101.75" y="96.602" width="163" height="124" fill="transparent" stroke="#4caf50"  stroke-width="3" stroke-dasharray="5,5"/>
                </g>
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
<div class="modal <?php echo $showFinalModal ? 'active' : ''; ?>" id="finalModal">
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

    // Fonction de debug
    function showDebugInfo() {
        alert(
            'Composants placés: ' + JSON.stringify(composantsPlaces) + '\n\n' +
            'Jeux validés: ' + JSON.stringify(jeuxValides) + '\n\n' +
            'Nombre de composants: ' + composantsPlaces.length
        );
    }
</script>
<script src="js/index.js"></script>
</body>
</html>