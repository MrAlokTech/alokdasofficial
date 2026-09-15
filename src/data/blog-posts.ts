import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "phytochemical-screening-methods",
    slug: "phytochemical-screening-methods",
    title: "Standard Phytochemical Screening Protocols for Secondary Metabolites in Indigenous Flora",
    subtitle: "A practical laboratory guide to solvent extraction cascades, qualitative reagent assays, and thin-layer chromatographic fingerprinting.",
    excerpt: "An in-depth methodological review of phytochemical screening protocols for identifying alkaloids, flavonoids, tannins, and saponins from botanical specimens using sequential solvent polarities and silica gel TLC.",
    publishedAt: "2026-02-18",
    category: "Research",
    tags: ["Phytochemistry", "Natural Products", "TLC Chromatography", "GLP", "Analytical Methods"],
    author: {
      name: "Alok Das",
      role: "M.Sc. Chemistry Candidate, RTU",
      url: "https://alokdasofficial.in",
    },
    readingTimeMinutes: 6,
    wordCount: 1240,
    featured: true,
    takeaways: [
      "Sequential extraction using non-polar to polar solvents (petroleum ether → chloroform → ethanol → aqueous) prevents emulsion artifacts and isolates distinct metabolic fractions.",
      "Qualitative reagent assays require rigorous negative and reagent blanks to prevent false positives from tannins or residual extract pigments.",
      "Thin-layer chromatography (TLC) with silica gel 60 F254 and iodine/UV detection establishes preliminary retention factor (Rf) benchmarks prior to spectrophotometric quantification.",
    ],
    faqs: [
      {
        question: "Why is a sequential solvent polarity gradient preferred over direct aqueous extraction?",
        answer: "Direct aqueous extraction extracts large quantities of polar sugars, mucilage, and structural proteins that obscure subsequent chromatographic separation and can precipitate reagents prematurely. A graded polarity cascade fractionates lipophilic waxes and pigments first, leaving cleaner secondary metabolite fractions.",
      },
      {
        question: "How are false positives prevented during Mayer's test for alkaloids?",
        answer: "Plant extracts high in tannins can precipitate heavy metal salts. Acidifying the extract with 2M HCl, filtering to remove precipitated proteins/tannins, and running a parallel blank control ensures that precipitates observed upon addition of Mayer's reagent (potassium mercuric iodide) are specific to basic alkaloidal nitrogen centers.",
      },
    ],
    relatedProjectSlug: "phytochemical-screening",
    relatedProjectTitle: "Phytochemical Screening of Local Medicinal Plants (Dissertation)",
    seo: {
      metaTitle: "Standard Phytochemical Screening Protocols | Alok Das",
      metaDescription: "Methodological guide to solvent extraction, qualitative assays, and TLC fingerprinting of medicinal plant metabolites by Alok Das.",
      keywords: ["phytochemical screening", "medicinal plants", "TLC chromatography", "alkaloids test", "Alok Das Chemistry"],
    },
    content: `
## Abstract & Objectives

Phytochemical screening serves as the foundational exploratory phase in natural product chemistry and pharmacognosy. Indigenous medicinal plants synthesise diverse secondary metabolites that evolved for ecological defence, many of which demonstrate demonstrable antimicrobial, antioxidant, and therapeutic bioactivities.

This paper outlines the standardised wet chemical and chromatographic screening protocols applied during our B.Sc. dissertation research (*"Phytochemical Analysis of Medicinal Plants in Local Localities"*), focusing on specimen collection, solvent extraction cascades, qualitative detection assays, and thin-layer chromatography (TLC) confirmation.

---

## 1. Botanical Collection & Sample Preparation

Reliable chemical screening requires rigorous sample preservation to prevent enzymatic hydrolysis and oxidative degradation of thermolabile constituents:

1. **Voucher Specimen Documentation**: Botanical identification and taxonomic verification prior to drying.
2. **Dehydration**: Shade drying at ambient laboratory temperatures (25–28 °C) for 14 days rather than oven drying above 40 °C, which degrades flavonoids and volatile monoterpenoids.
3. **Comminution**: Mechanical grinding of dehydrated leaves and stems to a uniform #40 mesh powder to maximise the surface-area-to-volume ratio during maceration.

---

## 2. Solvent Polarity Gradient Cascade

Rather than single-solvent maceration, an exhaustive polarity gradient extraction was deployed:

| Stage | Solvent | Dielectric Constant (ε) | Target Metabolites |
|---|---|---|---|
| 1 | Petroleum Ether (60–80 °C) | 1.88 | Lipids, fixed oils, sterols, waxes |
| 2 | Chloroform (CHCl₃) | 4.81 | Terpenoids, free aglycones, moderately polar alkaloids |
| 3 | Ethanol (95% v/v) | 24.55 | Flavonoid glycosides, tannins, phenolic acids, saponins |
| 4 | Deionised Water | 80.10 | Quaternary alkaloids, water-soluble polysaccharides |

Each powdered sample (50 g) was subjected to sequential Soxhlet extraction for 16 hours per solvent stage until the siphoning tube liquid became completely colourless. Extracts were concentrated under reduced pressure below 45 °C and stored at 4 °C in sealed amber vials.

---

## 3. Qualitative Reagent Assays

Standard operating procedures (SOPs) were followed for qualitative validation:

### 3.1 Alkaloid Detection
- **Mayer's Test**: Extract dissolved in dilute HCl (2%) + 2 drops of Mayer's reagent (potassium mercuric iodide). A cream or pale-yellow precipitate indicates alkaloid presence.
- **Wagner's Test**: Extract + Wagner's reagent (iodine in potassium iodide). Formation of a reddish-brown flocculent precipitate confirms alkaloid quaternary nitrogens.
- **Dragendorff's Test**: Bismuth nitrate in nitric acid + potassium iodide. An intense orange-red precipitate indicates positive response.

### 3.2 Flavonoid & Phenolic Detection
- **Shinoda Test (Magnesium-Hydrochloric Acid Reduction)**: Ethanolic extract treated with magnesium turnings followed by dropwise addition of concentrated HCl. Development of an intense crimson red to magenta coloration confirms flavones and flavonols.
- **Ferric Chloride Test**: Extract treated with 5% neutral FeCl₃ solution. Intense blue-green coloration signifies condensed tannins and catechol derivatives; dark violet indicates gallic acid analogues.

### 3.3 Saponins (Foam Assay)
- 1 mL of aqueous extract diluted with 20 mL deionised water in a graduated cylinder and shaken vigorously for 15 minutes. Formation of a persistent honeycomb froth with a height > 1 cm stable for 15 minutes confirms steroidal or triterpenoid saponins.

---

## 4. Thin-Layer Chromatography (TLC) Fingerprinting

While tube reactions establish preliminary presence, Thin-Layer Chromatography provides visual chromatographic separation of distinct chemical species:

- **Stationary Phase**: Pre-coated aluminium plates with Silica Gel 60 F254 (layer thickness 0.2 mm).
- **Developing Solvents**:
  - For Flavonoids: *Ethyl acetate : Formic acid : Glacial acetic acid : Water* (100 : 11 : 11 : 26 v/v).
  - For Alkaloids: *Toluene : Ethyl acetate : Diethylamine* (70 : 20 : 10 v/v).
- **Visualization**:
  - UV Shortwave (254 nm): Fluorescence quenching for conjugated double bonds.
  - UV Longwave (365 nm): Fluorescent emission for substituted coumarins and flavones.
  - Iodine Vapor Chamber: Universal non-destructive visualization of unsaturated organic compounds.

The retention factor was calculated according to standard chromatography principles:

$$R_f = \\frac{\\text{Distance migrated by solute}}{\\text{Distance migrated by solvent front}}$$

---

## 5. Analytical Reflections & Best Practices

1. **Maintain Reagent Blanks**: Reagent degradation or acidic pH shifts in ethanol can mimic positive colorimetric reactions. Always run negative control blanks simultaneously.
2. **Temperature Control**: Rotary evaporation above 45 °C can cause caramelisation of glycosidic bonds, altering solubility profiles.
3. **Data Integrity**: In compliance with Good Laboratory Practice (GLP), all observations must be recorded concurrently in indelible ink, documenting exact mass, solvent volumes, and ambient humidity.
    `,
  },
  {
    id: "balancing-chemical-equations-algorithm",
    slug: "balancing-chemical-equations-algorithm",
    title: "Algorithmic Balancing of Complex Chemical Reactions in Dart & Flutter",
    subtitle: "From stoichiometric matrix modeling to Gaussian elimination over rational coefficients for zero-latency client-side chemical solvers.",
    excerpt: "How we engineered the core stoichiometric computation engine of Alomole using matrix algebra and integer null-space solvers in Dart, balancing redox and multi-element reactions without backend dependencies.",
    publishedAt: "2026-01-25",
    category: "Software",
    tags: ["Chemical Computation", "Stoichiometry", "Dart", "Algorithms", "Flutter", "Matrix Algebra"],
    author: {
      name: "Alok Das",
      role: "Developer & M.Sc. Chemistry Candidate",
      url: "https://alokdasofficial.in",
    },
    readingTimeMinutes: 5,
    wordCount: 1080,
    featured: false,
    takeaways: [
      "Chemical balancing is mathematically equivalent to computing the non-trivial null space of an elemental composition matrix $A \\cdot x = 0$.",
      "Floating-point matrix inversion causes rounding errors with polyatomic stoichiometry; using exact rational arithmetic (fractions) guarantees strictly integer stoichiometric coefficients.",
      "A fast recursive-descent chemical parser parses nested parentheses (e.g. $(NH_4)_2SO_4$ or $[Cu(NH_3)_4]SO_4$) into vector counts in $O(N)$ time.",
    ],
    faqs: [
      {
        question: "Why can't simple brute-force inspection balance complex redox reactions reliably?",
        answer: "Inspection works for simple diatomic reactions ($H_2 + O_2 \\rightarrow H_2O$), but fails when multiple oxidation states or spectator counterions are involved (such as $KMnO_4 + HCl \\rightarrow KCl + MnCl_2 + H_2O + Cl_2$). The matrix null-space method solves any reaction with arbitrary species in milliseconds.",
      },
      {
        question: "How does Alomole run without an external server or database?",
        answer: "Because all matrix operations and stoichiometric evaluations are written in pure Dart and compiled into optimized JavaScript, calculations execute entirely inside the client's browser thread with sub-millisecond execution times and zero API latency.",
      },
    ],
    relatedProjectSlug: "alomole-chemistry-tool",
    relatedProjectTitle: "Alomole — Chemistry Companion (Project Case Study)",
    seo: {
      metaTitle: "Algorithmic Balancing of Chemical Reactions in Dart | Alok Das",
      metaDescription: "How to balance complex chemical equations using matrix null-space algorithms in Dart and Flutter by Alok Das.",
      keywords: ["chemical equation balancer", "Dart stoichiometry algorithm", "Alomole architecture", "matrix balancing chemistry"],
    },
    content: `
## The Problem with Manual Inspection

Every chemistry student encounters chemical equation balancing in their first semester. While small reactions can be solved by inspection, complex redox transformations—such as the permanganate oxidation of hydrochloric acid:

$$\\text{KMnO}_4 + \\text{HCl} \\rightarrow \\text{KCl} + \\text{MnCl}_2 + \\text{H}_2\\text{O} + \\text{Cl}_2$$

—defy quick guessing and often lead to frustrating arithmetic errors during exam or laboratory prep.

When developing **Alomole — Chemistry Companion**, our objective was clear: create an instantaneous, client-side chemical balancer capable of resolving any valid chemical reaction without requiring a server roundtrip.

---

## 1. The Mathematical Formulation

Chemical balance obeys the Law of Conservation of Mass: for every chemical element $E_i$, the total number of atoms on the reactant side must equal the total on the product side:

$$\\sum_{\\text{reactants}} c_j \\cdot n_{i,j} = \\sum_{\\text{products}} c_k \\cdot n_{i,k}$$

By adopting the convention of treating product coefficients as negative values, the conservation law simplifies to a homogeneous system of linear equations:

$$\\mathbf{A} \\mathbf{c} = \\mathbf{0}$$

where:
- $\\mathbf{A}$ is an $m \\times n$ matrix with $m$ distinct chemical elements and $n$ chemical compounds.
- Entry $A_{i,j}$ represents the count of element $i$ in compound $j$ (positive for reactants, negative for products).
- $\\mathbf{c}$ is the vector of stoichiometric coefficients $(c_1, c_2, \\dots, c_n)^T > 0$.

Finding the balanced equation is mathematically equivalent to computing the **kernel (null space)** of matrix $\\mathbf{A}$ restricted to positive integer vectors.

---

## 2. Chemical Formula Parsing with Recursive Descent

Before constructing matrix $\\mathbf{A}$, raw chemical strings must be parsed into an abstract syntax tree of elemental counts. We implemented a lightweight recursive-descent tokeniser:

1. **Tokens**: Elements (\`[A-Z][a-z]?\`), Numbers (\`[0-9]+\`), Parentheses/Brackets (\`(\`, \`)\`, \`[\`, \`]\`).
2. **Sub-group Expansion**: Parenthesised radicals like \`(NH4)2\` trigger a recursive evaluation, multiplying each child element count by the following integer coefficient.
3. **Validation**: Any unclosed bracket or invalid atomic symbol throws a descriptive syntax error before matrix construction.

---

## 3. Exact Rational Arithmetic vs. Floating-Point Instability

Standard Gaussian elimination implemented with standard IEEE 754 64-bit floating-point arithmetic fails on large stoichiometric matrices due to rounding truncation. For instance, $0.333333333333$ does not cleanly scale to an integer $1/3$, producing fractional coefficient artefacts.

To prevent this, we created an exact \`Rational\` class in Dart:

\`\`\`dart
class Rational {
  final BigInt numerator;
  final BigInt denominator;

  Rational(this.numerator, this.denominator) {
    if (denominator == BigInt.zero) throw ArgumentError('Division by zero');
    // Normalize sign and reduce via GCD
  }

  Rational operator +(Rational other) => ...;
  Rational operator *(Rational other) => ...;
  Rational operator -(Rational other) => ...;
  Rational operator /(Rational other) => ...;
}
\`\`\`

By maintaining all pivot operations in exact fractions, the resulting null-space basis vector consists entirely of rational values $r_1, r_2, \\dots, r_n$.

---

## 4. Scaling to Smallest Positive Integers

Once a basis vector $\\mathbf{v} = (r_1, r_2, \\dots, r_n)$ is found:

1. Let $L$ be the Least Common Multiple (LCM) of all denominators in $\\mathbf{v}$.
2. Multiply each element $r_j$ by $L$ to produce integer vector $\\mathbf{z}$.
3. Divide each entry in $\\mathbf{z}$ by the Greatest Common Divisor (GCD) of all entries.
4. Ensure all coefficients are strictly positive. If the null-space dimension is $>1$, the reaction represents multiple independent parallel pathways (e.g. incomplete combustion), which Alomole flags to the user.

---

## 5. Performance in the Browser

Because the algorithm runs in pure Dart compiled to WebAssembly/JavaScript, the entire pipeline:
- String parsing
- Matrix formulation
- Rational Gaussian-Jordan elimination
- Integer scaling

executes in **under 3 milliseconds** on mobile browsers. This gives Alomole its signature responsive feel: equations balance in real time as the user types.
    `,
  },
  {
    id: "offline-first-flutter-architecture",
    slug: "offline-first-flutter-architecture",
    title: "Architecting Offline-First Mobile Utilities with Flutter and SQLite",
    subtitle: "Lessons learned from building and publishing Mileage Tracker on Google Play with zero backend dependencies and 100% crash-free sessions.",
    excerpt: "A deep architectural review of building reliable, privacy-first mobile apps in Flutter. Why local-first SQLite databases, synchronous transactions, and telemetry-free design outperform cloud-dependent utilities.",
    publishedAt: "2025-12-10",
    category: "Software",
    tags: ["Flutter", "SQLite", "Offline-First", "Mobile Architecture", "Android", "Privacy"],
    author: {
      name: "Alok Das",
      role: "Developer & Creator of Mileage Tracker",
      url: "https://alokdasofficial.in",
    },
    readingTimeMinutes: 5,
    wordCount: 1120,
    featured: false,
    takeaways: [
      "Offline-first utilities eliminate latency, cloud operational costs, and authentication drop-off while providing unbeatable user trust.",
      "SQLite ACID transactions protect automotive fuel logs against partial writes during sudden OS battery-saver terminations.",
      "Adhering to Google Play modern SDK target policies and automated release pipelines guarantees smooth updates and high store rankings.",
    ],
    faqs: [
      {
        question: "Why choose SQLite over shared preferences or Hive for vehicle expense tracking?",
        answer: "Automotive logs require complex relational queries, such as calculating distance deltas between non-adjacent fill-ups or monthly aggregate expense trends. SQLite provides proven relational indexes and transactional integrity that key-value stores cannot match.",
      },
      {
        question: "How do users back up their data without cloud accounts?",
        answer: "Mileage Tracker provides a clean JSON and CSV export/import workflow directly to the user's local device storage or Google Drive, keeping the user in full control of their personal automotive records.",
      },
    ],
    relatedProjectSlug: "mileage-tracker-app",
    relatedProjectTitle: "Mileage Tracker — Fuel & Cost (Project Case Study)",
    seo: {
      metaTitle: "Architecting Offline-First Mobile Utilities | Alok Das",
      metaDescription: "Lessons from engineering Mileage Tracker in Flutter with SQLite and zero backend dependencies by Alok Das.",
      keywords: ["Flutter SQLite offline-first", "Mileage Tracker architecture", "Alok Das mobile development", "Android utility design"],
    },
    content: `
## Why Offline-First Still Matters

In an era where virtually every utility app demands a subscription, mandatory Google authentication, and continuous internet connectivity, simple tasks like logging a petrol refill have become unnecessarily cumbersome.

When drivers stop at remote highway petrol stations in Assam or across rural routes, network connectivity is often intermittent or entirely unavailable. An automotive utility that fails to record an odometer reading because it cannot reach a cloud database is fundamentally flawed.

This guiding principle led to the creation of **Mileage Tracker — Fuel & Cost**, published on Google Play.

---

## 1. Architectural Principles

Our design embraced three non-negotiable rules:

1. **Zero-Latency Interaction**: The app must open and accept an entry within 2 seconds of the user launching it.
2. **Local-First Data Ownership**: All operational records reside on the physical device in SQLite. No tracking pixels, no telemetry SDKs, no third-party ad networks.
3. **Graceful Fault Tolerance**: If the device powers off or the OS kills the process mid-entry, transactions must roll back cleanly without database corruption.

---

## 2. SQLite Data Model & Indexing

The schema was constructed to support fast chronological aggregation:

\`\`\`sql
CREATE TABLE fuel_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL,
  odometer_km REAL NOT NULL,
  fuel_liters REAL NOT NULL,
  total_cost REAL NOT NULL,
  price_per_liter REAL NOT NULL,
  is_full_tank INTEGER NOT NULL DEFAULT 1,
  missed_previous_fill INTEGER NOT NULL DEFAULT 0,
  timestamp INTEGER NOT NULL,
  notes TEXT
);

CREATE INDEX idx_vehicle_timestamp 
ON fuel_entries(vehicle_id, timestamp DESC);
\`\`\`

### Calculating Efficiency Between Non-Contiguous Refills
A common pitfall in mileage applications is assuming that every fill-up follows a complete tank replenishment. If a driver partially fills their tank or misses logging a receipt, naive odometer subtraction produces wildly inaccurate efficiency numbers ($km/L$).

By maintaining a discrete \`is_full_tank\` flag and computing rolling delta windows, Mileage Tracker accurately calculates fuel economy only between verified full-tank anchors, ensuring statistical reliability.

---

## 3. State Management with Clean Separation

We structured the Flutter application across three distinct layers:

1. **Domain Layer**: Pure Dart entities and business rules (e.g. calculating cost per kilometer, fuel consumption statistics, unit conversions between imperial and metric).
2. **Data Layer**: SQLite database provider using \`sqflite\`, encapsulating CRUD operations and transactional batching.
3. **Presentation Layer**: Responsive UI built with Flutter Material 3, adapting dynamically to system theme settings and varying Android screen aspect ratios.

By decoupling the domain logic from Flutter UI widgets, writing unit tests for stoichiometric or mathematical functions required zero mocking of device contexts.

---

## 4. Releasing on Google Play

Publishing a production application on Google Play requires continuous compliance with modern Android ecosystem requirements:

- **Target SDK 34+ Compatibility**: Managing granular runtime permissions and predictive back navigation gestures.
- **App Bundle (.aab) Optimization**: Leveraging Android App Bundles and ProGuard/R8 code shrinking to keep download sizes under 15 MB.
- **Zero-Crash Record**: By eliminating third-party analytics and cloud dependencies, the app maintains a **100% crash-free session rate** across thousands of operational hours.

---

## 5. Reflections: Technology as an Enabler

Building Mileage Tracker reinforced my perspective on software development: technology is at its best when it acts as an invisible, reliable servant to practical everyday problems. Just like in a chemistry laboratory, precision, simplicity, and clean methodology deliver the most enduring results.
    `,
  },
];
