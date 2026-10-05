import fs from 'node:fs';
import path from 'node:path';
import { journalStories, journalFigureDimensions } from './journal-stories.mjs';
import { journalEvidence, journalResultClaims } from './journal-evidence.mjs';

const root = path.resolve(import.meta.dirname, '..');
const cv = JSON.parse(fs.readFileSync(path.join(root, 'src/data/cvData.json'), 'utf8'));
const existing = cv.find((section) => section.name === 'Published Papers').list;

const pdfFiles = new Map([
  ['Compressible Flow Exfoliation of Two-Dimensional Nanomaterials: Insights Into Layer Separation Informed by Gas Dynamics', 'Adv Eng Mater - 2026 - Islam - Compressible Flow Exfoliation of Two‐Dimensional Nanomaterials  Insights Into Layer.pdf'],
  ['Nonreciprocal forces enable cold-to-hot heat transfer between nanoparticles', 's41598-023-31583-y.pdf'],
  ["Lattice thermal conductivity and Young's modulus of XN 4 (X= Be, Mg and Pt) 2D materials using machine learning interatomic potentials", 'd3cp00746d.pdf'],
  ['Interfacial thermal conductance between TiO2 nanoparticle and water: A molecular dynamics study', '1-s2.0-S0167732221027781-main.pdf'],
  ['Interactions of gas particles with graphene during high-throughput compressible flow exfoliation: A Molecular Dynamics simulations study', 'jp2c00425.pdf'],
  ['Recent advances in lattice thermal conductivity calculation using machine-learning interatomic potentials', '210903_1_5.0069443.pdf'],
  ['Thermo-mechanical properties of nitrogenated holey graphene (C2N): A comparison of machine-learning-based and classical interatomic potentials', '1-s2.0-S001793102100692X-main.pdf'],
  ['Elucidation of thermo-mechanical properties of silicon nanowires from a molecular dynamics perspective', '1-s2.0-S0927025621005437-main.pdf'],
  ['Engineered porous borophene with tunable anisotropic properties', '1-s2.0-S1359836820333102-main.pdf'],
  ['Effect of planar torsional deformation on the thermal conductivity of 2D nanomaterials: A molecular dynamics study', '1-s2.0-S2352492819308992-main.pdf'],
  ['Thermal transport at a nanoparticle-water interface: A molecular dynamics and continuum modeling study', '114701_1_online.pdf'],
  ['Importance of nanolayer formation in nanofluid properties: Equilibrium molecular dynamic simulations for Ag-water nanofluid', '1-s2.0-S0167732218300084-main.pdf'],
]);

// Publication identifiers transcribed from the supplied PDFs.
const sourceDois = new Map([
  ['Adv Eng Mater - 2026 - Islam - Compressible Flow Exfoliation of Two‐Dimensional Nanomaterials  Insights Into Layer.pdf', '10.1002/adem.202502168'],
  ['s41598-023-31583-y.pdf', '10.1038/s41598-023-31583-y'],
  ['d3cp00746d.pdf', '10.1039/d3cp00746d'],
  ['1-s2.0-S0167732221027781-main.pdf', '10.1016/j.molliq.2021.118053'],
  ['jp2c00425.pdf', '10.1021/acs.jpcc.2c00425'],
  ['210903_1_5.0069443.pdf', '10.1063/5.0069443'],
  ['1-s2.0-S001793102100692X-main.pdf', '10.1016/j.ijheatmasstransfer.2021.121589'],
  ['1-s2.0-S0927025621005437-main.pdf', '10.1016/j.commatsci.2021.110821'],
  ['1-s2.0-S1359836820333102-main.pdf', '10.1016/j.compositesb.2020.108260'],
  ['1-s2.0-S2352492819308992-main.pdf', '10.1016/j.mtcomm.2019.100706'],
  ['114701_1_online.pdf', '10.1063/1.5084234'],
  ['1-s2.0-S0167732218300084-main.pdf', '10.1016/j.molliq.2018.05.122'],
]);

const slugify = (title) => title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 96)
  .replace(/-+$/g, '');

