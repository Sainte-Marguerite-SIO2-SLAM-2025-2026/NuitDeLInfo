const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const validateBtn = document.getElementById('validateBtn');
const info = document.getElementById('info');
const resultModal = document.getElementById('resultModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cartesPeripheriques = document.getElementById('cartes-peripheriques');
const connexionsSpan = document.getElementById('connexions');
const totalSpan = document.getElementById('total');

let selectedCarte = null;
let lines = [];
let connectedCartes = new Set();
let cartesObsoletes = [];
let cartesNonObsoletes = [];

// Initialiser le canvas
function initCanvas() {
    const gameArea = document.querySelector('.game-area');
    canvas.width = gameArea.offsetWidth;
    canvas.height = gameArea.offsetHeight;
}

initCanvas();

// Générer les cartes à partir de la config
function genererCartes() {
    const cartes = gameConfig.cartes;

    // Mélanger les cartes
    const cartesMelangees = [...cartes].sort(() => Math.random() - 0.5);

    cartesMelangees.forEach((carte, index) => {
        if (carte.obsolete) {
            cartesObsoletes.push(carte.id);
        } else {
            cartesNonObsoletes.push(carte.id);
        }

        const carteContainer = document.createElement('div');
        carteContainer.className = 'carte-container carte-peripherique';
        carteContainer.dataset.index = index;

        const carteElement = document.createElement('div');
        carteElement.className = 'carte';
        carteElement.id = `carte-${carte.id}`;
        carteElement.dataset.id = carte.id;
        carteElement.dataset.obsolete = carte.obsolete;
        carteElement.dataset.raison = carte.raison;

        carteElement.innerHTML = `
            <div class="carte-content">
                <div class="carte-icon">${carte.icon}</div>
                <div class="carte-title">${carte.titre}</div>
            </div>
        `;

        carteContainer.appendChild(carteElement);
        cartesPeripheriques.appendChild(carteContainer);
    });

    totalSpan.textContent = cartesObsoletes.length;
    positionnerCartes();
}

// Positionner les cartes en cercle autour de la carte centrale
function positionnerCartes() {
    const carteContainers = document.querySelectorAll('.carte-peripherique');
    const centraleContainer = document.querySelector('.carte-centrale');
    const gameArea = document.querySelector('.game-area');

    const centerX = gameArea.offsetWidth / 2;
    const centerY = gameArea.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    // Positionner la carte centrale
    centraleContainer.style.left = `${centerX}px`;
    centraleContainer.style.top = `${centerY}px`;

    // Positionner les cartes périphériques en cercle
    carteContainers.forEach((container, index) => {
        const angle = (index / carteContainers.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
    });
}

// Obtenir le centre d'une carte
function getCarteCenter(carteElement) {
    const container = carteElement.closest('.carte-container');
    const containerRect = container.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const x = containerRect.left - canvasRect.left + containerRect.width / 2;
    const y = containerRect.top - canvasRect.top + containerRect.height / 2;

    return { x, y };
}

// Gérer les clics sur les cartes
document.addEventListener('click', function(e) {
    const carte = e.target.closest('.carte');
    if (!carte) return;

    const carteId = carte.dataset.id;
    const carteType = carte.dataset.type;

    // Vérifier si la carte est déjà connectée
    if (connectedCartes.has(carteId) && carteId !== 'centrale') {
        info.innerHTML = '⛔ Cette carte est déjà reliée !';
        return;
    }

    if (selectedCarte === null) {
        // Première sélection
        const center = getCarteCenter(carte);
        selectedCarte = {
            id: carteId,
            element: carte,
            x: center.x,
            y: center.y,
            obsolete: carte.dataset.obsolete === 'true'
        };
        carte.classList.add('selected');
        info.innerHTML = '✅ Carte sélectionnée - Cliquez sur une autre carte pour relier';
    } else {
        // Deuxième sélection
        if (carteId === selectedCarte.id) {
            info.innerHTML = '⚠️ Vous ne pouvez pas relier une carte à elle-même !';
            return;
        }

        // Vérifier qu'au moins une des deux cartes est la carte centrale
        if (carteId !== 'centrale' && selectedCarte.id !== 'centrale') {
            info.innerHTML = '⚠️ Vous devez relier les cartes à la carte centrale !';
            return;
        }

        const center = getCarteCenter(carte);
        const secondCarte = {
            id: carteId,
            element: carte,
            x: center.x,
            y: center.y,
            obsolete: carte.dataset.obsolete === 'true'
        };

        // Créer la ligne
        drawLine(selectedCarte.x, selectedCarte.y, secondCarte.x, secondCarte.y);

        lines.push({
            carte1Id: selectedCarte.id,
            carte2Id: secondCarte.id,
            x1: selectedCarte.x,
            y1: selectedCarte.y,
            x2: secondCarte.x,
            y2: secondCarte.y,
            obsolete1: selectedCarte.obsolete,
            obsolete2: secondCarte.obsolete
        });

        // Marquer les cartes comme connectées (sauf la centrale)
        if (selectedCarte.id !== 'centrale') {
            connectedCartes.add(selectedCarte.id);
            selectedCarte.element.classList.add('locked');
        }
        if (secondCarte.id !== 'centrale') {
            connectedCartes.add(secondCarte.id);
            secondCarte.element.classList.add('locked');
        }

        selectedCarte.element.classList.remove('selected');
        carte.classList.remove('selected');

        selectedCarte = null;

        // Mettre à jour le compteur
        connexionsSpan.textContent = connectedCartes.size;
        info.innerHTML = `✅ Connexion créée ! (${connectedCartes.size}/${cartesObsoletes.length})`;

        // Activer le bouton valider quand assez de connexions
        if (connectedCartes.size >= cartesObsoletes.length) {
            validateBtn.disabled = false;
            info.innerHTML = '🎯 Vous pouvez maintenant valider votre sélection !';
        }
    }
});

// Dessiner une ligne
function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(52, 152, 219, 0.4)';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.shadowBlur = 0;

    drawPoint(x1, y1);
    drawPoint(x2, y2);
}

function drawPoint(x, y) {
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

// Redessiner toutes les lignes
function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        drawLine(line.x1, line.y1, line.x2, line.y2);
    });
}

