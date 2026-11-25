import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const SCENARIOS = {
  water: {
    id: 'water',
    tabLabel: 'Water & electrostatics',
    system: 'water',
    questionLead: 'Which comparison tests',
    questionAccent: 'how charges shape water motion?',
    intro: 'You want to know whether electrostatic attraction between partial charges controls how molecules stick and cool together.',
    clue: 'Hold temperature, box size, and Lennard–Jones cores steady—then isolate only the electrostatic charges. Changing playback speed does not alter the physics.',
    choices: [
      {
        id: 'matched',
        text: 'Same starting T & density: full TIP3P charges vs. charges switched off',
        title: 'Only the electrostatic interaction changed.',
        feedback: 'That isolates the effect of Coulomb attractions (just as we tested for TiO₂–water interfaces in Chapter 06). Keep in mind that disabling charges also alters local layering around a solute.',
      },
      {
        id: 'temperature',
        text: 'Cold water with charges vs. hot steam without charges',
        title: 'Two physical variables changed at once.',
        feedback: 'Thermal energy and phase density both changed alongside electrostatics. Match temperature and starting density before drawing a conclusion.',
      },
      {
        id: 'playback',
        text: 'The same 12-molecule trajectory replayed at 0.5× and 2.0× speed',
        title: 'Only the viewing frame rate changed.',
        feedback: 'Playback speed changes how fast you watch the movie—it leaves the force field, Δt timestep, and trajectory identical.',
      },
    ],
    ctaLabel: 'Open the live water lab',
  },
  solid: {
    id: 'solid',
    tabLabel: 'Crystal & vacancy',
    system: 'solid',
    questionLead: 'Which comparison tests',
    questionAccent: 'the vacancy’s effect?',
    intro: 'You have seen atoms vibrate around lattice sites. Choose a comparison that isolates a missing atom.',
    clue: 'To test a vacancy, change the structure while keeping potential, box size, and initial temperature matched.',
    choices: [
      {
        id: 'matched',
        text: 'With and without a vacancy, at the same initial temperature',
        title: 'The structure is the intended change.',
        feedback: 'That is a clean comparison. Match the interaction model, box and sampling too, then repeat with independent starting velocities.',
      },
      {
        id: 'temperature',
        text: 'A cold complete lattice and a warmer defective lattice',
        title: 'Two things changed at once.',
        feedback: 'Both temperature and structure could affect motion. Match initial temperature before asking what the vacancy changes.',
      },
      {
        id: 'playback',
        text: 'The same trajectory at two playback speeds',
        title: 'The viewing speed changed.',
        feedback: 'Playback changes how quickly you watch the calculation. It does not change the physical time step, initial temperature, or atomic structure.',
      },
    ],
    ctaLabel: 'Open the live crystal lab',
  },
};

