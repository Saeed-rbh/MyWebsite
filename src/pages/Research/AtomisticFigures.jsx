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
      { title: 'Within a molecule', text: 'One oxygen and two hydrogens form each water molecule. In the explorer, its bent shape is held fixed by the model.' },
      { title: 'Between molecules', text: 'Neighbouring molecules also interact. The dashed contacts help distinguish those interactions from the solid connections inside H₂O.' },
    ],
    caption: 'Terracotta identifies oxygen; ivory identifies hydrogen. The arrangement and dashed contacts are conceptual, not a sampled configuration of liquid water.',
    source: 5,
  },
  'why-simulate': {
    title: 'Change the structure. Match the conditions.',
    image: 'crystal-vacancy',
    alt: 'A complete copper-coloured lattice beside a matching lattice with one vacant site marked by a dashed teal ring.',
    steps: [
      { title: 'Keep the rules', text: 'Use the same interaction model, box and initial temperature in both calculations.' },
      { title: 'Change one site', text: 'The right-hand structure has one atom removed. Its neighbours now have a different local environment.' },
      { title: 'Compare the same quantity', text: 'Measure the same observable over comparable simulated times, then test the result with independent starting velocities.' },
    ],
    caption: 'A schematic comparison of two starting structures. It identifies the change being tested; it does not show a measured change in strength or heat transport.',
    source: 8,
  },
  'where-it-helps': {
    title: 'The boundary becomes part of the question.',
    image: 'solid-water-interface',
    alt: 'Water molecules above a solid atomic surface, with teal arrows suggesting exchange across their shared interface.',
    steps: [
      { title: 'Include both sides', text: 'A solid–water interface needs the solid, the water and the interactions between them in the same model.' },
      { title: 'Measure the exchange', text: 'To ask about cooling, follow energy transfer and temperature relaxation. Moving atoms alone do not supply an interfacial thermal conductance.' },
      { title: 'Connect to a larger model', text: 'A validated interface property can inform a calculation of heat flow across a component.' },
    ],
    caption: 'A conceptual interface. The arrows indicate the idea of exchange, not calculated paths, rates or directions of heat flow.',
    source: 8,
  },
};

