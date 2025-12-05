<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimisation du Matériel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .game-container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 20px;
            font-size: 1.1em;
        }

        .info-bar {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        #info {
            font-size: 1.1em;
            font-weight: 500;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 25px;
        }

        .btn {
            padding: 12px 30px;
            font-size: 1.1em;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .btn-primary {
            background: linear-gradient(135deg, #27ae60, #229954);
            color: white;
        }

        .btn-primary:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            transform: none;
        }

        .btn-secondary {
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
        }

        .game-area {
            position: relative;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 30px;
            border: 3px solid #3498db;
        }

        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .row-label {
            font-size: 1.3em;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 10px;
            text-align: center;
        }

        .row-label.problems {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }

        .row-label.solutions {
            background: linear-gradient(135deg, #27ae60, #229954);
            color: white;
        }

        .cards-row {
            display: flex;
            gap: 15px;
            margin-bottom: 40px;
            flex-wrap: wrap;
            justify-content: center;
            position: relative;
        }

        .carte {
            width: 160px;
            padding: 15px;
            background: white;
            border: 3px solid #3498db;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            text-align: center;
            position: relative;
        }

        .carte:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 25px rgba(52, 152, 219, 0.4);
        }

        .carte-icon {
            font-size: 2.5em;
            margin-bottom: 8px;
        }

        .carte-title {
            font-size: 0.9em;
            font-weight: 600;
            color: #2c3e50;
            line-height: 1.3;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .carte.selected {
            border-color: #f39c12;
            border-width: 4px;
            background: linear-gradient(135deg, #fff9e6, #ffffff);
            box-shadow: 0 0 30px rgba(243, 156, 18, 0.6);
        }

        .carte.locked {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .carte.correct {
            border-color: #27ae60;
            border-width: 4px;
            background: linear-gradient(135deg, #d5f4e6, #ffffff);
        }

        .carte.incorrect {
            border-color: #e74c3c;
            border-width: 4px;
            background: linear-gradient(135deg, #fadbd8, #ffffff);
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            background: white;
            margin: 3% auto;
            padding: 30px;
            border-radius: 20px;
            width: 90%;
            max-width: 800px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
            max-height: 85vh;
            overflow-y: auto;
        }

        .modal-content h2 {
            font-size: 2.2em;
            margin-bottom: 20px;
            color: #2c3e50;
            text-align: center;
        }

        .result-section {
            margin: 20px 0;
            padding: 20px;
            border-radius: 15px;
            background: #f8f9fa;
        }

        .result-section h3 {
            margin-bottom: 15px;
            font-size: 1.4em;
        }

        .result-section.correct h3 {
            color: #27ae60;
        }

        .result-section.incorrect h3 {
            color: #e74c3c;
        }

        .match-item {
            padding: 12px;
            margin: 10px 0;
            border-radius: 10px;
            background: white;
            border-left: 4px solid #3498db;
        }

        .match-item.correct {
            border-left-color: #27ae60;
        }

        .match-item.incorrect {
            border-left-color: #e74c3c;
        }

        .match-item strong {
            display: block;
            margin-bottom: 5px;
            color: #2c3e50;
        }

        .match-item .explanation {
            color: #7f8c8d;
            font-size: 0.95em;
            line-height: 1.5;
        }
    </style>
</head>
<body>
<div class="game-container">
    <h1>🔧 Optimisation du Matériel Informatique</h1>
    <p class="subtitle">Reliez chaque problème à sa solution d'optimisation</p>

    <div class="info-bar">
        <div id="info">Cliquez sur un problème, puis sur sa solution pour créer une connexion</div>
    </div>

    <div class="controls">
        <button id="undoBtn" class="btn btn-secondary">↶ Annuler</button>
        <button id="resetBtn" class="btn btn-secondary">🔄 Recommencer</button>
        <button id="validateBtn" class="btn btn-primary" disabled>✓ Valider</button>
    </div>

    <div class="game-area">
        <canvas id="canvas"></canvas>

        <div class="row-label problems">❌ PROBLÈMES</div>
        <div class="cards-row" id="problems-row"></div>

        <div class="row-label solutions">✅ SOLUTIONS D'OPTIMISATION</div>
        <div class="cards-row" id="solutions-row"></div>
    </div>
</div>

<!-- Modal de résultat -->
<div id="resultModal" class="modal">
    <div class="modal-content">
        <h2 id="resultTitle"></h2>
        <div id="resultContent"></div>
        <div style="text-align: center; margin-top: 30px;">
            <button id="closeModalBtn" class="btn btn-primary">Continuer</button>
        </div>
    </div>
</div>

<script>
    const gameData = {
        problems: [
            { id: 'p1', icon: '🐌', title: 'PC très lent au démarrage', solution: 's1' },
            { id: 'p2', icon: '💾', title: 'Disque dur plein', solution: 's2' },
            { id: 'p3', icon: '🔥', title: 'Surchauffe du processeur', solution: 's3' },
            { id: 'p4', icon: '⚠️', title: 'Windows XP non supporté', solution: 's4' },
            { id: 'p5', icon: '🖥️', title: 'Applications qui plantent souvent', solution: 's5' },
            { id: 'p6', icon: '📊', title: 'Manque de RAM (4 Go)', solution: 's6' },
            { id: 'p7', icon: '🔌', title: 'Ports USB 2.0 trop lents', solution: 's7' },
            { id: 'p8', icon: '📹', title: 'Carte graphique faible', solution: 's8' },
            { id: 'p9', icon: '🌐', title: 'Windows 7 fin de support', solution: 's9' },
            { id: 'p10', icon: '🔊', title: 'Bruit excessif du ventilateur', solution: 's10' }
        ],
        solutions: [
            { id: 's1', icon: '💿', title: 'Installer un SSD', explanation: 'Un SSD améliore drastiquement les temps de démarrage et la réactivité globale du système.' },
            { id: 's2', icon: '☁️', title: 'Utiliser le cloud storage', explanation: 'Le stockage cloud libère l\'espace disque local tout en gardant les fichiers accessibles.' },
            { id: 's3', icon: '🧹', title: 'Nettoyer et changer la pâte thermique', explanation: 'Un nettoyage et l\'application de pâte thermique neuve améliorent le refroidissement.' },
            { id: 's4', icon: '🐧', title: 'Migrer vers Linux', explanation: 'Linux est une alternative moderne et gratuite pour les anciens systèmes Windows non supportés.' },
            { id: 's5', icon: '🔄', title: 'Réinstaller le système', explanation: 'Une réinstallation propre résout souvent les problèmes de stabilité logicielle.' },
            { id: 's6', icon: '🧠', title: 'Ajouter de la RAM', explanation: 'Passer de 4 à 8 ou 16 Go de RAM améliore considérablement les performances multitâches.' },
            { id: 's7', icon: '🔌', title: 'Ajouter une carte PCI USB 3.0', explanation: 'Une carte d\'extension USB 3.0 offre des vitesses de transfert 10x supérieures.' },
            { id: 's8', icon: '🎮', title: 'Remplacer la carte graphique', explanation: 'Une carte graphique dédiée améliore les performances graphiques sans changer le PC.' },
            { id: 's9', icon: '🪟', title: 'Passer à Windows 10/11', explanation: 'Une mise à niveau vers Windows 10 ou 11 assure les mises à jour de sécurité.' },
            { id: 's10', icon: '🌀', title: 'Remplacer le ventilateur', explanation: 'Un ventilateur neuf ou de meilleure qualité réduit le bruit tout en refroidissant efficacement.' }
        ]
    };

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const problemsRow = document.getElementById('problems-row');
    const solutionsRow = document.getElementById('solutions-row');
    const info = document.getElementById('info');
    const undoBtn = document.getElementById('undoBtn');
    const resetBtn = document.getElementById('resetBtn');
    const validateBtn = document.getElementById('validateBtn');
    const resultModal = document.getElementById('resultModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let selectedCard = null;
    let connections = [];

    function initCanvas() {
        const gameArea = document.querySelector('.game-area');
        canvas.width = gameArea.offsetWidth;
        canvas.height = gameArea.offsetHeight;
    }

    function createCard(data, type) {
        const card = document.createElement('div');
        card.className = 'carte';
        card.dataset.id = data.id;
        card.dataset.type = type;
        if (type === 'problem') {
            card.dataset.solution = data.solution;
        }

        card.innerHTML = `
        <div class="carte-icon">${data.icon}</div>
        <div class="carte-title">${data.title}</div>
    `;

        return card;
    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function initGame() {
        problemsRow.innerHTML = '';
        solutionsRow.innerHTML = '';

        const shuffledProblems = shuffleArray(gameData.problems);
        const shuffledSolutions = shuffleArray(gameData.solutions);

        shuffledProblems.forEach(problem => {
            problemsRow.appendChild(createCard(problem, 'problem'));
        });

        shuffledSolutions.forEach(solution => {
            solutionsRow.appendChild(createCard(solution, 'solution'));
        });
    }

    function getCardCenter(card) {
        const rect = card.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        return {
            x: rect.left - canvasRect.left + rect.width / 2,
            y: rect.top - canvasRect.top + rect.height / 2
        };
    }

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

        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    function redrawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        connections.forEach(conn => {
            const problem = document.querySelector(`[data-id="${conn.problemId}"]`);
            const solution = document.querySelector(`[data-id="${conn.solutionId}"]`);
            if (problem && solution) {
                const p1 = getCardCenter(problem);
                const p2 = getCardCenter(solution);
                drawLine(p1.x, p1.y, p2.x, p2.y);
            }
        });
    }

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.carte');
        if (!card) return;

        if (card.classList.contains('locked')) {
            info.textContent = '⛔ Cette carte est déjà reliée !';
            return;
        }

        if (!selectedCard) {
            selectedCard = card;
            card.classList.add('selected');
            const type = card.dataset.type === 'problem' ? 'un problème' : 'une solution';
            info.textContent = `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} sélectionné - Cliquez sur ${card.dataset.type === 'problem' ? 'une solution' : 'un problème'}`;
        } else {
            if (card === selectedCard) {
                card.classList.remove('selected');
                selectedCard = null;
                info.textContent = 'Sélection annulée';
                return;
            }

            if (card.dataset.type === selectedCard.dataset.type) {
                info.textContent = '⚠️ Vous devez relier un problème à une solution !';
                return;
            }

            const problem = selectedCard.dataset.type === 'problem' ? selectedCard : card;
            const solution = selectedCard.dataset.type === 'solution' ? selectedCard : card;

            const p1 = getCardCenter(problem);
            const p2 = getCardCenter(solution);
            drawLine(p1.x, p1.y, p2.x, p2.y);

            connections.push({
                problemId: problem.dataset.id,
                solutionId: solution.dataset.id,
                correctSolution: problem.dataset.solution
            });

            problem.classList.add('locked');
            solution.classList.add('locked');
            selectedCard.classList.remove('selected');
            selectedCard = null;

            info.textContent = `✅ Connexion créée ! (${connections.length}/10)`;

            if (connections.length === 10) {
                validateBtn.disabled = false;
                info.textContent = '🎯 Toutes les connexions sont créées ! Vous pouvez valider.';
            }
        }
    });

    undoBtn.addEventListener('click', () => {
        if (selectedCard) {
            selectedCard.classList.remove('selected');
            selectedCard = null;
            info.textContent = '↶ Sélection annulée';
        } else if (connections.length > 0) {
            const lastConn = connections.pop();
            const problem = document.querySelector(`[data-id="${lastConn.problemId}"]`);
            const solution = document.querySelector(`[data-id="${lastConn.solutionId}"]`);

            problem.classList.remove('locked');
            solution.classList.remove('locked');

            validateBtn.disabled = true;
            redrawAll();
            info.textContent = `↶ Dernière connexion annulée (${connections.length}/10)`;
        } else {
            info.textContent = '⚠️ Rien à annuler';
        }
    });

    function resetGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        connections = [];
        selectedCard = null;

        document.querySelectorAll('.carte').forEach(carte => {
            carte.classList.remove('locked', 'selected', 'correct', 'incorrect');
        });

        validateBtn.disabled = true;
        info.textContent = 'Cliquez sur un problème, puis sur sa solution pour créer une connexion';
    }

    resetBtn.addEventListener('click', resetGame);

    validateBtn.addEventListener('click', () => {
        validateBtn.disabled = true;

        let correctCount = 0;
        let incorrectMatches = [];

        connections.forEach(conn => {
            const problem = document.querySelector(`[data-id="${conn.problemId}"]`);
            const solution = document.querySelector(`[data-id="${conn.solutionId}"]`);

            if (conn.solutionId === conn.correctSolution) {
                correctCount++;
                problem.classList.add('correct');
                solution.classList.add('correct');
            } else {
                problem.classList.add('incorrect');
                solution.classList.add('incorrect');

                const problemData = gameData.problems.find(p => p.id === conn.problemId);
                const wrongSolution = gameData.solutions.find(s => s.id === conn.solutionId);
                const correctSolution = gameData.solutions.find(s => s.id === conn.correctSolution);

                incorrectMatches.push({
                    problem: problemData.title,
                    wrongSolution: wrongSolution.title,
                    correctSolution: correctSolution.title,
                    explanation: correctSolution.explanation
                });
            }
        });

        const resultTitle = document.getElementById('resultTitle');
        const resultContent = document.getElementById('resultContent');

        if (correctCount === 10) {
            resultTitle.innerHTML = '🎉 Parfait !';
            resultContent.innerHTML = `
            <p style="text-align: center; font-size: 1.2em; color: #27ae60; margin: 20px 0;">
                Vous avez correctement identifié toutes les solutions d'optimisation !<br>
                Excellent travail ! 👏
            </p>
            <div class="result-section correct">
                <h3>✓ Toutes vos réponses sont correctes</h3>
                <p style="color: #7f8c8d; margin-top: 10px;">
                    Vous maîtrisez parfaitement les alternatives à l'achat de nouveau matériel !
                </p>
            </div>
        `;
        } else {
            resultTitle.innerHTML = `⚠️ ${correctCount}/10 correctes`;

            let html = `
            <p style="text-align: center; font-size: 1.1em; color: #7f8c8d; margin: 15px 0;">
                Vous avez ${correctCount} bonne(s) réponse(s) sur 10.
            </p>
        `;

            if (incorrectMatches.length > 0) {
                html += `<div class="result-section incorrect">
                <h3>✗ Erreurs à corriger</h3>`;

                incorrectMatches.forEach(match => {
                    html += `
                    <div class="match-item incorrect">
                        <strong>❌ ${match.problem}</strong>
                        <div class="explanation">
                            <span style="color: #e74c3c;">Votre réponse : ${match.wrongSolution}</span><br>
                            <span style="color: #27ae60;">✓ Bonne réponse : ${match.correctSolution}</span><br>
                            <em>${match.explanation}</em>
                        </div>
                    </div>
                `;
                });

                html += `</div>`;
            }

            resultContent.innerHTML = html;
        }

        resultModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        resultModal.style.display = 'none';
        resetGame();
    });

    window.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            resultModal.style.display = 'none';
            resetGame();
        }
    });

    window.addEventListener('resize', () => {
        initCanvas();
        redrawAll();
    });

    initCanvas();
    initGame();
</script>
</body>
</html>