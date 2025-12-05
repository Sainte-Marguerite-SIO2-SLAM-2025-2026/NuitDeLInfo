<?php
session_start();

// Récupérer le jeu sélectionné
$jeuxSelectionne = $_SESSION['jeuxSelectionne'] ?? '';

// Si aucun jeu n'est sélectionné, rediriger ou afficher une erreur
if (empty($jeuxSelectionne)) {
    die("Aucun jeu sélectionné. Veuillez retourner à la page précédente.");
}

// Construire le chemin de la vidéo
$cheminVideo = "videos/" . htmlspecialchars($jeuxSelectionne) . ".mp4";
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vidéo - <?php echo htmlspecialchars($jeuxSelectionne); ?></title>
    <link rel="stylesheet" href="css/video.css">
</head>
<body>
<div class="container">
    <div class="video-wrapper">
        <video id="videoPlayer" controls data-jeu="<?php echo htmlspecialchars($jeuxSelectionne); ?>">
            <source src="<?php echo $cheminVideo; ?>" type="video/mp4">
            Votre navigateur ne supporte pas la lecture de vidéos.
        </video>

        <div class="controls-overlay" id="controlsOverlay">
            <div class="message">
                <h2>Vidéo terminée !</h2>
                <p>Que souhaitez-vous faire ?</p>
            </div>
            <div class="buttons">
                <button class="btn btn-primary" id="btnContinuer">
                    Commencer le jeu
                </button>
                <button class="btn btn-secondary" id="btnRejouer">
                    Revoir la vidéo
                </button>
            </div>
        </div>
    </div>
</div>

<script src="js/video.js"></script>
</body>
</html>