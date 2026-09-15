export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  score: string;
  status: "ongoing" | "completed";
  highlights: string[];
}

export const educationData: EducationItem[] = [
  {
    id: "msc-chem",
    degree: "Master of Science (M.Sc.)",
    field: "Chemistry",
    institution: "Rabindranath Tagore University",
    location: "Hojai, Assam",
    startYear: "2025",
    endYear: "Present",
    score: "Ongoing",
    status: "ongoing",
    highlights: [
      "Advanced organic, inorganic, and physical chemistry coursework",
      "Specialized laboratory training and scientific literature review",
      "Focus on analytical instrumentation and research methodologies",
    ],
  },
  {
    id: "bsc-chem",
    degree: "Bachelor of Science (B.Sc.)",
    field: "Chemistry",
    institution: "Rabindranath Tagore University",
    location: "Hojai, Assam",
    startYear: "2022",
    endYear: "2025",
    score: "69.07%",
    status: "completed",
    highlights: [
      "Final semester dissertation on Phytochemical Screening of Medicinal Plants",
      "Core training in qualitative and quantitative wet chemical analysis",
      "Solid foundation in volumetric analysis, titrations, and chemical synthesis",
    ],
  },
  {
    id: "hs-science",
    degree: "Higher Secondary (10+2)",
    field: "Science Stream",
    institution: "Jawahar Navodaya Vidyalaya",
    location: "Karbi Anglong, Assam",
    startYear: "2020",
    endYear: "2022",
    score: "78.80%",
    status: "completed",
    highlights: [
      "Core subjects: Chemistry, Physics, Mathematics, Biology",
      "Rigorous residential academic environment",
    ],
  },
  {
    id: "secondary",
    degree: "Secondary School Examination (10th)",
    field: "General Academics",
    institution: "Jawahar Navodaya Vidyalaya",
    location: "Karbi Anglong, Assam",
    startYear: "2015",
    endYear: "2020",
    score: "64.20%",
    status: "completed",
    highlights: [
      "Strong foundation in basic natural sciences and mathematics",
    ],
  },
];
