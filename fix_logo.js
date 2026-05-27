const fs = require("fs");
const path = "src/components/Header/Logo.jsx";
let content = fs.readFileSync(path, "utf8");

content = content.replace("fill: rgba(212, 157, 129, 0.15);", "fill: #d49d81;");
fs.writeFileSync(path, content);
console.log("Updated logo fill color");

