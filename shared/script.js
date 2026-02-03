/* ================================================================
   ALOK DAS PORTFOLIO - SHARED UTILITIES
   Common JavaScript functions used across all apps
   ================================================================ */

// ==================== COMPONENT LOADERS ====================

/**
 * Load Header Component
 */
async function loadHeader() {
    try {
        const response = await fetch('/shared/components/header.html');
        if (!response.ok) throw new Error('Failed to load header');
        const html = await response.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = html;
            initializeNavigation();
        }
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

/**
 * Load Footer Component
 */
async function loadFooter() {
    try {
        const response = await fetch('/shared/components/footer.html');
        if (!response.ok) throw new Error('Failed to load footer');
        const html = await response.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = html;
            initializeClock();
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});

// ==================== NAVIGATION ====================

/**
 * Initialize Navigation Toggle and Active Links
 */
function initializeNavigation() {
    const navToggler = document.querySelector('.nav-toggler');

    if (navToggler) {
        navToggler.addEventListener('click', toggleNavbar);
    }

    // Handle smooth scrolling for hash links
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('link-item') && e.target.hash !== '') {
            // Only handle if we're on the home page
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                e.preventDefault();
                const target = document.querySelector(e.target.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Close navbar on mobile after clicking
                    if (window.innerWidth <= 768) {
                        toggleNavbar();
                    }
                }
            }
        }
    });
}

/**
 * Toggle Mobile Navigation
 */
function toggleNavbar() {
    const header = document.querySelector('.header');
    const body = document.body;

    if (header) {
        header.classList.toggle('active');
        body.classList.toggle('hide-scrolling');
    }
}

// ==================== CLOCK ====================

/**
 * Display Real-time Clock
 */
function showTime() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    const format = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    if (hours > 12) {
        hours = hours - 12;
    }
    if (hours === 0) {
        hours = 12;
    }

    // Add leading zeros
    hours = addZero(hours);
    minutes = addZero(minutes);
    seconds = addZero(seconds);

    clockElement.innerHTML = `😎 ${hours}:${minutes}:${seconds} ${format}`;
}

function addZero(time) {
    return time < 10 ? '0' + time : time;
}

function initializeClock() {
    // Update year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `2021-${currentYear}`;
    }

    // Start clock
    showTime();
    setInterval(showTime, 1000);
}

// ==================== DOCUMENT TITLE CHANGER ====================

/**
 * Change document title when tab loses focus
 */
let originalDocTitle = document.title;

window.addEventListener('blur', () => {
    document.title = "Play game instead! 😉";
});

window.addEventListener('focus', () => {
    document.title = originalDocTitle;
});

// ==================== PRELOADER ====================

/**
 * Hide preloader when page loads
 */
window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// ==================== SCROLL TO TOP ====================

/**
 * Scroll to top button (optional utility)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==================== FORM UTILITIES ====================

/**
 * Simple form validation
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show toast notification (simple implementation)
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success' ? 'var(--success)' :
            type === 'error' ? 'var(--error)' : 'var(--info)',
        color: 'var(--white)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease'
    });

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== LAZY LOADING IMAGES ====================

/**
 * Lazy load images for better performance
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}

// ==================== CONSOLE EASTER EGG ====================

console.log('%c👋 Hello There!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cLooking at the code? Feel free to reach out!', 'font-size: 14px; color: #8b5cf6;');
console.log('%c🌐 https://www.alokdasofficial.in', 'font-size: 12px; color: #a8a8b3;');

// ==================== EXPORTS (for module usage) ====================

// If using as a module, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadHeader,
        loadFooter,
        toggleNavbar,
        showToast,
        validateEmail,
        scrollToTop
    };
}