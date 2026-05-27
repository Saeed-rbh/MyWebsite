const fs = require("fs");
const path = "src/pages/Home/Home.jsx";
let content = fs.readFileSync(path, "utf8");

const startStr = "  const handleWordClick = (word, e) => {";
const endStr = "  useEffect(() => {";

const startIndex = content.indexOf(startStr);
const endIndex = content.lastIndexOf("  };", content.indexOf(endStr)) + 4; // match the closing brace of handleWordClick

const newHandleWordClick = `  const handleWordClick = (word, e) => {
    const normalizedWord = word.replace(/-/g, " ").toLowerCase();

    if (e && e.currentTarget) {
      setOriginRect(e.currentTarget.getBoundingClientRect());
    }

    if (normalizedWord.includes("materials scientist")) {
      setPopupContent({
        title: "Materials Scientist & Researcher",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Bridging the gap between processing, structure, and performance.</strong>
              </p>
              <p className={styles.text}>
                My research connects experimental process development with deep materials characterization and computational modeling. I investigate how processing conditions dictate material quality, thermal transport, and mechanical behavior.
              </p>
            </div>
            <h3 className={\`\${styles.miniTitle} \${styles.animateEnter} \${styles.delay2}\`}>Core Capabilities</h3>
            <div className={\`\${styles.glassGrid} \${styles.animateEnter} \${styles.delay2}\`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Advanced Characterization</span>
                <p className={styles.cardText}>Certified operator for mIRage-Raman. Extensive expertise in XPS, TEM/STEM, SEM, AFM, and UV-Vis spectroscopy.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Multiscale Modeling</span>
                <p className={styles.cardText}>Leveraging Molecular Dynamics (MD), CFD (COMSOL), and machine-learning interatomic potentials to predict material behavior.</p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsScientist";
    }

    if (normalizedWord.includes("2d nanomaterials")) {
      setPopupContent({
        title: "2D Nanomaterials (Graphene, h-BN, MoS₂)",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>The foundation of next-generation technology.</strong>
              </p>
              <p className={styles.text}>
                Two-dimensional nanomaterials exhibit extraordinary thermal, electrical, and mechanical properties. My work focuses on scalable production and integration of Graphene, hexagonal Boron Nitride (h-BN), and Molybdenum Disulfide (MoS₂).
              </p>
            </div>
            <h3 className={\`\${styles.miniTitle} \${styles.animateEnter} \${styles.delay2}\`}>Industrial Applications</h3>
            <div className={\`\${styles.timelineList} \${styles.animateEnter} \${styles.delay2}\`}>
              <div className={\`\${styles.timelineItem} \${styles.highlightItem}\`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Nano-Enhanced Composites</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Improving the thermal and mechanical resilience of industrial polymers and coatings.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Thermal Management</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Developing high-performance nanofluids and thermal interface materials for electronics.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "2DNanomaterials";
    }

    if (normalizedWord.includes("heat transfer")) {
      setPopupContent({
        title: "Nano-Enhanced Heat Transfer",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Optimizing thermal pathways at the nanoscale.</strong>
              </p>
              <p className={styles.text}>
                Effective thermal management is a critical bottleneck in modern electronics and energy systems. My research addresses this by engineering nanoscale interfaces to enhance thermal conductance.
              </p>
            </div>
            <h3 className={\`\${styles.miniTitle} \${styles.animateEnter} \${styles.delay2}\`}>Key Contributions</h3>
            <div className={\`\${styles.glassGrid} \${styles.animateEnter} \${styles.delay2}\`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Nanofluid Optimization</span>
                <p className={styles.cardText}>Investigating interfacial thermal conductance between nanoparticles (like TiO₂) and base fluids.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Nonreciprocal Heat Transfer</span>
                <p className={styles.cardText}>Published findings on enabling cold-to-hot heat transfer between nanoparticles.</p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "HeatTransfer";
    }

    if (normalizedWord.includes("materials processing")) {
      setPopupContent({
        title: "Scalable Materials Processing",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>From laboratory synthesis to industrial nanomanufacturing.</strong>
              </p>
              <p className={styles.text}>
                A major hurdle in advanced materials is transitioning from small-batch lab synthesis to high-throughput manufacturing. I specialize in designing and optimizing scalable processes.
              </p>
            </div>
            <h3 className={\`\${styles.miniTitle} \${styles.animateEnter} \${styles.delay2}\`}>Process Optimization</h3>
            <div className={\`\${styles.timelineList} \${styles.animateEnter} \${styles.delay2}\`}>
              <div className={\`\${styles.timelineItem} \${styles.highlightItem}\`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Variable Engineering</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Scaling up production by optimizing gas flow, pressure, temperature, and carrier gas selection.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Yield & Quality Control</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Utilizing multiscale modeling and Python-based data analysis to maximize nanomaterial yield while preserving structural integrity.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsProcessing";
    }

    if (normalizedWord.includes("compressible flow exfoliation")) {
      setPopupContent({
        title: "Compressible Flow Exfoliation (CFE)",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>A paradigm shift in 2D material production.</strong>
              </p>
              <p className={styles.text}>
                Compressible Flow Exfoliation (CFE) is a novel, gas-driven approach designed to mass-produce 2D nanomaterials in a cleaner, faster, and more scalable way than traditional liquid-phase or chemical methods.
              </p>
            </div>
            <h3 className={\`\${styles.miniTitle} \${styles.animateEnter} \${styles.delay2}\`}>How It Works</h3>
            <div className={\`\${styles.glassGrid} \${styles.animateEnter} \${styles.delay2}\`}>
              <div className={styles.glassCard} style={{ gridColumn: "1 / -1" }}>
                <span className={styles.cardTitle}>Supersonic Fluid Dynamics</span>
                <p className={styles.cardText}>By utilizing high-pressure gas flow and shockwaves, CFE physically shears bulk materials (like graphite) into atomically thin sheets (graphene) instantly, without the need for toxic solvents.</p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "CompressibleFlowExfoliation";
    }

    if (normalizedWord.includes("commercialization")) {
      setPopupContent({
        title: "Research Commercialization",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Translating technical research into market value.</strong>
              </p>
              <p className={styles.text}>
                Scientific breakthroughs only matter if they can reach the market. As a Lab2Market Validate & Launch Fellow, I actively explore the commercial potential of advanced materials.
              </p>
            </div>
            <h3 className={\`\${styles.miniTitle} \${styles.animateEnter} \${styles.delay2}\`}>Industry Engagement</h3>
            <div className={\`\${styles.timelineList} \${styles.animateEnter} \${styles.delay2}\`}>
              <div className={\`\${styles.timelineItem} \${styles.highlightItem}\`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Customer Discovery</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Conducted 50+ interviews with stakeholders in manufacturing, composites, and clean tech to understand adoption barriers.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Strategic Positioning</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Refined value propositions and business model assumptions to translate complex technical specs into industry-facing solutions.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "Commercialization";
    }
  };`;

content = content.slice(0, startIndex) + newHandleWordClick + "\n\n" + content.slice(endIndex + 1).trim();
fs.writeFileSync(path, content);
console.log("Replaced successfully!");

