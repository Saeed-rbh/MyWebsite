import React, { useId, useState } from 'react';
import { pairInteraction, CUTOFF } from './particleModel.mjs';
import ReferenceLink from './ReferenceLink';
import shared from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const x = r => 54 + (r - .96) / (CUTOFF - .96) * 480;
const y = energy => 172 - energy * 72;
const curve = Array.from({ length: 240 }, (_, i) => {
  const r = .96 + (CUTOFF - .96) * i / 239;
  return `${i ? 'L' : 'M'}${x(r).toFixed(2)},${y(pairInteraction(r).energy).toFixed(2)}`;
}).join(' ');
let low = 1.1, high = 1.2;
for (let i = 0; i < 40; i++) {
  const middle = (low + high) / 2;
  if (pairInteraction(middle).derivative < 0) low = middle; else high = middle;
}
const minimum = (low + high) / 2;

export default function AtomicForceExplorer() {
  const [distance, setDistance] = useState(1.5);
  const id = useId();
  const { energy, derivative } = pairInteraction(distance);
  const balanced = Math.abs(derivative) < 1e-7;
  const repelling = derivative < 0;
  const regime = balanced ? 'At the energy minimum' : repelling ? 'Too close: the pair repels' : 'Farther apart: the pair attracts';
  const arrow = Math.min(45, 12 + Math.abs(derivative) * 7);
  const a = 210 - distance * 42, b = 210 + distance * 42;
  return <figure id="atomic-forces" className={s.forceExplorer} aria-labelledby={`${id}-title`}>
    <header><span className={shared.eyebrow}>Try the interaction / The same rule as the live crystal</span><h3 id={`${id}-title`}>Why do atoms push apart<br />or pull together?</h3><p>Change the separation of an isolated pair. Read the energy curve, then look at the force arrows.</p></header>
    <div className={s.forceLayout}>
      <div>
        <svg viewBox="0 0 580 310" role="img" aria-label={`Pair energy curve. At separation ${distance.toFixed(3)} sigma, energy is ${energy.toFixed(3)} epsilon. ${regime}.`}>
          <path d="M54 28V267H542M54 172H542" fill="none" stroke="#b3957d" strokeOpacity=".35" />
          <text x="54" y="17">Pair energy U / ε</text>
          <text x="542" y="301" textAnchor="end">Separation r / σ</text>
          <text x="40" y="176" textAnchor="end">0</text><text x="40" y="248" textAnchor="end">−1</text>
          {[1,1.5,2,2.5].map(r => <g key={r}><path d={`M${x(r)} 267v5`} stroke="#b3957d"/><text x={x(r)} y="287" textAnchor="middle">{r.toFixed(1)}</text></g>)}
          <path d={curve} fill="none" stroke="#d6a17e" strokeWidth="2.5" />
          <path d={`M${x(distance)} 267V${y(energy)}`} stroke="#8bc6bd" strokeDasharray="3 5" />
          <circle cx={x(distance)} cy={y(energy)} r="6" fill="#8bc6bd" />
          <text x="210" y="118" fill="#d6a17e">Attraction →</text><text x="65" y="49">← Repulsion</text>
        </svg>
        <p className={s.sectionNote}>Calculated from the page’s force-shifted Lennard–Jones model, with energy and force smoothly reaching zero at 2.5 σ. The minimum is near {minimum.toFixed(3)} σ. <ReferenceLink number={11} /></p>
      </div>
      <div className={s.forceControls}>
        <svg viewBox="0 0 420 125" role="img" aria-label={`${regime}. Arrows show forces on the two atoms; lengths are compressed for readability.`}>
          <path d={`M${a} 66H${b}`} stroke="#b3957d" strokeDasharray="3 6" strokeOpacity=".4" />
          <circle cx={a} cy="66" r="18" fill="#d6a17e"/><circle cx={b} cy="66" r="18" fill="#d6a17e"/>
          {!balanced && [a,b].map((cx,i) => {
            const direction = (i === 0 ? 1 : -1) * (repelling ? -1 : 1);
            const start = cx + direction * 25, end = start + direction * arrow;
            return <path key={i} d={`M${start} 66H${end}l${-direction*7} -5M${end} 66l${-direction*7} 5`} fill="none" stroke="#8bc6bd" strokeWidth="2"/>;
          })}
          <text x="210" y="114" textAnchor="middle">{distance.toFixed(3)} σ apart</text>
        </svg>
        <label htmlFor={`${id}-separation`}>Atomic separation <output>{distance.toFixed(3)} σ</output></label>
        <input id={`${id}-separation`} type="range" min=".98" max="2.4" step=".001" value={distance} onChange={e => setDistance(Number(e.target.value))}/>
        <div className={s.forcePresets}>{[['Repel',1.02],['Balance',minimum],['Attract',1.5]].map(([label,r]) => <button type="button" key={label} onClick={() => setDistance(r)}>{label}</button>)}</div>
        <h4 aria-live="polite">{regime}</h4>
        <p>{balanced ? 'The energy curve is flat here, so the radial force on the isolated pair is zero. Other neighbours can still exert forces in a material.' : repelling ? 'Moving closer raises the energy sharply. Each atom feels a force away from the other.' : 'Moving closer lowers the energy. Each atom feels a force toward the other; the attraction weakens at large separation.'}</p>
        <dl className={s.forceValues}><div><dt>Pair energy</dt><dd>{energy.toFixed(3)} ε</dd></div><div><dt>Radial force −dU/dr</dt><dd>{(Math.abs(derivative) < .0005 ? 0 : -derivative).toFixed(3)} ε/σ</dd></div></dl>
      </div>
    </div>
    <figcaption className={s.sectionNote}>Negative radial force means attraction; positive means repulsion. Arrows show direction with compressed lengths. This model has no explicit electrons or chemical reactions. The figure explains the force law; the live simulation integrates the motion.</figcaption>
  </figure>;
}
