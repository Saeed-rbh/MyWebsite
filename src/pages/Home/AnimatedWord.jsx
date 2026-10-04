import React from "react";
import styles from "./AnimatedWord.module.css";

const AnimatedWord = ({ word, onClick }) => {
  let displayWord = word;
  let punctuation = "";
  let isSpecialWord = false;

  if (word.startsWith("<") || word.startsWith("$(")) {
    const match = word.match(/^([<$].*?>|\$\([^)]+\))(.*)$/);
    if (match) {
      isSpecialWord = true;
      punctuation = match[2];
      displayWord = match[1].startsWith("<")
        ? match[1].slice(1, -1).replace(/-/g, " ")
        : match[1].slice(2, -1);
    }
  }

  return (
    <>
      {isSpecialWord ? (
        <span className={styles.wordWrapper}>
          <button
            className={styles.specialBackground}
            onClick={(event) => onClick?.(displayWord, event)}
            type="button"
            aria-label={`Explore ${displayWord}`}
          >
            <span className={styles.pillText}>{displayWord}</span>
          </button>
          {punctuation}
        </span>
      ) : (
        <span>{displayWord}</span>
      )}{" "}
    </>
  );
};

export default AnimatedWord;