function WaterComparisonDiagram({ answer }) {
  const playback = answer === 'playback';
  const temperature = answer === 'temperature';
  return (
    <figure className={`${styles.quizDiagram} ${s.comparisonDiagram}`}>
      <svg
        viewBox="0 0 360 190"
        role="img"
        aria-label={
          playback
            ? 'Two identical water boxes viewed at different playback speeds.'
            : temperature
              ? 'Cold charged water vs hot uncharged vapour.'
              : 'Matched temperature water boxes with charges on versus charges switched off.'
        }
      >
        {[0, 1].map(side => (
          <g key={side} transform={`translate(${20 + side * 185} 18)`}>
            <rect
              x="-9"
              y="-8"
              width="144"
              height="128"
              rx="8"
              fill="#d49d8107"
              stroke={answer === 'matched' ? '#81b9b1' : '#d49d8140'}
            />
            {[
              [28, 34],
              [78, 28],
              [52, 74],
              [100, 82],
            ].map(([cx, cy], idx) => (
              <g key={idx}>
                {!(side === 1 && !playback) && idx < 3 && (
                  <line
                    x1={cx}
                    y1={cy}
                    x2={idx === 0 ? 78 : idx === 1 ? 52 : 100}
                    y2={idx === 0 ? 28 : idx === 1 ? 74 : 82}
                    stroke="#89c7c3"
                    strokeDasharray="3 4"
                    strokeWidth="1.2"
                  />
                )}
                <circle cx={cx} cy={cy} r="6" fill={side === 1 && !playback ? '#9ea8a4' : '#d77969'} />
                <circle cx={cx - 8} cy={cy - 7} r="3.4" fill="#eddfcc" />
                <circle cx={cx + 8} cy={cy - 7} r="3.4" fill="#eddfcc" />
              </g>
            ))}
            <text x="63" y="142" textAnchor="middle">
              {playback ? `${side ? '2×' : '0.5×'} playback` : side ? 'Partial q = 0' : 'Charged TIP3P'}
            </text>
            <text x="63" y="160" textAnchor="middle" className={s.comparisonTemperature}>
              T₀ = {temperature ? (side ? '600 K' : '150 K') : '300 K'}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        <span className={styles.quizDiagramDot} aria-hidden="true" />
        {playback
          ? 'Same simulation, different display speed.'
          : temperature
            ? 'Both temperature and charges changed.'
            : 'Matched temperature. Only electrostatic charges changed.'}{' '}
        Schematic.
      </figcaption>
    </figure>
  );
}

function CrystalComparisonDiagram({ answer }) {
  const playback = answer === 'playback';
  const temperature = answer === 'temperature';
  return (
    <figure className={`${styles.quizDiagram} ${s.comparisonDiagram}`}>
      <svg
        viewBox="0 0 360 190"
        role="img"
        aria-label={
          playback
            ? 'Two identical lattice diagrams shown at different playback speeds.'
            : temperature
              ? 'A complete lattice at initial temperature 0.03 and a lattice with a vacancy at 0.16.'
              : 'Matched lattice diagrams at the same initial temperature; the right-hand diagram has one vacant site.'
        }
      >
        {[0, 1].map(side => (
          <g key={side} transform={`translate(${20 + side * 185} 18)`}>
            <rect
              x="-9"
              y="-8"
              width="144"
              height="128"
              rx="8"
              fill="#d49d8107"
              stroke={answer === 'matched' ? '#81b9b1' : '#d49d8140'}
            />
            {[0, 1, 2, 3].flatMap(row =>
              [0, 1, 2, 3].map(col => {
                const vacant = side === 1 && !playback && row === 2 && col === 1;
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={10 + col * 30 + (row % 2) * 10}
                    cy={10 + row * 29}
                    r={vacant ? 9 : 5.5}
                    fill={vacant ? 'none' : temperature && side ? '#e4a281' : '#d6a17e'}
                    stroke={vacant ? '#8bc6bd' : 'none'}
                    strokeWidth="1.3"
                    strokeDasharray={vacant ? '3 3' : undefined}
                  />
                );
              })
            )}
            <text x="63" y="142" textAnchor="middle">
              {playback ? `${side ? '2×' : '1×'} playback` : side ? 'One vacant site' : 'Complete lattice'}
            </text>
            <text x="63" y="160" textAnchor="middle" className={s.comparisonTemperature}>
              T* = {temperature ? (side ? '0.16' : '0.03') : '0.08'}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        <span className={styles.quizDiagramDot} aria-hidden="true" />
        {playback
          ? 'Same calculation, different viewing speed.'
          : temperature
            ? 'Temperature and structure both change.'
            : 'Same initial temperature. One changed site.'}{' '}
        Schematic.
      </figcaption>
    </figure>
  );
}

export default function AtomisticThoughtExperiment({ onTryInLab }) {
  const [scenarioId, setScenarioId] = useState('water');
  const [answer, setAnswer] = useState(null);
  const [hint, setHint] = useState(false);
  const reduceMotion = useReducedMotion();

  const scenario = SCENARIOS[scenarioId];
  const chosen = scenario.choices.find(choice => choice.id === answer);
  const response =
    chosen ||
    (hint
      ? { title: 'Count what changed.', feedback: scenario.clue }
      : {
          title: 'What would make the comparison fair?',
          feedback: 'Choose an answer and inspect the two starting models. Which difference would you actually be able to attribute cleanly?',
        });

  const switchScenario = nextId => {
    setScenarioId(nextId);
    setAnswer(null);
    setHint(false);
  };

  const handleTryInLab = event => {
    event.preventDefault();
    onTryInLab?.(scenario.system);
  };

  return (
    <section id="atoms-thought-experiment" className={styles.quiz} aria-labelledby="atoms-quiz-title">
      <div className={styles.quizIntro} data-graphene-reveal="0">
        <div className={s.quizScenarioPills} role="group" aria-label="Choose comparison scenario">
          {Object.values(SCENARIOS).map(item => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenarioId === item.id}
              onClick={() => switchScenario(item.id)}
            >
              {item.tabLabel}
            </button>
          ))}
        </div>
        <span className={styles.eyebrow}>A quick thought experiment</span>
        <h2 id="atoms-quiz-title">
          {scenario.questionLead} <span className={styles.textAccent}>{scenario.questionAccent}</span>
        </h2>
        <p>{scenario.intro}</p>
        {scenarioId === 'water' ? <WaterComparisonDiagram answer={answer} /> : <CrystalComparisonDiagram answer={answer} />}
      </div>

      <div className={styles.quizInteraction} data-graphene-reveal="1">
        <div className={styles.quizAnswers} role="group" aria-labelledby="atoms-quiz-title">
          {scenario.choices.map((choice, index) => (
            <button
              type="button"
              className={styles.quizAnswer}
              key={choice.id}
              aria-pressed={answer === choice.id}
              onClick={() => setAnswer(choice.id)}
            >
              <span className={styles.quizAnswerIndex} aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{choice.text}</span>
              <span className={styles.quizAnswerMark} aria-hidden="true">
                {answer === choice.id ? (answer === 'matched' ? '✓' : '·') : ''}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.quizResponse} role="status" aria-live="polite" aria-atomic="true" data-answered={answer !== null}>
          <motion.div
            key={`${scenarioId}-${answer || (hint ? 'hint' : 'start')}`}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <h3>{response.title}</h3>
            <p>{response.feedback}</p>
          </motion.div>
        </div>

        <div className={styles.quizActions}>
          {answer ? (
            <button
              type="button"
              onClick={() => {
                setAnswer(null);
                setHint(false);
              }}
            >
              Start again
            </button>
          ) : (
            <button type="button" aria-pressed={hint} onClick={() => setHint(value => !value)}>
              {hint ? 'Hide the clue' : 'Need a clue?'}
            </button>
          )}
          <a href="#atoms-explorer" onClick={handleTryInLab}>
            {scenario.ctaLabel} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </section>
  );
}
