let tutorialTexts = [
    `Hold on screen or SPACE to slow down`,
    `Double tap or SPACE twice to reverse direction`,
    `Catch white circles for points and avoid <span class="red">enemies</span>`,
    `<span class="purple">Purples</span> protect you from <span class="red">enemies</span> and <span class="yellow">yellows</span> heal`,
    `Catch other colors to unlock special abilities`,
    `Good luck... Leslie`
];

let tutorialStartTime = 0;
let tutorialTextIndex = 0;
let tutorialTextInterval;
let isTutorial = false;
let spawnEnabled = false;

function startTutorialGame() {
    // Copy-paste from startGame(), but with minor chages
    player.angle = 0;
    player.direction = 1;
    player.isBlinking = false;
    player.hasShield = false;
    player.lives = 2;
    player.score = 0;
    player.multiplier = 1;
    objects = [];
    isGameRunning = true;
    isTutorial = true;
    isPaused = false;
    isSlowingDown = false;
    shieldEndTime = 0;
    lastSpawnTime = Date.now();
    spawnEnabled = false;
    tutorialStartTime = Date.now();

    document.getElementById('pauseButton').textContent = 'Pause';
    document.getElementById('homeButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'none';

    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    updateUI();

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(tutorialGameUpdate, 1000 / 60);

    if (isMusicPlaying) {
        backgroundMusic.play();
    }

    // Запуск текста
    tutorialTextIndex = 0;
    showTutorialText();
    tutorialTextInterval = setInterval(showTutorialText, 5000);

    // Включаем спавн через 10 сек
    setTimeout(() => {
        spawnEnabled = true;
    }, 10000);

    setTimeout(() => {
        clearInterval(tutorialTextInterval); // остановить интервалы
        document.getElementById('tutorialCenterText').innerHTML = ""; // убрать текст
        isTutorial = false; // на всякий
        startGame(); // стартуй, боец
    }, tutorialTexts.length * 5000);



}

function tutorialGameUpdate() {
    if (!isGameRunning || isPaused) return;

    const speed = isSlowingDown ? PLAYER_SPEED * SLOW_DOWN_FACTOR : PLAYER_SPEED;
    player.angle += speed * player.direction;

    updateGameBackgroundDots();

    const now = Date.now();
    if (spawnEnabled && now - lastSpawnTime > SPAWN_INTERVAL && objects.length < MAX_OBJECTS) {
        spawnObject();
        lastSpawnTime = now;
    }

    updateObjects();
    checkCollisions();
    draw();
    updateShieldBar();
}

function showTutorialText() {
    const textBox = document.getElementById('tutorialCenterText');
    const text = tutorialTexts[tutorialTextIndex % tutorialTexts.length];
    tutorialTextIndex++;

    // textBox.textContent = text;
    textBox.innerHTML = text;
    textBox.style.opacity = 0;
    textBox.style.transition = 'opacity 1s';
    setTimeout(() => textBox.style.opacity = 1, 100);
    setTimeout(() => textBox.style.opacity = 0, 4000);
}

window.startTutorial = startTutorialGame;