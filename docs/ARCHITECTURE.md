# Architecture

**Product:** alokdasofficial.in  
**Version:** 1.0

---

## Overview

This is a **zero-build, static site** — no npm, no bundler, no framework.
It uses:
- **CSS `@import`** for modular stylesheet composition
- **ES Modules** (`type="module"`) for modular JavaScript
- **`fetch()`** for runtime HTML partial injection

All three entry points (`index.html`, `style.css`, `script.js`) are intentionally
**thin** — they delegate to files in `css/`, `js/`, and `html/`.

---

## Module Dependency Graph

```
index.html
  │
  ├── style.css ──────────────────────────────────┐
  │     ├── css/tokens.css                         │
  │     ├── css/base.css                           │  (CSS @import chain,
  │     ├── css/bursts.css                         │   loaded in parallel
  │     ├── css/preloader.css                      │   by the browser)
  │     ├── css/hero.css                           │
  │     ├── css/teaser.css                         │
  │     ├── css/footer.css                         │
  │     └── css/responsive.css ───────────────────┘
  │
  └── script.js (ES module)
        ├── js/loader.js
        │     └── (reads SECTIONS array) ──→ fetch() html/*.html
        ├── js/preloader.js
        │     └── js/config.js   (PRELOADER_DURATION)
        ├── js/typewriter.js
        │     └── js/config.js   (TYPEWRITER_LINES)
        ├── js/countdown.js
        │     ├── js/config.js   (REDIRECT_URL, TOTAL_SECONDS)
        │     └── js/typewriter.js  (stopTypewriter on redirect)
        └── js/interactions.js
              └── js/countdown.js  (doRedirect on CTA click)
```

**Rule**: modules only import from `js/config.js` or sibling modules.
`script.js` imports from everything — it is the **orchestrator, not logic**.

---

## Runtime Boot Sequence

```
1. Browser parses index.html
   ├── <link rel="stylesheet" href="style.css">
   │     → browser fetches all css/*.css in parallel (zero blocking)
   └── <script type="module" src="script.js">
         → deferred automatically (runs after DOM parsed)

2. Inline preloader div (#preloader) is visible immediately
   → body.preloading class hides all other content via:
        body.preloading > *:not(.preloader) { visibility: hidden }

3. script.js IIFE executes:
   a. body.classList.add('preloading')
   b. await loadAllSections()
        ├── fetch('html/hero.html')   → mount.outerHTML = html
        ├── fetch('html/teaser.html') → mount.outerHTML = html
        └── fetch('html/footer.html') → mount.outerHTML = html
   c. setupCTA()            → wire #cta-btn, #secondary-cta-btn
   d. setupPanelAnimations() → IntersectionObserver on panels
   e. setupBursts()         → click-pop on .burst elements
   f. setupPanelKeys()      → keyboard redirect on .comic-panel
   g. initPreloader(onReady)
        → setTimeout(hide, PRELOADER_DURATION)
        → preloader.classList.add('slide-away')
        → on transitionend: body.classList.remove('preloading')
        → onReady():
             startTypewriter()           → ticks every 62–38ms
             setTimeout(startCountdown, 300ms)
                  → ticks every 1000ms
                  → updates DOM: #countdown-number, #progress-fill,
                                 #countdown-secondary
                  → at 0: doRedirect()

4. doRedirect():
   → isRedirecting = true (guard: prevents double-fire)
   → stopTypewriter()
   → body.classList.add('page-exit')
        → CSS: exitSlideUp animation (0.65s upward)
   → setTimeout(650ms): window.location.href = REDIRECT_URL
```

---

## CSS Architecture

### Import Order (matters!)

```
tokens.css       ← :root variables (no selectors)
base.css         ← reset + body + @keyframes shared
bursts.css       ← .burst (uses tokens)
preloader.css    ← .preloader (uses tokens + tokens from base)
hero.css         ← .hero-panel etc. (uses tokens + bounceIn from base)
teaser.css       ← .teaser-section etc.
footer.css       ← .comic-footer etc.
responsive.css   ← @media only (overrides above)
```

### Rules
- Each component CSS file **imports nothing** — it reads tokens via CSS custom properties.
- `responsive.css` is **always last** — its `@media` blocks override any component style.
- No `@media` rules anywhere except `responsive.css`.
- No inline styles in HTML (except `--i:N` custom property on `.pl-letter` for stagger index).

---

## HTML Partial Loading

The `fetch()`-based partial system replaces placeholder `<div>` elements:

```
Before fetch:                  After fetch:
<div id="section-hero"></div>  <main class="hero-panel" id="hero">...</main>
```

`loader.js` calls `mount.outerHTML = await res.text()` — the mount div
is completely replaced, not just filled. This keeps the final DOM clean.

### Error Handling
If a partial file fails to load (network error, file not found):
- `console.warn` is issued
- The empty placeholder is removed (`mount.remove()`)
- The rest of the page loads normally

