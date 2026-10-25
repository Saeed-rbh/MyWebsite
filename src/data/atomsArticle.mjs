export const atomsArticle = {
  "title": "Matter, atom by atom: a guide to atomistic simulation",
  "description": "Explore atomistic simulation through a missing atom, a denser gas, and moving water molecules. Learn to make a fair comparison, read a trajectory, and connect atomic motion to research evidence.",
  "intro": "A solid can look perfectly still while its atoms move. Remove one atom and its neighbours feel a different environment. Atomistic simulation lets us follow that change, test an explanation, and work out what we would need to measure before making a claim about the material.",
  "simulationExamples": [
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
          "text": "Keep Perfect lattice and T* = 0.08. Press Play and watch the atoms move around their starting sites."
        },
        {
          "label": "Change",
          "text": "Choose Add a vacancy, leaving the initial temperature unchanged. The model restarts with one atom removed."
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
          "text": "Run Roomy box at T* = 1.50. Leave Velocity arrows on so you can follow changes in direction."
        },
        {
          "label": "Change",
          "text": "Choose Denser gas. The same 24 atoms now occupy a smaller area, at the same initial temperature."
        },
        {
          "label": "Observe",
          "text": "Watch the arrows turn during encounters. Compare similar simulated times; the view refits each box, so use the density readout."
        }
      ],
      "boundary": "This is a repeating, two-dimensional gas with no walls. Switching boxes creates a new starting system; it is not a simulation of a moving piston.",
      "researchIndex": 1
    },
    {
      "id": "water",
      "label": "Water",
      "subtitle": "Inside a molecule, between molecules",
      "explanation": "Each molecule keeps its internal shape because this model constrains it. Dashed contacts can appear and disappear as neighbouring molecules move and reorient.",
      "measure": "H-bond candidates counts contacts that meet the chosen distance and angle rules. It does not count new covalent bonds or chemical reactions.",
      "question": "Which connections stay, and which can change?",
      "steps": [
        {
          "label": "Inspect",
          "text": "Choose Inspect H₂O before pressing Play. Notice the bent shape and the two solid O–H connections."
        },
        {
          "label": "Follow",
          "text": "Switch to Water box, then press Play. Keep Hydrogen-bond guides on and watch neighbouring molecules turn and move."
        },
        {
          "label": "Distinguish",
          "text": "Compare the solid connections within each molecule with the dashed contacts between molecules. Watch the H-bond candidates count."
        }
      ],
      "boundary": "The starting grid is not an equilibrated liquid, and it may warm as it relaxes. These small planar models do not reproduce quantitative bulk-water properties.",
      "researchIndex": 3
    }
  ],
  "sections": [
    {
      "id": "what-is-atomistic",
      "number": "01",
      "nav": "What",
      "title": "What did we put in the model?",
      "paragraphs": [
        "The moving spheres above represent individual atoms. The computer stores their positions, masses, and velocities, then uses a physical model to calculate how they interact. In the solid example, removing one atom creates a vacancy: an empty site in an otherwise ordered arrangement.",
        "This is a numerical experiment. We choose a small system, specify its rules, and calculate what follows. The same idea extends to molecules, gases, and interfaces, but each needs an interaction model suited to its chemistry and the question being asked."
      ],
      "source": 8
    },
    {
      "id": "why-simulate",
      "number": "02",
      "nav": "Why",
      "title": "A useful explanation starts with a fair comparison.",
      "paragraphs": [
        "Suppose a material with defects carries heat differently. A measurement can reveal the difference without showing exactly which atomic mechanism caused it. The vacancy model gives us a way to investigate a candidate explanation: changing the local environment changes the forces and motion nearby.",
        "To test that explanation, change one model ingredient at a time. Compare the complete and defective crystals under matched conditions, then repeat the calculation. A different-looking trajectory is a clue. A claim about heat transport needs a defined measurement, enough sampling, and independent evidence."
      ],
      "source": 0
    },
    {
      "id": "how-it-works",
      "number": "03",
      "nav": "How",
      "title": "How does the computer move the atoms?",
      "paragraphs": [
        "For the vacancy question, begin with two structures: a complete lattice and the same lattice with one site empty. Choose an energy-and-force model and matching boundary conditions. Molecular dynamics then follows how each system moves; the explorer gives you a small example of that calculation.",
        "At each time step, forces give accelerations and a numerical integrator updates positions and velocities. The sequence of configurations is a trajectory. A research study then allows equilibration, collects measurements, estimates uncertainty, and checks that the answer survives changes in time step, box size, and sampling."
      ],
      "source": 8
    },
    {
      "id": "where-it-helps",
      "number": "04",
      "nav": "Where",
      "title": "What turns motion into a material property?",
      "paragraphs": [
        "The missing atom is a starting point, not the final engineering answer. If we want to know how defects affect heat transport, we need a suitable thermal-transport calculation. If we want strength, we need an appropriate mechanical test. The quantity we measure must match the question.",
        "An atomic mechanism or a validated interface property can then inform a larger continuum model, such as a calculation of temperature across a component. The studies below show this progression: a specific question, an atomic comparison, and a conclusion with limits."
      ],
      "source": 8
    }
  ],
  "takeaways": [
    "A missing atom changes the local environment. The motion helps us identify a question worth testing.",
    "A useful comparison changes the intended variable while matching the relevant conditions.",
    "A trajectory records motion. A material property requires a defined measurement and enough sampling.",
    "Validation connects a result for the model to a claim about a real material."
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
      "role": "Prepare the system",
      "text": "Packs molecules into a specified region to create initial coordinates without severe overlaps.",
      "detail": "Output: a starting configuration. You still need a compatible force field and topology.",
      "url": "https://m3g.github.io/packmol/"
    },
    {
      "name": "LAMMPS",
      "logo": "/images/atoms/software/lammps.jpg",
      "role": "Run molecular dynamics",
      "text": "An atomistic simulation engine used for materials, interfaces, liquids, and many other particle systems. Input scripts define the interactions, boundaries, integration, and outputs.",
      "detail": "Output: trajectories, energies, temperatures, stresses, and user-defined measurements.",
      "url": "https://docs.lammps.org/Intro.html"
    },
    {
      "name": "GROMACS",
      "logo": "/images/atoms/software/gromacs.png",
      "role": "Run molecular dynamics",
      "text": "A molecular-dynamics suite widely used for molecular systems, including solvated biomolecules. It provides simulation and trajectory-analysis tools.",
      "detail": "Coordinates and topology must agree with the selected force field and water model.",
      "url": "https://www.gromacs.org/about.html"
    },
    {
      "name": "OpenMM",
      "logo": "/images/atoms/software/openmm.svg",
      "role": "Build a simulation in Python",
      "text": "A molecular-simulation toolkit with a Python interface and GPU acceleration. Useful when a workflow needs programmable forces and integration.",
      "detail": "A toolkit for calculating motion; the scientific model still needs validation.",
      "url": "https://openmm.org/"
    },
    {
      "name": "OVITO",
      "logo": "/images/atoms/software/ovito.png",
      "role": "Inspect and analyse",
      "text": "Visualises particle trajectories and extracts structural information from simulation output. Colour atoms by a property, inspect local structure, and build analysis pipelines.",
      "detail": "A visualisation and analysis tool; it does not replace the force-field calculation.",
      "url": "https://www.ovito.org/"
    },
    {
      "name": "Quantum ESPRESSO",
      "role": "Calculate electronic structure",
      "text": "A density-functional-theory suite for electronic structure and materials modelling. It can provide energies and forces from a quantum description.",
      "detail": "A different level of theory from classical force-field MD, with a different computational cost.",
      "url": "https://www.quantum-espresso.org/"
    }
  ],
  "research": [
    {
      "title": "Why does deformation change heat transport?",
      "text": "Compare the sheets before and after torsion. Atomistic models resolve wrinkles in graphene, h-BN, and MoS₂, helping connect deformation to changes in thermal transport. Use the shared height colour scale to compare wrinkle amplitudes.",
      "category": "Solids / Structure and properties",
      "paperTitle": "Effect of planar torsional deformation on the thermal conductivity of 2D nanomaterials: A molecular dynamics study",
      "slug": "effect-of-planar-torsional-deformation-on-the-thermal-conductivity-of-2d-nanomaterials-a-molecul",
      "url": "https://doi.org/10.1016/j.mtcomm.2019.100706",
      "figure": {
        "src": "/journal-figures/torsion-morphology.jpg",
        "width": 1098,
        "height": 870,
        "source": "Figure 3",
        "page": 3,
        "sourceFile": "1-s2.0-S2352492819308992-main.pdf",
        "resultIndex": 0,
        "caption": "Torsion turns irregular height fluctuations into ordered wrinkles in graphene, h-BN, and MoS₂.",
        "reading": "Compare each material before and after 5° torsion; keep the color scales in mind when comparing amplitudes.",
        "alt": "Torsion turns irregular height fluctuations into ordered wrinkles in graphene, h-BN, and MoS₂.",
        "originalColors": true
      },
      "problem": "Thin materials can wrinkle under mechanical deformation. We need to understand how that structural change affects their ability to carry heat.",
      "implication": "Relate a controllable deformation to material response, then test the trend for the intended geometry and conditions.",
      "connection": "In the solid experiment, you changed local structure. This study asks how a different structural change—twisting a sheet—relates to heat transport."
    },
    {
      "title": "How does gas flow separate layered materials?",
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
      "title": "How can we study more atoms without losing useful accuracy?",
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
      "title": "What controls heat crossing a material–liquid interface?",
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
      "connection": "The water experiment separates molecular geometry from interactions between molecules. This study asks how electrostatic interactions influence cooling at a solid–water interface."
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
      "nav": "The system",
      "title": "First, build a small world.",
      "paragraphs": [
        "A computer stores an atom as data: its element, mass, position, and velocity. We arrange these atoms into a crystal, a liquid, or an interface and choose the size of the simulation box.",
        "The edges need rules too. A free surface can meet vacuum; periodic boundaries repeat the box so atoms crossing one side return through the opposite side. This approximates a bulk material, but the box must still be large enough for the question being asked."
      ],
      "source": 0
    },
    {
      "id": "simulation-methods",
      "nav": "Methods",
      "title": "Different questions need different calculations.",
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
      "nav": "Interactions",
      "title": "The important part is the rule between atoms.",
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
      "nav": "Time steps",
      "title": "Calculate. Move. Repeat.",
      "paragraphs": [
        "Newton’s law connects force to acceleration: F = ma. A numerical integrator uses that acceleration to update velocities and positions over a small time interval, then calculates the forces again.",
        "Velocity Verlet performs this update in stages. A smaller time step resolves motion more closely but requires more steps to reach the same physical time. Choosing a stable step is essential; a smooth-looking animation alone does not demonstrate accuracy."
      ],
      "source": 2
    },
    {
      "id": "temperature",
      "number": "06",
      "nav": "Temperature",
      "title": "Temperature is motion, measured collectively.",
      "paragraphs": [
        "In classical molecular dynamics, temperature is related to kinetic energy across the relevant degrees of freedom. Individual atoms do not each have a thermodynamic temperature, and collective flow should be distinguished from thermal motion.",
        "A thermostat exchanges energy with the simulated system to sample a chosen temperature. It is a modeling choice, not an animation-speed control. In the explorer, the playback slider changes how quickly you watch the trajectory; it does not set a thermodynamic temperature."
      ],
      "source": 3
    },
    {
      "id": "measure-properties",
      "number": "07",
      "nav": "Measurements",
      "title": "A trajectory becomes evidence.",
      "paragraphs": [
        "The output is a trajectory: a record of atomic motion. From it we can measure structure, diffusion, stress, or energy transfer. Averages over many configurations are usually more useful than a single frame.",
        "Researchers first allow the system to relax toward the intended conditions, then collect measurements. Independent runs, uncertainty estimates, and comparisons with experiments help establish whether an apparent trend is meaningful."
      ],
      "source": 0
    },
    {
      "id": "limits",
      "number": "08",
      "nav": "Limits",
      "title": "Every simulation has a boundary.",
      "paragraphs": [
        "A simulation follows the model we supplied. An unsuitable potential cannot be repaired merely by running it longer. Small boxes, short trajectories, boundary conditions, and numerical errors can all influence the answer.",
        "Classical trajectories do not explicitly capture every quantum effect. Rare events may remain unseen within the available time. Reliable work states these limits and checks whether its conclusions survive changes in system size, time step, and sampling."
      ],
      "source": 0
    }
  ]
};
