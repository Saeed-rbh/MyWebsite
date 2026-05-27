const fs = require("fs");

const logoPath = "src/components/Header/Logo.jsx";
let logoContent = fs.readFileSync(logoPath, "utf8");
logoContent = logoContent.replace(/pathLength="1"/g, "");
logoContent = logoContent.replace(/stroke-dasharray: 1;/g, "stroke-dasharray: 2500;");
logoContent = logoContent.replace(/stroke-dashoffset: 1;/g, "stroke-dashoffset: 2500;");
fs.writeFileSync(logoPath, logoContent);

const svgPath = "src/pages/Home/SvgComponent.jsx";
let svgContent = fs.readFileSync(svgPath, "utf8");
svgContent = svgContent.replace(/pathLength="1"/g, "");
svgContent = svgContent.replace(/stroke-dasharray: 1;/g, "stroke-dasharray: 500;");
svgContent = svgContent.replace(/stroke-dashoffset: 1;/g, "stroke-dashoffset: 500;");
fs.writeFileSync(svgPath, svgContent);

console.log("Fixed!");