// Annuler la dernière action
undoBtn.addEventListener('click', function() {
    if (selectedCarte !== null) {
        // Annuler la sélection en cours
        selectedCarte.element.classList.remove('selected');
        selectedCarte = null;
        info.innerHTML = '↶ Sélection annulée';
    } else if (lines.length > 0) {
        // Annuler la dernière ligne
        const lastLine = lines.pop();

        if (lastLine.carte1Id !== 'centrale') {
            connectedCartes.delete(lastLine.carte1Id);
            document.getElementById(`carte-${lastLine.carte1Id}`).classList.remove('locked');
        }
        if (lastLine.carte2Id !== 'centrale') {
            connectedCartes.delete(lastLine.carte2Id);
            document.getElementById(`carte-${lastLine.carte2Id}`).classList.remove('locked');
        }

        connexionsSpan.textContent = connectedCartes.size;
        validateBtn.disabled = true;
        redrawAll();
        info.innerHTML = `↶ Dernière connexion annulée (${connectedCartes.size}/${cartesObsoletes.length})`;
    } else {
        info.innerHTML = '⚠️ Rien à annuler';
    }
});

// Réinitialiser le jeu
function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = [];
    connectedCartes.clear();
    selectedCarte = null;
    connexionsSpan.textContent = '0';

    document.querySelectorAll('.carte').forEach(carte => {
        carte.classList.remove('locked', 'selected', 'correct', 'incorrect');
    });

    validateBtn.disabled = true;
    info.innerHTML = 'Reliez la carte centrale aux matériels obsolètes';
}

resetBtn.addEventListener('click', resetGame);

