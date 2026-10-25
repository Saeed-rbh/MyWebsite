import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const choices = [
  { id: 'matched', text: 'With and without a vacancy, at the same initial temperature', title: 'The structure is the intended change.', feedback: 'That is a useful starting comparison. Match the interaction model, box and sampling too, then repeat with independent starting velocities. A claim about heat transport would still need a suitable thermal measurement.' },
  { id: 'temperature', text: 'A cold complete lattice and a warmer defective lattice', title: 'Two things changed at once.', feedback: 'Both temperature and structure could affect the motion. Match the initial temperature before asking what the vacancy changes.' },
  { id: 'playback', text: 'The same trajectory at two playback speeds', title: 'The viewing speed changed.', feedback: 'Playback changes how quickly you watch the calculation. It does not change the physical time step, initial temperature or atomic structure. These are two views of the same calculation.' },
];

function ComparisonDiagram({ answer }) {
  const playback = answer === 'playback';
  const temperature = answer === 'temperature';
  return <figure className={`${styles.quizDiagram} ${s.comparisonDiagram}`}>
    <svg viewBox="0 0 360 190" role="img" aria-label={playback ? 'Two identical lattice diagrams shown at different playback speeds.' : temperature ? 'A complete lattice at initial temperature 0.03 and a lattice with a vacancy at 0.16: two variables change.' : 'Matched lattice diagrams at the same initial temperature; the right-hand diagram has one vacant site.'}>
      {[0, 1].map(side => <g key={side} transform={`translate(${20 + side * 185} 18)`}>
        <rect x="-9" y="-8" width="144" height="128" rx="8" fill="#d49d8107" stroke={answer === 'matched' ? '#81b9b1' : '#d49d8140'}/>
        {[0, 1, 2, 3].flatMap(row => [0, 1, 2, 3].map(col => {
          const vacant = side === 1 && !playback && row === 2 && col === 1;
          return <circle key={`${row}-${col}`} cx={10 + col * 30 + (row % 2) * 10} cy={10 + row * 29} r={vacant ? 9 : 5.5} fill={vacant ? 'none' : temperature && side ? '#e4a281' : '#d6a17e'} stroke={vacant ? '#8bc6bd' : 'none'} strokeWidth="1.3" strokeDasharray={vacant ? '3 3' : undefined}/>;
        }))}
        <text x="63" y="142" textAnchor="middle">{playback ? `${side ? '2×' : '1×'} playback` : side ? 'One vacant site' : 'Complete lattice'}</text>
        <text x="63" y="160" textAnchor="middle" className={s.comparisonTemperature}>T* = {temperature ? side ? '0.16' : '0.03' : '0.08'}</text>
      </g>)}
    </svg>
    <figcaption><span className={styles.quizDiagramDot} aria-hidden="true"/>{playback ? 'Same calculation, different viewing speed.' : temperature ? 'Temperature and structure both change.' : 'Same initial temperature. One changed site.'} Schematic.</figcaption>
  </figure>;
}

export default function AtomisticThoughtExperiment({ onReturn }) {
  const [answer, setAnswer] = useState(null);
  const [hint, setHint] = useState(false);
  const reduceMotion = useReducedMotion();
  const chosen = choices.find(choice => choice.id === answer);
  const response = chosen || (hint ? { title: 'Count what changed.', feedback: 'To test a vacancy, change the structure while keeping the relevant starting conditions matched. Playback speed only changes the display.' } : { title: 'What would make the comparison fair?', feedback: 'Choose an answer and watch the two starting models. Which difference would you be able to explain?' });
  return <section id="atoms-thought-experiment" className={styles.quiz} aria-labelledby="atoms-quiz-title">
    <div className={styles.quizIntro} data-graphene-reveal="0"><span className={styles.eyebrow}>A quick thought experiment</span><h2 id="atoms-quiz-title">Which comparison tests <span className={styles.textAccent}>the vacancy’s effect?</span></h2><p>You have seen the atoms move. Now choose a comparison that could help explain a difference.</p><ComparisonDiagram answer={answer}/></div>
    <div className={styles.quizInteraction} data-graphene-reveal="1">
      <div className={styles.quizAnswers} role="group" aria-labelledby="atoms-quiz-title">{choices.map((choice,index) => <button type="button" className={styles.quizAnswer} key={choice.id} aria-pressed={answer === choice.id} onClick={() => setAnswer(choice.id)}><span className={styles.quizAnswerIndex} aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{choice.text}</span><span className={styles.quizAnswerMark} aria-hidden="true">{answer === choice.id ? answer === 'matched' ? '✓' : '·' : ''}</span></button>)}</div>
      <div className={styles.quizResponse} role="status" aria-live="polite" aria-atomic="true" data-answered={answer !== null}><motion.div key={answer || (hint ? 'hint' : 'start')} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.3 }}><h3>{response.title}</h3><p>{response.feedback}</p></motion.div></div>
      <div className={styles.quizActions}>{answer ? <button type="button" onClick={() => { setAnswer(null); setHint(false); }}>Start again</button> : <button type="button" aria-pressed={hint} onClick={() => setHint(value => !value)}>{hint ? 'Hide the clue' : 'Need a clue?'}</button>}<a href="#atoms-explorer" onClick={onReturn}>Try it in the simulation lab <span aria-hidden="true">↗</span></a></div>
    </div>
  </section>;
}
