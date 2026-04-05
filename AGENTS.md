# AGENTS.md — AI Context File

> **Read this first.** This file gives AI coding assistants (Claude, Copilot, Cursor,
> Gemini, etc.) instant, complete context to work on this project correctly without
> asking redundant questions or making architectural mistakes.

---

## Project in One Sentence

`alokdasofficial.in` is a **static, no-build-step, comic-book-themed splash page**
that shows a preloader → hero with countdown → teaser panels, then auto-redirects to
`me.alokdasofficial.in`. It also hosts a **printable resume** at `/resume` and a **404
fallback page**.

---

## Critical Constraints (Never Break These)

| Constraint | Why |
|---|---|
| **No build tool / bundler** | Deploys as raw static files to Firebase or GitHub Pages |
| **No framework** (React, Vue, etc.) | Pure HTML + CSS + Vanilla JS only |
| **No inline styles** | All styles live in `css/` component files |
| **No hardcoded values** | Colours, URLs, timing → `css/tokens.css` or `js/config.js` |
| **No `@media` rules in component CSS** | All responsive rules go in `css/responsive.css` only |
| **No logic in `script.js`** | `script.js` is orchestrator-only; logic lives in `js/*.js` modules |
| **No `type="module"` on scripts** | Classic `<script>` tags work on both `file://` (offline) and `http://`. ES modules are blocked on `file://` by CORS |
| **No `fetch()` for HTML sections** | HTML sections are inlined in `index.html`. `fetch()` is blocked on `file://`. The `html/` partials are reference files only — keep them in sync with `index.html` |
| **404.html must be self-contained** | Embedded `<style>` only — no external CSS link (path-independent) |
| **Resume print styles in resume.css** | `@media print` block resets ALL comic styles to clean Arial |
| **Resume CSS uses absolute path** | `href="/resume/resume.css"` — relative path breaks when URL has no trailing slash |

---

## File Map (Complete)

```
/
├── index.html          Shell only. Contains: <head>, inline preloader, 4 bursts,
│                       halftone div, 3 mount point divs, <script type="module">
│
├── style.css           @import chain ONLY. Order: tokens→base→bursts→preloader
│                       →hero→teaser→footer→responsive.
│
├── script.js           Async IIFE. Sequence:
│                         1. loadAllSections()  → fills mount divs via fetch
│                         2. setupCTA/Panels/Bursts/Keys() → wire interactions
│                         3. initPreloader(cb) → preloader exits → cb()
│                         4. cb: startTypewriter() + setTimeout(startCountdown,300)
│
├── 404.html            Standalone. Embedded <style>. No external deps.
│                       Has: #btn-home → "/" and #btn-resume → "/resume"
│
├── firebase.json       cleanUrls:true, /resume rewrite, security headers.
│
├── .nojekyll           Empty file. Prevents GitHub Pages Jekyll processing.
│
├── css/
│   ├── tokens.css      :root with ALL design tokens. Single source of truth.
│   ├── base.css        Reset + body + .halftone-bg + @keyframes bounceIn/slideUp
│   ├── bursts.css      .burst base + .burst-1 through .burst-4 + @keyframes floatSpin
│   ├── preloader.css   .preloader + .slide-away + .pl-letter + body.page-exit
│   ├── hero.css        .hero-panel + .hero-title + .speech-bubble + .redirect-box
│   │                   + .countdown-display + .cta-btn + .resume-btn
│   ├── teaser.css      .teaser-section + .panels-grid + .comic-panel + .secondary-cta
│   ├── footer.css      .comic-footer + .footer-strip
│   └── responsive.css  ALL @media queries. Breakpoints: 768px / 600px / 400px
│
├── js/
│   ├── config.js       Exports: REDIRECT_URL, TOTAL_SECONDS, PRELOADER_DURATION,
│   │                            TYPEWRITER_LINES
│   ├── loader.js       Exports: loadAllSections(). Reads SECTIONS array internally.
│   │                   To add section: push {mountId, path} to SECTIONS.
│   ├── preloader.js    Exports: initPreloader(onReady). Reads PRELOADER_DURATION.
│   ├── typewriter.js   Exports: startTypewriter(), stopTypewriter()
│   │                   Reads: TYPEWRITER_LINES. Targets: #typewriter-text
│   ├── countdown.js    Exports: startCountdown(), doRedirect(), isRedirecting
│   │                   Reads: REDIRECT_URL, TOTAL_SECONDS. stopTypewriter on redirect.
│   │                   Targets: #countdown-number, #progress-fill, #countdown-secondary
│   └── interactions.js Exports: setupCTA(), setupPanelAnimations(),
│                                setupBursts(), setupPanelKeys()
│                       CTA IDs: #cta-btn (hero), #secondary-cta-btn (teaser)
│
├── html/
│   ├── hero.html       <main class="hero-panel" id="hero"> ... </main>
│   │                   Contains: .issue-tag, .hero-title, .speech-bubble,
│   │                             .hero-sub, .redirect-box, .resume-btn
│   ├── teaser.html     <section class="teaser-section" id="teaser"> ...
│   │                   Contains: 3× .comic-panel, .secondary-cta-wrap
│   └── footer.html     <footer class="comic-footer"> ...
│
└── resume/
    ├── index.html      Standalone resume. Does NOT use js/loader.js.
    │                   Sections: header, .r-main (sidebar + content)
    └── resume.css      Screen: comic styles. @media print: clean Arial A4.
```

