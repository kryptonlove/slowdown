let objects = [];

const spawnTable = [
    { type: 'point', weight: 50 },
    { type: 'enemy', weight: 30 },
    { type: 'life', weight: 2 },
    { type: 'shield', weight: 10 },
    { type: 'multiplier', weight: 6 },
    { type: 'bomb', weight: 2 },
    { type: 'freeze', weight: 3 }
];

function getRandomObjectType() {
    const totalWeight = spawnTable.reduce((sum, obj) => sum + obj.weight, 0);
    let rand = Math.random() * totalWeight;

    for (let obj of spawnTable) {
        if (rand < obj.weight) return obj.type;
        rand -= obj.weight;
    }

    return 'point'; // fallback
}

// Update object positions
function updateObjects() {
    if (isFrozen && Date.now() >= freezeEndTime) {
        isFrozen = false;
        document.getElementById('freezeBar').style.display = 'none';
    }

    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];

        // Freeze enemies
        if (isFrozen && obj.type === 'enemy') continue;

        obj.x += obj.vx;
        obj.y += obj.vy;

        if (obj.x < -OBJECT_SIZE || obj.x > canvas.width + OBJECT_SIZE ||
            obj.y < -OBJECT_SIZE || obj.y > canvas.height + OBJECT_SIZE) {
            objects.splice(i, 1);
        }
    }
}

// Spawn new object
function spawnObject() {
    // Don't spawn if we already have maximum objects
    if (objects.length >= MAX_OBJECTS) {
        return;
    }

    const type = getRandomObjectType();

    // Calculate center point (target)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Choose a random side to spawn from
    const side = Math.floor(Math.random() * 4);
    let startX, startY;

    switch (side) {
        case 0: // top
            startX = Math.random() * canvas.width;
            startY = -OBJECT_SIZE;
            break;
        case 1: // right
            startX = canvas.width + OBJECT_SIZE;
            startY = Math.random() * canvas.height;
            break;
        case 2: // bottom
            startX = Math.random() * canvas.width;
            startY = canvas.height + OBJECT_SIZE;
            break;
        case 3: // left
            startX = -OBJECT_SIZE;
            startY = Math.random() * canvas.height;
            break;
    }

    // Calculate direction vector
    const dx = centerX - startX;
    const dy = centerY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize and scale the direction
    const vx = (dx / length) * OBJECT_SPEED;
    const vy = (dy / length) * OBJECT_SPEED;

    objects.push({
        type,
        x: startX,
        y: startY,
        vx,
        vy
    });
}

// Check collisions
function checkCollisions() {
    const trackRadius = Math.min(canvas.width, canvas.height) * 0.3;
    const playerX = canvas.width / 2 + Math.cos(player.angle) * trackRadius;
    const playerY = canvas.height / 2 + Math.sin(player.angle) * trackRadius;

    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        const dx = playerX - obj.x;
        const dy = playerY - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < OBJECT_SIZE) {
            if (obj.type === 'shield') {
                player.hasShield = true;
                shieldEndTime = Date.now() + SHIELD_DURATION;
                objects.splice(i, 1);
                updateUI();
                continue;
            }
            if (obj.type === 'enemy') {
                if (!player.hasShield && !player.isBlinking) {
                    player.lives--;
                    player.isBlinking = true;
                    player.multiplier = 1;
                    setTimeout(() => player.isBlinking = false, BLINK_DURATION);
                    if (player.lives <= 0) gameOver();
                }
            } else if (obj.type === 'point') {
                player.score += player.multiplier;
                // Check for difficulty increase
                if (player.score % DIFFICULTY_INTERVAL === 0) {
                    MAX_OBJECTS++;
                }
            } else if (obj.type === 'life') {
                if (player.lives < 3) {
                    player.lives++;
                }
            } else if (obj.type === 'multiplier') {
                if (player.multiplier < MAX_MULTIPLIER) {
                    player.multiplier *= 2;
                }
            } else if (obj.type === 'bomb') {
                for (let j = objects.length - 1; j >= 0; j--) {
                    if (objects[j].type === 'enemy') {
                        objects.splice(j, 1);
                    }
                }
            } else if (obj.type === 'freeze') {
                isFrozen = true;
                freezeEndTime = Date.now() + 10000; // 10 seconds
                document.getElementById('freezeBar').style.display = 'block';
            }
            objects.splice(i, 1);
            updateUI();
        }
    }

    // Check shield expiration
    if (player.hasShield && Date.now() >= shieldEndTime) {
        player.hasShield = false;
    }
}
