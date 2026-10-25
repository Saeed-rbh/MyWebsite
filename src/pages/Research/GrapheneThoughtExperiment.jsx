import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { buildExtendedLattice } from './grapheneLattice.mjs';
import styles from './GrapheneArticle.module.css';

const choices = ['Graphene', 'Diamond', 'A new element'];
const responses = {
  Graphene: {
    title: 'Exactly. You made graphene.',
    text: 'One honeycomb layer is graphene. The atoms are still carbon; separating the sheets changes the material’s structure, not its chemical identity.',
  },
  Diamond: {
    title: 'Diamond has a different arrangement.',
    text: 'Diamond is carbon too, but its atoms form a three-dimensional network. Peeling graphite leaves the honeycomb sheet intact. Try another answer.',
  },
  'A new element': {
    title: 'The element is still carbon.',
    text: 'Separating layers does not create a different type of atom. You have changed how many sheets are stacked together. Try another answer.',
  },
};
const lattice = buildExtendedLattice(1, 0);
const points = lattice.points.map(({ position: [x, , z] }) => [160 + x * 20 + z * 8, z * 10]);

function CarbonSheet({ y }) {
  return <g transform={`translate(0 ${y})`}>
    {lattice.bonds.map(([a, b]) => <line key={`${a}-${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} stroke="currentColor" strokeWidth="1" />)}
    {points.map(([x, cy], index) => <circle key={index} cx={x} cy={cy} r="2.2" fill="currentColor" />)}
  </g>;
}

export default function GrapheneThoughtExperiment() {
  const [answer, setAnswer] = useState(null);
  const [hint, setHint] = useState(false);
  const reduceMotion = useReducedMotion();
  const correct = answer === 'Graphene';
  const response = answer ? responses[answer] : hint ? {
    title: 'A clue: count the layers.',
    text: 'The honeycomb stays intact. You have changed the number of sheets, not the type of atom.',
  } : {
    title: 'Follow the sheet.',
    text: 'Choose an answer above, then see what changed and what stayed the same.',
  };
  const reset = () => { setAnswer(null); setHint(false); };

  return <section id="graphene-thought-experiment" className={styles.quiz} aria-labelledby="quiz-title">
    <div className={styles.quizIntro} data-graphene-reveal="0">
      <span className={styles.eyebrow}>A quick thought experiment</span>
      <h2 id="quiz-title">You isolate <span className={styles.textAccent}>one sheet.</span><br />What have you made?</h2>
      <p>Imagine peeling a single layer from graphite. Take a moment to name the material you are left with.</p>
      <figure className={styles.quizDiagram}>
        <svg viewBox="0 0 320 190" role="img" aria-label="A single honeycomb sheet lifted away from two stacked carbon layers. Schematic, not to scale.">
          <motion.g animate={{ opacity: correct ? 0.2 : 0.42 }} transition={{ duration: reduceMotion ? 0 : 0.6 }} className={styles.quizStack}>
            <CarbonSheet y={142} /><CarbonSheet y={120} />
          </motion.g>
          <motion.g className={styles.quizSheet} animate={{ y: correct ? -10 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <CarbonSheet y={66} />
          </motion.g>
        </svg>
        <figcaption><span className={styles.quizDiagramDot} aria-hidden="true" />{correct ? 'Same atoms. A single layer. Graphene.' : 'One layer lifted from a graphite stack.'}</figcaption>
      </figure>
    </div>
    <div className={styles.quizInteraction} data-graphene-reveal="1">
      <div className={styles.quizAnswers} role="group" aria-labelledby="quiz-title">
        {choices.map((option, index) => <button type="button" className={styles.quizAnswer} key={option} aria-pressed={answer === option} onClick={() => setAnswer(option)}>
          <span className={styles.quizAnswerIndex} aria-hidden="true">{String.fromCharCode(65 + index)}</span>
          <span>{option}</span>
          <span className={styles.quizAnswerMark} aria-hidden="true">{answer === option ? (correct ? '✓' : '·') : ''}</span>
        </button>)}
      </div>
      <div className={styles.quizResponse} role="status" aria-live="polite" aria-atomic="true" data-answered={answer !== null}>
        <motion.div key={answer || (hint ? 'hint' : 'start')} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.3 }}>
          <h3>{response.title}</h3><p>{response.text}</p>
        </motion.div>
      </div>
      <div className={styles.quizActions}>
        {answer ? <button type="button" onClick={reset}>Start again</button> : <button type="button" aria-pressed={hint} onClick={() => setHint(value => !value)}>{hint ? 'Hide the clue' : 'Need a clue?'}</button>}
        <a href="#graphene-explorer">Try it in the 3D explorer <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
