/**
 * js/projects-data.js — Single source of truth for ALL projects.
 */

window.PROJECTS_DATA = [

  /* ── 1. Phytochemical Analysis ────────────────────────── */
  {
    slug: 'phytochemical',
    featured: true,
    number: '001',
    edition: 'Research Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    title: 'PHYTOCHEMICAL ANALYSES',
    shortTitle: 'Phytochemical Analysis of Medicinal Plants',
    subtitle: 'Medicinal Plant Screening · Final Year Dissertation',
    headerBadges: [{ label: 'Research', type: 'research' }, { label: '2025' }],
    cardBadges: [{ label: 'Research', type: 'research' }, { label: '2025' }],
    chips: ['Analytical Chemistry', 'TLC', 'GLP / SOP', 'Qualitative Testing'],
    cardDesc: 'Final-year B.Sc. dissertation — systematic phytochemical screening of local medicinal plants. Designed a solvent extraction protocol, detected alkaloids, flavonoids, tannins &amp; saponins, and documented all results in structured lab reports adhering to SOP-like formats.',
    facts: [
      { key: 'Type', val: 'B.Sc. Final Year Dissertation' },
      { key: 'Domain', val: 'Analytical Chemistry' },
      { key: 'Year', val: '2024 – 2025' },
      { key: 'Compliance', val: 'GLP / SOP Compliant' }
    ],
    techPills: ['Analytical Chemistry', 'TLC (Thin-Layer Chromatography)', 'Solvent Extraction', 'SOP Documentation', 'Qualitative Testing'],
    links: [
      { label: 'View Virtual Lab Workbench →', href: '/lab', type: 'primary' }
    ],
    overview: [
      'Final-year B.Sc. Chemistry dissertation focusing on systematic qualitative phytochemical screening of local medicinal plant species.',
      'Developed solvent extraction protocols using petroleum ether, chloroform, methanol, and aqueous solvents to identify bioactive secondary metabolites including alkaloids, flavonoids, tannins, saponins, and cardiac glycosides. All experimental logs were documented in cGMP/GLP SOP compliant records.'
    ],
    features: [
      { name: 'Solvent Extraction Protocol', desc: 'Step-by-step extraction for polar and non-polar phytochemical fractions.' },
      { name: 'Secondary Metabolite Detection', desc: 'Qualitative colorimetric and precipitate assays for alkaloids, flavonoids, and saponins.' },
      { name: 'TLC Chromatogram Profiling', desc: 'Rf value profiling using Thin-Layer Chromatography plates.' },
      { name: 'GLP Standard Worksheets', desc: 'Standard Operating Procedure (SOP) documentation formatted for Quality Control audits.' }
    ],
    challenge: 'Standardizing extraction yields required precise temperature control and solvent purity verification to prevent thermal degradation of sensitive alkaloidal compounds.',
    autoplay: 4500,
    carousel: [
      { bg: 'var(--surface2)', icon: `<svg class="icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`, label: 'SAMPLE COLLECTION & EXTRACTION' },
      { bg: 'var(--surface2)', icon: `<svg class="icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`, label: 'QUALITATIVE COLORIMETRIC ASSAYS' }
    ],
    detailLink: '/projects/phytochemical/',
    liveLink: null,
  },

  /* ── 2. Mileage Tracker ────────────────────────────────── */
  {
    slug: 'mileage-tracker',
    featured: true,
    number: '002',
    edition: 'Utility Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="8" rx="2"/><path d="M5 11l2.5-6h9L19 11"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>`,
    title: 'MILEAGE TRACKER',
    shortTitle: 'Mileage Tracker — Fuel & Cost',
    subtitle: 'Vehicle Management App · Built with Flutter',
    headerBadges: [{ label: 'Live', type: 'live' }, { label: 'Flutter' }, { label: 'Android' }],
    cardBadges: [{ label: 'Live', type: 'live' }, { label: 'Flutter' }],
    chips: ['Flutter', 'Dart', 'Android', 'SQLite'],
    cardDesc: 'A comprehensive utility app to track vehicle mileage, fuel expenses, and running costs. Designed with intuitive charts to help users monitor fuel efficiency and manage vehicle expenses locally.',
    navExtra: [
      { label: 'Play Store →', href: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage', type: 'live', target: '_blank' }
    ],
    facts: [
      { key: 'Platform', val: 'Android (Flutter)' },
      { key: 'Database', val: 'SQLite Local Storage' },
      { key: 'Category', val: 'Vehicle Utility & Cost' },
      { key: 'Status', val: 'Live on Google Play Store' }
    ],
    techPills: ['Flutter', 'Dart', 'Android SDK', 'SQLite', 'FlChart', 'Local Storage'],
    links: [
      { label: 'Get on Play Store →', href: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage', type: 'primary', target: '_blank' }
    ],
    overview: [
      'Mileage Tracker is a native Android application designed to help vehicle owners log fuel refilling, track fuel efficiency (km/L or MPG), and monitor running costs over time.',
      'Built with Flutter and SQLite, all fuel logs remain 100% offline and private on the user device, featuring interactive line charts for monthly expenditure trends.'
    ],
    features: [
      { name: 'Fuel & Odometer Logs', desc: 'Quick entry for fuel volume, cost per liter, and odometer readings.' },
      { name: 'Fuel Efficiency Chart', desc: 'Real-time calculation of distance per liter with monthly trend graphs.' },
      { name: 'Cost Breakdown', desc: 'Categorize expenses into fuel, maintenance, and toll charges.' },
      { name: 'Offline SQLite DB', desc: 'Zero cloud latency — all records remain safe on your device.' }
    ],
    challenge: 'Handling partial fuel fill-ups and non-consecutive odometer readings required custom delta calculations to ensure distance calculations remained accurate.',
    autoplay: 4000,
    carousel: [
      { img: "https://play-lh.googleusercontent.com/Orkv0wMWqx90L2Z021J9Jlt2Xyro0_gSAlVjvc8M0v4Yt-MMWivhq1ezZo4kg9n-CXnJv4a5t14FRgNfhb9iEA", alt: "Mileage Tracker App Screenshot" }
    ],
    detailLink: '/projects/mileage-tracker/',
    liveLink: { href: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage', label: 'Play Store →' },
  },

  /* ── 3. Alomole ────────────────────────────────────────── */
  {
    slug: 'alomole',
    featured: false,
    number: '003',
    edition: 'Chemistry Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><line x1="14.2" y1="9.8" x2="17.5" y2="6.5"/><line x1="9.8" y1="14.2" x2="6.5" y2="17.5"/></svg>`,
    title: 'ALOMOLE',
    shortTitle: 'Alomole — Chemistry Companion',
    subtitle: 'Chemistry Companion App · Built with Flutter',
    headerBadges: [{ label: 'Live', type: 'live' }, { label: 'Flutter Web' }],
    cardBadges: [{ label: 'Live', type: 'live' }, { label: 'Flutter' }],
    chips: ['Flutter', 'Dart', 'Web', 'Firebase'],
    cardDesc: 'Chemistry toolkit app featuring a chemical equation balancer, molarity/normality calculator, and organic reaction explorer. Published and live on the web.',
    navExtra: [
      { label: 'Open App →', href: 'https://alomolecule.web.app', type: 'live', target: '_blank' }
    ],
    facts: [
      { key: 'Platform', val: 'Flutter Web / PWA' },
      { key: 'Backend', val: 'Firebase Hosting' },
      { key: 'Domain', val: 'Chemistry Toolkit' },
      { key: 'Status', val: 'Live Web App' }
    ],
    techPills: ['Flutter', 'Dart', 'WebAssembly', 'Firebase', 'Stoichiometry Math'],
    links: [
      { label: 'Launch Alomole Web →', href: 'https://alomolecule.web.app', type: 'primary', target: '_blank' }
    ],
    overview: [
      'Alomole is a chemistry companion application designed for chemistry students and lab analysts. It offers instant stoichiometry calculations, chemical equation balancing, and organic functional group references.',
      'Built using Flutter Web, it translates complex chemical formulas into interactive mobile and desktop tools.'
    ],
    features: [
      { name: 'Chemical Equation Balancer', desc: 'Balance complex inorganic chemical equations using linear matrix reduction.' },
      { name: 'Molarity & Normality', desc: 'Calculate solute mass for target molar and normal concentrations.' },
      { name: 'Periodic Table Explorer', desc: 'Quick access to atomic mass, electron configurations, and electronegativity.' }
    ],
    challenge: 'Optimizing Flutter Web bundle size and rendering performance for low-bandwidth mobile browsers.',
    autoplay: 4000,
    carousel: [
      { img: "https://lh3.googleusercontent.com/-rURRFo9R_l07WI3aFgQmugfSlbbuPHAEQbB5Akv-HyqRi4sVb8OIIKFgOlIgAN5QSo", alt: "Alomole App Screenshot" }
    ],
    detailLink: '/projects/alomole/',
    liveLink: { href: 'https://alomolecule.web.app', label: 'Open App →' },
  },

  /* ── 4. Virtual Lab Assistant ────────────────────────── */
  {
    slug: 'virtual-lab',
    featured: false,
    number: '004',
    edition: 'Interactive Lab Edition',
    icon: `<svg class="icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
    title: 'VIRTUAL QC LAB',
    shortTitle: 'Virtual QC Laboratory Assistant',
    subtitle: 'Chemistry Calculations & GLP Logger · Built with Pure JS',
    headerBadges: [{ label: 'Interactive', type: 'live' }, { label: 'Pure JS' }],
    cardBadges: [{ label: 'Interactive', type: 'live' }, { label: 'Pure JS' }],
    chips: ['Analytical Chemistry', 'SOP / GLP Standards', 'Volumetric Mathematics', 'Direct SOP PDF Printer'],
    cardDesc: 'An immersive laboratory dashboard demonstrating analytical chemistry and software integration. Select compounds, calculate molarities, cascade serial dilutions, and print formal GLP worksheets.',
    navExtra: [
      { label: 'Launch Lab →', href: '/lab', type: 'live' }
    ],
    facts: [
      { key: 'Framework', val: 'Pure HTML + CSS + Vanilla JS' },
      { key: 'Compliance', val: 'cGMP / GLP Standard' },
      { key: 'Export', val: 'Direct SOP PDF Printer' },
      { key: 'Status', val: 'Live Interactive Workbench' }
    ],
    techPills: ['Vanilla JS', 'CSS Grid', 'Analytical Chemistry', 'Volumetric Math', 'Print SOP Engine'],
    links: [
      { label: 'Open Virtual Lab →', href: '/lab', type: 'primary' }
    ],
    overview: [
      'The Virtual QC Laboratory Assistant is an interactive workbench designed to streamline analytical chemistry workflows and eliminate human calculation errors in Quality Control environments.',
      'Users can formulate reagents, simulate multi-step serial dilutions, plot titration curves, and print GLP-compliant SOP batch records directly.'
    ],
    features: [
      { name: 'Molarity Formulator', desc: 'Compute exact mass required based on solute purity, valence, and target volume.' },
      { name: 'Serial Dilution Cascade', desc: 'Simulate step-by-step concentration decay across multi-tube racks.' },
      { name: 'Titration Curve Simulation', desc: 'Interactive burette simulation with automated equivalence point indicator.' },
      { name: 'Print SOP PDF Sheet', desc: 'Generate printable GLP batch records with analyst signature blocks.' }
    ],
    challenge: 'Implementing exact print stylesheet media queries to transform interactive Web GLP cards into formal A4 paper records.',
    autoplay: 4000,
    carousel: [
      { bg: 'var(--surface2)', icon: `<svg class="icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`, label: 'VIRTUAL QC WORKBENCH' }
    ],
    detailLink: '/lab/',
    liveLink: { href: '/lab/', label: 'Open Lab →' },
  }

];
