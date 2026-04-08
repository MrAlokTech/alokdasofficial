/**
 * js/firebase-tracker.js — Portfolio Analytics via Firebase
 *
 * Strategy:
 *  1. Dynamically load Firebase Compat SDK (no ES modules — file:// safe)
 *  2. Sign in anonymously
 *  3. Create session doc in Firestore: Portfolio/sessions/{sessionId}
 *  4. Expose window.trackEvent(type, target, detail) for other modules
 *  5. Auto-track: page_view, scroll_depth, external_link clicks
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

  /* ── Compat SDK CDN URLs (v10 compat — global firebase.*) ── */
  var SDK_BASE = 'https://www.gstatic.com/firebasejs/10.12.2/';
  var SDK_SCRIPTS = [
    SDK_BASE + 'firebase-app-compat.js',
    SDK_BASE + 'firebase-auth-compat.js',
    SDK_BASE + 'firebase-firestore-compat.js'
  ];

  /* ── Internal state ── */
  var _db = null;
  var _uid = null;
  var _sessionId = null;
  var _sessionRef = null;
  var _ready = false;
  var _queue = [];   // Events queued before init completes

  /* ── Utility: generate session ID ── */
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  /* ── Utility: bot detection heuristics ── */
  function detectBot() {
    var signals = 0;
    try {
      if (navigator.webdriver === true) signals++;
      if (!navigator.languages || navigator.languages.length === 0) signals++;
      var ua = (navigator.userAgent || '').toLowerCase();
      if (/bot|crawl|spider|headless|phantom|selenium|puppeteer|playwright/.test(ua)) signals++;
      if (window.screen.width < 10 || window.screen.height < 10) signals++;
      /* Navigation Timing: very fast load = likely bot */
      if (window.performance && window.performance.timing) {
        var t = window.performance.timing;
        var loadTime = t.responseEnd - t.navigationStart;
        if (loadTime > 0 && loadTime < 100) signals++;
      }
    } catch (e) { /* ignore */ }
    return signals >= 2;
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

  /* ── Write an event to Firestore (append to events array) ── */
  function writeEvent(type, target, detail) {
    if (!_sessionRef || !_db) return;
    var event = {
      ts: new Date().toISOString(),   /* serverTimestamp() forbidden inside arrayUnion */
      type: type,
      target: target || null,
      detail: detail || null
    };
    _sessionRef.update({
      events: firebase.firestore.FieldValue.arrayUnion(event),
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (err) {
      /* Stale/cross-domain session — clear and start fresh */
      if (err.code === 'permission-denied' || err.code === 'not-found') {
        // console.warn('[Tracker] Stale session, resetting:', err.code);
        try { localStorage.removeItem('_pt_sid'); localStorage.removeItem('_pt_sts'); } catch (e) { }
        /* Re-create session and replay this event */
        _ready = false;
        _sessionRef = null;
        _queue.push({ type: type, target: target, detail: detail });
        _freshSession();
      } else {
        // console.warn('[Tracker] Event write failed:', err.message);
      }
    });
  }

  /* ── Flush queued events once SDK is ready ── */
  function flushQueue() {
    _queue.forEach(function (item) {
      writeEvent(item.type, item.target, item.detail);
    });
    _queue = [];
  }

  /* ── Public API ── */
  window.trackEvent = function (type, target, detail) {
    if (_ready) {
      writeEvent(type, target, detail);
    } else {
      _queue.push({ type: type, target: target, detail: detail });
    }
  };

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

  /* ── Auto: external link click tracking ── */
  function setupExternalLinkTracking() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a');
      if (!anchor) return;
      var href = anchor.getAttribute('href') || '';
      if (
        anchor.target === '_blank' ||
        (href.startsWith('http') && !href.includes(window.location.hostname))
      ) {
        window.trackEvent('external_link', anchor.textContent.trim().slice(0, 60), { href: href });
      }
    });
  }

  /* ── Auto: CTA / resume / hero button tracking ── */
  function setupCTATracking() {
    var ctaIds = ['cta-btn', 'secondary-cta-btn', 'resume-btn'];
    ctaIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function () {
          window.trackEvent('cta_click', id, { label: el.textContent.trim().slice(0, 60) });
        });
      }
    });
    /* Hero explore button */
    document.querySelectorAll('.hero-primary-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.trackEvent('cta_click', 'hero_explore', { label: btn.textContent.trim().slice(0, 60) });
      });
    });
  }

  /* ── Session persistence keys ── */
  var SESSION_ID_KEY = '_pt_sid';
  var SESSION_TS_KEY = '_pt_sts';
  var SESSION_TTL = 30 * 60 * 1000; /* 30 minutes inactivity = new session */

  /* ── Read / write session from localStorage ── */
  function getSavedSession() {
    try {
      var sid = localStorage.getItem(SESSION_ID_KEY);
      var ts = parseInt(localStorage.getItem(SESSION_TS_KEY) || '0', 10);
      if (sid && (Date.now() - ts) < SESSION_TTL) return sid;
    } catch (e) { /* private browsing may block localStorage */ }
    return null;
  }

  function saveSession(sid) {
    try {
      localStorage.setItem(SESSION_ID_KEY, sid);
      localStorage.setItem(SESSION_TS_KEY, String(Date.now()));
    } catch (e) { /* ignore */ }
  }

  function touchSession() {
    try { localStorage.setItem(SESSION_TS_KEY, String(Date.now())); } catch (e) { /* ignore */ }
  }

  /* ── Create a brand-new session doc (used on first visit and after stale reset) ── */
  function _freshSession(uid, ctx, isBot) {
    var sid = genId();
    _sessionRef = _db.collection('Portfolio').doc(sid);
    _sessionRef.set({
      uid: uid,
      sessionId: sid,
      startedAt: firebase.firestore.FieldValue.serverTimestamp(),
      domain: ctx.domain,
      entryUrl: ctx.url,
      entryPath: ctx.path,
      pageTitle: ctx.title,
      referrer: ctx.referrer,
      ua: navigator.userAgent,
      suspectedBot: isBot || false,
      language: navigator.language || null,
      screen: {
        w: window.screen.width,
        h: window.screen.height,
        dpr: window.devicePixelRatio || 1
      },
      events: []
    }).then(function () {
      saveSession(sid);
      _ready = true;
      // console.log('[Tracker] New session created:', sid);
      writeEvent('page_view', ctx.path, {
        url: ctx.url,
        domain: ctx.domain,
        referrer: ctx.referrer,
        title: ctx.title
      });
      flushQueue();
      setupScrollTracking();
      setupExternalLinkTracking();
      setupCTATracking();
    }).catch(function (err) {
      // console.warn('[Tracker] Session create failed:', err.message);
    });
  }

  /* ── Initialise Firebase + create/resume session ── */
  function initTracker() {
    try {
      /* Prevent double-init */
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }

      _db = firebase.firestore();
      var auth = firebase.auth();

      auth.signInAnonymously().then(function (result) {
        _uid = result.user.uid;

        var ctx = getPageContext();
        var isBot = detectBot();
        var savedSid = getSavedSession();

        if (savedSid) {
          /* ── RESUME existing session ── */
          _sessionId = savedSid;
          _sessionRef = _db.collection('Portfolio').doc(_sessionId);
          _ready = true;
          touchSession();

          // console.log('[Tracker] Session resumed:', _sessionId, '| Page:', ctx.path);

          /* Just log the new page view — no new doc created */
          writeEvent('page_view', ctx.path, {
            url: ctx.url,
            domain: ctx.domain,
            referrer: ctx.referrer,
            title: ctx.title
          });

          flushQueue();
          setupScrollTracking();
          setupExternalLinkTracking();
          setupCTATracking();

        } else {
          /* ── CREATE new session ── */
          _freshSession(_uid, ctx, isBot);
        }

      }).catch(function (err) {
        // console.warn('[Tracker] Anonymous auth failed:', err.message);
      });

    } catch (err) {
      // console.warn('[Tracker] Init error:', err.message);
    }
  }

  /* ── Dynamically load Firebase Compat SDK scripts ── */
  function loadScripts(urls, callback) {
    var loaded = 0;
    urls.forEach(function (url) {
      var s = document.createElement('script');
      s.src = url;
      s.async = false; /* Keep load order */
      s.onload = function () {
        loaded++;
        if (loaded === urls.length) callback();
      };
      s.onerror = function () {
        // console.warn('[Tracker] Failed to load SDK:', url);
        loaded++;
        if (loaded === urls.length) callback();
      };
      document.head.appendChild(s);
    });
  }

  /* ── Bootstrap ── */
  loadScripts(SDK_SCRIPTS, function () {
    if (typeof firebase === 'undefined') {
      // console.warn('[Tracker] Firebase SDK unavailable — tracking disabled.');
      /* Provide no-op so other modules don't error */
      window.trackEvent = function () { };
      return;
    }
    initTracker();
  });

})();
