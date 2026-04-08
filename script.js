/**
 * script.js — Main Entry Point
 *
 * Classic IIFE. All dependencies loaded via <script> tags in index.html.
 * Load order: config → typewriter → preloader → interactions → nav → script
 *
 * This file only calls — no logic lives here.
 */

(function () {
  document.body.classList.add('preloading');

  setupNav();
  setupCarousels();
  setupPanelAnimations();
  setupSkillBars();
  setupBursts();
  setupPanelKeys();
  setupContactForm();
  renderProjectsGrid();

  /* Dynamic year in footer */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initPreloader(function () {
    startTypewriter();
  });
})();
