import ReferenceLink from './ReferenceLink';
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { atomsArticle } from '../../data/atomsArticle.mjs';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const illustrations = {
  'what-is-atomistic': {
    title: 'A molecule has two levels of connection.',
    image: 'water-connections',
    alt: 'Five bent water molecules with solid connections within each molecule and dashed teal contacts between neighbouring molecules.',
    steps: [
      {
        eyebrow: 'Intramolecular bond',
        title: 'Within a molecule',
        text: 'One oxygen and two hydrogens form each water molecule. In the explorer, its bent shape is held fixed by the model.',
      },
      {
        eyebrow: 'Intermolecular contact',
        title: 'Between molecules',
        text: 'Neighbouring molecules also interact. The dashed contacts help distinguish those interactions from the solid connections inside H₂O.',
      },
    ],
    caption: 'Terracotta identifies oxygen; ivory identifies hydrogen. The arrangement and dashed contacts are conceptual, not a sampled configuration of liquid water.',
    source: 5,
  },
  'why-simulate': {
    title: 'Change the structure. Match the conditions.',
    image: 'crystal-vacancy',
    alt: 'A complete copper-coloured lattice beside a matching lattice with one vacant site marked by a dashed teal ring.',
    steps: [
      {
        eyebrow: 'Matched baseline',
        title: 'Keep the rules',
        text: 'Use the same interaction model, box and initial temperature in both calculations.',
      },
      {
        eyebrow: 'Controlled perturbation',
        title: 'Change one site',
        text: 'The right-hand structure has one atom removed. Its neighbours now have a different local environment.',
      },
      {
        eyebrow: 'Independent seeds',
        title: 'Compare the same quantity',
        text: 'Measure the same observable over comparable simulated times, then test the result with independent starting velocities.',
      },
    ],
    caption: 'A schematic comparison of two starting structures. It identifies the change being tested; it does not show a measured change in strength or heat transport.',
    source: 8,
  },
  'where-it-helps': {
    title: 'The boundary becomes part of the question.',
    image: 'solid-water-interface',
    alt: 'Water molecules above a solid atomic surface, with teal arrows suggesting exchange across their shared interface.',
    steps: [
      {
        eyebrow: 'Coupled geometry',
        title: 'Include both sides',
        text: 'A solid–water interface needs the solid, the water and the interactions between them in the same model.',
      },
      {
        eyebrow: 'Transport observable',
        title: 'Measure the exchange',
        text: 'To ask about cooling, follow energy transfer and temperature relaxation. Moving atoms alone do not supply an interfacial thermal conductance.',
      },
      {
        eyebrow: 'Continuum handoff',
        title: 'Connect to a larger model',
        text: 'A validated interface property can inform a calculation of heat flow across a component.',
      },
    ],
    caption: 'A conceptual interface. The arrows indicate the idea of exchange, not calculated paths, rates or directions of heat flow.',
    source: 8,
  },
};

const MD_LOOP_NODES = [
  {
    id: 'coords',
    badge: 'State r(t)',
    title: 'Current positions',
    text: 'Every atom carries its current coordinates and half-step velocity inside the periodic box.',
  },
  {
    id: 'forces',
    badge: 'Slope −∇U',
    title: 'Compute forces',
    text: 'Evaluate the potential energy gradient from neighbours within the interaction cutoff.',
  },
  {
    id: 'integrate',
    badge: 'Δt ~ 0.5–1 fs',
    title: 'Velocity Verlet step',
    text: 'Use F = ma to update velocities at half-step and advance coordinates to t + Δt.',
  },
];

