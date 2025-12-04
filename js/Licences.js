let gameData = {
    budget: 0,
    allRequirements: [],
    selectedRequirements: [],
    licenses: [],
    selectedLicenses: []
};

// Sélectionner 5 besoins aléatoires
function selectRandomRequirements() {
    const shuffled = [...gameData.allRequirements].sort(() => Math.random() - 0.5);
    gameData.selectedRequirements = shuffled.slice(0, 5);
}

// Calculer un budget adapté pour que le jeu soit toujours jouable
function calculateAdaptedBudget() {
    const requiredFeatures = new Set(gameData.selectedRequirements.map(req => req.id));

    // Trouver la solution optimale (toutes les licences gratuites qui couvrent les besoins)
    const freeLicenses = gameData.licenses.filter(l => l.price === 0);
    const coveredByFree = new Set();
    freeLicenses.forEach(license => {
        license.features.forEach(feature => coveredByFree.add(feature));
    });

    // Vérifier si les licences gratuites couvrent tous les besoins
    const allCoveredByFree = [...requiredFeatures].every(req => coveredByFree.has(req));

    if (allCoveredByFree) {
        // Si tout peut être fait gratuitement, on met un budget serré
        const paidLicenses = gameData.licenses.filter(l => l.price > 0);
        const minPaidPrice = Math.min(...paidLicenses.map(l => l.price));
        gameData.budget = Math.floor(minPaidPrice * 0.8);
    } else {
        // Trouver la solution payante la moins chère qui couvre tous les besoins
        let minCost = Infinity;

        // Essayer toutes les combinaisons possibles (force brute simplifiée)
        const licensesWithRequiredFeatures = gameData.licenses.filter(license =>
            license.features.some(feature => requiredFeatures.has(feature))
        );

        // Trier par rapport qualité/prix
        licensesWithRequiredFeatures.sort((a, b) => {
            const aScore = a.features.filter(f => requiredFeatures.has(f)).length / (a.price + 1);
            const bScore = b.features.filter(f => requiredFeatures.has(f)).length / (b.price + 1);
            return bScore - aScore;
        });

        // Algorithme glouton pour trouver une solution
        let covered = new Set();
        let cost = 0;

        for (const license of licensesWithRequiredFeatures) {
            const newFeatures = license.features.filter(f =>
                requiredFeatures.has(f) && !covered.has(f)
            );

            if (newFeatures.length > 0) {
                license.features.forEach(f => covered.add(f));
                cost += license.price;

                if ([...requiredFeatures].every(req => covered.has(req))) {
                    minCost = cost;
                    break;
                }
            }
        }

        // Ajouter une marge de 20% au budget minimum
        gameData.budget = Math.ceil(minCost * 1.2);
    }

    // S'assurer que le budget est raisonnable (minimum 1000€)
    gameData.budget = Math.max(1000, gameData.budget);
}

function initializeGameData(data) {
    gameData.allRequirements = data.requirements;
    gameData.licenses = data.licenses;

    // Sélectionner 5 besoins aléatoires
    selectRandomRequirements();

    // Calculer le budget adapté
    calculateAdaptedBudget();

    init();
}

// Charger les données depuis le fichier JSON ou utiliser les données inline
async function loadGameData() {
    try {
        // Tenter de charger depuis le JSON
        const response = await fetch('../data/licences.json');

        if (!response.ok) {
            throw new Error('Fichier non trouvé');
        }

        const data = await response.json();
        initializeGameData(data);
        console.log('✅ Données chargées depuis licences.json');
    } catch (error) {
        console.warn('⚠️ Impossible de charger licences.json, utilisation des données intégrées');
        console.error('❌ Erreur détaillée:', error);

        // Utiliser les données inline
        initializeGameData(INLINE_DATA);
    }
}

function init() {
    renderRequirements();
    renderLicenses();
    updateBudget();
    document.getElementById('total-budget').textContent = gameData.budget + ' €';
}

function renderRequirements() {
    const container = document.getElementById('requirements-list');
    container.innerHTML = '';

    gameData.selectedRequirements.forEach(req => {
        const div = document.createElement('div');
        div.className = 'requirement-item';
        div.id = `req-${req.id}`;

        const icon = document.createElement('span');
        icon.className = 'requirement-icon';
        icon.textContent = req.icon;

        const name = document.createElement('span');
        name.textContent = req.name;

        div.appendChild(icon);
        div.appendChild(name);
        container.appendChild(div);
    });
}

function renderLicenses() {
    const container = document.getElementById('licenses-grid');
    container.innerHTML = '';

    gameData.licenses.forEach(license => {
        const card = document.createElement('div');
        card.className = 'license-card';
        card.id = `license-${license.id}`;
        card.onclick = () => toggleLicense(license.id);

        // Header
        const header = document.createElement('div');
        header.className = 'license-header';

        const name = document.createElement('div');
        name.className = 'license-name';
        name.textContent = license.name;

        const type = document.createElement('div');
        type.className = `license-type ${license.type}`;
        type.textContent = license.type === 'opensource' ? 'Open Source' : 'Payante';

        header.appendChild(name);
        header.appendChild(type);

        // Price
        const price = document.createElement('div');
        price.className = 'license-price';
        price.textContent = license.price === 0 ? 'Gratuit' : license.price + ' €';

        // Features
        const featuresList = document.createElement('ul');
        featuresList.className = 'license-features';

        license.description.forEach(desc => {
            const li = document.createElement('li');
            li.textContent = desc;
            featuresList.appendChild(li);
        });

        card.appendChild(header);
        card.appendChild(price);
        card.appendChild(featuresList);
        container.appendChild(card);
    });
}

