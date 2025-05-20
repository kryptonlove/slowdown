'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
      startGame?: () => void;
      startTutorial?: () => void;
      toggleMusic?: () => void;
      goToStartScreen?: () => void;
    }
  }

  
export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/styles.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.async = false;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div id="gameContainer">
        <canvas id="startBackgroundCanvas"></canvas>

        {/* Start Screen */}
        <div id="startScreen" className="screen">
          <img src="/assets/diggle-2100.png" className="artwork" alt="Game artwork" />
          <audio id="backgroundMusic" loop>
            <source src="/assets/slowdown.mp3" type="audio/mpeg" />
          </audio>
          <div className="highscore-label">
            <div className="highscore-title">HIGHSCORE</div>
            <div className="highscore-value" id="startScreenHighScore">0</div>
          </div>
          <div className="button-container">
            <button className="start-button" onClick={() => window.startGame?.()}>Play</button>
            <button className="start-button" onClick={() => window.startTutorial?.()}>How to play</button>
            <a className="start-button" href="https://twitter.com/intent/tweet?text=Diggle-shmiggle!%20This%20game%20is%20so%20addictive!%20Slow%20Down%20and%20play%20now&url=https%3A%2F%2Fslowdown.diggle.fun" target="_blank" rel="noopener noreferrer">Share on X</a>
            <a className="start-button" href="https://www.diggle.fun/" target="_blank" rel="noopener noreferrer">More games</a>
            <button className="start-button music-button" onClick={() => window.toggleMusic?.()}>Music OFF</button>
          </div>
        </div>

        {/* Game Screen */}
        <div id="gameScreen" className="screen hidden">
          <canvas id="gameCanvas"></canvas>
          <div id="shieldBar"></div>
          <div id="freezeBar" className="shield-bar"></div>
          <button id="pauseButton">Pause</button>

          <div id="score" className="score-number">0</div>
          <div id="multiplier" className="score-multiplier">×1</div>
          <div id="lives">Lives: 2</div>

          <button id="resumeButton">Resume</button>
          <button id="homeButton" onClick={() => window.goToStartScreen?.()}>Home</button>
          <div id="tutorialCenterText" className="tutorial-center-text"></div>
          <div id="tutorialTextBox" className="tutorial-text-box"></div>
        </div>

        {/* Game Over Screen */}
        <div id="gameOverScreen" className="screen hidden">
          <div className="rules">
            <h1>Game Over</h1>
            <div className="score-info">
              <div>Current Score: <span id="currentScore">0</span></div>
              <div>High Score: <span id="highScore">0</span></div>
            </div>
            <div className="button-group">
              <button id="tryAgainButton" onClick={() => window.startGame?.()}>TRY AGAIN</button>
              <button id="resumeButton" className="resume-button">Resume</button>
              <button id="gameOverHomeButton" onClick={() => window.goToStartScreen?.()}>Home</button>
            </div>
          </div>
        </div>

        {/* Tutorial Screen */}
        <div id="tutorialScreen" className="screen hidden">
          <canvas id="tutorialCanvas"></canvas>
          <div id="tutorialText" className="tutorial-text"></div>
        </div>
      </div>
    </div>
  );
}