function MdTimestepFigure() {
  const [focus, setFocus] = useState(0);
  const current = MD_LOOP_NODES[focus];

  return (
    <figure className={`${styles.learningDiagram} ${s.storyIllustration} ${s.mdLoopFigure}`} data-story="how-it-works" aria-labelledby="how-it-works-picture-title">
      <header data-graphene-reveal="0">
        <span className={styles.eyebrow}>Numerical integration loop</span>
        <h3 id="how-it-works-picture-title">Each time step turns forces into the next frame.</h3>
      </header>

      <div className={s.mdLoopGrid}>
        <svg viewBox="0 0 560 220" role="img" aria-label="Three-step molecular dynamics integration loop connecting positions, force evaluation, and velocity Verlet updates">
          <defs>
            <marker id="md-arc-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M1 1L7 4L1 7" fill="none" stroke="#8bc6bd" strokeWidth="1.5" />
            </marker>
          </defs>

          <path d="M174 88H210" stroke="#8bc6bd" strokeWidth="1.6" markerEnd="url(#md-arc-arrow)" />
          <path d="M366 88H402" stroke="#8bc6bd" strokeWidth="1.6" markerEnd="url(#md-arc-arrow)" />
          <path d="M474 142V186H94V146" fill="none" stroke="#d49d81" strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#md-arc-arrow)" />
          <rect x="206" y="176" width="148" height="20" rx="10" fill="#18130f" />
          <text x="280" y="190" textAnchor="middle" fill="#d49d81" fontSize="9.5" letterSpacing=".8">
            REPEAT EVERY Δt
          </text>

          {[
            { x: 16, y: 36, idx: 0, accent: '#e9b594', eq: 'r(t), v(t)' },
            { x: 212, y: 36, idx: 1, accent: '#8bc6bd', eq: 'F = −∇U(r)' },
            { x: 408, y: 36, idx: 2, accent: '#e9b594', eq: 'r(t + Δt)' },
          ].map(card => {
            const item = MD_LOOP_NODES[card.idx];
            const active = focus === card.idx;
            return (
              <g key={item.id} onClick={() => setFocus(card.idx)} style={{ cursor: 'pointer' }}>
                <rect
                  x={card.x}
                  y={card.y}
                  width="152"
                  height="104"
                  rx="10"
                  fill={active ? '#2b2017' : '#191410'}
                  stroke={active ? card.accent : '#d49d8145'}
                  strokeWidth={active ? 1.8 : 1}
                />
                <text x={card.x + 14} y={card.y + 24} fill={card.accent} fontSize="9.5" letterSpacing="1">
                  0{card.idx + 1} · {item.badge}
                </text>
                <text x={card.x + 14} y={card.y + 52} fill="#f4e8dc" fontSize="15" fontFamily="DM Serif Display, serif">
                  {item.title}
                </text>
                <text x={card.x + 14} y={card.y + 82} fill="#c4b3a3" fontSize="11.5">
                  {card.eq}
                </text>
              </g>
            );
          })}
        </svg>

        <div className={s.mdLoopAside}>
          <div className={s.mdLoopPills} role="group" aria-label="Select timestep stage">
            {MD_LOOP_NODES.map((node, idx) => (
              <button key={node.id} type="button" aria-pressed={focus === idx} onClick={() => setFocus(idx)}>
                0{idx + 1} · {node.title}
              </button>
            ))}
          </div>
          <p className={s.mdLoopDetail} aria-live="polite">
            <strong>{current.badge}:</strong> {current.text}
          </p>
        </div>
      </div>

      <figcaption>
        Classical molecular dynamics advances by integrating Newton’s equations at each small time step rather than following scripted paths. <ReferenceLink number={3} aria-label={`Reference 3: ${atomsArticle.sources[2].label}`} />
      </figcaption>
    </figure>
  );
}

