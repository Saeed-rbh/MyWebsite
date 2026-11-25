import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import shared from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const REGIONS = [
  {
    id: 0,
    label: 'Closest to silver',
    metric: '+5.5 K peak @ 1.4 ps',
    feedback: 'The innermost hydration layer warms sharply first (~5.5 K near 1.4 ps) before transferring heat outward.',
  },
  {
    id: 1,
    label: 'Farther from silver',
    metric: '+2.4 K peak @ 3.15 ps',
    feedback: 'Outer shells see smaller, delayed peaks (around 3.15 ps). Comparing shell peaks tracks radial heat spreading.',
  },
  {
    id: 2,
    label: 'All the water together',
    metric: '< 0.8 K bath average',
    feedback: 'Averaging the whole bath washes out the localized 5 K pulse at the boundary and hides where warming began.',
  },
];

// Phenomenological envelope curves calibrated to Rajabpour, Seif, Arabha et al. (JCP 2019, Fig. 5):
// Inner shell peaks ~5.5 K around 1.4 ps; outer shell peaks lower (~2.4 K) near 3.15 ps; bulk stays < 0.8 K.
const shell1Delta = t => (t <= 0 ? 0 : 5.5 * (t / 1.4) * Math.exp(1 - t / 1.4));
const shell2Delta = t => (t <= 0.35 ? 0 : 2.4 * ((t - 0.35) / 2.8) * Math.exp(1 - (t - 0.35) / 2.8));
const bulkDelta = t => (t <= 0 ? 0 : 0.72 * (1 - Math.exp(-t / 1.6)) * Math.exp(-t / 14));

