import React, { useState } from 'react';
import s from './Atoms.module.css';

export default function TrajectoryReadout({ samples, values, time, changed, solid, temperature }) {
  const [saved, setSaved] = useState(null);
  const maxTime = Math.max(.1, time, saved?.samples.at(-1)?.time || 0);
  const maxValue = Math.max(solid ? .2 : 1, ...samples.map(p => p.value), ...(saved?.samples.map(p => p.value) || [])) * 1.12;
  const x = t => 44 + t / maxTime * 380, y = value => 146 - value / maxValue * 118;
  const path = points => points.map((point,i)=>`${i ? 'L' : 'M'}${x(point.time).toFixed(2)},${y(point.value).toFixed(2)}`).join(' ');
  const label = solid ? changed ? 'Vacancy' : 'Complete lattice' : changed ? 'Compressed box' : 'Roomy box';
  return <div className={s.trajectory}>
    <div className={s.trajectoryHeading}><div><span>Read the motion</span><h3>Distance from the start</h3></div><output>{values.rmsDisplacement.toFixed(3)} <small>σ RMS</small></output></div>
    <svg viewBox="0 0 450 188" role="img" aria-label={`RMS displacement versus simulated time for ${label}: ${values.rmsDisplacement.toFixed(3)} sigma at ${time.toFixed(2)} tau.${saved ? ` Dashed line: saved ${saved.label} run.` : ''}`}>
      <path d="M44 22V146H424" fill="none" stroke="#b3957d" strokeOpacity=".4"/>
      {[0,.5,1].map(fraction=><g key={fraction}><text x="35" y={y(maxValue*fraction)+4} textAnchor="end">{(maxValue*fraction).toFixed(2)}</text><path d={`M44 ${y(maxValue*fraction)}H424`} stroke="#b3957d" strokeOpacity=".12"/></g>)}
      <text x="44" y="14">RMS displacement / σ</text><text x="44" y="165">0</text><text x="424" y="165" textAnchor="end">{maxTime.toFixed(2)} τ</text>
      {saved && <path d={path(saved.samples)} fill="none" stroke="#d6a17e" strokeWidth="2" strokeDasharray="5 5"/>}
      <path d={path(samples)} fill="none" stroke="#8bc6bd" strokeWidth="2"/>
      <circle cx={x(time)} cy={y(values.rmsDisplacement)} r="3.5" fill="#8bc6bd"/>
    </svg>
    <p className={s.traceLegend}><span>━ {label}</span>{saved && <span>┄ Saved: {saved.label}</span>}</p>
    <div className={s.traceActions}><button type="button" disabled={samples.length < 3} onClick={()=>setSaved({label:`${label} · T* = ${temperature.toFixed(2)}`,samples:samples.map(p=>({...p}))})}>Keep this trace</button>{saved && <button type="button" onClick={()=>setSaved(null)}>Clear saved</button>}</div>
    <p>{saved ? 'The dashed trace stays while you change the structure or reset. Compare at matched times and initial temperatures; these are single runs.' : 'Pause, keep a trace, then change the structure to compare. The plot comes from the moving atoms above.'}</p>
    <details><summary>How to read this measurement</summary><p>Square each atom’s distance from its initial position, average over the atoms, then take the square root. Boundary crossings are included. A rising curve shows increasing displacement; it does not by itself measure diffusion, heat transport or strength.</p><p>Reset clears the current trace. A kept trace is a snapshot and keeps its original time range. Both axes rescale to fit the displayed runs.</p></details>
  </div>;
}
