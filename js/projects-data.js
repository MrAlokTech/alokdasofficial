/**
 * js/projects-data.js — Single source of truth for ALL projects.
 */

window.PROJECTS_DATA = [

  /* ── 1. Phytochemical Analysis ────────────────────────── */
  {
    slug: 'phytochemical',
    number: '001',
    edition: 'Research Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    title: 'PHYTOCHEMICAL<br>ANALYSIS',
    shortTitle: 'Phytochemical Analysis of Medicinal Plants',
    subtitle: 'Medicinal Plant Screening · Final Year Dissertation',
    cardBadges: [{ label: 'Research', type: 'research' }, { label: '2025' }],
    chips: ['Analytical Chemistry', 'TLC', 'GLP / SOP', 'Qualitative Testing'],
    cardDesc: 'Final-year B.Sc. dissertation — systematic phytochemical screening of local medicinal plants. Designed a solvent extraction protocol, detected alkaloids, flavonoids, tannins &amp; saponins, and documented all results in structured lab reports adhering to SOP-like formats.',
    autoplay: 4500,
    carousel: [
      { bg: 'var(--surface2)', icon: `<svg class="icon" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`, label: 'SAMPLE COLLECTION' },
      { bg: 'var(--surface2)', icon: `<svg class="icon" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`, label: 'SOLVENT EXTRACTION' },
    ],
    detailLink: '/projects/phytochemical/',
    liveLink: null,
  },

  /* ── 2. Alomole ────────────────────────────────────────── */
  {
    slug: 'alomole',
    number: '002',
    edition: 'Chemistry Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><line x1="14.2" y1="9.8" x2="17.5" y2="6.5"/><line x1="9.8" y1="14.2" x2="6.5" y2="17.5"/></svg>`,
    title: 'ALOMOLE',
    shortTitle: 'Alomole — Chemistry Companion',
    subtitle: 'Chemistry Companion App · Built with Flutter',
    cardBadges: [{ label: 'Live', type: 'live' }, { label: 'Flutter' }],
    chips: ['Flutter', 'Dart', 'Web', 'Firebase'],
    cardDesc: 'Chemistry toolkit app featuring a chemical equation balancer, molarity/normality calculator, and organic reaction explorer. Built chemistry domain knowledge directly into the tool — published and live on the web.',
    autoplay: 4000,
    carousel: [
      {
        img: "https://lh3.googleusercontent.com/-rURRFo9R_l07WI3aFgQmugfSlbbuPHAEQbB5Akv-HyqRi4sVb8OIIKFgOlIgAN5QSo", alt: "Alomole app screenshot showing the chemical equation balancer interface.",
      }
    ],
    detailLink: '/projects/alomole/',
    liveLink: { href: 'https://alomolecule.web.app', label: 'Open App →' },
  },

  /* ── 3. Mileage Tracker ────────────────────────────────── */
  {
    slug: 'mileage-tracker',
    number: '003',
    edition: 'Utility Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="8" rx="2"/><path d="M5 11l2.5-6h9L19 11"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>`,
    title: 'MILEAGE TRACKER',
    shortTitle: 'Mileage Tracker — Fuel & Cost',
    subtitle: 'Vehicle Management App · Built with Flutter',
    cardBadges: [{ label: 'Live', type: 'live' }, { label: 'Flutter' }],
    chips: ['Flutter', 'Dart', 'Android', 'SQLite'],
    cardDesc: 'A comprehensive utility app to track vehicle mileage, fuel expenses, and running costs. Designed with intuitive charts to help users monitor fuel efficiency and manage vehicle expenses locally.',
    autoplay: 4000,
    carousel: [
      { img: "https://play-lh.googleusercontent.com/Orkv0wMWqx90L2Z021J9Jlt2Xyro0_gSAlVjvc8M0v4Yt-MMWivhq1ezZo4kg9n-CXnJv4a5t14FRgNfhb9iEA", alt: "Snap1" }
    ],
    detailLink: '/projects/mileage-tracker/',
    liveLink: { href: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage', label: 'Play Store →' },
  },

  /* ── 4. Virtual Lab Assistant ────────────────────────── */
  {
    slug: 'virtual-lab',
    number: '004',
    edition: 'Interactive Lab Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
    title: 'VIRTUAL QC<br>LAB ASSISTANT',
    shortTitle: 'Virtual QC Laboratory Assistant',
    subtitle: 'Chemistry Calculations & GLP Logger · Built with Pure JS',
    cardBadges: [{ label: 'Interactive', type: 'live' }, { label: 'Pure JS' }],
    chips: ['Analytical Chemistry', 'SOP / GLP Standards', 'Volumetric Mathematics', 'Direct SOP PDF Printer'],
    cardDesc: 'An immersive laboratory dashboard demonstrating analytical chemistry and software integration. Select compounds, calculate molarities, cascade serial dilutions, and print formal GLP worksheets.',
    autoplay: 4000,
    carousel: [
      { bg: 'var(--surface2)', icon: `<svg class="icon" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`, label: 'VIRTUAL WORKBENCH' },
    ],
    detailLink: '/lab/',
    liveLink: { href: '/lab/', label: 'Open Lab →' },
  }

];
