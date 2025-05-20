
// Update UI
function updateUI() {
    document.getElementById('score').textContent = player.score;
    document.getElementById('lives').textContent = `Lives: ${player.lives}`;
    document.getElementById('multiplier').textContent = `x${player.multiplier}`;
}

// Update shield bar
function updateShieldBar() {
    const shieldBar = document.getElementById('shieldBar');
    if (player.hasShield) {
        shieldBar.style.display = 'block';
        const remaining = shieldEndTime - Date.now();
        const width = (remaining / SHIELD_DURATION) * 100;
        shieldBar.style.width = `${width}%`;
    } else {
        shieldBar.style.display = 'none';
        shieldBar.style.width = '0%';
    }
}

function updateFreezeBar() {
    const freezeBar = document.getElementById('freezeBar');
    if (!isFrozen) {
        freezeBar.style.display = 'none';
        return;
    }

    const remaining = freezeEndTime - Date.now();
    const width = (remaining / 10000) * 100;
    freezeBar.style.width = `${width}%`;
    freezeBar.style.display = 'block';

}

// Share result on Twitter
function shareOnTwitter() {
    const text = `Diggle Shmiggle! I scored ${highScore} in Slow Down. Play to slow down, bruv`;
    const url = 'https://slowdown.diggle.fun/';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  
    window.open(twitterUrl, '_blank');
  }