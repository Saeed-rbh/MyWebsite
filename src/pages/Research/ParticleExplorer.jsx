import React, {useEffect, useId, useRef, useState} from 'react';
import {PARTICLE_STEP, createParticles, advanceParticles, nearestImage, particleObservables} from './particleModel.mjs';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

export default function ParticleExplorer({kind}) {
  const solid = kind === 'solid';
  const [running, setRunning] = useState(false), [rate, setRate] = useState(1);
  const [temperature, setTemperature] = useState(solid ? .08 : 1.5);
  const [changedStructure, setChangedStructure] = useState(false), [guides, setGuides] = useState(true);
  const [error, setError] = useState('');
  const state = useRef(null);
  if (!state.current) state.current = createParticles({kind});
  const [frame, setFrame] = useState(state.current);
  const id = useId().replace(/:/g, '');
  useEffect(() => { setRunning(!window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  function advance(count = 1) {
    try { for (let i = 0; i < count; i++) state.current = advanceParticles(state.current); }
    catch (cause) { setRunning(false); setError(cause.message); }
    setFrame(state.current);
  }
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => advance(Math.round(rate * 4)), 32);
    return () => clearInterval(timer);
  }, [running, rate]);
  function reset(nextTemperature = temperature, nextStructure = changedStructure) {
    state.current = createParticles({kind, temperature: nextTemperature, vacancy: solid && nextStructure, compressed: !solid && nextStructure});
    setTemperature(nextTemperature); setChangedStructure(nextStructure); setError(''); setFrame(state.current);
  }
  const {box, atoms} = frame, values = particleObservables(frame);
  const scale = Math.min(480 / box.width, 290 / box.height);
  const left = (600 - box.width * scale) / 2, top = (420 - box.height * scale) / 2;
  const copies = [-1, 0, 1].flatMap(x => [-1, 0, 1].map(y => [x * box.width, y * box.height]));
  const point = (x, y) => ({x: left + x * scale, y: top + y * scale});
  return <section className={styles.experience} aria-labelledby={`${id}-title`}>
    <div className={styles.explorerHeading}><div><span className={styles.eyebrow}>Example / {solid ? 'A monatomic crystal' : 'A dilute monatomic gas'}</span><h2 id={`${id}-title`}>{solid ? 'A solid is never perfectly still.' : 'Free flight, then an encounter.'}</h2></div><span className={styles.liveLabel}>Live atomic model</span></div>
    <div className={styles.lab}>
      <div className={`${styles.viewport} ${s.waterViewport}`}>
        <div className={styles.modelLabel}>{atoms.length} ATOMS / {solid ? 'TRIANGULAR LATTICE' : 'DILUTE GAS'} / PERIODIC BOX<br/>{solid ? 'Dots: atoms · Rings: starting sites' : 'Teal: atoms · Arrows: velocity'}</div>
        <svg viewBox="0 0 600 420" role="img" aria-label={solid ? 'Atoms vibrating around sites in a triangular crystal, with an optional missing atom.' : 'Separated atoms travelling through a periodic box and changing direction during close encounters.'}>
          <defs>
            <radialGradient id={`${id}-atom`} cx="30%" cy="25%"><stop stopColor={solid ? '#ffe7cf' : '#d5f2ed'}/><stop offset=".45" stopColor={solid ? '#ce9876' : '#81b9b1'}/><stop offset="1" stopColor={solid ? '#70462f' : '#315d5b'}/></radialGradient>
            <clipPath id={`${id}-clip`}><rect x={left} y={top} width={box.width * scale} height={box.height * scale}/></clipPath>
            <marker id={`${id}-arrow`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#acd1c8"/></marker>
          </defs>
          <rect x={left} y={top} width={box.width * scale} height={box.height * scale} fill="#171411" fillOpacity=".25" stroke="#dab18b" strokeOpacity=".4" strokeDasharray="5 6"/>
          <g clipPath={`url(#${id}-clip)`}>{copies.map(([dx, dy]) => <g key={`${dx}-${dy}`}>
            {atoms.map(a => {
              const p = point(a.x + dx, a.y + dy), start = point(a.x0 + dx, a.y0 + dy);
              const end = point(a.x + dx + a.vx * .35, a.y + dy + a.vy * .35);
              return <g key={a.id}>
                {guides && solid && <><circle cx={start.x} cy={start.y} r="11" fill="none" stroke="#d9b18b" strokeOpacity=".35"/><line x1={p.x} y1={p.y} x2={p.x - nearestImage(a.x - a.x0, box.width) * scale} y2={p.y - nearestImage(a.y - a.y0, box.height) * scale} stroke="#e8bb8b" strokeOpacity=".5"/></>}
                {guides && !solid && <line x1={p.x} y1={p.y} x2={end.x} y2={end.y} stroke="#acd1c8" strokeOpacity=".7" strokeWidth="1.2" markerEnd={`url(#${id}-arrow)`}/>}
                <circle cx={p.x} cy={p.y} r={solid ? 8 : 7} fill={`url(#${id}-atom)`}/>
              </g>;
            })}
          </g>)}</g>
          <text x="300" y="393" textAnchor="middle" fill="#b6a696" fontSize="10" letterSpacing="1">OPPOSITE EDGES CONNECT · NO WALLS</text>
        </svg>
        <p className={styles.dragHint}>{solid ? 'Watch atoms oscillate around an ordered arrangement.' : 'Watch velocity directions change during close encounters.'}<br/>Atom radii are illustrative; all motion follows the calculated forces.</p>
      </div>
      <div className={styles.controls}>
        <span className={styles.eyebrow}>{solid ? 'Structure & vibrations' : 'Motion & collisions'}</span>
        <h3>{solid ? 'Change a site. Watch its neighbours.' : 'Change the density. Follow the motion.'}</h3>
        <p>{solid ? 'At low temperature, these interacting atoms remain near an ordered lattice. Remove one atom to create a vacancy and watch the surrounding atoms respond.' : 'At low density, atoms travel between encounters. Repulsion turns them apart when they get close; the same interaction also contains a weaker attraction.'}</p>
        <div className={styles.viewButtons}><button aria-pressed={running} disabled={!!error} onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Play'}</button><button disabled={running || !!error} onClick={() => advance()}>One step</button><button onClick={() => reset()}>Reset</button></div>
        <div className={styles.modeButtons} role="group" aria-label={solid ? 'Crystal structure' : 'Gas density'}><button aria-pressed={!changedStructure} onClick={() => reset(temperature, false)}>{solid ? 'Perfect lattice' : 'Roomy box'}</button><button aria-pressed={changedStructure} onClick={() => reset(temperature, true)}>{solid ? 'Add a vacancy' : 'Denser gas'}</button></div>
        <label htmlFor={`${id}-temperature`} className={s.temperatureLabel}>Initial temperature T*<select id={`${id}-temperature`} value={temperature} onChange={e => reset(Number(e.target.value))}>{(solid ? [.03, .08, .16] : [.75, 1.5, 3]).map(t => <option key={t} value={t}>{t.toFixed(2)}</option>)}</select></label>
        <p className={s.controlHint}>Structure, density and temperature choices restart the model. T* is a reduced temperature, not kelvin.</p>
        <label htmlFor={`${id}-speed`} className={styles.sliderLabel}>Playback speed <span>{rate.toFixed(1)}×</span></label><input id={`${id}-speed`} type="range" min=".5" max="2" step=".5" value={rate} onChange={e => setRate(Number(e.target.value))}/>
        <button aria-pressed={guides} onClick={() => setGuides(!guides)}>{solid ? 'Starting-site guides' : 'Velocity arrows'} {guides ? 'on' : 'off'}</button>
        <dl className={s.physicsStats}>
          <div><dt>Simulated time</dt><dd>{frame.time.toFixed(3)} <span>τ</span></dd></div>
          <div><dt>Instantaneous temperature</dt><dd>{values.temperature.toFixed(3)} <span>T*</span></dd></div>
          <div><dt>RMS displacement</dt><dd>{values.rmsDisplacement.toFixed(3)} <span>σ</span></dd></div>
          <div><dt>Energy error / atom</dt><dd>{values.energyError.toExponential(1)} <span>ε</span></dd></div>
        </dl>
        <p className={s.controlHint}>{solid ? 'Ask: how does a defect change local motion? RMS displacement measures how far atoms have moved from their starting positions.' : 'Ask: how does density affect encounters and transport? Displacements follow atoms across periodic boundaries.'}</p>
        {error && <p role="alert">{error}</p>}
        <details className={s.physicsDetails}><summary>What this model includes</summary><p>A two-dimensional <a href="https://docs.lammps.org/pair_lj.html" target="_blank" rel="noreferrer">Lennard–Jones system</a> with unit mass, periodic boundaries and velocity-Verlet integration (Δt = {PARTICLE_STEP} τ). Energy and force go continuously to zero at a 2.5 σ cutoff through a force shift. There are no fixed bonds or springs holding atoms to lattice sites.</p><p>Time, distance, energy and temperature use <a href="https://docs.lammps.org/units.html" target="_blank" rel="noreferrer">reduced units</a>: τ, σ, ε and T* = kBT/ε. Starting velocities have zero net momentum. This isolated run has no thermostat, so kinetic and potential energies exchange as the structure evolves.</p><p>{solid ? 'This generic crystal demonstrates lattice vibrations and vacancies. Real metals, semiconductors and covalent solids need interaction models validated for their bonding and properties.' : 'This generic monatomic gas demonstrates atomic encounters and transport. It contains no molecular rotation, internal bonds or chemical reactions.'} The presets are separate starting systems, not a melting or boiling experiment.</p></details>
      </div>
    </div>
  </section>;
}