export function AtomisticIllustration({ chapter, onInspect }) {
  if (chapter === 'how-it-works') return <MdTimestepFigure />;

  const item = illustrations[chapter];
  if (!item) return null;

  const src = `/images/atoms/${item.image}.jpg`;
  const handleInspect = () => {
    onInspect?.({
      src,
      dimensions: [1536, 1024],
      eyebrow: `Conceptual diagram · ${item.steps[0].eyebrow}`,
      title: item.title,
      alt: item.alt,
      caption: item.caption,
      isPaperFigure: false,
    });
  };

  return (
    <figure className={`${styles.learningDiagram} ${s.storyIllustration}`} data-story={chapter} aria-labelledby={`${chapter}-picture-title`}>
      <header data-graphene-reveal="0">
        <span className={styles.eyebrow}>Picture the idea</span>
        <h3 id={`${chapter}-picture-title`}>{item.title}</h3>
      </header>

      <div className={s.storyIllustrationBody}>
        <button
          type="button"
          className={s.illustrationButton}
          data-graphene-reveal="0"
          onClick={handleInspect}
          aria-label={`Inspect illustration at full size: ${item.title}`}
        >
          <img src={src} width="1536" height="1024" alt={item.alt} loading="lazy" decoding="async" />
        </button>

        <ol className={styles.imageExplanations}>
          {item.steps.map((step, index) => (
            <li key={step.title} data-graphene-reveal={index + 1}>
              <span className={styles.eyebrow}>{step.eyebrow}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <figcaption className={s.figureFooterBar}>
        <span>
          {item.caption}{' '}
          <ReferenceLink number={item.source + 1} aria-label={`Reference ${item.source + 1}: ${atomsArticle.sources[item.source].label}`} />
        </span>
        <button type="button" className={s.inspectTrigger} onClick={handleInspect}>
          Inspect illustration ⤢
        </button>
      </figcaption>
    </figure>
  );
}

const workflow = [
  {
    title: 'Build the system',
    short: 'Build',
    label: 'Positions + boundaries',
    detail: 'Choose the atoms, their initial arrangement, and the simulation box. Boundaries specify whether the model has a free surface or repeats in space.',
    example: 'Match the box, particle count, and periodic boundaries between your baseline model and the modified case you want to isolate.',
    output: 'A starting configuration',
    source: 0,
  },
  {
    title: 'Define the interactions',
    short: 'Define',
    label: 'Energy → forces',
    detail: 'An interaction model assigns energy to an arrangement. Forces point down the energy gradient; they can attract or repel atoms. The choice must fit the material and the process.',
    example: 'Use the same potential parameters unless you are explicitly testing how an interaction ingredient—such as partial charges—changes the physics.',
    output: 'Forces for the current configuration',
    source: 1,
  },
  {
    title: 'Follow the motion',
    short: 'Evolve',
    label: 'Forces → motion → new forces',
    detail: 'In molecular dynamics, force divided by mass gives acceleration. Advance positions and velocities over a small time step, calculate the forces again, and repeat.',
    output: 'A trajectory through time',
    example: 'Use the same time step and record configurations at comparable simulated times. Playback speed only changes how quickly you watch.',
    source: 2,
  },
  {
    title: 'Measure and validate',
    short: 'Check',
    label: 'Sample → compare → test',
    detail: 'After equilibration, collect measurements and estimate uncertainty. Check the time step, system size, and sampling, then compare with independent evidence.',
    output: 'A property with a stated uncertainty',
    example: 'Average across independent seeds or radial water shells, then benchmark trends against continuum theory or experiment.',
    source: 8,
  },
];

function WorkflowIllustration({ step }) {
  return (
    <svg
      viewBox="0 0 400 230"
      role="img"
      aria-label={[
        'Atomic positions inside a repeating simulation box, with repeated atoms outside the edges.',
        'Two interacting atoms with arrows illustrating forces along the line between them.',
        'Successive positions along an illustrative atomic trajectory, with the current position highlighted.',
        'Three groups of configurations representing independent samples for comparison.',
      ][step]}
    >
      {step === 0 && (
        <>
          <rect x="95" y="35" width="210" height="160" rx="2" fill="none" stroke="#ac8b70" strokeDasharray="5 6" />
          {[-1, 0, 1, 2, 3, 4, 5].flatMap(col =>
            [0, 1, 2, 3].map(row => (
              <circle
                key={`${col}-${row}`}
                cx={116 + col * 42}
                cy={55 + row * 40}
                r="6"
                fill="#d6a17e"
                opacity={col < 0 || col > 4 ? 0.2 : 1}
              />
            ))
          )}
        </>
      )}
      {step === 1 && (
        <>
          <path d="M100 115H300" stroke="#8bc6bd" strokeDasharray="3 5" strokeOpacity=".5" />
          <circle cx="112" cy="115" r="20" fill="#d6a17e" />
          <circle cx="288" cy="115" r="20" fill="#d6a17e" />
          <path d="M145 115H188L178 107M188 115L178 123M255 115H212L222 107M212 115L222 123" fill="none" stroke="#8bc6bd" strokeWidth="2" />
          <circle cx="112" cy="115" r="38" fill="none" stroke="#d6a17e" strokeOpacity=".15" />
          <circle cx="288" cy="115" r="38" fill="none" stroke="#d6a17e" strokeOpacity=".15" />
        </>
      )}
      {step === 2 && (
        <>
          <path d="M45 160C80 160 90 70 140 77S208 170 250 131S302 65 355 80" fill="none" stroke="#aa8468" strokeWidth="1.5" strokeDasharray="4 6" />
          {[
            [45, 160],
            [91, 108],
            [140, 77],
            [194, 114],
            [250, 131],
            [300, 85],
            [355, 80],
          ].map(([x, y], index) => (
            <circle key={x} cx={x} cy={y} r={index === 6 ? 10 : 5} fill={index === 6 ? '#8bc6bd' : '#d6a17e'} opacity={0.25 + index * 0.125} />
          ))}
          <path d="M50 198H350L342 193M350 198L342 203" fill="none" stroke="#d6a17e" strokeOpacity=".5" />
        </>
      )}
      {step === 3 &&
        [0, 1, 2].map(sample => (
          <g key={sample} transform={`translate(${44 + sample * 113} 65)`}>
            <rect width="86" height="96" fill="none" stroke="#a88970" strokeOpacity=".4" />
            {[0, 1, 2].flatMap(row =>
              [0, 1, 2].map(col => (
                <circle
                  key={`${row}-${col}`}
                  cx={16 + col * 26 + ((row + sample) % 2) * 3}
                  cy={18 + row * 29 + ((col + sample) % 2) * 4}
                  r="4.5"
                  fill={sample === 2 ? '#8bc6bd' : '#d6a17e'}
                />
              ))
            )}
            <path d="M20 113H66" stroke="#d6a17e" strokeOpacity=".5" />
          </g>
        ))}
    </svg>
  );
}

export function SimulationWorkflow() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = workflow[active];
  return (
    <div className={s.workflow} data-graphene-reveal="0">
      <header className={s.workflowHeading}>
        <span className={styles.eyebrow}>Follow the calculation</span>
        <h3>
          From a starting structure
          <br />
          to a result you can test.
        </h3>
        <p>Choose a step to see what the computer needs and what it produces.</p>
      </header>
      <div className={s.workflowSteps} role="group" aria-label="Explore the simulation workflow">
        {workflow.map((item, index) => (
          <button
            type="button"
            key={item.short}
            aria-pressed={active === index}
            aria-controls="workflow-explanation"
            onClick={() => setActive(index)}
          >
            <span>0{index + 1}</span>
            {item.short}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        id="workflow-explanation"
        className={s.workflowBody}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
      >
        <figure>
          <WorkflowIllustration step={active} />
          <figcaption>
            {step.label}
            <span>Conceptual illustration</span>
          </figcaption>
        </figure>
        <div>
          <span className={styles.eyebrow}>Step 0{active + 1} / A molecular-dynamics workflow</span>
          <h3 aria-live="polite">{step.title}</h3>
          <p>{step.detail}</p>
          <p className={s.workflowOutput}>
            <strong>In a controlled comparison</strong>
            {step.example}
          </p>
          <p className={s.workflowResult}>
            <strong>Output:</strong> {step.output}
          </p>
          <a href={atomsArticle.sources[step.source].url} target="_blank" rel="noopener noreferrer">
            Read documentation for this step ↗
          </a>
        </div>
      </motion.div>
      <p className={s.sectionNote}>
        This sequence describes molecular dynamics. Energy minimisation, Monte Carlo, and electronic-structure calculations can answer other questions or supply parts of the same workflow. Preparation and validation may send you back to an earlier step.
      </p>
    </div>
  );
}
