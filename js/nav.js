/**
 * nav.js — Navigation (hamburger toggle + scroll-spy + theme toggle)
 * Classic script. Depends on nothing.
 * Call setupNav() after DOM is ready.
 */

function setupNav() {
  var hamburger  = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile-menu');

  /* ── Universal Theme Setup ── */
  let darkMode = localStorage.getItem('alok-theme-dark') === 'true';
  const themeBtn = document.getElementById('themeBtn');

  function setTheme() {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    if (themeBtn) {
      themeBtn.textContent = darkMode ? '☀' : '☾';
    }
    localStorage.setItem('alok-theme-dark', darkMode);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      darkMode = !darkMode;
      setTheme();
    });
  }

  // Initialize theme on load
  setTheme();

  /* ── Hamburger toggle ── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');

      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
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
      ) || 66;
      var top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll-spy ── */
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

  /* ── Nav shadow on scroll ── */
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}
