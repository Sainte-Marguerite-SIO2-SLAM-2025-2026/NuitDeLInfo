// =======================
// Données des composants
// =======================
const components = {
    motherboard: {
        key: 'motherboard',
        name: 'Carte mère',
        img: 'images/carte_m.svg',
        page: 'video.php',
        dropZoneId: 'carte_mere',
        svgImageId: 'carte_mere_image'
    },
    ram: {
        key: 'ram',
        name: 'Mémoire RAM',
        img: 'images/ram.svg',
        page: 'video.php',
        dropZoneId: 'ram',
        svgImageId: 'ram_image'
    },
    gpu: {
        key: 'gpu',
        name: 'Carte graphique',
        img: 'images/carte_grap.svg',
        page: 'video.php',
        dropZoneId: 'gpu',
        svgImageId: 'gpu_image'
    },
    cooling: {
        key: 'cooling',
        name: 'Refroidissement',
        img: 'images/ventilateur.svg',
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
});

// =======================
// Création des div composants
// =======================
function createComponentDiv(key, container) {
    const comp = components[key];

    const div = document.createElement('div');
    div.classList.add('component');
    div.setAttribute('draggable', 'true');
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

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
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

        zone.addEventListener('dragover', e => e.preventDefault());

        zone.addEventListener('drop', e => {
            e.preventDefault();

            if (!currentKey) return;

            // Vérifier que le composant correspond à la zone
            if (currentKey !== comp.key) {
                resetComponentPosition();
                return;
            }

            // Marquer la zone comme remplie (pointillé légèrement plus foncé)
            zone.style.opacity = '0.8';

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

    // Réinitialiser le SVG si nécessaire
    if (currentKey) {
        const comp = components[currentKey];
        const svgImg = document.getElementById(comp.svgImageId);
        if (svgImg) svgImg.setAttribute('xlink:href', '');
    }
}

function goToPage() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');

    // Supprimer le draggable définitivement
    if (draggedElement) draggedElement.remove();
    draggedElement = null;

    // Redirection vers la page du composant
    if (currentKey) {
        const comp = components[currentKey];
        window.location.href = comp.page;
        currentKey = null;
    }
}
