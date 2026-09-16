export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: "Productivity" | "Learning" | "Utility" | "Science";
  badge: string;
  iconName: string;
  description: string;
  href: string;
  features: string[];
  faq: { question: string; answer: string }[];
}

export const toolsData: ToolItem[] = [
  {
    id: "pdf",
    slug: "pdf",
    name: "Client-Side PDF Studio",
    tagline: "Compress, merge, split, sign, redact, and convert camera photos to searchable PDFs.",
    category: "Utility",
    badge: "100% Private",
    iconName: "FileText",
    description:
      "A complete in-browser PDF power suite. Merge documents with page-to-page reordering, split into individual PDFs or ZIP archives, compress file size up to 80%, add authentic signatures, erase unwanted elements with Whiteout, and convert camera photos to searchable PDFs with OCR.",
    href: "/tools/pdf",
    features: [
      "Merge multiple PDFs with visual thumbnail drag-and-drop & interleaving",
      "Split PDF by custom page ranges or batch export into ZIP",
      "Compress PDF with customizable DPI presets and live size savings",
      "Sign documents via draw, cursive typography, or photo stamp",
      "Redact confidential data or erase elements with permanent Whiteout",
      "Device camera scan with CamScanner-grade Magic Color & Tesseract OCR",
    ],
    faq: [
      {
        question: "Are my PDF documents uploaded to any server?",
        answer:
          "No. All PDF processing, image optimization, and OCR recognition execute 100% inside your browser's local memory using WebAssembly and Web Workers. No files ever leave your device.",
      },
      {
        question: "How does the Whiteout / Eraser feature work?",
        answer:
          "The Whiteout eraser places opaque white layers that are permanently baked into the PDF content stream, obliterating underlying text and graphics so they cannot be highlighted or extracted.",
      },
      {
        question: "Can I search text in PDFs created from photos?",
        answer:
          "Yes. When you run OCR on a photo or camera scan, the tool embeds an invisible searchable text layer directly over the image, allowing you to search, highlight, and copy text in any PDF reader.",
      },
    ],
  },
  {
    id: "morse",
    slug: "morse",
    name: "Morse Code Practice Tool",
    tagline: "Learn, translate, and test your speed with interactive audio Morse code.",
    category: "Learning",
    badge: "Interactive Practice",
    iconName: "Radio",
    description:
      "A browser-based Morse code learner and training utility featuring real-time Web Audio tones, quiz practice modes, and bidirectional text-to-Morse translation.",
    href: "/tools/morse",
    features: [
      "Audio playback for dots and dashes with adjustable WPM speed",
      "Interactive quiz mode testing character recognition",
      "Bidirectional translation between plain English and Morse code",
      "Full international Morse code reference table",
    ],
    faq: [
      {
        question: "What is this Morse Code tool?",
        answer:
          "It is an interactive browser utility designed to help learners study, encode, decode, and practice International Morse Code using visual cues and audio synthesis.",
      },
      {
        question: "How does the audio synthesis work?",
        answer:
          "Audio tones are generated directly in your browser using the standard Web Audio API, creating 700 Hz sine wave beeps with standardized timing (1 unit for a dot, 3 units for a dash).",
      },
      {
        question: "What characters are supported?",
        answer:
          "The tool supports all 26 standard Latin letters (A–Z), Arabic numerals (0–9), and essential punctuation symbols like periods, commas, and question marks.",
      },
    ],
  },
  {
    id: "pomodoro",
    slug: "pomodoro",
    name: "Pomodoro Focus Timer",
    tagline: "Calm, distraction-free productivity timer with session intervals.",
    category: "Productivity",
    badge: "Productivity",
    iconName: "Timer",
    description:
      "A distraction-free, Apple HIG-inspired focus timer based on the Pomodoro Technique. Features customizable session intervals, session counting, and local state persistence.",
    href: "/tools/pomodoro",
    features: [
      "25-minute focus intervals with 5-minute short and 15-minute long breaks",
      "Subtle audio chimes upon interval completion using Web Audio API",
      "Local storage persistence for daily completed session tallies",
      "Keyboard shortcuts for effortless start, pause, and reset",
    ],
    faq: [
      {
        question: "What is the Pomodoro Technique?",
        answer:
          "The Pomodoro Technique is a time-management methodology that breaks work into 25-minute focused intervals separated by short 5-minute rest periods, boosting cognitive retention and reducing fatigue.",
      },
      {
        question: "Is my session data tracked or sent to a server?",
        answer:
          "No. All timers and completed session counters run 100% locally in your browser and are stored in your device's localStorage without any remote logging.",
      },
      {
        question: "Can I customize the interval lengths?",
        answer:
          "Yes, you can adjust focus time, short break, and long break lengths to fit your personalized study or laboratory workflow.",
      },
    ],
  },
  {
    id: "world-clock",
    slug: "world-clock",
    name: "World Clock & Time Zones",
    tagline: "Track current time, daylight status, and time differences worldwide.",
    category: "Utility",
    badge: "Utility",
    iconName: "Clock",
    description:
      "Accurate international time tracking using native browser Intl.DateTimeFormat APIs with verified IANA time zones, day/night indicators, and customizable city lists.",
    href: "/tools/world-clock",
    features: [
      "Real-time synchronized second-by-second updates with zero drift",
      "Verified IANA time zones accurately handling Daylight Saving Time (DST)",
      "Visual day and night phase indicators for every selected metropolitan region",
      "Toggle between 12-hour AM/PM and 24-hour military display modes",
    ],
    faq: [
      {
        question: "How are time zone conversions calculated?",
        answer:
          "Time conversions use the browser's built-in Intl.DateTimeFormat API and IANA standard time zone databases, ensuring accurate daylight saving adjustments.",
      },
      {
        question: "Does this tool request my GPS location?",
        answer:
          "No. The tool never requests location permissions. It respects your privacy and displays time using standard time zone identifiers.",
      },
      {
        question: "Which cities are included by default?",
        answer:
          "Initial cities include New Delhi, London, New York, San Francisco, Tokyo, Singapore, Sydney, and Dubai.",
      },
    ],
  },
  {
    id: "chemistry-challenge",
    slug: "chemistry-challenge",
    name: "Chemistry Periodic Challenge",
    tagline: "Test and sharpen your recall of elements, atomic numbers, and chemical properties.",
    category: "Science",
    badge: "Chemistry Quiz",
    iconName: "Atom",
    description:
      "An interactive quiz testing elemental recall, atomic numbers, chemical symbols, and periodic trends. Designed for science students, educators, and curious minds.",
    href: "/tools/chemistry-challenge",
    features: [
      "Dynamic questions spanning atomic numbers, elemental symbols, and chemical groups",
      "Instant feedback with informative scientific context and periodic classifications",
      "Streak tracking and accuracy scoring saved locally",
      "Designed with Apple HIG accessibility and mobile-first touch targets",
    ],
    faq: [
      {
        question: "What topics does the Chemistry Challenge cover?",
        answer:
          "It covers atomic numbers, elemental symbols, atomic masses, periodic table groups (alkali metals, halogens, noble gases), and fundamental chemical principles.",
      },
      {
        question: "Is this suitable for chemistry students?",
        answer:
          "Yes. It is crafted by an M.Sc. Chemistry scholar to offer rigorous, scientifically accurate recall practice for core elemental properties.",
      },
    ],
  },
];

