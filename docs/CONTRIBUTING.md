# Contributing Guide

**Product:** alokdasofficial.in  
**Version:** 1.0

---

## Before You Start

1. Read [`AGENTS.md`](../AGENTS.md) — critical constraints you must not break.
2. Read [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — understand the data flow.
3. Read [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) — use existing tokens, don't invent values.
4. Test locally via HTTP server — HTML partials use `fetch()`, file:// won't work.

```bash
# Quick local server
npx serve .
```

---

## Code Conventions

### HTML

| Rule | Example |
|---|---|
| Use semantic elements | `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>` |
| Add `aria-label` to interactive elements | `<button aria-label="Go home">` |
| Set `aria-hidden="true"` on decorative elements | Icons, bursts, halftone bg |
| Add `role="status"` to dynamic regions | Countdown display |
| Use double quotes for attributes | `class="my-class"` not `class='my-class'` |
| IDs are unique and descriptive | `id="countdown-number"` not `id="n"` |
| Partials start with a comment block | See `html/hero.html` header format |

### CSS

| Rule | Example / Location |
|---|---|
| All design values → tokens | `color: var(--pink)` never `color: #FF2D6B` |
| No `@media` in component files | **All breakpoints go in `css/responsive.css` only** |
| No inline styles in HTML | Exception: `--i:N` stagger index on `.pl-letter` |
| One concern per file | Preloader → `css/preloader.css`, hero → `css/hero.css` |
| Comment the top of every CSS file | Purpose, dependencies, link to component |
| Class naming: BEM-like kebab-case | `.hero-panel`, `.countdown-display`, `.panel-title` |
| Hover before active | Define `:hover` before `:active` in source order |
| Always test reduced motion | Add rule to `css/responsive.css` if your animation is new |

### JavaScript

| Rule | Example |
|---|---|
| ES Modules only | `export function`, `import { }` |
| No logic in `script.js` | `script.js` only imports and calls; logic goes in `js/*.js` |
| Config values in `config.js` | URLs, durations, copy text |
| Private helpers prefix with `_` | `function _tick()`, `let _lineIdx` |
| Export only public API | `export function startCountdown()` — internal helpers unexported |
| Guard against double-fire | Check `isRedirecting` before redirect-related actions |
| Comment every export | JSDoc `@param`, `@returns` on exported functions |
| DOM queries after sections load | Never query section DOM before `await loadAllSections()` |

---

## Adding a New CSS Component

1. Create `css/my-component.css`
2. Start with a comment block:
   ```css
   /* ============================================================
      my-component.css — [Description]
      [When this component is used, what it contains]
      ============================================================ */
   ```
3. Use **only** `var(--token)` — no hardcoded hex/px values for design tokens.
4. **No `@media` rules** — add those to `css/responsive.css`.
5. Add the import to `style.css` **before** `@import url('css/responsive.css')`:
   ```css
   @import url('css/my-component.css');
   ```

---

## Adding a New JS Module

1. Create `js/my-module.js`
2. Import only from `js/config.js` or sibling JS modules.
3. Export only what other modules need.
4. Use a leading-underscore prefix for internal state/helpers.
5. Import and call it in `script.js` inside the boot IIFE.

```js
// js/my-module.js
import { SOME_CONSTANT } from './config.js';

let _internalState = null;

export function setupMyThing() {
  const el = document.getElementById('my-id');
  if (!el) return; // always guard
  // wire events
}
```

---

## Adding a New HTML Section

Full steps in [`docs/ARCHITECTURE.md#how-to-add-a-new-section`](ARCHITECTURE.md#how-to-add-a-new-section-end-to-end).

Quick checklist:
- [ ] `html/my-section.html` — starts with `<section class="my-section" id="my-section">`
- [ ] `<div id="section-my-section"></div>` added to `index.html`
- [ ] `{ mountId, path }` entry added to `SECTIONS` in `js/loader.js`
- [ ] `css/my-section.css` created + imported in `style.css`
- [ ] Responsive overrides added to `css/responsive.css`
- [ ] Interactions (if any) exported from `js/interactions.js` and called in `script.js`

---

## Adding a New Design Token

1. Open `css/tokens.css`
2. Add the variable to `:root`
3. Use it in your component: `var(--my-new-token)`
4. Document it in `docs/DESIGN_SYSTEM.md` under the relevant section

```css
/* css/tokens.css */
:root {
  /* ... existing tokens ... */
  --my-new-token: #ABCDEF;   /* Short description of usage */
}
```

---

## Editing the Resume

The resume at `resume/index.html` is **standalone** — it does NOT use the main
site's JS or CSS files.

| Want to change | Edit |
|---|---|
| Resume content | `resume/index.html` |
| Resume screen styling | `resume/resume.css` (screen section) |
| Resume print styling | `resume/resume.css` (`@media print` section) |
| Resume contact info | `resume/index.html` → `.r-contact-row` chips |
| Skills table | `resume/index.html` → `.skills-table` |
| Projects | `resume/index.html` → `.r-project-card` articles |

> **Print testing**: Always test `Ctrl+P` / `Cmd+P` after editing resume.css print styles.
> Target: clean A4, Arial font, no colours/shadows, professional layout.

---

## Editing Site Copy

| Content | File | Element |
|---|---|---|
| Redirect destination URL | `js/config.js` | `REDIRECT_URL` |
| Countdown seconds | `js/config.js` | `TOTAL_SECONDS` |
| Preloader duration | `js/config.js` | `PRELOADER_DURATION` |
| Typewriter lines | `js/config.js` | `TYPEWRITER_LINES` array |
| Hero title (ALOK/DAS) | `html/hero.html` | `.title-line-1`, `.title-line-2` |
| Issue tag text | `html/hero.html` | `.issue-tag` |
| Hero sub-headline | `html/hero.html` | `.hero-sub` |
| Redirect label | `html/hero.html` | `.redirect-label` |
| Panel titles/descriptions | `html/teaser.html` | `.panel-title`, `.panel-desc` |
| Footer text | `html/footer.html` | `.footer-cell` |
| Page `<title>` | `index.html` | `<title>` |
| SEO meta description | `index.html` | `<meta name="description">` |

---

## Deployment

### Firebase (primary)
```bash
firebase deploy
```

### GitHub Pages
Push to `main` branch. GitHub Pages serves automatically.

### Checklist before deploying
- [ ] Test locally with HTTP server — not `file://`
- [ ] Test mobile at 375px (iPhone) and 768px (tablet)
- [ ] Test `Ctrl+P` on resume page
- [ ] Verify redirect fires and slide-up animation plays
- [ ] Check 404 page at `/any-unknown-path`
- [ ] No hardcoded values outside `config.js` / `tokens.css`

---

## What NOT to Do

| ❌ Don't | ✅ Do instead |
|---|---|
| Add a build step (webpack, vite) | Keep it pure static |
| Add a framework (React, Vue) | Vanilla JS modules |
| Write `@media` in a component CSS file | Add to `responsive.css` |
| Hardcode `#FFE600` in CSS | Use `var(--yellow)` |
| Add logic to `script.js` | Create/extend a `js/*.js` module |
| Use `<style>` tags in HTML partials | Write styles in `css/` |
| Use inline `style=""` attributes | Use CSS component classes |
| Query section DOM before `loadAllSections()` | Always `await loadAllSections()` first |
| Make `404.html` depend on external files | Keep it self-contained with embedded `<style>` |
