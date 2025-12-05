// =======================
// Données des composants
// =======================
const components = {
    motherboard: {
        key: 'motherboard',
        name: 'Carte mère',
        img: 'images/carte_m.svg',
        theme: 'SysExp', // Nom de la vidéo/thème
        page: 'video.php',
        dropZoneId: 'carte_mere',
        svgImageId: 'carte_mere_image'
    },
    ram: {
        key: 'ram',
        name: 'Mémoire RAM',
        img: 'images/ram.svg',
        theme: 'licences', // Nom de la vidéo/thème
        page: 'video.php',
        dropZoneId: 'ram',
        svgImageId: 'ram_image'
    },
    gpu: {
        key: 'gpu',
        name: 'Carte graphique',
        img: 'images/carte_grap.svg',
        theme: 'abonnement', // Nom de la vidéo/thème
        page: 'video.php',
        dropZoneId: 'gpu',
        svgImageId: 'gpu_image'
    },
    cooling: {
        key: 'cooling',
        name: 'Refroidissement',
        img: 'images/ventilateur.svg',
        theme: 'stockage', // Nom de la vidéo/thème
        page: 'video.php',
        dropZoneId: 'cooling',
        svgImageId: 'cooling_image'
    }
};

// =======================
// Variables globales
// =======================
let draggedElement = null;
let currentKey = null;
let originalParent = null;
let originalNextSibling = null;
let lastDropZone = null;

// =======================
// Initialisation
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const leftContainer = document.getElementById('componentsLeft');
    const rightContainer = document.getElementById('componentsRight');

    const keys = Object.keys(components);
    const leftKeys = keys.slice(0, 2);
    const rightKeys = keys.slice(2);

    leftKeys.forEach(key => createComponentDiv(key, leftContainer));
    rightKeys.forEach(key => createComponentDiv(key, rightContainer));

    setupDropZones();

    // Restaurer l'état des composants déjà placés
    restorePlacedComponents();
});

// =======================
// Création des div composants
// =======================
function createComponentDiv(key, container) {
    const comp = components[key];

    const div = document.createElement('div');
    div.classList.add('component');

    // Vérifier si le composant est déjà placé
    const isPlaced = Array.isArray(composantsPlaces) && composantsPlaces.length > 0 && composantsPlaces.includes(key);

    console.log(`Composant ${key}: isPlaced = ${isPlaced}, composantsPlaces =`, composantsPlaces);

    if (!isPlaced) {
        div.setAttribute('draggable', 'true');
        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragend', handleDragEnd);
    } else {
        // Si déjà placé, désactiver le drag et griser le composant
        div.classList.add('component-disabled');
        div.style.opacity = '0.5';
        div.style.cursor = 'not-allowed';
    }

    div.dataset.component = key;

    const img = document.createElement('img');
    img.src = comp.img;
    img.alt = comp.name;
    div.appendChild(img);

    const name = document.createElement('div');
    name.classList.add('component-name');
    name.textContent = comp.name;
    div.appendChild(name);

    container.appendChild(div);
}

// =======================
// Drag handlers
// =======================
function handleDragStart(e) {
    draggedElement = e.target;
    currentKey = e.target.dataset.component;
    originalParent = e.target.parentNode;
    originalNextSibling = e.target.nextSibling;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// =======================
// Setup drop zones
// =======================
function setupDropZones() {
    Object.values(components).forEach(comp => {
        const zone = document.querySelector(`#${comp.dropZoneId} .drop-zone`);
        if (!zone) return;

        // Vérifier si cette zone est déjà remplie
        const isAlreadyFilled = Array.isArray(composantsPlaces) && composantsPlaces.length > 0 && composantsPlaces.includes(comp.key);

        console.log(`Zone ${comp.key}: isAlreadyFilled = ${isAlreadyFilled}`);

        if (isAlreadyFilled) {
            zone.classList.add('filled');
            zone.style.pointerEvents = 'none';
            return;
        }

        zone.addEventListener('dragover', e => e.preventDefault());

        zone.addEventListener('drop', e => {
            e.preventDefault();

            if (!currentKey) return;

            // Vérifier que le composant correspond à la zone
            if (currentKey !== comp.key) {
                resetComponentPosition();
                return;
            }

            // Marquer la zone comme remplie
            zone.style.opacity = '0.8';
            zone.classList.add('filled');
            zone.style.pointerEvents = 'none';

            // Sauvegarder la dernière zone de drop pour la modal
            lastDropZone = zone;

            // Afficher le modal
            showConfirmModal(comp.key);

            // Afficher l'image dans le SVG
            const svgImg = document.getElementById(comp.svgImageId);
            if (svgImg) svgImg.setAttribute('xlink:href', comp.img);

            // Ne pas supprimer le draggable ici, on le fera si l'utilisateur clique sur "En savoir plus"
        });
    });
}

// =======================
// Reset position si mauvais drop ou "Rester ici"
// =======================
function resetComponentPosition() {
    if (!draggedElement) return;
    if (originalNextSibling) originalParent.insertBefore(draggedElement, originalNextSibling);
    else originalParent.appendChild(draggedElement);
}

// =======================
// Modal confirmation
// =======================
function showConfirmModal(key) {
    const comp = components[key];
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalTitle').textContent = comp.name;
    document.getElementById('modalText').textContent = `Vous avez placé correctement le ${comp.name} !`;

    modal.classList.add('active');
}

// =======================
// Actions modal
// =======================
function stayOnPage() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');

    // Remettre le composant draggable à sa position initiale
    if (draggedElement) resetComponentPosition();

    // Réinitialiser le SVG
    if (currentKey) {
        const comp = components[currentKey];
        const svgImg = document.getElementById(comp.svgImageId);
        if (svgImg) svgImg.setAttribute('xlink:href', '');

        // Réinitialiser la zone de drop
        const zone = document.querySelector(`#${comp.dropZoneId} .drop-zone`);
        if (zone) {
            zone.style.opacity = '1';
            zone.classList.remove('filled');
            zone.style.pointerEvents = 'auto';
        }
    }
}

