export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: "academic" | "technical" | "leadership";
  description: string[];
  skills: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: "msc-researcher",
    role: "M.Sc. Chemistry Scholar",
    organization: "Department of Chemistry, Rabindranath Tagore University",
    location: "Hojai, Assam",
    period: "2025 – Present",
    type: "academic",
    description: [
      "Conducting postgraduate coursework in advanced physical, organic, and coordination chemistry.",
      "Participating in department seminars, literature discussions, and laboratory instrumentation sessions.",
      "Strengthening analytical methodologies, spectroscopic interpretation, and scientific experimental planning.",
    ],
    skills: ["Advanced Organic Chemistry", "Spectroscopy", "Coordination Chemistry", "Literature Review"],
  },
  {
    id: "bsc-dissertation",
    role: "Undergraduate Chemistry Researcher & Dissertation Fellow",
    organization: "Rabindranath Tagore University",
    location: "Hojai, Assam",
    period: "2024 – 2025",
    type: "academic",
    description: [
      "Conducted independent research on 'Phytochemical Analysis of Medicinal Plants in Local Localities'.",
      "Performed wet chemical screening for alkaloids, tannins, flavonoids, and saponins across local plant specimens.",
      "Optimized TLC solvent systems and generated formal SOP-formatted laboratory reports.",
      "Maintained laboratory safety, chemical inventories, and analytical glassware calibration standards.",
    ],
    skills: ["Phytochemical Screening", "Thin Layer Chromatography", "Volumetric Analysis", "GLP / SOP"],
  },
  {
    id: "independent-software-dev",
    role: "Independent App Developer & Creator",
    organization: "Self-Directed / Google Play",
    location: "Hojai, Assam",
    period: "2023 – Present",
    type: "technical",
    description: [
      "Architected, tested, and published cross-platform mobile utilities on the Google Play Store (e.g., Mileage Tracker).",
      "Created domain-specific web applications for chemistry students (Alomole Chemistry Companion).",
      "Demonstrated end-to-end product delivery: UI design, state management, local database schemas (SQLite), and production deployment.",
    ],
    skills: ["Flutter", "Dart", "SQLite", "Next.js", "TypeScript", "Google Play Console"],
  },
];
