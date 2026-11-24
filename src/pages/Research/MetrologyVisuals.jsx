import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './Metrology.module.css';

const DIAGNOSTIC_LENSES = [
  {
    id: 'uv-vis',
    sectionId: 'concentration',
    step: '03',
    label: 'UV–Vis',
    probe: 'Optical transmission',
    scale: 'Bulk dispersion · g L⁻¹',
    question: 'How much solid is dispersed?',
    metric: 'I / I₀ attenuation',
  },
  {
    id: 'tem',
    sectionId: 'see-the-sheets',
    step: '04',
    label: 'TEM / STEM',
    probe: 'Transmitted electrons',
    scale: 'Flake to 0.2 nm lattice',
    question: 'Did it peel into thin crystals?',
    metric: 'Shape + local FFT',
  },
  {
    id: 'afm',
    sectionId: 'afm-thickness',
    step: '05',
    label: 'AFM',
    probe: 'Cantilever step probe',
    scale: 'Vertical height · ~1 nm',
    question: 'How high above the support?',
    metric: 'Step height profile',
  },
  {
    id: 'sem',
    sectionId: 'sem-morphology',
    step: '06',
    label: 'SEM',
    probe: 'Secondary electrons',
    scale: 'Wide surface · µm field',
    question: 'Spread out or clumped?',
    metric: 'Coverage & packing',
  },
  {
    id: 'xps',
    sectionId: 'check-the-chemistry',
    step: '07',
    label: 'XPS',
    probe: 'Escaping photoelectrons',
    scale: 'Top ~5 nm · eV bonds',
    question: 'Did surface bonds oxidize?',
    metric: 'Binding energy states',
  },
  {
    id: 'raman',
    sectionId: 'read-the-vibrations',
    step: '08',
    label: 'Raman',
    probe: 'Inelastic laser scatter',
    scale: 'Lattice phonons · cm⁻¹',
    question: 'How do the atoms vibrate?',
    metric: 'Peak gap Δ & D/G/2D',
  },
];