---

## Design Tokens Summary

All in `css/tokens.css`. Use these variable names everywhere:

| Token | Value | Usage |
|---|---|---|
| `--yellow`  | `#FFE600` | Primary background, CTA, accent |
| `--pink`    | `#FF2D6B` | Accents, urgency, panel strip |
| `--blue`    | `#00C2FF` | Progress fills, teaser panel |
| `--purple`  | `#6A0DAD` | Teaser bg, resume sidebar, buttons |
| `--ink`     | `#0D0D0D` | Borders, text, shadows |
| `--cream`   | `#FFFEF0` | Light backgrounds, white text |
| `--dark`    | `#1A0030` | Progress track, resume sidebar |
| `--border-thin` | `3px solid var(--ink)` | Standard element borders |
| `--border-thick` | `5px solid var(--ink)` | Hero panel, section separators |
| `--shadow-pop` | `6px 6px 0 var(--ink)` | Standard comic pop shadow |
| `--font-comic` | `'Bangers', cursive` | Headings, titles, badges |
| `--font-body` | `'Comic Neue', cursive` | Body text, descriptions |
| `--radius` | `12px` | Standard border-radius |

---

## How Sections Load (Data Flow)

```
Browser loads index.html
  └── <link> style.css  → @imports all css/ modules (parallel)
  └── preloader visible immediately (inline HTML in index.html)
  └── <script type="module"> script.js deferred

script.js runs (DOM ready):
  └── body.classList.add('preloading')  → hides content
  └── loadAllSections()
        ├── fetch('html/hero.html')   → replaces #section-hero
        ├── fetch('html/teaser.html') → replaces #section-teaser
        └── fetch('html/footer.html') → replaces #section-footer
  └── setupCTA() + setupPanelAnimations() + setupBursts() + setupPanelKeys()
  └── initPreloader(onReady)
        └── after PRELOADER_DURATION ms:
              preloader.classList.add('slide-away')  → CSS transition upward
              on transitionend → body.classList.remove('preloading')
              → onReady() called:
                    startTypewriter()    → targets #typewriter-text
                    setTimeout(() => startCountdown(), 300)
                          └── ticks every 1s → updates #countdown-number,
                                               #progress-fill,
                                               #countdown-secondary
                          └── at 0 → doRedirect():
                                body.page-exit → CSS exitSlideUp animation
                                → window.location.href = REDIRECT_URL
```

---

## Key DOM IDs Reference

| ID | Element | Set by |
|---|---|---|
| `preloader` | Preloader overlay | `index.html` (inline) |
| `section-hero` | Mount point → replaced by `hero.html` | `index.html` |
| `section-teaser` | Mount point → replaced by `teaser.html` | `index.html` |
| `section-footer` | Mount point → replaced by `footer.html` | `index.html` |
| `speech-bubble` | Typewriter container | `html/hero.html` |
| `typewriter-text` | `<span>` typed into | `html/hero.html` |
| `countdown-number` | Big timer digit | `html/hero.html` |
| `progress-fill` | Growing progress bar | `html/hero.html` |
| `cta-btn` | Instant redirect button (hero) | `html/hero.html` |
| `resume-btn` | Link to /resume | `html/hero.html` |
| `countdown-secondary` | Mirror display in teaser | `html/teaser.html` |
| `secondary-cta-btn` | Redirect button (teaser) | `html/teaser.html` |

---

## How to Add a New Section

1. **Create HTML partial**: `html/my-section.html`
   - Wrap in a semantic element: `<section class="my-section" id="my-section">`
2. **Add mount point** to `index.html`:  
   `<div id="section-my-section"></div>`  
   (place in desired DOM order between existing mount points)
3. **Register in loader**: add to `SECTIONS` array in `js/loader.js`:  
   `{ mountId: 'section-my-section', path: 'html/my-section.html' }`
4. **Create CSS module**: `css/my-section.css`  
   - No `@media` rules here — add those to `css/responsive.css`
5. **Import CSS**: add `@import url('css/my-section.css');` to `style.css`  
   (before `responsive.css`)
6. **Add interactions** (if needed): export a `setupMySection()` from `js/interactions.js`  
   and call it in `script.js`

---

## Resume Sub-site Notes

- `resume/index.html` is **fully standalone** — it does NOT use `js/loader.js`
- It links to `resume/resume.css` (relative path from resume/)
- `@media print` in `resume.css` resets ALL comic styles → clean Arial A4
- The "Save / Print" button calls `window.print()`
- `.no-print` class hides navigation buttons during printing
- Content is Chemistry/QC Analyst focused; Flutter project is secondary/differentiator

---

## Deployment Checklist

- [ ] Test locally with HTTP server (not `file://`)
- [ ] `firebase.json` is in root (for Firebase deploy)
- [ ] `.nojekyll` is in root (for GitHub Pages)
- [ ] `404.html` is in root
- [ ] `resume/index.html` and `resume/resume.css` exist
- [ ] All `html/*.html` partials exist
- [ ] No hardcoded values outside `config.js` / `tokens.css`
