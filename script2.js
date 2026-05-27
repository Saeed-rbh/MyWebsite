const fs = require("fs");
const path = "src/pages/Home/Home.jsx";
let content = fs.readFileSync(path, "utf8");

const targetPoint = "    if (normalizedWord.includes(\"computational modeling\")) {";

const newBlock = `    if (normalizedWord.includes("experimental characterization")) {
      setPopupContent({
        title: "🔬 Experimental Characterization",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={\`\${styles.animateEnter} \${styles.delay1}\`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>You cannot improve what you cannot precisely measure.</strong>
              </p>
              <p className={styles.text}>
                Experimental characterization is the process of peering into the atomic structure of a material to understand exactly why it behaves the way it does. My expertise spans a comprehensive suite of advanced techniques, including XPS, TEM/STEM, SEM, AFM, and UV-Vis spectroscopy.
              </p>
              <p className={styles.text}>
                By leveraging these tools, I am able to bridge the gap between process development and material performance, directly correlating manufacturing conditions with structural quality, chemical composition, and morphological defects.
              </p>
            </div>

            <div className={\`\${styles.animateEnter} \${styles.delay3}\`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Advanced Spectroscopy 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I am an officially certified Main Operator for the state-of-the-art mIRage-Raman system (Photothermal Spectroscopy Corp) at York University, enabling me to conduct highly advanced sub-micron IR and Raman spectroscopy.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "ExperimentalCharacterization";
    }

`;

content = content.replace(targetPoint, newBlock + targetPoint);
fs.writeFileSync(path, content);
console.log("Injected Experimental Characterization successfully!");

