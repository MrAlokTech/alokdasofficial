/**
 * typewriter.js — Speech Bubble Typewriter Effect
 * Classic script — depends on: config.js (TYPEWRITER_LINES)
 *
 * startTypewriter()  → begin / restart the cycle
 * stopTypewriter()   → halt and clear timers
 */

var _twTimeout  = null;
var _twLineIdx  = 0;
var _twCharIdx  = 0;
var _twDeleting = false;

function startTypewriter() {
  _twLineIdx = _twCharIdx = 0;
  _twDeleting = false;
  _twTick();
}

function stopTypewriter() {
  clearTimeout(_twTimeout);
}

function _twTick() {
  var el = document.getElementById('typewriter-text');
  if (!el) return;

  var line = TYPEWRITER_LINES[_twLineIdx];

  if (!_twDeleting) {
    _twCharIdx++;
    el.textContent = line.slice(0, _twCharIdx);

    if (_twCharIdx === line.length) {
      _twDeleting = true;
      _twTimeout  = setTimeout(_twTick, 1900);
      return;
    }
  } else {
    _twCharIdx--;
    el.textContent = line.slice(0, _twCharIdx);

    if (_twCharIdx === 0) {
      _twDeleting = false;
      _twLineIdx  = (_twLineIdx + 1) % TYPEWRITER_LINES.length;
    }
  }

  _twTimeout = setTimeout(_twTick, _twDeleting ? 38 : 62);
}
