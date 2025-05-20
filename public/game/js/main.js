// Game constants
const PLAYER_COLOR = '#FFA900';
const TRACK_COLOR = '#3D3D3D';
const BACKGROUND_COLOR = '#000000';

const TRACK_RADIUS = 200;
const PLAYER_RADIUS = 20;
const OBJECT_SIZE = 20;

const PLAYER_SPEED = 0.03; // Initial version: 0.02
const SLOW_DOWN_FACTOR = 0.3;

let BASE_OBJECT_SPEED = PLAYER_SPEED * 50;
let OBJECT_SPEED = BASE_OBJECT_SPEED;
let lastSpeedIncreaseTime = Date.now();

const BLINK_DURATION = 2000;
const SHIELD_DURATION = 10000;

let SPAWN_INTERVAL = 1000;
const MIN_SPAWN_INTERVAL = 100;
let lastSpawnIntervalDecrease = Date.now();
const MAX_MULTIPLIER = 8;
const DIFFICULTY_INTERVAL = 10;
let MAX_OBJECTS = 10;

// Canvas
let canvas, ctx;
let startCanvas, startCtx;

// Game state
let gameLoop;

let isGameRunning = false;
let isSlowingDown = false;
let isPaused = false;
let isFrozen = false;

let lastSpacePress = 0;
let lastDirectionChange = 0;
let spacePressed = false;
let spacePressTimeout = null;

let CENTER_X, CENTER_Y;

let shieldEndTime = 0;
let lastSpawnTime = 0;
let freezeEndTime = 0;

let startScreenDots = [];
let gameScreenDots = [];

let gameStartTime = 0;

// Stats
let highScore = localStorage.getItem('highScore') || 0;
let totalScore = 0;

// Functions:
// Initialize game
function init() {
    // Game canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Start screen canvas - with explicit error checking
    startCanvas = document.getElementById('startBackgroundCanvas');
    if (!startCanvas) {
        console.error('Start canvas not found');
        return;
    }
    
    startCtx = startCanvas.getContext('2d');
    if (!startCtx) {
        console.error('Could not get start canvas context');
        return;
    }

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize

    // Start animation
    animateStartBackground();
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.getElementById('startScreenHighScore').textContent = highScore;
    
    // Add touch event listeners for all buttons
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', togglePause);
    pauseButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        togglePause();
    });

    const homeButton = document.getElementById('homeButton');
    homeButton.addEventListener('click', goToStartScreen);
    homeButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        goToStartScreen();
    });

    const resumeButton = document.getElementById('resumeButton');
    resumeButton.addEventListener('click', (e) => {
        e.preventDefault();
        togglePause();
    });
    resumeButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        togglePause();
    });

    const tryAgainButton = document.getElementById('tryAgainButton');
    tryAgainButton.addEventListener('click', startGame);
    tryAgainButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startGame();
    });

    const gameOverHomeButton = document.getElementById('gameOverHomeButton');
    gameOverHomeButton.addEventListener('click', goToStartScreen);
    gameOverHomeButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        goToStartScreen();
    });
    
    // Initialize dots arrays
    startScreenDots = [];
    gameScreenDots = [];

    // Initialize music
    initMusic();

    // Забираем адрес из реакта.. если этого не видим, то надо будет потом добавить что-то типа попапа, мол, верифицируйся снова брат
    console.log("Братишка main.js загружен, ждём postMessage...");
    window.addEventListener("message", (event) => {
    if (event.data.address) {
        window.playerAddress = event.data.address;
        console.log("✅ Received address in iframe:", window.playerAddress);

        // показываем короткий адрес на экране
        const shortAddress = `0x...${window.playerAddress.slice(-4)}`;
        const walletDisplay = document.getElementById('walletAddressDisplay');
        if (walletDisplay) walletDisplay.textContent = shortAddress;
        
        fetchPlayerStats(); // Get stats from backend
    }
    });
}

async function fetchPlayerStats() {
  if (!window.playerAddress) return;

  const res = await fetch(`/api/player/stats?address=${window.playerAddress}`);
  const data = await res.json();

  if (data.success) {
    highScore = Math.max(highScore, data.highScore); //  берём максимум из локального и бэкендового
    totalScore = data.totalScore;

    // Показываем в UI
    document.getElementById('startScreenHighScore').textContent = highScore;
    document.getElementById('startScreenTotalScore').textContent = totalScore;
  }
}


// Resize canvas to fit screen
function resizeCanvas() {
    if (startCanvas && canvas) {
        startCanvas.width = window.innerWidth;
        startCanvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Log canvas dimensions for debugging
        console.log('Canvas dimensions:', startCanvas.width, startCanvas.height);
    }
}

