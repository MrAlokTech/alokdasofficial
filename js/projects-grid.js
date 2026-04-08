/**
 * js/projects-grid.js — Renders project work-cards into index.html
 * Reads: window.PROJECTS_DATA (from js/projects-data.js, loaded first)
 * Target: #works-grid
 *
 * Called by script.js after DOM is ready.
 * No ES module syntax — classic <script> tag compatible.
 */

(function () {

  /**
   * Build one carousel slide element.
   * @param {Object} slide - {bg, icon, label} or {img, alt}
   */
  function buildSlide(slide) {
    var div = document.createElement('div');
    div.className = 'carousel-slide';
    if (slide.img) {
      var img = document.createElement('img');
      img.src = slide.img;
      img.alt = slide.alt || '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      div.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'work-placeholder';
      ph.style.background = slide.bg;
      ph.innerHTML = '<span class="ph-icon">' + slide.icon + '</span>'
                   + '<span class="ph-label">' + slide.label + '</span>';
      div.appendChild(ph);
    }
    return div;
  }

  /**
   * Build one complete work-card article element from project data.
   * @param {Object} p - project data object from PROJECTS_DATA
   */
  function buildCard(p) {
    var article = document.createElement('article');
    article.className = 'work-card';

    /* ── Media (carousel or single slide) ── */
    var mediaDiv = document.createElement('div');
    mediaDiv.className = 'work-media';

    var slides = p.carousel || [];
    if (slides.length > 1) {
      /* Multi-slide carousel */
      var carouselDiv = document.createElement('div');
      carouselDiv.className = 'work-carousel';
      carouselDiv.dataset.autoplay = String(p.autoplay || 5000);

      var track = document.createElement('div');
      track.className = 'carousel-track';
      slides.forEach(function (s) { track.appendChild(buildSlide(s)); });
      carouselDiv.appendChild(track);

      var prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-prev';
      prevBtn.setAttribute('aria-label', 'Previous slide');
      prevBtn.textContent = '‹';
      carouselDiv.appendChild(prevBtn);

      var nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-next';
      nextBtn.setAttribute('aria-label', 'Next slide');
      nextBtn.textContent = '›';
      carouselDiv.appendChild(nextBtn);

      var dotsDiv = document.createElement('div');
      dotsDiv.className = 'carousel-dots';
      carouselDiv.appendChild(dotsDiv);

      mediaDiv.appendChild(carouselDiv);
    } else {
      /* Single image / placeholder */
      var single = slides[0] || { bg: 'var(--dark)', icon: '📁', label: p.shortTitle };
      mediaDiv.appendChild(buildSlide(single).firstChild); /* unwrap the outer div */
    }

    article.appendChild(mediaDiv);

    /* ── Content ── */
    var contentDiv = document.createElement('div');
    contentDiv.className = 'work-content';

    /* Badges */
    var metaDiv = document.createElement('div');
    metaDiv.className = 'work-meta';
    (p.cardBadges || []).forEach(function (b) {
      var span = document.createElement('span');
      span.className = 'work-badge' + (b.type ? ' badge-' + b.type : '');
      span.textContent = b.label;
      metaDiv.appendChild(span);
    });
    contentDiv.appendChild(metaDiv);

    /* Title */
    var h3 = document.createElement('h3');
    h3.className = 'work-title';
    h3.textContent = p.shortTitle;
    contentDiv.appendChild(h3);

    /* Chips */
    var chipsDiv = document.createElement('div');
    chipsDiv.className = 'work-chips';
    (p.chips || []).forEach(function (c) {
      var span = document.createElement('span');
      span.className = 'work-chip';
      span.textContent = c;
      chipsDiv.appendChild(span);
    });
    contentDiv.appendChild(chipsDiv);

    /* Description */
    var desc = document.createElement('p');
    desc.className = 'work-desc';
    desc.innerHTML = p.cardDesc || '';
    contentDiv.appendChild(desc);

    /* Action buttons */
    var actionsDiv = document.createElement('div');
    actionsDiv.className = 'work-actions';

    var primaryBtn = document.createElement('a');
    primaryBtn.href = p.detailLink;
    primaryBtn.className = 'work-btn work-btn-primary';
    primaryBtn.textContent = '📖 View Details';
    /* Track project card details click */
    (function (title, link) {
      primaryBtn.addEventListener('click', function () {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('project_card_click', title, { button: 'details', href: link });
        }
      });
    })(p.shortTitle, p.detailLink);
    actionsDiv.appendChild(primaryBtn);

    if (p.liveLink) {
      var secondaryBtn = document.createElement('a');
      secondaryBtn.href = p.liveLink.href;
      secondaryBtn.className = 'work-btn work-btn-secondary';
      secondaryBtn.innerHTML = p.liveLink.label;
      if (p.liveLink.href.startsWith('http')) {
        secondaryBtn.target = '_blank';
        secondaryBtn.rel = 'noopener';
      }
      /* Track project card live link click */
      (function (title, href) {
        secondaryBtn.addEventListener('click', function () {
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('project_card_click', title, { button: 'live', href: href });
          }
        });
      })(p.shortTitle, p.liveLink.href);
      actionsDiv.appendChild(secondaryBtn);
    }

    contentDiv.appendChild(actionsDiv);
    article.appendChild(contentDiv);

    return article;
  }

  /**
   * Entry point — populate #works-grid.
   * Called from script.js.
   */
  window.renderProjectsGrid = function () {
    var grid = document.getElementById('works-grid');
    if (!grid) return;

    var data = window.PROJECTS_DATA;
    if (!data || !data.length) return;

    /* Clear any existing content (safety) */
    grid.innerHTML = '';

    data.forEach(function (p) {
      grid.appendChild(buildCard(p));
    });

    /* Re-run carousel setup if interactions module is loaded */
    if (typeof window.setupCarousels === 'function') {
      window.setupCarousels();
    }
  };

})();
