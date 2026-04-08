/**
 * interactions.js — User Interaction Wiring
 * Classic script. Depends on: nav.js (indirectly).
 * Call all setup functions after DOM is ready.
 */

/* ── Blog carousel (in .works-grid) ── */
function setupCarousels() {
  document.querySelectorAll('.work-carousel').forEach(function (carousel) {
    var track  = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var dotsWrap = carousel.querySelector('.carousel-dots');

    if (!track || slides.length <= 1) {
      // Single slide — hide controls
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    var current = 0;
    var total   = slides.length;
    var dots    = [];

    /* Build dots */
    if (dotsWrap) {
      for (var i = 0; i < total; i++) {
        (function (idx) {
          var dot = document.createElement('span');
          dot.className = 'c-dot' + (idx === 0 ? ' active' : '');
          dot.addEventListener('click', function () { goTo(idx); });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    /* Touch swipe */
    var swipeStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
      swipeStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeStartX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });

    /* Auto-advance (opt-in via data-autoplay="ms") */
    var autoDelay = parseInt(carousel.dataset.autoplay, 10);
    if (autoDelay > 0) {
      setInterval(function () { goTo(current + 1); }, autoDelay);
    }
  });
}

/* ── Panel slide-in animations (IntersectionObserver) ── */
function setupPanelAnimations() {
  var targets = Array.prototype.slice.call(
    document.querySelectorAll('.comic-panel, .project-card, .game-card, .about-card')
  ).concat([
    document.querySelector('.teaser-heading'),
    document.querySelector('.secondary-cta-wrap'),
  ]).filter(Boolean);

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.style.animationPlayState = 'running'; });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) {
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });
}

/* ── Animate skill bars when about section enters view ── */
function setupSkillBars() {
  var bars  = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach(function (b) { b.style.width = (b.getAttribute('data-width') || 0) + '%'; });
    return;
  }

  var triggered = false;
  var barObs = new IntersectionObserver(function (entries) {
    if (triggered) return;
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        triggered = true;
        bars.forEach(function (b) {
          b.style.width = (b.getAttribute('data-width') || 0) + '%';
        });
        barObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var aboutSection = document.getElementById('about');
  if (aboutSection) barObs.observe(aboutSection);
}

/* ── Burst click-pop effect ── */
function setupBursts() {
  document.querySelectorAll('.burst').forEach(function (b) {
    b.addEventListener('click', function () {
      b.style.transform = 'scale(1.5)';
      setTimeout(function () { b.style.transform = ''; }, 200);
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('burst_click', b.textContent.trim(), null);
      }
    });
  });
}

/* ── Keyboard access for comic panels ── */
function setupPanelKeys() {
  document.querySelectorAll('.comic-panel[tabindex]').forEach(function (panel) {
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panel.click();
      }
    });
  });
}

/* ── Contact form AJAX (Formspree) ── */
function setupContactForm() {
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var btn  = form.querySelector('.form-submit');
    btn.textContent = 'SENDING...';
    btn.disabled    = true;

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('form_submit', 'contact-form', { status: 'attempted' });
    }

    fetch(form.action, {
      method:  'POST',
      body:    data,
      headers: { 'Accept': 'application/json' },
    })
      .then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          if (success) success.style.display = 'block';
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('form_submit', 'contact-form', { status: 'sent' });
          }
        } else {
          btn.textContent = '⚠️ FAILED — TRY EMAIL';
          btn.disabled = false;
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('form_submit', 'contact-form', { status: 'failed' });
          }
        }
      })
      .catch(function () {
        btn.textContent = '⚠️ NETWORK ERROR';
        btn.disabled = false;
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('form_submit', 'contact-form', { status: 'network_error' });
        }
      });
  });
}
