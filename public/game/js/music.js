// Initialize music state as false
let isMusicPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');

        // Initialize music
        function initMusic() {
            // Set initial button state to OFF
            const musicButton = document.querySelector('.music-button');
            musicButton.textContent = 'Music OFF';
            
            // Ensure music is paused initially
            backgroundMusic.pause();
        }

        // Toggle music function
        function toggleMusic() {
            const musicButton = document.querySelector('.music-button');
            if (isMusicPlaying) {
                backgroundMusic.pause();
                musicButton.textContent = 'Music OFF';
                isMusicPlaying = false;
            } else {
                backgroundMusic.play().then(() => {
                    musicButton.textContent = 'Music ON';
                    isMusicPlaying = true;
                }).catch(error => {
                    console.log("Audio play failed:", error);
                });
            }
        }