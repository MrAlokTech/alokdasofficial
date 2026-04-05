# alokdasofficial.in

> **Comic-book themed splash/redirect page** for Alok Das's personal domain.
> Engages visitors with a preloader, typewriter, countdown timer, and auto-redirects
> to the full portfolio at [me.alokdasofficial.in](https://me.alokdasofficial.in).

[![Live Site](https://img.shields.io/badge/Live-alokdasofficial.in-FFE600?style=flat-square&logo=googlechrome&logoColor=black)](https://alokdasofficial.in)
[![Portfolio](https://img.shields.io/badge/Portfolio-me.alokdasofficial.in-FF2D6B?style=flat-square)](https://me.alokdasofficial.in)
[![Resume](https://img.shields.io/badge/Resume-/resume-6A0DAD?style=flat-square)](https://alokdasofficial.in/resume)

---

## 📋 Table of Contents

- [What this site does](#what-this-site-does)
- [Live URLs](#live-urls)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Quick Start (Local Dev)](#quick-start-local-dev)
- [Documentation](#documentation)
- [Deployment](#deployment)

---

## What this site does

`alokdasofficial.in` is **not** the main portfolio — it is a **fun landing gateway** that:

1. Shows a **comic-style preloader** (animated bouncing LOADING letters)
2. Reveals a **hero panel** with a typewriter speech bubble
3. Runs a **10-second countdown** with a progress bar
4. Displays **teaser panels** hinting at portfolio content
5. **Auto-redirects** to `me.alokdasofficial.in`, or instantly on CTA click
6. Hosts a comic-styled **printable resume** at `/resume`
7. Serves a themed **404 page** for any unknown route

---

## Live URLs

| Route | Description |
|---|---|
| `alokdasofficial.in/` | Comic splash + redirect |
| `alokdasofficial.in/resume` | Chemistry QC Analyst resume |
| `alokdasofficial.in/*` (any other) | Comic 404 fallback page |

---

## Tech Stack

| Concern | Technology |
|---|---|
| Structure | HTML5 (semantic, modular partials) |
| Styling | Vanilla CSS with `@import` modules |
| Logic | Vanilla ES Modules (no bundler, no framework) |
| Fonts | Google Fonts — Bangers + Comic Neue |
| Hosting | Firebase Hosting **or** GitHub Pages + Cloudflare CDN |

No build step. No npm. No framework. Pure, deployable static files.

---

## Folder Structure

```
alokdasofficial.in/
│
├── index.html              ← Shell: <head>, inline preloader, section mounts
├── style.css               ← CSS entry: @import chain (do not add rules here)
├── script.js               ← JS entry: ES module orchestrator
├── 404.html                ← Standalone comic 404 fallback page
├── firebase.json           ← Firebase Hosting config
├── .nojekyll               ← Disables Jekyll on GitHub Pages
│
├── css/                    ← One CSS file per concern
│   ├── tokens.css          ← Design tokens (:root variables) ← EDIT TOKENS HERE
│   ├── base.css            ← Reset, body, halftone-bg, shared keyframes
│   ├── bursts.css          ← Floating POW/ZAP decorative shapes
│   ├── preloader.css       ← Preloader overlay + page-exit animation
│   ├── hero.css            ← Hero panel, title, speech bubble, countdown, CTAs
│   ├── teaser.css          ← Preview panels grid + secondary CTA
│   ├── footer.css          ← Comic strip footer
│   └── responsive.css      ← ALL @media queries (one place only)
│
├── js/                     ← ES modules — each has a single responsibility
│   ├── config.js           ← Site constants: redirect URL, timing, copy
│   ├── loader.js           ← Fetches HTML partials and mounts them
│   ├── preloader.js        ← Preloader show/hide lifecycle
│   ├── typewriter.js       ← Typewriter cycling through speech bubble lines
│   ├── countdown.js        ← Countdown timer + doRedirect()
│   └── interactions.js     ← CTA buttons, panel animations, burst pops, keyboard
│
├── html/                   ← HTML section partials (loaded by js/loader.js)
│   ├── hero.html           ← Main panel: title, speech bubble, countdown, CTAs
│   ├── teaser.html         ← Preview panels + secondary CTA
│   └── footer.html         ← Footer strip
│
├── resume/                 ← Standalone resume sub-site
│   ├── index.html          ← QC Chemistry Analyst comic resume
│   └── resume.css          ← Resume styles + @media print (clean A4)
│
└── docs/                   ← Project documentation
    ├── PRD.md              ← Product Requirements Document
    ├── DESIGN_SYSTEM.md    ← Design tokens, typography, component guide
    ├── ARCHITECTURE.md     ← Technical architecture + data flow
    └── CONTRIBUTING.md     ← How to add sections, CSS, JS modules
```

---

## Quick Start (Local Dev)

> ⚠️ HTML partials load via `fetch()` and **require an HTTP server**.
> Opening `index.html` as a `file://` URL will not work.

**Option 1 — VS Code Live Server** (recommended):
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → **Open with Live Server**

**Option 2 — npx serve:**
```bash
npx serve .
```

**Option 3 — Python:**
```bash
python -m http.server 8080
```

Then open: `http://localhost:[port]`

---

## Documentation

| Document | Audience | Contents |
|---|---|---|
| [docs/PRD.md](docs/PRD.md) | PMs, Stakeholders | Goals, user flows, success metrics |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Designers, Devs | Colours, type, spacing, components |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Developers, AI | Module map, data flow, how to extend |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Contributors | Conventions, how to add sections/CSS/JS |
| [AGENTS.md](AGENTS.md) | AI Assistants | Concise project context for AI coding tools |

---

## Deployment

### Firebase Hosting
```bash
firebase deploy
```
Config is in `firebase.json`. `cleanUrls: true` serves `/resume` (no `.html` suffix).

### GitHub Pages
Push to the `main` branch of the connected repo.
`404.html` and `.nojekyll` handle routing automatically.

### Cloudflare
Set as a CDN/proxy in front of either host.
No special configuration needed — 404 is handled by the origin.

---

## Author

**Alok Das** — B.Sc. Chemistry | App Developer | Creator  
[alokdasofficial.in](https://alokdasofficial.in) · [me.alokdasofficial.in](https://me.alokdasofficial.in)
