import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";
import SvgComponent from "./SvgComponent";
import AnimatedWord from "./AnimatedWord";
import styles from "./MainText.module.css";

const MainText = ({ MenuHide, delay, onWordClick }) => {
  const [words, setWords] = useState([]);
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  const { homeData } = useSelector((state) => state.data);

  useEffect(() => {
    const rawText = homeData?.list?.[0]?.text ||
      "Situated at the <PICSSL-Lab> at <York-University>, I apply my <mechanical-engineering> prowess to delve into the complexities of nanomaterials and molecular phenomena. My professional focus lies in <2D-Nanomaterials>, <Molecular-Dynamics>, and <Heat-Transfer>. The success of my research approach significantly stems from interdisciplinary <collaborations> that amplify the potential of my innovative explorations.";

    // Parse logic:
    // Split the text alternating between special tags and standard text segments
    const parts = rawText.split(/(\$\([^)]+\)|<[^>]+>)/g);
    const processedTokens = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      const isTag = (part.startsWith("<") && part.includes(">")) || (part.startsWith("$(") && part.includes(")"));

      if (isTag) {
        // Tag found, add as tag token
        processedTokens.push({ type: "tag", content: part });
      } else {
        let text = part;
        // If the preceding token was a tag, check if this text segment starts with non-whitespace characters (like punctuation)
        if (processedTokens.length > 0 && processedTokens[processedTokens.length - 1].type === "tag") {
          const match = text.match(/^([^\s]+)/);
          if (match) {
            const punctuation = match[1];
            processedTokens[processedTokens.length - 1].content += punctuation;
            text = text.slice(punctuation.length);
          }
        }

        // Now split the remaining text by whitespace
        const words = text.split(/\s+/).filter(w => w);
        for (const word of words) {
          processedTokens.push({ type: "text", content: word });
        }
      }
    }

    // Normalize tokens for AnimatedWord (convert $(...) tags to <...> tags for compatibility)
    const processedWords = processedTokens.map(t => {
      let token = t.content;
      if (token.startsWith("$(") && token.includes(")")) {
        const endIdx = token.indexOf(")");
        const content = token.slice(2, endIdx);
        const punctuation = token.slice(endIdx + 1);
        return `<${content.replace(/\s+/g, "-")}>${punctuation}`;
      }
      return token;
    });

    setWords(processedWords);
  }, [homeData]);

  return (
    <animated.div style={springProps} className={styles.container}>
      <SvgComponent />
      <p className={styles.paragraph}>
        {words.map((word, index) => (
          <AnimatedWord
            key={index}
            word={word}
            index={index}
            MenuHide={MenuHide}
            length={words.length}
            animateFrom={MenuHide === 1 ? "#d49d81" : "white"}
            animateTo={MenuHide === 1 ? "white" : "#d49d81"}
            onClick={onWordClick}
          />
        ))}
      </p>
    </animated.div>
  );
};

export default MainText;
