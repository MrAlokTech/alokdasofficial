/**
 * interactions.js — User Interaction Wiring
 * Classic script. Depends on: nav.js (indirectly).
 * Call all setup functions after DOM is ready.
 */

/* ── Blog carousel (in .works-grid) ── */
function setupCarousels() {
  document.querySelectorAll('.work-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
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
    var total = slides.length;
    var dots = [];

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
  var bars = document.querySelectorAll('.skill-bar-fill');
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
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var btn = form.querySelector('.form-submit');
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('form_submit', 'contact-form', { status: 'attempted' });
    }

    fetch(form.action, {
      method: 'POST',
      body: data,
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

/* ── Secure phone unmasking logic ── */
function setupPhoneReveal() {
  var container = document.getElementById('phone-container');
  var btn = document.getElementById('phone-reveal-btn');
  if (!container || !btn) return;

  var PHONE_STORAGE_KEY = '_ap_verified';

  // Get full number from split config parts
  var cc = (window.PHONE_PARTS && window.PHONE_PARTS.cc) || '+91';
  var pa = (window.PHONE_PARTS && window.PHONE_PARTS.a) || '91010';
  var pb = (window.PHONE_PARTS && window.PHONE_PARTS.b) || '90890';
  var fullNumber = cc + pa + pb;
  var spacedNumber = cc + ' ' + pa + ' ' + pb;

  function renderUnlockedLink() {
    var link = document.createElement('a');
    link.href = 'tel:' + fullNumber;

    // Dynamically apply classes matching the page context!
    var pageClass = btn.classList.contains('r-contact-chip') ? 'r-contact-chip' : 'contact-chip-link';
    link.className = pageClass;

    // Use matching icon structure for resume vs landing page
    if (pageClass === 'r-contact-chip') {
      link.innerHTML = '<i class="fa-solid fa-phone" aria-hidden="true"></i> ' + spacedNumber;
    } else {
      link.innerHTML = '<span class="contact-chip-icon">📱</span>' + spacedNumber;
    }

    container.innerHTML = '';
    container.appendChild(link);
  }

  // If already unlocked this session
  if (sessionStorage.getItem(PHONE_STORAGE_KEY) === 'true') {
    renderUnlockedLink();
    return;
  }

  var popover = null;
  var valA = 0;
  var valB = 0;
  var answer = 0;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (popover) {
      closePopover();
      return;
    }

    // Generate random values for the math check
    valA = Math.floor(Math.random() * 99) + 2; // 2 to 10
    valB = Math.floor(Math.random() * 9) + 1; // 1 to 9
    answer = valA + valB;

    popover = document.createElement('div');
    popover.className = 'phone-challenge-popover';
    popover.innerHTML =

      '<div class="challenge-row">' +
      '<span class="challenge-question">What\'s: ' + valA + ' + ' + valB + ' = </span>' +
      '<input type="text" class="challenge-input" pattern="[0-9]*" inputmode="numeric" maxlength="3" aria-label="Your answer" />' +
      '<button type="button" class="challenge-btn">UNLOCK</button>' +
      '</div>' +
      '<div class="challenge-error">NOPE! TRY AGAIN.</div>';

    container.appendChild(popover);

    var input = popover.querySelector('.challenge-input');
    var verifyBtn = popover.querySelector('.challenge-btn');
    var errorMsg = popover.querySelector('.challenge-error');

    input.focus();

    // Prevent propagation so click outside can dismiss the popover
    popover.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    function doVerify() {
      var userAns = parseInt(input.value.trim(), 10);
      if (userAns === answer) {
        sessionStorage.setItem(PHONE_STORAGE_KEY, 'true');
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('phone_reveal_success', 'landing_contact', { challenge: valA + '+' + valB });
        }
        closePopover();
        renderUnlockedLink();
      } else {
        // Log event
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('phone_reveal_failed', 'landing_contact', { challenge: valA + '+' + valB, input: input.value });
        }
        // Shake shake shake
        popover.classList.remove('shake-it');
        void popover.offsetWidth; // Trigger reflow to restart animation
        popover.classList.add('shake-it');
        errorMsg.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }

    verifyBtn.addEventListener('click', doVerify);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        doVerify();
      }
    });
  });

  function closePopover() {
    if (popover && popover.parentNode) {
      popover.parentNode.removeChild(popover);
    }
    popover = null;
  }

  // Dismiss on clicking elsewhere
  document.addEventListener('click', function () {
    closePopover();
  });
}

