/**
 * nav.js — Navigation (hamburger toggle + scroll-spy)
 * Classic script. Depends on nothing.
 * Call setupNav() after DOM is ready.
 */

function setupNav() {
  var hamburger  = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile-menu');

  /* ── Hamburger toggle ── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');

      // Prevent body scroll when menu open
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close mobile menu when any link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('nav_click', 'mobile_menu', {
            label: link.textContent.trim().slice(0, 40),
            href:  link.getAttribute('href')
          });
        }
      });
    });
  }

  /* ── Smooth scroll for all hash links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id     = this.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 62;
      var top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('nav_click', 'desktop_nav', {
          label:   anchor.textContent.trim().slice(0, 40),
          section: id
        });
      }
    });
  });

  /* ── Scroll-spy: highlight active nav link ── */
  var sections   = [];
  var allNavLinks = document.querySelectorAll('.nav-link[data-section]');

  allNavLinks.forEach(function (link) {
    var el = document.getElementById(link.getAttribute('data-section'));
    if (el) sections.push({ el: el, id: link.getAttribute('data-section') });
  });

  function setActive(id) {
    allNavLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-section') === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -65% 0px' });

    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ── Shrink nav shadow on scroll ── */
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
    } else {
      nav.style.boxShadow = '';
    }
  }, { passive: true });
}
