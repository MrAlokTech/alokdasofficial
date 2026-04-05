# PRD — Product Requirements Document

**Product:** alokdasofficial.in  
**Owner:** Alok Das  
**Version:** 1.0  
**Status:** Live  
**Last Updated:** April 2026

---

## 1. Executive Summary

`alokdasofficial.in` is the **primary personal domain** for Alok Das —
a B.Sc. Chemistry graduate and self-taught app developer. Rather than building
a full portfolio at this domain, the site serves as a **fun, engaging gateway**
that reflects Alok's personality (comic book aesthetic) while directing visitors
to the actual portfolio at `me.alokdasofficial.in`.

The site also hosts a dedicated **comic-styled, printable resume** page.

---

## 2. Problem Statement

| Problem | Context |
|---|---|
| Plain "coming soon" pages kill engagement | Visitors land, see nothing interesting, and leave immediately |
| Portfolio lives on a subdomain | `me.alokdasofficial.in` — visitors need a bridge |
| No professional online resume | Sharing resume links requires external services (Notion, Drive) |
| Domain feels "empty" | A branded, designed experience adds credibility |

---

## 3. Goals

### Primary Goals
- **G1** — Create a memorable first impression using comic-book aesthetics
- **G2** — Auto-redirect visitors to the full portfolio after a countdown
- **G3** — Provide an instant redirect option (no waiting required)
- **G4** — Host a publicly accessible, printable resume at `/resume`

### Secondary Goals
- **G5** — Be fully mobile-responsive across all device sizes
- **G6** — Deploy to both Firebase Hosting and GitHub Pages without modification
- **G7** — Be easily extensible as the site grows into a full portfolio

### Non-Goals
- ❌ Not a full portfolio (that's `me.alokdasofficial.in`)
- ❌ Not a blog or content management system
- ❌ Not server-side rendered
- ❌ No user accounts, forms, or databases

---

## 4. Target Users

| User | Description | Primary Need |
|---|---|---|
| **Recruiter / HR** | Screens candidates, needs resume fast | Quick access to `/resume` + print PDF |
| **Tech Interviewer** | Evaluating technical skills | Redirect to portfolio (`me.alokdasofficial.in`) |
| **General Visitor** | Curious about Alok, lands on domain | Fun experience + clear directions |
| **Developer / AI** | Maintaining or extending the site | Clear docs, modular code, no surprises |

---

## 5. User Flows

### Flow 1 — Standard Visit (Auto-redirect)
```
Land on alokdasofficial.in
  → Preloader shows (LOADING animation)
  → Hero appears (typewriter effect, countdown starts)
  → Teaser panels visible (scroll)
  → Countdown reaches 0
  → Full page slides up
  → Arrives at me.alokdasofficial.in
```

### Flow 2 — Impatient Visitor (Instant Redirect)
```
Land on alokdasofficial.in
  → Preloader shows
  → Hero appears
  → Clicks "⚡ TAKE ME THERE NOW!" or teaser CTA button
  → Full page slides up immediately
  → Arrives at me.alokdasofficial.in
```

### Flow 3 — Resume Viewer
```
Land on alokdasofficial.in
  → Hero appears
  → Clicks "📄 View My Resume"
  → Navigates to alokdasofficial.in/resume
  → Views comic-styled resume
  → Clicks "Save / Print"
  → Browser print dialog → saves as PDF (clean Arial layout)
```

### Flow 4 — 404 / Unknown Route
```
Navigates to alokdasofficial.in/anything-unknown
  → Comic 404 page appears
  → "🏠 Go Home" → alokdasofficial.in
  → "📄 View Resume" → alokdasofficial.in/resume
```

---

## 6. Feature Requirements

### F1 — Preloader
- Must render **before** any JavaScript loads (inline in HTML)
- Animated LOADING text (bouncing letters with staggered delay)
- Spinning lightning bolt icon
- Pulsing dot indicators
- Slides **upward** off screen to reveal content (not fade)
- Duration: **2200ms** (configurable via `js/config.js`)

### F2 — Hero Panel
- Full-viewport-height comic panel on yellow background
- Large stylised name (ALOK / DAS) with drop shadows
- Speech bubble with **typewriter effect** cycling through lines
- Sub-headline pill showing role description
- Countdown box with: label, number, progress bar, instant-redirect button
- Resume shortcut button

### F3 — Countdown & Redirect
- Default: **10 seconds** (configurable via `js/config.js`)
- Progress bar fills from left to right over countdown duration
- Number updates with a pulse animation each second
- Colour shifts: white → blue (≤6s) → pink (≤3s)
- At 0: shows 🚀, triggers full-page slide-up, navigates to `REDIRECT_URL`
- Redirect URL: **`https://me.alokdasofficial.in`** (configurable)

### F4 — Typewriter
- Cycles through `TYPEWRITER_LINES` array (configurable)
- Types forward at 62ms/char, erases at 38ms/char
- Pauses 1900ms at end of each line
- Stops cleanly when redirect fires

### F5 — Teaser Panels
- 3 cards (Apps / Projects / More) on purple background
- Each has: icon, title, description, chapter label, top colour strip
- Scroll-triggered entrance animations (IntersectionObserver)
- Keyboard accessible (Enter/Space triggers redirect)
- Secondary countdown mirror + CTA button

### F6 — Resume (`/resume`)
- Standalone page — no dependency on main site JS
- Sidebar: Objective, Education, Coursework, Languages, Strengths
- Main content: QC Skills table, Academic Project, Lab Experience, Tech section
- Comic design on screen, clean Arial A4 on print
- "Save / Print" button + "Back to Site" button (hidden on print)
- Focus: **Chemistry / QC Analyst** (development is secondary differentiator)

### F7 — 404 Page
- Standalone — embedded CSS, no external dependencies
- Shows 404, comic speech bubble, two CTAs
- Works regardless of URL path depth (absolute href links)

### F8 — Mobile Responsiveness
- Breakpoints: 768px (tablet), 600px (mobile), 400px (small mobile)
- Bursts hidden on mobile (≤600px)
- Buttons full-width on mobile
- Single-column panels on mobile
- All breakpoints in `css/responsive.css` only

---

## 7. Technical Requirements

| Requirement | Detail |
|---|---|
| **No build step** | Files deploy as-is |
| **No framework** | Pure HTML + CSS + Vanilla JS (ES Modules) |
| **Static hosting** | GitHub Pages + Cloudflare, OR Firebase Hosting |
| **Performance** | Fonts preloaded, CSS @import (parallel), JS deferred |
| **Accessibility** | ARIA labels, role attributes, keyboard navigation |
| **SEO** | Meta description, OG tags, theme-color, robots |
| **Browser support** | All modern browsers (ES2020+ features used) |

---

## 8. Success Metrics

| Metric | Target |
|---|---|
| Time-to-first-paint (preloader) | < 500ms |
| Redirect completion rate | > 90% of non-bounce visitors reach portfolio |
| Resume print success rate | Clean A4 output cross-browser |
| Mobile experience | No horizontal scroll, readable without zoom |
| 404 recovery rate | Visitors reach home or resume from 404 |

---

## 9. Future Considerations (V2+)

When the site grows into a full portfolio, the modular architecture accommodates:

- New HTML partial sections (`html/about.html`, `html/projects.html`, etc.)
- Register in `js/loader.js` SECTIONS array + `index.html` mount point
- New CSS component file in `css/` + import in `style.css`
- Consider adding a `css/about.css`, `css/projects.css` etc.

Possible future sections:
- About / Bio
- Projects showcase
- Skills visualization
- Contact form
- Blog / Notes