function toggleLicense(licenseId) {
    const license = gameData.licenses.find(l => l.id === licenseId);
    const card = document.getElementById(`license-${licenseId}`);

    if (gameData.selectedLicenses.includes(licenseId)) {
        gameData.selectedLicenses = gameData.selectedLicenses.filter(id => id !== licenseId);
        card.classList.remove('selected');
    } else {
        gameData.selectedLicenses.push(licenseId);
        card.classList.add('selected');
    }

    updateBudget();
    updateRequirements();
}

function updateBudget() {
    const spent = gameData.selectedLicenses.reduce((total, id) => {
        const license = gameData.licenses.find(l => l.id === id);
        return total + license.price;
    }, 0);

    const remaining = gameData.budget - spent;

    document.getElementById('spent-budget').textContent = spent + ' €';
    document.getElementById('remaining-budget').textContent = remaining + ' €';

    const remainingCard = document.getElementById('remaining-budget-card');
    if (remaining < 0) {
        remainingCard.classList.add('budget-warning');
    } else {
        remainingCard.classList.remove('budget-warning');
    }
}

function updateRequirements() {
    const coveredFeatures = new Set();

    gameData.selectedLicenses.forEach(id => {
        const license = gameData.licenses.find(l => l.id === id);
        license.features.forEach(feature => coveredFeatures.add(feature));
    });
}

function validateSelection() {
    const spent = gameData.selectedLicenses.reduce((total, id) => {
        const license = gameData.licenses.find(l => l.id === id);
        return total + license.price;
    }, 0);

    const coveredFeatures = new Set();
    gameData.selectedLicenses.forEach(id => {
        const license = gameData.licenses.find(l => l.id === id);
        license.features.forEach(feature => coveredFeatures.add(feature));
    });

    const allRequirementsMet = gameData.selectedRequirements.every(req =>
        coveredFeatures.has(req.id)
    );

    const modal = document.getElementById('result-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    modalContent.innerHTML = '';

    const title = document.createElement('h2');
    title.id = 'modal-title';

    const message = document.createElement('p');
    message.id = 'modal-message';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-validate close-modal';
    closeBtn.textContent = 'Fermer';
    closeBtn.onclick = closeModal;

    if (spent > gameData.budget) {
        modalContent.className = 'modal-content error';
        title.textContent = '❌ Budget Dépassé !';

        const overbudget = document.createElement('strong');
        overbudget.textContent = `${spent - gameData.budget} €`;

        message.textContent = 'Vous avez dépassé le budget de ';
        message.appendChild(overbudget);
        message.appendChild(document.createTextNode('.'));
        message.appendChild(document.createElement('br'));
        message.appendChild(document.createTextNode('Essayez de réduire vos dépenses.'));
    } else if (!allRequirementsMet) {
        modalContent.className = 'modal-content error';
        title.textContent = '⚠️ Exigences Non Satisfaites !';

        const missingReqs = gameData.selectedRequirements
            .filter(req => !coveredFeatures.has(req.id))
            .map(req => req.name)
            .join(', ');

        const missing = document.createElement('strong');
        missing.textContent = missingReqs;

        message.textContent = 'Il manque les exigences suivantes :';
        message.appendChild(document.createElement('br'));
        message.appendChild(missing);
    } else {
        modalContent.className = 'modal-content success';
        title.textContent = '🎉 Félicitations !';

        const saved = gameData.budget - spent;

        const spentStrong = document.createElement('strong');
        spentStrong.textContent = `${spent} €`;

        const savedStrong = document.createElement('strong');
        savedStrong.textContent = `${saved} €`;

        message.textContent = 'Vous avez respecté toutes les exigences !';
        message.appendChild(document.createElement('br'));
        message.appendChild(document.createTextNode('Budget utilisé : '));
        message.appendChild(spentStrong);
        message.appendChild(document.createElement('br'));
        message.appendChild(document.createTextNode('Économie réalisée : '));
        message.appendChild(savedStrong);
    }

    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(closeBtn);

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('result-modal').classList.remove('active');
}

function resetGame() {
    gameData.selectedLicenses = [];
    document.querySelectorAll('.license-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateBudget();
    updateRequirements();
}

function newGame() {
    gameData.selectedLicenses = [];
    selectRandomRequirements();
    calculateAdaptedBudget();
    document.getElementById('total-budget').textContent = gameData.budget + ' €';
    document.querySelectorAll('.license-card').forEach(card => {
        card.classList.remove('selected');
    });
    renderRequirements();
    updateBudget();
    updateRequirements();
}

// Charger les données au démarrage
loadGameData();