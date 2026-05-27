const fs = require("fs");

// 1. Update CSS
const cssPath = "src/pages/Home/Home.module.css";
let cssContent = fs.readFileSync(cssPath, "utf8");

const oldCss = `/* Animations */
@keyframes staggerFadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animateEnter {
    animation: staggerFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    /* Starts invisible */
}`;

const newCss = `/* Animations */
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

cssContent = cssContent.replace(oldCss, newCss);
fs.writeFileSync(cssPath, cssContent);


// 2. Update JSX highlight boxes
const jsxPath = "src/pages/Home/Home.jsx";
let jsxContent = fs.readFileSync(jsxPath, "utf8");
// Replace `.animateEnter} ${styles.delay3}` with `.animateSlideInRight} ${styles.delay3}` for the highlight boxes
jsxContent = jsxContent.replace(/\{styles\.animateEnter\} \$\{styles\.delay3\}/g, "{styles.animateSlideInRight} ${styles.delay3}");

fs.writeFileSync(jsxPath, jsxContent);
console.log("Animations updated!");

