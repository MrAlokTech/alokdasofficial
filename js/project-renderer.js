/**
 * js/project-renderer.js — Renders full detail pages for project sub-sites.
 * Reads:  window.PROJECTS_DATA (from js/projects-data.js, loaded first)
 * Target: #proj-mount  (empty div in each projects/<slug>/index.html shell)
 *
 * Detects slug from window.location.pathname automatically.
 * No ES module syntax — classic <script> tag compatible.
 * Also re-initialises the gallery carousel internally.
 */

(function () {

  /* ── Helpers ─────────────────────────────────────────────────── */

  function esc(str) {
    return String(str)
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
      + '<span class="feature-icon">' + f.icon + '</span>'
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
      + '<div class="g-placeholder" style="background:' + s.bg + ';">'
      + '<span class="g-ph-icon">' + s.icon + '</span>'
      + '<span class="g-ph-label">' + esc(s.label) + '</span>'
      + '</div></div>';
  }

  /* ── Gallery carousel (mirrors projects/project.js logic) ─── */
  function initGallery(container) {
    var track    = container.querySelector('.g-track');
    var slides   = container.querySelectorAll('.g-slide');
    var prevBtn  = container.querySelector('.g-prev');
    var nextBtn  = container.querySelector('.g-next');
    var dotsWrap = container.querySelector('.g-dots');

    if (!track || slides.length === 0) return;

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    var current = 0;
    var total   = slides.length;
    var dots    = [];

    if (dotsWrap) {
      for (var i = 0; i < total; i++) {
        (function (idx) {
          var dot = document.createElement('span');
          dot.className = 'g-dot' + (idx === 0 ? ' active' : '');
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
    var sx = 0;
    container.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });

    setInterval(function () { goTo(current + 1); }, 5000);
  }

  /* ── Main render ────────────────────────────────────────────── */

  function render() {
    var mount = document.getElementById('proj-mount');
    if (!mount) return;

    /* Detect slug from URL: /projects/alomole/ → 'alomole' */
    var parts = window.location.pathname.replace(/\/+$/, '').split('/');
    var slug  = parts[parts.length - 1];

    var data = window.PROJECTS_DATA;
    if (!data) {
      mount.innerHTML = '<p style="padding:2rem;color:red;">projects-data.js not loaded.</p>';
      return;
    }

    var p = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].slug === slug) { p = data[i]; break; }
    }

    if (!p) {
      mount.innerHTML = '<div style="padding:3rem 2rem;text-align:center;">'
        + '<h2 style="font-family:Bangers,cursive;font-size:3rem;">PROJECT NOT FOUND</h2>'
        + '<p>Slug "<strong>' + esc(slug) + '</strong>" not in projects-data.js.</p>'
        + '<a href="/#projects" style="color:#FFE600;">← Back to Projects</a>'
        + '</div>';
      return;
    }

    /* ── NAV ── */
    var extraNavHTML = (p.navExtra || []).map(navBtn).join('');
    var navHTML =
      '<nav class="proj-nav">'
      + '<a href="/#projects" class="action-btn">← Back to Portfolio</a>'
      + (extraNavHTML ? '<div class="proj-nav-right">' + extraNavHTML + '</div>' : '')
      + '</nav>';

    /* ── HEADER ── */
    var badgesHTML = (p.headerBadges || []).map(badge).join('');
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
    var techPillsHTML = (p.techPills || []).map(function (t) {
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
      + '<div class="sidebar-card">'
      + '<div class="sidebar-title">📋 QUICK FACTS</div>'
      + '<div class="facts-list">' + factsHTML + '</div>'
      + '</div>'
      + '<div class="sidebar-card">'
      + '<div class="sidebar-title">' + (p.techTitle || '🛠️ TECH STACK') + '</div>'
      + '<div class="tech-pill-wrap">' + techPillsHTML + '</div>'
      + '</div>'
      + extraSidebarHTML
      + '<div class="sidebar-card">'
      + '<div class="sidebar-title">🔗 LINKS</div>'
      + '<div class="link-list">' + linksHTML + '</div>'
      + '</div>'
      + '</aside>';

    /* ── GALLERY ── */
    var slidesHTML = (p.carousel || []).map(gallerySlide).join('');
    var galleryHTML =
      '<section>'
      + '<h2 class="proj-section-title">' + (p.galleryTitle || '📸 GALLERY') + '</h2>'
      + '<div class="proj-gallery">'
      + '<div class="g-track">' + slidesHTML + '</div>'
      + '<button class="g-prev" aria-label="Previous">‹</button>'
      + '<button class="g-next" aria-label="Next">›</button>'
      + '<div class="g-dots"></div>'
      + '</div>'
      + '</section>';

    /* ── OVERVIEW ── */
    var overviewParas = (p.overview || []).map(function (para) {
      return '<p>' + para + '</p>';
    }).join('<br>');
    var overviewHTML =
      '<section>'
      + '<h2 class="proj-section-title">' + (p.overviewTitle || '📄 OVERVIEW') + '</h2>'
      + '<div class="proj-overview">' + overviewParas + '</div>'
      + '</section>';

    /* ── FEATURES ── */
    var featuresHTML =
      '<section>'
      + '<h2 class="proj-section-title">' + (p.featuresTitle || '✨ KEY FEATURES') + '</h2>'
      + '<div class="features-grid">' + (p.features || []).map(featureCard).join('') + '</div>'
      + '</section>';

    /* ── CHALLENGE ── */
    var challengeHTML =
      '<section>'
      + '<h2 class="proj-section-title">' + (p.challengeTitle || '🛠️ THE BUILD') + '</h2>'
      + '<div class="proj-overview" style="background:var(--dark);color:var(--cream);border-color:var(--yellow);">'
      + '<p>' + p.challenge + '</p>'
      + '</div>'
      + '</section>';

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
    var footerLiveHTML = p.footerLive
      ? '<a href="' + p.footerLive.href + '" class="proj-footer-link">' + p.footerLive.label + '</a>'
        + '<span class="proj-footer-sep">·</span>'
      : '';
    var footerHTML =
      '<footer class="proj-footer">'
      + '<div class="proj-footer-inner">'
      + '<div class="proj-footer-brand">'
      + '<span class="proj-footer-name">ALOK DAS</span>'
      + '<span class="proj-footer-sub">' + esc(p.footerLine2 || '') + '</span>'
      + '</div>'
      + '<div class="proj-footer-links">'
      + footerLiveHTML
      + '<a href="/#projects" class="proj-footer-link">← All Projects</a>'
      + '<span class="proj-footer-sep">·</span>'
      + '<a href="/" class="proj-footer-link">Home</a>'
      + '<span class="proj-footer-sep">·</span>'
      + '<a href="/resume" class="proj-footer-link">Resume</a>'
      + '</div>'
      + '</div>'
      + '<div class="proj-footer-bottom">'
      + '<p class="proj-footer-copy">© ' + currentYear + ' Alok Das · alokdasofficial.in</p>'
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

    /* ── INIT GALLERY ── */
    var gallery = mount.querySelector('.proj-gallery');
    if (gallery) initGallery(gallery);
  }

  /* Run on DOMContentLoaded or immediately if DOM is already ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
