/**
 * js/projects-data.js — Single source of truth for ALL projects.
 * Used by:
 *   - js/projects-grid.js  → renders work cards on index.html
 *   - js/project-renderer.js → renders full detail pages
 *
 * HOW TO ADD A NEW PROJECT:
 *   1. Push a new object into window.PROJECTS_DATA below.
 *   2. Create projects/<slug>/index.html — copy the shell from any
 *      existing project page and change only <title> + <meta description>.
 *   3. Done — card + detail page auto-render from this data.
 *
 * FIELD REFERENCE:
 *   slug         — URL segment: projects/<slug>/
 *   number       — "001", "002" … shown in issue badge
 *   edition      — text after "Project #XXX —" in badge
 *   icon         — emoji shown in header
 *   title        — full project title (may include <br>)
 *   shortTitle   — plain text title for the index card
 *   subtitle     — one-line description under the big title
 *   cardBadges   — badges shown on the index.html card (array of {label, type?})
 *   chips        — tech/category chips on the index card
 *   cardDesc     — short text in the index card
 *   autoplay     — carousel autoplay interval in ms
 *   carousel     — array of {bg, icon, label} or {img, alt} slide objects
 *   detailLink   — href for the "View Details" button
 *   liveLink     — optional {href, label} for the secondary button on the card
 *   headerBadges — badges shown in the detail page header (array of {label, type?})
 *   facts        — array of {key, val} for the Quick Facts card
 *   techTitle    — sidebar card title (e.g. "🛠️ TECH STACK" or "🔬 TECHNIQUES USED")
 *   techPills    — array of strings for the tech/technique pills
 *   extraSidebar — optional extra sidebar card: {title, pills: []}
 *   links        — array of {href, label, type, target?} for the Links sidebar card
 *   navExtra     — optional array of {href, label, type, target?} extra nav buttons
 *   overviewTitle — e.g. "📱 OVERVIEW"
 *   overview     — array of HTML strings (each becomes a <p>)
 *   galleryTitle — e.g. "📸 APP SCREENSHOTS"
 *   featuresTitle — e.g. "✨ KEY FEATURES"
 *   features     — array of {icon, name, desc}
 *   challengeTitle — e.g. "🛠️ ENGINEERING CHALLENGE"
 *   challenge    — HTML string for the dark box at the bottom
 *   footerLine2  — second line in the detail page footer
 *   footerLive   — optional {href, label} for a footer live link
 */

