import React, { useState } from 'react';
import shared from './GrapheneArticle.module.css';
import s from './Nanofluids.module.css';

export function SurfaceExplorer() {
  const [n, setN] = useState(1);
  // n divisions along each dimension preserves total solid volume.
  const grains = [];
  const pitch = 60 / n, radius = 23 / n;
  for (let z = n - 1; z >= 0; z--) {
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        grains.push(<circle key={x + '-' + y + '-' + z}
          cx={59 + (x - (n-1)/2) * pitch + (z - (n-1)/2) * pitch * .44}
          cy={53 + (y - (n-1)/2) * pitch - (z - (n-1)/2) * pitch * .46}
          r={radius} fill="url(#grain-shading)" stroke="#342620" strokeWidth=".45" />);
      }
    }
  }
  return <section className={s.workbench} aria-labelledby="surface-heading">
    <div><span className={shared.eyebrow}>Particle explorer</span>
      <h3 id="surface-heading">Keep the solid. Change its size.</h3>
      <p>Choose a particle diameter. Each group contains the same volume of solid, with water between the spheres.</p>
      <div className={s.options} role="group" aria-label="Particle diameter">
        {[1,2,4].map(divisions => <button type="button" key={divisions} aria-pressed={n === divisions} onClick={() => setN(divisions)}>{8/divisions} nm</button>)}
      </div>
    </div>
    <figure className={s.model}>
      <svg viewBox="0 0 118 106" role="img" aria-label={n ** 3 + ' separate spheres of diameter ' + 8/n + ' nanometres'}>
        <defs><radialGradient id="grain-shading" cx="32%" cy="24%" r="83%"><stop stopColor="#ffedd4"/><stop offset=".4" stopColor="#d1a483"/><stop offset="1" stopColor="#513a31"/></radialGradient></defs>
        {grains}
      </svg>
      <figcaption aria-live="polite"><strong>{n ** 3} {n === 1 ? 'particle' : 'particles'} · {n}× surface area</strong>
        Relative to one 8 nm sphere. Each sphere has area proportional to its diameter squared and volume proportional to its diameter cubed.
      </figcaption>
    </figure>
  </section>;
}


export function ShellExplorer() {
  const [selected, setSelected] = useState(0);
  const ranges = [[2,2.2], [2.2,2.4], [2.4,2.6]];
  const [inside,outside] = ranges[selected];
  const volume = 4 * Math.PI / 3 * (outside ** 3 - inside ** 3);
  return <section className={s.workbench} aria-labelledby="shell-lab">
    <div><span className={shared.eyebrow}>Counting water</span>
      <h3 id="shell-lab">Choose a shell around the same particle.</h3>
      <p>This geometric example uses a 4 nm sphere and three shells, each 0.2 nm thick. Which shell would hold more water if the density were uniform?</p>
      <div className={s.options} role="group" aria-label="Select a water shell">
        {['Inner', 'Middle', 'Outer'].map((name,i) => <button key={name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{name}</button>)}
      </div>
    </div>
    <figure className={s.model}>
      <svg viewBox="0 0 200 180" role="img" aria-label={'Cross section highlighting shell '+(selected+1)+' around silver'}>
        {ranges.map(([r1,r2],i) => <circle key={r1} cx="100" cy="90" r={(r1+r2)*16} fill="none" stroke={selected === i ? '#efbd96' : '#456464'} strokeWidth={(r2-r1)*32-.5} />)}
        <circle cx="100" cy="90" r="64" fill="#989490"/><text x="100" y="95" textAnchor="middle" fill="#161616" fontSize="14">Silver</text>
      </svg>
      <figcaption aria-live="polite"><strong>Shell volume · {volume.toFixed(1)} nm³</strong>
        {((inside-2)).toFixed(1)}–{(outside-2).toFixed(1)} nm from the surface. The ring is a slice through a spherical measuring region.
      </figcaption>
    </figure>
  </section>;
}