// Animate start screen background
function animateStartBackground() {
    // Clear canvas with a visible color first to debug
    startCtx.fillStyle = '#000000';
    startCtx.fillRect(0, 0, startCanvas.width, startCanvas.height);

    // Get center coordinates
    const centerX = startCanvas.width / 2;
    const centerY = startCanvas.height / 2;

    // Draw dots
    for (let i = 0; i < 5; i++) {
        startCtx.beginPath();
        startCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        startCtx.arc(
            Math.random() * startCanvas.width,
            Math.random() * startCanvas.height,
            1,
            0,
            Math.PI * 2
        );
        startCtx.fill();
    }

    // Draw the gradient ring - same as game screen
    const gradient = startCtx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, TRACK_RADIUS
    );
    gradient.addColorStop(0.8, '#000000');  // Black at center
    gradient.addColorStop(1, '#242424');  // Dark gray at edge

    startCtx.beginPath();
    startCtx.arc(centerX, centerY, TRACK_RADIUS, 0, Math.PI * 2);
    startCtx.fillStyle = gradient;
    startCtx.fill();

    // Draw yellow rectangle from middle to bottom
    startCtx.fillStyle = '#FFA900';
    startCtx.fillRect(
        0,                    // x: start from left edge
        centerY,             // y: start from vertical center
        startCanvas.width,   // width: full width
        centerY             // height: remaining half of the screen
    );

    requestAnimationFrame(animateStartBackground);
}

// Start game
function startGame() {
    // Reset game state
    // player.angle = 0;
    // player.direction = 1;
    player.isBlinking = false;
    player.hasShield = false;
    player.lives = 2;
    player.score = 0;
    player.multiplier = 1;
    objects = [];
    isGameRunning = true;
    isSlowingDown = false;
    shieldEndTime = 0;
    lastSpawnTime = Date.now(); // Initialize spawn time
    isPaused = false; // Reset pause state

    // backend
    console.log("🚀 Game started by address:", window.playerAddress || "❌ нет адреса");

    gameStartTime = Date.now();
    window.sessionId = crypto.randomUUID();
    fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: window.sessionId,
            address: window.playerAddress,
            startTime: Date.now(),
    }),
    });


    // Reset pause button and hide home button
    document.getElementById('pauseButton').textContent = 'Pause';
    document.getElementById('homeButton').style.display = 'none';

    // Update UI
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    updateUI();

    // Start game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameUpdate, 1000 / 60);

    // Keep music playing when game starts
    if (isMusicPlaying) {
        backgroundMusic.play();
    }
}

// Toggle pause state
function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    const homeButton = document.getElementById('homeButton');
    const resumeButton = document.getElementById('resumeButton');

    
    if (isPaused) {
        pauseButton.textContent = 'Resume';
        homeButton.style.display = 'block';
        resumeButton.style.display = 'block';
    } else {
        pauseButton.textContent = 'Pause';
        homeButton.style.display = 'none';
        resumeButton.style.display = 'none'; 
    }
}

