const video = document.getElementById('videoPlayer');
const overlay = document.getElementById('controlsOverlay');
const btnContinuer = document.getElementById('btnContinuer');
const btnRejouer = document.getElementById('btnRejouer');
const jeuxSelectionne = video.getAttribute('data-jeu');

// Mettre la vidéo en plein écran au chargement
window.addEventListener('load', function() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }

    video.play().catch(function(error) {
        console.log("Lecture automatique bloquée:", error);
    });
});

// Afficher l'overlay quand la vidéo se termine
video.addEventListener('ended', function() {
    // Quitter le plein écran
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    // Afficher l'overlay
    overlay.classList.add('show');
});

// Cacher l'overlay quand la vidéo recommence
video.addEventListener('play', function() {
    if (video.currentTime < video.duration - 1) {
        overlay.classList.remove('show');
    }
});

// Bouton Continuer - Rediriger vers la page de jeu
btnContinuer.addEventListener('click', function() {
    // Rediriger vers la page de jeu correspondante
    window.location.href = 'jeux/' + jeuxSelectionne + '.php';
});

// Bouton Rejouer - Relancer la vidéo
btnRejouer.addEventListener('click', function() {
    video.currentTime = 0;
    video.play();
    overlay.classList.remove('show');

    // Remettre en plein écran
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
});

// Gestion des erreurs de chargement vidéo
video.addEventListener('error', function() {
    overlay.innerHTML = `
        <div class="message">
            <h2>Erreur de chargement</h2>
            <p>La vidéo n'a pas pu être chargée. Veuillez vérifier que le fichier existe.</p>
        </div>
        <div class="buttons">
            <button class="btn btn-primary" onclick="location.reload()">
                Réessayer
            </button>
        </div>
    `;
    overlay.classList.add('show');
});