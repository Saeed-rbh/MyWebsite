import React, { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { BOX, STEP_FS, BOND_LENGTH, ANGLE, createWater, advanceWater, waterContacts, waterObservables } from './waterModel.mjs';
import useSimulationPlayback from './useSimulationPlayback';
import { SmoothDetails } from './AtomisticUi';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const SCALE = 330 / BOX.height;
const LEFT = (600 - BOX.width * SCALE) / 2;
const COPIES = [-1, 0, 1].flatMap(x => [-1, 0, 1].map(y => [x * BOX.width, y * BOX.height]));

export default function WaterExplorer() {
  const { playbackRef, running, setRunning, active } = useSimulationPlayback();
  const reduceMotion = useReducedMotion();
  const [rate, setRate] = useState(1);
  const [initialTemperature, setInitialTemperature] = useState(300);
  const [contactsVisible, setContactsVisible] = useState(true);
  const [single, setSingle] = useState(true);
  const [error, setError] = useState('');
  const [singleClock, setSingleClock] = useState(0);
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
    if (!active) return undefined;
    let rafId;
    let last = performance.now();
    let carry = 0;

    const tick = now => {
      const elapsed = Math.min(64, Math.max(0, now - last));
      last = now;
      if (single) {
        setSingleClock(prev => prev + (elapsed / 1000) * rate);
      } else {
        // Accumulate fixed velocity-Verlet steps calibrated to 60 display fps * playback rate.
        carry += (elapsed / 32) * (rate * 2);
        const steps = Math.floor(carry);
        if (steps >= 1) {
          carry -= steps;
          advance(steps);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, rate, single]);

  function showMolecules(inspectOne, autoPlay = false) {
    setSingle(inspectOne);
    if (autoPlay && !reduceMotion) setRunning(true);
  }

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

  // Compute gentle thermal libration & stretch preview when inspecting a single H2O molecule.
  const singleWave = single ? Math.sin(singleClock * 2.8) : 0;
  const singleTilt = single ? 0.11 * Math.sin(singleClock * 1.15) : 0;
  const liveBondLength = single ? BOND_LENGTH + 0.016 * Math.sin(singleClock * 5.2) : BOND_LENGTH;
  const liveAngleRad = single ? ANGLE + (2.4 * Math.PI / 180) * singleWave : ANGLE;

  const singlePoints = (() => {
    const half = liveAngleRad / 2;
    const ox = 300;
    const oy = 238 + 4 * Math.sin(singleClock * 1.6);
    const arm = 108 * (liveBondLength / BOND_LENGTH);
    const leftAngle = -Math.PI / 2 - half + singleTilt;
    const rightAngle = -Math.PI / 2 + half + singleTilt;
    return [
      { x: ox, y: oy },
      { x: ox + arm * Math.cos(leftAngle), y: oy + arm * Math.sin(leftAngle) },
      { x: ox + arm * Math.cos(rightAngle), y: oy + arm * Math.sin(rightAngle) },
    ];
  })();

  const point = (a, index = 0, dx = 0, dy = 0) => single
    ? singlePoints[index] || { x: 300 + (a.x - oxygen.x) * 110, y: 210 + (a.y - oxygen.y) * 110 }
    : { x: LEFT + (a.x + dx) * SCALE, y: 45 + (a.y + dy) * SCALE };

  const h1 = frame.atoms[1], h2 = frame.atoms[2];
  const u = [h1.x - oxygen.x, h1.y - oxygen.y], v = [h2.x - oxygen.x, h2.y - oxygen.y];
  const angle = single
    ? liveAngleRad * 180 / Math.PI
    : Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;

  const playback = (
    <div className={s.transport} role="group" aria-label="Playback">
      <button type="button" aria-pressed={running} disabled={!!error} onClick={() => setRunning(!running)}>
        {running ? 'Pause' : 'Play'}
      </button>
      {!single && (
        <>
          <button type="button" disabled={running || !!error} onClick={() => advance()}>
            One step
          </button>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </>
      )}
    </div>
  );

  const guides = !single ? (
    <button type="button" aria-pressed={contactsVisible} onClick={() => setContactsVisible(!contactsVisible)}>
      Hydrogen-bond guides
    </button>
  ) : (
    <button
      type="button"
      className={s.addNeighboursBtn}
      onClick={() => showMolecules(false, true)}
    >
      + Add 11 neighbours → watch H-bonds
    </button>
  );

  return (
    <section ref={playbackRef} className={s.simulation} aria-label="Live water simulation">
      <div className={s.waterModes} role="group" aria-label="Water simulation view">
        <button type="button" aria-pressed={single} onClick={() => showMolecules(true)}>
          One molecule
        </button>
        <button type="button" aria-pressed={!single} onClick={() => showMolecules(false, true)}>
          See 12 water molecules together
        </button>
      </div>

      <div className={s.simulationStage}>
        <div className={s.simulationTopline}>
          <span>
            {single
              ? `One water molecule · thermal motion preview · H–O–H ${angle.toFixed(1)}° · O–H ${liveBondLength.toFixed(2)} Å`
              : `12 water molecules · ${contacts.length} H-bond candidate${contacts.length === 1 ? '' : 's'}`}
          </span>
          {!single && <span>Time {(frame.timeFs / 1000).toFixed(3)} ps</span>}
        </div>

        <svg
          viewBox="0 0 600 420"
          role="img"
          aria-label={
            single
              ? 'A bent water molecule oscillating with one oxygen and two hydrogen atoms.'
              : 'Twelve water molecules moving and rotating in a periodic box with dynamic hydrogen-bond guides.'
          }
        >
          <defs>
            <radialGradient id={`${id}-oxygen`} cx="30%" cy="25%">
              <stop stopColor="#ffd1b5" />
              <stop offset=".4" stopColor="#df6755" />
              <stop offset="1" stopColor="#842f32" />
            </radialGradient>
            <radialGradient id={`${id}-hydrogen`} cx="30%" cy="25%">
              <stop stopColor="#fffef7" />
              <stop offset="1" stopColor="#bda995" />
            </radialGradient>
            <clipPath id={`${id}-box`}>
              <rect x={LEFT} y="45" width={BOX.width * SCALE} height="330" />
            </clipPath>
          </defs>

          {!single && (
            <rect
              x={LEFT}
              y="45"
              width={BOX.width * SCALE}
              height="330"
              fill="#171411"
              fillOpacity=".25"
              stroke="#dab18b"
              strokeOpacity=".4"
              strokeDasharray="5 6"
            />
          )}

          {single && (
            <g fill="#bda995" fontSize="11">
              <text x="300" y="96" textAnchor="middle" fill="#e4c6ad" fontSize="12">
                {angle.toFixed(1)}° bent geometry · fixed covalent topology in MD
              </text>
              <circle cx="300" cy="238" r="78" fill="none" stroke="#d49d81" strokeOpacity=".16" strokeDasharray="3 6" />
            </g>
          )}

          <g clipPath={single ? undefined : `url(#${id}-box)`}>
            {copies.map(([dx, dy]) => (
              <g key={`${dx}-${dy}`}>
                {!single &&
                  contactsVisible &&
                  contacts.map(([i, j, ox, oy]) => {
                    const a = point(frame.atoms[i], i, dx, dy);
                    const b = point(frame.atoms[j], j, dx + ox, dy + oy);
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#89c7c3"
                        strokeWidth="1.6"
                        strokeDasharray="4 5"
                      />
                    );
                  })}
                {frame.bonds
                  .filter(([i]) => !single || i === 0)
                  .map(([i, j]) => {
                    const a = point(frame.atoms[i], i, dx, dy);
                    const b = point(frame.atoms[j], j, dx, dy);
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#e1ba99"
                        strokeWidth={single ? 10 : 4}
                        strokeLinecap="round"
                      />
                    );
                  })}
                {selected.map((a, i) => {
                  const p = point(a, i, dx, dy);
                  const isOxygen = a.element === 'O';
                  const radius = isOxygen ? (single ? 30 : 10) : single ? 20 : 6;
                  return (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={radius} fill={`url(#${id}-${isOxygen ? 'oxygen' : 'hydrogen'})`} />
                      {single && (
                        <text x={p.x} y={p.y + 5} textAnchor="middle" fill={isOxygen ? '#fff' : '#49372c'} fontSize="16">
                          {a.element}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
          {!single && (
            <text x="300" y="398" textAnchor="middle" fill="#b6a696" fontSize="10" letterSpacing="1">
              OPPOSITE EDGES CONNECT · NO WALLS
            </text>
          )}
        </svg>
      </div>

      <div className={s.simulationToolbar}>
        {playback}
        {guides}
      </div>

      <p className={s.simulationCaption}>
        {single
          ? 'One oxygen and two hydrogens form a bent molecule. Solid lines represent internal bonds; add neighbouring molecules to see how dashed electrostatic contacts come and go.'
          : contactsVisible
            ? 'Watch neighbouring molecules turn and move. Solid lines hold each molecule together; dashed teal guides mark hydrogen-bond candidates.'
            : 'Watch how each molecule moves and turns. Turn on the guides to track fleeting hydrogen-bond contacts between neighbours.'}
      </p>

      {error && (
        <p className={s.simulationError} role="alert">
          {error}
        </p>
      )}

      {!single && (
        <SmoothDetails className={s.simulationSettings} summary="Settings & model">
          <div className={s.settingsGrid}>
            <div className={s.settingsControls}>
              <label htmlFor={`${id}-temperature`} className={s.temperatureLabel}>
                <span>Initial temperature</span>
                <select
                  id={`${id}-temperature`}
                  value={initialTemperature}
                  onChange={e => reset(Number(e.target.value))}
                >
                  <option value="150">150 K</option>
                  <option value="300">300 K</option>
                  <option value="600">600 K</option>
                </select>
              </label>
              <p className={s.controlHint}>Changing temperature restarts the model with new starting speeds.</p>
              <label htmlFor={`${id}-rate`} className={styles.sliderLabel}>
                Playback speed <span>{rate.toFixed(1)}×</span>
              </label>
              <input
                id={`${id}-rate`}
                type="range"
                min=".5"
                max="2"
                step=".5"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
              />
            </div>
            <div>
              <dl className={s.physicsStats}>
                <div>
                  <dt>Simulated time</dt>
                  <dd>
                    {(frame.timeFs / 1000).toFixed(4)} <span>ps</span>
                  </dd>
                </div>
                <div>
                  <dt>Instantaneous temperature</dt>
                  <dd>
                    {observables.temperature.toFixed(0)} <span>K</span>
                  </dd>
                </div>
                <div>
                  <dt>Energy change / molecule</dt>
                  <dd>
                    {observables.driftPerMolecule.toFixed(4)} <span>kJ/mol</span>
                  </dd>
                </div>
                <div>
                  <dt>H-bond candidates</dt>
                  <dd>{contacts.length}</dd>
                </div>
              </dl>
              <p className={s.controlHint}>
                No thermostat: temperature fluctuates and can rise as the starting grid relaxes. Total energy stays nearly constant.
              </p>
              <p className={s.geometryReadout}>
                O–H: {BOND_LENGTH.toFixed(4)} Å · H–O–H: {angle.toFixed(2)}°
                <br />
                24 fixed covalent bonds · {STEP_FS} fs per step
              </p>
              <div className={s.physicsDetails}>
                <p>
                  Rigid planar molecules with{' '}
                  <a href="https://docs.lammps.org/Howto_tip3p.html" target="_blank" rel="noopener noreferrer">
                    original TIP3P site parameters
                  </a>
                  , Coulomb and oxygen–oxygen Lennard–Jones forces, and velocity-Verlet integration. A smooth molecular cutoff switches interactions off between 4.5 and 5.5 Å, including its force correction.
                </p>
                <p>
                  This run conserves energy (NVE); it has no thermostat. Starting velocities are sampled thermally, then adjusted to remove net drift and set the initial temperature. The grid is not an equilibrated liquid: molecules can warm as they settle into lower-energy arrangements. Temperature uses the 34 active planar degrees of freedom.
                </p>
                <p>
                  Dashed guides require O···O &lt; 3.5 Å, H···O &lt; 2.5 Å and O–H···O &gt; 150°. They identify contacts, not new covalent bonds. This small, two-dimensional model has no long-range electrostatics and does not reproduce quantitative bulk-water properties. Oxygen is red and hydrogen is ivory; atom sizes are illustrative.
                </p>
              </div>
            </div>
          </div>
        </SmoothDetails>
      )}
    </section>
  );
}
