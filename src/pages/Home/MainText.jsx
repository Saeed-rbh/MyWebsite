import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";
import SvgComponent from "./SvgComponent";
import AnimatedWord from "./AnimatedWord";
import styles from "./MainText.module.css";

const MainText = ({ MenuHide, delay }) => {
  const [words, setWords] = useState([]);
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  const { homeData } = useSelector((state) => state.data);

  useEffect(() => {
    const rawText = homeData?.list?.[0]?.text ||
      "Situated at the <PICSSL-Lab> at <York-University>, I apply my <mechanical-engineering> prowess to delve into the complexities of nanomaterials and molecular phenomena. My professional focus lies in <2D-Nanomaterials>, <Molecular-Dynamics>, and <Heat-Transfer>. The success of my research approach significantly stems from interdisciplinary <collaborations> that amplify the potential of my innovative explorations.";

    // Parse logic:
    // Support both <Word-With-Dash> and $(Word With Space)
    // We want to transform the text into an array of words/tokens.
    // Regex explanation:
    // 1. \$\(([^)]+)\): Matches $(...) capturing the content inside.
    // 2. <([^>]+)>: Matches <...> capturing content inside.
    // 3. \s+: Matches whitespace (splitter).
    // We split by standard delimiters but keep the special tokens intact first?
    // Actually, splitting by regex with capturing groups includes the separators in the result.

    // Strategy:
    // Replace all $(...) with a unified marker that won't be split by space easily yet, OR just split carefully.
    // Better: Split by `( \$\([^)]+\) | <[^>]+> | \s+ )` ?
    // The previous implementation used: `text.split(/( |<[^>]+>)/g).filter((w) => w.trim());`
    // This splits by space or <...>, keeping them because of capturing group.

    // Let's extend the splitting regex:
    const regex = /(\$\([^)]+\)|<[^>]+>|\s+)/g;
    const tokens = rawText.split(regex).filter(w => w && w.trim());

    // Normalize tokens for AnimatedWord
    // AnimatedWord expects:
    // - Plain word: just string
    // - Special word: Starts with < and ends with >, dashes as spaces.
    // We can stick to passing strings to AnimatedWord, but if we use $(...), we should convert it to <...> format 
    // OR update AnimatedWord.
    // Let's convert $(Word With Space) -> <Word-With-Dash> (hacky but keeps AnimatedWord compatible if we strictly replace spaces with dashes)
    // OR better: Update AnimatedWord (Refactor).
    // Let's update MainText to purely parse and let AnimatedWord handle it? 
    // No, AnimatedWord logic is: `isSpecialWord = word.startsWith("<")`.
    // Let's transform $(...) to <...> style for compatibility, BUT we need dashes for spaces in the <...> convention?
    // Wait, the previous code: `displayWord = displayWord.replace(/-/g, " ");`
    // So <York-University> becomes "York University".
    // If we have $(York University), we can convert it to <York-University> to reuse AnimatedWord as is.

    const processedWords = tokens.map(token => {
      if (token.startsWith("$(") && token.endsWith(")")) {
        const content = token.slice(2, -1);
        // Replace spaces with dashes to match <...> style for AnimatedWord compatibility, 
        // verifying AnimatedWord reverses this.
        return `<${content.replace(/\s+/g, '-')}>`;
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
          />
        ))}
      </p>
    </animated.div>
  );
};

export default MainText;
