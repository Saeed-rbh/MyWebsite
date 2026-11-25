import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import shared from './GrapheneArticle.module.css';
import s from './Nanofluids.module.css';

const FIGURE_PANELS = {
  '/journal-figures/nanoparticle-water-shells.jpg': [
    { id: 'full', label: 'Both panels' },
    { id: 'a', label: '(a) Shell temperature curves', x0: 0, span: 0.495 },
    { id: 'b', label: '(b) Peak arrival times', x0: 0.492, span: 0.508 },
  ],
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function ArticleText({ text, highlights = [] }) {
  if (!text || !highlights.length) return text;
  const valid = highlights.filter(Boolean);
  if (!valid.length) return text;
  const pattern = new RegExp(`(${valid.map(escapeRegExp).join('|')})`, 'gi');
  const seen = new Set();
  return text.split(pattern).map((part, index) => {
    if (index % 2 === 1) {
      const normalized = part.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        return (
          <span className={shared.headingAccent} key={index}>
            {part}
          </span>
        );
      }
    }
    return part;
  });
}

export function SmoothDetails({ className = '', summary, children }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const toggle = event => {
    event.preventDefault();
    setOpen(prev => !prev);
  };

  return (
    <details open={open} className={`${shared.figureDetails} ${s.smoothDetails} ${className}`}>
      <summary onClick={toggle} aria-expanded={open}>
        {summary}
      </summary>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
            className={s.detailsBody}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </details>
  );
}

const PRELOADED = new Set();
export function preloadAsset(src) {
  if (typeof Image === 'undefined' || !src || PRELOADED.has(src)) return;
  PRELOADED.add(src);
  const img = new Image();
  img.src = src;
}