function buildCurvePath(fn) {
  const pts = [];
  for (let i = 0; i <= 50; i++) {
    const t = (i / 50) * 5.0;
    const x = 36 + (t / 5) * 232;
    const y = 114 - (Math.max(0, fn(t)) / 6.2) * 86;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

const PATH_SHELL1 = buildCurvePath(shell1Delta);
const PATH_SHELL2 = buildCurvePath(shell2Delta);
const PATH_BULK = buildCurvePath(bulkDelta);

export default function WaterShellExplorer() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [timePs, setTimePs] = useState(1.4);
  const [playing, setPlaying] = useState(() => !reduceMotion);

  useEffect(() => {
    if (!playing || reduceMotion) return undefined;
    let rafId;
    let last = performance.now();

    const step = now => {
      const dt = Math.min(50, Math.max(0, now - last));
      last = now;
      setTimePs(prev => {
        const next = prev + (dt / 1000) * 1.1;
        return next > 5 ? 0 : next;
      });
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [playing, reduceMotion]);

  const dT1 = shell1Delta(timePs);
  const dT2 = shell2Delta(timePs);
  const dTBulk = bulkDelta(timePs);

  const pulseRadius = 32 + (timePs / 5) * 84;
  const pulseOpacity = Math.max(0, 0.55 - (timePs / 5) * 0.45);
  const activeRegion = REGIONS[selected];

  const selectRegion = index => {
    setSelected(index);
    if (index === 0) setTimePs(1.4);
    if (index === 1) setTimePs(3.15);
    if (index === 2) setTimePs(2.4);
  };

  return (
    <div className={s.shellExplorer}>
      <div className={s.shellVisualColumn}>
        <svg viewBox="0 0 280 240" className={s.shellSvg} role="img" aria-label="Radial concentric water shells around a silver nanoparticle showing an outward heat pulse.">
          <defs>
            <radialGradient id="ag-core-grad" cx="35%" cy="30%">
              <stop stopColor="#fff2e2" />
              <stop offset=".5" stopColor="#d9b296" />
              <stop offset="1" stopColor="#74513d" />
            </radialGradient>
            <radialGradient id="heat-wave-grad">
              <stop offset="0%" stopColor="#f29b59" stopOpacity="0" />
              <stop offset="68%" stopColor="#f29b59" stopOpacity={pulseOpacity.toFixed(2)} />
              <stop offset="100%" stopColor="#f29b59" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Concentric water shells */}
          <circle
            cx="140"
            cy="112"
            r="96"
            fill={selected === 2 ? '#d49d812e' : `rgba(128,194,199,${0.05 + (dTBulk / 6) * 0.25})`}
            stroke={selected === 2 ? '#f3bd89' : '#80c2c778'}
            strokeWidth={selected === 2 ? 2 : 1}
          />
          <circle
            cx="140"
            cy="112"
            r="72"
            fill={selected === 1 ? `rgba(243,189,137,${0.12 + (dT2 / 6) * 0.35})` : `rgba(243,189,137,${(dT2 / 6) * 0.22})`}
            stroke={selected === 1 || selected === 2 ? '#f3bd89' : '#80c2c79a'}
            strokeWidth={selected === 1 || selected === 2 ? 2 : 1.1}
          />
          <circle
            cx="140"
            cy="112"
            r="50"
            fill={selected === 0 ? `rgba(242,155,89,${0.18 + (dT1 / 6) * 0.42})` : `rgba(242,155,89,${(dT1 / 6) * 0.3})`}
            stroke={selected === 0 || selected === 2 ? '#f3bd89' : '#80c2c7b5'}
            strokeWidth={selected === 0 || selected === 2 ? 2.2 : 1.2}
          />

          {/* Expanding thermal wave ring */}
          {timePs > 0.05 && (
            <circle cx="140" cy="112" r={pulseRadius} fill="url(#heat-wave-grad)" pointerEvents="none" />
          )}

          {/* Silver nanoparticle core */}
          <circle cx="140" cy="112" r="28" fill="url(#ag-core-grad)" stroke="#f1d0b5" strokeWidth="1.2" />
          <text x="140" y="117" textAnchor="middle" fill="#2c1d15" fontSize="14" fontWeight="600">
            Ag
          </text>

          <text x="140" y="226" textAnchor="middle" fill="#c7b5a4" fontSize="10.5">
            t = {timePs.toFixed(2)} ps · ΔT₁ {dT1.toFixed(1)} K · ΔT₂ {dT2.toFixed(1)} K
          </text>
        </svg>

        <div className={s.shellScrubberRow}>
          <button
            type="button"
            className={s.shellPlayBtn}
            onClick={() => setPlaying(prev => !prev)}
            aria-pressed={playing}
          >
            {playing ? 'Pause wave' : 'Play heat wave'}
          </button>
          <input
            type="range"
            min="0"
            max="5"
            step="0.05"
            value={timePs}
            aria-label="Simulation time in picoseconds"
            onChange={e => {
              setPlaying(false);
              setTimePs(Number(e.target.value));
            }}
          />
        </div>
      </div>

      <div className={s.shellPrompt}>
        <span className={shared.eyebrow}>Radial shell thermometer · J. Chem. Phys. 2019</span>
        <h3>Where would you look for warming first?</h3>

        <div className={s.shellChoices} role="group" aria-label="Choose where to measure the water temperature">
          {REGIONS.map(({ label }, index) => (
            <button
              key={label}
              type="button"
              aria-pressed={selected === index}
              onClick={() => selectRegion(index)}
            >
              {label}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 290 132" className={s.shellSparkline} role="img" aria-label="Shell temperature rise over 0 to 5 picoseconds">
          <path d="M36 22V114H268" fill="none" stroke="#b3957d" strokeOpacity=".35" />
          <text x="30" y="29" textAnchor="end" fill="#a89482" fontSize="9.5">+6 K</text>
          <text x="30" y="116" textAnchor="end" fill="#a89482" fontSize="9.5">0</text>
          <text x="268" y="128" textAnchor="end" fill="#a89482" fontSize="9.5">5.0 ps</text>

          <path d={PATH_BULK} fill="none" stroke="#9ea8a4" strokeWidth={selected === 2 ? 2.4 : 1.2} strokeDasharray="3 3" opacity={selected === 2 ? 1 : 0.45} />
          <path d={PATH_SHELL2} fill="none" stroke="#8bc6bd" strokeWidth={selected === 1 ? 2.6 : 1.5} opacity={selected === 1 ? 1 : 0.5} />
          <path d={PATH_SHELL1} fill="none" stroke="#f29b59" strokeWidth={selected === 0 ? 2.8 : 1.6} opacity={selected === 0 ? 1 : 0.55} />

          <line
            x1={36 + (timePs / 5) * 232}
            y1="22"
            x2={36 + (timePs / 5) * 232}
            y2="114"
            stroke="#f1d7c3"
            strokeOpacity=".45"
            strokeDasharray="2 3"
          />
          <circle cx={36 + (timePs / 5) * 232} cy={114 - (dT1 / 6.2) * 86} r="3.6" fill="#f29b59" />
          <circle cx={36 + (timePs / 5) * 232} cy={114 - (dT2 / 6.2) * 86} r="3.2" fill="#8bc6bd" />
          <circle cx={36 + (timePs / 5) * 232} cy={114 - (dTBulk / 6.2) * 86} r="2.8" fill="#c7bdb3" />
        </svg>

        <p className={s.shellFeedback} aria-live="polite">
          <strong>{activeRegion.metric}:</strong> {activeRegion.feedback}
        </p>
      </div>
    </div>
  );
}