// Valider la sélection
validateBtn.addEventListener('click', function() {
    validateBtn.disabled = true;
    info.innerHTML = '⏳ Vérification en cours...';

    // Récupérer les IDs des cartes connectées
    const cartesSelectionnees = Array.from(connectedCartes).map(id => parseInt(id));

    // Vérifier si toutes les cartes obsolètes sont sélectionnées
    const toutesObsoletesSelectionnees = cartesObsoletes.every(id =>
        cartesSelectionnees.includes(id)
    );

    // Vérifier qu'aucune carte non obsolète n'est sélectionnée
    const aucuneNonObsoleteSelectionnee = cartesSelectionnees.every(id =>
        cartesObsoletes.includes(id)
    );

    const reussite = toutesObsoletesSelectionnees && aucuneNonObsoleteSelectionnee;

    // Colorer les cartes selon le résultat
    cartesSelectionnees.forEach(id => {
        const carte = document.getElementById(`carte-${id}`);
        if (cartesObsoletes.includes(id)) {
            carte.classList.add('correct');
        } else {
            carte.classList.add('incorrect');
        }
    });

    // Afficher le résultat
    if (reussite) {
        document.getElementById('resultTitle').innerHTML = '🎉 Excellent travail !';
        document.getElementById('resultMessage').innerHTML = 'Vous avez correctement identifié tous les matériels obsolètes !';

        const explicationZone = document.getElementById('explicationZone');
        explicationZone.innerHTML = '<h3 style="color: #27ae60;">✓ Matériels obsolètes identifiés :</h3>';

        const liste = document.createElement('ul');
        liste.style.textAlign = 'left';
        liste.style.marginTop = '15px';

        gameConfig.cartes.filter(c => c.obsolete).forEach(carte => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${carte.titre}</strong> : ${carte.raison}`;
            li.style.marginBottom = '10px';
            liste.appendChild(li);
        });

        explicationZone.appendChild(liste);
        explicationZone.style.display = 'block';
    } else {
        document.getElementById('resultTitle').innerHTML = '❌ Erreur d\'identification';
        document.getElementById('resultMessage').innerHTML = 'Certains matériels n\'ont pas été correctement identifiés.';

        const explicationZone = document.getElementById('explicationZone');
        explicationZone.innerHTML = '';

        // Cartes manquées
        const manquees = cartesObsoletes.filter(id => !cartesSelectionnees.includes(id));
        if (manquees.length > 0) {
            const sectionManquees = document.createElement('div');
            sectionManquees.style.marginBottom = '20px';
            sectionManquees.innerHTML = '<h3 style="color: #e74c3c;">✗ Matériels obsolètes non identifiés :</h3>';

            const listeManquees = document.createElement('ul');
            listeManquees.style.textAlign = 'left';

            manquees.forEach(id => {
                const carte = gameConfig.cartes.find(c => c.id === id);
                const li = document.createElement('li');
                li.innerHTML = `<strong>${carte.titre}</strong> : ${carte.raison}`;
                li.style.color = '#e74c3c';
                li.style.marginBottom = '8px';
                listeManquees.appendChild(li);
            });

            sectionManquees.appendChild(listeManquees);
            explicationZone.appendChild(sectionManquees);
        }

        // Cartes incorrectement sélectionnées
        const incorrectes = cartesSelectionnees.filter(id => !cartesObsoletes.includes(id));
        if (incorrectes.length > 0) {
            const sectionIncorrectes = document.createElement('div');
            sectionIncorrectes.style.marginBottom = '20px';
            sectionIncorrectes.innerHTML = '<h3 style="color: #e67e22;">⚠ Matériels en bon état (ne devaient pas être reliés) :</h3>';

            const listeIncorrectes = document.createElement('ul');
            listeIncorrectes.style.textAlign = 'left';

            incorrectes.forEach(id => {
                const carte = gameConfig.cartes.find(c => c.id === id);
                const li = document.createElement('li');
                li.innerHTML = `<strong>${carte.titre}</strong> : ${carte.raison}`;
                li.style.color = '#e67e22';
                li.style.marginBottom = '8px';
                listeIncorrectes.appendChild(li);
            });

            sectionIncorrectes.appendChild(listeIncorrectes);
            explicationZone.appendChild(sectionIncorrectes);
        }

        explicationZone.style.display = 'block';
    }

    resultModal.style.display = 'block';
});

// Fermer la modal
closeModalBtn.addEventListener('click', function() {
    resultModal.style.display = 'none';
    resetGame();
});

// Modal des règles
const mascotteContainer = document.querySelector("#mascotte-container");
const rulesModal = document.getElementById('rulesModal');
const closeRules = document.querySelector('.close-rules');

if (mascotteContainer) {
    mascotteContainer.addEventListener("click", function() {
        if (rulesModal) {
            rulesModal.style.display = 'block';
        }
    });
}

if (closeRules) {
    closeRules.addEventListener('click', function() {
        rulesModal.style.display = 'none';
    });
}

window.addEventListener('click', function(event) {
    if (event.target === rulesModal) {
        rulesModal.style.display = 'none';
    }
    if (event.target === resultModal) {
        resultModal.style.display = 'none';
        resetGame();
    }
});

// Fermer avec Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (rulesModal && rulesModal.style.display === 'block') {
            rulesModal.style.display = 'none';
        }
        if (resultModal && resultModal.style.display === 'block') {
            resultModal.style.display = 'none';
            resetGame();
        }
    }
});

// Recalculer au resize
window.addEventListener('resize', function() {
    initCanvas();
    positionnerCartes();

    if (lines.length > 0) {
        lines.forEach(line => {
            const carte1 = document.getElementById(`carte-${line.carte1Id}`);
            const carte2 = document.getElementById(`carte-${line.carte2Id}`);

            const center1 = getCarteCenter(carte1);
            const center2 = getCarteCenter(carte2);

            line.x1 = center1.x;
            line.y1 = center1.y;
            line.x2 = center2.x;
            line.y2 = center2.y;
        });

        redrawAll();
    }
});

// Initialiser le jeu
genererCartes();