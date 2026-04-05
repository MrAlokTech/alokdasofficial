/**
 * preloader.js — Preloader Lifecycle
 * Classic script — depends on: config.js (PRELOADER_DURATION)
 *
 * Call initPreloader(onReady) after DOM is ready.
 * The preloader element must already be inline in index.html.
 */

function initPreloader(onReady) {
  setTimeout(function () {
    _hidePreloader(onReady);
  }, PRELOADER_DURATION);
}

function _hidePreloader(onReady) {
  var el = document.getElementById('preloader');

  if (!el) {
    document.body.classList.remove('preloading');
    if (onReady) onReady();
    return;
  }

  el.classList.add('slide-away');

  el.addEventListener('transitionend', function () {
    el.style.display = 'none';
    document.body.classList.remove('preloading');
    if (onReady) onReady();
  }, { once: true });
}
