document.addEventListener('DOMContentLoaded', () => {
    /* ── UNIVERSAL THEME SETUP ── */
    // Uses a shared key so the theme persists across all your mini-apps
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

    // Initialize theme on page load
    setTheme();

    /* ── SHARED PRIVACY MODAL LOGIC ── */
    const openPrivacyBtn = document.getElementById('openPrivacy');
    const closePrivacyBtn = document.getElementById('closePrivacy');
    const privacyOverlay = document.getElementById('privacyOverlay');

    if (openPrivacyBtn && closePrivacyBtn && privacyOverlay) {
        openPrivacyBtn.addEventListener('click', () => {
            privacyOverlay.classList.add('open');
        });

        closePrivacyBtn.addEventListener('click', () => {
            privacyOverlay.classList.remove('open');
        });

        privacyOverlay.addEventListener('click', (e) => {
            if (e.target === privacyOverlay) {
                privacyOverlay.classList.remove('open');
            }
        });
    }
});