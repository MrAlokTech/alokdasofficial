import { getPhoneFormatted, getPhoneRaw } from "@/lib/contact-obfuscate";

export interface PersonalData {
  name: string;
  firstName: string;
  lastName: string;
  tagline: string;
  brandStatement: string;
  location: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
    full: string;
  };
  contact: {
    email: string;
    phoneFormatted: string;
    phoneRaw: string;
    website: string;
    formspreeEndpoint: string;
  };
  social: {
    github: string;
    linkedin: string;
    googlePlay: string;
    whatsapp: string;
  };
  status: {
    availability: string;
    currentFocus: string;
    rolesInterested: string[];
  };
  bio: {
    short: string;
    about: string[];
    philosophy: string;
  };
}

export const personalData: PersonalData = {
  name: "Alok Das",
  firstName: "Alok",
  lastName: "Das",
  tagline: "M.Sc. Chemistry Student & Builder",
  brandStatement: "Chemistry first. Technology as a complementary skill. Building useful things.",
  location: {
    city: "Hojai",
    state: "Assam",
    country: "India",
    postalCode: "782435",
    full: "Hojai, Assam, India — 782435",
  },
  contact: {
    email: "alok@alokdasofficial.in",
    get phoneFormatted() {
      return getPhoneFormatted();
    },
    get phoneRaw() {
      return getPhoneRaw();
    },
    website: "https://alokdasofficial.in",
    formspreeEndpoint: "https://formspree.io/f/xjgpjwpb",
  },
  social: {
    github: "https://github.com/MrAlokTech",
    linkedin: "https://www.linkedin.com/in/alokdasofficial",
    googlePlay: "https://play.google.com/store/apps/developer?id=Alok+Das",
    whatsapp: "https://wa.me/message/PLW3AG4MQZNUI1",
  },
  status: {
    availability: "Actively exploring Chemistry-related roles and scientific opportunities",
    currentFocus: "Master of Science in Chemistry at Rabindranath Tagore University, Hojai",
    rolesInterested: [
      "Quality Control (QC) Analyst",
      "Quality Assurance (QA) Associate",
      "Laboratory Assistant / Analyst",
      "Project Assistant / Research Fellow",
      "Analytical Chemist",
      "Scientific & Technical Roles",
    ],
  },
  bio: {
    short: "M.Sc. Chemistry student with an analytical, evidence-driven approach to science and an active ability to build software tools that solve practical problems.",
    about: [
      "I am an M.Sc. Chemistry student at Rabindranath Tagore University in Assam. My primary focus is scientific research, analytical techniques, and laboratory methodology.",
      "My academic work has included phytochemical screening of medicinal plants, qualitative and quantitative chemical analysis, standard laboratory testing, and experimental documentation.",
      "Alongside my chemistry studies, I developed practical skills in software engineering—building cross-platform mobile apps with Flutter and responsive web tools. For me, programming is an essential amplifier: a way to compute faster, organize laboratory data accurately, and turn ideas into useful applications.",
    ],
    philosophy: "I do not see chemistry and software as conflicting fields. Chemistry provides the scientific rigor, analytical precision, and deep domain understanding; technology provides the leverage to automate, visualize, and build scalable tools.",
  },
};
