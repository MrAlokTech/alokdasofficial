export interface VirtualLab {
  id: string;
  slug: string;
  name: string;
  subject: "Chemistry" | "Physics" | "General Science";
  level: "Foundations" | "Core Concepts" | "Advanced Concepts";
  tagline: string;
  objective: string;
  equation: string;
  description: string;
  methodology: string;
  assumptions: string[];
  parameters: {
    name: string;
    symbol: string;
    unit: string;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
  }[];
  faq: { question: string; answer: string }[];
}

export const virtualLabsData: VirtualLab[] = [
  {
    id: "ph-scale",
    slug: "ph-scale",
    name: "pH Scale & Ion Equilibrium",
    subject: "Chemistry",
    level: "Core Concepts",
    tagline: "Explore hydronium ion concentration, hydroxide balance, and indicator spectrums.",
    objective: "Determine aqueous solution pH from hydronium ion molarity and observe indicator color transitions.",
    equation: "pH = -log₁₀[H₃O⁺]   and   pH + pOH = 14.00 (at 25°C)",
    description:
      "A dynamic simulation of the logarithmic pH scale. Adjust hydronium or hydroxide molarity to observe real-time color transitions across universal indicator bands and compute autoionization equilibrium.",
    methodology:
      "Calculates hydrogen ion concentration [H+] and hydroxide [OH-] using the self-ionization constant of water (Kw = 1.0 x 10^-14 at 298.15 K). Maps calculated pH to continuous universal indicator RGB color values.",
    assumptions: [
      "Solution temperature is fixed at standard 25°C (298.15 K).",
      "Solute activity coefficients are assumed equal to 1.0 (ideal dilute solution).",
      "Autoionization constant Kw is assumed precisely 1.00 × 10⁻¹⁴.",
    ],
    parameters: [
      {
        name: "Hydronium Ion Concentration",
        symbol: "[H₃O⁺]",
        unit: "mol L⁻¹",
        defaultValue: 0.0001,
        min: 1e-14,
        max: 1.0,
        step: 1e-14,
      },
    ],
    faq: [
      {
        question: "Why is the pH scale logarithmic?",
        answer:
          "Because aqueous hydrogen ion concentrations range over 14 orders of magnitude (from 1 M to 10⁻¹⁴ M), a base-10 logarithmic scale compresses this immense spectrum into an accessible 0 to 14 index.",
      },
      {
        question: "What does pH 7 signify chemically?",
        answer:
          "At 25°C, pH 7 corresponds to equal concentrations of hydronium [H₃O⁺] and hydroxide [OH⁻] ions (each 1.0 × 10⁻⁷ mol L⁻¹), representing chemical neutrality.",
      },
    ],
  },
  {
    id: "titration",
    slug: "titration",
    name: "Acid–Base Titration Simulator",
    subject: "Chemistry",
    level: "Advanced Concepts",
    tagline: "Simulate volumetric titrations, track pH response curves, and detect equivalence points.",
    objective: "Analyze neutralization curves and stoichiometric equivalence points during strong and weak acid titrations.",
    equation: "Mₐ × Vₐ = M_b × V_b   (at 1:1 equivalence)",
    description:
      "Interactive volumetric buret simulation. Deliver standard titrant drop-by-drop into analyte solutions, plot real-time titration sigmoidal curves, and observe indicator color shifts.",
    methodology:
      "Calculates buffer region pH via the Henderson-Hasselbalch formulation for weak acid systems, and strict stoichiometric excess calculations past the equivalence threshold.",
    assumptions: [
      "Monoprotic acid-base system undergoing 1:1 molar reaction.",
      "Instantaneous chemical equilibrium and homogeneous mixing.",
      "Standard laboratory temperature maintained without heat of neutralization distortion.",
    ],
    parameters: [
      {
        name: "Analyte Concentration",
        symbol: "C_a",
        unit: "mol L⁻¹",
        defaultValue: 0.1,
        min: 0.01,
        max: 1.0,
        step: 0.01,
      },
      {
        name: "Analyte Initial Volume",
        symbol: "V_a",
        unit: "mL",
        defaultValue: 25.0,
        min: 10.0,
        max: 50.0,
        step: 1.0,
      },
      {
        name: "Titrant Concentration",
        symbol: "C_b",
        unit: "mol L⁻¹",
        defaultValue: 0.1,
        min: 0.01,
        max: 1.0,
        step: 0.01,
      },
    ],
    faq: [
      {
        question: "What is an equivalence point?",
        answer:
          "The equivalence point is the exact point in a titration where chemically equivalent stoichiometric amounts of titrant and analyte have combined.",
      },
      {
        question: "Why does the pH rise steeply near equivalence?",
        answer:
          "Near equivalence, almost all analyte acid has been neutralized, so a single fraction of a drop introduces a massive fractional change in [H₃O⁺] concentration.",
      },
    ],
  },
  {
    id: "beer-lambert",
    slug: "beer-lambert",
    name: "Beer-Lambert Law Spectrophotometry",
    subject: "Chemistry",
    level: "Core Concepts",
    tagline: "Model radiant light absorption, cuvette path length, and molar absorptivity.",
    objective: "Quantify the linear relationship between solute concentration, optical path length, and radiant light absorbance.",
    equation: "A = ε × c × l = -log₁₀(I / I₀)",
    description:
      "Simulate a UV-Vis double-beam spectrophotometer. Adjust sample concentration and cuvette path length to observe beam attenuation and generate linear calibration plots.",
    methodology:
      "Calculates transmission ratio T = I/I0 and optical absorbance A. Demonstrates non-destructive photometric quantitative analytical principles.",
    assumptions: [
      "Monochromatic radiant beam perpendicularly incident on parallel planar optical surfaces.",
      "Absorbing chromophore species act independently without intermolecular aggregation.",
      "Homogeneous solution without light scattering particulate suspensions.",
    ],
    parameters: [
      {
        name: "Solute Concentration",
        symbol: "c",
        unit: "mmol L⁻¹",
        defaultValue: 0.05,
        min: 0.005,
        max: 0.2,
        step: 0.005,
      },
      {
        name: "Cuvette Path Length",
        symbol: "l",
        unit: "cm",
        defaultValue: 1.0,
        min: 0.1,
        max: 5.0,
        step: 0.1,
      },
      {
        name: "Molar Absorptivity",
        symbol: "ε",
        unit: "L mol⁻¹ cm⁻¹",
        defaultValue: 15000,
        min: 1000,
        max: 50000,
        step: 1000,
      },
    ],
    faq: [
      {
        question: "When does the Beer-Lambert law deviate from linearity?",
        answer:
          "Deviations occur at high concentrations (>0.01 M) due to electrostatic interactions between chromophores, refractive index shifts, or chemical equilibria such as dimerization.",
      },
      {
        question: "What is molar absorptivity (ε)?",
        answer:
          "It is an intrinsic molecular property reflecting how intensely a specific chemical species absorbs light at a given wavelength.",
      },
    ],
  },
  {
    id: "reaction-kinetics",
    slug: "reaction-kinetics",
    name: "Chemical Reaction Kinetics",
    subject: "Chemistry",
    level: "Advanced Concepts",
    tagline: "Explore reaction velocity, Arrhenius temperature dependence, and activation energy.",
    objective: "Analyze the influence of temperature, reactant concentration, and catalyst presence on rate of reaction.",
    equation: "r = k(T)[A]ⁿ   where   k = A₀ × e^(-Eₐ/RT)",
    description:
      "Simulate chemical conversion kinetics. Manipulate thermal energy and reactant concentrations to track reaction curves and calculate rate constants via the Arrhenius equation.",
    methodology:
      "Numerically solves rate differential equations over time intervals and models the exponential relationship between temperature and effective collisions.",
    assumptions: [
      "Closed system undergoing irreversible forward reaction.",
      "Gas constant R taken as 8.314 J mol⁻¹ K⁻¹.",
      "Thermal equilibrium remains uniform throughout the reaction vessel.",
    ],
    parameters: [
      {
        name: "Vessel Temperature",
        symbol: "T",
        unit: "°C",
        defaultValue: 25.0,
        min: 0.0,
        max: 100.0,
        step: 1.0,
      },
      {
        name: "Initial Concentration",
        symbol: "[A]₀",
        unit: "mol L⁻¹",
        defaultValue: 1.0,
        min: 0.1,
        max: 2.0,
        step: 0.1,
      },
      {
        name: "Activation Energy",
        symbol: "E_a",
        unit: "kJ mol⁻¹",
        defaultValue: 50.0,
        min: 20.0,
        max: 100.0,
        step: 5.0,
      },
    ],
    faq: [
      {
        question: "How does a catalyst accelerate a reaction?",
        answer:
          "A catalyst introduces an alternate transition-state pathway with lower activation energy (Ea), allowing a greater proportion of molecular collisions to possess sufficient energy to react.",
      },
      {
        question: "Why does temperature dramatically increase reaction rates?",
        answer:
          "According to the Maxwell-Boltzmann distribution, even a modest temperature increase exponentially broadens the high-energy kinetic tail of molecules exceeding activation energy.",
      },
    ],
  },
  {
    id: "ohms-law",
    slug: "ohms-law",
    name: "Ohm's Law & Circuit Analysis",
    subject: "Physics",
    level: "Foundations",
    tagline: "Interact with electric potential, ohmic resistance, and electron current flow.",
    objective: "Verify the proportional relationship between potential difference and electric current across linear conductors.",
    equation: "V = I × R   ⟹   I = V/R   and   P = V × I",
    description:
      "Direct current electronic circuit simulator. Adjust electromotive potential and circuit resistance to inspect current flow rate, power dissipation, and V-I linearity.",
    methodology:
      "Calculates current according to classical Ohm's law and plots the characteristic linear voltage-current relationship.",
    assumptions: [
      "Pure ohmic conductor exhibiting constant resistance independent of Joule self-heating.",
      "Negligible source internal resistance and lead wire impedance.",
    ],
    parameters: [
      {
        name: "Voltage (Potential Difference)",
        symbol: "V",
        unit: "V",
        defaultValue: 9.0,
        min: 1.0,
        max: 24.0,
        step: 0.5,
      },
      {
        name: "Circuit Resistance",
        symbol: "R",
        unit: "Ω",
        defaultValue: 100.0,
        min: 10.0,
        max: 1000.0,
        step: 10.0,
      },
    ],
    faq: [
      {
        question: "What is an ohmic material?",
        answer:
          "An ohmic material is one where the ratio of voltage to current remains strictly constant over the operating temperature and voltage range.",
      },
      {
        question: "What happens when resistance approaches zero?",
        answer:
          "Current approaches infinity, causing a short circuit condition resulting in intense Joule heating and potential conductor damage.",
      },
    ],
  },
  {
    id: "refraction",
    slug: "refraction",
    name: "Refraction & Snell's Law",
    subject: "Physics",
    level: "Core Concepts",
    tagline: "Simulate boundary ray optics, refractive indices, and total internal reflection.",
    objective: "Quantify optical ray deflection across dielectric interfaces and determine critical angles for total internal reflection.",
    equation: "n₁ sin θ₁ = n₂ sin θ₂   and   θ_c = arcsin(n₂/n₁)   (for n₁ > n₂)",
    description:
      "Interactive geometric optics lab. Propagate a coherent laser ray across variable dielectric media interfaces (air, water, glass, diamond) to observe refraction and total reflection.",
    methodology:
      "Traces incident, reflected, and refracted rays using Snell's law and Fresnel reflection boundary conditions.",
    assumptions: [
      "Monochromatic plane wave optical ray incident upon an optically flat, non-absorbing interface.",
      "Isotropic media with uniform refractive indices.",
    ],
    parameters: [
      {
        name: "Angle of Incidence",
        symbol: "θ₁",
        unit: "degrees",
        defaultValue: 30.0,
        min: 0.0,
        max: 85.0,
        step: 1.0,
      },
    ],
    faq: [
      {
        question: "What causes light to refract?",
        answer:
          "Refraction occurs because light travels at different phase velocities in media of different optical densities (v = c / n).",
      },
      {
        question: "What is total internal reflection?",
        answer:
          "When light travels from an optically denser medium to a rarer medium at an angle exceeding the critical angle, 100% of the light reflects back with zero transmission.",
      },
    ],
  },
  {
    id: "measurement-sigfigs",
    slug: "measurement-sigfigs",
    name: "Measurement & Significant Figures",
    subject: "General Science",
    level: "Foundations",
    tagline: "Master experimental measurement precision, decimal uncertainty, and rounding rules.",
    objective: "Apply standard scientific significant figure conventions to laboratory readings, arithmetic, and data reporting.",
    equation: "Measured Value = x_best ± δx   (precision limited by least accurate term)",
    description:
      "Interactive scientific measurement workbench. Practice reading simulated analog calipers, applying significant figures rules, and computing propagation of uncertainty.",
    methodology:
      "Evaluates student input against international IUPAC and ISO measurement reporting standards.",
    assumptions: [
      "Standard significant figures convention where non-zero digits are significant and trailing zeros after a decimal indicate measurement precision.",
    ],
    parameters: [
      {
        name: "Nominal Reading",
        symbol: "x",
        unit: "cm",
        defaultValue: 4.35,
        min: 0.1,
        max: 10.0,
        step: 0.01,
      },
    ],
    faq: [
      {
        question: "Why are significant figures vital in analytical chemistry?",
        answer:
          "They prevent reporting misleading levels of precision. A calculated quantity cannot be more certain than the least precise measurement from which it was derived.",
      },
      {
        question: "How are significant figures handled in multiplication versus addition?",
        answer:
          "In multiplication and division, the result retains the lowest count of significant figures. In addition and subtraction, the result is rounded to the fewest decimal places.",
      },
    ],
  },
];
