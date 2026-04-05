/**
 * interactions.js — User Interaction Wiring
 * Classic script — depends on: countdown.js (doRedirect)
 *
 * Call all setup functions after DOM is ready.
 */

function setupCTA() {
  ['cta-btn', 'secondary-cta-btn'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('click', function (e) {
      e.preventDefault();
      doRedirect();
    });

    el.addEventListener('touchstart', function () {
      el.style.transform = 'translate(3px, 3px)';
    }, { passive: true });

    el.addEventListener('touchend', function () {
      el.style.transform = '';
    }, { passive: true });
  });
}

function setupPanelAnimations() {
  var targets = Array.prototype.slice.call(
    document.querySelectorAll('.comic-panel')
  ).concat([
    document.querySelector('.teaser-heading'),
    document.querySelector('.secondary-cta-wrap'),
  ]).filter(Boolean);

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything immediately
    targets.forEach(function (el) { el.style.animationPlayState = 'running'; });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

function setupBursts() {
  document.querySelectorAll('.burst').forEach(function (b) {
    b.addEventListener('click', function () {
      b.style.transform = 'scale(1.5)';
      setTimeout(function () { b.style.transform = ''; }, 200);
    });
  });
}

function setupPanelKeys() {
  document.querySelectorAll('.comic-panel').forEach(function (panel) {
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doRedirect();
      }
    });
  });
}
