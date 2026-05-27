const fs = require("fs");
const path = "src/pages/Home/Home.module.css";
let content = fs.readFileSync(path, "utf8");

const oldAnimations = `/* Animations */
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
}`;

if(content.includes(oldAnimations)) {
    content = content.replace(oldAnimations, newAnimations);
    fs.writeFileSync(path, content);
    console.log("Animations fixed in Home.module.css!");
} else {
    console.log("Could not find exact block. Here is what is there:");
    console.log(content.substring(0, 500));
}

