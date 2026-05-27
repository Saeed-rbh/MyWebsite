const fs = require("fs");
const path = "src/components/Popup/Popup.jsx";
let content = fs.readFileSync(path, "utf8");

content = content.replace("config: { mass: 1, tension: 220, friction: 26, clamp: false } // Gentler bounce", "config: { mass: 1, tension: 300, friction: 24, clamp: false } // Snappy, pro spring");

fs.writeFileSync(path, content);
console.log("Popup spring updated!");

