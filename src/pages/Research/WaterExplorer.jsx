import React, {useEffect, useId, useRef, useState} from 'react';
import {BOX, STEP_FS, BOND_LENGTH, createWater, advanceWater, waterContacts, waterObservables} from './waterModel.mjs';
import useSimulationPlayback from './useSimulationPlayback';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const SCALE = 330 / BOX.height;
const LEFT = (600 - BOX.width * SCALE) / 2;
const COPIES = [-1, 0, 1].flatMap(x => [-1, 0, 1].map(y => [x * BOX.width, y * BOX.height]));

export default function WaterExplorer() {
  const { playbackRef, running, setRunning, active } = useSimulationPlayback();
  const [rate, setRate] = useState(1);
  const [initialTemperature, setInitialTemperature] = useState(300);
  const [contactsVisible, setContactsVisible] = useState(true);
  const [single, setSingle] = useState(false);
  const [error, setError] = useState('');
  const state = useRef(null);
  if (!state.current) state.current = createWater();
  const [frame, setFrame] = useState(state.current);
  const id = useId().replace(/:/g, '');

  function advance(count = 1) {
    try {
      for (let i = 0; i < count; i++) state.current = advanceWater(state.current);
    } catch (cause) {
      setRunning(false);
      setError(cause.message);
    }
    setFrame(state.current);
  }
  useEffect(() => {
    if (!active) return;
    // Playback changes how many fixed physical steps are displayed, never the timestep.
    const timer = setInterval(() => advance(Math.round(rate * 2)), 32);
    return () => clearInterval(timer);
  }, [active, rate]);
  function reset(temperature = initialTemperature) {
    state.current = createWater(temperature);
    setInitialTemperature(temperature);
    setFrame(state.current);
    setError('');
  }

  const contacts = waterContacts(frame);
  const observables = waterObservables(frame);
  const oxygen = frame.atoms[0];
  const copies = single ? [[0, 0]] : COPIES;
  const selected = single ? frame.atoms.slice(0, 3) : frame.atoms;
  const point = (a, dx = 0, dy = 0) => single
    ? {x: 300 + (a.x - oxygen.x) * 110, y: 210 + (a.y - oxygen.y) * 110}
    : {x: LEFT + (a.x + dx) * SCALE, y: 45 + (a.y + dy) * SCALE};
  const h1 = frame.atoms[1], h2 = frame.atoms[2];
  const u = [h1.x - oxygen.x, h1.y - oxygen.y], v = [h2.x - oxygen.x, h2.y - oxygen.y];
  const angle = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;

  return <section ref={playbackRef} className={s.simulation} aria-label="Live water simulation">
      <div className={s.simulationStage}>
        <div className={s.simulationTopline}><span>{single ? 'One water molecule' : '12 water molecules'}</span><span>Time {(frame.timeFs / 1000).toFixed(3)} ps</span></div>
        <svg viewBox="0 0 600 420" role="img" aria-label="Rigid bent water molecules translating and rotating under intermolecular forces. Molecules crossing an edge reappear at the opposite side.">
          <defs>
            <radialGradient id={`${id}-oxygen`} cx="30%" cy="25%"><stop stopColor="#ffd1b5"/><stop offset=".4" stopColor="#df6755"/><stop offset="1" stopColor="#842f32"/></radialGradient>
            <radialGradient id={`${id}-hydrogen`} cx="30%" cy="25%"><stop stopColor="#fffef7"/><stop offset="1" stopColor="#bda995"/></radialGradient>
            <clipPath id={`${id}-box`}><rect x={LEFT} y="45" width={BOX.width * SCALE} height="330"/></clipPath>
          </defs>
          {!single && <rect x={LEFT} y="45" width={BOX.width * SCALE} height="330" fill="#171411" fillOpacity=".25" stroke="#dab18b" strokeOpacity=".4" strokeDasharray="5 6"/>}
          <g clipPath={single ? undefined : `url(#${id}-box)`}>
            {copies.map(([dx, dy]) => <g key={`${dx}-${dy}`}>
              {!single && contactsVisible && contacts.map(([i, j, ox, oy]) => {
                const a = point(frame.atoms[i], dx, dy), b = point(frame.atoms[j], dx + ox, dy + oy);
                return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#89c7c3" strokeWidth="1.6" strokeDasharray="4 5"/>;
              })}
              {frame.bonds.filter(([i]) => !single || i === 0).map(([i, j]) => {
                const a = point(frame.atoms[i], dx, dy), b = point(frame.atoms[j], dx, dy);
                return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e1ba99" strokeWidth={single ? 10 : 4} strokeLinecap="round"/>;
              })}
              {selected.map((a, i) => {
                const p = point(a, dx, dy);
                return <g key={i}><circle cx={p.x} cy={p.y} r={a.element === 'O' ? (single ? 30 : 10) : (single ? 20 : 6)} fill={`url(#${id}-${a.element === 'O' ? 'oxygen' : 'hydrogen'})`}/>{single && <text x={p.x} y={p.y + 5} textAnchor="middle" fill={a.element === 'O' ? '#fff' : '#49372c'} fontSize="16">{a.element}</text>}</g>;
              })}
            </g>)}
          </g>
          {!single && <text x="300" y="398" textAnchor="middle" fill="#b6a696" fontSize="10" letterSpacing="1">OPPOSITE EDGES CONNECT · NO WALLS</text>}
        </svg>
      </div>
      <div className={s.simulationToolbar}>
        <div className={s.transport}><button type="button" aria-pressed={running} disabled={!!error} onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Play'}</button><button type="button" onClick={() => reset()}>Reset</button></div>
        <button type="button" onClick={() => setSingle(!single)}>{single ? 'Show water box' : 'Inspect H₂O'}</button>
      </div>
      <p className={s.simulationCaption}>{single ? 'One oxygen, two hydrogens. This model keeps the molecule’s bent shape fixed.' : 'Water molecules move and rotate. Dashed lines mark hydrogen-bond candidates.'}</p>
      {error && <p className={s.simulationError} role="alert">{error}</p>}
      <details className={s.simulationSettings}><summary>Settings &amp; model</summary>
      <div className={s.settingsGrid}>
      <div className={s.settingsControls}>
        <label htmlFor={`${id}-temperature`} className={s.temperatureLabel}><span>Initial temperature</span><select id={`${id}-temperature`} value={initialTemperature} onChange={e => reset(Number(e.target.value))}><option value="150">150 K</option><option value="300">300 K</option><option value="600">600 K</option></select></label>
        <p className={s.controlHint}>Changing temperature restarts the model with new starting speeds.</p>
        <label htmlFor={`${id}-rate`} className={styles.sliderLabel}>Playback speed <span>{rate.toFixed(1)}×</span></label><input id={`${id}-rate`} type="range" min=".5" max="2" step=".5" value={rate} onChange={e => setRate(Number(e.target.value))}/>
        <button aria-pressed={contactsVisible} disabled={single} onClick={() => setContactsVisible(!contactsVisible)}>Hydrogen-bond guides {contactsVisible ? 'on' : 'off'}</button>
        <button type="button" disabled={running || !!error} onClick={() => advance()}>One step</button>
      </div>
      <div>
        <dl className={s.physicsStats}>
          <div><dt>Simulated time</dt><dd>{(frame.timeFs / 1000).toFixed(4)} <span>ps</span></dd></div>
          <div><dt>Instantaneous temperature</dt><dd>{observables.temperature.toFixed(0)} <span>K</span></dd></div>
          <div><dt>Energy change / molecule</dt><dd>{observables.driftPerMolecule.toFixed(4)} <span>kJ/mol</span></dd></div>
          <div><dt>H-bond candidates</dt><dd>{contacts.length}</dd></div>
        </dl>
        <p className={s.controlHint}>No thermostat: temperature fluctuates and can rise as the starting grid relaxes. Total energy should stay nearly constant.</p>
        <p className={s.geometryReadout}>O–H: {BOND_LENGTH.toFixed(4)} Å · H–O–H: {angle.toFixed(2)}°<br/>24 fixed covalent bonds · {STEP_FS} fs per step</p>
        <div className={s.physicsDetails}>
          <p>Rigid planar molecules with <a href="https://docs.lammps.org/Howto_tip3p.html" target="_blank" rel="noreferrer">original TIP3P site parameters</a>, Coulomb and oxygen–oxygen Lennard–Jones forces, and velocity-Verlet integration. A smooth molecular cutoff switches interactions off between 4.5 and 5.5 Å, including its force correction.</p>
          <p>This run conserves energy (NVE); it has no thermostat. Starting velocities are sampled thermally, then adjusted to remove net drift and set the initial temperature. The grid is not an equilibrated liquid: molecules can warm as they settle into lower-energy arrangements. Temperature uses the 34 active planar degrees of freedom.</p>
          <p>Dashed guides require O···O &lt; 3.5 Å, H···O &lt; 2.5 Å and O–H···O &gt; 150°. They identify contacts, not new covalent bonds. This small, two-dimensional model has no long-range electrostatics and does not reproduce quantitative bulk-water properties. Oxygen is red and hydrogen is ivory; atom sizes are illustrative.</p>
        </div>
      </div>
      </div>
      </details>
  </section>;
}