export function FigureLightbox({ item, onClose }) {
  const reduceMotion = useReducedMotion();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [panelId, setPanelId] = useState('full');
  const dragOrigin = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setPanelId(item.initialPanel || 'full');
    const previousFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [item, onClose]);

  if (!item) return null;

  const panels = item.panels || null;
  const activePanel = panels?.find(p => p.id === panelId) || null;
  const isCropped = Boolean(activePanel && activePanel.id !== 'full');
  const [naturalW, naturalH] = item.dimensions || [1200, 800];

  const handlePointerDown = event => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    dragOrigin.current = { x: event.clientX, y: event.clientY, px: pan.x, py: pan.y };
  };

  const handlePointerMove = event => {
    if (!dragging || zoom <= 1) return;
    setPan({
      x: dragOrigin.current.px + (event.clientX - dragOrigin.current.x),
      y: dragOrigin.current.py + (event.clientY - dragOrigin.current.y),
    });
  };

  const handlePointerUp = () => setDragging(false);

  const chooseZoom = nextZoom => {
    setZoom(nextZoom);
    if (nextZoom <= 1) setPan({ x: 0, y: 0 });
  };

  const choosePanel = nextId => {
    setPanelId(nextId);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return createPortal(
    <div
      className={s.lightboxBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect ${item.title}`}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className={s.lightboxDialog}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={s.lightboxHeader}>
          <div className={s.lightboxMeta}>
            <span>{item.eyebrow || 'Figure inspection'}</span>
            <h3>{item.title}</h3>
          </div>
          <div className={s.lightboxToolbar}>
            <div className={s.lightboxZoomGroup} role="group" aria-label="Zoom level">
              {[1, 2, 3].map(level => (
                <button
                  key={level}
                  type="button"
                  aria-pressed={zoom === level}
                  onClick={() => chooseZoom(level)}
                >
                  {level}×
                </button>
              ))}
            </div>
            {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
              <button type="button" onClick={() => chooseZoom(1)}>
                Reset
              </button>
            )}
            <a href={item.src} target="_blank" rel="noopener noreferrer">
              Raw file ↗
            </a>
            <button
              ref={closeBtnRef}
              type="button"
              className={s.lightboxClose}
              onClick={onClose}
              aria-label="Close figure viewer"
            >
              Close ✕
            </button>
          </div>
        </div>

        {panels && (
          <div className={s.lightboxPanels} role="group" aria-label="Focus panel inside figure">
            {panels.map(panel => (
              <button
                key={panel.id}
                type="button"
                aria-pressed={panel.id === panelId}
                onClick={() => choosePanel(panel.id)}
              >
                {panel.label}
              </button>
            ))}
          </div>
        )}

        <div
          className={`${s.lightboxStage} ${item.isPaperFigure ? s.lightboxPaper : ''}`}
          data-zoomed={zoom > 1 || undefined}
          data-dragging={dragging || undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className={s.lightboxTransform}
            style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}
          >
            {isCropped ? (
              <div
                className={s.panelCropFrame}
                style={{
                  width: `min(82vw, 760px, calc(62vh * ${(naturalW * activePanel.span) / naturalH}))`,
                  aspectRatio: `${naturalW * activePanel.span} / ${naturalH}`,
                }}
              >
                <img
                  src={item.src}
                  width={naturalW}
                  height={naturalH}
                  alt={item.alt}
                  draggable={false}
                  style={{
                    width: `${100 / activePanel.span}%`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    height: 'auto',
                    transform: `translateX(-${activePanel.x0 * 100}%)`,
                  }}
                />
              </div>
            ) : (
              <img src={item.src} width={naturalW} height={naturalH} alt={item.alt} draggable={false} />
            )}
          </div>
        </div>

        <p className={s.lightboxCaption}>
          {item.caption} {zoom > 1 ? '· Drag image to pan' : '· Choose 2× or 3× to inspect axes and legends'}
        </p>
      </motion.div>
    </div>,
    document.body
  );
}

export function PublishedFigure({ figure, paper, journalLink, legendItems, unitNote, onInspect }) {
  const panels = FIGURE_PANELS[figure.src] || null;
  const [activePanelId, setActivePanelId] = useState(() => {
    if (panels && typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
      return 'a';
    }
    return 'full';
  });

  const activePanel = panels?.find(p => p.id === activePanelId) || null;
  const isCropped = Boolean(activePanel && activePanel.id !== 'full');

  const inspectItem = () => {
    onInspect?.({
      src: figure.src,
      dimensions: [figure.width, figure.height],
      eyebrow: `Published paper · ${figure.source}`,
      title: figure.title,
      alt: figure.alt,
      caption: figure.reading,
      panels,
      initialPanel: activePanelId,
      isPaperFigure: true,
    });
  };

  return (
    <figure className={`${shared.literatureFigure} ${s.publishedFigure}`}>
      <header className={s.figureHeader}>
        <div>
          <span className={shared.eyebrow}>Our simulation results</span>
          <h3>{figure.title}</h3>
        </div>
        <button
          type="button"
          className={s.inspectTrigger}
          onClick={inspectItem}
          aria-label={`Inspect published figure at full zoom: ${figure.title}`}
        >
          Inspect figure ⤢
        </button>
      </header>

      {legendItems?.length > 0 && (
        <ul className={s.figureLegendBar} aria-label="Curve legend">
          {legendItems.map(item => (
            <li key={item.id}>
              <span
                className={s.legendLineSwatch}
                style={{ '--swatch': item.color, '--ring': item.ring }}
                aria-hidden="true"
              />
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      )}

      {unitNote && <p className={s.unitNote}>{unitNote}</p>}

      {panels && (
        <div className={s.panelFocusBar} role="group" aria-label={`Focus panel of ${figure.title}`}>
          <span>Panel view:</span>
          {panels.map(panel => (
            <button
              key={panel.id}
              type="button"
              aria-pressed={panel.id === activePanelId}
              onClick={() => setActivePanelId(panel.id)}
            >
              {panel.label}
            </button>
          ))}
        </div>
      )}

      <div className={s.paperMatte}>
        <button
          type="button"
          className={s.figureSurfaceButton}
          onClick={inspectItem}
          aria-label={`Enlarge figure: ${figure.title}`}
        >
          {isCropped ? (
            <div
              className={s.panelCropViewport}
              style={{ aspectRatio: `${figure.width * activePanel.span} / ${figure.height}` }}
            >
              <img
                src={figure.src}
                width={figure.width}
                height={figure.height}
                loading="lazy"
                decoding="async"
                alt={`${figure.title} (${activePanel.label}). ${figure.alt}`}
                style={{
                  width: `${100 / activePanel.span}%`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  height: 'auto',
                  transform: `translateX(-${activePanel.x0 * 100}%)`,
                }}
              />
            </div>
          ) : (
            <img
              src={figure.src}
              width={figure.width}
              height={figure.height}
              loading="lazy"
              decoding="async"
              alt={figure.alt}
            />
          )}
        </button>
      </div>

      <figcaption className={shared.compactFigureCaption}>
        <p>{figure.reading}</p>
        <div className={s.figureCitations}>
          <cite>
            <a href={paper[1]} target="_blank" rel="noopener noreferrer">
              {figure.source} ↗
            </a>
          </cite>
          {journalLink && (
            <Link to={journalLink[1]} className={s.journalStoryLink}>
              {journalLink[0]} ↗
            </Link>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export function OpeningFigure({ article, onInspect }) {
  const [density, setDensity] = useState(false);
  const reduceMotion = useReducedMotion();
  const image = density ? article.densityMap : article.interfaceImage;

  const inspectCurrent = () => {
    onInspect?.({
      src: image.src,
      dimensions: [image.width, image.height],
      eyebrow: density ? `Published contour · ${image.source}` : 'Conceptual schematic',
      title: density ? 'Water density around a 4 nm silver sphere' : 'Silver–water molecular interface',
      alt: image.alt,
      caption: image.caption,
      isPaperFigure: density,
    });
  };

  return (
    <figure className={`${s.interfaceFigure} ${s.openingCard}`}>
      <div className={s.openingToolbar}>
        <div className={s.options} role="group" aria-label="Choose a view of the interface">
          <button type="button" aria-pressed={!density} onClick={() => setDensity(false)}>
            Molecules (schematic)
          </button>
          <button
            type="button"
            aria-pressed={density}
            onMouseEnter={() => preloadAsset(article.densityMap.src)}
            onFocus={() => preloadAsset(article.densityMap.src)}
            onClick={() => setDensity(true)}
          >
            Water density (paper Fig. 5)
          </button>
        </div>
        <button
          type="button"
          className={s.inspectTrigger}
          onClick={inspectCurrent}
          aria-label="Inspect interface view at full resolution"
        >
          Inspect view ⤢
        </button>
      </div>

      <div className={`${s.openingImage} ${density ? s.openingPaperMatte : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={image.src}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={inspectCurrent}
            style={{ cursor: 'zoom-in' }}
          />
        </AnimatePresence>
      </div>

      <figcaption aria-live="polite">
        {density ? (
          <>
            {image.caption} {article.figureLegends?.silverUnitNote}{' '}
            <a href={image.url} target="_blank" rel="noopener noreferrer">
              {image.source} ↗
            </a>
          </>
        ) : (
          'A schematic slice through the interface. Silver sits on the left; copper-and-ivory water molecules pack closely inside the dashed ~0.3 nm hydration shell. Switch views to see the published contour map.'
        )}
      </figcaption>
    </figure>
  );
}

export function SurfaceExplorer() {
  const [n, setN] = useState(1);
  const reduceMotion = useReducedMotion();
  // n divisions along each dimension preserves total solid volume.
  const grains = [];
  const pitch = 60 / n;
  const radius = 23 / n;
  for (let z = n - 1; z >= 0; z--) {
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        grains.push(
          <circle
            key={`${x}-${y}-${z}`}
            cx={59 + (x - (n - 1) / 2) * pitch + (z - (n - 1) / 2) * pitch * 0.44}
            cy={53 + (y - (n - 1) / 2) * pitch - (z - (n - 1) / 2) * pitch * 0.46}
            r={radius}
            fill="url(#grain-shading)"
            stroke="#342620"
            strokeWidth="0.45"
          />
        );
      }
    }
  }

  const diameter = 8 / n;
  return (
    <section className={s.workbench} aria-labelledby="surface-heading">
      <div>
        <span className={shared.eyebrow}>Particle explorer · Fixed mass scaling</span>
        <h3 id="surface-heading">Keep the solid. Change its size.</h3>
        <p>
          Subdivide one 8 nm sphere while keeping total silver volume constant. Halving diameter puts twice as much exposed crystal surface in direct contact with water.
        </p>
        <div className={s.options} role="group" aria-label="Particle diameter">
          {[1, 2, 4].map(divisions => (
            <button
              type="button"
              key={divisions}
              aria-pressed={n === divisions}
              onClick={() => setN(divisions)}
            >
              {8 / divisions} nm ({divisions ** 3})
            </button>
          ))}
        </div>

        <div className={s.scalingBars} aria-label="Volume vs surface area comparison">
          <div>
            <div className={s.scalingBarLabel}>
              <span>Total silver volume</span>
              <strong>1.0× (constant)</strong>
            </div>
            <div className={s.scalingTrack}>
              <div className={s.scalingFillMuted} style={{ width: '25%' }} />
            </div>
          </div>
          <div>
            <div className={s.scalingBarLabel}>
              <span>Water-facing surface area</span>
              <strong>{n}.0× relative area</strong>
            </div>
            <div className={s.scalingTrack}>
              <motion.div
                className={s.scalingFillCopper}
                animate={{ width: `${(n / 4) * 100}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>

      <figure className={s.model}>
        <svg viewBox="0 0 118 106" role="img" aria-label={`${n ** 3} separate spheres of diameter ${diameter} nanometres`}>
          <defs>
            <radialGradient id="grain-shading" cx="32%" cy="24%" r="83%">
              <stop stopColor="#ffedd4" />
              <stop offset="0.4" stopColor="#d1a483" />
              <stop offset="1" stopColor="#513a31" />
            </radialGradient>
          </defs>
          <motion.g
            key={n}
            initial={reduceMotion ? false : { scale: 0.9, opacity: 0.45 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '59px 53px' }}
          >
            {grains}
          </motion.g>
        </svg>
        <figcaption aria-live="polite">
          <strong>
            {n ** 3} {n === 1 ? 'particle' : 'particles'} at {diameter} nm · {n}× surface area
          </strong>
          Because surface area scales as d² and volume as d³, surface-to-volume ratio grows as 1 / d.
        </figcaption>
      </figure>
    </section>
  );
}

const SHELL_PROFILES = [
  { name: 'Inner', range: [2.0, 2.2], dist: '0.0–0.2 nm', approxDensity: '~1,550 kg/m³', note: 'First dense hydration shell' },
  { name: 'Middle', range: [2.2, 2.4], dist: '0.2–0.4 nm', approxDensity: '~900 kg/m³', note: 'Ordering depletion trough' },
  { name: 'Outer', range: [2.4, 2.6], dist: '0.4–0.6 nm', approxDensity: '~1,120 kg/m³', note: 'Second gentler peak' },
];

export function ShellExplorer() {
  const [selected, setSelected] = useState(0);
  const current = SHELL_PROFILES[selected];
  const [inside, outside] = current.range;
  const volume = (4 * Math.PI) / 3 * (outside ** 3 - inside ** 3);
  // Highlight band in schematic density sparkline (0 to 1.2 nm mapped across x=22..182)
  const xStart = 22 + ((inside - 2.0) / 1.2) * 160;
  const bandW = (0.2 / 1.2) * 160;

  return (
    <section className={s.workbench} aria-labelledby="shell-lab">
      <div>
        <span className={shared.eyebrow}>Counting water · Radial shells</span>
        <h3 id="shell-lab">Choose a shell around the same particle.</h3>
        <p>
          Each 0.2 nm shell holds more volume further from the core—yet water molecules pack unevenly near the solid. Click a shell to connect shell geometry to the density oscillations in Figure 4 below.
        </p>
        <div className={s.options} role="group" aria-label="Select a water shell">
          {SHELL_PROFILES.map((item, i) => (
            <button key={item.name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>
              {item.name} ({item.dist})
            </button>
          ))}
        </div>

        <div className={s.shellDensityPreview}>
          <svg viewBox="0 0 200 72" role="img" aria-label={`Schematic water packing curve highlighting the ${current.dist} shell`}>
            <rect x={xStart} y="8" width={bandW} height="50" rx="2" fill="#e9b59426" stroke="#e9b59466" strokeWidth="0.8" />
            <line x1="22" y1="38" x2="186" y2="38" stroke="#8bc6bd55" strokeDasharray="3 3" />
            <path
              d="M 24 14 Q 36 14 48 48 Q 62 56 76 28 Q 92 36 108 38 Q 140 38 184 38"
              fill="none"
              stroke="#8bc6bd"
              strokeWidth="2"
            />
            <text x="24" y="68" fill="#a99a8c" fontSize="8.5" fontFamily="Rubik, sans-serif">0 nm surface</text>
            <text x="184" y="68" textAnchor="end" fill="#8bc6bd" fontSize="8.5" fontFamily="Rubik, sans-serif">1,000 kg/m³ bulk</text>
          </svg>
          <p>
            <strong>{current.approxDensity}</strong> · {current.note}
          </p>
        </div>
      </div>

      <figure className={s.model}>
        <svg viewBox="0 0 200 180" role="img" aria-label={`Cross section highlighting shell ${selected + 1} (${current.dist}) around 4 nm silver particle`}>
          {SHELL_PROFILES.map((item, i) => {
            const [r1, r2] = item.range;
            return (
              <circle
                key={item.name}
                cx="100"
                cy="90"
                r={(r1 + r2) * 16}
                fill="none"
                stroke={selected === i ? '#efbd96' : '#456464'}
                strokeWidth={(r2 - r1) * 32 - 0.5}
              />
            );
          })}
          <circle cx="100" cy="90" r="64" fill="#989490" />
          <text x="100" y="95" textAnchor="middle" fill="#161616" fontSize="14" fontFamily="Rubik, sans-serif">
            Silver (4 nm)
          </text>
        </svg>
        <figcaption aria-live="polite">
          <strong>Shell volume · {volume.toFixed(1)} nm³</strong>
          {current.dist} from the surface ({current.approxDensity} local density).
        </figcaption>
      </figure>
    </section>
  );
}

export function ViscosityContrastCard({ items = [] }) {
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;

  return (
    <aside className={s.contrastCard} aria-label="Classical vs nanolayer viscosity at 2.5% silver">
      <div className={s.contrastHeader}>
        <span className={shared.eyebrow}>Paper payoff · Figure 10 at 2.5% silver by volume</span>
        <h4>Why classical solid-only equations underpredict viscosity by more than 4×</h4>
      </div>
      <div className={s.contrastBars}>
        {items.map((item, idx) => {
          const pct = Math.min(100, ((item.ratio - 1) / 0.30) * 100);
          return (
            <div key={item.id} className={s.contrastRow} data-tone={item.accent}>
              <div className={s.contrastLabels}>
                <strong>{item.label}</strong>
                <small>{item.sublabel}</small>
              </div>
              <div className={s.contrastTrack} aria-hidden="true">
                <motion.div
                  className={s.contrastFill}
                  style={{ width: `${pct}%`, transformOrigin: 'left center' }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className={s.contrastValue}>
                <strong>{item.increase}</strong>
                <small>μ/μ₀ = {item.ratio.toFixed(2)}</small>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function ThermalPulseExplorer({ shells = [] }) {
  const [timePs, setTimePs] = useState(1.9);
  const [playing, setPlaying] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const reduceMotion = useReducedMotion();
  const rafRef = useRef(null);

  useEffect(() => {
    if (!playing || reduceMotion) return undefined;
    let last = performance.now();
    const tick = now => {
      const dt = (now - last) / 1000;
      last = now;
      setTimePs(prev => {
        const next = prev + dt * 2.4;
        if (next >= 12) {
          setPlaying(false);
          return 12;
        }
        return Number(next.toFixed(2));
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, reduceMotion]);

  if (!shells.length) return null;

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (timePs >= 11.5) setTimePs(0.2);
      setPlaying(true);
    }
  };

  // Evaluate normalized pulse alpha-function T(r, t) = 300 + dT_peak * (t/tau) * exp(1 - t/tau)
  const tempAt = shell => {
    const ratio = Math.max(0, timePs) / shell.peakPs;
    return 300 + (shell.peakK - 300) * ratio * Math.exp(1 - ratio);
  };

  const activeShell = shells[focusIdx] || shells[0];
  const activeTemp = tempAt(activeShell);

  return (
    <section className={s.pulseStudio} aria-label="Interactive picosecond heat pulse explorer">
      <div className={s.pulseHeader}>
        <div>
          <span className={shared.eyebrow}>Try the idea / Picosecond heat pulse</span>
          <h3>Watch the thermal wave travel shell by shell</h3>
          <p>
            Scrub or play time (measured in picoseconds after the silver core heats). Shells measured radially from the particle center peak lower and later as the wave spreads into bulk water.
          </p>
        </div>

        <div className={s.pulseControls}>
          <button
            type="button"
            className={s.playPulseBtn}
            aria-pressed={playing}
            onClick={togglePlay}
          >
            {playing ? 'Pause pulse ❚❚' : 'Play pulse ▶'}
          </button>
          <div className={s.pulseTimeSlider}>
            <label htmlFor="pulse-time">
              <span>Elapsed time</span>
              <strong>t = {timePs.toFixed(1)} ps</strong>
            </label>
            <input
              id="pulse-time"
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={timePs}
              onChange={e => {
                setPlaying(false);
                setTimePs(Number(e.target.value));
              }}
            />
          </div>
        </div>
      </div>

      <div className={s.pulseGrid}>
        <div className={s.pulseVisualCard}>
          <svg viewBox="0 0 260 220" className={s.pulseSvg} role="img" aria-label={`Concentric water shells around silver at t = ${timePs.toFixed(1)} ps`}>
            {[...shells].reverse().map((shell, revIdx) => {
              const idx = shells.length - 1 - revIdx;
              const radiusPx = 42 + idx * 14;
              const tVal = tempAt(shell);
              const heatNorm = Math.min(1, Math.max(0, (tVal - 300) / 5.5));
              const isFocused = idx === focusIdx;
              return (
                <circle
                  key={shell.r}
                  cx="130"
                  cy="108"
                  r={radiusPx}
                  fill={`rgba(233, 181, 148, ${(heatNorm * 0.22).toFixed(3)})`}
                  stroke={isFocused ? '#8bc6bd' : `rgba(233, 181, 148, ${(0.22 + heatNorm * 0.78).toFixed(3)})`}
                  strokeWidth={isFocused ? 2.4 : 1.4}
                  onClick={() => setFocusIdx(idx)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
            {/* Silver core */}
            <circle cx="130" cy="108" r="28" fill="#989490" stroke="#f0dccb" strokeWidth="1.2" />
            <text x="130" y="106" textAnchor="middle" fill="#14110d" fontSize="11" fontWeight="500">Ag</text>
            <text x="130" y="119" textAnchor="middle" fill="#14110d" fontSize="8.5">core</text>
            <text x="130" y="210" textAnchor="middle" fill="#b9a99b" fontSize="10.5">
              r = {activeShell.r.toFixed(1)} nm · T ≈ {activeTemp.toFixed(1)} K (peaks at {activeShell.peakPs.toFixed(2)} ps)
            </text>
          </svg>
        </div>

        <div className={s.pulseBarsCard}>
          <div className={s.pulseBarsHeading}>
            <span>Radial shell temperature &amp; peak arrival (Fig. 5)</span>
            <small>Select a shell row</small>
          </div>
          {shells.map((shell, idx) => {
            const currentT = tempAt(shell);
            const livePct = Math.min(100, Math.max(0, ((currentT - 300) / 5.6) * 100));
            const isSelected = idx === focusIdx;
            return (
              <button
                key={shell.r}
                type="button"
                className={s.pulseShellRow}
                data-selected={isSelected || undefined}
                onClick={() => setFocusIdx(idx)}
              >
                <span>r = {shell.r.toFixed(1)} nm</span>
                <span className={s.pulseShellTrack}>
                  <span className={s.pulseShellFill} style={{ width: `${livePct}%` }} />
                </span>
                <strong>{currentT.toFixed(1)} K</strong>
                <small>peak {shell.peakPs.toFixed(2)} ps</small>
              </button>
            );
          })}
          <p className={s.pulseFootnote}>
            Conceptual thermal-pulse curve parameterized by the Figure 5(a)–(b) peak amplitudes (~305.5 → 301.2 K) and peak arrival lags (1.40 → 3.15 ps).
          </p>
        </div>
      </div>
    </section>
  );
}

function coolingTemp(timePs, withCoulomb) {
  if (timePs < 10) return 300;
  if (timePs <= 20) return 400;
  const elapsed = timePs - 20;
  const tau = withCoulomb ? 3.2 : 29.0;
  return 300 + 100 * Math.exp(-elapsed / tau);
}

function coolingPath(withCoulomb) {
  const pts = [];
  for (let t = 0; t <= 120; t += 1.5) {
    const x = 36 + (t / 120) * 340;
    const temp = coolingTemp(t, withCoulomb);
    const y = 148 - ((temp - 290) / 125) * 124;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

export function ElectrostaticsRace({ data }) {
  const [mode, setMode] = useState('both');
  const [raceRun, setRaceRun] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduceMotion = useReducedMotion();

  if (!data) return null;
  const showCoul = mode === 'both' || mode === 'coul';
  const showLj = mode === 'both' || mode === 'lj';

  return (
    <section ref={ref} className={s.electrostaticsRace} aria-label="Electrostatics interfacial conductance comparison">
      <div className={s.raceTop}>
        <div>
          <span className={shared.eyebrow}>Headline result · 6 nm TiO₂ in water (2022)</span>
          <div className={s.raceMetricRow}>
            <strong className={s.raceMultiplier}>{data.ratioLabel}</strong>
            <div>
              <h4>Higher conductance with electrostatic attraction</h4>
              <p>
                <span>{data.ljCoulomb.conductance} {data.ljCoulomb.unit}</span> (LJ + Coulomb) vs{' '}
                <span>{data.ljOnly.conductance} {data.ljOnly.unit}</span> (LJ van der Waals alone)
              </p>
            </div>
          </div>
        </div>

        <div className={s.raceControls}>
          <div className={s.options} role="group" aria-label="Toggle TiO₂ force model">
            {[
              ['both', 'Compare both'],
              ['coul', 'LJ + Coulomb'],
              ['lj', 'LJ only'],
            ].map(([id, label]) => (
              <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={s.replayRaceBtn}
            onClick={() => setRaceRun(r => r + 1)}
          >
            Replay cooling ↻
          </button>
        </div>
      </div>

      <div className={s.raceGrid}>
        <div className={s.raceChartCard}>
          <svg viewBox="0 0 400 175" role="img" aria-label="TiO₂ cooling transient from 400 K down to 300 K water baseline">
            {/* Axis lines & non-overlapping labels */}
            <line x1="36" y1="24" x2="36" y2="148" stroke="#d49d8144" />
            <line x1="36" y1="148" x2="378" y2="148" stroke="#d49d8144" />
            <line x1="36" y1="138" x2="378" y2="138" stroke="#8bc6bd66" strokeDasharray="3 3" />
            <text x="158" y="131" fill="#8bc6bd" fontSize="9.5" fontFamily="Rubik, sans-serif">300 K water baseline</text>
            <text x="28" y="34" textAnchor="end" fill="#b9a99b" fontSize="9.5">400 K</text>
            <text x="28" y="142" textAnchor="end" fill="#b9a99b" fontSize="9.5">300 K</text>
            <line x1="93" y1="24" x2="93" y2="148" stroke="#b9a99b33" strokeDasharray="2 3" />
            <text x="89" y="164" textAnchor="end" fill="#b9a99b" fontSize="9.5">20 ps off</text>
            <line x1="149" y1="24" x2="149" y2="148" stroke="#8bc6bd44" strokeDasharray="2 3" />
            <text x="153" y="164" textAnchor="start" fill="#8bc6bd" fontSize="9.5">40 ps check</text>
            <text x="376" y="164" textAnchor="end" fill="#a99a8c" fontSize="9.5">120 ps</text>

            {showLj && (
              <motion.path
                key={`lj-${raceRun}`}
                d={coolingPath(false)}
                fill="none"
                stroke="#e25852"
                strokeWidth="2.5"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: inView || reduceMotion ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            {showCoul && (
              <motion.path
                key={`coul-${raceRun}`}
                d={coolingPath(true)}
                fill="none"
                stroke="#f0dccb"
                strokeWidth="2.8"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: inView || reduceMotion ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </svg>
        </div>

        <div className={s.raceMechanismCard}>
          <svg viewBox="0 0 260 175" role="img" aria-label={mode === 'lj' ? 'Disordered water weakly coupled without surface electrostatics' : 'Polar water molecules aligned to charged TiO2 surface atoms'}>
            <rect x="20" y="128" width="220" height="30" rx="6" fill="#2b211a" stroke="#d49d8166" />
            {[46, 88, 130, 172, 214].map((cx, i) => (
              <g key={cx}>
                <circle cx={cx} cy="143" r="8" fill={i % 2 === 0 ? '#8bc6bd' : '#e9b594'} />
                <text x={cx} y="146" textAnchor="middle" fill="#14110e" fontSize="8" fontWeight="600">
                  {mode === 'lj' ? '·' : i % 2 === 0 ? 'Ti+' : 'O−'}
                </text>
              </g>
            ))}
            {[50, 102, 154, 206].map((wx, idx) => {
              const angle = mode === 'lj' ? [38, -62, 128, -22][idx] : idx % 2 === 0 ? 180 : 0;
              return (
                <g key={wx} transform={`translate(${wx}, 96) rotate(${angle})`}>
                  <line x1="0" y1="0" x2="-9" y2="9" stroke="#c9bfb5" strokeWidth="2" />
                  <line x1="0" y1="0" x2="9" y2="9" stroke="#c9bfb5" strokeWidth="2" />
                  <circle cx="0" cy="0" r="6" fill="#d69172" />
                  <circle cx="-9" cy="9" r="3.4" fill="#faf0e6" />
                  <circle cx="9" cy="9" r="3.4" fill="#faf0e6" />
                </g>
              );
            })}
            <text x="130" y="24" textAnchor="middle" fill={mode === 'lj' ? '#e25852' : '#8bc6bd'} fontSize="10.5" fontFamily="Rubik, sans-serif">
              {mode === 'lj'
                ? 'LJ only: weak interfacial coupling'
                : 'LJ + Coulomb: water locks to charges'}
            </text>
            <text x="130" y="42" textAnchor="middle" fill="#b9a99b" fontSize="9.5" fontFamily="Rubik, sans-serif">
              {mode === 'lj'
                ? '17 MW m⁻² K⁻¹ · stalls ~350 K at 40 ps'
                : '1620 MW m⁻² K⁻¹ · cools by ~30 ps'}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

const CHOICES = [
  ['Average all the water together.', 'That gives the mean liquid temperature. Water far from the particle dilutes the signal from the first molecular layers.'],
  ['Track water in shells at different radii.', 'Yes. Each shell gives a local temperature as a function of time, so we can compare both the size and timing of the peaks.'],
  ['Track only the silver temperature.', 'This shows how quickly the particle loses energy. To see where that energy arrives, we also need temperatures in the water.'],
];

export function ShellQuestion({ onNavigate }) {
  const [answer, setAnswer] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className={shared.quiz} aria-labelledby="shell-question">
      <div className={shared.quizIntro}>
        <span className={shared.eyebrow}>Read the simulation</span>
        <h3 id="shell-question">How would you detect a brief warming near the particle?</h3>
        <p>Think about how a fleeting 5 K spike spreads outward in less than three picoseconds.</p>
      </div>

      <div className={shared.quizInteraction}>
        <div className={shared.quizAnswers} role="group" aria-labelledby="shell-question">
          {CHOICES.map(([label], index) => (
            <button
              key={label}
              type="button"
              className={shared.quizAnswer}
              aria-pressed={answer === index}
              onClick={() => setAnswer(index)}
            >
              <span className={shared.quizAnswerIndex} aria-hidden="true">0{index + 1}</span>
              <span>{label}</span>
              <span className={shared.quizAnswerMark} aria-hidden="true">
                {answer === index ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>

        <div className={shared.quizResponse} data-answered={answer !== null}>
          <motion.div
            key={answer ?? 'empty'}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <h3>
              {answer === null
                ? 'Choose a measurement strategy.'
                : answer === 1
                  ? 'Yes — localize in concentric radial bins.'
                  : 'Notice what gets lost without spatial shells.'}
            </h3>
            <p aria-live="polite">
              {answer === null
                ? 'Select an option above to see what that simulation observable resolves.'
                : CHOICES[answer][1]}
            </p>
          </motion.div>
        </div>

        <div className={shared.quizActions}>
          <button type="button" onClick={() => setAnswer(null)}>
            Try again
          </button>
          {onNavigate && (
            <a
              href="#titania"
              onClick={event => {
                event.preventDefault();
                onNavigate('titania');
              }}
            >
              See what controls the speed <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function ThreeStudySynthesis({ studies = [], onNavigate }) {
  const [studyFilter, setStudyFilter] = useState('all');
  if (!studies.length) return null;
  const visible = studyFilter === 'all' ? studies : studies.filter(item => item.id === studyFilter);

  return (
    <section className={s.synthesisMatrix} aria-label="Three-study nanofluid synthesis">
      <div className={s.matrixHeader}>
        <div>
          <span className={shared.eyebrow}>Synthesis / Three connected molecular studies</span>
          <h3>What our simulations established together</h3>
        </div>
        <div className={s.matrixFilters} role="group" aria-label="Filter studies by system">
          <button type="button" aria-pressed={studyFilter === 'all'} onClick={() => setStudyFilter('all')}>
            All 3 studies
          </button>
          {studies.map(st => (
            <button key={st.id} type="button" aria-pressed={studyFilter === st.id} onClick={() => setStudyFilter(st.id)}>
              {st.year} · {st.id === 'tio2-coulomb' ? 'TiO₂' : 'Ag'}
            </button>
          ))}
        </div>
      </div>

      <div className={s.matrixCards} data-single={visible.length === 1 || undefined}>
        {visible.map(st => (
          <article key={st.id} className={s.matrixCard}>
            <header>
              <span className={s.matrixYear}>{st.year} · {st.system}</span>
              <h4>{st.title}</h4>
              <p className={s.matrixHeadline}>{st.headline}</p>
            </header>
            <p className={s.matrixBody}>{st.summary}</p>
            <p className={s.matrixLimit}>
              <strong>Scope note:</strong> {st.openLimit}
            </p>
            <footer className={s.matrixLinks}>
              <button type="button" className={s.matrixJump} onClick={() => onNavigate(st.chapterId)}>
                Jump to chapter ↑
              </button>
              <Link to={st.journalHref}>Full paper story ↗</Link>
              <a href={st.paperUrl} target="_blank" rel="noopener noreferrer">
                Published paper ↗
              </a>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
