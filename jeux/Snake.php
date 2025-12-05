<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game - PHP</title>
    <link rel="stylesheet" href="../css/Snake.css">
</head>
<body>
<div class="game-container">
    <div class="scoreboard">
        <button class="btn-home" onclick="goHome()" title="Retour à l'accueil">🏠</button>
        <div class="score-item">
            <span class="label">SCORE</span>
            <span class="value" id="score">0</span>
        </div>
        <button class="btn-start" id="startBtn" onclick="startGame()">START</button>
        <div class="score-item">
            <span class="label">HI-SCORE</span>
            <span class="value" id="highScore">0</span>
        </div>
    </div>

    <canvas id="gameCanvas"></canvas>

    <div class="rules-panel" id="rulesPanel">
        <div class="rules-content">
            <h2>[ SNAKE RULES ]</h2>
            <div class="rules-text">
                <p class="rule-section">OBJECTIVE:</p>
                <p>Guide the snake to eat the red pixels. Each pixel increases your score and makes the snake grow longer.</p>

                <p class="rule-section">CONTROLS:</p>
                <p>KEYBOARD: Use arrow keys to change direction</p>
                <p>MOBILE: Use the directional buttons below the game area</p>

                <p class="rule-section">GAME OVER:</p>
                <p>The game ends if you hit the walls or collide with your own body.</p>

                <p class="rule-section">SPEED:</p>
                <p>The snake speeds up every 50 points. Can you handle the maximum velocity?</p>

                <p class="rule-section">AESTHETIC:</p>
                <p>This game pays tribute to classic arcade terminals and early computer graphics from the 1980s era.</p>
            </div>
            <button class="btn-close-rules" onclick="toggleRules()">CLOSE</button>
        </div>
    </div>

    <div class="touch-controls">
        <button class="touch-btn up" ontouchstart="changeDirection(0, -1)" onclick="changeDirection(0, -1)">▲</button>
        <button class="touch-btn left" ontouchstart="changeDirection(-1, 0)" onclick="changeDirection(-1, 0)">◄</button>
        <button class="touch-btn right" ontouchstart="changeDirection(1, 0)" onclick="changeDirection(1, 0)">►</button>
        <button class="touch-btn down" ontouchstart="changeDirection(0, 1)" onclick="changeDirection(0, 1)">▼</button>
    </div>

    <div class="game-over" id="gameOver">
        <div class="game-over-content">
            <h2>GAME OVER</h2>
            <p>SCORE: <span id="finalScore">0</span></p>
            <div class="game-over-buttons">
                <button class="btn-restart" onclick="restartGame()">RESTART</button>
                <button class="btn-home-over" onclick="goHome()">HOME</button>
            </div>
        </div>
    </div>
</div>

<script src="../js/Snake.js"></script>
</body>
</html>