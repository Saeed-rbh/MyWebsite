import React, {useState} from 'react';
import ParticleExplorer from './ParticleExplorer';
import WaterExplorer from './WaterExplorer';
import {atomsArticle} from '../../data/atomsArticle.mjs';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

function SystemSketch({kind}) {
  return <svg viewBox="0 0 80 44" aria-hidden="true" focusable="false">
    {kind === 'solid' ? [0, 1, 2].flatMap(row => [0, 1, 2, 3].map(col => <circle key={`${row}-${col}`} cx={14 + col * 15 + (row % 2) * 7} cy={8 + row * 14} r="3.5" fill="#d6a17e"/>)) : kind === 'gas' ? [[10, 12], [42, 7], [69, 18], [26, 35], [58, 37]].map(([x, y]) => <g key={x}><path d={`M${x} ${y}l8 -5`} stroke="#81b9b1" strokeOpacity=".5"/><circle cx={x} cy={y} r="3.5" fill="#81b9b1"/></g>) : <g><path d="M25 12L40 29L55 12" fill="none" stroke="#ddbc9e" strokeWidth="3"/><circle cx="40" cy="29" r="8" fill="#d77969"/><circle cx="25" cy="12" r="5" fill="#eddfcc"/><circle cx="55" cy="12" r="5" fill="#eddfcc"/></g>}
  </svg>;
}

export default function AtomisticExplorer() {
  const [system, setSystem] = useState('solid');
  return <section id="atoms-explorer" className={s.materialExplorer} aria-labelledby="materials-explorer-title">
    <div className={s.exampleIntro}><span className={styles.eyebrow}>Three systems / One atomistic workflow</span><h2 id="materials-explorer-title">Different matter. The same atomic perspective.</h2><p>Start with a structure, calculate its interactions, and follow the motion. Compare an ordered solid, a dilute gas, and water molecules to see how the model changes with the question.</p></div>
    <div className={s.phaseSelector} role="group" aria-label="Choose an atomistic simulation">{atomsArticle.simulationExamples.map(example => <button key={example.id} aria-pressed={system === example.id} aria-controls="material-simulation" onClick={() => setSystem(example.id)}><SystemSketch kind={example.id}/><span><strong>{example.label}</strong><small>{example.subtitle}</small></span><span aria-hidden="true">↗</span></button>)}</div>
    <div id="material-simulation" key={system}>{system === 'water' ? <WaterExplorer embedded/> : <ParticleExplorer kind={system}/>}</div>
    <div className={s.modelComparison}><span className={styles.eyebrow}>From motion to a research question</span><div>{atomsArticle.simulationExamples.map(example => <article key={example.id}><h3>{example.label}</h3><p>{example.explanation}</p><p><strong>Measure:</strong> {example.measure}</p></article>)}</div><p className={s.comparisonNote}>These are small, planar teaching models. The solid and gas share a generic pair interaction; water adds fixed molecular geometry and partial charges. Each example uses its own conditions and units. A research calculation needs a model, system size and sampling strategy validated for the material and question.</p></div>
  </section>;
}
