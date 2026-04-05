/**
 * script.js — Main Entry Point
 *
 * Classic (non-module) script. All dependencies are loaded as
 * separate <script> tags in index.html before this file.
 *
 * Load order in index.html:
 *   config.js → typewriter.js → countdown.js → preloader.js
 *   → interactions.js → script.js (this file)
 *
 * This file only calls — no logic lives here.
 */

(function () {
  // 1. Mask content while preloader is visible
  document.body.classList.add('preloading');

  // 2. Wire all interactions (DOM is inline — available immediately)
  setupCTA();
  setupPanelAnimations();
  setupBursts();
  setupPanelKeys();

  // 3. Preloader → slide away → start page animations
  initPreloader(function () {
    startTypewriter();
    setTimeout(startCountdown, 300);
  });
})();