const notes = [
  {
    topic: 'Thermal physics',
    summary: 'Explores how deliberately nonreciprocal interactions can move heat from a colder nanoparticle to a warmer one. The result offers a theoretical route to controlling heat flow at the nanoscale.',
    story: {
      context: 'Heat normally flows from a warmer body to a colder one. Reversing that flow at the nanoscale requires an energy source and a way to control how the particles exchange momentum.',
      question: 'Can forces that act differently in opposite directions make a pair of nanoparticles pump heat from cold to hot, and what does that operation cost?',
      approach: 'The authors simulated copper nanoparticles immersed in argon and coupled them with nonreciprocal forces. They tracked heat and work with molecular dynamics, then derived a minimal Langevin description using stochastic thermodynamics to test the mechanism and its fluctuations.',
      results: [
        { label: 'Reversed heat flow', value: 'Cold → hot', detail: 'With work supplied through the controlled forces, the average heat current can be taken from the cold bath and delivered to the hot bath. The device therefore behaves as a model nanoscale refrigerator.' },
        { label: 'Efficiency ceiling', value: 'COP approaches 5', detail: 'For the temperatures used in the study, the theoretical coefficient of performance approaches the Carnot limit near the matching condition κH/κC = TH/TC.' },
        { label: 'Power and fluctuations', value: 'Best trade-off near κH/κC ≈ 3.3–3.8', detail: 'The smallest modeled uncertainty in total power is near 3.3, close to the ratio around 3.79 where heat extraction from the cold bath is greatest. The result connects useful cooling with the precision and entropy production required to sustain it.' },
      ],
      takeaway: 'The work lays out conditions for a controlled nanoscale heat pump and quantifies the work and fluctuation costs that accompany reversed heat flow.',
    },
    figures: [{ src: '/journal-figures/cold-to-hot-cop.jpg', alt: 'Coefficient of performance versus the ratio of hot-side to cold-side coupling, approaching the Carnot bound near the matching condition.', caption: 'The refrigeration efficiency peaks near the temperature-matching coupling ratio and tends toward the Carnot bound predicted by the theory.', source: 'Figure 4' }],
  },
  {
    topic: 'Computational materials',
    summary: 'Uses machine learning interatomic potentials to estimate how three nitrogen-rich, two-dimensional materials carry heat and resist stretching. It connects atomic structure to directional thermal and mechanical behaviour.',
    story: {
      context: 'Two-dimensional crystals can behave differently along different lattice directions. The newly studied BeN₄, MgN₄, and PtN₄ sheets raise a practical question: whether this directional response persists as the material heats up.',
      question: 'How do composition, crystal direction, and temperature combine to set the heat conduction and stiffness of XN₄ monolayers?',
      approach: 'The researchers trained a moment tensor machine-learning potential on first-principles data. Molecular dynamics then supplied length-dependent thermal transport and tensile stress–strain results for armchair and zigzag sheets over a range of temperatures.',
      results: [
        { label: 'Direction matters', value: 'Armchair is generally stiffer', detail: 'For all three compounds, armchair-direction Young’s modulus and lattice thermal conductivity are generally higher than their zigzag counterparts. The size of the difference depends on which metal is present.' },
        { label: 'Temperature changes anisotropy', value: 'BeN₄ and MgN₄ stay near 0.4', detail: 'Their mechanical anisotropy remains nearly constant across the simulated temperature range. PtN₄ starts below 0.2 and becomes more isotropic as temperature rises.' },
        { label: 'Composition sets the scale', value: 'BeN₄ highest; PtN₄ lowest in thermal conductivity', detail: 'Thermal conductivity grows with sample length before approaching a material-dependent limit. BeN₄ has the highest values in both directions, while PtN₄ has the lowest.' },
      ],
      takeaway: 'The calculations show that both chemistry and lattice orientation matter: a single isotropic number would hide meaningful differences in stiffness and heat transport.',
    },
    figures: [{ src: '/journal-figures/xn4-anisotropy.jpg', alt: 'Mechanical anisotropy versus temperature for BeN4, MgN4 and PtN4; BeN4 and MgN4 remain nearly flat while PtN4 declines.', caption: 'The temperature trend separates the nearly constant anisotropy of BeN₄ and MgN₄ from the increasingly isotropic mechanical response of PtN₄.', source: 'Figure 11' }],
  },
  {
    topic: 'Thermal interfaces',
    summary: 'Models heat transfer where a titanium dioxide nanoparticle meets water. The molecular-scale view helps explain which interface conditions control thermal conductance.',
    story: {
      context: 'A nanoparticle can transfer heat only as fast as energy crosses its boundary into the surrounding liquid. At that scale, particle size and the strength of contact with water can both change the cooling response.',
      question: 'Which particle and surface conditions most strongly control heat transfer across a TiO₂–water interface?',
      approach: 'Transient non-equilibrium molecular dynamics measured interfacial conductance while the authors varied TiO₂ particle diameter, initial particle temperature, and the Lennard–Jones interaction strength that represents surface wettability. The molecular results were also compared with a continuum cooling description.',
      results: [
        { label: 'Interface conductance', value: 'About an order of magnitude higher', detail: 'The calculated TiO₂–water conductance exceeds values reported for several other nanoparticle and carbon-based systems, pointing to efficient energy exchange at this interface.' },
        { label: 'Particle diameter', value: '4 → 9 nm: slight decrease', detail: 'Larger particles transfer heat less effectively per interface area in the modeled range, although the change is modest compared with the effects of temperature and surface coupling.' },
        { label: 'Temperature and wettability', value: 'Both increase conductance', detail: 'Raising the particle temperature from 400 K to 600 K increases conductance. Raising the interaction parameter from 0.5 to 4 produces about a 20% increase, consistent with stronger vibrational coupling between TiO₂ and water.' },
      ],
      takeaway: 'The interface itself is an important design variable: warmer particles and stronger particle–water coupling improve heat exchange in these simulations.',
    },
    figures: [{ src: '/journal-figures/tio2-interface.jpg', alt: 'Thermal conductance between a five-nanometre TiO2 particle and water increases with particle temperature for several interaction strengths.', caption: 'Higher particle temperature and stronger solid–liquid interaction raise the simulated TiO₂–water thermal conductance.', source: 'Figure 8' }],
  },
  {
    topic: 'Graphene production',
    summary: 'Simulates gas molecules striking graphene during compressible flow exfoliation. The work investigates the layer-separation mechanism behind a route to higher-throughput graphene production.',
    story: {
      context: 'Compressible-flow exfoliation sends a rapid gas stream through a layered material to separate sheets. The gas atoms must transfer enough momentum and energy to overcome the attraction between graphene layers.',
      question: 'How do gas identity, pressure, and flow speed change the motion and separation of graphene bilayers?',
      approach: 'Classical molecular dynamics compared helium and argon under several nozzle-flow conditions. The simulations tracked graphene-layer displacement, interlayer interaction energy, and energy absorbed as the upstream pressure changed.',
      results: [
        { label: 'Flow regime', value: 'Supersonic flow promotes dispersion', detail: 'Pronounced layer motion appears when the simulated gas flow reaches the supersonic regime. Sliding one sheet along the other is more favorable than pulling the layers directly apart vertically.' },
        { label: 'Gas mass matters', value: 'He: >16 Å · Ar: ≈3 Å', detail: 'Under the modeled conditions, helium drives much larger graphene-layer root-mean-square displacement than argon. The lighter gas moves faster in the nozzle and transfers energy more effectively in this comparison.' },
        { label: 'Pressure matters too', value: 'Higher pressure, more absorbed energy', detail: 'For helium, increasing supply pressure from 200 to 800 psi raised the energy transferred to the bilayer from roughly 0.04 eV to 0.25 eV at 3000 K, supporting pressure as a process-control variable.' },
      ],
      takeaway: 'The atomistic results explain why both gas choice and operating pressure affect exfoliation, while identifying sliding and supersonic flow as central parts of the separation pathway.',
    },
    figures: [{ src: '/journal-figures/graphene-helium-argon.jpg', alt: 'Molecular-dynamics comparison of graphene exfoliation in helium and argon, showing larger root-mean-square displacement in helium and distinct interlayer-energy distributions.', caption: 'The graphene layer shows much larger root-mean-square displacement in helium than in argon, illustrating how carrier-gas mass changes the exfoliation response.', source: 'Figure 8' }],
  },
  {
    topic: 'Computational materials',
    summary: 'Reviews how machine learning interatomic potentials are used to calculate lattice thermal conductivity. It explains the promise of more accurate atomistic models and the challenges in applying them.',
    story: {
      context: 'First-principles calculations can describe atomic bonding accurately but become expensive for large or complex systems. Classical potentials scale well, yet may miss important details of a material’s energy landscape.',
      question: 'Where can machine-learning interatomic potentials bridge the gap between first-principles accuracy and large-scale thermal-transport simulation, and where do they still need careful validation?',
      approach: 'This perspective reviews how learned potentials are fitted to first-principles data and used in molecular dynamics and phonon-based conductivity calculations. It surveys two- and three-dimensional materials and compares published predictions with experiments, density-functional-theory-based Boltzmann transport, and classical molecular dynamics.',
      results: [
        { label: 'Accuracy at useful scale', value: 'Promising agreement across materials', detail: 'The surveyed studies show that machine-learning potentials can reproduce important phonon and conductivity trends while allowing larger simulation cells and longer trajectories than direct first-principles dynamics.' },
        { label: 'A concrete comparison', value: 'Several methods compared for 2D sheets', detail: 'The figure contrasts published machine-learning, DFT-BTE, and classical-MD conductivity values for representative two-dimensional materials. Agreement is often useful, but the spread between methods remains material-dependent.' },
        { label: 'What determines reliability', value: 'Training and validation still matter', detail: 'The review emphasizes that predictions depend on the structures and temperature range represented in the training set, and should be checked against appropriate reference calculations or measurements.' },
      ],
      takeaway: 'Machine-learning potentials expand the size and time scale of atomistic thermal-transport studies, provided their training data and predictions are tested for the material and conditions of interest.',
    },
    figures: [{ src: '/journal-figures/mlip-review-comparison.jpg', alt: 'Room-temperature thermal conductivity values for several two-dimensional materials compared across machine-learning potentials, DFT-BTE and classical molecular dynamics.', caption: 'The review assembles reported conductivity values across three modelling approaches, showing both broad agreement and material-specific differences.', source: 'Figure 4' }],
  },
  {
    topic: 'Computational materials',
    summary: 'Compares machine learning and classical atomistic models for nitrogenated holey graphene, or C₂N. The study predicts how this porous sheet conducts heat and responds to mechanical loading.',
    story: {
      context: 'C₂N is a porous carbon–nitrogen sheet with promising electronic and mechanical properties. Predicting its thermal behaviour is difficult because the pores scatter heat-carrying phonons, and predictions depend strongly on how atomic interactions are represented.',
      question: 'Can a machine-learning potential trained on first-principles data describe both C₂N’s heat conduction and its failure under tensile loading better than a classical potential?',
      approach: 'The authors passively fitted a machine-learning potential to ab initio molecular-dynamics configurations spanning a broad temperature range. They checked its phonon behaviour against density-functional calculations, ran non-equilibrium molecular dynamics for length-dependent thermal conductivity, and simulated uniaxial tension with and without vacancies.',
      results: [
        { label: 'Room-temperature thermal conductivity', value: '85.5 ± 3 W/m·K', detail: 'The machine-learning potential predicts a higher conductivity than the Tersoff model’s 63.3 ± 5 W/m·K and agrees more closely with the cited DFT-BTE reference. Length scaling gives an effective phonon mean free path of 36.7 ± 1 nm.' },
        { label: 'Mechanical response', value: 'Young’s modulus: 390 ± 3 GPa', detail: 'The tensile simulations give an ultimate strength of about 42 GPa and a fracture strain near 0.29. The stress–strain curves also show that the two potentials predict different post-yield failure behaviour.' },
        { label: 'Vacancy defects', value: '2% vacancies sharply reduce failure stress', detail: 'In the tested defective sheets, 2% vacancies reduce elastic modulus by about 5%, fracture stress by about 40%, and ultimate strength by about 15%. Small defect concentrations therefore matter most near failure.' },
      ],
      takeaway: 'The paper makes a case for validating an atomistic model against both heat-transport and mechanical data: a potential that performs well for one property may not capture the other or the effects of defects.',
    },
    figures: [
      { src: '/journal-figures/c2n-thermal-conductivity.jpg', alt: 'C2N lattice thermal conductivity versus sample length at 300 K, comparing machine-learning potential, Tersoff potential and DFT-BTE reference.', caption: 'Conductivity rises with sample length before approaching the long-sheet limit; the machine-learning prediction sits above the Tersoff result and closer to the DFT-BTE reference.', source: 'Figure 5' },
      { src: '/journal-figures/c2n-tensile-strength.jpg', alt: 'C2N stress–strain curve for machine-learning and Tersoff potentials, alongside atomic deformation snapshots at increasing strain.', caption: 'The stress–strain response and atomic snapshots show how the two potentials differ through loading and fracture.', source: 'Figure 8' },
    ],
  },
  {
    topic: 'Nanomaterial mechanics',
    summary: 'Uses molecular dynamics to examine the mechanical and thermal response of silicon nanowires. It helps relate nanoscale structure and loading to material performance.',
    story: {
      context: 'A silicon nanowire has many more atoms near a surface than bulk silicon. Those surfaces and the finite wire dimensions scatter heat-carrying vibrations and also change how the wire stretches and breaks.',
      question: 'How do wire length, cross-section, and temperature work together to determine thermal conductivity and tensile properties?',
      approach: 'Molecular-dynamics simulations using a Tersoff interaction model examined [110] silicon wires 10–45 nm long, 2.2–6.5 nm wide, and at 200–500 K. The authors calculated heat transport and stress–strain response across those sizes and temperatures.',
      results: [
        { label: 'Thermal conductivity', value: 'Roughly 1–5 W/m·K', detail: 'The nanowire values are far below bulk silicon. Conductivity rises as wire length increases because longer wires reduce the impact of finite-length phonon scattering; width also changes the result.' },
        { label: 'Mechanical size effect', value: 'Thicker wires are stiffer and stronger', detail: 'Young’s modulus, fracture stress, and fracture strain generally increase with cross-section width in the simulated range, though they remain below bulk reference values.' },
        { label: 'Temperature effect', value: 'Mechanical properties fall as temperature rises', detail: 'Higher temperature weakens the simulated elastic and failure response. Thermal conductivity changes with temperature as well, but the study finds its size dependence more prominent over the tested range.' },
      ],
      takeaway: 'The paper shows why nanowire properties cannot be inferred from bulk silicon alone: dimensions reshape both heat flow and failure, while temperature adds a separate mechanical penalty.',
    },
    figures: [
      { src: '/journal-figures/silicon-size-thermal.jpg', alt: 'Thermal conductivity of a silicon nanowire increases with wire length from 10 to 45 nanometres.', caption: 'Longer simulated wires carry heat more effectively as finite-length effects become weaker.', source: 'Figure 4' },
      { src: '/journal-figures/silicon-width-mechanics.jpg', alt: 'Silicon nanowire stress–strain curves and mechanical properties as a function of width at 300 K.', caption: 'The stress–strain and width trends show the mechanical cost of shrinking the silicon wire cross-section.', source: 'Figure 12' },
    ],
  },
  {
    topic: 'Nanomaterial mechanics',
    summary: 'Studies engineered pores in borophene, a two-dimensional boron material. The paper shows how pore design can tune properties that vary with direction.',
    story: {
      context: 'Borophene is intrinsically anisotropic: its stiffness and heat conduction depend on whether the sheet is loaded or heated along armchair or zigzag directions. That can be useful, but it also limits predictable performance when a sheet is used in multiple directions.',
      question: 'Can engineered elliptical pores tune the directional difference in borophene’s thermal and mechanical behaviour?',
      approach: 'The authors varied pore aspect ratio and porosity, measured directional thermal conductivity and elastic modulus using non-equilibrium molecular dynamics, and checked the trends with finite-element calculations.',
      results: [
        { label: 'Pore geometry is a control knob', value: 'Aspect ratio changes anisotropy', detail: 'As the elliptical pore aspect ratio changes, the armchair-to-zigzag difference in both thermal conductivity and elastic modulus changes systematically.' },
        { label: 'Near-isotropic designs', value: 'Some ratios bring directions together', detail: 'For each porosity studied, selected pore shapes make the two directional values similar. The exact best ratio depends on porosity, so the geometry must be chosen for the target property.' },
        { label: 'Two modelling views agree', value: 'MD trends checked by FEM', detail: 'Finite-element calculations reproduce the principal anisotropy trends from the atomistic simulations, supporting the use of pore architecture as a design strategy rather than a single simulation artefact.' },
      ],
      takeaway: 'The results suggest a route to tailor anisotropy through pore shape, including designs that make borophene behave more similarly in two in-plane directions.',
    },
    figures: [{ src: '/journal-figures/borophene-pore-design.jpg', alt: 'Thermal conductivity anisotropy in porous borophene as a function of elliptical pore aspect ratio for three porosities.', caption: 'Changing the pore aspect ratio can reduce the difference between armchair and zigzag thermal conductivity; the preferred geometry shifts with porosity.', source: 'Figure 9' }],
  },
  {
    topic: 'Thermal physics',
    summary: 'Tests how twisting a two-dimensional sheet changes its thermal conductivity. Molecular dynamics reveals the role of deformation and wrinkles in heat transport.',
    story: {
      context: 'Heat in atomically thin sheets is carried by lattice vibrations. Twisting a sheet creates wrinkles that disturb those vibrations, but different 2D materials need not respond equally.',
      question: 'How much does torsional deformation reduce heat transport in graphene, hexagonal boron nitride, and MoS₂, and does wrinkle amplitude explain the change?',
      approach: 'The study used non-equilibrium molecular dynamics to twist monolayer and few-layer sheets, compare thermal conductivity at different torsional strains and inner radii, and relate conductivity loss to wrinkle geometry and vibrational spectra.',
      results: [
        { label: 'Wrinkles suppress heat flow', value: 'Conductivity falls with wrinkle amplitude', detail: 'Across the three materials, larger torsion-induced wrinkles correspond to lower normalized thermal conductivity, consistent with increased phonon scattering.' },
        { label: 'Material sensitivity differs', value: 'MoS₂ changes most · h-BN least', detail: 'At comparable deformation, MoS₂ shows the largest conductivity reduction, graphene lies between, and hexagonal boron nitride retains the highest fraction of its pristine conductivity.' },
        { label: 'Geometry adds another effect', value: 'Larger inner radius lowers conductivity further', detail: 'The larger-radius rings develop more wrinkles in the studied structures, which further reduces graphene heat transport. The vibrational spectra also shift toward lower frequencies under torsion.' },
      ],
      takeaway: 'Torsion provides a way to tune thermal transport, but the reduction depends on both the wrinkle pattern and the material’s vibrational response.',
    },
    figures: [{ src: '/journal-figures/torsional-wrinkles.jpg', alt: 'Normalized thermal conductivity for h-BN, graphene and MoS2 decreases with increasing wrinkle amplitude.', caption: 'All three sheets lose thermal conductivity as wrinkles grow, with the largest reduction for MoS₂ and the smallest for h-BN.', source: 'Figure 5' }],
  },
  {
    topic: 'Thermal interfaces',
    summary: 'Combines molecular dynamics and continuum modeling to study heat passing between a nanoparticle and surrounding water. It connects atom-level behaviour with larger-scale descriptions of an interface.',
    story: {
      context: 'A heated nanoparticle cools through the surrounding liquid, but the first few molecular layers are structured and may not behave like bulk water. Continuum descriptions need a defensible way to represent this nanoscale region.',
      question: 'How quickly does heat leave a silver nanoparticle, how far does the temperature disturbance reach, and can a continuum model capture that transient?',
      approach: 'The authors compared four molecular-dynamics methods for estimating nanoparticle–water conductance. They followed temperature relaxation in concentric water shells and tested a continuum heat-conduction model against those shell temperatures.',
      results: [
        { label: 'Distance and time scale', value: 'About 2 nm · under 5 ps', detail: 'The temperature disturbance is strongest in the first water shell and decays quickly with distance. Beyond roughly 2 nm, the simulations show little clear temperature rise during the transient.' },
        { label: 'Near-surface water', value: 'Local conductivity ≈50% above bulk', detail: 'The model assigns higher effective thermal conductivity to water close to the silver particle than to bulk water, reflecting the distinct interfacial region.' },
        { label: 'Continuum comparison', value: 'Shell temperatures reproduced', detail: 'A continuum model using the interfacial description tracks the molecular-dynamics shell-temperature relaxation, connecting atomistic results with a larger-scale cooling calculation.' },
      ],
      takeaway: 'The cooling event is localized and fast, so representing the first water shells separately can improve continuum descriptions of nanoparticle heat transfer.',
    },
    figures: [{ src: '/journal-figures/nanoparticle-water-shells.jpg', alt: 'Water-shell temperatures around a heated nanoparticle relax over time; the peak temperature rise becomes smaller and slower farther from the surface.', caption: 'The first water shell warms most strongly, while shells farther away show a smaller and later transient response.', source: 'Figure 5' }],
  },
  {
    topic: 'Thermal interfaces',
    summary: 'Investigates the thin layer of water that forms around silver nanoparticles. The simulations examine why this nanolayer matters to the thermal properties of silver–water nanofluids.',
    story: {
      context: 'Water near a silver nanoparticle forms an ordered interfacial layer. If that layer occupies a meaningful fraction of the fluid, treating a nanofluid as only “particles plus bulk water” can misstate its density and viscosity.',
      question: 'Does explicitly accounting for the interfacial nanolayer improve predictions of silver–water nanofluid properties?',
      approach: 'Equilibrium molecular dynamics was used to study silver particles dispersed in water. The authors represented the mixture as three components—the nanoparticle, its ordered water nanolayer, and the remaining base fluid—and compared this model with simulation data and conventional mixture relations.',
      results: [
        { label: 'Density mechanism', value: 'The nanolayer contracts the base fluid', detail: 'The ordered interfacial water changes the volume available to the remaining liquid. The resulting density depends on nanoparticle size and the assumed thickness of the nanolayer.' },
        { label: 'Three-component relation', value: 'Closer to molecular-dynamics values', detail: 'Including the nanolayer brings the proposed density relation much closer to the MD results than the traditional binary mixture relation, which misses the interfacial contribution.' },
        { label: 'Viscosity', value: 'The nanolayer changes the predicted rise', detail: 'Nanofluid viscosity increases with particle volume fraction. Models that include an interfacial shell follow the simulation trends better than models that treat the liquid entirely as bulk water.' },
      ],
      takeaway: 'The interfacial water layer is a distinct part of the mixture; including it gives a more faithful route from molecular structure to density and viscosity.',
    },
    figures: [{ src: '/journal-figures/nanofluid-nanolayer-density.jpg', alt: 'Silver–water nanofluid density versus nanoparticle diameter: the proposed three-component mixture predictions track molecular-dynamics results more closely than the traditional binary mixture.', caption: 'The three-component model includes the water nanolayer and follows the molecular-dynamics density values more closely than the traditional binary relation.', source: 'Figure 9' }],
  },
];

