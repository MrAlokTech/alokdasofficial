# Design System

**Product:** alokdasofficial.in  
**Theme:** Pop-Art Comic Book  
**Version:** 1.0

> All tokens live in `css/tokens.css`. **Never hardcode values in component files.**
> Update a token once; every component that uses it updates automatically.

---

## Colour Palette

| Token | Hex | Swatch | Usage |
|---|---|---|---|
| `--yellow`  | `#FFE600` | 🟡 | Primary bg, CTA buttons, burst accent, skill badges |
| `--pink`    | `#FF2D6B` | 🩷 | Urgency, hovers, panel strips, countdown low |
| `--blue`    | `#00C2FF` | 🔵 | Progress fill, teaser panel strip, countdown mid |
| `--purple`  | `#6A0DAD` | 🟣 | Teaser bg, resume sidebar, secondary buttons |
| `--ink`     | `#0D0D0D` | ⬛ | ALL borders, text, shadows — the comic outline |
| `--cream`   | `#FFFEF0` | 🟤 | Light bg, white text on dark, card surfaces |
| `--dark`    | `#1A0030` | 🌑 | Progress track bg, resume sidebar bg |
| `--white`   | `#FFFFFF` | ⬜ | Speech bubble interior, project card bg |

### Colour Usage Rules

- **Yellow** is the dominant background — keep it prominent on the hero.
- **Ink** (`#0D0D0D`) is used for ALL borders and drop shadows — never use grey or `#000`.
- **Pink** signals action/urgency. Use for countdown final 3 seconds, hover states.
- **Never** mix more than 3 palette colours in a single component.
- The **halftone dot overlay** always uses `--ink` at ~6% opacity.

---

## Typography

### Fonts

| Font | Source | Role | Token |
|---|---|---|---|
| **Bangers** | Google Fonts | Headings, titles, badges, labels | `--font-comic` |
| **Comic Neue** | Google Fonts | Body text, descriptions, UI copy | `--font-body` |

### Scale

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Hero name (line 1/2) | Bangers | `clamp(5rem, 20vw, 10rem)` | 400 | `-webkit-text-stroke: 3px` |
| Section headings | Bangers | `clamp(2rem, 8vw, 3.8rem)` | 400 | `letter-spacing: 4px` |
| Panel title | Bangers | `2rem` | 400 | `letter-spacing: 3px` |
| Issue tag / badges | Bangers | `1rem` | 400 | `letter-spacing: 3px` |
| CTA buttons | Bangers | `1.1–1.5rem` | 400 | `letter-spacing: 2px` |
| LOADING letters | Bangers | `clamp(2.5rem, 8vw, 4.5rem)` | 400 | Staggered bounce |
| Body / descriptions | Comic Neue | `0.88–1rem` | 700 | Line-height 1.5–1.65 |
| Sub-headline pill | Comic Neue | `clamp(0.9rem, 2.5vw, 1.1rem)` | 700 | — |
| Countdown number | Bangers | `clamp(3rem, 12vw, 5.5rem)` | 400 | Pulse on tick |

### Typography Rules

- **Bangers** is for anything decorative, comic-style, impactful.
- **Comic Neue** is for anything the user needs to _read_ comfortably.
- Use `clamp()` for fluid sizing — never fixed `px` for headings.
- Heading hierarchy: `h1` (hero name) → `h2` (section) → `h3` (panel/card title).

---

## Borders & Shadows

| Token | Value | Usage |
|---|---|---|
| `--border-thin` | `3px solid var(--ink)` | Standard borders, chips, badges |
| `--border-thick` | `5px solid var(--ink)` | Hero panel, section separators, major cards |
| `--shadow-pop` | `6px 6px 0px var(--ink)` | Standard comic pop shadow |
| `--shadow-big` | `10px 10px 0px var(--ink)` | Redirect box, teaser panels |
| `--shadow-hover` | `4px 4px 0px var(--ink)` | Small interactive elements |

### Shadow Rules
- Always use **flat offset** (no blur) — this is the comic book style.
- Hover state: increase offset to `9px 9px` or `10px 10px`.
- Active/pressed state: reduce to `2px 2px` or `3px 3px`.

---

## Shape & Spacing

| Token | Value | Usage |
|---|---|---|
| `--radius` | `12px` | Standard border-radius for all cards/buttons |

### Spacing Approach
No fixed spacing scale tokens — use contextual `rem` values:

| Context | Typical value |
|---|---|
| Section padding | `4rem 1.5rem` |
| Card internal padding | `1.5rem 2rem` |
| Button padding | `0.7rem 2rem` |
| Gap between elements | `1–1.5rem` |
| Mobile reduction | ~20–25% smaller |

---

## Motion & Animation

