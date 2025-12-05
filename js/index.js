// Données des composants
const components = {
    motherboard: {
        name: 'Carte mère',
        emoji: '🔌',
        page: 'video.php',
        gameName: 'SysExploit',
        color: '#1abc9c',
        sessionKey: 'sysExp'
    },
    ram: {
        name: 'Mémoire RAM',
        emoji: '💾',
        page: 'video.php',
        gameName: 'Licences',
        color: '#9b59b6',
        sessionKey: 'licences'
    },
    gpu: {
        name: 'Carte graphique',
        emoji: '🎮',
        page: 'video.php',
        gameName: 'Abonnement',
        color: '#e74c3c',
        sessionKey: 'abonnement'
    },
    cooling: {
        name: 'Refroidissement',
        emoji: '❄️',
        page: 'video.php',
        gameName: 'StockDataEU',
        color: '#3498db',
        sessionKey: 'stockage'
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
    const leftComponents = componentKeys.slice(0, 2);
    const rightComponents = componentKeys.slice(2);

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

    // Afficher les validations visuelles pour les jeux complétés
    if (typeof jeuxValides !== 'undefined') {
        Object.keys(components).forEach(componentKey => {
            const comp = components[componentKey];
            const sessionKey = comp.sessionKey;

            if (jeuxValides[sessionKey] === true) {
                const zone = document.querySelector(`.drop-zone[data-component="${componentKey}"]`);
                if (zone) {
                    // Ajouter une coche de validation
                    addValidationCheckmark(zone, componentKey);
                }
            }
        });
    }
}

function addValidationCheckmark(zone, componentKey) {
    // Vérifier si la coche n'existe pas déjà
    const existingCheck = document.getElementById(`check-${componentKey}`);
    if (existingCheck) return;

    // Créer un élément SVG pour la coche
    const svgNS = "http://www.w3.org/2000/svg";
    const checkGroup = document.createElementNS(svgNS, "g");
    checkGroup.setAttribute("id", `check-${componentKey}`);
    checkGroup.classList.add("validation-check");

    // Cercle de fond
    const circle = document.createElementNS(svgNS, "circle");
    const bbox = zone.getBBox();
    circle.setAttribute("cx", bbox.x + bbox.width - 15);
    circle.setAttribute("cy", bbox.y + 15);
    circle.setAttribute("r", "12");
    circle.setAttribute("fill", "#27ae60");
    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", "2");

    // Icône de coche
    const checkPath = document.createElementNS(svgNS, "path");
    checkPath.setAttribute("d", `M ${bbox.x + bbox.width - 19} ${bbox.y + 15} l 3 3 l 6 -6`);
    checkPath.setAttribute("stroke", "white");
    checkPath.setAttribute("stroke-width", "2");
    checkPath.setAttribute("fill", "none");
    checkPath.setAttribute("stroke-linecap", "round");

    checkGroup.appendChild(circle);
    checkGroup.appendChild(checkPath);

    // Ajouter au SVG parent
    zone.parentNode.appendChild(checkGroup);

    // Animation d'apparition
    checkGroup.style.opacity = "0";
    checkGroup.style.transform = "scale(0)";
    checkGroup.style.transformOrigin = `${bbox.x + bbox.width - 15}px ${bbox.y + 15}px`;

    setTimeout(() => {
        checkGroup.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        checkGroup.style.opacity = "1";
        checkGroup.style.transform = "scale(1)";
    }, 100);
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);