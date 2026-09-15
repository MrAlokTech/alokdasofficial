export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: "chemistry" | "web" | "flutter" | "tools";
  categoryLabel: string;
  featured: boolean;
  year: string;
  description: string;
  problem: string;
  solution: string;
  technologies: string[];
  role: string;
  outcome: string;
  liveUrl?: string;
  playStoreUrl?: string;
  githubUrl?: string;
  relatedArticleSlug?: string;
  relatedArticleTitle?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "phytochemical-screening",
    title: "Phytochemical Screening of Medicinal Plant Leaves in Jamuhandal, Hojai",
    subtitle: "6th Semester B.Sc. Chemistry Project Work Report",
    category: "chemistry",
    categoryLabel: "Chemistry & Research",
    featured: true,
    year: "2025",
    description: "Field survey and qualitative phytochemical screening of five medicinal plants used by residents of Jamuhandal village, Hojai district, Assam — testing aqueous leaf extracts for steroids, tannins, saponins, flavonoids, and alkaloids.",
    problem: "Rural households in Jamuhandal rely on locally available plants for primary healthcare, but the specific phytochemical constituents behind their traditional medicinal uses were undocumented for these local specimens.",
    solution: "Conducted an ethnobotanical field survey to identify frequently used plants, prepared herbarium specimens, and carried out aqueous extraction followed by standard qualitative reagent tests (chloroform/H2SO4 for steroids, lead acetate for tannins, froth test for saponins, NH3/H2SO4 for flavonoids, Wagner's reagent for alkaloids).",
    technologies: ["Analytical Chemistry", "Aqueous Extraction", "Qualitative Phytochemical Tests", "Herbarium Preparation", "Ethnobotanical Survey"],
    role: "Lead Student Researcher",
    outcome: "Submitted dissertation (23.06.2025) under supervision of Dr. Sujit Ranjan Acharjee, RTU Department of Chemistry; confirmed steroids and saponins in all five plants, tannins in Neem only, flavonoids in three of five plants, and alkaloids absent across all samples.",
    relatedArticleSlug: "phytochemical-screening-methods",
    relatedArticleTitle: "Standard Phytochemical Screening Protocols for Secondary Metabolites",
  },
  {
    id: "alomole-chemistry-tool",
    title: "Alomole — Chemistry Companion",
    subtitle: "Domain-Specific Chemistry Toolkit for Students & Labs",
    category: "chemistry",
    categoryLabel: "Chemistry & Software",
    featured: true,
    year: "2025",
    description: "A digital toolkit integrating chemical equation balancing, molarity/normality preparation math, and molecular weight computations into a fast web app.",
    problem: "Stoichiometry conversions, redox equation balancing, and volumetric solution prep math are prone to manual calculation errors in standard student labs.",
    solution: "Built a specialized algorithmic engine in Dart and Flutter that balances multi-element chemical equations and computes exact solution formulations.",
    technologies: ["Flutter for Web", "Dart", "Firebase", "Stoichiometry Math", "Reactive State"],
    role: "Developer & Domain Expert",
    outcome: "Deployed live at alomolecule.web.app, widely used by peers for rapid bench calculations.",
    liveUrl: "https://alomolecule.web.app",
    relatedArticleSlug: "balancing-chemical-equations-algorithm",
    relatedArticleTitle: "Matrix Method for Balancing Complex Redox Reactions in Dart",
  },
  {
    id: "mileage-tracker-app",
    title: "Mileage Tracker — Fuel & Cost",
    subtitle: "Privacy-First Android Vehicle Management Utility",
    category: "flutter",
    categoryLabel: "Flutter Mobile App",
    featured: true,
    year: "2024",
    description: "An offline-first Android application published on Google Play that enables users to track vehicle mileage, monitor fuel prices, and inspect expense graphs.",
    problem: "Existing automotive logging apps are overburdened with ads, mandatory accounts, and confusing telemetry.",
    solution: "Created an elegant, responsive mobile application with local SQLite storage, visual expense analytics, and instant fuel economy metrics.",
    technologies: ["Flutter", "Dart", "SQLite", "Google Play Console", "Material 3"],
    role: "Sole Creator & Publisher",
    outcome: "Published on the Google Play Store with 100% crash-free sessions and positive user feedback.",
    playStoreUrl: "https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage",
    relatedArticleSlug: "offline-first-flutter-architecture",
    relatedArticleTitle: "Architecting Offline-First Mobile Apps with Flutter, SQLite, and Riverpod",
  },
  {
    id: "virtual-qc-lab",
    title: "Virtual QC Laboratory Assistant",
    subtitle: "Analytical Chemistry Dilution & GLP Log Generator",
    category: "chemistry",
    categoryLabel: "Chemistry & Web",
    featured: false,
    year: "2026",
    description: "An interactive browser-based dashboard that automates volumetric serial dilutions, normality-to-molarity conversions, and exports printable GLP worksheets.",
    problem: "Maintaining manual paper logs for multi-step dilution series in student or small QC labs leads to transcript errors and formatting inconsistencies.",
    solution: "Engineered a pure client-side mathematical simulator that calculates exact aliquots for dilution cascades and formats formal Good Laboratory Practice records.",
    technologies: ["TypeScript", "Analytical Mathematics", "Tailwind CSS", "PDF Generation", "GLP Standards"],
    role: "Creator & Designer",
    outcome: "Accelerates routine laboratory prep calculations while standardizing record generation.",
  },
  {
    id: "gate-cy-companion",
    title: "GATE Chemistry (CY) Exam Companion",
    subtitle: "Structured Syllabus & Problem Tracker for Graduate Aspirants",
    category: "tools",
    categoryLabel: "Academic Utility",
    featured: false,
    year: "2026",
    description: "A customized preparation tool mapping the entire syllabus of Physical, Organic, and Inorganic Chemistry for the national Graduate Aptitude Test in Engineering.",
    problem: "Navigating extensive advanced chemistry syllabi across multiple sub-disciplines requires disciplined topic tracking and structured revision schedules.",
    solution: "Built an interactive syllabus hierarchy, formula reference checklist, and topic mastery tracker.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Local Storage"],
    role: "Creator & Curator",
    outcome: "Provides systematic revision workflows for national postgraduate chemistry exams.",
  },
];
