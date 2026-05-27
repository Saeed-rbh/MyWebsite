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

// Inject component before Home definition
content = content.replace("const Home = () => {", iconComponent + "\nconst Home = () => {");

// Replace titles
content = content.replace(/title: "🧪 Materials Scientist"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M10 2v5l-6 11c-.5.9.1 2 1 2h14c.9 0 1.5-1.1 1-2l-6-11V2H10z" /> Materials Scientist</span>`);
content = content.replace(/title: "⚡ 2D Nanomaterials"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" /> 2D Nanomaterials</span>`);
content = content.replace(/title: "🔥 Heat Transfer"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M12 2c0 0-6 7.5-6 12a6 6 0 1 0 12 0c0-4.5-6-12-6-12z" /> Heat Transfer</span>`);
content = content.replace(/title: "⚙️ Materials Processing"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-6c-1.1 0-2 .9-2 2v1.1c-.6.2-1.2.6-1.8 1l-.8-.8c-.8-.8-2-.8-2.8 0l-1.4 1.4c-.8.8-.8 2 0 2.8l.8.8c-.4.6-.8 1.2-1 1.8H2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.1c.2.6.6 1.2 1 1.8l-.8.8c-.8.8-.8 2 0-2.8l1.4 1.4c.8.8 2 .8 2.8 0l.8-.8c.6.4 1.2.8 1.8 1V20c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1.1c.6-.2 1.2-.6 1.8-1l.8.8c.8.8 2 .8 2.8 0l1.4-1.4c.8-.8.8-2 0-2.8l-.8-.8c.4-.6.8-1.2 1-1.8H20c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-1.1c-.2-.6-.6-1.2-1-1.8l.8-.8c.8-.8.8-2 0-2.8l-1.4-1.4c-.8-.8-2-.8-2.8 0l-.8.8c-.6-.4-1.2-.8-1.8-1V4c0-1.1-.9-2-2-2h-2z" /> Materials Processing</span>`);
content = content.replace(/title: "🚀 Compressible Flow Exfoliation \\(CFE\\)"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M14 2L9.5 6.5A5.5 5.5 0 0 0 8 13.5l1.5 1.5-4 4-2 2L5 19.5l4-4 1.5 1.5A5.5 5.5 0 0 0 17.5 14.5L22 10V2H14z" /> Compressible Flow Exfoliation (CFE)</span>`);
content = content.replace(/title: "💼 Commercialization"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z" /> Commercialization</span>`);
content = content.replace(/title: "💻 Computational Modeling"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M20 16V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v10H2v2h20v-2h-2z" /> Computational Modeling</span>`);
content = content.replace(/title: "🔬 Experimental Characterization"/g, `title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-1.1 1.1l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z" /> Experimental Characterization</span>`);

fs.writeFileSync(path, content);
console.log("Icons injected successfully!");