window.PROJECTS_DATA = [

  /* ── 1. Phytochemical Analysis ────────────────────────── */
  {
    slug: 'phytochemical',
    number: '001',
    edition: 'Research Edition 🌿',
    icon: '🌿',
    title: 'PHYTOCHEMICAL<br>ANALYSIS',
    shortTitle: 'Phytochemical Analysis of Medicinal Plants',
    subtitle: 'Medicinal Plant Screening · Final Year Dissertation',
    cardBadges: [{ label: '🎓 Research', type: 'research' }, { label: '2025' }],
    chips: ['Analytical Chemistry', 'TLC', 'GLP / SOP', 'Qualitative Testing'],
    cardDesc: 'Final-year B.Sc. dissertation — systematic phytochemical screening of local medicinal plants. Designed a solvent extraction protocol, detected alkaloids, flavonoids, tannins &amp; saponins, and documented all results in structured lab reports adhering to SOP-like formats.',
    autoplay: 4500,
    carousel: [
      { bg: 'linear-gradient(135deg,#0D3B1E,#1B6B3A)', icon: '🌿', label: 'PLANT SAMPLE COLLECTION' },
      { bg: 'linear-gradient(135deg,#2B1A4F,#5C3D99)', icon: '🧫', label: 'SOLVENT EXTRACTION' },
      { bg: 'linear-gradient(135deg,#4A1A00,#8B3A00)', icon: '🔬', label: 'CHROMATOGRAPHIC ANALYSIS' },
      { bg: 'linear-gradient(135deg,#00214A,#004B8C)', icon: '📋', label: 'SOP DOCUMENTATION' },
    ],
    detailLink: '/projects/phytochemical/',
    liveLink: null,
    headerBadges: [
      { label: '🎓 Research', type: 'research' },
      { label: 'B.Sc. Chemistry' },
      { label: '2025' },
      { label: 'Rabindranath Tagore University' },
    ],
    facts: [
      { key: 'Type', val: 'Academic Dissertation' },
      { key: 'Year', val: '2025' },
      { key: 'Institution', val: 'Rabindranath Tagore University, Hojai' },
      { key: 'Degree', val: 'B.Sc. Chemistry (Final Year)' },
      { key: 'Status', val: 'Completed ✅' },
    ],
    techTitle: '🔬 TECHNIQUES USED',
    techPills: ['Solvent Extraction', 'TLC', 'Paper Chromatography', 'Qualitative Tests', 'pH Measurement', 'Gravimetric Analysis', 'GLP / SOP', 'Lab Notebook'],
    extraSidebar: {
      title: '🌿 PHYTOCHEMICALS',
      pills: ['Alkaloids', 'Flavonoids', 'Tannins', 'Saponins', 'Steroids', 'Terpenoids'],
    },
    links: [
      { href: '/#contact', label: '📄 Request Report', type: 'secondary' },
    ],
    navExtra: [
      { href: '/resume', label: '📄 View Resume', type: 'github' },
    ],
    overviewTitle: '⚗️ OVERVIEW',
    overview: [
      'For my B.Sc. Chemistry final year dissertation, I conducted a systematic <strong>phytochemical screening</strong> of locally sourced medicinal plants. The study aimed to identify the presence of bioactive secondary metabolites — the chemical compounds responsible for a plant\'s medicinal properties.',
      'I designed and followed a complete lab protocol: plant sample collection and drying, successive solvent extraction (petroleum ether → ethanol → water), and then qualitative screening tests for each class of phytochemical. All experimental observations and results were documented in structured reports adhering to <strong>SOP-like formats</strong>, reinforcing Good Laboratory Practice habits.',
    ],
    galleryTitle: '📸 PROCESS GALLERY',
    featuresTitle: '🧪 KEY HIGHLIGHTS',
    features: [
      { icon: '🧪', name: 'Extraction Protocol', desc: 'Designed a multi-step sequential solvent extraction using petroleum ether, ethanol, and water to isolate different classes of phytochemicals.' },
      { icon: '🔍', name: 'Qualitative Screening', desc: 'Performed standard colour and precipitation tests (Mayer\'s, Dragendroff\'s, FeCl₃, Molisch\'s) to identify 6 classes of bioactive compounds.' },
      { icon: '📊', name: 'TLC Analysis', desc: 'Used thin-layer chromatography to separate and confirm the presence of alkaloids and flavonoids, with Rf value calculation.' },
      { icon: '📋', name: 'SOP Documentation', desc: 'All steps, observations, calculations, and conclusions were documented in structured lab reports following GLP / SOP-inspired formats.' },
    ],
    challengeTitle: '🎓 WHAT I LEARNED',
    challenge: 'This project gave me hands-on experience with the full lifecycle of an analytical chemistry study — from sample preparation and instrument calibration through to data documentation and result interpretation. It reinforced the importance of <strong>data integrity (ALCOA principles)</strong> and how meticulous documentation is as critical as the lab work itself. These skills are directly transferable to <strong>Quality Control Analyst roles</strong> in pharmaceutical, food, or chemical manufacturing environments.',
    footerLine2: 'B.Sc. Chemistry — Research Project',
    footerLive: null,
  },

  /* ── 2. Alomole ────────────────────────────────────────── */
  {
    slug: 'alomole',
    number: '002',
    edition: 'Chemistry Edition ⚗️',
    icon: '⚗️',
    title: 'ALOMOLE',
    shortTitle: 'Alomole — Chemistry Companion',
    subtitle: 'Chemistry Companion App · Built with Flutter',
    cardBadges: [{ label: '🚀 Live', type: 'live' }, { label: 'Flutter' }],
    chips: ['Flutter', 'Dart', 'Web', 'Firebase'],
    cardDesc: 'Chemistry toolkit app featuring a chemical equation balancer, molarity/normality calculator, and organic reaction explorer. Built chemistry domain knowledge directly into the tool — published and live on the web.',
    autoplay: 4000,
    carousel: [
      {
        img: "https://lh3.googleusercontent.com/-rURRFo9R_l07WI3aFgQmugfSlbbuPHAEQbB5Akv-HyqRi4sVb8OIIKFgOlIgAN5QSo", alt: "Alomole app screenshot showing the chemical equation balancer interface, with input fields for reactants and products, a 'Balance' button, and a step-by-step solution output.",
      }
    ],
    detailLink: '/projects/alomole/',
    liveLink: { href: 'https://alomolecule.web.app', label: '🌐 Open App' },
    headerBadges: [
      { label: '🚀 Live', type: 'live' },
      { label: 'Flutter / Dart' },
      { label: 'Web App' },
      { label: 'Firebase Hosting' },
    ],
    facts: [
      { key: 'Type', val: 'Web App (Flutter)' },
      { key: 'Platform', val: 'Web (PWA-ready)' },
      { key: 'Status', val: 'Live ✅' },
      { key: 'Hosting', val: 'Firebase Hosting' },
      { key: 'Domain', val: 'alomolecule.web.app' },
    ],
    techTitle: '🛠️ TECH STACK',
    techPills: ['Flutter', 'Dart', 'Firebase', 'Material Design 3', 'Provider', 'Chemistry Domain'],
    extraSidebar: null,
    links: [
      { href: 'https://alomolecule.web.app', label: '🌐 Open App', type: 'primary', target: '_blank' },
      { href: '/#contact', label: '💬 Give Feedback', type: 'secondary' },
    ],
    navExtra: [
      { href: 'https://alomolecule.web.app', label: '🌐 Open Live App', type: 'live', target: '_blank' },
    ],
    overviewTitle: '⚗️ OVERVIEW',
    overview: [
      'As a BSc Chemistry student, my workflow used to be a mess of fragmented tools. Balancing an equation required one website, calculating molarity meant opening a specific app, and finding physical properties or organic reaction mechanisms required digging through half a dozen browser tabs.',
      'I realized that if I was struggling with this digital clutter, other students and educators were too. That frustration sparked a clear objective: build a single, unified platform containing every core tool a chemistry student actually needs.',
      'The result is Alomole, an all-in-one chemistry companion designed to bridge the gap between theoretical study and practical lab work, built completely free and without ads to give back to the academic community.',
    ],
    galleryTitle: '📸 APP GALLERY',
    featuresTitle: '✨ KEY FEATURES',
    features: [
      { icon: '⚖️', name: 'Equation Balancer', desc: 'Automatically balances chemical equations using matrix algebra. Handles complex ionic and organic equations with step-by-step output.' },
      { icon: '🧮', name: 'Molarity Calculator', desc: 'Calculate molarity, normality, molality, and perform dilution calculations. Unit-aware with real-time conversion.' },
      { icon: '🔗', name: 'Organic Reactions', desc: 'Reference explorer for common organic reaction mechanisms — searchable by reaction type, reagent, or functional group.' },
    ],
    challengeTitle: '🛠️ HOW IT WAS BUILT',
    challenge: 'Building Alomole was a deep dive into both Flutter development and the chemistry domain. I had to implement complex algorithms for equation balancing and unit conversions, while also designing an intuitive UI that could present dense information clearly. The project was built iteratively — starting with core features like the equation balancer, then expanding to additional tools based on user feedback. Hosting on Firebase made deployment and updates seamless, allowing me to focus on improving the app rather than infrastructure.',
    footerLine2: 'Flutter / Dart · Firebase Hosting',
    footerLive: { href: 'https://alomolecule.web.app', label: '🌐 alomolecule.web.app' },
  },

  /* ── 3. Mileage Tracker ────────────────────────────────── */
  {
    slug: 'mileage-tracker',
    number: '003',
    edition: 'Utility Edition 🚗',
    icon: '🚗',
    title: 'MILEAGE TRACKER',
    shortTitle: 'Mileage Tracker — Fuel & Cost',
    subtitle: 'Vehicle Management App · Built with Flutter',
    cardBadges: [{ label: '🚀 Live', type: 'live' }, { label: 'Flutter' }],
    chips: ['Flutter', 'Dart', 'Android', 'SQLite'],
    cardDesc: 'A comprehensive utility app to track vehicle mileage, fuel expenses, and running costs. Designed with intuitive charts to help users monitor fuel efficiency and manage vehicle expenses locally.',
    autoplay: 4000,
    carousel: [
      {
        img: "https://play-lh.googleusercontent.com/Orkv0wMWqx90L2Z021J9Jlt2Xyro0_gSAlVjvc8M0v4Yt-MMWivhq1ezZo4kg9n-CXnJv4a5t14FRgNfhb9iEA", alt: "Snap1",
      },
      { img: "https://play-lh.googleusercontent.com/eiC_tQC8mHf9B-YffA0x0qqRjRbNoemmrtF26kUghkNizxUl2YH2vrS-Ay9Fqefg7yeka38l6-ioV4L5vrs_", alt: "Snap2", },
      { img: "https://play-lh.googleusercontent.com/joIojg23DbQCgVGe0oGvvBl45NjJaCPYZyZvH9v_8X4G36QNLairMH0RwMp2zUoyig-l66XKWmyGF0kz11UndA", alt: "Snap3", },
      { img: "https://play-lh.googleusercontent.com/EPSFyAqcrZGTIHa2pcDKJseUDb4_jchVeTpr3QjHaBzDJrnfAv87HBfxe355FzNzhkI83CEP4FT2lgE2wXnkYg", alt: "Snap4", },
      { img: "https://play-lh.googleusercontent.com/zEq9jUQ4ehKrI18sfVCzQaEy16F9F_lxiyiyY11OVGI8HpsgFay1315gPAAMD4aFM7RgRNUloHfBzh9PMpREY-o", alt: "Snap5", }

    ],
    detailLink: '/projects/mileage-tracker/',
    liveLink: { href: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage', label: '📱 Play Store' },
    headerBadges: [
      { label: '🚀 Live', type: 'live' },
      { label: 'Flutter / Dart' },
      { label: 'Android App' },
      { label: 'Google Play' },
    ],
    facts: [
      { key: 'Type', val: 'Mobile App (Flutter)' },
      { key: 'Platform', val: 'Android' },
      { key: 'Status', val: 'Live ✅' },
      { key: 'Store', val: 'Google Play Store' },
      { key: 'Category', val: 'Auto & Vehicles' },
    ],
    techTitle: '🛠️ TECH STACK',
    techPills: ['Flutter', 'Dart', 'SQLite', 'Charts', 'Material Design 3', 'Local Storage'],
    extraSidebar: null,
    links: [
      { href: 'https://mileage.alokdasofficial.in', label: '📱 View online', type: 'primary', target: '_blank' },
      { href: '/#contact', label: '💬 Give Feedback', type: 'secondary' },
    ],
    navExtra: [
      { href: 'https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage', label: '📱 Get it on Play Store', type: 'live', target: '_blank' },
    ],
    overviewTitle: '🚗 OVERVIEW',
    overview: [
      'Managing vehicle expenses and monitoring fuel efficiency can quickly become a tedious chore if relying on scattered notes, mental math, or complex spreadsheets.',
      'Mileage Tracker: Fuel & Cost was built to solve this exact problem. The goal was to create a clean, user-friendly utility that allows vehicle owners to instantly log their fill-ups, track their running costs, and have their fuel efficiency calculated automatically.',
      'Whether you are managing a personal car, a motorcycle, or keeping tabs on a daily commuter, the app provides visual insights and clear data to help you understand where your money is going and how your vehicle is performing over time.'
    ],
    galleryTitle: '📸 APP GALLERY',
    featuresTitle: '✨ KEY FEATURES',
    features: [
      { icon: '⛽', name: 'Fuel Logging', desc: 'Quickly log fill-ups with essential details like odometer readings, fuel volume, and total cost with a streamlined UI.' },
      { icon: '📈', name: 'Efficiency Analytics', desc: 'Automatically calculates your vehicle\'s fuel efficiency based on sequential odometer entries and fuel inputs.' },
      { icon: '💰', name: 'Expense Tracking', desc: 'Monitor your total spending on fuel and isolate how much your vehicle actually costs to run per distance unit.' },
      { icon: '📊', name: 'Visual Charts', desc: 'View intuitive graphs and data visualizations to spot trends in your fuel consumption and seasonal expenses.' },
    ],
    challengeTitle: '🛠️ HOW IT WAS BUILT',
    challenge: 'Building Mileage Tracker focused heavily on user experience and robust local data management. I utilized Flutter to create a responsive, native-feeling Android application. A core challenge was designing a reliable local database schema (using SQLite) capable of handling continuous sequential data—like odometer readings—to accurately calculate efficiency between varying fill-ups. The app was engineered with a privacy-first approach, ensuring all state management and data storage happens locally and offline so user data remains entirely in their own hands.',
    footerLine2: 'Flutter / Dart · Android',
    footerLive: { href: 'https://play.google.com/store/apps/dev?id=6525734462153266152', label: '📱 Google Play Store' },
  },


];
