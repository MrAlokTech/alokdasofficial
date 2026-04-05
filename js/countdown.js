/**
 * countdown.js — Countdown Timer + Redirect Logic
 * Classic script — depends on: config.js, typewriter.js
 *
 * startCountdown()  → begin visible countdown from TOTAL_SECONDS
 * doRedirect()      → trigger slide-up exit + navigate (safe to call multiple times)
 * isRedirecting     → global boolean guard
 */

var isRedirecting = false;
var _cdSecondsLeft = TOTAL_SECONDS;
var _cdTimer       = null;

function startCountdown() {
  _cdSecondsLeft = TOTAL_SECONDS;
  _cdTick();
}

function doRedirect() {
  if (isRedirecting) return;
  isRedirecting = true;

  stopTypewriter();
  clearTimeout(_cdTimer);

  document.body.classList.add('page-exit');
  setTimeout(function () {
    window.location.href = REDIRECT_URL;
  }, 680);
}

function _cdTick() {
  if (isRedirecting) return;

  var countEl = document.getElementById('countdown-number');
  var fillEl  = document.getElementById('progress-fill');
  var secEl2  = document.getElementById('countdown-secondary');

  if (!countEl || !fillEl) return;

  // Pulse the number
  countEl.classList.remove('tick');
  void countEl.offsetWidth; // force reflow
  countEl.classList.add('tick');

  countEl.textContent             = _cdSecondsLeft;
  if (secEl2) secEl2.textContent  = _cdSecondsLeft;

  // Fill progress bar
  var elapsed = TOTAL_SECONDS - _cdSecondsLeft;
  fillEl.style.width = ((elapsed / TOTAL_SECONDS) * 100) + '%';

  // Colour urgency
  if      (_cdSecondsLeft <= 3) countEl.style.color = '#FF2D6B';
  else if (_cdSecondsLeft <= 6) countEl.style.color = '#00C2FF';

  if (_cdSecondsLeft <= 0) {
    fillEl.style.width  = '100%';
    countEl.textContent = '🚀';
    doRedirect();
    return;
  }

  _cdSecondsLeft--;
  _cdTimer = setTimeout(_cdTick, 1000);
}