// Go to start screen
function goToStartScreen() {
    isGameRunning = false;
    clearInterval(gameLoop);
    isPaused = false; // Reset pause state

    document.getElementById('pauseButton').textContent = 'Pause';
    document.getElementById('homeButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'none'; 

    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// Game update loop
function gameUpdate() {
    if (!isGameRunning || isPaused) return;

    // Update player position
    const speed = isSlowingDown ? PLAYER_SPEED * SLOW_DOWN_FACTOR : PLAYER_SPEED;
    player.angle += speed * player.direction;

    // Update background dots
    updateGameBackgroundDots();

    // Spawn objects if we have less than maximum
    const now = Date.now();

    while (now - lastSpawnTime > SPAWN_INTERVAL && objects.length < MAX_OBJECTS) {
        spawnObject();
        lastSpawnTime += SPAWN_INTERVAL;
    }

    updateObjects();
    checkCollisions();
    draw();
    updateShieldBar();
    updateFreezeBar();

    // === DIFFICULTY PROGRESSION ===
    // Time-based speed increase
    if (now - lastSpeedIncreaseTime > 10000) { // каждые 10 сек
        if (OBJECT_SPEED < 8) {
            OBJECT_SPEED += 0.1;
        }
        lastSpeedIncreaseTime = now;
    }

    // Score-based progression
    if (player.score % DIFFICULTY_INTERVAL === 0 && player.score !== 0) {
        if (MAX_OBJECTS < 30) MAX_OBJECTS++;
        
        const enemySpawn = spawnTable.find(obj => obj.type === 'enemy');
        if (enemySpawn && enemySpawn.weight < 60) {
            enemySpawn.weight += 1;
        }
    }

    // Time-based spawn interval decrease
    if (now - lastSpawnIntervalDecrease > 10000) {
        if (SPAWN_INTERVAL > MIN_SPAWN_INTERVAL) {
            SPAWN_INTERVAL -= 50;
        }
        lastSpawnIntervalDecrease = now;
    }
}

// Update game screen background dots
function updateGameBackgroundDots() {
    const now = Date.now();
    
    // Remove expired dots
    gameScreenDots = gameScreenDots.filter(dot => now - dot.createdAt < 1000);
    
    // Add new dots randomly
    if (Math.random() < 0.1) { // 10% chance each frame to create a new dot
        gameScreenDots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random(), // Random radius up to 1px
            createdAt: now
        });
    }
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background dots
    gameScreenDots.forEach(dot => {
        const age = Date.now() - dot.createdAt;
        const opacity = 1 - (age / 1000);
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    });

    // Create radial gradient for the circle
    const ringRadius = Math.min(canvas.width, canvas.height) * 0.3;
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, ringRadius
    );
    gradient.addColorStop(0.8, '#000000');
    gradient.addColorStop(1, '#242424');

    // Draw circle with gradient
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, ringRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw objects
    objects.forEach(drawObject);
    // objects.forEach(obj => {
    //     ctx.beginPath();
    //     ctx.fillStyle = obj.type === 'point' ? '#FFFFFF' :
    //                     obj.type === 'enemy' ? '#FF0000' :
    //                     obj.type === 'life' ? '#07D4FF' :
    //                     obj.type === 'multiplier' ? '#00B872' :
    //                     '#7646FF'; // shield
    //     ctx.arc(obj.x, obj.y, OBJECT_SIZE / 2, 0, Math.PI * 2);
    //     ctx.fill();
    // });


    // Draw player with blinking effect
    if (!player.isBlinking || Math.floor(Date.now() / 100) % 2) {
        ctx.beginPath();
        ctx.fillStyle = '#FFA900';
        ctx.arc(
            canvas.width / 2 + Math.cos(player.angle) * Math.min(canvas.width, canvas.height) * 0.3,
            canvas.height / 2 + Math.sin(player.angle) * Math.min(canvas.width, canvas.height) * 0.3,
            OBJECT_SIZE / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Draw shield if active
    if (player.hasShield) {
        ctx.beginPath();
        ctx.strokeStyle = '#7646FF';
        ctx.lineWidth = 2;
        ctx.arc(
            canvas.width / 2 + Math.cos(player.angle) * Math.min(canvas.width, canvas.height) * 0.3,
            canvas.height / 2 + Math.sin(player.angle) * Math.min(canvas.width, canvas.height) * 0.3,
            OBJECT_SIZE / 2 + 5,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }
}

function drawObject(obj) {
    const ctx = canvas.getContext('2d');

    switch (obj.type) {
        case 'point':
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, OBJECT_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'enemy':
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, OBJECT_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'life':
            ctx.fillStyle = '#FFA900';
            drawPetal(ctx, obj.x, obj.y, OBJECT_SIZE);
            break;

        case 'shield':
            ctx.strokeStyle = '#7646FF';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, OBJECT_SIZE / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;

        case 'freeze':
            ctx.strokeStyle = '#3A60D9';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, OBJECT_SIZE / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;

        case 'multiplier':
            ctx.fillStyle = '#00B872';
            drawStar(ctx, obj.x, obj.y, 8, OBJECT_SIZE / 2, OBJECT_SIZE / 4);
            break;

        case 'bomb':
            ctx.fillStyle = '#4DDCFF';
            drawCloud(ctx, obj.x, obj.y, OBJECT_SIZE / 3);
            break;
    }
}

function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function drawPetal(ctx, x, y, size) {
    const r = size * 0.3;
    const offset = r ;

    ctx.beginPath();
    ctx.ellipse(x - offset, y - offset, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + offset, y - offset, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - offset, y + offset, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + offset, y + offset, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawCloud(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x - r, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + r, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y - r, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y + r, r, 0, Math.PI * 2);
    ctx.fill();
}


// Game over
function gameOver() {
    isGameRunning = false;
    clearInterval(gameLoop);

    if (player.score > highScore) {
        highScore = player.score;
        localStorage.setItem('highScore', highScore);
    }

    document.getElementById('currentScore').textContent = player.score;
    document.getElementById('highScore').textContent = highScore;

    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.remove('hidden');

    // Sending session to backend
    const durationInSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
    const finalScore = player.score;

    console.log('GAME OVER FUNCTION TRIGGERED');
    console.log("📦 Preparing to send session:");
    console.log("sessionId:", window.sessionId);
    console.log("address:", window.playerAddress);
    console.log("score:", finalScore, "typeof:", typeof finalScore);
    console.log("duration:", durationInSeconds);

    fetch('/api/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: window.sessionId,
            address: window.playerAddress,
            score: finalScore,
            duration: durationInSeconds,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
        console.log("✅ Session successfully saved in Supabase");
        } else {
        console.error("❌ Failed to save session:", data.error);
        }
    })
    .catch((err) => {
        console.error("💥 Error while sending session to backend:", err);
    });
}

// Add touch event handlers
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.start-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent double-firing
            this.click();
        });
    });
});

// Initialize game when page loads
window.onload = init;