function HeroProbeOverlay({ lensId, reduceMotion }) {
  switch (lensId) {
    case 'uv-vis':
      return (
        <g>
          <path d="M 38 144 H 104" stroke="#e9b594" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="104,144 96,139 96,149" fill="#e9b594" />
          <line x1="106" y1="144" x2="174" y2="144" stroke="#e9b594" strokeWidth="2" strokeOpacity="0.45" />
          <line x1="140" y1="144" x2="155" y2="122" stroke="#8bc6bd" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="140" y1="144" x2="156" y2="168" stroke="#8bc6bd" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M 176 144 H 236" stroke="#8bc6bd" strokeWidth="2" strokeLinecap="round" />
          <polygon points="236,144 228,139 228,149" fill="#8bc6bd" />
          <rect x="242" y="130" width="12" height="28" rx="2" fill="#211a15" stroke="#8bc6bd" strokeWidth="1.2" />
          <text x="58" y="134" fill="#e9b594" fontSize="11" fontFamily="Rubik, sans-serif">I₀</text>
          <text x="205" y="134" fill="#8bc6bd" fontSize="11" fontFamily="Rubik, sans-serif">I</text>
        </g>
      );
    case 'tem':
      return (
        <g>
          <path d="M 140 24 L 140 120" stroke="#8bc6bd" strokeWidth="1.8" strokeDasharray="3 2" />
          <polygon points="140,124 135,116 145,116" fill="#8bc6bd" />
          <path d="M 122 142 H 158" stroke="#e9b594" strokeWidth="2.5" />
          <path d="M 140 146 L 140 236" stroke="#8bc6bd" strokeWidth="2.2" />
          <ellipse cx="140" cy="240" rx="22" ry="6" fill="#8bc6bd33" stroke="#8bc6bd" strokeWidth="1.2" />
          <g transform="translate(226, 138)">
            <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="none" stroke="#8bc6bd" strokeWidth="0.9" strokeOpacity="0.55" />
            {[[0,-16],[14,-8],[14,8],[0,16],[-14,8],[-14,-8],[0,0]].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r={idx === 6 ? 2.6 : 1.9} fill="#8bc6bd" />
            ))}
          </g>
          <text x="200" y="170" fill="#b9a99b" fontSize="10" fontFamily="Rubik, sans-serif">FFT lattice</text>
        </g>
      );
    case 'afm':
      return (
        <g>
          <line x1="94" y1="88" x2="144" y2="112" stroke="#e9b594" strokeWidth="1.6" />
          <polygon points="132,110 144,110 138,128" fill="#d49d81" />
          <rect x="112" y="128" width="56" height="5" rx="1" fill="#e9b594" />
          <line x1="96" y1="133" x2="184" y2="133" stroke="#9e8a78" strokeWidth="1.5" />
          <path d="M 138 110 L 180 78" stroke="#8bc6bd" strokeWidth="1.6" />
          <path d="M 192 146 L 210 146 L 214 134 L 240 134 L 244 146 L 258 146" fill="none" stroke="#8bc6bd" strokeWidth="1.8" />
          <text x="192" y="164" fill="#8bc6bd" fontSize="10" fontFamily="Rubik, sans-serif">Step ~nm</text>
        </g>
      );
    case 'sem':
      return (
        <g>
          <path d="M 140 34 L 140 132" stroke="#e9b594" strokeWidth="1.8" />
          <path d="M 128 118 H 152" stroke="#8bc6bd" strokeWidth="1.2" markerStart="url(#hero-arrow-l)" />
          <path d="M 140 134 Q 178 122 214 102" fill="none" stroke="#8bc6bd" strokeWidth="1.6" />
          <path d="M 140 134 Q 172 138 208 118" fill="none" stroke="#8bc6bd" strokeWidth="1.2" strokeOpacity="0.8" />
          <rect x="210" y="94" width="22" height="16" rx="3" transform="rotate(-24 210 94)" fill="#211a15" stroke="#8bc6bd" strokeWidth="1.2" />
          <text x="184" y="138" fill="#8bc6bd" fontSize="10" fontFamily="Rubik, sans-serif">Secondary e⁻</text>
        </g>
      );
    case 'xps':
      return (
        <g>
          <path d="M 52 94 Q 72 86 88 104 T 124 126" fill="none" stroke="#e9b594" strokeWidth="2" />
          <polygon points="128,129 119,127 125,120" fill="#e9b594" />
          <path d="M 134 128 Q 146 96 176 74" fill="none" stroke="#8bc6bd" strokeWidth="1.8" />
          <circle cx="152" cy="94" r="3" fill="#8bc6bd" />
          <circle cx="168" cy="80" r="2.5" fill="#8bc6bd" />
          <path d="M 164 68 A 28 28 0 0 1 218 68 Z" fill="#211a15" stroke="#d49d81" strokeWidth="1.4" />
          <text x="48" y="84" fill="#e9b594" fontSize="10" fontFamily="Rubik, sans-serif">X-rays (hν)</text>
          <text x="180" y="102" fill="#8bc6bd" fontSize="10" fontFamily="Rubik, sans-serif">e⁻ (E_B)</text>
        </g>
      );
    case 'raman':
    default:
      return (
        <g>
          <path d="M 140 42 L 130 136 L 150 136 Z" fill="#e9b59426" stroke="#e9b594" strokeWidth="1.3" />
          <motion.circle
            cx="140"
            cy="138"
            r="5"
            fill="#8bc6bd"
            animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.85, 0.4, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <path d="M 148 134 L 194 74" stroke="#8bc6bd" strokeWidth="1.7" strokeDasharray="3 2" />
          <path d="M 192 128 L 204 128 L 210 100 L 216 128 L 228 128 L 234 114 L 240 128 L 252 128" fill="none" stroke="#8bc6bd" strokeWidth="1.6" />
          <text x="196" y="144" fill="#8bc6bd" fontSize="10" fontFamily="Rubik, sans-serif">Shift Δν</text>
        </g>
      );
  }
}