export function AtomisticIllustration({ chapter }) {
  const item = illustrations[chapter];
  if (!item) return null;
  return <figure className={`${styles.learningDiagram} ${s.storyIllustration}`} data-story={chapter} aria-labelledby={`${chapter}-picture-title`}>
    <header data-graphene-reveal="0"><span className={styles.eyebrow}>Picture the idea</span><h3 id={`${chapter}-picture-title`}>{item.title}</h3></header>
    <div className={s.storyIllustrationBody}>
      <a className={styles.imageLink} data-graphene-reveal="0" href={`/images/atoms/${item.image}.jpg`} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge illustration: ${item.title}`}><img src={`/images/atoms/${item.image}.jpg`} width="1536" height="1024" alt={item.alt} loading="lazy" decoding="async"/><span className={styles.imageHint} aria-hidden="true">View illustration ↗</span></a>
      <ol className={styles.imageExplanations}>{item.steps.map((step,index) => <li key={step.title} data-graphene-reveal={index + 1}><span className={styles.eyebrow}>Follow 0{index + 1}</span><h4>{step.title}</h4><p>{step.text}</p></li>)}</ol>
    </div>
    <figcaption>{item.caption} <a href={atomsArticle.sources[item.source].url} aria-label={`Source: ${atomsArticle.sources[item.source].label}`}>[{item.source + 1}]</a></figcaption>
  </figure>;
}

const workflow = [
  { title: 'Build the system', short: 'Build', label: 'Positions + boundaries', detail: 'Choose the atoms, their initial arrangement, and the simulation box. Boundaries specify whether the model has a free surface or repeats in space.', example: 'Make a complete lattice and a second structure with one site empty. Keep the box and boundary conditions matched.', output: 'A starting configuration', source: 0 },
  { title: 'Define the interactions', short: 'Define', label: 'Energy → forces', detail: 'An interaction model assigns energy to an arrangement. Forces point down the energy gradient; they can attract or repel atoms. The choice must fit the material and the process.', example: 'Use the same interaction model for both structures. Removing the atom changes the local environment without changing the force law.', output: 'Forces for the current configuration', source: 1 },
  { title: 'Follow the motion', short: 'Evolve', label: 'Forces → motion → new forces', detail: 'In molecular dynamics, force divided by mass gives acceleration. Advance positions and velocities over a small time step, calculate the forces again, and repeat.', output: 'A trajectory through time', example: 'Use the same time step and record the structures at comparable simulated times. Playback speed only changes how quickly you watch.', source: 2 },
  { title: 'Measure and validate', short: 'Check', label: 'Sample → compare → test', detail: 'After equilibration, collect measurements and estimate uncertainty. Check the time step, system size, and sampling, then compare with independent evidence.', output: 'A property with a stated uncertainty', example: 'Compare displacement statistics over repeated runs. To investigate heat transport, add a suitable thermal-transport measurement.', source: 8 },
];

function WorkflowIllustration({ step }) {
  return <svg viewBox="0 0 400 230" role="img" aria-label={[
    'Atomic positions inside a repeating simulation box, with repeated atoms outside the edges.',
    'Two interacting atoms with arrows illustrating forces along the line between them.',
    'Successive positions along an illustrative atomic trajectory, with the current position highlighted.',
    'Three groups of configurations representing independent samples for comparison.',
  ][step]}>
    {step === 0 && <><rect x="95" y="35" width="210" height="160" rx="2" fill="none" stroke="#ac8b70" strokeDasharray="5 6" />{[-1, 0, 1, 2, 3, 4, 5].flatMap(col => [0, 1, 2, 3].map(row => <circle key={`${col}-${row}`} cx={116 + col * 42} cy={55 + row * 40} r="6" fill="#d6a17e" opacity={col < 0 || col > 4 ? .2 : 1} />))}</>}
    {step === 1 && <><path d="M100 115H300" stroke="#8bc6bd" strokeDasharray="3 5" strokeOpacity=".5" /><circle cx="112" cy="115" r="20" fill="#d6a17e" /><circle cx="288" cy="115" r="20" fill="#d6a17e" /><path d="M145 115H188L178 107M188 115L178 123M255 115H212L222 107M212 115L222 123" fill="none" stroke="#8bc6bd" strokeWidth="2" /><circle cx="112" cy="115" r="38" fill="none" stroke="#d6a17e" strokeOpacity=".15" /><circle cx="288" cy="115" r="38" fill="none" stroke="#d6a17e" strokeOpacity=".15" /></>}
    {step === 2 && <><path d="M45 160C80 160 90 70 140 77S208 170 250 131S302 65 355 80" fill="none" stroke="#aa8468" strokeWidth="1.5" strokeDasharray="4 6" />{[[45, 160], [91, 108], [140, 77], [194, 114], [250, 131], [300, 85], [355, 80]].map(([x, y], index) => <circle key={x} cx={x} cy={y} r={index === 6 ? 10 : 5} fill={index === 6 ? '#8bc6bd' : '#d6a17e'} opacity={.25 + index * .125} />)}<path d="M50 198H350L342 193M350 198L342 203" fill="none" stroke="#d6a17e" strokeOpacity=".5" /></>}
    {step === 3 && [0, 1, 2].map(sample => <g key={sample} transform={`translate(${44 + sample * 113} 65)`}><rect width="86" height="96" fill="none" stroke="#a88970" strokeOpacity=".4" />{[0, 1, 2].flatMap(row => [0, 1, 2].map(col => <circle key={`${row}-${col}`} cx={16 + col * 26 + ((row + sample) % 2) * 3} cy={18 + row * 29 + ((col + sample) % 2) * 4} r="4.5" fill={sample === 2 ? '#8bc6bd' : '#d6a17e'} />))}<path d="M20 113H66" stroke="#d6a17e" strokeOpacity=".5" /></g>)}
  </svg>;
}

export function SimulationWorkflow() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = workflow[active];
  return <div className={s.workflow} data-graphene-reveal="0">
    <header className={s.workflowHeading}><span className={styles.eyebrow}>Follow the calculation</span><h3>From a starting structure<br />to a result you can test.</h3><p>Choose a step to see what the computer needs and what it produces.</p></header>
    <div className={s.workflowSteps} role="group" aria-label="Explore the simulation workflow">{workflow.map((item, index) => <button type="button" key={item.short} aria-pressed={active === index} aria-controls="workflow-explanation" onClick={() => setActive(index)}><span>0{index + 1}</span>{item.short}<span aria-hidden="true">↗</span></button>)}</div>
    <motion.div key={active} id="workflow-explanation" className={s.workflowBody} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.3 }}>
      <figure><WorkflowIllustration step={active} /><figcaption>{step.label}<span>Conceptual illustration</span></figcaption></figure>
      <div><span className={styles.eyebrow}>Step 0{active + 1} / A molecular-dynamics workflow</span><h3 aria-live="polite">{step.title}</h3><p>{step.detail}</p><p className={s.workflowOutput}><strong>For our missing-atom question</strong>{step.example}</p><p className={s.workflowResult}><strong>Output:</strong> {step.output}</p><a href={atomsArticle.sources[step.source].url}>Read about this step ↗</a></div>
    </motion.div>
    <p className={s.sectionNote}>This sequence describes molecular dynamics. Energy minimisation, Monte Carlo, and electronic-structure calculations can answer other questions or supply parts of the same workflow. Preparation and validation may send you back to an earlier step.</p>
  </div>;
}