const papers = [
  {
    title: 'Free-Energy Mapping of Gas-Assisted Exfoliation Pathways for Graphene under Compressible Flow: Implications for High-Volume Nanocomposite Applications',
    year: 2026,
    journal: 'ACS Applied Nano Materials',
    url: 'https://doi.org/10.1021/acsanm.6c01419',
    authors: ['Saeed Arabha', 'Cuiying Jian', 'Ray Hixon', 'Reza Rizvi'],
    topic: 'Graphene production',
    summary: 'Maps the energy required for gas-assisted graphene layer separation under compressible flow. The analysis helps identify pathways relevant to scaling graphene production for nanocomposites.',
    story: {
      context: 'Gas-assisted exfoliation could help produce graphene at high volume, but a gas stream can separate layers through more than one route. Comparing only final sheet motion does not show how difficult each pathway is energetically.',
      question: 'How do gas conditions and graphene structure change the free-energy cost of separating layers under compressible flow?',
      approach: 'The study combines molecular dynamics with potential-of-mean-force calculations to map exfoliation pathways. It varies flow velocity, temperature, pressure, sheet size, layer count, defects, and gas composition so those conditions can be compared within one framework.',
      results: [
        { label: 'Pathway comparison', value: 'Free-energy profiles', detail: 'The main output is a set of free-energy profiles for distinct layer-separation pathways under compressible flow, giving a common way to compare how difficult each route is.' },
        { label: 'Process variables', value: 'Gas flow and sheet structure considered together', detail: 'Velocity, temperature, pressure, gas species, layer count, sheet size, and defects are treated as connected design variables rather than isolated settings.' },
        { label: 'Use of the map', value: 'A basis for choosing conditions', detail: 'The framework is intended to help screen gas-assisted exfoliation conditions relevant to higher-volume graphene production and nanocomposite applications.' },
      ],
      takeaway: 'This paper contributes a comparison framework for exfoliation pathways. The detailed parameter maps and numerical outcomes are in the publisher version linked below.',
    }
  },
  {
    title: 'Compressible Flow Exfoliation of Two-Dimensional Nanomaterials: Insights Into Layer Separation Informed by Gas Dynamics',
    year: 2026,
    journal: 'Advanced Engineering Materials',
    url: 'https://doi.org/10.1002/adem.202502168',
    authors: ['Md Farhadul Islam', 'Saeed Arabha', 'Ray Hixon', 'Reza Rizvi'],
    topic: 'Graphene production',
    summary: 'Examines how gas dynamics affect the separation of layered materials during compressible flow exfoliation. It links flow behaviour to the practical challenge of producing two-dimensional sheets at scale.',
    story: {
      context: 'Compressible-flow exfoliation sends layered powders through a nozzle at high speed. Predicting the mechanism matters because stronger shock conditions do not automatically mean that the material layers receive enough force to separate.',
      question: 'Which part of the gas flow initiates layer separation, and can that force be related to the experimentally observed exfoliation yield?',
      approach: 'The authors paired converging–diverging nozzle and shock-tube experiments on hexagonal boron nitride with quasi-one-dimensional particle-laden-flow analysis. They compared measured optical absorbance across gas and pressure conditions with calculated gas velocity, shock position, and thrust on the sheets.',
      results: [
        { label: 'Initiation mechanism', value: 'Thrust at the nozzle throat', detail: 'The analysis indicates that shock waves alone do not start exfoliation. Gas acceleration through the nozzle throat produces the thrust that initiates layer separation.' },
        { label: 'Threshold in tested conditions', value: 'About 30 μN', detail: 'A cutoff force near 30 μN aligns with the measured absorbance ratios and is sufficient to initiate exfoliation in the tested setup.' },
        { label: 'Gas choice and yield', value: 'Helium gives the strongest absorbance', detail: 'Helium at 5.6 MPa produced the highest measured absorbance. Even at 1.4 MPa, helium outperformed nitrogen at 5.6 MPa in the comparison, showing that carrier gas matters alongside supply pressure.' },
      ],
      takeaway: 'The combined flow analysis and experiments identify gas-driven thrust—not the shock by itself—as the practical trigger to tune when designing this exfoliation process.',
    },
    figures: [{ src: '/journal-figures/cfe-exfoliation-yield.jpg', alt: 'UV–visible absorbance spectra and 300-nanometre absorbance comparison for h-BN exfoliation with helium and nitrogen at two supply pressures.', caption: 'The absorbance comparison shows the strongest exfoliation signal for helium at 5.6 MPa and a higher signal for helium at 1.4 MPa than nitrogen at 5.6 MPa.', source: 'Figure 5' }],
  },
  ...existing.map((paper, index) => ({
    title: paper.Title,
    year: paper.Year,
    journal: paper.Journal.replace(/ (178|200|348|264|22)$/, ''),
    url: paper.Link,
    authors: paper.AuthorsList || paper.Authors.split(', '),
    ...notes[index]
  }))
];

