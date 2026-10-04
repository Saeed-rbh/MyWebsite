import React from "react";
import styles from "./Menu.module.css";

const WordReveal = ({ text, delay = 0 }) => (
  <span aria-label={text}>
    {text.split(" ").map((word, index) => (
      <React.Fragment key={`${word}-${index}`}>
        <span className={styles.wordClip} aria-hidden="true" style={{ "--word-delay": `${delay + index * 65}ms`, "--word-index": index }}>
          <span className={styles.wordFace}>{word}</span>
        </span>{index < text.split(" ").length - 1 ? " " : ""}
      </React.Fragment>
    ))}
  </span>
);

export default WordReveal;
