const fs = require("fs");

// Fix Home delays
const homeCssPath = "src/pages/Home/Home.module.css";
let homeCss = fs.readFileSync(homeCssPath, "utf8");
homeCss = homeCss.replace(".delay1 {\n    animation-delay: 0.1s;\n}", ".delay1 {\n    animation-delay: 0.2s;\n}");
homeCss = homeCss.replace(".delay2 {\n    animation-delay: 0.2s;\n}", ".delay2 {\n    animation-delay: 0.3s;\n}");
homeCss = homeCss.replace(".delay3 {\n    animation-delay: 0.3s;\n}", ".delay3 {\n    animation-delay: 0.4s;\n}");
homeCss = homeCss.replace(".delay4 {\n    animation-delay: 0.4s;\n}", ".delay4 {\n    animation-delay: 0.5s;\n}");
// Just in case of CRLF
homeCss = homeCss.replace(/delay1 \{\s*animation-delay: 0\.1s;\s*\}/, "delay1 { animation-delay: 0.2s; }");
homeCss = homeCss.replace(/delay2 \{\s*animation-delay: 0\.2s;\s*\}/, "delay2 { animation-delay: 0.3s; }");
homeCss = homeCss.replace(/delay3 \{\s*animation-delay: 0\.3s;\s*\}/, "delay3 { animation-delay: 0.4s; }");
homeCss = homeCss.replace(/delay4 \{\s*animation-delay: 0\.4s;\s*\}/, "delay4 { animation-delay: 0.5s; }");

fs.writeFileSync(homeCssPath, homeCss);

// Fix Popup delay
const popupCssPath = "src/components/Popup/Popup.module.css";
let popupCss = fs.readFileSync(popupCssPath, "utf8");
popupCss = popupCss.replace("animation-delay: 0.1s;", "animation-delay: 0.15s;");
fs.writeFileSync(popupCssPath, popupCss);

console.log("Delays fixed!");