if (journalStories.length !== papers.length) {
  throw new Error('Every journal paper must have an editorial story');
}

const papersWithRoutes = papers.map((paper, index) => {
  const slug = slugify(paper.title);
  const sourcePdf = pdfFiles.get(paper.title);
  const originalEditorial = journalStories[index];
  const evidence = journalEvidence[index] || {};
  const { extras, tables, figuresRemap, ...evidenceEditorial } = evidence;
  const editorial = { ...originalEditorial, ...evidenceEditorial };
  const claims = journalResultClaims[index];
  const story = { ...paper.story, results: claims ? claims.map(([label, value, detail]) => ({ label, value, detail })) : paper.story.results };
  if (editorial.scenes.length !== paper.story.results.length || originalEditorial.figureResults.length !== (paper.figures?.length || 0)) {
    throw new Error(`Story sections or selected figures do not match: ${paper.title}`);
  }
  return {
    ...paper,
    summary: evidence.standfirst || paper.summary,
    story,
    url: sourceDois.has(sourcePdf) ? `https://doi.org/${sourceDois.get(sourcePdf)}` : paper.url,
    editorial,
    tables: evidence.tables || [],
    sourceReview: sourcePdf ? "Reviewed against the supplied PDF" : "Full text needed for an evidence-based story",
    figures: [...(paper.figures || []).map((figure, figureIndex) => {
      const dimensions = journalFigureDimensions[path.basename(figure.src)];
      if (!dimensions) throw new Error(`Missing figure dimensions: ${figure.src}`);
      return {
        ...figure,
        width: dimensions[0],
        height: dimensions[1],
        resultIndex: evidence.figuresRemap?.[figureIndex] ?? originalEditorial.figureResults[figureIndex],
        reading: originalEditorial.figureReadings[figureIndex],
        page: ({1:[6],2:[6],3:[8],4:[5],5:[6],6:[8],7:[4,5],8:[4,7],9:[8],10:[4],11:[8],12:[6]})[index]?.[figureIndex],
      };
    }), ...(evidence.extras || [])].sort((a, b) => a.resultIndex - b.resultIndex || Number(a.source.replace(/\D/g, "")) - Number(b.source.replace(/\D/g, ""))),
    slug,
    pdf: sourcePdf ? `/papers/${slug}.pdf` : null,
  };
});

if (new Set(papersWithRoutes.map((paper) => paper.slug)).size !== papersWithRoutes.length) {
  throw new Error('Journal paper titles produced duplicate page slugs');
}

const target = path.join(root, 'src/data/journalPapers.json');
fs.writeFileSync(target, JSON.stringify(papersWithRoutes, null, 2) + '\n');
console.log(`Generated ${target} with ${papersWithRoutes.length} papers`);