export function HeroDiagnosticRig({ activeChapterId, onNavigate }) {
  const matched = DIAGNOSTIC_LENSES.find(l => l.sectionId === activeChapterId);
  const [selectedId, setSelectedId] = useState(null);
  const reduceMotion = useReducedMotion();
  const activeLens = DIAGNOSTIC_LENSES.find(l => l.id === selectedId) || matched || DIAGNOSTIC_LENSES[0];

  return (
    <section className={styles.heroRig} aria-label="One sample, six characterization methods">
      <div className={styles.heroRigVisual}>
        <div className={styles.heroRigMeta}>
          <span className={styles.eyebrowLocal}>One sample · Six lenses</span>
          <span>{activeLens.label} — {activeLens.scale}</span>
        </div>
        <svg viewBox="0 0 280 250" className={styles.heroRigSvg} role="img" aria-label={`Dispersion vial inspected with ${activeLens.label}: ${activeLens.probe}`}>
          <defs>
            <linearGradient id="hero-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b452d" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#261910" stopOpacity="0.88" />
            </linearGradient>
          </defs>
          {/* Vial silhouette */}
          <rect x="114" y="42" width="52" height="16" rx="3" fill="#2b2119" stroke="#d49d8166" strokeWidth="1.2" />
          <path d="M 122 58 L 122 72 L 100 94 L 100 202 Q 100 214 112 214 L 168 214 Q 180 214 180 202 L 180 94 L 158 72 L 158 58" fill="#17130f" stroke="#d49d8155" strokeWidth="1.4" />
          {/* Dispersion liquid fill */}
          <path d="M 103 108 Q 140 113 177 108 L 177 200 Q 177 211 167 211 L 113 211 Q 103 211 103 200 Z" fill="url(#hero-liquid)" />
          <ellipse cx="140" cy="108" rx="37" ry="4" fill="#c98f6b2e" stroke="#e9b59455" strokeWidth="0.9" />
          {/* Suspended nanosheets */}
          <motion.g
            animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <polygon points="116,136 130,130 136,142 121,146" fill="#e9b59444" stroke="#e9b59488" strokeWidth="0.8" />
            <polygon points="146,154 162,148 166,162 150,165" fill="#8bc6bd38" stroke="#8bc6bd80" strokeWidth="0.8" />
            <polygon points="122,174 139,170 144,183 128,188" fill="#e9b59436" stroke="#e9b59477" strokeWidth="0.8" />
            <polygon points="151,126 164,123 168,134 156,136" fill="#f0dccb2e" stroke="#f0dccb66" strokeWidth="0.8" />
            <polygon points="135,191 154,187 159,198 139,200" fill="#d49d8138" stroke="#d49d8170" strokeWidth="0.8" />
          </motion.g>
          {/* Active diagnostic probe */}
          <HeroProbeOverlay lensId={activeLens.id} reduceMotion={reduceMotion} />
          <text x="140" y="232" textAnchor="middle" fill="#a99a8c" fontSize="10" fontFamily="Rubik, sans-serif">
            Exfoliated dispersion
          </text>
        </svg>
        <p className={styles.heroRigReadout}>
          <strong>{activeLens.probe}</strong> · {activeLens.question}
        </p>
      </div>

      <div className={styles.heroLensRail} role="group" aria-label="Jump directly to a characterization method">
        {DIAGNOSTIC_LENSES.map(lens => {
          const isCurrent = lens.id === activeLens.id;
          return (
            <button
              key={lens.id}
              type="button"
              className={styles.heroLensCard}
              data-active={isCurrent || undefined}
              onMouseEnter={() => setSelectedId(lens.id)}
              onFocus={() => setSelectedId(lens.id)}
              onClick={() => onNavigate(lens.sectionId)}
            >
              <span className={styles.heroLensTop}>
                <span>{lens.step} · {lens.label}</span>
                <span aria-hidden="true">↗</span>
              </span>
              <strong>{lens.question}</strong>
              <small>{lens.metric}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function UVVisSchematic({ reduceMotion }) {
  return (
    <svg viewBox="0 0 580 330" className={styles.schematicSvg} role="img" aria-label="UV-Vis transmission schematic: light passes through a wavelength selector, a nanosheet cuvette with absorption and scattering, into a photodiode detector">
      {/* Optical axis */}
      <line x1="48" y1="168" x2="532" y2="168" stroke="#d49d8126" strokeDasharray="4 4" />
      {/* Light source */}
      <circle cx="72" cy="168" r="24" fill="#2c2017" stroke="#e9b594" strokeWidth="1.8" />
      <circle cx="72" cy="168" r="10" fill="#f2bd99" />
      <text x="72" y="126" textAnchor="middle" fill="#f0dccb" fontSize="13">Light source</text>
      <text x="72" y="214" textAnchor="middle" fill="#b9a99b" fontSize="11">Broadband lamp</text>

      {/* Monochromator */}
      <polygon points="164,120 194,132 194,204 164,216" fill="#231b15" stroke="#d49d81" strokeWidth="1.6" />
      <line x1="98" y1="168" x2="164" y2="168" stroke="#f2bd99" strokeWidth="4" strokeOpacity="0.8" />
      <text x="179" y="102" textAnchor="middle" fill="#f0dccb" fontSize="13">Selector (λ)</text>
      <text x="179" y="236" textAnchor="middle" fill="#b9a99b" fontSize="11">Narrow band</text>

      {/* Incident beam I0 */}
      <line x1="194" y1="168" x2="294" y2="168" stroke="#e9b594" strokeWidth="3.5" />
      {!reduceMotion && (
        <motion.circle
          cy="168"
          r="4"
          fill="#faf0e6"
          animate={{ cx: [198, 290] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <text x="244" y="155" textAnchor="middle" fill="#e9b594" fontSize="14" fontWeight="500">I₀</text>
      <text x="244" y="186" textAnchor="middle" fill="#b9a99b" fontSize="10.5">Reference path</text>

      {/* Cuvette */}
      <rect x="294" y="96" width="84" height="144" rx="5" fill="#17130f" stroke="#d49d81" strokeWidth="1.6" />
      <rect x="298" y="120" width="76" height="116" rx="2" fill="#704a3044" />
      <line x1="298" y1="120" x2="374" y2="120" stroke="#e9b59466" strokeWidth="1.2" />
      <polygon points="315,150 330,145 333,157 318,160" fill="#e9b59466" stroke="#e9b594" strokeWidth="0.9" />
      <polygon points="342,166 359,161 362,174 345,177" fill="#e9b59455" stroke="#e9b594" strokeWidth="0.9" />
      <polygon points="322,190 339,186 341,197 325,200" fill="#e9b59455" stroke="#e9b594" strokeWidth="0.9" />
      <text x="336" y="78" textAnchor="middle" fill="#f0dccb" fontSize="13">Cuvette (c · l)</text>

      {/* Scattered light rays */}
      <path d="M 336 168 L 358 134" stroke="#8bc6bd" strokeWidth="1.3" strokeDasharray="3 3" />
      <path d="M 336 168 L 364 202" stroke="#8bc6bd" strokeWidth="1.3" strokeDasharray="3 3" />
      <text x="394" y="114" fill="#8bc6bd" fontSize="11">Absorbed &amp;</text>
      <text x="394" y="128" fill="#8bc6bd" fontSize="11">scattered out</text>

      {/* Transmitted beam I */}
      <line x1="378" y1="168" x2="480" y2="168" stroke="#8bc6bd" strokeWidth="2.4" />
      <polygon points="480,168 471,163 471,173" fill="#8bc6bd" />
      <text x="430" y="155" textAnchor="middle" fill="#8bc6bd" fontSize="14" fontWeight="500">I</text>

      {/* Detector */}
      <rect x="484" y="132" width="48" height="72" rx="6" fill="#231c16" stroke="#8bc6bd" strokeWidth="1.6" />
      <circle cx="496" cy="168" r="10" fill="#8bc6bd44" stroke="#8bc6bd" strokeWidth="1.2" />
      <text x="508" y="116" textAnchor="middle" fill="#f0dccb" fontSize="13">Detector</text>
      <text x="290" y="294" textAnchor="middle" fill="#c9bfb5" fontSize="12">
        Apparent absorbance: A = log₁₀(I₀ / I) = α · c · l
      </text>
    </svg>
  );
}

function TemSchematic({ reduceMotion }) {
  return (
    <svg viewBox="0 0 580 340" className={styles.schematicSvg} role="img" aria-label="TEM and STEM transmission column cutaway showing an electron gun, condenser lenses, a thin nanosheet on a grid, projector lenses, transmitted beam, detector and hexagonal FFT pattern">
      {/* Column wall framing */}
      <path d="M 105 26 H 265 V 298 H 105 Z" fill="#16120f" stroke="#d49d8138" strokeWidth="1.2" />
      {/* Electron source */}
      <polygon points="170,38 200,38 192,62 178,62" fill="#e9b594" />
      <text x="282" y="54" fill="#f0dccb" fontSize="13">Electron gun</text>
      <line x1="205" y1="49" x2="274" y2="49" stroke="#d49d8166" />

      {/* Condenser lens coils */}
      <rect x="122" y="84" width="38" height="16" rx="4" fill="#3a291d" stroke="#d49d81" strokeWidth="1.4" />
      <rect x="210" y="84" width="38" height="16" rx="4" fill="#3a291d" stroke="#d49d81" strokeWidth="1.4" />
      <text x="282" y="96" fill="#f0dccb" fontSize="13">Condenser lenses</text>
      <line x1="252" y1="92" x2="274" y2="92" stroke="#d49d8166" />

      {/* Electron beam envelope */}
      <polygon points="185,62 204,92 185,156 166,92" fill="#8bc6bd26" stroke="#8bc6bd" strokeWidth="1.3" />
      <motion.g
        animate={reduceMotion ? undefined : { x: [-8, 8, -8] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="168" y1="138" x2="202" y2="138" stroke="#e9b594" strokeWidth="1.4" />
        <polygon points="164,138 171,134 171,142" fill="#e9b594" />
        <polygon points="206,138 199,134 199,142" fill="#e9b594" />
      </motion.g>
      <text x="88" y="142" textAnchor="end" fill="#e9b594" fontSize="11.5">STEM scan</text>

      {/* Thin specimen on lacy grid */}
      <line x1="115" y1="162" x2="255" y2="162" stroke="#8f8175" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="148" y="157" width="74" height="6" rx="2" fill="#e9b594" />
      <text x="282" y="164" fill="#f0dccb" fontSize="13">Thin specimen on grid</text>
      <line x1="258" y1="160" x2="274" y2="160" stroke="#d49d8166" />

      {/* Objective / Projector lenses */}
      <rect x="122" y="198" width="38" height="16" rx="4" fill="#3a291d" stroke="#d49d81" strokeWidth="1.4" />
      <rect x="210" y="198" width="38" height="16" rx="4" fill="#3a291d" stroke="#d49d81" strokeWidth="1.4" />
      <text x="282" y="210" fill="#f0dccb" fontSize="13">Projector lenses</text>
      <line x1="252" y1="206" x2="274" y2="206" stroke="#d49d8166" />

      {/* Transmitted electrons */}
      <polygon points="185,164 166,206 164,264 206,264 204,206" fill="#8bc6bd2e" stroke="#8bc6bd" strokeWidth="1.4" />
      <text x="282" y="242" fill="#8bc6bd" fontSize="12.5">Transmitted electrons</text>

      {/* Bottom detector */}
      <rect x="140" y="268" width="90" height="14" rx="4" fill="#8bc6bd44" stroke="#8bc6bd" strokeWidth="1.6" />
      <text x="282" y="279" fill="#f0dccb" fontSize="13">Detector (bright / dark field)</text>

      {/* Right panel: Local crystal FFT pattern */}
      <rect x="424" y="64" width="128" height="128" rx="10" fill="#100e0c" stroke="#d49d8140" strokeWidth="1.2" />
      <g transform="translate(488, 128)">
        <polygon points="0,-32 28,-16 28,16 0,32 -28,16 -28,-16" fill="none" stroke="#8bc6bd55" strokeDasharray="3 3" />
        {[[0,-32],[28,-16],[28,16],[0,32],[-28,16],[-28,-16],[0,0]].map(([cx, cy], idx) => (
          <circle key={idx} cx={cx} cy={cy} r={idx === 6 ? 5.5 : 3.6} fill={idx === 6 ? '#f2bd99' : '#8bc6bd'} />
        ))}
      </g>
      <text x="488" y="214" textAnchor="middle" fill="#c9bfb5" fontSize="11.5">HRTEM FFT symmetry</text>
      <text x="488" y="230" textAnchor="middle" fill="#9e8a78" fontSize="10.5">(local crystalline order)</text>
    </svg>
  );
}

function AfmSchematic({ reduceMotion }) {
  const [trappedWater, setTrappedWater] = useState(false);
  const waterOffset = trappedWater ? 18 : 0;

  return (
    <div className={styles.interactiveSchematic}>
      <div className={styles.schematicControls} role="group" aria-label="AFM height artifact condition">
        <button
          type="button"
          aria-pressed={!trappedWater}
          onClick={() => setTrappedWater(false)}
        >
          Clean contact
        </button>
        <button
          type="button"
          aria-pressed={trappedWater}
          onClick={() => setTrappedWater(true)}
        >
          + Trapped water under flake
        </button>
      </div>

      <svg viewBox="0 0 580 340" className={styles.schematicSvg} role="img" aria-label={`AFM cantilever schematic ${trappedWater ? 'with trapped water raising apparent flake height' : 'showing clean flake step height'}`}>
        {/* Cantilever & laser assembly */}
        <rect x="44" y="96" width="44" height="36" rx="4" fill="#2c2219" stroke="#d49d81" strokeWidth="1.4" />
        <motion.g
          animate={{ y: -waterOffset * 0.45 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d="M 88 106 L 318 112 L 318 122 L 88 119 Z" fill="#c99f7d" stroke="#f0dccb88" strokeWidth="1" />
          {/* Sharp AFM tip */}
          <polygon points="292,121 312,121 302,168" fill="#f0dccb" stroke="#d49d81" strokeWidth="1" />
          <text x="200" y="96" textAnchor="middle" fill="#f0dccb" fontSize="13">Cantilever</text>
          <text x="330" y="146" fill="#f0dccb" fontSize="12.5">Tip</text>
        </motion.g>

        {/* Laser diode + reflected ray to quadrant photodiode */}
        <rect x="116" y="34" width="38" height="18" rx="4" transform="rotate(24 116 34)" fill="#2a2119" stroke="#e9b594" strokeWidth="1.4" />
        <line x1="148" y1="54" x2="302" y2={112 - waterOffset * 0.45} stroke="#8bc6bd" strokeWidth="2.2" />
        <line x1="302" y1={112 - waterOffset * 0.45} x2="462" y2={58 - (trappedWater ? 8 : 0)} stroke="#8bc6bd" strokeWidth="2.2" />
        <text x="206" y="42" fill="#e9b594" fontSize="12.5">Laser tracks arm</text>

        {/* Quadrant photodiode */}
        <g transform="translate(464, 30)">
          <rect width="54" height="54" rx="6" fill="#211913" stroke="#d49d81" strokeWidth="1.4" />
          <line x1="27" y1="4" x2="27" y2="50" stroke="#d49d8155" />
          <line x1="4" y1="27" x2="50" y2="27" stroke="#d49d8155" />
          <motion.circle
            cx="24"
            r="5"
            fill="#8bc6bd"
            animate={{ cy: trappedWater ? 19 : 27 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
          />
          <text x="27" y="72" textAnchor="middle" fill="#f0dccb" fontSize="12.5">Photodiode</text>
        </g>

        {/* Substrate + optional trapped water + flake */}
        <rect x="76" y="190" width="428" height="22" rx="3" fill="#2c2621" stroke="#8f8175" strokeWidth="1.2" />
        <text x="112" y="206" fill="#c9bfb5" fontSize="11.5">Flat substrate</text>

        {trappedWater && (
          <motion.rect
            x="212"
            y="174"
            width="180"
            height="16"
            rx="3"
            fill="#8bc6bd38"
            stroke="#8bc6bd"
            strokeDasharray="4 2"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        <motion.g
          animate={{ y: -waterOffset }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <rect x="206" y="176" width="192" height="14" rx="2" fill="#d49d81" stroke="#f2bd99" strokeWidth="1.2" />
          <text x="412" y="187" fill="#e9b594" fontSize="12.5">2D flake</text>
        </motion.g>

        {trappedWater && (
          <text x="302" y="186" textAnchor="middle" fill="#8bc6bd" fontSize="10.5">
            Trapped water / residue cushions flake upward
          </text>
        )}

        {/* Bottom Live Step-Height Trace */}
        <rect x="76" y="232" width="428" height="86" rx="8" fill="#14110d" stroke="#d49d8138" strokeWidth="1.2" />
        <line x1="100" y1="296" x2="484" y2="296" stroke="#8f817544" strokeDasharray="3 3" />
        <motion.path
          fill="none"
          stroke={trappedWater ? '#8bc6bd' : '#e9b594'}
          strokeWidth="2.5"
          animate={{
            d: trappedWater
              ? 'M 100 296 L 200 296 L 210 250 L 392 250 L 402 296 L 484 296'
              : 'M 100 296 L 200 296 L 210 272 L 392 272 L 402 296 L 484 296',
          }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <text x="108" y="252" fill="#f0dccb" fontSize="12">Measured line profile</text>
        <text x="478" y="252" textAnchor="end" fill={trappedWater ? '#8bc6bd' : '#e9b594'} fontSize="12">
          {trappedWater ? 'Apparent step inflated by residue' : 'Bare substrate → flake top step'}
        </text>
      </svg>
    </div>
  );
}

function SemSchematic({ reduceMotion }) {
  const [clumped, setClumped] = useState(false);

  return (
    <div className={styles.interactiveSchematic}>
      <div className={styles.schematicControls} role="group" aria-label="SEM sample dispersion condition">
        <button
          type="button"
          aria-pressed={!clumped}
          onClick={() => setClumped(false)}
        >
          Well-spread flakes
        </button>
        <button
          type="button"
          aria-pressed={clumped}
          onClick={() => setClumped(true)}
        >
          Clumped / insulator charging
        </button>
      </div>

      <svg viewBox="0 0 580 340" className={styles.schematicSvg} role="img" aria-label={`SEM surface scanning schematic showing ${clumped ? 'agglomerated flakes with charging glow' : 'well-separated flakes emitting secondary electrons toward a side detector'}`}>
        {/* Gun & objective column */}
        <polygon points="212,26 244,26 236,54 220,54" fill="#e9b594" />
        <text x="276" y="44" fill="#f0dccb" fontSize="13">Electron source</text>

        <rect x="172" y="76" width="34" height="16" rx="4" fill="#3a291d" stroke="#d49d81" strokeWidth="1.4" />
        <rect x="250" y="76" width="34" height="16" rx="4" fill="#3a291d" stroke="#d49d81" strokeWidth="1.4" />
        <text x="298" y="88" fill="#f0dccb" fontSize="13">Focusing lenses</text>

        {/* Sweeping primary beam */}
        <motion.g
          animate={reduceMotion ? undefined : { x: [-28, 28, -28] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polygon points="228,54 222,92 228,224 234,92" fill="#e9b59436" stroke="#e9b594" strokeWidth="1.5" />
        </motion.g>
        <text x="150" y="156" textAnchor="end" fill="#e9b594" fontSize="12.5">Scanning</text>
        <text x="150" y="171" textAnchor="end" fill="#e9b594" fontSize="12.5">beam (⟷)</text>

        {/* Secondary electrons escaping to side detector */}
        <path d="M 232 224 Q 304 174 398 150" fill="none" stroke="#8bc6bd" strokeWidth="2.2" />
        <polygon points="402,149 392,147 395,156" fill="#8bc6bd" />
        <path d="M 236 226 Q 318 202 396 164" fill="none" stroke="#8bc6bd" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="334" y="206" fill="#8bc6bd" fontSize="12.5">Secondary e⁻</text>

        {/* Side Detector */}
        <g transform="translate(402, 128) rotate(-18)">
          <rect width="74" height="38" rx="6" fill="#231c16" stroke="#8bc6bd" strokeWidth="1.6" />
          <circle cx="8" cy="19" r="10" fill="#8bc6bd44" stroke="#8bc6bd" strokeWidth="1.2" />
        </g>
        <text x="456" y="106" textAnchor="middle" fill="#f0dccb" fontSize="13">Side detector</text>

        {/* Sample stage + flakes */}
        <rect x="64" y="232" width="320" height="24" rx="4" fill="#2b2520" stroke="#8f8175" strokeWidth="1.2" />
        {!clumped ? (
          <g>
            <polygon points="104,225 148,222 152,231 106,232" fill="#d49d81" stroke="#f0dccb" strokeWidth="0.9" />
            <polygon points="186,223 252,221 258,231 188,231" fill="#e9b594" stroke="#f0dccb" strokeWidth="0.9" />
            <polygon points="282,224 334,222 338,231 284,232" fill="#d49d81" stroke="#f0dccb" strokeWidth="0.9" />
            <text x="224" y="286" textAnchor="middle" fill="#c9bfb5" fontSize="12">
              Separated flakes reveal lateral footprint across support
            </text>
          </g>
        ) : (
          <g>
            <circle cx="228" cy="218" r="46" fill="#8bc6bd22" />
            <polygon points="174,218 232,208 242,222 180,228" fill="#d49d81" stroke="#8bc6bd" strokeWidth="1.6" />
            <polygon points="204,202 266,194 274,212 208,218" fill="#e9b594" stroke="#8bc6bd" strokeWidth="1.6" />
            <polygon points="190,224 258,220 264,231 192,232" fill="#b88463" stroke="#f0dccb" strokeWidth="1" />
            <text x="224" y="286" textAnchor="middle" fill="#8bc6bd" fontSize="12">
              Clumping or trapped charge on insulators (e.g. h-BN) distorts contrast
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function XpsSchematic({ reduceMotion }) {
  return (
    <svg viewBox="0 0 580 340" className={styles.schematicSvg} role="img" aria-label="XPS photoelectron schematic showing oblique X-rays ejecting surface electrons into a hemispherical kinetic energy analyzer">
      {/* Oblique X-ray photons */}
      <path d="M 48 112 Q 72 96 92 122 T 136 146 T 182 172 T 216 196" fill="none" stroke="#e9b594" strokeWidth="2.6" />
      <polygon points="222,200 210,198 217,188" fill="#e9b594" />
      <path d="M 38 136 Q 62 120 82 146 T 126 170 T 172 196" fill="none" stroke="#d49d8199" strokeWidth="1.8" />
      <text x="58" y="88" fill="#e9b594" fontSize="13">Incident X-rays (hν)</text>

      {/* Hemispherical Energy Analyzer */}
      <path d="M 270 124 A 96 96 0 0 1 462 124 Z" fill="#211913" stroke="#d49d81" strokeWidth="1.8" />
      <path d="M 298 124 A 68 68 0 0 1 434 124" fill="none" stroke="#e9b59466" strokeWidth="1.4" />
      <rect x="300" y="124" width="28" height="28" fill="#211913" stroke="#d49d81" strokeWidth="1.4" />
      <text x="366" y="18" textAnchor="middle" fill="#f0dccb" fontSize="13">Hemispherical energy analyzer</text>
      <text x="366" y="114" textAnchor="middle" fill="#b9a99b" fontSize="11">Curved electric field</text>

      {/* Photoelectrons curving through analyzer */}
      <path d="M 232 204 Q 290 172 314 138" fill="none" stroke="#8bc6bd" strokeWidth="2.2" />
      <path d="M 314 138 C 314 78 418 78 418 132" fill="none" stroke="#8bc6bd" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="404" y="132" width="28" height="16" rx="3" fill="#8bc6bd44" stroke="#8bc6bd" strokeWidth="1.3" />
      <text x="418" y="166" textAnchor="middle" fill="#8bc6bd" fontSize="11">Detector</text>
      {!reduceMotion && (
        <motion.circle
          r="4.5"
          fill="#8bc6bd"
          animate={{ cx: [232, 276, 314], cy: [204, 174, 138] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <text x="236" y="148" textAnchor="end" fill="#8bc6bd" fontSize="12.5">Photoelectrons</text>

      {/* Surface layers stack */}
      <rect x="134" y="206" width="268" height="12" rx="3" fill="#8bc6bd38" stroke="#8bc6bd" strokeWidth="1.4" />
      <rect x="134" y="224" width="268" height="12" rx="3" fill="#d49d812e" stroke="#d49d8166" strokeWidth="1.1" />
      <rect x="134" y="242" width="268" height="12" rx="3" fill="#d49d811c" stroke="#d49d8144" strokeWidth="1" />
      <text x="416" y="216" fill="#8bc6bd" fontSize="11.5">Top ~5 nm probed</text>
      <text x="416" y="242" fill="#9e8a78" fontSize="11">Deeper bulk layers</text>
      <text x="290" y="302" textAnchor="middle" fill="#c9bfb5" fontSize="12">
        Measures electron binding energy (E_B) → surface chemical bonds
      </text>
    </svg>
  );
}

function RamanSchematic({ reduceMotion }) {
  return (
    <svg viewBox="0 0 580 340" className={styles.schematicSvg} role="img" aria-label="Confocal Raman backscattering schematic: laser passes through a beam splitter and objective onto a vibrating 2D crystal, and inelastic shifted light returns through a Rayleigh filter to a spectrometer and detector">
      {/* Laser */}
      <rect x="34" y="64" width="84" height="36" rx="5" fill="#231b15" stroke="#e9b594" strokeWidth="1.5" />
      <text x="76" y="87" textAnchor="middle" fill="#f0dccb" fontSize="13">Laser</text>

      {/* Beam splitter */}
      <rect x="206" y="54" width="54" height="54" rx="4" fill="#1b1511" stroke="#d49d81" strokeWidth="1.5" />
      <line x1="206" y1="54" x2="260" y2="108" stroke="#f0dccb88" strokeWidth="1.5" />
      <text x="233" y="38" textAnchor="middle" fill="#f0dccb" fontSize="12.5">Beam splitter</text>

      {/* Laser beam path: horizontal then vertical */}
      <line x1="118" y1="82" x2="226" y2="82" stroke="#e9b594" strokeWidth="3" />
      <line x1="226" y1="82" x2="226" y2="238" stroke="#e9b594" strokeWidth="2.4" />

      {/* Objective */}
      <polygon points="198,136 268,136 254,186 212,186" fill="#2c2119" stroke="#d49d81" strokeWidth="1.5" />
      <text x="184" y="164" textAnchor="end" fill="#f0dccb" fontSize="12.5">Objective</text>

      {/* Collected Raman beam returning upward and rightward */}
      <line x1="240" y1="238" x2="240" y2="76" stroke="#8bc6bd" strokeWidth="2.4" />
      <line x1="240" y1="82" x2="486" y2="82" stroke="#8bc6bd" strokeWidth="2.4" />

      {/* Rayleigh rejection filter */}
      <ellipse cx="332" cy="82" rx="7" ry="28" fill="#2c2119" stroke="#e9b594" strokeWidth="1.8" />
      <text x="332" y="42" textAnchor="middle" fill="#e9b594" fontSize="12">Rayleigh filter</text>
      <text x="332" y="128" textAnchor="middle" fill="#b9a99b" fontSize="10.5">Blocks laser line</text>

      {/* Spectrometer + Detector */}
      <rect x="386" y="58" width="76" height="48" rx="6" fill="#231b15" stroke="#8bc6bd" strokeWidth="1.5" />
      <text x="424" y="87" textAnchor="middle" fill="#f0dccb" fontSize="12">Disperser</text>
      <rect x="486" y="64" width="56" height="36" rx="5" fill="#1e2423" stroke="#8bc6bd" strokeWidth="1.6" />
      <text x="514" y="87" textAnchor="middle" fill="#8bc6bd" fontSize="12">Detector</text>

      {/* Vibrating 2D lattice on substrate */}
      <rect x="108" y="252" width="250" height="22" rx="4" fill="#2b2520" stroke="#8f8175" strokeWidth="1.2" />
      <motion.g
        animate={reduceMotion ? undefined : { y: [-2, 2, -2] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="142" y1="242" x2="324" y2="242" stroke="#e9b594" strokeWidth="2" />
        {[154, 188, 222, 256, 290, 320].map((cx, i) => (
          <circle key={i} cx={cx} cy="242" r="4.5" fill={i % 2 === 0 ? '#e9b594' : '#8bc6bd'} />
        ))}
      </motion.g>
      <text x="372" y="248" fill="#f0dccb" fontSize="12.5">Vibrating 2D crystal</text>
      <text x="290" y="310" textAnchor="middle" fill="#c9bfb5" fontSize="12">
        Small energy shifts (Δν in cm⁻¹) encode bond vibrations &amp; layer stacking
      </text>
    </svg>
  );
}

export function InstrumentSchematic({ methodId }) {
  const reduceMotion = useReducedMotion();
  switch (methodId) {
    case 'uv-vis':
      return <UVVisSchematic reduceMotion={reduceMotion} />;
    case 'tem':
      return <TemSchematic reduceMotion={reduceMotion} />;
    case 'afm':
      return <AfmSchematic reduceMotion={reduceMotion} />;
    case 'sem':
      return <SemSchematic reduceMotion={reduceMotion} />;
    case 'xps':
      return <XpsSchematic reduceMotion={reduceMotion} />;
    case 'raman':
    default:
      return <RamanSchematic reduceMotion={reduceMotion} />;
  }
}
