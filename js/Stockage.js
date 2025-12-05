let allItems = [];
let selectedItems = [];
let placements = {};

// Charger les données depuis le fichier JSON
fetch('../data/Stockage.json')
    .then(response => response.json())
    .then(data => {
        allItems = data.items;
        initGame();
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
    });

// Initialiser le jeu
function initGame() {
    // Sélectionner 5 items EU et 5 items hors EU aléatoirement
    const euItems = allItems.filter(item => item.category === 'eu');
    const horsEuItems = allItems.filter(item => item.category === 'hors_eu');

    const selectedEu = selectRandomItems(euItems, 5);
    const selectedHorsEu = selectRandomItems(horsEuItems, 5);

    selectedItems = [...selectedEu, ...selectedHorsEu];

    // Mélanger les items pour l'affichage
    selectedItems = selectedItems.sort(() => Math.random() - 0.5);

    displayItems();
    setupDragAndDrop();
}

// Sélectionner des items aléatoires
function selectRandomItems(itemsArray, count) {
    const shuffled = [...itemsArray].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Afficher les items dans la zone de pool
function displayItems() {
    const itemsPool = document.getElementById('itemsPool');
    itemsPool.innerHTML = '';

    selectedItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.draggable = true;
        itemDiv.dataset.id = item.id;
        itemDiv.dataset.category = item.category;
        itemDiv.textContent = item.text;
        itemsPool.appendChild(itemDiv);
    });
}

// Configuration du drag and drop
function setupDragAndDrop() {
    const items = document.querySelectorAll('.item');
    const dropZones = document.querySelectorAll('.drop-zone');

    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('dragenter', handleDragEnter);
    });

    // Permettre le retour vers le pool
    const itemsPool = document.getElementById('itemsPool');
    itemsPool.addEventListener('dragover', handleDragOver);
    itemsPool.addEventListener('drop', handleDrop);
    itemsPool.addEventListener('dragleave', handleDragLeave);
    itemsPool.addEventListener('dragenter', handleDragEnter);
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');

    // Retirer la classe drag-over de toutes les zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    document.getElementById('itemsPool').classList.remove('drag-over');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    // Vérifier que nous quittons bien la zone et pas un enfant
    if (e.target === this) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('drag-over');

    if (draggedElement) {
        // Ajouter l'élément à la zone de dépôt
        if (this.classList.contains('drop-zone') || this.id === 'itemsPool') {
            this.appendChild(draggedElement);

            // Enregistrer le placement si c'est dans une drop zone
            const itemId = draggedElement.dataset.id;
            if (this.classList.contains('drop-zone')) {
                const zoneType = this.classList.contains('eu') ? 'eu' : 'hors_eu';
                placements[itemId] = zoneType;
            } else {
                // Retour au pool, supprimer le placement
                delete placements[itemId];
            }

            // Réactiver le bouton valider si tous les items sont placés
            checkAllPlaced();
        }
    }

    return false;
}

// Vérifier si tous les items sont placés
function checkAllPlaced() {
    const validateBtn = document.getElementById('validateBtn');
    const placedCount = Object.keys(placements).length;

    if (placedCount === selectedItems.length) {
        validateBtn.disabled = false;
    } else {
        validateBtn.disabled = true;
    }
}

// Valider les réponses
document.getElementById('validateBtn').addEventListener('click', () => {
    let score = 0;

    // Vérifier chaque placement
    selectedItems.forEach(item => {
        const itemElement = document.querySelector(`[data-id="${item.id}"]`);
        const placedZone = placements[item.id];

        if (placedZone === item.category) {
            score++;
            itemElement.classList.add('correct');
        } else {
            itemElement.classList.add('incorrect');
        }
    });

    // Désactiver le drag and drop
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.draggable = false;
        item.style.cursor = 'default';
    });

    // Afficher les résultats après un court délai
    setTimeout(() => {
        showResults(score);
    }, 1000);
});

// Afficher les résultats
function showResults(score) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalScore = document.getElementById('modalScore');
    const modalMessage = document.getElementById('modalMessage');
    const isValidated = score >= 7;

    modalTitle.textContent = isValidated ? '🎉 Félicitations !' : '😔 Pas encore...';
    modalScore.textContent = `Score : ${score}/10`;

    // Déterminer le statut à envoyer au serveur
    const validationStatus = isValidated ? 'true' : 'false';

    if (isValidated) {
        modalMessage.textContent = 'Vous avez validé le jeu ! Vous maîtrisez maintenant les enjeux du stockage des données dans l\'UE.';
    } else {
        modalMessage.textContent = 'Continuez à apprendre sur le stockage sécurisé des données ! Réessayez pour améliorer votre score.';
    }

    // Envoi de la requête dans tous les cas (true ou false)
    fetch('Stockage.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'validated=' + validationStatus
    });

    modal.style.display = 'block';
}

// Retour à l'index
document.getElementById('modalBtn').addEventListener('click', () => {
    window.location.href = '../index.php';
});