async function goToPage() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');

    // Supprimer le draggable définitivement
    if (draggedElement) draggedElement.remove();
    draggedElement = null;

    // Envoyer le thème au serveur via AJAX avant la redirection
    if (currentKey) {
        const comp = components[currentKey];

        try {
            const formData = new FormData();
            formData.append('setGameName', '1');
            formData.append('gameName', comp.theme);

            const response = await fetch('index.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Vérifier si tous les composants ont été validés
                checkAllComponentsValidated();

                // Redirection vers la page vidéo
                window.location.href = comp.page;
            } else {
                console.error('Erreur lors de la sauvegarde du thème');
                window.location.href = comp.page;
            }
        } catch (error) {
            console.error('Erreur:', error);
            // Redirection même en cas d'erreur
            window.location.href = comp.page;
        }

        currentKey = null;
    }
}

// =======================
// Vérifier si tous les composants sont validés
// =======================
function checkAllComponentsValidated() {
    // Récupérer les composants déjà placés depuis PHP
    if (typeof composantsPlaces !== 'undefined') {
        const allComponents = Object.keys(components);
        const allPlaced = allComponents.every(key => composantsPlaces.includes(key));

        if (allPlaced) {
            // Enregistrer que tous les composants sont validés
            markAllComponentsValidated();
        }
    }
}

// =======================
// Marquer tous les composants comme validés
// =======================
async function markAllComponentsValidated() {
    try {
        const formData = new FormData();
        formData.append('allComponentsValidated', '1');

        await fetch('index.php', {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        console.error('Erreur lors de la validation finale:', error);
    }
}

// =======================
// Redirection vers le jeu final
// =======================
async function goToFinalGame() {
    try {
        const formData = new FormData();
        formData.append('setGameName', '1');
        formData.append('gameName', 'materiel');

        const response = await fetch('index.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = 'video.php';
        }
    } catch (error) {
        console.error('Erreur:', error);
        window.location.href = 'video.php';
    }
}

// =======================
// Restaurer les composants déjà placés
// =======================
function restorePlacedComponents() {
    console.log('restorePlacedComponents appelé, composantsPlaces =', composantsPlaces);

    if (!Array.isArray(composantsPlaces) || composantsPlaces.length === 0) {
        console.log('Aucun composant à restaurer');
        return;
    }

    // Pour chaque composant déjà placé, afficher son image dans le SVG
    composantsPlaces.forEach(key => {
        console.log(`Restauration du composant ${key}`);
        const comp = components[key];
        if (!comp) return;

        // Afficher l'image dans le SVG
        const svgImg = document.getElementById(comp.svgImageId);
        if (svgImg) {
            svgImg.setAttribute('xlink:href', comp.img);
        }

        // Marquer la zone comme remplie
        const zone = document.querySelector(`#${comp.dropZoneId} .drop-zone`);
        if (zone) {
            zone.style.opacity = '0.8';
            zone.classList.add('filled');
            zone.style.pointerEvents = 'none';
        }

        // Supprimer le composant draggable de la liste
        const draggableElement = document.querySelector(`[data-component="${key}"]`);
        if (draggableElement && !draggableElement.classList.contains('component-disabled')) {
            draggableElement.remove();
        }
    });
}