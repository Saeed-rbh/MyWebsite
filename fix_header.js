const fs = require("fs");
const path = "src/components/Header/Header.jsx";
let content = fs.readFileSync(path, "utf8");

content = content.replace(
  /initial=\{\{ opacity: 0, y: 10 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*transition=\{\{ duration: 0\.5, delay: 0\.5 \}\}/g,
  `initial={{ opacity: 0, y: -30 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.3 }}`
);

fs.writeFileSync(path, content);
console.log("Header animation updated!");

