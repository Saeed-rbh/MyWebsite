import React from 'react';
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

export default function AtomisticExplorer({ system, setSystem, onResearch }) {
  const selected = atomsArticle.simulationExamples.find(example => example.id === system);
  return <section id="atoms-explorer" className={s.materialExplorer} aria-labelledby="materials-explorer-title">
    <header className={s.simulationHeader}>
      <div><span className={styles.eyebrow}>Live simulation</span><h2 id="materials-explorer-title">Atoms in motion.</h2></div>
      <div className={s.phaseSelector} role="group" aria-label="Choose an atomistic simulation">{atomsArticle.simulationExamples.map(example => <button type="button" key={example.id} aria-pressed={system === example.id} aria-controls="material-simulation" onClick={() => setSystem(example.id)}><SystemSketch kind={example.id}/><span>{example.label}</span></button>)}</div>
    </header>
    <div id="material-simulation" key={system}>{system === 'water' ? <WaterExplorer/> : <ParticleExplorer kind={system}/>}</div>
    <div className={s.simulationFootnote}><span>Illustrative 2D models · Motion calculated from forces</span><a href="#simulation-papers" onClick={() => onResearch(selected.researchIndex)}>Related research ↗</a></div>
  </section>;
}
