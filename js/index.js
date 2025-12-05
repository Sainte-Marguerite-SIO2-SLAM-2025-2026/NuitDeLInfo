// Données des composants
const components = {
    cpu: {
        name: 'Processeur',
        emoji: '🔲',
        page: 'cpu.php',
        color: '#3498db'
    },
    ram: {
        name: 'Mémoire RAM',
        emoji: '💾',
        page: 'ram.php',
        color: '#9b59b6'
    },
    gpu: {
        name: 'Carte graphique',
        emoji: '🎮',
        page: 'gpu.php',
        color: '#e74c3c'
    },
    ssd: {
        name: 'SSD',
        emoji: '💿',
        page: 'abonnement.php',
        color: '#f39c12'
    },
    psu: {
        name: 'Alimentation',
        emoji: '⚡',
        page: 'psu.php',
        color: '#1abc9c'
    }
};

let currentComponent = null;
let draggedElement = null;
let originalPosition = null;

// Initialisation
function init() {
    const leftContainer = document.getElementById('componentsLeft');
    const rightContainer = document.getElementById('componentsRight');

    const componentKeys = Object.keys(components);
    const leftComponents = componentKeys.slice(0, 3);
    const rightComponents = componentKeys.slice(3);

    leftComponents.forEach(key => createComponentElement(key, leftContainer));
    rightComponents.forEach(key => createComponentElement(key, rightContainer));

    setupDropZones();
    updatePlacedComponents();
}

function createComponentElement(key, container) {
    const comp = components[key];
    const div = document.createElement('div');
    div.className = 'component';
    div.draggable = true;
    div.dataset.component = key;

    const emojiDiv = document.createElement('div');
    emojiDiv.style.fontSize = '50px';
    emojiDiv.textContent = comp.emoji;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'component-name';
    nameDiv.textContent = comp.name;

    div.appendChild(emojiDiv);
    div.appendChild(nameDiv);

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    container.appendChild(div);
}

function handleDragStart(e) {
    draggedElement = e.target;
    currentComponent = e.target.dataset.component;
    e.target.classList.add('dragging');

    // Sauvegarder la position originale
    originalPosition = {
        parent: e.target.parentNode,
        nextSibling: e.target.nextSibling
    };
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function setupDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    const zoneComponent = e.target.dataset.component;

    if (currentComponent === zoneComponent && !e.target.classList.contains('filled')) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');

    const zoneComponent = e.target.dataset.component;

    if (currentComponent === zoneComponent && !e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.opacity = '0.8';

        // Envoyer à PHP pour enregistrer dans la session
        saveComponentToSession(currentComponent);

        showConfirmModal(currentComponent);
    } else {
        // Mauvaise zone, remettre à la position originale
        resetComponentPosition();
    }
}

function saveComponentToSession(component) {
    fetch('index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'selectComponent=1&component=' + component
    })
        .then(response => response.json())
        .then(data => {
            console.log('Composant enregistré:', data);
        })
        .catch(error => console.error('Erreur:', error));
}

function resetComponentPosition() {
    if (originalPosition && draggedElement) {
        if (originalPosition.nextSibling) {
            originalPosition.parent.insertBefore(draggedElement, originalPosition.nextSibling);
        } else {
            originalPosition.parent.appendChild(draggedElement);
        }
    }
}

function showConfirmModal(componentKey) {
    const modal = document.getElementById('confirmModal');
    const comp = components[componentKey];

    document.getElementById('modalTitle').textContent = `${comp.emoji} ${comp.name}`;
    document.getElementById('modalText').textContent = `Excellent ! Vous avez correctement placé le ${comp.name.toLowerCase()} !`;

    modal.classList.add('active');
}

function closeWelcomeModal() {
    document.getElementById('welcomeModal').classList.remove('active');
}

function stayOnPage() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');

    // Remettre le composant à sa place
    resetComponentPosition();

    // Réactiver la zone
    const zone = document.querySelector(`.drop-zone[data-component="${currentComponent}"]`);
    if (zone) {
        zone.classList.remove('filled');
        zone.style.opacity = '0.3';
    }
}

function goToPage() {
    const comp = components[currentComponent];
    // Redirection vers la page PHP
    window.location.href = comp.page;
}

function updatePlacedComponents() {
    // Marquer les zones déjà remplies depuis la session PHP
    if (typeof composantsPlaces !== 'undefined') {
        composantsPlaces.forEach(component => {
            const zone = document.querySelector(`.drop-zone[data-component="${component}"]`);
            if (zone) {
                zone.classList.add('filled');
                zone.style.opacity = '0.8';
            }
        });
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);