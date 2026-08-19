// GATE Chemistry (CY) 2028 — syllabus decomposed into weekly topics,
// each split into 5 daily "capsules". Days 5-6 of every week (Sat/Sun)
// are fixed Review days — no new entry needed, handled in app.js.
//
// section: 'physical' | 'inorganic' | 'organic' — drives the flame-test accent color.

const TOPICS = [

// ---------------- SECTION 1 — PHYSICAL CHEMISTRY ----------------

{ section:'physical', title:'Quantum Mechanics — Foundations', days:[
  { t:'Postulates & Operators', b:[
      'State of a system is fully described by a wavefunction Ψ.',
      'Every observable ↔ a linear, Hermitian operator.',
      'Commutators [A,B] decide if two observables can be known simultaneously.',
      'Only Hermitian operators give real, measurable eigenvalues.'
    ], tip:'Non-commuting operators → uncertainty relation. This is where Δx·Δp comes from.' },
  { t:'Schrödinger Equation & Born Interpretation', b:[
      'Time-dependent SE: iħ ∂Ψ/∂t = ĤΨ — governs evolution.',
      'Time-independent SE: ĤΨ = EΨ — for stationary states.',
      'Born interpretation: |Ψ|² is a probability density.',
      'Ψ must be single-valued, finite, and continuous to be physical.'
    ], tip:'Separate variables Ψ(x,t)=ψ(x)f(t) to go from TDSE to TISE — you\'ll redo this derivation often.' },
  { t:'Dirac Bra-Ket Notation', b:[
      '|ψ⟩ is a ket (state vector), ⟨ψ| is its bra (dual).',
      '⟨φ|ψ⟩ is an inner product — overlap between two states.',
      'Expectation value: ⟨A⟩ = ⟨ψ|Â|ψ⟩.',
      'Orthonormal basis: ⟨i|j⟩ = δij.'
    ], tip:'Bra-ket is just compact notation for the integrals you already know — don\'t let it intimidate you.' },
  { t:'Expectation Values & Commutation Relations', b:[
      '[x̂,p̂] = iħ is the fundamental commutator of QM.',
      'If [Â,B̂]=0, Â and B̂ share a common eigenbasis.',
      'Ehrenfest theorem links expectation values to classical equations of motion.',
      'Variance σ² = ⟨A²⟩ − ⟨A⟩² measures spread of a measurement.'
    ], tip:'GATE loves asking you to evaluate [x̂,p̂] or [L̂x,L̂y] directly — practice the algebra, not just the result.' },
  { t:'Review — QM Foundations', b:[
      'Redo the TISE derivation from TDSE by hand, no notes.',
      'List every postulate in one line each.',
      'Rework one commutator problem and one normalization problem.',
      'Flag anything shaky for next week\'s revision pass.'
    ], tip:'A 20-minute active-recall pass beats an hour of re-reading.' }
]},

{ section:'physical', title:'Particle in a Box', days:[
  { t:'1D Infinite Box', b:[
      'ψn(x) = √(2/L) sin(nπx/L), boundary conditions force quantization.',
      'En = n²h²/8mL² — energy scales as n² and 1/L².',
      'Zero-point energy exists even at n=1 (never E=0).',
      'Nodes: (n−1) nodes inside the box.'
    ], tip:'Larger box → closer-spaced levels. This is the qualitative link to bulk/continuum behaviour.' },
  { t:'Finite Box & Tunnelling', b:[
      'Finite barrier → wavefunction leaks into the classically forbidden region.',
      'Decay inside barrier is exponential, not zero.',
      'Tunnelling probability drops with barrier width and (mass·height)^½.',
      'Explains phenomena like STM, alpha decay, and some enzyme mechanisms.'
    ], tip:'Tunnelling is a "boundary condition matching" problem — continuity of ψ and ψ\' at the walls.' },
  { t:'2D and 3D Boxes', b:[
      'Energy now depends on three quantum numbers: nx, ny, nz.',
      'Degeneracy appears when box dimensions are equal (symmetry).',
      'E = h²/8m (nx²/Lx² + ny²/Ly² + nz²/Lz²).',
      'Degenerate levels split if the box becomes asymmetric.'
    ], tip:'Counting degeneracies (how many (nx,ny,nz) combos give the same E) is a classic GATE numerical.' },
  { t:'Applications', b:[
      'Free-electron model for conjugated polyenes (crude but useful).',
      'Quantum dots — particle-in-a-box scaling explains size-dependent color.',
      'Used to rationalize UV-vis absorption trends in linear polyenes.',
      'Conceptual bridge to band theory in solids.'
    ], tip:'Practice estimating λmax of a polyene using PIB energy levels — a recurring GATE-style question.' },
  { t:'Review — Particle in a Box', b:[
      'Rederive ψn and En for the 1D box unaided.',
      'Solve one 3D-box degeneracy-counting problem.',
      'Explain tunnelling in two sentences, no jargon.',
      'Note formulas you had to look up — drill those.'
    ], tip:'If a formula didn\'t come from memory, it isn\'t learned yet.' }
]},

{ section:'physical', title:'Harmonic Oscillator', days:[
  { t:'SHO Hamiltonian', b:[
      'Ĥ = p̂²/2m + ½kx² — parabolic potential.',
      'Classical analogy: mass on a spring, restoring force F=−kx.',
      'Sets up the model for molecular vibrations (bond stretching).',
      'Solution requires power-series / ladder-operator methods.'
    ], tip:'This is the entry point to vibrational spectroscopy — keep that link in mind as you study it.' },
  { t:'Hermite Polynomials', b:[
      'Wavefunctions: ψn ∝ Hn(y)·e^(−y²/2), y = √(mω/ħ)·x.',
      'Hn alternates even/odd symmetry with n.',
      'Recursion and orthogonality relations simplify integral evaluations.',
      'Number of nodes in ψn equals n.'
    ], tip:'You rarely need to derive Hn from scratch — know their symmetry and node count instead.' },
  { t:'Eigenvalues & Zero-Point Energy', b:[
      'En = (n + ½)ħω, n = 0,1,2,...',
      'Equally spaced levels — unlike the particle in a box.',
      'Zero-point energy = ½ħω, even in the ground state.',
      'ZPE is why molecules never sit perfectly still, even at 0 K.'
    ], tip:'Equal spacing (SHO) vs n²-spacing (PIB) is a favourite conceptual contrast question.' },
  { t:'Expectation Values & Anharmonicity', b:[
      '⟨x⟩=0 for all states by symmetry; ⟨x²⟩ grows with n.',
      '⟨T⟩ = ⟨V⟩ = E/2 for SHO (virial-like result).',
      'Real bonds are anharmonic — Morse potential fits better near dissociation.',
      'Anharmonicity causes overtone bands and unequal level spacing.'
    ], tip:'Anharmonic correction terms explain why overtones in IR aren\'t exact multiples of the fundamental.' },
  { t:'Review — Harmonic Oscillator', b:[
      'Write En and ZPE from memory.',
      'Compare SHO vs PIB level spacing in one line.',
      'Explain why anharmonicity matters near dissociation.',
      'Solve one ⟨x²⟩ or ⟨T⟩ expectation-value problem.'
    ], tip:'Keep a running "PIB vs SHO vs rigid rotor" comparison table — build it as you go.' }
]},

{ section:'physical', title:'Rotational Motion', days:[
  { t:'Angular Momentum Operators', b:[
      'L̂² and L̂z commute — simultaneously knowable.',
      'L̂x, L̂y, L̂z do not mutually commute.',
      'Eigenvalues of L̂²: ħ²l(l+1); of L̂z: mħ.',
      'l is the angular momentum quantum number, m the magnetic one.'
    ], tip:'The [L̂x,L̂y]=iħL̂z-type commutators are a recurring GATE algebra question.' },
  { t:'Spin Angular Momentum', b:[
      'Spin is intrinsic angular momentum, no classical analogue.',
      'Electron spin quantum number s = ½, ms = ±½.',
      'Spin operators obey the same commutation algebra as orbital L.',
      'Total angular momentum J combines orbital and spin parts.'
    ], tip:'Don\'t confuse orbital quantum number l with spin s — GATE tests this distinction directly.' },
  { t:'Spherical Harmonics', b:[
      'Ylm(θ,φ) are eigenfunctions of L̂² and L̂z.',
      'They describe angular shape of atomic orbitals (s, p, d, f).',
      'Orthonormal set: ∫Yl\'m\'* Ylm dΩ = δll\'δmm\'.',
      'Parity of Ylm is (−1)^l.'
    ], tip:'Recognizing orbital shapes (nodal planes/cones) from Ylm is tested via diagrams, not just formulas.' },
  { t:'Bridge to the Rigid Rotor', b:[
      'Rigid rotor = two masses at fixed separation, rotating freely.',
      'Energy levels: EJ = ħ²J(J+1)/2I, I = moment of inertia.',
      'Degeneracy of level J is (2J+1).',
      'This model underlies rotational (microwave) spectroscopy.'
    ], tip:'Selection rule ΔJ=±1 for rotational transitions — you\'ll need it again in the spectroscopy week.' },
  { t:'Review — Rotational Motion', b:[
      'Write eigenvalues of L̂² and L̂z from memory.',
      'State the degeneracy formula for the rigid rotor.',
      'Explain why L̂x and L̂y don\'t commute, physically.',
      'Sketch nodal patterns for Y10 and Y11 orbitals.'
    ], tip:'Angular momentum algebra resurfaces in term symbols later — this week is foundational, not optional.' }
]},

{ section:'physical', title:'Hydrogen & Multi-electron Atoms', days:[
  { t:'Hydrogen Atomic Orbitals', b:[
      'H-atom wavefunction separates into R(r)·Ylm(θ,φ).',
      'Quantum numbers n, l, m fix orbital size, shape, orientation.',
      'Energy depends only on n for hydrogen: En = −13.6/n² eV.',
      'Degeneracy per n is n² (ignoring spin).'
    ], tip:'Radial nodes = n−l−1; angular nodes = l. Total nodes = n−1 — memorize this triad.' },
  { t:'Radial & Angular Distribution Functions', b:[
      'Radial probability = R²·r² — peaks at the "most probable radius".',
      'For 1s, most probable radius equals the Bohr radius a0.',
      'Angular distribution functions show orbital shape (s spherical, p dumbbell...).',
      'Radial nodes ≠ angular nodes — track them separately.'
    ], tip:'GATE often shows a radial distribution plot and asks you to identify n and l — practice reading these.' },
  { t:'Atomic Units & Orbital Approximation', b:[
      'Atomic units set ħ=me=e=4πε0=1, simplifying equations.',
      'Multi-electron atoms: exact solution impossible — use orbital approximation.',
      'Each electron treated as moving in an averaged field of the rest.',
      'Electron spin adds a two-valued internal degree of freedom.'
    ], tip:'Orbital approximation is *why* we still use hydrogen-like orbitals for multi-electron atoms — know the justification, not just the name.' },
  { t:'Pauli Principle & Slater Determinants', b:[
      'No two electrons share all four quantum numbers.',
      'Total wavefunction must be antisymmetric under electron exchange.',
      'Slater determinant automatically enforces antisymmetry and the Pauli principle.',
      'Swapping two rows (electrons) flips the determinant\'s sign.'
    ], tip:'Being able to *write* a 2-electron Slater determinant from orbitals is a common short-answer ask.' },
  { t:'Variational Method & Perturbation Theory', b:[
      'Variational theorem: any trial ψ gives E ≥ E_true(ground state).',
      'Better trial wavefunction (more parameters) → lower, better energy.',
      'First-order perturbation: E(1) = ⟨ψ0|H\'|ψ0⟩.',
      'Non-degenerate perturbation theory needs H = H0 + H\', H\' small.'
    ], tip:'The variational method is how you\'ll justify LCAO-MO coefficients next week — the two topics connect directly.' }
]},

{ section:'physical', title:'Molecular Structure & Bonding', days:[
  { t:'Born-Oppenheimer Approximation', b:[
      'Nuclei are much heavier/slower than electrons — treat nuclear positions as fixed.',
      'Electronic Schrödinger equation solved at each fixed nuclear geometry.',
      'Generates the potential energy surface nuclei move on.',
      'Breaks down only when electronic states come close in energy (conical intersections).'
    ], tip:'BO approximation is the reason "molecular structure" and "bonding" even make sense as a static picture.' },
  { t:'Valence Bond Theory for H₂', b:[
      'VB wavefunction: sum of both electron-nucleus assignment terms.',
      'Covalent + ionic contributions can both be included.',
      'Exchange integral is what gives bonding stabilization.',
      'VB naturally explains bond formation via orbital overlap.'
    ], tip:'VB and MO give the same qualitative bond order for H2 but differ in how they build the wavefunction — know both routes.' },
  { t:'LCAO-MO Theory — H₂⁺ and H₂', b:[
      'MOs built as linear combinations of atomic orbitals.',
      'Bonding MO: constructive overlap, lower energy.',
      'Antibonding MO (σ*): destructive overlap, higher energy, has a node.',
      'H2+ (1 electron) is the simplest exactly-solvable MO test case.'
    ], tip:'Bond order = ½(bonding electrons − antibonding electrons) — you\'ll use this formula constantly.' },
  { t:'Hybridization & Homo/Heteronuclear MOT', b:[
      'Hybrid orbitals (sp, sp², sp³) rationalize observed molecular geometry.',
      'Homonuclear diatomics: MO diagram symmetric, no polarity.',
      'Heteronuclear diatomics: AOs mix unequally — MOs skew toward the more electronegative atom.',
      'σ-π energy level ordering flips around N2/O2 — a classic exam trap.'
    ], tip:'Know why the σ2p and π2p order swaps between N2 and O2 — this is one of the most-tested MO facts.' },
  { t:'Hückel Theory', b:[
      'Treats only π-electrons in conjugated systems, ignores σ-framework.',
      'Assumes all Coulomb integrals α equal, all resonance integrals β equal (nearest neighbours).',
      'Secular determinant gives energy levels and MO coefficients.',
      'Predicts aromaticity via total π-bonding energy vs isolated double bonds.'
    ], tip:'Practice setting up the Hückel secular determinant for benzene and butadiene — a GATE numerical staple.' }
]},

{ section:'physical', title:'Group Theory', days:[
  { t:'Symmetry Elements & Operations', b:[
      'Elements: E, Cn, σ, i, Sn — the geometric features.',
      'Operations: the actual actions (rotation, reflection...) performed.',
      'Identifying all symmetry elements is the first step to assigning a point group.',
      'σv, σh, σd distinguished by their relation to the principal axis.'
    ], tip:'Draw the molecule and physically mark every axis/plane before trying to name the point group.' },
  { t:'Groups, Multiplication Tables & Point Groups', b:[
      'A group needs closure, identity, inverses, and associativity.',
      'Multiplication table shows the result of combining any two operations.',
      'Point group = full symmetry-operation set fixing one point in space.',
      'Common groups: Cnv, Cnh, Dnh, Dnd, Td, Oh — know their defining features.'
    ], tip:'Use a point-group flowchart until the common ones (C2v, C3v, D3h, Td) become automatic recognition.' },
  { t:'Representations, Classes & Character Tables', b:[
      'Reducible representation = combination of irreducible ones.',
      'Reduction formula uses characters and the class order.',
      'Classes: operations related by symmetry, same character.',
      'Character tables list irreducible reps with their symmetry labels (A, B, E, T...).'
    ], tip:'Reducing a reducible representation into irreducibles is a guaranteed problem type — drill the formula.' },
  { t:'Selection Rules', b:[
      'A transition is allowed if the transition-moment integral is totally symmetric.',
      'Electronic/vibrational selection rules come straight from the point group.',
      'IR-active modes: transform like x, y, z.',
      'Raman-active modes: transform like quadratic functions (x², xy...).'
    ], tip:'Mutual exclusion rule (centrosymmetric molecules): a mode can\'t be both IR and Raman active — classic conceptual question.' },
  { t:'SALCs & Hybrid Orbital Construction', b:[
      'Symmetry-adapted linear combinations built from a reducible rep of ligand orbitals.',
      'Projection operators generate SALCs from the character table.',
      'Hybrid orbitals constructed to match the symmetry of the SALC set.',
      'This connects group theory directly back to bonding/MO diagrams.'
    ], tip:'Practice building SALCs for a simple AB3 (e.g. BF3, planar) or AB4 (tetrahedral) system.' }
]},

{ section:'physical', title:'Spectroscopy', days:[
  { t:'Atomic Spectroscopy & Term Symbols', b:[
      'Russell-Saunders coupling: combine individual l\'s into L, s\'s into S.',
      'Term symbol: ²S⁺¹LJ, J from L−S to L+S.',
      'Ground state term found via Hund\'s rules.',
      'Selection rules: ΔL=0,±1; ΔS=0; ΔJ=0,±1 (J=0→0 forbidden).'
    ], tip:'Deriving the ground-state term symbol for a given dⁿ configuration is a guaranteed GATE question type.' },
  { t:'Rotational & Vibrational Spectroscopy', b:[
      'Rotational (microwave): needs a permanent dipole moment; ΔJ=±1.',
      'Vibrational (IR): needs a changing dipole during vibration; Δv=±1 (harmonic).',
      'Vibration-rotation spectra show P and R branches around a missing Q branch.',
      'Anharmonicity allows weak overtone bands (Δv=±2, ±3...).'
    ], tip:'Predicting which vibrational modes of a small polyatomic are IR-active uses last week\'s group theory directly.' },
  { t:'Electronic & Raman Spectroscopy; Line Shapes', b:[
      'Electronic transitions: Franck-Condon principle governs vibronic band intensities.',
      'Raman: inelastic scattering; Stokes/anti-Stokes lines flank the Rayleigh line.',
      'Homogeneous broadening → Lorentzian lineshape; Doppler/inhomogeneous → Gaussian.',
      'Natural linewidth relates to excited-state lifetime via the uncertainty principle.'
    ], tip:'Know the physical origin of broadening (lifetime, Doppler, collisions) — GATE tests the "why", not just the shape name.' },
  { t:'Beer-Lambert Law & Photophysics', b:[
      'A = εcl; ε is the molar extinction coefficient.',
      'Einstein coefficients (A, B) relate spontaneous/stimulated emission and absorption.',
      'Jablonski diagram: absorption → IC/ISC → fluorescence (fast) or phosphorescence (slow, spin-forbidden).',
      'Oscillator strength connects transition-moment integral to ε.'
    ], tip:'Fluorescence vs phosphorescence timescale and spin-multiplicity change is a favourite conceptual pair.' },
  { t:'NMR Basics', b:[
      'Gyromagnetic ratio γ links nuclear spin to its magnetic moment.',
      'Chemical shift δ reflects the local electronic (shielding) environment.',
      'Spin-spin (J) coupling splits signals via neighbouring nuclear spins.',
      'n equivalent neighbours give n+1 multiplet lines (simple first-order case).'
    ], tip:'Shielding/deshielding reasoning (electronegative groups, ring currents) shows up in both NMR and general organic structure questions.' }
]},

{ section:'physical', title:'Chemical Equilibrium & Thermodynamics', days:[
  { t:'Laws of Thermodynamics & Thermochemistry', b:[
      'First law: ΔU = q + w — energy is conserved.',
      'Second law: introduces entropy, defines spontaneity direction.',
      'Third law: S→0 as T→0 K for a perfect crystal.',
      'Hess\'s law: enthalpy of reaction is path-independent.'
    ], tip:'Sign conventions (work done ON vs BY the system) trip people up — fix one convention and stick to it.' },
  { t:'Gibbs-Helmholtz, Maxwell Relations, Van\'t Hoff', b:[
      'Gibbs-Helmholtz links ΔG/T temperature-dependence to ΔH.',
      'Maxwell relations come from equating mixed second partial derivatives.',
      'Gibbs-Duhem constrains how chemical potentials of components co-vary.',
      'Van\'t Hoff equation: d(lnK)/dT = ΔH°/RT² — links K to temperature.'
    ], tip:'Deriving one Maxwell relation from a thermodynamic potential (e.g. from dG) is a common short-answer question.' },
  { t:'Spontaneity & Absolute Entropy', b:[
      'ΔG < 0 at constant T,P ⇒ spontaneous process.',
      'ΔSuniverse ≥ 0 is the universal spontaneity criterion.',
      'Absolute entropy obtainable via the third law (integrating Cp/T from 0 K).',
      'Residual entropy at 0 K signals disorder even in "perfect" crystals.'
    ], tip:'Keep ΔG, ΔA (Helmholtz), and their constraint conditions (constant T,P vs T,V) straight — a frequent mix-up.' },
  { t:'Partial Molar Quantities & Chemical Potential', b:[
      'Partial molar property = how a property changes per mole of one component added.',
      'Chemical potential μi is the partial molar Gibbs energy.',
      'Thermodynamics of mixing: ΔGmix < 0 always drives spontaneous mixing.',
      'μi = μi° + RT ln(ai) links chemical potential to activity.'
    ], tip:'Chemical potential is the single quantity that decides equilibrium and phase distribution — treat it as the thread connecting this whole week.' },
  { t:'Fugacity, Activity & Equilibrium Constants', b:[
      'Fugacity is an "effective pressure" correcting for non-ideal gas behaviour.',
      'Activity plays the same corrective role for non-ideal solutions.',
      'K depends on T (Van\'t Hoff) and, for real systems, on pressure too.',
      'ΔG° = −RT ln K connects thermodynamics directly to equilibrium position.'
    ], tip:'ΔG° = −RT ln K is one of the most-used single equations across the whole physical chemistry section.' }
]},

{ section:'physical', title:'Solutions', days:[
  { t:'Ideal Solutions & Raoult\'s Law', b:[
      'Ideal solution: A-A, B-B, A-B interactions all similar.',
      'Raoult\'s law: pA = xA·pA° for the solvent-like component.',
      'Ideal solutions show zero ΔHmix and zero excess volume.',
      'Total vapour pressure is a straight-line sum for a truly ideal pair.'
    ], tip:'Raoult\'s law applies best to the major/solvent component even in real solutions.' },
  { t:'Non-ideal Solutions & Henry\'s Law', b:[
      'Henry\'s law: pB = KH·xB, for the dilute solute component.',
      'Positive deviation: A-B interactions weaker than A-A/B-B (higher vapour pressure than ideal).',
      'Negative deviation: A-B interactions stronger (lower vapour pressure than ideal).',
      'Real solutions often show Raoult\'s law for solvent, Henry\'s for solute simultaneously.'
    ], tip:'Match deviation direction to intermolecular-forces reasoning — GATE likes "explain why" questions here.' },
  { t:'Activity Coefficients', b:[
      'Activity coefficient γ measures deviation from ideal behaviour.',
      'γ → 1 as concentration → 0 (infinite dilution reference state).',
      'γ > 1 signals positive deviation; γ < 1 signals negative deviation.',
      'Excess Gibbs energy GE quantifies total non-ideality of a mixture.'
    ], tip:'Link this back to Nernst-equation-style activity corrections you\'ll see in electrochemistry.' },
  { t:'Colligative Properties (bridge)', b:[
      'Boiling point elevation and freezing point depression scale with solute molality.',
      'Osmotic pressure: Π = MRT for dilute ideal solutions (van\'t Hoff form).',
      'All colligative properties depend on number of particles, not their identity.',
      'Deviations occur with dissociation/association (van\'t Hoff factor i).'
    ], tip:'Colligative-property numericals are quick marks if you keep molality vs molarity straight.' },
  { t:'Review — Solutions', b:[
      'Write Raoult\'s and Henry\'s laws from memory, noting which component each applies to.',
      'Explain positive vs negative deviation using intermolecular forces.',
      'Solve one activity-coefficient or osmotic-pressure numerical.',
      'Connect activity back to chemical potential from last week.'
    ], tip:'Solutions is a short topic but a reliable, low-effort scoring area — don\'t skip the review.' }
]},

{ section:'physical', title:'Electrochemistry', days:[
  { t:'Electrode Potentials & Cells', b:[
      'Standard electrode potential measured against the SHE (0 V by convention).',
      'Cell notation: anode (oxidation) | ... || ... | cathode (reduction).',
      'Ecell° = E°cathode − E°anode.',
      'Positive Ecell° ⇒ spontaneous reaction as written.'
    ], tip:'Keep oxidation/anode and reduction/cathode assignments automatic — most errors here are sign errors, not concept errors.' },
  { t:'Nernst Equation', b:[
      'E = E° − (RT/nF) ln Q — corrects potential for non-standard conditions.',
      'At equilibrium, E = 0 and Q = K.',
      'ΔG = −nFE links electrochemistry directly to thermodynamics.',
      'Concentration cells generate EMF purely from a concentration difference.'
    ], tip:'ΔG° = −nFE° = −RT ln K ties this week straight back to the equilibrium week — use one to check the other.' },
  { t:'Potentiometric & Conductometric Titrations', b:[
      'Potentiometric titration: monitor E vs volume added; endpoint at steepest slope.',
      'Conductometric titration: monitor conductivity; endpoint at a slope change.',
      'Useful for coloured/turbid solutions where indicators fail.',
      'Derivative plots (dE/dV) sharpen endpoint detection.'
    ], tip:'Sketching the expected titration curve shape (before/at/after equivalence) is often asked directly.' },
  { t:'Ionic Mobility & Kohlrausch\'s Law', b:[
      'Molar conductivity increases with dilution (fewer inter-ionic interactions).',
      'Kohlrausch\'s law: Λm° = sum of individual ionic contributions.',
      'Lets you calculate Λm° for weak electrolytes indirectly.',
      'Ionic mobility differences (e.g. H+ and OH− anomalously high) reflect special conduction mechanisms.'
    ], tip:'H3O+ and OH− conduct via a Grotthuss (proton-hopping) mechanism — remember why they\'re outliers.' },
  { t:'Debye-Hückel Theory', b:[
      'Debye-Hückel limiting law predicts activity coefficients from ionic strength.',
      'log γ± ∝ −√I at low concentration.',
      'Ion atmosphere concept: each ion surrounded by an oppositely-charged cloud.',
      'Debye-Hückel-Onsager equation extends this to explain conductivity\'s concentration dependence.'
    ], tip:'√I dependence (not I) is the detail most often mis-remembered — double-check this one.' }
]},

{ section:'physical', title:'Phase Equilibria', days:[
  { t:'Phase Rule & Clausius-Clapeyron', b:[
      'Gibbs phase rule: F = C − P + 2.',
      'F = degrees of freedom, C = components, P = phases.',
      'Clausius-Clapeyron: dP/dT = ΔHvap/(TΔV) along a phase boundary.',
      'Approximation for gas-involving equilibria: d(lnP)/dT = ΔHvap/RT².'
    ], tip:'Apply the phase rule first to sanity-check any phase diagram question — it tells you how many variables are actually free.' },
  { t:'One-Component Phase Diagrams', b:[
      'H2O: unusual negative-slope solid-liquid line (ice less dense than water).',
      'CO2: no liquid phase at 1 atm — sublimes directly (triple point above 1 atm).',
      'Sulfur: multiple solid allotropes (rhombic, monoclinic) add extra triple points.',
      'Triple point = unique T,P where all three phases coexist (F=0).'
    ], tip:'H2O\'s negative-slope fusion line is the single most-tested phase-diagram detail — know *why* (ice is less dense).' },
  { t:'Two-Component: Liquid-Vapour Systems', b:[
      'Ideal liquid-vapour diagrams: lens-shaped, following Raoult\'s law.',
      'Non-ideal systems can form azeotropes — vapour and liquid same composition.',
      'Minimum-boiling azeotrope: positive deviation from Raoult\'s law.',
      'Maximum-boiling azeotrope: negative deviation from Raoult\'s law.'
    ], tip:'Azeotropes can\'t be separated by simple distillation — this is the practical consequence worth remembering.' },
  { t:'Liquid-Liquid & Solid-Liquid Systems', b:[
      'Partially miscible liquids show an upper/lower critical solution temperature.',
      'Eutectic: lowest-melting composition of a solid-liquid two-component system.',
      'At the eutectic point, liquid solidifies into both solids simultaneously.',
      'Eutectic diagrams show two intersecting cooling curves (liquidus lines).'
    ], tip:'Practice reading a eutectic phase diagram — identifying liquidus, solidus, and eutectic point from a given curve.' },
  { t:'Fractional Distillation & Azeotropes', b:[
      'Fractional distillation exploits repeated vaporization-condensation cycles.',
      'Each theoretical plate approximates one equilibrium vaporization step.',
      'Azeotropic composition caps how pure a component can get by distillation alone.',
      'Breaking an azeotrope needs a third component or pressure-swing distillation.'
    ], tip:'Connect this back to the Raoult/Henry deviations you studied in the solutions week — same underlying cause.' }
]},

{ section:'physical', title:'Statistical Thermodynamics', days:[
  { t:'Ensembles', b:[
      'Microcanonical: fixed N, V, E (isolated system).',
      'Canonical: fixed N, V, T (system in a heat bath).',
      'Grand canonical: fixed μ, V, T (particles and energy both exchanged).',
      'Choice of ensemble should match the physical constraints of the problem.'
    ], tip:'Match "what\'s fixed" in the question to the right ensemble before writing any formula.' },
  { t:'Boltzmann Distribution & Partition Functions', b:[
      'Boltzmann distribution: population ratio ∝ exp(−ΔE/kT).',
      'Partition function q = Σ gi·exp(−Ei/kT) — sums over accessible states.',
      'q connects microscopic energy levels to macroscopic thermodynamic functions.',
      'Total q for independent modes multiplies: q = qtrans·qrot·qvib·qelec.'
    ], tip:'The "q separates into a product" trick is what makes the rest of this week tractable — lean on it.' },
  { t:'Translational & Rotational Partition Functions', b:[
      'qtrans from the particle-in-a-box result, extended to 3D and a continuum limit.',
      'qtrans scales with V and T^(3/2).',
      'qrot for a linear rotor ≈ T/(σ·θrot), θrot from the moment of inertia.',
      'Symmetry number σ accounts for indistinguishable orientations (e.g. σ=2 for homonuclear diatomics).'
    ], tip:'Don\'t forget the symmetry number σ for symmetric/homonuclear molecules — a classic point lost on numericals.' },
  { t:'Vibrational & Electronic Partition Functions', b:[
      'qvib built from the SHO ladder of levels, often measured from the zero-point level.',
      'At low T, qvib → 1 (only ground vibrational state populated).',
      'qelec usually ≈ ground-state degeneracy unless low-lying excited states exist.',
      'Each partition function feeds directly into U, S, and Cv formulas.'
    ], tip:'Know which partition function dominates at room temperature (usually trans + rot; vib often frozen out).' },
  { t:'Applications to Ideal Gases', b:[
      'Equipartition theorem: each quadratic energy term contributes ½kT to U.',
      'Monoatomic gas: only translational modes — Cv = (3/2)R.',
      'Diatomic gas: add rotational (and, at high T, vibrational) contributions.',
      'Statistical thermodynamics reproduces classical thermodynamic results as a limiting case.'
    ], tip:'Predicting Cv for mono- vs di-atomic ideal gases from mode-counting is a fast, reliable numerical.' }
]},

{ section:'physical', title:'Kinetics & Reaction Dynamics', days:[
  { t:'Reaction Types & Steady State', b:[
      'Parallel reactions: same reactant, competing pathways — product ratio set by rate constants.',
      'Consecutive reactions: A→B→C, B shows a rise-then-fall concentration profile.',
      'Steady-state approximation: d[intermediate]/dt ≈ 0 for a short-lived species.',
      'Opposing reactions approach equilibrium; net rate depends on forward minus reverse.'
    ], tip:'Steady-state approximation is the single most useful trick for simplifying complex mechanisms — practice applying it, not just stating it.' },
  { t:'Complex Mechanisms & Unimolecular Reactions', b:[
      'Rate-determining step approximation simplifies multi-step mechanisms.',
      'Lindemann mechanism explains apparent unimolecular kinetics via a bimolecular activation step.',
      'At high pressure, unimolecular reactions appear first-order; at low pressure, second-order.',
      'Chain reactions have initiation, propagation, and termination steps.'
    ], tip:'Lindemann\'s pressure-dependent order-crossover is a favourite "explain the graph" question.' },
  { t:'Transition State Theory', b:[
      'Potential energy surface: reaction coordinate connects reactants, TS, and products.',
      'Saddle point = transition state, a maximum along the reaction path, minimum perpendicular to it.',
      'Eyring equation: k = (kBT/h)·exp(−ΔG‡/RT).',
      'ΔG‡ splits into ΔH‡ (enthalpy of activation) and ΔS‡ (entropy of activation).'
    ], tip:'Eyring vs Arrhenius: know how Ea relates to ΔH‡ — a frequent conceptual-numerical hybrid question.' },
  { t:'Catalysis & Polymerization Kinetics', b:[
      'Catalysts lower Ea by providing an alternate mechanism, don\'t shift equilibrium position.',
      'Enzyme kinetics: Michaelis-Menten equation, Vmax and Km characterize the system.',
      'Chain-growth polymerization kinetics follow initiation/propagation/termination steps.',
      'Kinetic isotope effect: heavier isotopes react slower when the bond to that atom breaks in the RDS.'
    ], tip:'A large KIE (kH/kD ~ 6-8) signals C-H bond breaking in the rate-determining step — a classic mechanistic diagnostic.' },
  { t:'Fast Kinetics & Photophysical Processes', b:[
      'Relaxation methods (T-jump) and flow methods probe very fast reactions.',
      'Diffusion-controlled reactions: rate limited by how fast molecules physically meet.',
      'Quantum yield = events occurring / photons absorbed.',
      'Static quenching (complex formation) vs dynamic quenching (diffusional encounter) distinguished by Stern-Volmer behaviour.'
    ], tip:'Static vs dynamic quenching distinction (via lifetime measurements) is a recurring photochemistry-kinetics crossover question.' }
]},

{ section:'physical', title:'Surfaces & Interfaces', days:[
  { t:'Physisorption vs Chemisorption', b:[
      'Physisorption: weak van der Waals forces, multilayer possible, low ΔHads.',
      'Chemisorption: forms actual chemical bonds, monolayer only, higher ΔHads.',
      'Chemisorption often has an activation energy; physisorption usually doesn\'t.',
      'Chemisorption is generally more temperature- and site-specific.'
    ], tip:'A quick ΔHads magnitude and "monolayer vs multilayer" check usually settles which type is being described.' },
  { t:'Langmuir, Freundlich & BET Isotherms', b:[
      'Langmuir isotherm assumes monolayer coverage on identical, independent sites.',
      'θ = KP/(1+KP) — saturates at high pressure.',
      'Freundlich isotherm: empirical power law, no saturation limit built in.',
      'BET isotherm extends Langmuir to allow multilayer physisorption.'
    ], tip:'Linearizing the Langmuir isotherm (1/θ vs 1/P) is a standard numerical GATE asks for directly.' },
  { t:'Surface Catalysis', b:[
      'Langmuir-Hinshelwood: both reactants adsorb on the surface before reacting.',
      'Rate depends on the product of both surface coverages.',
      'Eley-Rideal (contrast): one reactant adsorbs, the other reacts directly from the gas phase.',
      'Catalyst surface area and active site availability directly control reaction rate.'
    ], tip:'Be ready to derive the rate law shape for Langmuir-Hinshelwood kinetics from the coverage expressions.' },
  { t:'Surface Tension & Viscosity', b:[
      'Surface tension arises from unbalanced intermolecular forces at an interface.',
      'Higher surface tension ⇒ stronger intermolecular attraction in the liquid.',
      'Viscosity resists flow; depends on intermolecular forces and molecular shape.',
      'Both properties are sensitive to temperature (generally decrease as T rises).'
    ], tip:'Keep surface tension (interfacial) and viscosity (bulk flow) conceptually separate — an easy but common mix-up.' },
  { t:'Colloids & Self-Assembly', b:[
      'Colloids: intermediate-sized particles, don\'t settle, scatter light (Tyndall effect).',
      'Micelles form above the critical micelle concentration (CMC).',
      'Amphiphiles self-assemble to minimize hydrophobic exposure to water.',
      'Macromolecular solutions share some colloidal behaviour due to their large size.'
    ], tip:'CMC and how it shifts with temperature/electrolyte concentration is a common short-answer target.' }
]},

// ---------------- SECTION 2 — INORGANIC CHEMISTRY ----------------

{ section:'inorganic', title:'Main Group Elements', days:[
  { t:'VSEPR, Hydrides, Halides & Oxides', b:[
      'VSEPR: electron-domain repulsion decides molecular geometry.',
      'Lone pairs occupy more space than bonding pairs — compress bond angles.',
      'Hydride classification: ionic (saline), covalent (molecular), metallic (interstitial).',
      'Oxide acidity trend: basic (metals) → amphoteric → acidic (non-metals), across a period.'
    ], tip:'Predicting shape from a Lewis structure via VSEPR should be near-instant — drill it until it is.' },
  { t:'Boranes, Carboranes & Electron Counting', b:[
      'Boranes are electron-deficient — need 3-center-2-electron bonds.',
      'Wade\'s rules classify cluster type: closo, nido, arachno by skeletal electron pairs.',
      'Carboranes replace BH units with isolobal CH units.',
      'Isolobal analogy: fragments with matching frontier orbitals behave similarly in bonding.'
    ], tip:'Wade\'s rule electron counting (skeletal electron pairs = n+1 closo, n+2 nido...) is a guaranteed numerical-style question.' },
  { t:'Silicates, Silicones, Borazine & Phosphazenes', b:[
      'Silicates built from SiO4 tetrahedra — sharing corners gives chains, sheets, or 3D networks.',
      'Silicones: Si-O backbone with organic side groups, thermally and chemically robust.',
      'Borazine (B3N3H6): "inorganic benzene", isoelectronic with benzene but more reactive.',
      'Phosphazenes: (NPCl2)n rings/chains with alternating P-N bonding.'
    ], tip:'Borazine\'s greater reactivity vs benzene (despite the analogy) is a classic "explain the exception" question.' },
  { t:'Allotropes & Industrial Synthesis', b:[
      'Carbon allotropes: diamond (sp3, hard), graphite (sp2, layered, conducts), fullerenes (sp2, curved cages).',
      'Phosphorus allotropes: white (reactive, tetrahedral P4), red, black (most stable, layered).',
      'Haber process: N2 + 3H2 ⇌ 2NH3, high P, moderate T, Fe catalyst.',
      'Contact process (H2SO4) and Ostwald process (HNO3) both rely on catalytic oxidation steps.'
    ], tip:'Know the catalyst and rough conditions for each industrial process — a recurring fact-recall question.' },
  { t:'Noble Gases, Interhalogens & Acid-Base Concepts', b:[
      'Noble gas compounds (XeF2, XeF4, XeF6...) exist mainly with F and O, via Xe\'s lower ionization energy.',
      'Interhalogen compounds (ClF3, IF7...) follow VSEPR just like other main-group species.',
      'Lewis acid/base: electron pair acceptor/donor — broader than Brønsted.',
      'HSAB principle: hard acids prefer hard bases, soft acids prefer soft bases.'
    ], tip:'Use HSAB to predict which of two possible products is favoured — a common qualitative-reasoning question.' }
]},

{ section:'inorganic', title:'Transition Metals — Bonding & Spectra', days:[
  { t:'Coordination Chemistry & Isomerism', b:[
      'Coordination number and geometry set by ligand field and metal size.',
      'Structural isomerism: ionization, linkage, coordination isomerism.',
      'Stereoisomerism: geometric (cis/trans) and optical isomerism.',
      'Chelate ligands form more thermodynamically stable complexes (chelate effect).'
    ], tip:'Chelate effect is entropy-driven — be ready to explain it via ΔS, not just state it.' },
  { t:'VBT, CFT & MOT', b:[
      'VBT: hybridization of metal orbitals explains geometry but not magnetism well.',
      'CFT: treats ligands as point charges splitting d-orbital energies.',
      'MOT: most complete picture, includes covalency via metal-ligand orbital overlap.',
      'Each theory trades simplicity for explanatory power — know what each one is good at.'
    ], tip:'If a question asks "why doesn\'t VBT explain X", the answer is almost always tied to magnetism or spectra.' },
  { t:'CFSE & Jahn-Teller Distortion', b:[
      'Octahedral splitting: t2g (lower) and eg (upper), Δo separates them.',
      'CFSE = crystal field stabilization energy, depends on electron configuration and spin state.',
      'Jahn-Teller: unevenly filled degenerate orbitals distort the geometry to lower energy.',
      'Strongest J-T distortions occur for high-spin d4 and low-spin d7/d9 configurations.'
    ], tip:'Calculating CFSE for a given dⁿ, high-spin/low-spin case is a guaranteed numerical.' },
  { t:'Electronic Spectra — Term Symbols & Diagrams', b:[
      'Free-ion term symbols found via Russell-Saunders coupling, same method as atomic spectroscopy.',
      'Orgel diagrams: qualitative, for weak-field, high-spin complexes only.',
      'Tanabe-Sugano diagrams: quantitative, cover the full field-strength range including spin-crossover.',
      'd-d transitions are Laporte-forbidden but gain intensity via vibronic coupling.'
    ], tip:'Reading a Tanabe-Sugano diagram to predict transition energies is a core GATE inorganic skill — practice with d2 and d8 cases.' },
  { t:'Magnetism & Charge-Transfer Spectra', b:[
      'Magnetic moment (spin-only): μ = √[n(n+2)] BM, n = unpaired electrons.',
      'Nephelauxetic effect: reduced inter-electron repulsion on complex formation vs free ion (covalency indicator).',
      'Racah parameter B quantifies inter-electron repulsion, shrinks with more covalent bonding.',
      'Charge-transfer bands (LMCT/MLCT) are far more intense than d-d transitions.'
    ], tip:'Distinguishing a d-d band from a charge-transfer band by intensity alone is a quick, testable skill.' }
]},

{ section:'inorganic', title:'Transition Metals — Mechanisms', days:[
  { t:'Ray-Dutt & Bailar Twists', b:[
      'Both are non-dissociative pathways for racemization/isomerization of octahedral complexes.',
      'Bailar twist: trigonal (C3) twist mechanism via a trigonal-prismatic intermediate.',
      'Ray-Dutt twist: rhombic (C2) twist pathway, different intermediate geometry.',
      'Relevant mainly to tris-chelate complexes undergoing intramolecular rearrangement.'
    ], tip:'Know which intermediate geometry (trigonal prism vs rhombic) belongs to which twist — a direct recall question.' },
  { t:'Substitution Mechanisms', b:[
      'Associative (A): rate depends on incoming ligand, forms a higher-coordinate intermediate.',
      'Dissociative (D): rate depends only on leaving group, forms a lower-coordinate intermediate.',
      'Interchange (Ia/Id) mechanisms fall between the two limiting cases.',
      'Square planar substitutions typically go associative (16e → 18e transition state).'
    ], tip:'Square-planar (associative, trans effect matters) vs octahedral (often dissociative) is a key contrast to hold onto.' },
  { t:'Redox Reactions & Stability', b:[
      'Outer-sphere electron transfer: no bridging ligand, electron "jumps" between complexes.',
      'Inner-sphere electron transfer: a bridging ligand connects the two metal centres.',
      'Thermodynamic stability = position of equilibrium (K); kinetic stability = rate of reaction.',
      'A complex can be thermodynamically unstable yet kinetically inert (e.g. some Cr(III), Co(III) complexes).'
    ], tip:'The classic "labile vs inert" distinction is really kinetic, not thermodynamic — GATE tests this contrast directly.' },
  { t:'Review — Mechanisms I', b:[
      'Compare associative vs dissociative substitution with one example each.',
      'Explain inner-sphere vs outer-sphere electron transfer.',
      'Sketch the trigonal-prismatic intermediate for a Bailar twist.',
      'Note any weak spots for tomorrow\'s deeper review.'
    ], tip:'This sub-area is conceptually dense but low-volume — a focused review pays off fast.' },
  { t:'Review — Mechanisms II', b:[
      'Redo one substitution-rate-law problem from scratch.',
      'List the trans effect series from memory if covered in your notes.',
      'Re-explain kinetic vs thermodynamic stability with a fresh example.',
      'Cross-check against the bonding/spectra week for consistency.'
    ], tip:'Mechanisms connect tightly to the bonding week — revise them together, not in isolation.' }
]},

{ section:'inorganic', title:'Lanthanides & Actinides', days:[
  { t:'Recovery & Extraction', b:[
      'Lanthanides typically extracted from monazite/bastnasite ores.',
      'Separation relies on small chemical differences — ion exchange and solvent extraction used industrially.',
      'Actinides (post-uranium) mostly made by nuclear reactions, not mined.',
      'Lanthanide contraction makes adjacent element separation particularly difficult.'
    ], tip:'Lanthanide contraction is the thread linking extraction difficulty, periodic properties, and even transition-metal chemistry after them.' },
  { t:'Periodic Properties', b:[
      'Lanthanide contraction: steady radius decrease across the series from poor 4f shielding.',
      'This contraction explains why Zr and Hf (post-lanthanide) have near-identical radii.',
      'Oxidation state +3 is most common and most stable across the lanthanides.',
      'Actinides show more variable oxidation states than lanthanides (more accessible 5f, 6d, 7s energies).'
    ], tip:'Zr/Hf near-identical properties is the single most-cited real-world consequence of lanthanide contraction.' },
  { t:'Spectral Properties', b:[
      'f-f transitions are Laporte-forbidden, giving sharp, weak absorption/emission lines.',
      'Lines stay sharp because 4f orbitals are shielded from the ligand environment by outer 5s/5p.',
      'This shielding is why lanthanide spectra barely shift with different ligands (unlike d-block).',
      'Actinide 5f orbitals are less shielded, so actinide spectra are broader and more ligand-sensitive.'
    ], tip:'"Sharp lanthanide lines vs broader actinide/d-block bands" is explained entirely by orbital shielding — know the reasoning.' },
  { t:'Magnetic Properties', b:[
      'Lanthanide magnetism must include both spin and orbital angular momentum (unlike d-block spin-only).',
      'Use the full J-based magnetic moment formula, not the spin-only one.',
      'Exceptions exist (e.g. Sm³⁺, Eu³⁺) where simple theory underestimates the true moment.',
      'Actinide magnetism is more complex due to significant spin-orbit coupling and covalency.'
    ], tip:'Remember *why* the spin-only formula fails here — orbital contribution isn\'t quenched the way it is in the d-block.' },
  { t:'Review — Lanthanides & Actinides', b:[
      'Explain lanthanide contraction and one consequence, unaided.',
      'Compare f-f and d-d transition sharpness with reasoning.',
      'Note the dominant oxidation states for both series.',
      'Flag anything you\'re still fuzzy on for a later revision pass.'
    ], tip:'This is a compact, fact-dense topic — a clean recall pass locks it in efficiently.' }
]},

{ section:'inorganic', title:'Organometallics', days:[
  { t:'18-Electron Rule & Basic Complex Types', b:[
      '18-electron rule: stable complexes often reach a closed-shell electron count (like a noble gas analogy).',
      'Metal-alkyl complexes: simple M-C σ bonds, can be thermally/kinetically unstable.',
      'Metal-carbonyl complexes: CO is both a σ-donor and π-acceptor (synergic bonding).',
      'π-backbonding into CO\'s π* weakens the C-O bond — visible via lowered IR stretching frequency.'
    ], tip:'CO stretching frequency shifts are a direct, testable probe of how much π-backbonding is happening.' },
  { t:'Metal-Olefin, Carbene & Metallocenes', b:[
      'Metal-olefin bonding: Dewar-Chatt-Duncanson model, σ-donation plus π-backbonding.',
      'Fischer carbenes: electrophilic at carbon, heteroatom-stabilized.',
      'Schrock carbenes: nucleophilic at carbon, no heteroatom stabilization.',
      'Metallocenes (e.g. ferrocene): sandwich structures with η5-cyclopentadienyl ligands.'
    ], tip:'Fischer vs Schrock carbene reactivity (electrophilic vs nucleophilic) is a frequently tested contrast.' },
  { t:'Fluxionality & Homogeneous Catalysis I', b:[
      'Fluxionality: rapid intramolecular rearrangement makes ligand positions appear equivalent on the NMR timescale.',
      'Hydrogenation (Wilkinson\'s catalyst): oxidative addition, insertion, reductive elimination cycle.',
      'Hydroformylation: converts alkenes + CO/H2 into aldehydes using Rh or Co catalysts.',
      'Catalytic cycles are best understood as a loop of elementary organometallic steps.'
    ], tip:'Draw out Wilkinson\'s catalytic cycle step by step — the elementary-step vocabulary (oxidative addition, insertion...) recurs everywhere.' },
  { t:'Homogeneous Catalysis II', b:[
      'Methanol-to-acetic-acid (Monsanto/Cativa process): Rh or Ir catalyzed carbonylation.',
      'Olefin metathesis: redistributes alkene fragments via a metal-carbene intermediate.',
      'Wacker oxidation: converts ethylene to acetaldehyde using Pd(II)/Cu(II) catalytic system.',
      'Each named process is a real industrial application of organometallic elementary steps.'
    ], tip:'Know the metal used in each named process (Rh/Ir, Pd/Cu...) — a quick, high-yield recall target.' },
  { t:'Heterogeneous Catalysis', b:[
      'Fischer-Tropsch: converts syngas (CO+H2) into hydrocarbons on a solid metal catalyst.',
      'Ziegler-Natta catalysis: enables stereoregular polymerization of alkenes (e.g. isotactic polypropylene).',
      'Heterogeneous catalysis happens at a solid surface — connects back to the surfaces/adsorption week.',
      'Catalyst surface structure strongly controls product selectivity in both processes.'
    ], tip:'Tie Ziegler-Natta\'s stereoregularity back to the stereochemistry concepts you\'ll formalize in the organic section.' }
]},

{ section:'inorganic', title:'Bioinorganic Chemistry', days:[
  { t:'Na⁺/K⁺ Transport', b:[
      'Na+/K+-ATPase actively pumps ions against their concentration gradient using ATP.',
      'Ion selectivity arises from precise cavity size and coordinating oxygen geometry.',
      'Maintains the electrochemical gradient essential for nerve signalling.',
      'A clear example of inorganic ions performing an essential biological function.'
    ], tip:'Keep the "why K+ channels reject Na+" size-and-coordination argument ready — a common conceptual question.' },
  { t:'Oxygen Binding & Transport', b:[
      'Hemoglobin/myoglobin use an Fe(II) heme center to reversibly bind O2.',
      'Cooperative binding in hemoglobin gives its sigmoidal oxygen-binding curve.',
      'Myoglobin (single subunit) binds O2 with a simple hyperbolic curve, no cooperativity.',
      'Fe must stay Fe(II); oxidation to Fe(III) (methemoglobin) can\'t bind O2.'
    ], tip:'Sigmoidal (hemoglobin) vs hyperbolic (myoglobin) binding curves is a classic compare-and-explain question.' },
  { t:'Electron Transfer & Nitrogen Fixation', b:[
      'Cytochromes use Fe-heme centers for sequential electron-transfer steps.',
      'Iron-sulfur clusters (Fe-S) are common fast electron-relay cofactors.',
      'Nitrogenase enzyme reduces N2 to NH3 using a complex Fe-Mo cofactor.',
      'Biological N2 fixation happens at ambient conditions, unlike the industrial Haber process.'
    ], tip:'Contrast nitrogenase\'s mild conditions with the Haber process\'s high P/T — a nice cross-week connection.' },
  { t:'Metalloenzymes', b:[
      'Carbonic anhydrase: Zn²⁺ center, rapidly interconverts CO2 and bicarbonate.',
      'Molybdenum-containing enzymes handle key oxo-transfer and nitrogen-cycle reactions.',
      'Copper enzymes participate in electron transfer and O2 activation (e.g. plastocyanin, laccase).',
      'Cobalt\'s key biological role: at the center of vitamin B12 (cobalamin).'
    ], tip:'Match each metal (Zn, Mo, Fe, Co, Cu) to at least one signature enzyme/cofactor — a direct fact-recall target.' },
  { t:'Review — Bioinorganic Chemistry', b:[
      'List one biological role for each of Na, K, Fe, Cu, Zn, Mo, Co.',
      'Explain cooperativity in hemoglobin binding, unaided.',
      'Compare nitrogenase and Haber-process nitrogen fixation.',
      'Note connections back to coordination chemistry and CFT.'
    ], tip:'Bioinorganic questions are often "apply CFT/coordination concepts to a biological system" — treat it as applied, not separate.' }
]},

{ section:'inorganic', title:'Solids', days:[
  { t:'Crystal Systems & Lattices', b:[
      'Seven crystal systems, fourteen Bravais lattices describe all possible 3D periodic arrangements.',
      'Unit cell: smallest repeating unit that generates the full lattice by translation.',
      'Miller indices (hkl) describe orientation of a crystal plane.',
      'Smaller Miller indices generally mean more widely-spaced, more densely-packed planes.'
    ], tip:'Practice deriving Miller indices from plane intercepts — a guaranteed short numerical.' },
  { t:'Packing, Defects & Bragg\'s Law', b:[
      'Close packing: hcp and ccp/fcc both reach 74% packing efficiency, differ in stacking sequence (ABAB vs ABCABC).',
      'Point defects: vacancies, interstitials, substitutional atoms.',
      'Schottky defect: paired vacancies, preserves stoichiometry, common in ionic crystals with similar-sized ions.',
      'Bragg\'s law: nλ = 2d sinθ — the basis of X-ray diffraction structure determination.'
    ], tip:'Frenkel vs Schottky defect: Frenkel needs a size mismatch (small cation migrates); Schottky needs similar ion sizes.' },
  { t:'Ionic Crystal Structures', b:[
      'AX-type: rock salt (NaCl, octahedral holes) vs zinc blende/wurtzite (tetrahedral holes).',
      'AX2-type: fluorite (CaF2) and rutile (TiO2) structures.',
      'ABX3-type: perovskite structure, technologically important (solar cells, ferroelectrics).',
      'Spinels (AB2O4): normal vs inverse spinel depends on site-preference energies of A and B cations.'
    ], tip:'Radius-ratio rules predict coordination number/structure type — practice applying them to a given ionic pair.' },
  { t:'Band Theory', b:[
      'Overlapping atomic orbitals in a solid form continuous energy bands, not discrete levels.',
      'Metals: partially filled band, or overlapping valence/conduction bands — always conduct.',
      'Insulators: large band gap between filled valence and empty conduction band.',
      'Semiconductors: small band gap — intrinsic conduction increases with temperature.'
    ], tip:'Explain why semiconductor conductivity rises with T while metal conductivity falls — a classic band-theory conceptual question.' },
  { t:'Zeolites & Applications', b:[
      'Zeolites: microporous aluminosilicates with well-defined, uniform channel/cage sizes.',
      'Used as molecular sieves — separate molecules by size and shape selectivity.',
      'Act as solid acid catalysts in petrochemical cracking and related industrial processes.',
      'Also used for ion exchange (e.g. water softening) due to their open framework structure.'
    ], tip:'Zeolite shape-selectivity is a nice bridge back to surface catalysis concepts from the physical chemistry section.' }
]},

{ section:'inorganic', title:'Instrumental Methods of Analysis', days:[
  { t:'UV-Vis, Fluorescence & FT-IR', b:[
      'UV-vis: probes electronic transitions, follows Beer-Lambert law.',
      'Fluorescence: far more sensitive than absorption, useful at very low concentrations.',
      'FT-IR: probes vibrational transitions, functional-group fingerprinting.',
      'FT method (interferometry) massively speeds up data collection vs older dispersive IR.'
    ], tip:'Know roughly which functional groups show characteristic, easily-recognized IR stretches — a fast recall skill.' },
  { t:'NMR, ESR & Mass Spectrometry', b:[
      'NMR: probes nuclear spin environments (structure, connectivity).',
      'ESR (EPR): probes unpaired electrons — needs a paramagnetic species (radicals, some transition metals).',
      'Mass spectrometry: measures mass-to-charge ratio of ionized fragments.',
      'Molecular ion peak and characteristic fragmentation patterns both aid structure determination.'
    ], tip:'ESR requires an unpaired electron — a diamagnetic complex simply won\'t show a signal. A common trick-question basis.' },
  { t:'AAS, Mössbauer & X-ray Crystallography', b:[
      'Atomic absorption spectroscopy: quantifies specific elements via characteristic atomic absorption lines.',
      'Mössbauer spectroscopy: probes nuclear energy levels, most useful for Fe and Sn compounds.',
      'Mössbauer parameters (isomer shift, quadrupole splitting) reveal oxidation state and coordination environment.',
      'X-ray crystallography: full 3D structure determination via diffraction pattern analysis (Bragg\'s law again).'
    ], tip:'Isomer shift in Mössbauer directly tracks oxidation state of Fe — a specific, testable fact.' },
  { t:'Electroanalytical Methods', b:[
      'Cyclic voltammetry: sweeps potential, records current — reveals redox potentials and reversibility.',
      'A reversible redox couple shows characteristic, symmetric anodic/cathodic peak separation.',
      'Ion-selective electrodes: measure activity of a specific ion via a selective membrane potential.',
      'Both techniques connect directly back to Nernst-equation concepts from electrochemistry.'
    ], tip:'Practice reading a cyclic voltammogram — identifying anodic/cathodic peaks and judging reversibility from peak shape.' },
  { t:'Thermoanalytical Methods', b:[
      'TGA (thermogravimetric analysis): tracks mass change vs temperature — decomposition, dehydration steps.',
      'DTA (differential thermal analysis): tracks temperature difference vs a reference — detects phase transitions.',
      'DSC (differential scanning calorimetry): quantifies heat flow — gives actual ΔH values for transitions.',
      'DSC gives more quantitative thermal data than DTA, which is more qualitative.'
    ], tip:'Match TGA (mass), DTA (temperature difference), DSC (heat flow, quantitative) to what each technique actually measures — a quick recall check.' }
]},

// ---------------- SECTION 3 — ORGANIC CHEMISTRY ----------------

{ section:'organic', title:'Structure & Reactivity Fundamentals', days:[
  { t:'Acidity, Basicity & Structure', b:[
      'Inductive effects: electronegative groups nearby stabilize negative charge, raise acidity.',
      'Resonance stabilization of the conjugate base is usually the dominant acidity factor.',
      'Hybridization matters: more s-character (sp > sp² > sp³) stabilizes a lone pair/anion, raises acidity.',
      'Solvent effects can significantly shift observed acidity/basicity trends.'
    ], tip:'Rank a set of similar acids by working through inductive, resonance, and hybridization effects in that order.' },
  { t:'Aromaticity & Physical Properties', b:[
      'Aromaticity requires: cyclic, planar, fully conjugated, and 4n+2 π-electrons (Hückel\'s rule).',
      'Aromatic stabilization raises thermodynamic stability, lowers reactivity toward addition.',
      'Antiaromatic (4n π-electrons, cyclic, planar) systems are destabilized, highly reactive.',
      'Aromaticity affects bond lengths (equalized), NMR shifts (ring current), and acidity/basicity.'
    ], tip:'Ring-current deshielding/shielding in NMR is a direct experimental signature of aromaticity — connects to the spectroscopy week.' },
  { t:'Hyperconjugation & Conjugation', b:[
      'Hyperconjugation: σ(C-H)→p orbital donation stabilizes adjacent cations/radicals/alkenes.',
      'More adjacent C-H (or C-C) bonds available ⇒ more hyperconjugative stabilization.',
      'Conjugation (through π-systems) generally provides stronger stabilization than hyperconjugation.',
      'Both effects explain relative stability trends of carbocations and substituted alkenes.'
    ], tip:'Carbocation stability order (3° > 2° > 1°) is explained by hyperconjugation count — be ready to justify it, not just recite it.' },
  { t:'Substituent Effects Overview', b:[
      'Electron-donating groups (EDGs) activate rings toward electrophilic attack, direct ortho/para.',
      'Electron-withdrawing groups (EWGs) deactivate rings, mostly direct meta (except halogens).',
      'Halogens: deactivating overall but ortho/para-directing (inductive vs resonance effects compete).',
      'Same substituent classification underlies both aromatic reactivity and general acid/base strength trends.'
    ], tip:'Halogens are the classic "deactivating yet ortho/para-directing" exception — know exactly why.' },
  { t:'Review — Structure & Reactivity', b:[
      'Rank three related acids/bases by inductive, resonance, and hybridization effects.',
      'Explain Hückel\'s 4n+2 rule with one aromatic and one antiaromatic example.',
      'Justify carbocation stability order via hyperconjugation.',
      'Re-derive why halogens are deactivating but ortho/para-directing.'
    ], tip:'This week\'s reasoning tools (resonance, induction, hyperconjugation) get reused constantly in every organic week ahead.' }
]},

{ section:'organic', title:'Stereochemistry', days:[
  { t:'Chirality & R/S Assignment', b:[
      'Chirality: non-superimposable mirror images (no internal plane/center of symmetry).',
      'CIP priority rules rank substituents to assign R/S at each stereocenter.',
      'Enantiomers: identical physical properties except optical rotation direction and interaction with other chiral molecules.',
      'A molecule can have stereocenters yet be achiral overall (internal mirror symmetry, e.g. meso compounds).'
    ], tip:'Meso compounds are the trap: multiple stereocenters but still achiral — always check for an internal symmetry plane.' },
  { t:'Topicity & Multiple Stereocenters', b:[
      'Diastereomers: stereoisomers that are not mirror images — differ in physical properties.',
      'Homotopic atoms/groups: identical in every environment (replacement gives the same product).',
      'Enantiotopic atoms/groups: replacement gives enantiomers.',
      'Diastereotopic atoms/groups: replacement gives diastereomers — often show different NMR shifts.'
    ], tip:'Diastereotopic protons showing up as separate NMR signals is a frequently tested consequence of topicity.' },
  { t:'Conformational Analysis', b:[
      'Acyclic: Newman projections show staggered (stable) vs eclipsed (strained) conformations.',
      'Cyclohexane: chair is the lowest-energy conformation; ring-flip interconverts axial/equatorial positions.',
      'Larger substituents prefer the equatorial position to minimize 1,3-diaxial strain.',
      'A-value quantifies a substituent\'s equatorial preference strength.'
    ], tip:'Predicting the preferred chair conformation for a substituted cyclohexane from A-values is a reliable, practice-able skill.' },
  { t:'Geometric Isomerism & Atropisomerism', b:[
      'Geometric (cis/trans or E/Z) isomerism arises from restricted rotation (double bonds, rings).',
      'Atropisomerism: chirality from restricted rotation about a single bond (e.g. hindered biaryls).',
      'Neighbouring group participation (NGP): a nearby group assists a reaction, often via a cyclic intermediate.',
      'NGP can dramatically accelerate reaction rate and control product stereochemistry.'
    ], tip:'NGP explaining retention (rather than inversion) of configuration is a classic mechanism-plus-stereochemistry question.' },
  { t:'Stereoselective Synthesis & ee', b:[
      'Stereospecific: mechanism dictates a fixed stereochemical outcome (e.g. SN2 inversion).',
      'Stereoselective: one stereochemical outcome is simply favoured, not mechanistically forced.',
      'Enantiomeric excess (ee) = (major − minor)/(major + minor) × 100%.',
      'High ee is the practical goal of most asymmetric synthesis methods.'
    ], tip:'Don\'t confuse "stereospecific" and "stereoselective" — they answer subtly different questions and GATE tests the distinction directly.' }
]},

{ section:'organic', title:'Reaction Mechanisms & LFER', days:[
  { t:'Energy Profiles & Control', b:[
      'Kinetic control: product distribution reflects relative rates (lower Ea wins).',
      'Thermodynamic control: product distribution reflects relative stability (given enough time/reversibility).',
      'Higher temperature and longer reaction time favour thermodynamic control.',
      'Reading an energy profile means identifying which barrier, not which well, controls product ratio.'
    ], tip:'The classic 1,2- vs 1,4-addition (kinetic vs thermodynamic) example is worth having fully memorized.' },
  { t:'Hammond Postulate & Curtin-Hammett', b:[
      'Hammond postulate: TS resembles whichever species (reactant or product) it\'s closer to in energy.',
      'For an endothermic step, TS resembles the product (late TS).',
      'For an exothermic step, TS resembles the reactant (early TS).',
      'Curtin-Hammett principle: product ratio depends on TS energies, not ground-state conformer populations, when interconversion is fast.'
    ], tip:'Curtin-Hammett is subtle — the key insight is that fast pre-equilibrium conformers don\'t set the product ratio, the TS energies do.' },
  { t:'Determining Mechanisms', b:[
      'Kinetics (rate law, reaction order) reveals which species participate in/before the RDS.',
      'Isotopic labelling tracks atom fate and can reveal KIE (rate-determining bond breaking).',
      'Trapping or spectroscopically detecting intermediates provides direct mechanistic evidence.',
      'Stereochemical outcome (retention/inversion/racemization) constrains possible mechanisms.'
    ], tip:'Combine multiple lines of evidence (kinetics + stereochemistry + isotope effect) — GATE mechanism questions often require this combined reasoning.' },
  { t:'Solvent Effects', b:[
      'Polar protic solvents stabilize ions well — favour SN1/E1 pathways.',
      'Polar aprotic solvents don\'t solvate anions well — boost nucleophile strength, favour SN2.',
      'Nonpolar solvents favour pathways with minimal charge development in the TS.',
      'Solvent polarity affects both rate and, at times, mechanism (SN1 vs SN2 switch).'
    ], tip:'Polar aprotic vs polar protic is one of the highest-yield facts for substitution/elimination questions — know several examples of each.' },
  { t:'Hammett & Taft Equations', b:[
      'Hammett equation: log(k/k0) = ρσ, relates substituent effects to rate/equilibrium for aromatic systems.',
      'σ (sigma): substituent constant, positive for EWGs, negative for EDGs.',
      'ρ (rho): reaction constant, sign/magnitude reveals charge character of the TS.',
      'Taft equation extends similar LFER ideas to aliphatic systems using steric + polar parameters.'
    ], tip:'Interpreting the sign and magnitude of ρ from a Hammett plot (positive ρ ⇒ negative charge builds in the TS) is a favourite question.' }
]},

{ section:'organic', title:'Types of Reactions', days:[
  { t:'Nucleophilic & Electrophilic Substitution', b:[
      'SN1: two-step, carbocation intermediate, racemization, favoured by stable cations/polar protic solvent.',
      'SN2: one-step, backside attack, full inversion (Walden inversion), favoured by unhindered substrates/strong nucleophile.',
      'Aromatic electrophilic substitution: electrophile attacks the ring, arenium ion intermediate.',
      'Aromatic nucleophilic substitution (SNAr): needs strong EWGs, often ortho/para to the leaving group.'
    ], tip:'A quick "1° vs 3°, strong vs weak nucleophile, protic vs aprotic solvent" checklist reliably predicts SN1 vs SN2.' },
  { t:'Addition Reactions', b:[
      'Electrophilic addition to alkenes: Markovnikov addition via the more stable carbocation.',
      'Anti-Markovnikov addition occurs under radical (peroxide-mediated) conditions with HBr specifically.',
      'Addition to C=O: nucleophile attacks the electrophilic carbonyl carbon.',
      'Addition to C=N follows similar electrophilicity logic, modulated by nitrogen\'s lone pair.'
    ], tip:'The peroxide-effect exception (anti-Markovnikov, only with HBr) is a frequently tested special case.' },
  { t:'Elimination Reactions', b:[
      'E1: carbocation intermediate, follows Zaitsev\'s rule (more substituted alkene favoured).',
      'E2: concerted, needs anti-periplanar geometry between H and leaving group.',
      'Bulky bases favour Hofmann product (less substituted alkene) over Zaitsev.',
      'Substitution and elimination are often competing pathways — conditions decide which dominates.'
    ], tip:'Anti-periplanar requirement for E2 is exactly why cyclohexane ring conformation matters for elimination outcomes.' },
  { t:'Reactive Intermediates', b:[
      'Carbocations: planar sp², stabilized by hyperconjugation/resonance/adjacent heteroatoms.',
      'Carbanions: pyramidal sp³, stabilized by electron-withdrawing/resonance-stabilizing groups.',
      'Carbenes: singlet (paired, concerted reactions) vs triplet (diradical, stepwise reactions).',
      'Arynes (e.g. benzyne): highly reactive, strained triple-bond character, undergo rapid addition.'
    ], tip:'Singlet vs triplet carbene stereochemical outcome (retention vs non-stereospecific) is a classic, testable contrast.' },
  { t:'Rearrangements', b:[
      'Molecular rearrangements often proceed via a more stable carbocation (1,2-hydride/alkyl shifts).',
      'Barton reaction: photochemical, generates a δ-functionalized product via a nitrite ester intermediate.',
      'Barton-McCombie: deoxygenation of an alcohol via a radical chain mechanism.',
      'Hunsdiecker reaction: converts a carboxylic acid silver salt to an alkyl halide with loss of CO2.'
    ], tip:'Match each named reaction to its key intermediate (radical vs cation) — that\'s usually what\'s actually being tested.' }
]},

{ section:'organic', title:'Organic Synthesis I — C–C Bond Formation', days:[
  { t:'Functional Group Reaction Overview', b:[
      'Alkenes/alkynes: addition chemistry dominates (electrophilic, radical, catalytic hydrogenation).',
      'Alcohols/phenols: oxidation, esterification, and substitution/elimination via activated leaving groups.',
      'Carbonyls (aldehydes/ketones): nucleophilic addition is the core reactivity pattern.',
      'Carboxylic acid derivatives interconvert via nucleophilic acyl substitution, reactivity order acid chloride > anhydride > ester > amide.'
    ], tip:'The acyl-substitution reactivity order (chloride > anhydride > ester > amide) predicts which conversions are easy vs need forcing conditions.' },
  { t:'Organometallic Reagents in Synthesis', b:[
      'Grignard (Mg) and organolithium reagents: strong carbon nucleophiles, add to carbonyls.',
      'Organocuprates (Gilman reagents, Cu): enable conjugate (1,4-) addition to enones.',
      'Organoboron reagents: key partners in Suzuki coupling and hydroboration chemistry.',
      'Organosilicon/organotin reagents: used in specific coupling and protecting-group strategies.'
    ], tip:'Grignard = 1,2-addition; cuprate = 1,4-addition to enones — a sharp, testable contrast.' },
  { t:'Cross-Coupling Reactions I', b:[
      'Suzuki coupling: organoboron + aryl/vinyl halide, Pd catalyst — very functional-group tolerant.',
      'Heck reaction: alkene + aryl/vinyl halide, Pd catalyst, forms substituted alkenes.',
      'Sonogashira: terminal alkyne + aryl/vinyl halide, Pd/Cu co-catalysis.',
      'Negishi (organozinc) and Kumada (Grignard) couplings follow the same general Pd-catalytic-cycle logic.'
    ], tip:'All these couplings share the same underlying Pd cycle: oxidative addition → transmetalation → reductive elimination.' },
  { t:'Cross-Coupling Reactions II', b:[
      'Hiyama coupling: organosilicon partner, needs fluoride/base activation for transmetalation.',
      'Tsuji-Trost reaction: Pd-catalyzed allylic substitution via a π-allyl palladium intermediate.',
      'Olefin metathesis: redistributes C=C bonds via a metal-carbene mechanism (Grubbs-type catalysts).',
      'Buchwald-Hartwig amination: Pd-catalyzed C-N bond formation between an amine and aryl halide.'
    ], tip:'Buchwald-Hartwig is the go-to method whenever a question needs an aryl-nitrogen bond built without classical SNAr conditions.' },
  { t:'Named C–C Bond Reactions', b:[
      'Baylis-Hillman: forms a C-C bond between an activated alkene and an aldehyde, catalyzed by a nucleophilic amine/phosphine.',
      'Henry (nitroaldol) reaction: nitroalkane + aldehyde/ketone under base catalysis.',
      'Sakurai-Hosomi: allylsilane addition to a carbonyl, Lewis-acid catalyzed.',
      'Pauson-Khand: alkyne + alkene + CO, cobalt-mediated [2+2+1] cycloaddition to a cyclopentenone.'
    ], tip:'Don\'t memorize these in isolation — for each, identify the new bond formed and the key catalyst/reagent, that\'s what\'s usually asked.' }
]},

{ section:'organic', title:'Organic Synthesis II — Strategy & Selectivity', days:[
  { t:'Retrosynthetic Analysis', b:[
      'Retrosynthesis works backward from target to simpler precursors via disconnections.',
      'A synthon is an idealized fragment; a synthetic equivalent is the real reagent that acts as that synthon.',
      'Strategic disconnections target bonds that are easy to form reliably (e.g. near a carbonyl).',
      'Good retrosynthetic plans minimize protecting-group steps and maximize convergency.'
    ], tip:'Practice drawing retrosynthetic arrows (⇒) for a moderately complex target — this is a core organic-synthesis exam skill.' },
  { t:'Atom Economy & Umpolung', b:[
      'Atom economy = (MW of desired product / MW of all reactants) × 100%.',
      'Green chemistry favours high atom economy and minimal hazardous byproducts.',
      'Umpolung reverses a functional group\'s natural polarity (e.g. acyl anion equivalents from normally electrophilic carbonyls).',
      'Umpolung strategies open up otherwise-impossible disconnections in retrosynthesis.'
    ], tip:'Recognize a classic umpolung reagent (e.g. a dithiane as an acyl anion equivalent) when you see it in a synthesis scheme.' },
  { t:'Selectivity & Protecting Groups', b:[
      'Chemoselectivity: reacting one functional group while leaving similar ones untouched.',
      'Regioselectivity: preference for one position/orientation of reaction over another.',
      'Stereoselectivity: preference for one stereochemical outcome over another.',
      'Protecting groups temporarily mask reactivity, must be removable without disturbing the rest of the molecule.'
    ], tip:'Any multi-step synthesis question that "doesn\'t work" without a protecting group is testing chemoselectivity reasoning.' },
  { t:'Asymmetric Synthesis', b:[
      'Resolution: separating enantiomers from a racemate (including via enzymatic/kinetic resolution).',
      'Desymmetrization: converts an achiral/meso substrate into a chiral product using a chiral catalyst/reagent.',
      'Chiral auxiliaries: temporarily attached chiral groups that control the stereochemical outcome, then removed.',
      'Organocatalysis: uses small chiral organic molecules (not metals) to catalyze asymmetric transformations.'
    ], tip:'Chiral auxiliary vs organocatalyst: auxiliary is stoichiometric and removed after; catalyst is substoichiometric and reused — a key distinction.' },
  { t:'Enolate Chemistry & Stereoselective Addition', b:[
      'Enolates/enamines/silyl enol ethers all act as nucleophilic carbon sources for C-C and C-heteroatom bond formation.',
      'Cram/Felkin-Anh models predict facial selectivity of nucleophilic addition to chiral carbonyls.',
      'Evans aldol reaction: boron-enolate-mediated, chiral-auxiliary-controlled, highly stereoselective.',
      'Proline-catalyzed aldol reaction: an early, influential organocatalytic asymmetric aldol method.'
    ], tip:'Felkin-Anh\'s preferred nucleophile trajectory (large group perpendicular to C=O) is worth being able to redraw from memory.' }
]},

{ section:'organic', title:'Oxidation Reactions', days:[
  { t:'Alcohol Oxidation', b:[
      'Chromium reagents (PCC, Jones): oxidize 1° alcohols to aldehydes (PCC) or carboxylic acids (Jones).',
      'Manganese reagents (KMnO4): strong oxidant, typically over-oxidizes to carboxylic acids.',
      'DMSO-based oxidations (Swern, etc.): mild, stop cleanly at the aldehyde/ketone stage.',
      'Hypervalent iodine reagents (Dess-Martin): mild, selective, widely used for sensitive substrates.'
    ], tip:'PCC/Swern/Dess-Martin all share the same key feature: they stop at the aldehyde, unlike stronger Cr(VI)/Mn(VII) reagents.' },
  { t:'Peracid Oxidation', b:[
      'Peracids (mCPBA) epoxidize alkenes via a concerted, syn mechanism — stereospecific.',
      'Baeyer-Villiger oxidation: peracid converts a ketone to an ester by O-insertion.',
      'Migratory aptitude in Baeyer-Villiger: more substituted/stabilized group migrates preferentially.',
      'Electron-rich alkenes react faster with peracids (electrophilic oxidant).'
    ], tip:'Baeyer-Villiger migratory aptitude order is a specific, testable fact — keep it handy.' },
  { t:'Alkenes to Diols & Ozonolysis', b:[
      'OsO4 (or KMnO4, cold/dilute): syn-dihydroxylation of alkenes to cis-diols.',
      'Ozonolysis cleaves the C=C bond entirely, giving two carbonyl fragments.',
      'Reductive workup (Zn/AcOH, Me2S) gives aldehydes/ketones; oxidative workup gives carboxylic acids.',
      'Ozonolysis is a classic structure-determination tool for locating a double bond.'
    ], tip:'Reductive vs oxidative ozonolysis workup determines the product class — always check which workup a question specifies.' },
  { t:'Hydroboration-Oxidation', b:[
      'Anti-Markovnikov, syn addition of H and OH across a C=C double bond.',
      'Boron adds to the less hindered carbon (steric control, not electronic).',
      'H2O2/NaOH oxidation step converts the C-B bond to C-OH with retention of configuration.',
      'A clean complement to acid-catalyzed (Markovnikov) hydration.'
    ], tip:'Hydroboration-oxidation is the standard answer whenever a question needs a clean anti-Markovnikov alcohol.' },
  { t:'Asymmetric Oxidations', b:[
      'Sharpless epoxidation: Ti-tartrate catalyzed, asymmetric epoxidation of allylic alcohols.',
      'Jacobsen epoxidation: Mn-salen catalyzed, works on unfunctionalized alkenes (no allylic OH needed).',
      'Sharpless asymmetric dihydroxylation: uses a chiral ligand (e.g. DHQD/DHQ) with OsO4 for enantioselective diols.',
      'Choice of chiral catalyst/ligand predicts which face of the alkene reacts.'
    ], tip:'Sharpless needs an allylic alcohol; Jacobsen doesn\'t — that substrate requirement is the fastest way to tell them apart.' }
]},

{ section:'organic', title:'Reduction Reactions', days:[
  { t:'Catalytic Hydrogenation', b:[
      'Heterogeneous hydrogenation (Pd/C, Pt, Ni): syn addition of H2 across a solid catalyst surface.',
      'Homogeneous hydrogenation (Wilkinson\'s catalyst): soluble, allows fine control, useful for asymmetric variants.',
      'Catalyst choice affects chemoselectivity (e.g. Lindlar catalyst for alkyne → cis-alkene only).',
      'Poisoned catalysts (Lindlar) stop hydrogenation at a controlled, partial stage.'
    ], tip:'Lindlar catalyst (poisoned Pd) giving cis-alkene from an alkyne is one of the most-used selective-reduction facts.' },
  { t:'Dissolving Metal Reductions', b:[
      'Li/Na in liquid ammonia (Birch reduction): reduces aromatic rings to 1,4-cyclohexadienes.',
      'Birch reduction regiochemistry depends on whether the ring substituent is EDG or EWG.',
      'Mg, Zn: used for various carbonyl and dehalogenation reductions.',
      'Ti, Sm(II) reagents: enable radical-based reductive couplings (e.g. McMurry, pinacol-type).'
    ], tip:'Birch reduction regiochemistry (which carbons stay sp²) flips depending on EDG vs EWG substituent — a frequently tested detail.' },
  { t:'Hydride Reagents I', b:[
      'NaBH4: mild, reduces aldehydes/ketones, generally not esters/amides.',
      'LiAlH4: strong, reduces esters, amides, carboxylic acids, and epoxides too.',
      'DIBAL-H: at low temperature, stops ester reduction cleanly at the aldehyde stage.',
      'Reagent strength/selectivity choice depends entirely on which functional groups must survive.'
    ], tip:'DIBAL-H at −78°C giving an aldehyde (not over-reducing to alcohol) from an ester is a favourite selective-reduction question.' },
  { t:'Hydride Reagents II — Selective Variants', b:[
      'L-Selectride / K-Selectride: bulky hydrides, give highly stereoselective (often axial-attack) reductions.',
      'Bulky hydrides are especially useful for controlling facial selectivity on cyclic ketones.',
      'Luche reduction (NaBH4/CeCl3): selectively reduces the carbonyl of an enone over 1,4-addition, giving the allylic alcohol.',
      'Reagent bulk and added Lewis acids are the two main levers for controlling reduction selectivity.'
    ], tip:'Luche reduction is the standard answer whenever a question needs 1,2- (not 1,4-) reduction of an enone.' },
  { t:'Review — Reduction Reactions', b:[
      'Match each named reagent (NaBH4, LiAlH4, DIBAL-H, Luche, Lindlar) to its signature selectivity.',
      'Explain Birch reduction regiochemistry for one EDG and one EWG example.',
      'Compare heterogeneous vs homogeneous hydrogenation.',
      'Cross-check against last week\'s oxidation reagents for a full toolkit view.'
    ], tip:'Build a single reagent-selectivity table across both the oxidation and reduction weeks — this pays off heavily on synthesis questions.' }
]},

{ section:'organic', title:'Pericyclic Reactions & Photochemistry', days:[
  { t:'Pericyclic Reaction Types & FMO', b:[
      'Electrocyclic: ring opening/closing via σ-bond ↔ π-bond interconversion at the chain ends.',
      'Cycloaddition: two π-systems combine to form new σ-bonds (e.g. Diels-Alder).',
      'Sigmatropic: a σ-bond migrates across a π-system.',
      'FMO (frontier MO) and Woodward-Hoffmann rules predict allowed thermal/photochemical stereochemical outcome.'
    ], tip:'Thermal vs photochemical pericyclic reactions follow opposite conrotatory/disrotatory (or suprafacial/antarafacial) rules — a core exam fact.' },
  { t:'Diels-Alder, Claisen & Cope', b:[
      'Diels-Alder: [4+2] cycloaddition, diene (s-cis) + dienophile, forms a new six-membered ring.',
      'Electron-poor dienophiles react fastest with electron-rich dienes (normal electron demand).',
      'Claisen rearrangement: [3,3]-sigmatropic shift of an allyl vinyl ether to a γ,δ-unsaturated carbonyl.',
      'Cope rearrangement: [3,3]-sigmatropic shift of a 1,5-diene, no heteroatom involved.'
    ], tip:'Diels-Alder stereospecificity (endo/exo, retention of diene/dienophile geometry) is tested constantly — know the endo rule.' },
  { t:'Photochemistry of Alkenes, Arenes & Carbonyls', b:[
      'Alkene photochemistry: cis-trans isomerization via an excited-state twisted intermediate.',
      'Arene photochemistry can give unusual products (e.g. photo-rearrangements) not seen thermally.',
      'Carbonyl photochemistry: n→π* excitation is the key first step for most reactions.',
      'Photo-oxidation/reduction: light-driven electron or hydrogen-atom transfer processes.'
    ], tip:'The n→π* excited carbonyl is the entry point for essentially every named carbonyl photoreaction this week — anchor your understanding there.' },
  { t:'Norrish & Di-π-methane Reactions', b:[
      'Norrish type I: α-cleavage of an excited carbonyl, generates two radicals.',
      'Norrish type II: intramolecular H-abstraction (γ-H) followed by cleavage or cyclization.',
      'Di-π-methane rearrangement: 1,4-diene rearranges to a vinylcyclopropane under photoexcitation.',
      'Paternò-Büchi reaction: [2+2] photocycloaddition between a carbonyl and an alkene, gives an oxetane.'
    ], tip:'Norrish I (cleavage) vs Norrish II (H-abstraction, needs a γ-H) is a direct mechanism-recognition question.' },
  { t:'Photo-Rearrangements', b:[
      'Photo-Curtius: photochemical version of the Curtius rearrangement, acyl azide → isocyanate via nitrene.',
      'Photo-Wolff: α-diazoketone loses N2 photochemically, generates a carbene that undergoes ring contraction (Wolff rearrangement).',
      'Barton reaction: photolysis of a nitrite ester, δ-C-H functionalization via an alkoxy radical.',
      'Hofmann-Löffler-Freytag: generates an N-radical that abstracts a δ-H, leading to a cyclic amine after further steps.'
    ], tip:'Both Barton and Hofmann-Löffler-Freytag hinge on 1,5-HAT (δ-hydrogen abstraction through a six-membered TS) — that\'s the shared mechanistic key.' }
]},

{ section:'organic', title:'Heterocyclic Compounds', days:[
  { t:'Nomenclature', b:[
      'Hantzsch-Widman-style nomenclature names ring size and heteroatom type systematically.',
      'Mono- vs bicyclic and mono- vs di-heteroatomic compounds are named by distinct conventions.',
      'Common/trivial names (furan, pyrrole, pyridine...) are used far more often in practice than systematic ones.',
      'Numbering of the ring starts to give heteroatoms the lowest possible locants.'
    ], tip:'You mostly need to *recognize* trivial names on sight — systematic naming rules are secondary here.' },
  { t:'Furan & Pyrrole', b:[
      'Both are 5-membered, aromatic (6 π-electrons including the heteroatom lone pair).',
      'Furan/pyrrole undergo electrophilic substitution preferentially at C2 (α-position).',
      'Pyrrole is a weaker base than typical amines — its N lone pair is tied up in the aromatic system.',
      'Furan can act as a diene in Diels-Alder reactions due to its lower aromatic stabilization energy.'
    ], tip:'Pyrrole\'s weak basicity (lone pair delocalized into the ring) is a classic "explain the exception" question versus normal amines.' },
  { t:'Thiophene & Pyridine', b:[
      'Thiophene: aromatic, sulfur lone pair (one of two) contributes to the π-system, α-selective substitution.',
      'Pyridine: aromatic, but the N lone pair sits in an sp² orbital in the ring plane — available for basicity.',
      'Pyridine is basic (like an imine), unlike pyrrole — a key heterocycle-basicity contrast.',
      'Pyridine undergoes electrophilic substitution poorly (electron-poor ring) but nucleophilic substitution well.'
    ], tip:'Pyridine vs pyrrole basicity is the single most-tested heterocycle fact — know exactly which lone pair is "used up" in each case.' },
  { t:'Indole', b:[
      'Indole: fused benzene + pyrrole ring system, aromatic across both rings.',
      'Electrophilic substitution occurs preferentially at C3, not C2.',
      'Indole\'s nitrogen lone pair is part of the aromatic system, like pyrrole — weakly basic.',
      'Indole is a core structural motif in tryptophan and many natural alkaloids.'
    ], tip:'C3-selectivity in indole substitution (not C2) is a specific, frequently tested regiochemical fact.' },
  { t:'Quinoline & Isoquinoline', b:[
      'Quinoline: fused benzene + pyridine, nitrogen at the ring-fusion-adjacent position.',
      'Isoquinoline: same fusion, nitrogen at the other position — subtly different reactivity.',
      'Both retain pyridine-like basicity (N lone pair available, not delocalized into aromaticity).',
      'Electrophilic substitution on both occurs preferentially on the benzo ring, not the pyridine-like ring.'
    ], tip:'Quinoline/isoquinoline combine "pyridine-like basic N" with "benzo-ring-preferred substitution" — hold both facts together, not separately.' }
]},

{ section:'organic', title:'Biomolecules', days:[
  { t:'Mono- and Disaccharides', b:[
      'Monosaccharides exist in equilibrium between open-chain and cyclic (hemiacetal) forms.',
      'Anomeric carbon: the new stereocenter created on cyclization — gives α/β anomers.',
      'Mutarotation: interconversion between anomers in solution until equilibrium is reached.',
      'Disaccharides form via a glycosidic bond linking two monosaccharide units.'
    ], tip:'Anomeric carbon identification (and its unique reactivity) is a recurring sugar-chemistry question.' },
  { t:'Amino Acids', b:[
      'Amino acids are zwitterionic at physiological/neutral pH (NH3+ and COO− simultaneously).',
      'Isoelectric point (pI): pH at which the amino acid carries no net charge.',
      'Side-chain properties (acidic, basic, polar, nonpolar) determine an amino acid\'s chemical behaviour.',
      'All proteinogenic amino acids (except glycine) are chiral, almost universally L-configured in nature.'
    ], tip:'Calculating pI from given pKa values (average of the two flanking the neutral form) is a quick, reliable numerical.' },
  { t:'Peptide Synthesis & Structure Determination', b:[
      'Peptide bond: amide linkage between the carboxyl of one amino acid and amine of the next.',
      'Solid-phase peptide synthesis relies on selective protecting-group strategies (e.g. Fmoc/Boc).',
      'Edman degradation sequences peptides from the N-terminus, one residue at a time.',
      'Mass spectrometry (fragmentation patterns) is now a standard modern peptide-sequencing tool.'
    ], tip:'Know why protecting groups are essential here — without them, peptide coupling would be an uncontrollable, non-selective mess.' },
  { t:'Protein Structure & Nucleic Acids', b:[
      'Primary structure: amino acid sequence. Secondary: local folding (α-helix, β-sheet), H-bond stabilized.',
      'Tertiary structure: overall 3D fold, driven by hydrophobic collapse and side-chain interactions.',
      'Quaternary structure: assembly of multiple folded subunits.',
      'Nucleic acids: sugar-phosphate backbone plus base-pairing (A-T/U, G-C) encodes genetic information.'
    ], tip:'Match each structural level (primary→quaternary) to the type of interaction that stabilizes it — a clean, testable framework.' },
  { t:'Lipids, Steroids, Terpenoids & Alkaloids', b:[
      'Lipids: broad class including fats, phospholipids — largely defined by hydrophobicity, not one core structure.',
      'Steroids share a fused four-ring (three six-membered + one five-membered) core skeleton.',
      'Terpenoids/carotenoids are built from isoprene (C5) units — "isoprene rule" predicts their skeletons.',
      'Alkaloids: nitrogen-containing natural products, often derived biosynthetically from amino acids.'
    ], tip:'The isoprene rule is the fastest way to recognize/predict a terpenoid\'s carbon skeleton on sight — practice spotting C5 units.' }
]},

{ section:'organic', title:'Experimental Techniques (Organic)', days:[
  { t:'Polarimetry', b:[
      'Optical rotation measures how a chiral sample rotates plane-polarized light.',
      'Specific rotation [α] normalizes for concentration, path length, and wavelength — a physical constant for a pure enantiomer.',
      'Racemic mixtures show zero net optical rotation (rotations cancel).',
      'Optical purity/ee can be estimated by comparing observed rotation to the pure enantiomer\'s value.'
    ], tip:'Calculating ee from a specific-rotation ratio is a quick, standard numerical — practice the formula until it\'s automatic.' },
  { t:'Chromatography', b:[
      'TLC: fast, qualitative, Rf value depends on polarity match between compound, stationary, and mobile phase.',
      'Column chromatography: preparative-scale separation, same polarity principles as TLC.',
      'HPLC: high-resolution, quantitative, works for less volatile/thermally sensitive compounds.',
      'GC: requires volatile, thermally stable compounds — separates based on boiping-point/polarity interaction with the column.'
    ], tip:'Match "why this technique, not that one" to compound properties (volatility, thermal stability, scale) — a common applied question.' },
  { t:'UV-Vis & IR in Structure Determination', b:[
      'UV-vis: extended conjugation shifts λmax to longer wavelengths (bathochromic shift).',
      'IR: characteristic group frequencies (C=O ~1700 cm⁻¹, O-H broad ~3300 cm⁻¹...) identify functional groups.',
      'Conjugation, H-bonding, and ring strain all shift characteristic IR/UV values from their "textbook" positions.',
      'Combining UV-vis and IR data narrows down functional groups before even reaching NMR/MS.'
    ], tip:'Practice reasoning from a given λmax or IR frequency back to a structural feature (conjugation length, H-bonding, ring strain).' },
  { t:'NMR in Structure Determination', b:[
      'Chemical shift, integration, and multiplicity together map out the hydrogen/carbon framework.',
      'Coupling constants (J values) can reveal relative stereochemistry (e.g. cis vs trans alkene J values differ).',
      '2D NMR techniques (COSY, HSQC, etc.) resolve connectivity in more complex molecules — good to recognize conceptually.',
      'Symmetry in a molecule reduces the number of distinct NMR signals observed.'
    ], tip:'Predicting the number of distinct ¹H/¹³C signals from molecular symmetry is a reliable, fast-scoring question type.' },
  { t:'Mass Spectrometry in Structure Determination', b:[
      'Molecular ion peak (M+) gives the molecular weight directly.',
      'Common fragmentation patterns (α-cleavage, McLafferty rearrangement) reveal structural substructures.',
      'Isotope patterns (e.g. M+2 peaks) can reveal the presence of Cl, Br, or S.',
      'Combining MS fragmentation with NMR/IR data is the standard modern structure-elucidation workflow.'
    ], tip:'Recognizing a McLafferty rearrangement fragment (loss of 42 Da-style pattern from a carbonyl with a γ-H) is a specific, testable skill.' }
]}

];

if (typeof module !== 'undefined') module.exports = { TOPICS };