### Why Not Build-Time Includes?
No build step → no templating engine. `fetch()`-based partials are the
idiomatic runtime solution for vanilla static sites.

---

## State Model

The site has minimal shared state — three boolean-like conditions:

| State | Where | Description |
|---|---|---|
| `body.preloading` | CSS class | Content hidden during preloader phase |
| `body.page-exit` | CSS class | Animation plays during redirect transition |
| `isRedirecting` | `js/countdown.js` | Guard: prevents `doRedirect()` from firing twice |

No global state object, no stores, no event bus — dependencies are resolved
via direct ES module imports.

---

## File Responsibilities (Quick Ref)

| File | Owns | Does NOT own |
|---|---|---|
| `index.html` | Shell, preloader HTML, mount points | Section content, logic |
| `style.css` | Import order | Any CSS rules |
| `script.js` | Boot sequence (order of calls) | Logic (just imports + calls) |
| `css/tokens.css` | All `:root` variables | Any selectors |
| `css/responsive.css` | All `@media` queries | Non-media rules |
| `js/config.js` | Site constants | DOM, timers, fetch |
| `js/loader.js` | Fetch + injection of HTML | Display logic |
| `js/preloader.js` | `.preloader` lifecycle | Timer values (from config) |
| `js/typewriter.js` | Speech bubble text loop | Redirect, countdown |
| `js/countdown.js` | Timer, redirect trigger | Typewriter (except stop) |
| `js/interactions.js` | Event listeners | Business logic |
| `html/hero.html` | Hero section markup | Styles, scripts |
| `html/teaser.html` | Teaser section markup | Styles, scripts |
| `html/footer.html` | Footer markup | Styles, scripts |
| `resume/index.html` | Resume page (standalone) | Main site JS |
| `resume/resume.css` | Resume screen + print styles | Main site CSS |
| `404.html` | 404 page (standalone, self-contained) | All external deps |

---

## How to Add a New Section (End-to-End)

### Step 1 — HTML Partial
Create `html/my-section.html`:
```html
<section class="my-section" id="my-section">
  <h2 class="my-section-heading">TITLE</h2>
  <!-- content -->
</section>
```

### Step 2 — Mount Point
Add to `index.html` (in desired vertical order):
```html
<div id="section-my-section"></div>
```

### Step 3 — Register in Loader
In `js/loader.js`, add to the `SECTIONS` array:
```js
{ mountId: 'section-my-section', path: 'html/my-section.html' },
```

### Step 4 — CSS Module
Create `css/my-section.css`:
```css
/* css/my-section.css — My Section Component */
.my-section { ... }
.my-section-heading { ... }
/* NO @media rules here */
```

### Step 5 — Import CSS
In `style.css`, add before `responsive.css`:
```css
@import url('css/my-section.css');
```

### Step 6 — Responsive Overrides
In `css/responsive.css`, add at appropriate breakpoint:
```css
@media (max-width: 600px) {
  .my-section { padding: 2rem 1rem; }
}
```

### Step 7 — Interactions (if needed)
In `js/interactions.js`, export a setup function:
```js
export function setupMySection() {
  const el = document.querySelector('.my-something');
  // wire events
}
```
Import and call it in `script.js`:
```js
import { ..., setupMySection } from './js/interactions.js';
// inside IIFE:
setupMySection();
```

---

## Resume Sub-site (`/resume`)

The resume at `alokdasofficial.in/resume` is served from `resume/index.html`.

It is **completely standalone** from the main splash site:
- No import of `js/loader.js` or any main site JS
- Its own `resume/resume.css` (linked relatively)
- Served via Firebase `cleanUrls: true` (so `/resume` maps to `/resume/index.html`)
- On GitHub Pages: `/resume/` directory serves `index.html` automatically

Print mode is handled purely in `@media print` inside `resume/resume.css`.
The print block resets ALL comic styles → clean Arial professional layout.

---

## Deployment Architecture

```
Code Repository (GitHub)
       │
       ├── GitHub Actions / Manual Push
       │
       ├── GitHub Pages ──────────────────────┐
       │    404.html → auto-served for 404s   │
       │    .nojekyll → disables Jekyll       │
       │                                      ├──→ Cloudflare CDN
       └── Firebase Hosting ──────────────────┘        (proxy)
            firebase.json → cleanUrls, headers
            /resume rewrite → /resume/index.html
            404.html → auto-served for 404s
```

Cloudflare sits in front of either host as a CDN/proxy.
It passes 404 responses from the origin — no special Cloudflare config needed.

---

## Performance Considerations

| Concern | Approach |
|---|---|
| CSS loading | `@import` over HTTP/2 → browser fetches in parallel |
| Font loading | `preconnect` hints + single `<link>` for both fonts |
| JS loading | `type="module"` → automatically deferred |
| HTML partials | 3 concurrent `fetch()` calls via `Promise.all` |
| Preloader duration | Covers async load time (2200ms = generous safety margin) |
| Cache | `firebase.json` sets 1yr cache on `.js`/`.css`, no-cache on `.html` |