### Principles
1. **Comic book feel** — snappy, springy, never smooth or "subtle". Exaggerate slightly.
2. **Purposeful** — every animation communicates state change (loading, appearing, redirecting).
3. **Respects prefers-reduced-motion** — all animations disabled via `css/responsive.css`.

### Animation Catalogue

| Name | Keyframe | Used by | Duration | Timing |
|---|---|---|---|---|
| Pop-in entrance | `bounceIn` | Issue tag, title, speech bubble, redirect box | 0.6–0.7s | `cubic-bezier(0.36,0.07,0.19,0.97)` |
| Slide up entrance | `slideUp` | Teaser heading, panels | 0.7s | `ease` |
| Float + spin | `floatSpin` | Burst decorations | 6–9s (looping) | `ease-in-out` |
| Letter bounce | `letterBounce` | Preloader LOADING letters | 0.7s alternate infinite | `ease-in-out` |
| Spinning icon | `spinBurst` | Preloader ⚡ icon | 1.6s linear infinite | `linear` |
| Dot pulse | `dotPulse` | Preloader dots | 1.1s infinite | `ease-in-out` |
| Preloader exit | CSS transition | `.preloader.slide-away` | 0.72s | `cubic-bezier(0.76,0,0.24,1)` |
| Countdown tick | `countTick` | `#countdown-number` | 0.2s per tick | `ease` |
| Page exit | `exitSlideUp` | `body.page-exit` | 0.65s | `cubic-bezier(0.76,0,0.24,1)` |
| Cursor blink | `blink` | `.cursor` in speech bubble | 0.8s infinite | `step-end` |

### Transform Patterns (Interactive)

| State | Transform | Context |
|---|---|---|
| Hover | `translate(-3px, -3px)` + bigger shadow | CTA buttons, panels |
| Active/Press | `translate(3px, 3px)` + smaller shadow | CTA buttons |
| Burst click | `scale(1.5)` then reset | `.burst` elements |
| Panel hover | `translate(-5px,-5px) rotate(-1deg)` | `.comic-panel` |

---

## Component Inventory

### 1. Hero Panel (`.hero-panel`)
- Full-viewport section on `--yellow` background
- Two decorative circles (::before pink, ::after blue) behind content
- Always centered with max-width container

### 2. Issue Tag (`.issue-tag`)
- Black pill badge with yellow text
- Font: Bangers, `1rem`, `letter-spacing: 3px`
- Used above titles to set comic context

### 3. Speech Bubble (`.speech-bubble`)
- White rounded rectangle with thick ink border + pop shadow
- Downward-left tail via `::after` (ink colour) + `::before` (white, overlapping)
- Contains typewriter text + blinking cursor

### 4. Redirect Box (`.redirect-box`)
- Black background card, max-width 440px
- Contains: label, countdown number, progress bar, CTA button (stacked)

### 5. Progress Bar (`.progress-track` + `.progress-fill`)
- Dark track, gradient fill (pink → blue)
- `transition: width 1s linear` — synced with countdown ticks

### 6. CTA Button (`.cta-btn`)
- Yellow, Bangers, `1.3rem`, pop shadow
- Hover: translate(-3px,-3px), shadow grows white
- Active: translate(3px,3px), shadow shrinks

### 7. Resume Button (`.resume-btn`)
- Purple, cream text
- Hover: turns pink, shadow grows

### 8. Comic Panel (`.comic-panel`)
- Cream card with thick border and big shadow
- Top 8px colour strip via `::before` (pink / blue / yellow per variant)
- Hover: translate + rotate for 3D pop feel
- Keyboard accessible (tabindex, Enter/Space triggers redirect)

### 9. Burst Shape (`.burst`)
- 9-point star via `clip-path:polygon()`
- 4 variants: `.burst-1` (pink), `.burst-2` (blue), `.burst-3` (yellow), `.burst-4` (purple)
- Position: fixed, visually decorative — `pointer-events: none`, `aria-hidden="true"`

### 10. Preloader (`.preloader`)
- Full-screen black overlay, `z-index: 99999`
- Exits: `transform: translateY(-100%)` transition (upward)
- Content: ⚡ icon + LOADING letters + dots + subtitle

### 11. Footer (`.comic-footer`)
- Black background, cream text
- Icons `★` as dividers
- On mobile: stacks vertically, dividers hidden

---

## Halftone Dot Pattern

```css
.halftone-bg {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, var(--ink) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  opacity: 0.06;
  pointer-events: none;
}
```

Used as a fixed ::background overlay across the entire page.

---

## Accessibility Notes

- All decorative elements have `aria-hidden="true"`
- Status/live regions use `role="status"` and `aria-live="polite"`
- Progress bar has full ARIA (`role="progressbar"`, `aria-valuemin/max/now`)
- Interactive panels have `tabindex="0"` and keyboard handlers
- Transitions disabled under `prefers-reduced-motion: reduce`
- Colour contrast: Ink on Yellow = **very high** contrast (WCAG AA+)
