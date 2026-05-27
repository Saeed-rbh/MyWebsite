const fs = require("fs");

// 1. Revert Popup.jsx
const popupPath = "src/components/Popup/Popup.jsx";
let popupContent = fs.readFileSync(popupPath, "utf8");
popupContent = popupContent.replace("config: { mass: 1, tension: 300, friction: 24, clamp: false } // Snappy, pro spring", "config: { mass: 1, tension: 220, friction: 26, clamp: false } // Gentler bounce");
fs.writeFileSync(popupPath, popupContent);

// 2. Make Home.module.css clean
const cssPath = "src/pages/Home/Home.module.css";
let cssContent = fs.readFileSync(cssPath, "utf8");

const oldCss = `/* Animations */
@keyframes popupContentEnter {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.98) rotateX(-5deg);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg);
    }
}

@keyframes popupSlideInRight {
    0% {
        opacity: 0;
        transform: translateX(30px) scale(0.98);
    }
    100% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

.animateEnter {
    animation: popupContentEnter 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
    will-change: transform, opacity;
    transform-origin: center top;
}

.animateSlideInRight {
    animation: popupSlideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
    will-change: transform, opacity;
}`;

const newCss = `/* Animations */
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
}`;

cssContent = cssContent.replace(oldCss, newCss);
fs.writeFileSync(cssPath, cssContent);
console.log("Animations cleaned up!");