export interface CityZone {
  id: string;
  name: string;
  country: string;
  timeZone: string;
}

export const INITIAL_CITIES: CityZone[] = [
  { id: "delhi", name: "New Delhi", country: "India", timeZone: "Asia/Kolkata" },
  { id: "london", name: "London", country: "United Kingdom", timeZone: "Europe/London" },
  { id: "new-york", name: "New York", country: "United States", timeZone: "America/New_York" },
  { id: "san-francisco", name: "San Francisco", country: "United States", timeZone: "America/Los_Angeles" },
  { id: "tokyo", name: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo" },
  { id: "singapore", name: "Singapore", country: "Singapore", timeZone: "Asia/Singapore" },
  { id: "sydney", name: "Sydney", country: "Australia", timeZone: "Australia/Sydney" },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", timeZone: "Asia/Dubai" },
];

export const AVAILABLE_CITIES: CityZone[] = [
  ...INITIAL_CITIES,
  { id: "paris", name: "Paris", country: "France", timeZone: "Europe/Paris" },
  { id: "berlin", name: "Berlin", country: "Germany", timeZone: "Europe/Berlin" },
  { id: "toronto", name: "Toronto", country: "Canada", timeZone: "America/Toronto" },
  { id: "hong-kong", name: "Hong Kong", country: "China", timeZone: "Asia/Hong_Kong" },
  { id: "auckland", name: "Auckland", country: "New Zealand", timeZone: "Pacific/Auckland" },
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", timeZone: "America/Sao_Paulo" },
];
