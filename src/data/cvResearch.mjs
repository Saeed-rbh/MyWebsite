export const profileHeading = "Materials process development and characterization";
export const profileIntro = "I develop lab-scale processes for 2D materials and use spectroscopy, microscopy, and molecular simulation to understand how processing affects the material.";

export const processExample = {
  title: "Process development",
  recovery: "31.6",
  summary: "At York, I rebuilt a gas-driven exfoliation apparatus. In a three-pass experiment, I recovered 316 mg of graphene from 1 g of graphite by reprocessing the sediment between passes.",
};

export const surfaceExample = {
  title: "Surface characterization",
  summary: "I compared the surface chemistry of reference MoS₂ and samples processed in air and helium. I wrote a Python workflow to fit overlapping XPS peaks.",
  figure: "/images/metrology/mos2-xps.png",
  caption: "Reference, helium, and air from left to right. The dominant Mo–S peaks persisted after processing.",
};

export const depositionExample = {
  title: "Automated deposition of 2D materials",
  summary: "I built a setup for liquid–liquid interface deposition on wafer substrates. It uses a motor to lift the sample and a syringe to feed liquid through a repeatable deposition sequence.",
};

export const selectedPapers = [
  {
    slug: "free-energy-mapping-of-gas-assisted-exfoliation-pathways-for-graphene-under-compressible-flow-im",
    title: "Graphene separation energetics",
    contribution: "I led the molecular simulation study and compared the energy required to separate graphene layers by sliding, peeling, and pulling them apart.",
  },
  {
    slug: "compressible-flow-exfoliation-of-two-dimensional-nanomaterials-insights-into-layer-separation-in",
    title: "Gas dynamics of exfoliation",
    contribution: "I contributed continuum flow analysis and helped interpret how gas acceleration and drag affect layer separation.",
  },
  {
    slug: "engineered-porous-borophene-with-tunable-anisotropic-properties",
    title: "Porous borophene",
    contribution: "I developed software and modeling methods to study how pore geometry affects directional heat transport and mechanical properties.",
  },
];

export const cvResearch = [
  {
    title: "Choosing a centrifugation speed for MoS₂",
    text: "Increasing centrifugation speed from 1,500 to 4,500 rpm reduced the recovered concentration from 1.65 to 0.49 g/L. The estimated mean flake size fell from 286 to 132 nm. Higher speeds gave smaller flakes at the cost of recovered concentration.",
    url: "https://www.saeedarabha.com/metrology",
    source: "Characterization methods",
  },
  {
    title: "XPS peak fitting in Python",
    text: "I compared X-ray photoelectron spectra from reference samples and materials processed in air and helium. My Python workflow applied energy referencing and Shirley background subtraction, constrained overlapping peaks such as S 2s and Mo 3d, and exported fitted component areas for comparison.",
    url: "/metrology#check-the-chemistry",
    source: "Materials characterization",
  },
  {
    title: "Modeling graphene layer separation",
    text: "I led a study comparing sliding, edge peeling and pulling graphene sheets straight apart. Using steered molecular dynamics and potential-of-mean-force analysis, I found lower separation resistance for sliding and peeling in the simulated configurations.",
    url: "https://doi.org/10.1021/acsanm.6c01419",
    source: "First-author paper",
  },
  {
    title: "Graphene recovery across three passes",
    text: "Doubling the collection volume roughly halved the measured concentration, so I compared recovered mass as well. Starting with 1 g of graphite, I recovered and reprocessed the sediment between passes. The three compressed-air passes recovered 316 mg of graphene in total (31.6% of the original feed).",
    url: "https://www.saeedarabha.com/R&D-Portfolio",
    source: "R&D portfolio",
  },
  {
    title: "Boron nitride process development",
    text: "In my doctoral work, I tested how gas preheating and operating conditions affected the concentration of boron nitride recovered after exfoliation. Across the nitrogen-based conditions tested, the combined operating changes raised the recovered concentration from about 0.003 to 0.155 g/L. I calibrated the UV–vis measurements for each material by drying and weighing known volumes of suspension.",
    url: "https://www.saeedarabha.com/metrology",
    source: "Thesis measurements",
  },
  {
    title: "Shock-tube experiments",
    text: "I contributed to the experimental investigation and validation of boron nitride exfoliation. At 1.4 MPa driver pressure, our team measured nearly four times the UV–vis absorbance at 350 nm with the tube open at the end compared with the closed configuration.",
    url: "https://doi.org/10.1002/adem.202502168",
    source: "Peer-reviewed study",
  },
];

export const ramanCertification = "mIRage-Raman Main Operator Certification · January 2026";

export function profileToolGroups(skills) {
  const tools = title => skills.find(group => group.Title === title)?.skill.map(([name]) => name) ?? [];
  return [
    {
      title: "Characterization and analysis",
      tools: [...new Set([
        ...tools("Analytical Instrumentation"),
        "XPS",
        ...tools("Coding").filter(name => name === "Python" || name === "MATLAB"),
      ])],
      certification: ramanCertification,
    },
    { title: "Simulation", tools: tools("Simulation") },
    { title: "Mechanical design", tools: tools("Design") },
  ];
}
