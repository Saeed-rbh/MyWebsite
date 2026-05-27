const fs = require("fs");
const path = "src/pages/Home/AnimatedWord.jsx";
let content = fs.readFileSync(path, "utf8");

const newStyle = `  const specialBackground = {
    position: "relative",
    padding: "0 10px 2px",
    borderRadius: "20px",
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    borderBottom: "2px solid rgba(212, 157, 129, 0.6)",
    boxShadow: "0 4px 6px -4px rgba(212, 157, 129, 0.4)",
    transition: "all 0.3s ease-in-out"
  };`;

content = content.replace(/const specialBackground = \{[\s\S]*?verticalAlign: "middle",\r?\n  \};/, newStyle);

fs.writeFileSync(path, content);
console.log("Added glowing underline to AnimatedWord.jsx");

