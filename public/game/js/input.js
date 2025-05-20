// Event handlers
function handleKeyDown(e) {
    if (e.code === 'Space') {
        if (!spacePressed) {
            spacePressed = true;
            isSlowingDown = true;
            
            // Handle double-tap
            const now = Date.now();
            if (now - lastSpacePress < 300) {
                if (now - lastDirectionChange > 300) {
                    player.direction *= -1;
                    lastDirectionChange = now;
                }
            }
            lastSpacePress = now;
        }
    }
}

function handleKeyUp(e) {
    if (e.code === 'Space') {
        spacePressed = false;
        isSlowingDown = false;
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    if (!spacePressed) {
        spacePressed = true;
        isSlowingDown = true;
        
        // Handle double-tap
        const now = Date.now();
        if (now - lastSpacePress < 300) {
            if (now - lastDirectionChange > 300) {
                player.direction *= -1;
                lastDirectionChange = now;
            }
        }
        lastSpacePress = now;
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    spacePressed = false;
    isSlowingDown = false;
}