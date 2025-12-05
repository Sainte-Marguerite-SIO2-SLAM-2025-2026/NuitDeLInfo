const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const startBtn = document.getElementById('startBtn');

// Charger les images des fruits personnalisés
const fruitImages = [];
const imagePaths = [
    "../images/pixil-frame-0(2).png",
    "../images/pixil-frame-0(3).png"
];

console.log('🔍 Tentative de chargement des images depuis:', imagePaths);
console.log('📁 Emplacement du script:', window.location.href);

imagePaths.forEach((path, index) => {
    const img = new Image();
    img.src = path;
    fruitImages.push(img);
    console.log(`Tentative ${index + 1}: ${img.src}`);
});

let imagesLoaded = 0;
let allImagesReady = false;
const totalImages = fruitImages.length;

fruitImages.forEach((img, index) => {
    img.onload = () => {
        imagesLoaded++;
        console.log(`✅ Image ${index + 1}/${totalImages} chargée avec succès!`);
        console.log(`   Dimensions: ${img.width}x${img.height}`);
        if (imagesLoaded === totalImages) {
            allImagesReady = true;
            console.log('🎉 TOUTES LES IMAGES SONT CHARGÉES !');
        }
    };
    img.onerror = (e) => {
        console.error(`❌ ERREUR Image ${index + 1}: ${img.src}`);
        console.error('Vérifiez que le fichier existe et que le nom est exact');
    };
});

// Initialiser les dimensions du canvas
function initCanvas() {
    const container = document.querySelector('.game-container');
    const containerSize = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = containerSize - 4;
    canvas.height = containerSize - 4 - document.querySelector('.scoreboard').clientHeight;

    const touchControls = document.querySelector('.touch-controls');
    if (window.getComputedStyle(touchControls).display !== 'none') {
        canvas.height -= touchControls.clientHeight;
    }
}

// Variables du jeu
const gridSize = 20;
let tileCount;
let gridCount;
let snake = [];
let foods = [];
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
    gridCount = tileCount;
    drawInitialScreen();
});

// Redimensionner le canvas si la fenêtre change
window.addEventListener('resize', () => {
    if (!isRunning) {
        initCanvas();
        tileCount = Math.floor(canvas.width / gridSize);
        gridCount = tileCount;
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
            foods.splice(i, 1);
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
        generateFood();
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

    // Dessiner tous les fruits
    foods.forEach(food => {
        // Vérifier que la position est valide
        if (food.x < 0 || food.x >= tileCount || food.y < 0 || food.y >= tileCount) {
            console.error('Fruit hors limites:', food, 'tileCount:', tileCount);
            return;
        }

        const img = fruitImages[food.fruitIndex];

        // Calculer la position exacte en pixels
        const pixelX = food.x * gridSize;
        const pixelY = food.y * gridSize;

        // Vérifier si l'image est chargée
        if (img && img.complete && img.naturalHeight > 0) {
            // Dessiner l'image avec effet pulsing
            const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
            const size = gridSize * pulse;
            const offset = (gridSize - size) / 2;

            ctx.shadowColor = '#ff0';
            ctx.shadowBlur = 8;

            ctx.drawImage(
                img,
                pixelX + offset,
                pixelY + offset,
                size,
                size
            );

            ctx.shadowBlur = 0;
        } else {
            // Fallback : carré rouge avec message dans la console
            if (!img.complete) {
                console.warn(`⏳ Image ${food.fruitIndex} en cours de chargement...`);
            } else if (img.naturalHeight === 0) {
                console.error(`❌ Image ${food.fruitIndex} n'a pas pu être chargée (naturalHeight = 0)`);
            }

            ctx.fillStyle = '#f00';
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 10;
            ctx.fillRect(
                pixelX + 2,
                pixelY + 2,
                gridSize - 4,
                gridSize - 4
            );
            ctx.shadowBlur = 0;
        }
    });
}

function generateFood() {
    // S'assurer que tileCount est défini et valide
    if (!tileCount || tileCount < 3) {
        console.error('tileCount invalide:', tileCount);
        return;
    }

    // Générer une position valide STRICTEMENT à l'intérieur du terrain
    const maxPos = tileCount - 1;
    const newFood = {
        x: Math.floor(Math.random() * (maxPos - 1)) + 1, // Entre 1 et maxPos-1
        y: Math.floor(Math.random() * (maxPos - 1)) + 1,
        fruitIndex: Math.floor(Math.random() * fruitImages.length)
    };

    // Vérifier que la position est valide
    if (newFood.x < 0 || newFood.x >= tileCount || newFood.y < 0 || newFood.y >= tileCount) {
        console.error('Position invalide générée:', newFood);
        return;
    }

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

    console.log(`🍎 Fruit généré à (${newFood.x}, ${newFood.y}) - Max: ${maxPos}, Image: ${newFood.fruitIndex}`);
    foods.push(newFood);
}

function startGame() {
    if (isRunning) return;

    initCanvas();
    tileCount = Math.floor(canvas.width / gridSize);
    gridCount = tileCount;

    snake = [{x: Math.floor(tileCount/2), y: Math.floor(tileCount/2)}];
    foods = [];
    dx = 1;
    dy = 0;
    score = 0;
    gameSpeed = 120;
    scoreElement.textContent = score;
    isRunning = true;
    gameOverElement.style.display = 'none';
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
    if (isRunning) {
        isRunning = false;
        clearInterval(gameLoop);
        startBtn.textContent = 'START';
        startBtn.disabled = false;
    }

    gameOverElement.style.display = 'none';
    window.location.href = '../index.php';
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