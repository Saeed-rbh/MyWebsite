export const atomsArticle = {
  "title": "Matter, atom by atom: a guide to atomistic simulation",
  "description": "Start with a drop of water, learn how molecular dynamics works, and follow Saeed Arabha’s published research on heat transfer and graphene exfoliation.",
  "intro": "A drop of water may look still, but its molecules are moving. How could we follow them, and what would they tell us about the way heat moves? Start with one water molecule, then see how I use atomic simulations to study heat transfer, 2D sheets, and solid–liquid interfaces.",
  "heroScaleBridge": {
    "image": {
      "src": "/images/atoms/water-ripples.webp",
      "width": 1200,
      "height": 800,
      "alt": "Macro droplet impact sending copper and teal ripples across a dark water surface."
    },
    "caption": "From a visible ripple down to individual oxygen–hydrogen bonds.",
    "scales": [
      {
        "id": "molecule",
        "badge": "0.96 Å · 1 H₂O",
        "label": "One bent molecule",
        "detail": "One oxygen and two hydrogens held near 104.5° by covalent O–H bonds."
      },
      {
        "id": "network",
        "badge": "1–5 ps · H-bond network",
        "label": "Fleeting neighbours",
        "detail": "Electrostatic attractions form and break picosecond hydrogen-bond contacts."
      },
      {
        "id": "interface",
        "badge": "10–100 nm · Interfaces",
        "label": "Heat & layer motion",
        "detail": "Collective trajectories reveal interfacial cooling and 2D sheet mechanics."
      }
    ]
  },
  "simulationExamples": [
    {
      "id": "water",
      "label": "Water",
      "subtitle": "Inside a molecule, between molecules",
      "explanation": "Each molecule keeps its internal shape because this model constrains it. Dashed contacts can appear and disappear as neighbouring molecules move and reorient.",
      "measure": "H-bond candidates counts contacts that meet the chosen distance and angle rules. It does not count new covalent bonds or chemical reactions.",
      "question": "What are the molecules in a drop of water doing?",
      "steps": [
        {
          "label": "Inspect",
          "text": "Start with the single water molecule. Notice the bent shape and the two solid O–H connections."
        },
        {
          "label": "Follow",
          "text": "Choose See water molecules together, then press Play. Keep Hydrogen-bond guides on and watch neighbouring molecules turn and move."
        },
        {
          "label": "Distinguish",
          "text": "Compare the solid connections within each molecule with the dashed contacts between molecules. Watch the H-bond candidates count."
        }
      ],
      "boundary": "The starting grid is not an equilibrated liquid, and it may warm as it relaxes. These small planar models do not reproduce quantitative bulk-water properties.",
      "researchTarget": "water-research"
    },
    {
      "id": "solid",
      "label": "Solid",
      "subtitle": "One missing atom",
      "explanation": "The rings mark starting positions; the dashed teal ring marks the vacancy. Local motion helps you ask how a changed atomic environment affects the material.",
      "measure": "RMS displacement averages motion over all atoms. Compare similar simulated times. Reset repeats the same starting conditions here; research comparisons also need runs with independent starting velocities.",
      "question": "What changes when one atom is missing?",
      "steps": [
        {
          "label": "Start",
          "text": "Start with the complete lattice. Press Play and watch atoms move around their starting sites."
        },
        {
          "label": "Change",
          "text": "Choose Add a vacancy. The model restarts with one atom removed and the same initial temperature."
        },
        {
          "label": "Observe",
          "text": "Find the dashed empty site. Watch its neighbours; use Pause and One step to inspect their motion."
        }
      ],
      "boundary": "This example does not measure heat flow or strength. A change in motion is a reason to investigate those properties, not a result for them.",
      "researchIndex": 0
    },
    {
      "id": "gas",
      "label": "Gas",
      "subtitle": "Same atoms, less space",
      "explanation": "A sudden change in an arrow shows a change in velocity during an encounter. Compare the patterns over time, rather than judging a single frame.",
      "measure": "The displayed number density is atoms divided by box area. A collision rate or diffusion coefficient would need a separate calculation over sufficiently long trajectories.",
      "question": "What changes when the same gas has less room?",
      "steps": [
        {
          "label": "Start",
          "text": "Run the roomy box. Open Settings & model to turn on velocity arrows if needed."
        },
        {
          "label": "Change",
          "text": "Choose Compress box. The same 24 atoms restart in a smaller area at the same initial temperature."
        },
        {
          "label": "Observe",
          "text": "Watch encounters and the displacement curve. The picture refits the box; compare the number-density readout."
        }
      ],
      "boundary": "This is a repeating, two-dimensional gas with no walls. Switching boxes creates a new starting system; it is not a simulation of a moving piston.",
      "researchIndex": 1
    }
  ],
  "sections": [
    {
      "id": "what-is-atomistic",
      "number": "01",
      "nav": "The atomic model",
      "title": "From one molecule to a drop of water",
      "highlights": ["bent shape", "molecular dynamics"],
      "paragraphs": [
        "Water is made of molecules. Each molecule has one oxygen atom joined to two hydrogen atoms in a bent shape. In the explorer, the molecule keeps that shape as it moves and turns.",
        "Add neighbours and a second kind of connection appears. A hydrogen on one molecule can be attracted to the oxygen on another. These contacts can come and go as the molecules move.",
        "A computer model gives each atom a mass and a position, and defines how the atoms interact. Molecular dynamics also gives them starting velocities and calculates how they move over time."
      ],
      "source": 8
    },
    {
      "id": "why-simulate",
      "number": "02",
      "nav": "A fair comparison",
      "title": "A useful explanation starts with a fair comparison.",
      "highlights": ["same times", "independent starting conditions"],
      "paragraphs": [
        "Imagine a tiny hot particle surrounded by cooler water. Where would you look for the first sign of warming? You could average the temperature of all the water, or compare water close to the particle with water farther away.",
        "To compare those regions fairly, measure them at the same times and use the same procedure to estimate each temperature. To test whether a change to the model matters, change the part you want to study and match the other relevant conditions.",
        "The teaching explorer repeats the same starting motion on reset. In research, running the simulation with independent starting conditions helps distinguish a consistent pattern from ordinary fluctuations."
      ],
      "source": 0
    },
    {
      "id": "how-it-works",
      "number": "03",
      "nav": "Energy, forces and motion",
      "title": "How does the computer move the atoms?",
      "highlights": ["interatomic potential", "Lennard–Jones interaction"],
      "paragraphs": [
        "The computer needs a rule for energy before it can calculate motion. An interatomic potential assigns an energy to an arrangement of atoms. The slope of that energy tells us the force: a steep slope produces a large force, while a flat minimum gives zero net radial force for an isolated pair.",
        "The solid and gas explorers use a Lennard–Jones interaction: strong repulsion at short separation and attraction farther out. Move the separation slider below to see both regimes. This simple model teaches the calculation; the bonding in a real metal, semiconductor or molecule may need a different description.",
        "Newton’s law turns the force on each atom into acceleration. A numerical integrator advances positions and velocities by a small time step, calculates new forces and repeats. Molecular dynamics produces a trajectory this way. The calculation uses forces from all relevant neighbours, rather than telling each atom to follow a drawn path."
      ],
      "source": 10
    },
    {
      "id": "where-it-helps",
      "number": "04",
      "nav": "Reading a trajectory",
      "title": "What turns motion into a material property?",
      "highlights": ["mean-squared displacement", "independent evidence"],
      "paragraphs": [
        "A trajectory is a record of positions through time. To measure displacement, compare each atom with its starting position. Square those distances and average over the atoms to obtain mean-squared displacement, or MSD. The live explorer plots its square root, the RMS displacement, in units of the model’s length scale.",
        "In a vibrating solid, atoms can move back and forth without travelling far from their sites. A gas atom can move across the box repeatedly. Periodic boundaries wrap the picture at each edge; the displacement calculation keeps track of the crossings so an atom does not appear to jump backwards.",
        "The property determines the analysis. Diffusion requires the long-time behaviour of MSD in a suitable regime; thermal conductivity needs a heat-transport calculation; strength needs a mechanical test. A short displacement curve does not supply all three. After equilibration, researchers collect sufficient samples, estimate uncertainty and check the result against independent evidence."
      ],
      "source": 12
    }
  ],
  "waterStudy": {
    "title": "Where does the heat go first?",
    "highlights": ["thin shells", "effective description"],
    "metrics": [
      { "value": "≈ +5.5 K", "label": "First-shell peak", "detail": "Closest water shell warms first at ~1.4 ps" },
      { "value": "1.4 → 3.15 ps", "label": "Radial arrival lag", "detail": "Outer shells peak later and lower as heat spreads" },
      { "value": "4 methods", "label": "Boundary cross-check", "detail": "MD shells benchmarked against continuum conduction" }
    ],
    "intro": "In a study I co-authored, we started with a hot silver nanoparticle in cooler water. We divided the water into thin shells around the particle, like layers of an onion, and tracked the temperature in each shell as the silver cooled.",
    "result": "The closest shell warmed by about 5 degrees. Farther away, the temperature peaks were smaller and arrived later. Grouping the molecules by distance revealed where the heat arrived and how the warming spread.",
    "check": "We compared the shell temperatures with a heat conduction model that treats water as a continuous liquid. It reproduced the temperature evolution using an effective description of the water near the surface. The paper also compares four ways of estimating heat transfer across the silver–water boundary.",
    "slug": "thermal-transport-at-a-nanoparticle-water-interface-a-molecular-dynamics-and-continuum-modeling",
    "url": "https://doi.org/10.1063/1.5084234",
    "figure": {
      "src": "/journal-figures/nanoparticle-water-shells.jpg",
      "width": 1200,
      "height": 600,
      "alt": "Temperature peaks are smaller and arrive later in water shells farther from a hot silver nanoparticle.",
      "reading": "On the left, compare the height of the temperature peaks. On the right, follow how the time of the peak changes with distance from the particle centre.",
      "caption": "Figure 5 · Rajabpour, Seif, Arabha and colleagues · The Journal of Chemical Physics, 2019"
    }
  },
  "grapheneBridge": "The silver study follows heat across a boundary into water. The same atomistic workflow also lets us follow heat and momentum inside atomically thin 2D sheets—testing how wrinkling lowers thermal conductivity, how high-speed gas slides graphene layers apart, how machine-learning potentials scale quantum forces, and how electrostatics govern nanoparticle cooling.",
  "takeaways": [
    "Water molecules move and interact even in a drop that looks still.",
    "A simulation records motion over time. A measurement, such as temperature at different distances, turns that record into evidence.",
    "The same method can help explain how a material carries heat or how a manufacturing process moves its layers."
  ],
  "faq": [
    {
      "question": "Is atomistic simulation the same as molecular dynamics?",
      "answer": "No. Molecular dynamics is one atomistic method. Energy minimisation, Monte Carlo sampling, and electronic-structure calculations answer other questions; some of these approaches can also be combined."
    },
    {
      "question": "Are the moving spheres real images of atoms?",
      "answer": "No. They visualise atomic coordinates. Radii, colours, and playback speed are display choices. Quantitative conclusions come from the underlying model and analysis."
    },
    {
      "question": "Can a simulation show chemical reactions?",
      "answer": "Only if its description of interactions supports them. Fixed-topology models do not create or break covalent bonds. Reactive potentials and suitable electronic-structure methods can describe changing connectivity within their range of validity."
    },
    {
      "question": "Can simulations replace experiments?",
      "answer": "They can test mechanisms and reveal quantities that are difficult to measure directly. Experiments and independent reference calculations remain important checks on whether a model describes the real system."
    }
  ],
  "sources": [
    {
      "label": "LAMMPS: introduction to particle simulations",
      "url": "https://docs.lammps.org/Intro.html"
    },
    {
      "label": "LAMMPS: interatomic interaction models",
      "url": "https://docs.lammps.org/pair_style.html"
    },
    {
      "label": "LAMMPS: velocity-Verlet integration",
      "url": "https://docs.lammps.org/fix_nve.html"
    },
    {
      "label": "LAMMPS: thermostats and temperature",
      "url": "https://docs.lammps.org/Howto_thermostat.html"
    },
    {
      "label": "LAMMPS: TIP4P water geometry and virtual charge sites",
      "url": "https://docs.lammps.org/Howto_tip4p.html"
    },
    {
      "label": "LAMMPS: TIP3P water models",
      "url": "https://docs.lammps.org/Howto_tip3p.html"
    },
    {
      "label": "Jorgensen et al. (1983): Comparison of simple potential functions for simulating liquid water",
      "url": "https://doi.org/10.1063/1.445869"
    },
    {
      "label": "Abascal & Vega (2005): The TIP4P/2005 water model",
      "url": "https://doi.org/10.1063/1.2121687"
    },
    {
      "label": "University of Helsinki: atomistic simulation methods",
      "url": "https://www.mv.helsinki.fi/home/knordlun/moldyn/moldyn_course_everything.pdf"
    },
    {
      "label": "Quantum ESPRESSO: electronic structure and atomic forces",
      "url": "https://www.quantum-espresso.org/Doc/pw_user_guide/node3.html"
    },
    {
      "label": "LAMMPS: Lennard–Jones pair interactions",
      "url": "https://docs.lammps.org/pair_lj.html"
    },
    {
      "label": "LAMMPS: reduced units and physical units",
      "url": "https://docs.lammps.org/units.html"
    },
    {
      "label": "LAMMPS: mean-squared displacement and periodic boundaries",
      "url": "https://docs.lammps.org/compute_msd.html"
    }
  ],
  "diagrams": [
    {
      "chapter": "what-is-atomistic",
      "src": "/images/atoms/atomistic-systems.svg",
      "title": "The same atomic perspective, many kinds of matter.",
      "caption": "Crystals, molecular systems, and interfaces ask different questions of the same basic ingredients: atomic positions, interactions, and boundary conditions. Schematic arrangements, not computed trajectories.",
      "alt": "Three schematics showing a crystal with a vacancy, disordered molecular matter, and an interface between different atom types",
      "source": 8
    },
    {
      "chapter": "how-it-works",
      "src": "/images/atoms/simulation-workflow.svg",
      "title": "The trajectory is one part of the workflow.",
      "caption": "Prepare the system, define its interactions, relax it, and collect trajectories. Measurement and validation turn those trajectories into an answer.",
      "alt": "Workflow from coordinates and topology through model definition, relaxation, time integration and analysis",
      "source": 2
    }
  ],
  "software": [
    {
      "name": "PACKMOL",
      "logo": "/images/atoms/software/packmol.png",
      "stageTag": "01 · Packing",
      "role": "Prepare the system",
      "text": "Packs molecules into a specified region to create initial coordinates without severe overlaps.",
      "detail": "Output: a starting configuration. You still need a compatible force field and topology.",
      "url": "https://m3g.github.io/packmol/"
    },
    {
      "name": "LAMMPS",
      "logo": "/images/atoms/software/lammps.jpg",
      "stageTag": "02 · Classical MD",
      "role": "Run molecular dynamics",
      "text": "An atomistic simulation engine used for materials, interfaces, liquids, and many other particle systems. Input scripts define the interactions, boundaries, integration, and outputs.",
      "detail": "Output: trajectories, energies, temperatures, stresses, and user-defined measurements.",
      "url": "https://docs.lammps.org/Intro.html"
    },
    {
      "name": "GROMACS",
      "logo": "/images/atoms/software/gromacs.png",
      "stageTag": "03 · Liquid & bio MD",
      "role": "Run molecular dynamics",
      "text": "A molecular-dynamics suite widely used for molecular systems, including solvated biomolecules. It provides simulation and trajectory-analysis tools.",
      "detail": "Coordinates and topology must agree with the selected force field and water model.",
      "url": "https://www.gromacs.org/about.html"
    },
    {
      "name": "OpenMM",
      "logo": "/images/atoms/software/openmm.svg",
      "stageTag": "04 · Programmable MD",
      "role": "Build a simulation in Python",
      "text": "A molecular-simulation toolkit with a Python interface and GPU acceleration. Useful when a workflow needs programmable forces and integration.",
      "detail": "A toolkit for calculating motion; the scientific model still needs validation.",
      "url": "https://openmm.org/"
    },
    {
      "name": "OVITO",
      "logo": "/images/atoms/software/ovito.png",
      "stageTag": "05 · Analysis & visuals",
      "role": "Inspect and analyse",
      "text": "Visualises particle trajectories and extracts structural information from simulation output. Colour atoms by a property, inspect local structure, and build analysis pipelines.",
      "detail": "A visualisation and analysis tool; it does not replace the force-field calculation.",
      "url": "https://www.ovito.org/"
    },
    {
      "name": "Quantum ESPRESSO",
      "stageTag": "06 · Electronic structure",
      "role": "Calculate electronic structure",
      "text": "A density-functional-theory suite for electronic structure and materials modelling. It can provide energies and forces from a quantum description.",
      "detail": "A different level of theory from classical force-field MD, with a different computational cost.",
      "url": "https://www.quantum-espresso.org/"
    }
  ],
  "research": [
    {
      "tabLabel": "Wrinkled sheets",
      "title": "Why does deformation change heat transport?",
      "highlights": ["before and after twisting", "carried heat less readily"],
      "metrics": [
        { "value": "−11%", "label": "h-BN at max twist", "detail": "κ/κ₀ ≈ 0.89" },
        { "value": "−18%", "label": "Graphene at max twist", "detail": "κ/κ₀ ≈ 0.82" },
        { "value": "−28%", "label": "MoS₂ at max twist", "detail": "κ/κ₀ ≈ 0.72" }
      ],
      "text": "In a study with Ali Rajabpour, I compared graphene and two other atomically thin materials before and after twisting. The simulations showed that as wrinkles grew, the sheets carried heat less readily.",
      "category": "Solids / Structure and properties",
      "paperTitle": "Effect of planar torsional deformation on the thermal conductivity of 2D nanomaterials: A molecular dynamics study",
      "slug": "effect-of-planar-torsional-deformation-on-the-thermal-conductivity-of-2d-nanomaterials-a-molecul",
      "url": "https://doi.org/10.1016/j.mtcomm.2019.100706",
      "figure": {
        "src": "/journal-figures/torsional-wrinkles.jpg",
        "width": 600,
        "height": 590,
        "source": "Figure 5",
        "caption": "Thermal conductivity falls as wrinkles grow in the three simulated sheets.",
        "reading": "Follow the black diamonds for graphene from left to right. As the wrinkles grow, the sheet carries heat less readily. Each curve is scaled to the value for that material before twisting.",
        "alt": "Normalized thermal conductivity falls with increasing wrinkle amplitude for graphene, boron nitride and molybdenum disulfide."
      },
      "structureFigure": {
        "src": "/journal-figures/torsion-morphology.jpg",
        "width": 1098,
        "height": 870,
        "source": "Figure 3",
        "caption": "Twisting produces ordered wrinkles in the three simulated sheets.",
        "reading": "Find graphene and compare the two views. The colours show how high or low each part of the sheet sits.",
        "alt": "Graphene, boron nitride and molybdenum disulfide before and after twisting."
      },
      "problem": "Thin materials can wrinkle under mechanical deformation. We need to understand how that structural change affects their ability to carry heat.",
      "implication": "Relate a controllable deformation to material response, then test the trend for the intended geometry and conditions.",
      "connection": "We followed heat from silver into water. Here we follow heat through a graphene sheet and ask what changes when the sheet wrinkles."
    },
    {
      "tabLabel": "Gas exfoliation",
      "title": "How does gas flow separate layered materials?",
      "highlights": ["sliding and vertical-distance distributions", "different distance scales"],
      "metrics": [
        { "value": "1000–2000 m s⁻¹", "label": "Gas stream speed", "detail": "Compressible parallel flow" },
        { "value": "~10–15 Å", "label": "In-plane sliding Dxy", "detail": "Distribution widens with flow speed" },
        { "value": "3.35 → 4.5 Å", "label": "Layer opening Dz", "detail": "Interlayer separation tail" }
      ],
      "text": "The sliding and vertical-distance distributions distinguish different components of graphene motion under gas flow. Compare their axes carefully: they use different distance scales. A trajectory helps test the mechanism behind a processing step.",
      "category": "Gas–solid interactions / Processing",
      "paperTitle": "Interactions of gas particles with graphene during high-throughput compressible flow exfoliation: A Molecular Dynamics simulations study",
      "slug": "interactions-of-gas-particles-with-graphene-during-high-throughput-compressible-flow-exfoliation",
      "url": "https://doi.org/10.1021/acs.jpcc.2c00425",
      "figure": {
        "src": "/journal-figures/graphene-sliding.jpg",
        "width": 741,
        "height": 489,
        "source": "Figure 6",
        "page": 5,
        "sourceFile": "jp2c00425.pdf",
        "resultIndex": 0,
        "caption": "Sliding and vertical-distance distributions reveal different magnitudes of layer motion under parallel gas flow.",
        "reading": "Compare the width of the sliding and vertical distributions; distinguish their Å-scale axes from total RMSD.",
        "alt": "Sliding and vertical-distance distributions reveal different magnitudes of layer motion under parallel gas flow."
      },
      "problem": "Producing thinner sheets requires understanding how momentum from a gas stream moves neighbouring layers.",
      "implication": "Identify the motion involved in exfoliation and use it to guide processing questions; an atomic trajectory alone does not establish manufacturing performance.",
      "connection": "The gas experiment makes momentum exchange visible. This study adds layered sheets and a driven gas flow to investigate their motion."
    },
    {
      "tabLabel": "Learned forces",
      "title": "How can we study more atoms without losing useful accuracy?",
      "highlights": ["reference configurations", "reference-data coverage and validation"],
      "metrics": [
        { "value": "DFT → MLIP", "label": "Force fidelity", "detail": "Near-quantum accuracy at MD speed" },
        { "value": "3 regimes", "label": "AIMD reference bank", "detail": "Thermal, point-defect & strained states" },
        { "value": "Active loop", "label": "Extrapolation gate", "detail": "Flags uncertain frames & retrains" }
      ],
      "text": "This figure from my perspective article connects reference configurations, training, and an interatomic potential. A learned model can make larger calculations practical, but its reliability depends on reference-data coverage and validation.",
      "category": "Machine-learning potentials / Literature perspective",
      "paperTitle": "Recent advances in lattice thermal conductivity calculation using machine-learning interatomic potentials",
      "slug": "recent-advances-in-lattice-thermal-conductivity-calculation-using-machine-learning-interatomic-p",
      "url": "https://doi.org/10.1063/5.0069443",
      "figure": {
        "src": "/journal-figures/mlip-training.jpg",
        "width": 924,
        "height": 918,
        "source": "Figure 1",
        "page": 5,
        "sourceFile": "210903_1_5.0069443.pdf",
        "resultIndex": 0,
        "caption": "The perspective’s training workflow connects first-principles configurations, fitting, and a deployable interatomic potential.",
        "reading": "Follow the reference-data and fitting loop before the final model is used in a larger calculation.",
        "alt": "The perspective’s training workflow connects first-principles configurations, fitting, and a deployable interatomic potential."
      },
      "problem": "Electronic-structure calculations can provide valuable forces, but their cost limits the systems and times we can explore.",
      "implication": "Learn an interatomic potential from reference data, then validate it before using it for larger calculations. Speed does not guarantee transferability.",
      "connection": "Every example above needs a rule for energy and forces. This perspective examines how researchers learn such rules from reference calculations."
    },
    {
      "tabLabel": "Interface charges",
      "title": "What controls heat crossing a material–liquid interface?",
      "highlights": ["removing electrostatics", "interfacial structure"],
      "metrics": [
        { "value": "1620 MW m⁻² K⁻¹", "label": "Coulomb + LJ", "detail": "Full electrostatic TiO₂–water coupling" },
        { "value": "17 MW m⁻² K⁻¹", "label": "LJ-only (no charges)", "detail": "≈95× drop in interfacial conductance" },
        { "value": "> 100 ps", "label": "Relaxation tail", "detail": "Cooling stalls without partial charges" }
      ],
      "relatedRoute": {
        "to": "/nanofluids",
        "label": "Compare in the nanofluids story ↗"
      },
      "text": "Compare the red TiO₂ curve (Lennard–Jones only) with the black curve (Lennard–Jones plus Coulomb). Removing electrostatics slows cooling markedly. It also changes the interfacial structure, so this is not an isolated subtraction of one heat-transfer channel.",
      "paperTitle": "Interfacial thermal conductance between TiO2 nanoparticle and water: A molecular dynamics study",
      "slug": "interfacial-thermal-conductance-between-tio2-nanoparticle-and-water-a-molecular-dynamics-study",
      "url": "https://doi.org/10.1016/j.molliq.2021.118053",
      "figure": {
        "src": "/journal-figures/tio2-electrostatics.jpg",
        "width": 720,
        "height": 573,
        "source": "Figure 10",
        "page": 6,
        "sourceFile": "1-s2.0-S0167732221027781-main.pdf",
        "resultIndex": 0,
        "caption": "Removing Coulomb interactions from the TiO₂–water model greatly slows the particle’s temperature relaxation.",
        "reading": "Compare the TiO₂ curves with and without electrostatics. The Ag reference differs in size and interaction parameters.",
        "alt": "Removing Coulomb interactions from the TiO₂–water model greatly slows the particle’s temperature relaxation."
      },
      "category": "Interfaces / Heat transfer",
      "problem": "A hot nanoparticle must release energy through its contact with the surrounding liquid. The interface can limit that transfer.",
      "implication": "Test how the interaction model changes the predicted cooling mechanism, and use the result to motivate better interface measurements and models.",
      "connection": "Returning to solid–liquid heat transfer: this study asks how electrostatic partial charges govern cooling across an interface."
    }
  ],
  "exampleDiagrams": [
    {
      "chapter": "water-structure",
      "src": "/images/atoms/water-geometry.svg",
      "title": "Read the geometry before running the model.",
      "caption": "Reference geometry used by TIP4P/2005. The moving explorer is a separate planar teaching model with TIP3P site parameters and finite-range interactions, not a TIP4P/2005 implementation.",
      "alt": "Bent H2O diagram with oxygen, two hydrogens, a 104.52 degree reference angle and 0.9572 angstrom bond distance",
      "source": 4
    },
    {
      "chapter": "water-structure",
      "src": "/images/atoms/water-models.svg",
      "title": "A virtual site changes where the charge acts.",
      "caption": "Three-site and four-site water models assign their interaction sites differently. The M-site location is exaggerated to make it visible.",
      "alt": "Comparison of three-site water and four-site TIP4P water with a virtual negative-charge site",
      "source": 4
    },
    {
      "chapter": "interaction-model",
      "src": "/images/atoms/bonds-and-contacts.svg",
      "title": "Covalent bonds and hydrogen bonds are different.",
      "caption": "Solid connections hold a molecule together. Dashed contacts connect neighbouring molecules and may change as they move; they do not indicate a chemical reaction.",
      "alt": "Water molecules joined by solid internal bonds and a dashed intermolecular contact",
      "source": 5
    }
  ],
  "technicalSections": [
    {
      "id": "build-a-system",
      "number": "02",
      "group": "setup",
      "nav": "The system",
      "title": "First, build a small world.",
      "highlights": ["simulation box", "periodic boundaries"],
      "paragraphs": [
        "A computer stores an atom as data: its element, mass, position, and velocity. We arrange these atoms into a crystal, a liquid, or an interface and choose the size of the simulation box.",
        "The edges need rules too. A free surface can meet vacuum; periodic boundaries repeat the box so atoms crossing one side return through the opposite side. This approximates a bulk material, but the box must still be large enough for the question being asked."
      ],
      "source": 0
    },
    {
      "id": "simulation-methods",
      "nav": "Methods",
      "group": "potentials",
      "title": "Different questions need different calculations.",
      "highlights": ["Molecular dynamics (MD)", "density functional theory (DFT)"],
      "paragraphs": [
        "Energy minimisation searches for a nearby low-energy arrangement. Molecular dynamics (MD) follows motion by integrating equations of motion. Monte Carlo samples configurations using trial moves and acceptance rules; ordinary equilibrium Monte Carlo steps are not a physical clock.",
        "A second choice is how to calculate energy and forces. Classical potentials use parameterised interaction models. Electronic-structure methods such as density functional theory (DFT) calculate them from a quantum description of the electrons. Machine-learning potentials learn from reference calculations and must be checked on configurations beyond their training data.",
        "These choices can be combined: molecular dynamics can use a classical potential, a learned potential, or forces recalculated with electronic structure. DFT is a level of description; MD is a way to evolve the atoms."
      ],
      "source": 8,
      "number": "03"
    },
    {
      "id": "interaction-model",
      "number": "04",
      "group": "potentials",
      "nav": "Interactions",
      "title": "The important part is the rule between atoms.",
      "highlights": ["interatomic potential", "negative gradient"],
      "paragraphs": [
        "An interatomic potential assigns energy to an arrangement of atoms. Forces are the negative gradient of that energy: they tell us which way atoms accelerate. Different materials need different descriptions of bonding, charge, and local environment.",
        "A simple pair potential can describe attraction and short-range repulsion. Bonding in more complex materials can require many-body models. Quantum calculations and machine-learning potentials offer other routes to forces, with different costs and ranges of reliability. A model must be validated for the material and conditions of interest.",
        "A metal, a covalent crystal, a polymer, and a molecular liquid cannot automatically share the same interaction model. Some models keep chemical connectivity fixed; reactive models allow it to change. The model must support the process we want to investigate."
      ],
      "source": 1
    },
    {
      "id": "move-atoms",
      "number": "05",
      "group": "setup",
      "nav": "Time steps",
      "title": "Calculate. Move. Repeat.",
      "highlights": ["Velocity Verlet", "stable step"],
      "paragraphs": [
        "Newton’s law connects force to acceleration: F = ma. A numerical integrator uses that acceleration to update velocities and positions over a small time interval, then calculates the forces again.",
        "Velocity Verlet performs this update in stages. A smaller time step resolves motion more closely but requires more steps to reach the same physical time. Choosing a stable step is essential; a smooth-looking animation alone does not demonstrate accuracy."
      ],
      "source": 2
    },
    {
      "id": "temperature",
      "number": "06",
      "group": "sampling",
      "nav": "Temperature",
      "title": "Temperature is motion, measured collectively.",
      "highlights": ["kinetic energy", "thermostat"],
      "paragraphs": [
        "In classical molecular dynamics, temperature is related to kinetic energy across the relevant degrees of freedom. Individual atoms do not each have a thermodynamic temperature, and collective flow should be distinguished from thermal motion.",
        "A thermostat exchanges energy with the simulated system to sample a chosen temperature. It is a modeling choice, not an animation-speed control. In the explorer, the playback slider changes how quickly you watch the trajectory; it does not set a thermodynamic temperature."
      ],
      "source": 3
    },
    {
      "id": "measure-properties",
      "number": "07",
      "group": "sampling",
      "nav": "Measurements",
      "title": "A trajectory becomes evidence.",
      "highlights": ["relax toward the intended conditions", "uncertainty estimates"],
      "paragraphs": [
        "The output is a trajectory: a record of atomic motion. From it we can measure structure, diffusion, stress, or energy transfer. Averages over many configurations are usually more useful than a single frame.",
        "Researchers first allow the system to relax toward the intended conditions, then collect measurements. Independent runs, uncertainty estimates, and comparisons with experiments help establish whether an apparent trend is meaningful."
      ],
      "source": 0
    },
    {
      "id": "limits",
      "number": "08",
      "group": "sampling",
      "nav": "Limits",
      "title": "Every simulation has a boundary.",
      "highlights": ["follows the model", "states these limits"],
      "paragraphs": [
        "A simulation follows the model we supplied. An unsuitable potential cannot be repaired merely by running it longer. Small boxes, short trajectories, boundary conditions, and numerical errors can all influence the answer.",
        "Classical trajectories do not explicitly capture every quantum effect. Rare events may remain unseen within the available time. Reliable work states these limits and checks whether its conclusions survive changes in system size, time step, and sampling."
      ],
      "source": 0
    }
  ]
};
