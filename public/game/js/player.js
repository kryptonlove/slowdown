// Player
const player = {
    angle: 0,
    direction: 1,
    isBlinking: false,
    hasShield: false,
    lives: 2,
    score: 0,
    multiplier: 1
};

function resetPlayer() {
    player.angle = 0;
    player.direction = 1;
    player.isBlinking = false;
    player.hasShield = false;
    player.lives = 2;
    player.score = 0;
    player.multiplier = 1;
}