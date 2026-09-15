export interface AppCaseStudy {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  platform: string;
  status: "published" | "active" | "in-development";
  playStoreUrl?: string;
  webUrl?: string;
  githubUrl?: string;
  category: "Mobile App" | "Web App" | "Scientific Tool";
  technologies: string[];
  problem: string;
  solution: string;
  keyFeatures: string[];
  technicalHighlights: string[];
  role: string;
  relatedArticleSlug?: string;
  relatedArticleTitle?: string;
  relatedProjectId?: string;
}

export const appsData: AppCaseStudy[] = [
  {
    id: "mileage-tracker",
    name: "Mileage Tracker — Fuel & Cost",
    badge: "Published on Google Play",
    tagline: "A lightweight, privacy-first mobile utility to log vehicle mileage, analyze fuel efficiency, and monitor running costs.",
    platform: "Android / Google Play",
    status: "published",
    playStoreUrl: "https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage",
    category: "Mobile App",
    technologies: ["Flutter", "Dart", "SQLite", "Material Design 3", "Android SDK"],
    problem: "Most vehicle tracking apps are bloated with ads, require compulsory cloud accounts, or fail to work seamlessly offline during road travel.",
    solution: "Engineered a clean, zero-clutter Flutter application with a local-first SQLite database that allows drivers to log fill-ups instantly, calculating exact kilometers-per-liter efficiency and average cost per kilometer.",
    keyFeatures: [
      "Instant fuel log entry: odometer reading, fuel quantity, total cost",
      "Automatic mileage calculations between consecutive fill-ups",
      "Interactive expense trends and monthly expenditure breakdowns",
      "100% offline data privacy using local device storage",
      "Clean Material 3 UI supporting both light and dark themes",
    ],
    technicalHighlights: [
      "Designed an efficient relational schema in SQLite for instantaneous aggregate queries",
      "Implemented state management with robust validation handling edge cases (e.g. missed fill-ups)",
      "Adhered to Google Play Store production release policies, target SDK standards, and signing pipelines",
    ],
    role: "Solo Designer & Flutter Developer",
    relatedArticleSlug: "offline-first-flutter-architecture",
    relatedArticleTitle: "Architecting Offline-First Mobile Apps with Flutter, SQLite, and Riverpod",
    relatedProjectId: "mileage-tracker-app",
  },
  {
    id: "alomole",
    name: "Alomole — Chemistry Companion",
    badge: "Chemistry Web Application",
    tagline: "A dedicated digital companion bridging chemistry calculations, equation balancing, and laboratory solutions.",
    platform: "Web & Progressive Web App",
    status: "active",
    webUrl: "https://alomolecule.web.app",
    category: "Scientific Tool",
    technologies: ["Flutter for Web", "Dart", "Firebase Hosting", "Responsive Design"],
    problem: "Chemistry students and lab personnel often waste time performing repetitive stoichiometry conversions, molecular weight summations, and solution preparation math by hand.",
    solution: "Developed an interactive scientific companion that computes molarities, balances complex redox and stoichiometric chemical equations, and provides rapid organic reaction references.",
    keyFeatures: [
      "Stoichiometric chemical equation balancer with integer coefficient solver",
      "Molarity, Normality, and Molality solution preparation calculator",
      "Molecular mass and elemental percentage composition breakdown",
      "Quick-reference cheat sheet for organic functional group transformations",
    ],
    technicalHighlights: [
      "Translates chemical formula strings into stoichiometric matrix systems for mathematical balancing",
      "Compiled with Flutter Web canvas and HTML renderers for cross-device responsiveness",
      "Zero-latency client-side calculations with no backend dependency",
    ],
    role: "Sole Creator & Developer",
    relatedArticleSlug: "balancing-chemical-equations-algorithm",
    relatedArticleTitle: "Matrix Method for Balancing Complex Redox Reactions in Dart",
    relatedProjectId: "alomole-chemistry-tool",
  },
];
