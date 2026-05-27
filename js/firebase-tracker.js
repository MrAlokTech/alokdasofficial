/**
 * js/firebase-tracker.js — Portfolio Analytics via Firebase
 *
 * Strategy:
 *  1. Set up all browser event listeners immediately on load (pure JS, no deps).
 *  2. Queue all actions (page_view, scroll, click, copy, inspect) in an in-memory buffer.
 *  3. Monitor human interaction signals (mousemove, keydown, scroll, touch).
 *  4. **Lazy Auth**: Load Firebase SDK and sign in anonymous user ONLY when human verified.
 *     - Keeps Firebase Auth 100% clean of crawlers, scraper bots, and spiders.
 *     - Delivers faster page loads and SEO benefits to bots.
 *  5. **Event Batching**: Buffers events and writes in bulk to Firestore:
 *     - Every 10 seconds (if queue has items).
 *     - Instantly when tab is hidden or minimized.
 *     - Instantly on page navigation or browser exit.
 *     - Reduces database writes by up to 90%.
 *
 * Classic <script> tag — NO type="module".
 * Depends on nothing. Load before script.js.
 */

(function () {
  'use strict';

  /* ── Firebase project config ── */
  var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyAaotynXqso2-gviIfaDfnYpWpZ_D4KPVc',
    authDomain: 'alokdasofficial-69f96.firebaseapp.com',
    projectId: 'alokdasofficial',
    storageBucket: 'alokdasofficial.firebasestorage.app',
    messagingSenderId: '315463239297',
    appId: '1:315463239297:web:930a164891d386583f2f80',
    measurementId: 'G-XMBQM46W16'
  };

  /* ── Compat SDK CDN URLs ── */
  var SDK_BASE = 'https://www.gstatic.com/firebasejs/10.12.2/';
  var SDK_SCRIPTS = [
    SDK_BASE + 'firebase-app-compat.js',
    SDK_BASE + 'firebase-auth-compat.js',
    SDK_BASE + 'firebase-firestore-compat.js'
  ];

  /* ── Session persistence keys ── */
  var SESSION_ID_KEY = '_pt_sid';
  var SESSION_TS_KEY = '_pt_sts';
  var SESSION_TTL = 30 * 60 * 1000; /* 30 minutes inactivity = new session */

  /* ── Internal state ── */
  var _db = null;
  var _uid = null;
  var _sessionId = null;
  var _sessionRef = null;
  var _firebaseLoading = false;
  var _firebaseReady = false;
  var _bufferedEvents = [];
  var _flushInterval = null;

  /* ── Human signals tracking ── */
  var _signals = {
    mouse: 0,
    keys: 0,
    scrolls: 0,
    touches: 0,
    isHuman: false
  };

  /* ── Utility: generate session ID ── */
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  /* ── Utility: get page context ── */
  function getPageContext() {
    return {
      url: window.location.href,
      path: window.location.pathname,
      domain: window.location.hostname,
      referrer: document.referrer || null,
      title: document.title || null
    };
  }

  /* ── Event Queue & Batch-Write Telemetry ── */
  window.trackEvent = function (type, target, detail) {
    var event = {
      ts: new Date().toISOString(),
      type: type,
      target: target || null,
      detail: detail || null
    };
    _bufferedEvents.push(event);

    // If human is verified but firebase is loading/ready, flush triggers will run in due time
  };

  /* ── Dynamic Flush Queue ── */
  function flushEvents() {
    if (!_sessionRef || !_db || !_firebaseReady || _bufferedEvents.length === 0) return;

    var eventsToWrite = _bufferedEvents.slice();
    _bufferedEvents = []; /* Clear local buffer immediately to prevent duplicate writes during async delay */

    _sessionRef.update({
      events: firebase.firestore.FieldValue.arrayUnion.apply(null, eventsToWrite),
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (err) {
      /* Restore items on failure and reset stale/expired sessions */
      _bufferedEvents = eventsToWrite.concat(_bufferedEvents);
      if (err.code === 'permission-denied' || err.code === 'not-found') {
        try { localStorage.removeItem(SESSION_ID_KEY); localStorage.removeItem(SESSION_TS_KEY); } catch (e) { }
        _firebaseReady = false;
        _sessionRef = null;
        initTracker();
      }
    });
  }

  /* ── Periodic & Exit Flush Triggers ── */
  function setupPeriodicFlush() {
    if (_flushInterval) clearInterval(_flushInterval);
    _flushInterval = setInterval(function () {
      flushEvents();
    }, 10000); /* Batch write every 10 seconds */
  }

  function setupExitFlush() {
    /* Flush when tab is hidden or minimized */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        flushEvents();
      }
    });

    /* Flush when user is exiting/closing the tab */
    window.addEventListener('pagehide', function () {
      flushEvents();
    });
    window.addEventListener('beforeunload', function () {
      flushEvents();
    });
  }

  /* ── Dynamic Behavioral Human Verification (Lazy Auth) ── */
  function confirmHuman() {
    if (_signals.isHuman || _firebaseLoading) return;
    _signals.isHuman = true;
    _firebaseLoading = true;

    /* Load Firebase SDK and sign in ONLY for real human visitors */
    loadScripts(SDK_SCRIPTS, function () {
      if (typeof firebase === 'undefined') {
        _firebaseLoading = false;
        return;
      }
      initTracker();
    });
  }

  function setupBehavioralTracking() {
    window.addEventListener('mousemove', function () {
      _signals.mouse++;
      if (_signals.mouse > 5) confirmHuman();
    }, { passive: true });

    window.addEventListener('keydown', function () {
      _signals.keys++;
      if (_signals.keys > 1) confirmHuman();
    }, { passive: true });

    window.addEventListener('touchstart', function () {
      _signals.touches++;
      if (_signals.touches > 0) confirmHuman();
    }, { passive: true });

    window.addEventListener('scroll', function () {
      _signals.scrolls++;
      if (_signals.scrolls > 2) confirmHuman();
    }, { passive: true });
  }

  /* ── DevTools & Code Inspection Telemetry ── */
  function setupDevToolsTracking() {
    document.addEventListener('contextmenu', function (e) {
      window.trackEvent('inspect_attempt', 'context_menu', {
        x: e.clientX,
        y: e.clientY,
        targetTag: e.target.tagName.toLowerCase(),
        targetId: e.target.id || null,
        targetClass: e.target.className || null
      });
    });

    window.addEventListener('keydown', function (e) {
      var key = e.key;
      var ctrl = e.ctrlKey || e.metaKey;
      var shift = e.shiftKey;

      if (
        key === 'F12' ||
        (ctrl && shift && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) ||
        (ctrl && (key === 'U' || key === 'u' || key === 'S' || key === 's'))
      ) {
        window.trackEvent('inspect_attempt', 'developer_tools_hotkey', {
          key: key,
          ctrl: ctrl,
          shift: shift
        });
      }
    });
  }

  /* ── Plagiarism & Copying Telemetry ── */
  function setupCopyTracking() {
    document.addEventListener('copy', function () {
      var selectedText = '';
      if (window.getSelection) {
        selectedText = window.getSelection().toString();
      } else if (document.selection && document.selection.type !== 'Control') {
        selectedText = document.selection.createRange().text;
      }
      
      if (selectedText.length > 0) {
        window.trackEvent('text_copy', 'document', {
          textLength: selectedText.length,
          snippet: selectedText.slice(0, 150).trim()
        });
      }
    });
  }

  /* ── Auto: scroll depth tracking ── */
  function setupScrollTracking() {
    var milestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY + window.innerHeight;
      var total = document.documentElement.scrollHeight;
      var pct = Math.round((scrolled / total) * 100);
      [25, 50, 75, 100].forEach(function (m) {
        if (!milestones[m] && pct >= m) {
          milestones[m] = true;
          window.trackEvent('scroll_depth', 'page', { percent: m });
        }
      });
    }, { passive: true });
  }

  /* ── Omnipresent Click Engagements Tracking ── */
  function setupClickTracking() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a, button, input[type="submit"], input[type="button"]');
      if (!anchor) return;

      var tag = anchor.tagName.toLowerCase();
      var id = anchor.id || '';
      var className = anchor.className || '';
      var href = anchor.getAttribute('href') || '';
      var text = anchor.textContent ? anchor.textContent.trim().slice(0, 60) : '';

      /* Skip validation UI elements to avoid dynamic popover noise */
      if (className.indexOf('challenge-') !== -1 || id === 'phone-reveal-btn') return;

      window.trackEvent('click_engagement', tag + (id ? '#' + id : ''), {
        text: text,
        id: id,
        class: className,
        href: href
      });
    });
  }

  /* ── Interactive Input Fields Telemetry ── */
  function setupFormFieldsTracking() {
    document.addEventListener('focusin', function (e) {
      var input = e.target.closest('input, textarea, select');
      if (!input) return;

      var id = input.id || '';
      var name = input.name || '';
      var type = input.type || '';

      window.trackEvent('form_focus', input.tagName.toLowerCase() + (id ? '#' + id : ''), {
        id: id,
        name: name,
        type: type
      });
    });

    document.addEventListener('change', function (e) {
      var input = e.target.closest('input, textarea, select');
      if (!input || input.type === 'password') return;

      var id = input.id || '';
      var name = input.name || '';
      var type = input.type || '';
      var valueLength = input.value ? input.value.length : 0;

      window.trackEvent('form_change', input.tagName.toLowerCase() + (id ? '#' + id : ''), {
        id: id,
        name: name,
        type: type,
        valueLength: valueLength
      });
    });
  }

  /* ── Browser Tab Visibility Telemetry ── */
  function setupVisibilityTracking() {
    document.addEventListener('visibilitychange', function () {
      var state = document.visibilityState;
      window.trackEvent('visibility_change', 'document', {
        state: state
      });
    });
  }

  /* ── Session recovery storage helpers ── */
  function getSavedSession() {
    try {
      var sid = localStorage.getItem(SESSION_ID_KEY);
      var ts = parseInt(localStorage.getItem(SESSION_TS_KEY) || '0', 10);
      if (sid && (Date.now() - ts) < SESSION_TTL) return sid;
    } catch (e) { }
    return null;
  }

  function saveSession(sid) {
    try {
      localStorage.setItem(SESSION_ID_KEY, sid);
      localStorage.setItem(SESSION_TS_KEY, String(Date.now()));
    } catch (e) { }
  }

  function touchSession() {
    try { localStorage.setItem(SESSION_TS_KEY, String(Date.now())); } catch (e) { }
  }

  /* ── Initialise Firebase + Session bindings ── */
  function initTracker() {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }

      _db = firebase.firestore();
      var auth = firebase.auth();

      auth.signInAnonymously().then(function (result) {
        _uid = result.user.uid;
        _firebaseReady = true;

        var ctx = getPageContext();
        var savedSid = getSavedSession();

        if (savedSid) {
          /* RESUME Session */
          _sessionId = savedSid;
          _sessionRef = _db.collection('Portfolio').doc(_sessionId);
          
          _sessionRef.update({
            isHumanConfirmed: true,
            suspectedBot: false,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
          }).catch(function () {});

          touchSession();
          flushEvents();
          setupPeriodicFlush();
        } else {
          /* CREATE Session */
          var sid = genId();
          _sessionId = sid;
          _sessionRef = _db.collection('Portfolio').doc(_sessionId);

          _sessionRef.set({
            uid: _uid,
            sessionId: _sessionId,
            startedAt: firebase.firestore.FieldValue.serverTimestamp(),
            domain: ctx.domain,
            entryUrl: ctx.url,
            entryPath: ctx.path,
            pageTitle: ctx.title,
            referrer: ctx.referrer,
            ua: navigator.userAgent,
            suspectedBot: false,
            isHumanConfirmed: true,
            language: navigator.language || null,
            screen: {
              w: window.screen.width,
              h: window.screen.height,
              dpr: window.devicePixelRatio || 1,
              viewportW: window.innerWidth,
              viewportH: window.innerHeight
            },
            timezone: Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : null,
            events: []
          }).then(function () {
            saveSession(_sessionId);
            flushEvents();
            setupPeriodicFlush();
          }).catch(function () {});
        }

      }).catch(function (err) {
        _signals.isHuman = false;
        _firebaseLoading = false;
      });

    } catch (err) {
      _signals.isHuman = false;
      _firebaseLoading = false;
    }
  }

  /* ── Dynamic Loader ── */
  function loadScripts(urls, callback) {
    var loaded = 0;
    urls.forEach(function (url) {
      var s = document.createElement('script');
      s.src = url;
      s.async = false;
      s.onload = function () {
        loaded++;
        if (loaded === urls.length) callback();
      };
      s.onerror = function () {
        loaded++;
        if (loaded === urls.length) callback();
      };
      document.head.appendChild(s);
    });
  }

  /* ── Start telemetries on page load ── */
  (function bootstrap() {
    // 1. Log initial page view to buffer
    var ctx = getPageContext();
    window.trackEvent('page_view', ctx.path, {
      url: ctx.url,
      domain: ctx.domain,
      referrer: ctx.referrer,
      title: ctx.title
    });

    // 2. Wire core listeners
    setupScrollTracking();
    setupClickTracking();
    setupFormFieldsTracking();
    setupVisibilityTracking();
    setupBehavioralTracking();
    setupDevToolsTracking();
    setupCopyTracking();
    setupExitFlush();
  })();

})();
