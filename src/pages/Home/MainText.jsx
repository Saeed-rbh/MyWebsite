import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import AnimatedWord from "./AnimatedWord";
import styles from "./MainText.module.css";

const MainText = ({ onWordClick }) => {
  const { homeData } = useSelector((state) => state.data);

  const tokenize = (rawText) => {
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
        // If the preceding token was a tag, check if this text segment starts with optional whitespace followed by punctuation
        if (processedTokens.length > 0 && processedTokens[processedTokens.length - 1].type === "tag") {
          const match = text.match(/^(\s*)([.,;:!?]+)/);
          if (match) {
            const punctuation = match[2];
            processedTokens[processedTokens.length - 1].content += punctuation;
            text = text.slice(match[0].length);
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

    return processedWords;
  };

  const words = useMemo(() => tokenize(homeData?.list?.[0]?.text ||
    "I connect process decisions with material quality in my R&D work. In my $(graphene and 2D materials) research, I combine $(process development), $(metrology), $(characterization), and $(computational modeling) to understand how processing shapes structure and quality. My work on $(Compressible Flow Exfoliation) explores scalable production, while $(commercialization) connects the research with industry needs."), [homeData]);
  const mobileWords = tokenize("I work across $(2D materials), $(process development), and $(metrology). I combine experiments, $(characterization), and $(computational modeling) to understand how processing affects material structure and quality. I use those findings to improve scalable production and connect research with industry needs.");

  return (
    <div className={styles.container}>
      <p className={`${styles.paragraph} ${styles.desktopParagraph}`}>
        {words.map((word, index) => (
          <AnimatedWord
            key={index}
            word={word}
            onClick={onWordClick}
          />
        ))}
      </p>
      <p className={`${styles.paragraph} ${styles.mobileParagraph}`}>
        {mobileWords.map((word, index) => (
          <AnimatedWord key={index} word={word} onClick={onWordClick} />
        ))}
      </p>
    </div>
  );
};

export default MainText;
