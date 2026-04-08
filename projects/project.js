/**
 * project.js — Shared script for project detail pages
 * Classic IIFE. No external dependencies.
 * Handles the gallery carousel on each project page.
 */

(function () {

  /* ── Gallery Carousel ── */
  document.querySelectorAll('.proj-gallery').forEach(function (gallery) {
    var track    = gallery.querySelector('.g-track');
    var slides   = gallery.querySelectorAll('.g-slide');
    var prevBtn  = gallery.querySelector('.g-prev');
    var nextBtn  = gallery.querySelector('.g-next');
    var dotsWrap = gallery.querySelector('.g-dots');

    if (!track || slides.length === 0) return;

    if (slides.length <= 1) {
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
    gallery.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });

    /* Auto-advance every 5s */
    setInterval(function () { goTo(current + 1); }, 5000);
  });

})();
