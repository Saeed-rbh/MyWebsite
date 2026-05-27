const fs = require("fs");
const path = "src/pages/Home/AnimatedWord.jsx";
let content = fs.readFileSync(path, "utf8");

if (!content.includes("AnimatedWord.module.css")) {
    content = content.replace(
        `import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";`,
        `import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";\nimport styles from "./AnimatedWord.module.css";`
    );
}

const oldJSX = `<animated.div
          ref={hoverRef}
          style={{ ...specialBackground, cursor: "pointer", ...hoverStyle }}
          onClick={(e) => onClick && onClick(displayWord, e)}
        >
          <div style={innerBackground}></div>
          <animated.span style={{ ...wordSpring, ...textStyle }}>
            {displayWord}
          </animated.span>
        </animated.div>`;

const newJSX = `<span className={styles.wordWrapper}>
          <animated.div
            ref={hoverRef}
            style={{ ...specialBackground, cursor: "pointer", ...hoverStyle }}
            onClick={(e) => onClick && onClick(displayWord, e)}
          >
            <div style={innerBackground}></div>
            <animated.span style={{ ...wordSpring, ...textStyle }}>
              {displayWord}
            </animated.span>
          </animated.div>
          <span className={styles.tooltip}>Explore!</span>
        </span>`;

content = content.replace(oldJSX, newJSX);
fs.writeFileSync(path, content);
console.log("AnimatedWord updated with tooltip!");

