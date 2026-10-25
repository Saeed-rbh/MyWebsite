import React from 'react';
import s from './Atoms.module.css';

export default function SimulationScenario({ example }) {
  return <ol className={s.scenarioSteps} aria-label={`Try this experiment: ${example.question}`}>
    {example.steps.map((step, index) => <li key={step.label}><span aria-hidden="true">0{index + 1}</span><div><h3>{step.label}</h3><p>{step.text}</p></div></li>)}
  </ol>;
}
