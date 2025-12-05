const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const startBtn = document.getElementById('startBtn');
const rulesPanel = document.getElementById('rulesPanel');

// Initialiser les dimensions du canvas
function initCanvas() {
    const container = document.querySelector('.game-container');
    const containerSize = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = containerSize - 4; // -4 pour la bordure
    canvas.height = containerSize - 4 - document.querySelector('.scoreboard').clientHeight;

    // Ajuster si les contrôles tactiles sont visibles
    const touchControls = document.querySelector('.touch-controls');
    if (window.getComputedStyle(touchControls).display !== 'none') {
        canvas.height -= touchControls.clientHeight;
    }
}

// Variables du jeu
const gridSize = 20;
let tileCount;
let snake = [];
let foods = []; // Tableau pour plusieurs fruits
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isRunning = false;
let gameSpeed = 120;

highScoreElement.textContent = highScore;

// Initialiser au chargement
window.addEventListener('load', () => {
    initCanvas();
    tileCount = Math.floor(canvas.width / gridSize);
    drawInitialScreen();
});

// Redimensionner le canvas si la fenêtre change
window.addEventListener('resize', () => {
    if (!isRunning) {
        initCanvas();
        tileCount = Math.floor(canvas.width / gridSize);
        drawInitialScreen();
    }
});

function drawInitialScreen() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = 'bold ' + Math.floor(canvas.width / 20) + 'px Courier New';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#0f0';
    ctx.shadowBlur = 10;
    ctx.fillText('PRESS START', canvas.width/2, canvas.height/2);
    ctx.shadowBlur = 0;
}

function drawGame() {
    if (!isRunning) return;

    // Effacer le canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grille rétro
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Déplacer le serpent
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Vérifier les collisions avec les murs
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Vérifier les collisions avec le corps
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Vérifier si le serpent mange la nourriture
    let foodEaten = false;
    for (let i = foods.length - 1; i >= 0; i--) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            score += 10;
            scoreElement.textContent = score;
            foods.splice(i, 1); // Retirer le fruit mangé
            foodEaten = true;

            // Augmenter la vitesse progressivement
            if (score % 50 === 0 && gameSpeed > 60) {
                gameSpeed -= 10;
                clearInterval(gameLoop);
                gameLoop = setInterval(drawGame, gameSpeed);
            }
        }
    }

    if (foodEaten) {
        generateFood(); // Générer un nouveau fruit
    } else {
        snake.pop();
    }

    // Dessiner le serpent avec effet rétro
    snake.forEach((segment, index) => {
        const brightness = index === 0 ? 1 : 0.7;
        ctx.fillStyle = `rgba(0, 255, 0, ${brightness})`;
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 5;
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        ctx.shadowBlur = 0;
    });

    // Dessiner tous les fruits avec effet clignotant
    const pulseSpeed = Math.sin(Date.now() / 200) * 0.3 + 0.7;
    foods.forEach(food => {
        ctx.fillStyle = `rgba(255, 0, 0, ${pulseSpeed})`;
        ctx.shadowColor = '#f00';
        ctx.shadowBlur = 10;
        ctx.fillRect(
            food.x * gridSize + 1,
            food.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        ctx.shadowBlur = 0;
    });
}

function generateFood() {
    const newFood = {
        x: Math.floor(Math.random() * (tileCount - 1)), // -1 pour éviter les bords
        y: Math.floor(Math.random() * (tileCount - 1))
    };

    // Vérifier que la nourriture n'apparaît pas sur le serpent
    let onSnake = false;
    for (let segment of snake) {
        if (newFood.x === segment.x && newFood.y === segment.y) {
            onSnake = true;
            break;
        }
    }

    // Vérifier que la nourriture n'apparaît pas sur un autre fruit
    let onOtherFood = false;
    for (let food of foods) {
        if (newFood.x === food.x && newFood.y === food.y) {
            onOtherFood = true;
            break;
        }
    }

    if (onSnake || onOtherFood) {
        generateFood();
        return;
    }

    foods.push(newFood);
}

function startGame() {
    if (isRunning) return;

    initCanvas();
    tileCount = Math.floor(canvas.width / gridSize);

    snake = [{x: Math.floor(tileCount/2), y: Math.floor(tileCount/2)}];
    foods = []; // Réinitialiser les fruits
    dx = 1;
    dy = 0;
    score = 0;
    gameSpeed = 120;
    scoreElement.textContent = score;
    isRunning = true;
    gameOverElement.style.display = 'none';
    rulesPanel.style.display = 'none';
    startBtn.textContent = 'PLAYING...';
    startBtn.disabled = true;

    // Générer 2 fruits au démarrage
    generateFood();
    generateFood();

    gameLoop = setInterval(drawGame, gameSpeed);
}

function changeDirection(newDx, newDy) {
    if (!isRunning) return;
    if (newDx !== 0 && dx === 0) {
        dx = newDx;
        dy = 0;
    } else if (newDy !== 0 && dy === 0) {
        dx = 0;
        dy = newDy;
    }
}

function endGame() {
    isRunning = false;
    clearInterval(gameLoop);
    startBtn.textContent = 'START';
    startBtn.disabled = false;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
    }

    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'flex';
}

function restartGame() {
    startGame();
}

function goHome() {
    // Arrêter le jeu en cours si nécessaire
    if (isRunning) {
        isRunning = false;
        clearInterval(gameLoop);
        startBtn.textContent = 'START';
        startBtn.disabled = false;
    }

    // Fermer l'écran Game Over si ouvert
    gameOverElement.style.display = 'none';

    // Rediriger vers la page d'accueil
    window.location.href = '../index.php'; // Modifiez ce chemin selon votre structure
}

function toggleRules() {
    if (rulesPanel.style.display === 'flex') {
        rulesPanel.style.display = 'none';
    } else {
        rulesPanel.style.display = 'flex';
    }
}

// Contrôles au clavier
document.addEventListener('keydown', (e) => {
    if (!isRunning && e.key.startsWith('Arrow')) {
        startGame();
    }

    switch(e.key) {
        case 'ArrowUp':
            changeDirection(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            changeDirection(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            changeDirection(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
            changeDirection(1, 0);
            e.preventDefault();
            break;
        case ' ':
            if (!isRunning) startGame();
            e.preventDefault();
            break;
    }
});