const fs = require("fs");
const path = "src/pages/Home/Home.module.css";
let content = fs.readFileSync(path, "utf8");

// Remove everything from /* Animations */ to .delay1
const regex = /\/\* Animations \*\/.+?(?=\/\* Stagger Delays \*\/)/s;

const newAnimations = `/* Animations */
@keyframes popupContentEnter {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes popupSlideInRight {
    0% {
        opacity: 0;
        transform: translateX(20px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.animateEnter {
    animation: popupContentEnter 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    opacity: 0;
    will-change: transform, opacity;
}

.animateSlideInRight {
    animation: popupSlideInRight 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    opacity: 0;
    will-change: transform, opacity;
}

`;

content = content.replace(regex, newAnimations);
fs.writeFileSync(path, content);
console.log("CSS fixed successfully!");

