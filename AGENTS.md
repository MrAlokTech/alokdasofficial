# AGENTS.md — AI Context File

> **Read this first.** This file gives AI coding assistants (Claude, Copilot, Cursor,
> Gemini, etc.) instant, complete context to work on this project correctly without
> asking redundant questions or making architectural mistakes.

---

## Project in One Sentence

`alokdasofficial.in` is a **static, no-build-step, minimalist portfolio and utility hub** for **Alok Das** (B.Sc. Chemistry graduate, QC Analyst & App Developer) featuring project showcases, browser utilities (`/tools`), interactive lab tools (`/lab`), offline games (`/games`), printable resume (`/resume`), and a **404 fallback page**.

---

## Critical Constraints (Never Break These)

| Constraint | Why |
|---|---|
| **No build tool / bundler** | Deploys as raw static files to Firebase or GitHub Pages |
| **No framework** (React, Vue, etc.) | Pure HTML + CSS + Vanilla JS only |
| **No inline styles** | All styles live in `css/` component files |
| **No hardcoded values** | Colours, URLs, timing → `css/tokens.css` or `js/config.js` |
| **No logic in `script.js`** | `script.js` is orchestrator-only; logic lives in `js/*.js` modules |
| **No `type="module"` on scripts** | Classic `<script>` tags work on both `file://` (offline) and `http://`. ES modules are blocked on `file://` by CORS |
| **404.html must be self-contained** | Embedded `<style>` only — no external CSS link (path-independent) |
| **Resume print styles in resume.css** | `@media print` block resets styles to clean Arial A4 |

---

## Design Tokens Summary

All in `css/tokens.css`. Use these variable names everywhere:

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--font-sans` | `'DM Sans', sans-serif` | `'DM Sans', sans-serif` | Body & primary headings |
| `--font-mono` | `'DM Mono', monospace` | `'DM Mono', monospace` | Badges, code, labels & accents |
| `--bg` | `#f5f4f0` | `#111110` | Page background |
| `--surface` | `#ffffff` | `#1c1c1a` | Card & container surface |
| `--surface2` | `#f0eeea` | `#242422` | Secondary surface & tag backgrounds |
| `--border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.07)` | Element borders |
| `--text` | `#1a1917` | `#f0eeea` | Primary text |
| `--text2` | `#6b6860` | `#8a8880` | Secondary text |
| `--text3` | `#a09d98` | `#555350` | Muted text & metadata |
| `--accent` | `#1a1917` | `#f0eeea` | Action button background |
| `--radius` | `16px` | `16px` | Standard border radius |

---

## Sub-Site & Directory Mapping

- `/` (`index.html`): Main minimalist portfolio site
- `/tools` (`tools/index.html`): Browser utilities list & tools hub
- `/lab` (`lab/index.html`): Virtual QC Laboratory Assistant
- `/games` (`games/index.html`): Offline pure JS mini games
- `/resume` (`resume/index.html`): Standalone printable resume
