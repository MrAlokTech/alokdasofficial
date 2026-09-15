export interface ChemistrySkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    level: "Core" | "Proficient" | "Familiar";
    description?: string;
  }[];
}

export interface DissertationDetails {
  title: string;
  degree: string;
  institution: string;
  year: string;
  advisor: string;
  status: string;
  overview: string;
  problemStatement: string;
  methodology: string[];
  keyFindings: string[];
  skillsApplied: string[];
}

export const dissertationData: DissertationDetails = {
  title: "A Study on Frequently Used Medicinal Plant Leaves in the Village Area of Jamuhandal of Hojai District and Their Phytochemical Analysis",
  degree: "B.Sc. 6th Semester Project Work Report (Chemistry)",
  institution: "Rabindranath Tagore University, Hojai, Assam",
  year: "2025",
  advisor: "Dr. Sujit Ranjan Acharjee, Associate Professor, Department of Chemistry",
  status: "Completed & Submitted (23.06.2025)",
  overview: "A field-based survey (April–June 2025) of five medicinal plants commonly used by residents of Jamuhandal village, Hojai district, Assam — Neem, Lemon, Sajona (Moringa), Creeping Woodsorrel, and Thankuni (Centella asiatica) — followed by qualitative phytochemical screening of their aqueous leaf extracts.",
  problemStatement: "Rural communities in North-East India, including Jamuhandal, rely heavily on locally available medicinal plants for primary healthcare, yet the specific phytochemical constituents responsible for their therapeutic properties are often undocumented for these particular local specimens.",
  methodology: [
    "Ethnobotanical field survey (April–June 2025) with local residents and traditional healers to identify frequently used medicinal plants; herbarium preparation and identification with the Department of Botany, RTU.",
    "Leaves washed, shade-dried under pressure for 2 weeks, and ground to a powder using a mortar/electric blender.",
    "Aqueous extraction: 5 g of powdered sample soaked in 100 ml distilled water for 72 hours, filtered through Whatman filter paper, then centrifuged to obtain a clear extract.",
    "Qualitative phytochemical screening of each extract: chloroform/conc. H2SO4 test for steroids, 1% lead acetate test for tannins, froth test for saponins, dilute NH3/conc. H2SO4 test for flavonoids, and Wagner's reagent test for alkaloids.",
  ],
  keyFindings: [
    "Steroids and saponins were present in the aqueous extracts of all five plants (Neem, Lemon, Sajona, Creeping Woodsorrel, Thankuni).",
    "Tannins were detected only in Neem; flavonoids were present in Neem, Creeping Woodsorrel, and Thankuni, but absent in Lemon and Sajona.",
    "Alkaloids were absent (no red precipitate with Wagner's reagent) across all five plant samples tested.",
  ],
  skillsApplied: [
    "Ethnobotanical Field Survey",
    "Herbarium Preparation",
    "Aqueous Extraction",
    "Qualitative Phytochemical Screening",
    "Laboratory Documentation & Reporting",
  ],
};

export const chemistrySkillsData: ChemistrySkillCategory[] = [
  {
    category: "Analytical & Wet Chemical Techniques",
    description: "Core analytical methodologies for compound identification, concentration measurement, and separation.",
    skills: [
      { name: "Qualitative & Quantitative Chemical Analysis", level: "Core", description: "Systematic cation/anion analysis, elemental tests, and gravimetric estimations." },
      { name: "Volumetric Titrations", level: "Core", description: "Acid-base, complexometric, and redox titrations with indicator/potentiometric endpoints." },
      { name: "Thin Layer Chromatography (TLC)", level: "Core", description: "Rf value determination, solvent system optimization, and spot visualization under UV/iodine." },
      { name: "Column Chromatography", level: "Proficient", description: "Separation and purification of synthetic and natural product mixtures." },
      { name: "UV-Visible Spectrophotometry", level: "Proficient", description: "Beer-Lambert law applications, absorbance measurement, and calibration curves." },
    ],
  },
  {
    category: "Laboratory Operations & Safety",
    description: "Hands-on bench experience, solution preparation, equipment handling, and safety protocol adherence.",
    skills: [
      { name: "Reagent Preparation & Standardization", level: "Core", description: "Accurate preparation of molar, normal, and buffer solutions with primary standards." },
      { name: "Serial Dilution & Pipetting", level: "Core", description: "Precision volumetric dilution handling with calibrated glassware." },
      { name: "Solvent Extraction & Refluxing", level: "Core", description: "Liquid-liquid extraction, Soxhlet operation, and continuous reflux setups." },
      { name: "GLP & SOP Adherence", level: "Core", description: "Adherence to Good Laboratory Practice principles and standard operating protocols." },
      { name: "Chemical Hazard & MSDS Safety", level: "Proficient", description: "Safe storage, chemical compatibility checks, and spill management protocols." },
    ],
  },
  {
    category: "Quality Control & Documentation",
    description: "Structured record-keeping, batch testing awareness, data reproducibility, and report preparation.",
    skills: [
      { name: "Scientific Report Writing", level: "Core", description: "Preparation of formal dissertation reports, experimental summaries, and findings." },
      { name: "Data Recording & Error Analysis", level: "Core", description: "Experimental variance tracking, standard deviation, and recovery percentage calculations." },
      { name: "QC Calibration Records", level: "Proficient", description: "Maintaining calibration logs for digital balances, pH meters, and laboratory glassware." },
    ],
  },
];

export const academicFocusData = [
  {
    title: "Organic Reaction Mechanisms",
    description: "Nucleophilic substitutions, eliminations, electrophilic aromatic additions, pericyclic reactions, and stereochemical pathways.",
  },
  {
    title: "Coordination & Transition Chemistry",
    description: "Crystal field theory, ligand field effects, spectral transitions, and bioinorganic catalytic complexes.",
  },
  {
    title: "Physical Chemistry & Thermodynamics",
    description: "Reaction kinetics, chemical equilibria, phase rule, electrochemistry, and spectroscopic state transitions.",
  },
  {
    title: "Spectroscopic Interpretation",
    description: "Structure elucidation using combined analytical data: UV-Vis, fundamental IR absorption bands, and basic 1H-NMR principles.",
  },
];
