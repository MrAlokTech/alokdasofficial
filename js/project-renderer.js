/**
 * js/project-renderer.js — Renders full detail pages for project sub-sites.
 * Reads:  window.PROJECTS_DATA (from js/projects-data.js, loaded first)
 * Target: #proj-mount  (empty div in each projects/<slug>/index.html shell)
 *
 * Detects slug from window.location.pathname automatically.
 * No ES module syntax — classic <script> tag compatible.
 */

(function () {

  /* ── Helpers ─────────────────────────────────────────────────── */

  function esc(str) {
    return String(str || '')
      .replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;');
  }

  /** Build badge HTML string */
  function badge(b) {
    var cls = 'proj-status-badge' + (b.type ? ' badge-' + b.type : '');
    return '<span class="' + cls + '">' + esc(b.label) + '</span>';
  }

  /** Build a sidebar link */
  function sidebarLink(l) {
    var cls = 'sidebar-link';
    if (l.type === 'primary')   cls += ' link-primary';
    if (l.type === 'secondary') cls += ' link-secondary';
    if (l.type === 'purple')    cls += ' link-purple';
    var target = l.target ? ' target="' + l.target + '" rel="noopener"' : '';
    return '<a href="' + l.href + '" class="' + cls + '"' + target + '>' + l.label + '</a>';
  }

  /** Build an action-btn link for the nav bar */
  function navBtn(b) {
    var cls = 'action-btn';
    if (b.type === 'live')   cls += ' live-btn';
    if (b.type === 'github') cls += ' github-btn';
    var target = b.target ? ' target="' + b.target + '" rel="noopener"' : '';
    return '<a href="' + b.href + '" class="' + cls + '"' + target + '>' + b.label + '</a>';
  }

  /** Build one feature card HTML */
  function featureCard(f) {
    return '<div class="feature-card">'
      + '<div class="feature-name">' + esc(f.name) + '</div>'
      + '<p class="feature-desc">' + f.desc + '</p>'
      + '</div>';
  }

  /** Build one fact-item HTML */
  function factItem(f) {
    return '<div class="fact-item">'
      + '<span class="fact-key">' + esc(f.key) + '</span>'
      + '<span class="fact-val">'  + esc(f.val) + '</span>'
      + '</div>';
  }

  /** Build one gallery slide HTML */
  function gallerySlide(s) {
    if (s.img) {
      return '<div class="g-slide"><img src="' + s.img + '" alt="' + esc(s.alt || '') + '" style="width:100%;height:100%;object-fit:cover;"></div>';
    }
    return '<div class="g-slide">'
      + '<div class="g-placeholder" style="background:' + s.bg + ';display:flex;flex-direction:column;align-items:center;justify-content:center;height:240px;color:var(--text2);">'
      + '<span class="g-ph-icon" style="margin-bottom:8px;">' + s.icon + '</span>'
      + '<span class="g-ph-label" style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">' + esc(s.label) + '</span>'
      + '</div></div>';
  }

  /* ── Main render ────────────────────────────────────────────── */

  function render() {
    var mount = document.getElementById('proj-mount');
    if (!mount) return;

    /* Detect slug robustly from pathname or mount data-slug attribute */
    var rawPath = window.location.pathname.replace(/[\/\\]index\.html$/i, '').replace(/[\/\\]+$/, '');
    var parts   = rawPath.split(/[\/\\]/);
    var slug    = mount.getAttribute('data-slug') || parts[parts.length - 1];

    var data = window.PROJECTS_DATA;
    if (!data) {
      mount.innerHTML = '<p style="padding:2rem;color:red;">projects-data.js not loaded.</p>';
      return;
    }

    var p = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].slug === slug) { p = data[i]; break; }
    }

    /* Fallback if slug wasn't matched directly */
    if (!p && data.length > 0) {
      for (var j = 0; j < data.length; j++) {
        if (rawPath.toLowerCase().indexOf(data[j].slug.toLowerCase()) !== -1) {
          p = data[j];
          break;
        }
      }
    }

    if (!p) {
      mount.innerHTML = '<div style="padding:4rem 2rem;text-align:center;">'
        + '<h2 style="font-family:var(--font-sans);font-size:2rem;margin-bottom:1rem;">PROJECT NOT FOUND</h2>'
        + '<p style="color:var(--text2);margin-bottom:1.5rem;">Slug "<strong>' + esc(slug) + '</strong>" not found in projects-data.js.</p>'
        + '<a href="/projects" class="action-btn">← Back to All Projects</a>'
        + '</div>';
      return;
    }

    /* ── NAV ── */
    var extraNavHTML = (p.navExtra || []).map(navBtn).join('');
    var navHTML =
      '<nav class="proj-nav">'
      + '<a href="/projects" class="action-btn">← All Projects</a>'
      + '<div class="proj-nav-right">'
      + extraNavHTML
      + '<button class="theme-toggle-btn" id="themeBtn" title="Toggle theme">☾</button>'
      + '</div>'
      + '</nav>';

    /* ── HEADER ── */
    var badgesHTML = (p.headerBadges || p.cardBadges || []).map(badge).join('');
    var headerHTML =
      '<header class="proj-header">'
      + '<div class="proj-header-inner">'
      + '<div class="proj-issue-badge">Project #' + p.number + ' — ' + p.edition + '</div>'
      + '<span class="proj-header-icon">' + p.icon + '</span>'
      + '<h1 class="proj-page-title">' + p.title + '</h1>'
      + '<p class="proj-page-subtitle">' + esc(p.subtitle) + '</p>'
      + '<div class="proj-badge-row">' + badgesHTML + '</div>'
      + '</div>'
      + '</header>';

    /* ── SIDEBAR ── */
    var factsHTML = (p.facts || []).map(factItem).join('');
    var techPillsHTML = (p.techPills || p.chips || []).map(function (t) {
      return '<span class="tech-pill">' + esc(t) + '</span>';
    }).join('');
    var extraSidebarHTML = '';
    if (p.extraSidebar) {
      var ePills = (p.extraSidebar.pills || []).map(function (t) {
        return '<span class="tech-pill">' + esc(t) + '</span>';
      }).join('');
      extraSidebarHTML =
        '<div class="sidebar-card">'
        + '<div class="sidebar-title">' + p.extraSidebar.title + '</div>'
        + '<div class="tech-pill-wrap">' + ePills + '</div>'
        + '</div>';
    }
    var linksHTML = (p.links || []).map(sidebarLink).join('');

    var sidebarHTML =
      '<aside class="proj-sidebar">'
      + (factsHTML ? '<div class="sidebar-card"><div class="sidebar-title">QUICK FACTS</div><div class="facts-list">' + factsHTML + '</div></div>' : '')
      + (techPillsHTML ? '<div class="sidebar-card"><div class="sidebar-title">' + (p.techTitle || 'TECH STACK') + '</div><div class="tech-pill-wrap">' + techPillsHTML + '</div></div>' : '')
      + extraSidebarHTML
      + (linksHTML ? '<div class="sidebar-card"><div class="sidebar-title">LINKS</div><div class="link-list">' + linksHTML + '</div></div>' : '')
      + '</aside>';

    /* ── GALLERY ── */
    var slidesHTML = (p.carousel || []).map(gallerySlide).join('');
    var galleryHTML = p.carousel && p.carousel.length ?
      '<section>'
      + '<h2 class="proj-section-title">' + (p.galleryTitle || 'GALLERY & PREVIEWS') + '</h2>'
      + '<div class="proj-gallery-carousel">'
      + '<div class="gallery-track">' + slidesHTML + '</div>'
      + '</div>'
      + '</section>' : '';

    /* ── OVERVIEW ── */
    var overviewParas = p.overview ? p.overview.map(function (para) {
      return '<p style="margin-bottom:1rem;">' + para + '</p>';
    }).join('') : '<p style="margin-bottom:1rem;">' + esc(p.cardDesc) + '</p>';
    
    var overviewHTML =
      '<section>'
      + '<h2 class="proj-section-title">' + (p.overviewTitle || 'OVERVIEW') + '</h2>'
      + '<div class="proj-overview">' + overviewParas + '</div>'
      + '</section>';

    /* ── FEATURES ── */
    var featuresHTML = p.features && p.features.length ?
      '<section>'
      + '<h2 class="proj-section-title">' + (p.featuresTitle || 'KEY FEATURES') + '</h2>'
      + '<div class="features-grid">' + p.features.map(featureCard).join('') + '</div>'
      + '</section>' : '';

    /* ── CHALLENGE ── */
    var challengeHTML = p.challenge ?
      '<section>'
      + '<h2 class="proj-section-title">' + (p.challengeTitle || 'THE BUILD & ARCHITECTURE') + '</h2>'
      + '<div class="challenge-card">'
      + '<p>' + p.challenge + '</p>'
      + '</div>'
      + '</section>' : '';

    /* ── MAIN ── */
    var mainHTML =
      '<main class="proj-main">'
      + overviewHTML
      + galleryHTML
      + featuresHTML
      + challengeHTML
      + '</main>';

    /* ── FOOTER ── */
    var currentYear = new Date().getFullYear();
    var footerHTML =
      '<footer class="comic-footer" role="contentinfo" style="margin-top:4rem;">'
      + '<div class="footer-inner">'
      + '  <div class="footer-brand">'
      + '    <span class="footer-logo">ALOK DAS</span>'
      + '    <span class="footer-tagline">Chemistry &amp; Code · Assam, India</span>'
      + '  </div>'
      + '  <nav class="footer-nav" aria-label="Footer navigation">'
      + '    <a href="/" class="footer-nav-link">Home</a>'
      + '    <span class="footer-nav-sep" aria-hidden="true">·</span>'
      + '    <a href="/projects" class="footer-nav-link">Projects</a>'
      + '    <span class="footer-nav-sep" aria-hidden="true">·</span>'
      + '    <a href="/tools" class="footer-nav-link">Tools</a>'
      + '    <span class="footer-nav-sep" aria-hidden="true">·</span>'
      + '    <a href="/resume" class="footer-nav-link">Resume</a>'
      + '  </nav>'
      + '  <div class="footer-right">'
      + '    <a href="#" class="footer-back-top">↑ Back to top</a>'
      + '  </div>'
      + '</div>'
      + '<div class="footer-bottom">'
      + '  <p class="footer-copy">© ' + currentYear + ' Alok Das · All rights reserved</p>'
      + '</div>'
      + '</footer>';

    /* ── ASSEMBLE ── */
    mount.innerHTML =
      navHTML
      + headerHTML
      + '<div class="proj-body">'
      + sidebarHTML
      + mainHTML
      + '</div>'
      + footerHTML;

    /* Setup Theme Toggle */
    let darkMode = localStorage.getItem('alok-theme-dark') === 'true';
    const themeBtn = document.getElementById('themeBtn');
    function setTheme() {
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
      if (themeBtn) themeBtn.textContent = darkMode ? '☀' : '☾';
      localStorage.setItem('alok-theme-dark', darkMode);
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        darkMode = !darkMode;
        setTheme();
      });
    }
    setTheme();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
