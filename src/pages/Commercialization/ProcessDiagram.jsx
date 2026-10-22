import React, { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import s from './Commercialization.module.css';

// A schematic illustration of the mechanism; it makes no quantitative flow claim.
export default function ProcessDiagram({ stage, root }) {
  const ref = useRef(null);
  const visible = useInView(ref, { root, amount: 0.2 });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return <div ref={ref} className={s.mechanism} data-stage={stage} data-running={visible && !reduced && !paused}>
    <div className={s.mechanismHeader}><span>FOLLOW THE MECHANISM</span><button type="button" aria-pressed={paused} onClick={()=>setPaused(x=>!x)} disabled={reduced}>{reduced ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion'}</button></div>
    <svg viewBox="0 0 720 180" role="img" aria-label={`CFE schematic. Selected stage: ${['layered feedstock', 'high-pressure gas creates shear', 'separated material sheets'][stage]}. Arrows indicate flow from left to right.`}>
      <path d="M20 90H700" stroke="#c3d3ed" strokeWidth="1" strokeDasharray="3 8"/>
      <g className={s.feedstock} fill="#416da6" stroke="#183c73" strokeWidth="1.5">{[0,1,2,3,4].map(i=><path key={i} d={`M55 ${57+i*9}l62 -16 62 16-62 18Z`}/>)}</g>
      <path d="M220 36H280L340 62H427L482 36H512V144H482L427 118H340L280 144H220" fill="#e8effb" stroke="#7d9bca" strokeWidth="2"/>
      <g className={s.gasFlow} fill="none" stroke="#0645ee" strokeWidth="2.5">{[0,1,2].map(i=><path key={i} d={`M197 ${57+i*33}C280 ${57+i*33} 300 ${78+i*12} 358 ${78+i*12}H425C462 ${78+i*12} 478 ${57+i*33} 540 ${57+i*33}`} strokeDasharray="18 15"/>)}</g>
      <g className={s.outputSheets} fill="#7b9fe2" stroke="#0645ee" strokeWidth="1.5">{[0,1,2].map(i=><path key={i} d={`M${555+i*12} ${45+i*43}l45 -12 45 12-45 12Z`} style={{animationDelay:`${i*-.65}s`}}/>)}</g>
      <g fill="#526b95" fontFamily="Rubik, sans-serif" fontSize="10" textAnchor="middle"><text x="117" y="171">LAYERED INPUT</text><text x="366" y="171">GAS-DRIVEN SHEAR</text><text x="620" y="171">THINNER SHEETS</text></g>
    </svg>
  </div>;
}
