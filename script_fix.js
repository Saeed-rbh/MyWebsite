const fs = require("fs");
const path = "src/pages/Home/Home.jsx";
let content = fs.readFileSync(path, "utf8");

const iconComponent = `
const AnimatedPopupIcon = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    style={{ overflow: "visible", display: "inline-block", verticalAlign: "middle", marginRight: "10px", marginTop: "-4px" }}
  >
    <defs>
      <style>
        {\`
          .popup-animated-icon {
            fill: transparent;
            stroke: #d49d81;
            stroke-width: 1.5px;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: drawPopupIcon 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          }
          @keyframes drawPopupIcon {
            0%, 10% {
              stroke-dashoffset: 200;
              fill: transparent;
              stroke: #d49d81;
            }
            50%, 70% {
              stroke-dashoffset: 0;
              fill: transparent;
              stroke: #d49d81;
            }
            100% {
              stroke-dashoffset: 0;
              fill: rgba(212, 157, 129, 0.3);
              stroke: #fff;
            }
          }
        \`}
      </style>
    </defs>
    <path className="popup-animated-icon" d={d} />
  </svg>
);
`;

if (!content.includes("const AnimatedPopupIcon")) {
  content = content.replace("const HomePage = () => {", iconComponent + "\nconst HomePage = () => {");
}

content = content.replace(/title: "🚀 Compressible Flow Exfoliation \(CFE\)"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M14 2L9.5 6.5A5.5 5.5 0 0 0 8 13.5l1.5 1.5-4 4-2 2L5 19.5l4-4 1.5 1.5A5.5 5.5 0 0 0 17.5 14.5L22 10V2H14z" /> Compressible Flow Exfoliation (CFE)</span>`);

fs.writeFileSync(path, content);
console.log("Fixed missing component and CFE!");

