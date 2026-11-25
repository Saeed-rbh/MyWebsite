import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import shared from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

export const FIGURE_PANELS = {
  '/journal-figures/nanoparticle-water-shells.jpg': [
    { id: 'full', label: 'Both panels' },
    { id: 'a', label: '(a) Shell temperatures', x0: 0, y0: 0, spanX: 0.495, spanY: 1 },
    { id: 'b', label: '(b) Peak arrival lag', x0: 0.492, y0: 0, spanX: 0.508, spanY: 1 },
  ],
  '/journal-figures/graphene-sliding.jpg': [
    { id: 'full', label: 'All panels' },
    { id: 'a', label: '(a) Bilayer axes', x0: 0.16, y0: 0, spanX: 0.68, spanY: 0.25 },
    { id: 'b', label: '(b) Lateral sliding Dxy', x0: 0.01, y0: 0.23, spanX: 0.49, spanY: 0.77 },
    { id: 'c', label: '(c) Layer opening Dz', x0: 0.50, y0: 0.23, spanX: 0.50, spanY: 0.77 },
  ],
  '/journal-figures/torsion-morphology.jpg': [
    { id: 'full', label: 'All 3 sheets' },
    { id: 'graphene', label: 'Graphene (a,d)', x0: 0, y0: 0, spanX: 0.41, spanY: 0.88 },
    { id: 'hbn', label: 'h-BN (b,e)', x0: 0.39, y0: 0, spanX: 0.32, spanY: 0.88 },
    { id: 'mos2', label: 'MoS₂ (c,f)', x0: 0.69, y0: 0, spanX: 0.31, spanY: 0.88 },
  ],
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function ArticleText({ text, highlights = [] }) {
  if (!text || !highlights?.length) return text;
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

export function SmoothDetails({ id, className = '', summary, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();

  const toggle = event => {
    event.preventDefault();
    setOpen(prev => !prev);
  };

  return (
    <details id={id} open={open} className={`${s.smoothDetails} ${className}`}>
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
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
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

export function PanelCropImage({ src, width, height, alt, panel, loading = 'lazy', decoding = 'async' }) {
  const naturalW = Number(width) || 1200;
  const naturalH = Number(height) || 800;
  const isCropped = Boolean(panel && panel.id !== 'full');

  if (!isCropped) {
    return (
      <img
        src={src}
        width={naturalW}
        height={naturalH}
        alt={alt}
        loading={loading}
        decoding={decoding}
        draggable={false}
      />
    );
  }

  return (
    <div
      className={s.panelCropFrame}
      style={{
        aspectRatio: `${naturalW * panel.spanX} / ${naturalH * panel.spanY}`,
      }}
    >
      <img
        src={src}
        width={naturalW}
        height={naturalH}
        alt={alt}
        loading={loading}
        decoding={decoding}
        draggable={false}
        style={{
          width: `${100 / panel.spanX}%`,
          maxWidth: 'none',
          maxHeight: 'none',
          height: 'auto',
          transform: `translate(${-panel.x0 * 100}%, ${-panel.y0 * 100}%)`,
        }}
      />
    </div>
  );
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
                className={s.lightboxCropFrame}
                style={{
                  width: `min(82vw, 760px, calc(62vh * ${(naturalW * activePanel.spanX) / (naturalH * activePanel.spanY)}))`,
                  aspectRatio: `${naturalW * activePanel.spanX} / ${naturalH * activePanel.spanY}`,
                }}
              >
                <img
                  src={item.src}
                  width={naturalW}
                  height={naturalH}
                  alt={item.alt}
                  draggable={false}
                  style={{
                    width: `${100 / activePanel.spanX}%`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    height: 'auto',
                    transform: `translate(${-activePanel.x0 * 100}%, ${-activePanel.y0 * 100}%)`,
                  }}
                />
              </div>
            ) : (
              <img src={item.src} width={naturalW} height={naturalH} alt={item.alt} draggable={false} />
            )}
          </div>
        </div>

        <p className={s.lightboxCaption}>
          {item.caption} {zoom > 1 ? '· Drag image to pan' : '· Choose 2× or 3× to inspect axes and labels'}
        </p>
      </motion.div>
    </div>,
    document.body
  );
}

const MLIP_STAGES = [
  {
    id: 'dft',
    number: '01',
    title: 'DFT relaxation',
    subtitle: 'Optimize crystal geometry',
    summary: 'First-principles Density Functional Theory locates the low-energy equilibrium lattice before any dynamics start.',
  },
  {
    id: 'aimd',
    number: '02',
    title: 'Ab-Initio MD bank',
    subtitle: 'Low/High T · Defects · Strain',
    summary: 'Short quantum-accurate trajectories sample thermal vibrations, point defects, and elastic deformation around relevant states.',
  },
  {
    id: 'train',
    number: '03',
    title: 'Subsample & fit MLIP',
    subtitle: 'Every N-th AIMD configuration',
    summary: 'Every N-th snapshot feeds regression of energies, forces, and stresses into an initial Moment Tensor or neural potential.',
  },
  {
    id: 'active',
    number: '04',
    title: 'Extrapolation gate loop',
    subtitle: 'Check γ > threshold & retrain',
    summary: 'Fast classical MD flags high-extrapolation atomic environments, evaluates them with DFT, appends them, and retrains.',
  },
];

export function MlipLoopDiagram({ onInspectOriginal }) {
  const [stageIndex, setStageIndex] = useState(0);
  const stage = MLIP_STAGES[stageIndex];

  return (
    <div className={s.mlipDiagram}>
      <div className={s.mlipHeader}>
        <div>
          <span className={shared.eyebrow}>Active-learning pipeline · Redrawn from Figure 1</span>
          <h4>From quantum reference frames to large-scale thermal MD</h4>
        </div>
        <button type="button" className={s.inspectTrigger} onClick={onInspectOriginal}>
          Original Figure 1 ⤢
        </button>
      </div>

      <svg viewBox="0 0 640 315" role="img" aria-label="Four-stage active-learning workflow for training a machine-learning interatomic potential">
        <defs>
          <marker id="mlip-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M1 1L7 4L1 7" fill="none" stroke="#d49d81" strokeWidth="1.4" />
          </marker>
          <marker id="mlip-teal" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M1 1L7 4L1 7" fill="none" stroke="#8bc6bd" strokeWidth="1.5" />
          </marker>
        </defs>

        <text x="20" y="20" fill="#a89482" fontSize="9.5" letterSpacing="1.2">QUANTUM REFERENCE TIER (DFT)</text>
        <rect x="16" y="28" width="608" height="118" rx="10" fill="#d49d810a" stroke="#d49d8130" strokeDasharray="4 5" />

        {/* Stage 0: DFT Relaxation */}
        <g onClick={() => setStageIndex(0)} style={{ cursor: 'pointer' }}>
          <rect
            x="32"
            y="46"
            width="230"
            height="82"
            rx="8"
            fill={stageIndex === 0 ? '#312319' : '#1b1612'}
            stroke={stageIndex === 0 ? '#e9b594' : '#d49d8150'}
            strokeWidth={stageIndex === 0 ? 1.8 : 1}
          />
          <text x="48" y="69" fill="#d49d81" fontSize="9.5" letterSpacing="1">01 · FIRST PRINCIPLES</text>
          <text x="48" y="92" fill="#f5eadf" fontSize="14.5" fontFamily="DM Serif Display, serif">Relaxed Equilibrium Cell</text>
          <text x="48" y="112" fill="#bfae9e" fontSize="10.5">Ground-state structure &amp; baseline forces</text>
        </g>

        <path d="M266 87H306" stroke="#d49d81" strokeWidth="1.6" markerEnd="url(#mlip-arrow)" />

        {/* Stage 1: Ab-Initio MD */}
        <g onClick={() => setStageIndex(1)} style={{ cursor: 'pointer' }}>
          <rect
            x="312"
            y="40"
            width="296"
            height="94"
            rx="8"
            fill={stageIndex === 1 ? '#312319' : '#1b1612'}
            stroke={stageIndex === 1 ? '#e9b594' : '#d49d8150'}
            strokeWidth={stageIndex === 1 ? 1.8 : 1}
          />
          <text x="328" y="61" fill="#d49d81" fontSize="9.5" letterSpacing="1">02 · AB-INITIO MD BANK</text>
          <text x="328" y="83" fill="#f5eadf" fontSize="14.5" fontFamily="DM Serif Display, serif">Sampled Reference Regimes</text>
          <g fill="#c9bfb5" fontSize="10">
            <rect x="328" y="94" width="78" height="26" rx="4" fill="#d49d8116" stroke="#d49d8138" />
            <text x="367" y="111" textAnchor="middle">Low / High T</text>
            <rect x="414" y="94" width="84" height="26" rx="4" fill="#d49d8116" stroke="#d49d8138" />
            <text x="456" y="111" textAnchor="middle">Point Defects</text>
            <rect x="506" y="94" width="88" height="26" rx="4" fill="#d49d8116" stroke="#d49d8138" />
            <text x="550" y="111" textAnchor="middle">Strained Cells</text>
          </g>
        </g>

        <path d="M460 136V174" stroke="#d49d81" strokeWidth="1.6" markerEnd="url(#mlip-arrow)" />

        <text x="20" y="168" fill="#8bc6bd" fontSize="9.5" letterSpacing="1.2">MACHINE-LEARNING TIER</text>

        {/* Stage 2: Subsample & Fit */}
        <g onClick={() => setStageIndex(2)} style={{ cursor: 'pointer' }}>
          <rect
            x="312"
            y="180"
            width="296"
            height="96"
            rx="8"
            fill={stageIndex === 2 ? '#1e2c2a' : '#161b1a'}
            stroke={stageIndex === 2 ? '#8bc6bd' : '#8bc6bd55'}
            strokeWidth={stageIndex === 2 ? 1.8 : 1}
          />
          <text x="328" y="203" fill="#8bc6bd" fontSize="9.5" letterSpacing="1">03 · SUBSAMPLE &amp; FIT</text>
          <text x="328" y="227" fill="#f5eadf" fontSize="15" fontFamily="DM Serif Display, serif">Train Interatomic Potential</text>
          <text x="328" y="246" fill="#c7bdb3" fontSize="10.5">Every N-th AIMD step → fit energies, forces &amp; stress</text>
          <text x="328" y="263" fill="#9fb9b4" fontSize="10">Produces deployable fast classical-scale MLIP</text>
        </g>

        <path d="M308 228H268" stroke="#8bc6bd" strokeWidth="1.7" markerEnd="url(#mlip-teal)" />

        {/* Stage 3: Extrapolation Gate */}
        <g onClick={() => setStageIndex(3)} style={{ cursor: 'pointer' }}>
          <rect
            x="32"
            y="180"
            width="230"
            height="96"
            rx="8"
            fill={stageIndex === 3 ? '#1e2c2a' : '#161b1a'}
            stroke={stageIndex === 3 ? '#8bc6bd' : '#8bc6bd55'}
            strokeWidth={stageIndex === 3 ? 1.8 : 1}
          />
          <text x="48" y="203" fill="#8bc6bd" fontSize="9.5" letterSpacing="1">04 · ACTIVE SELECTION</text>
          <text x="48" y="227" fill="#f5eadf" fontSize="15" fontFamily="DM Serif Display, serif">Extrapolation Gate</text>
          <text x="48" y="246" fill="#c7bdb3" fontSize="10.5">Flag novel atomic neighbourhoods</text>
          <text x="48" y="263" fill="#9fb9b4" fontSize="10">Append DFT frames → retrain potential</text>
        </g>

        {/* Feedback return loop */}
        <path
          d="M147 278V298H460V281"
          fill="none"
          stroke="#8bc6bd"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          markerEnd="url(#mlip-teal)"
        />
        <rect x="218" y="287" width="174" height="20" rx="10" fill="#14110e" />
        <text x="305" y="301" textAnchor="middle" fill="#8bc6bd" fontSize="9.5" letterSpacing=".6">
          RETRAIN UNTIL VALIDATED
        </text>
      </svg>

      <div className={s.mlipPills} role="group" aria-label="Select training pipeline stage">
        {MLIP_STAGES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={idx === stageIndex}
            onClick={() => setStageIndex(idx)}
          >
            {item.number} · {item.title}
          </button>
        ))}
      </div>

      <p className={s.mlipReadout} aria-live="polite">
        <strong>{stage.subtitle}:</strong> {stage.summary}
      </p>
    </div>
  );
}

export function PublishedStudyCardFigure({ figure, structureFigure, customDiagram, title, onInspect }) {
  const [showStructure, setShowStructure] = useState(false);
  const [showOriginalDiagram, setShowOriginalDiagram] = useState(false);

  const activeFigure = !customDiagram && showStructure && structureFigure ? structureFigure : figure;
  const panels = FIGURE_PANELS[activeFigure.src] || null;
  const [panelId, setPanelId] = useState(() => {
    if (panels && typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
      return panels[1]?.id || 'full';
    }
    return 'full';
  });

  useEffect(() => {
    if (panels && typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
      setPanelId(panels[1]?.id || 'full');
    } else {
      setPanelId('full');
    }
  }, [activeFigure.src]);

  const activePanel = panels?.find(p => p.id === panelId) || null;

  const inspectActive = () => {
    onInspect?.({
      src: activeFigure.src,
      dimensions: [activeFigure.width, activeFigure.height],
      eyebrow: `Published figure · ${activeFigure.source || 'Research study'}`,
      title,
      alt: activeFigure.alt,
      caption: activeFigure.caption,
      panels,
      initialPanel: panelId,
      isPaperFigure: true,
    });
  };

  return (
    <figure className={`${stylesForStudy()} ${s.archivalFigureCard}`}>
      {structureFigure && (
        <div className={s.figureModes} role="group" aria-label="Graphene evidence">
          <button type="button" aria-pressed={!showStructure} onClick={() => setShowStructure(false)}>
            Heat transport
          </button>
          <button type="button" aria-pressed={showStructure} onClick={() => setShowStructure(true)}>
            Sheet shape
          </button>
        </div>
      )}

      {customDiagram && (
        <div className={s.figureModes} role="group" aria-label="Workflow presentation">
          <button type="button" aria-pressed={!showOriginalDiagram} onClick={() => setShowOriginalDiagram(false)}>
            Interactive workflow
          </button>
          <button type="button" aria-pressed={showOriginalDiagram} onClick={() => setShowOriginalDiagram(true)}>
            Published Figure 1
          </button>
        </div>
      )}

      {(!customDiagram || showOriginalDiagram) ? (
        <>
          <p className={s.figureReading} aria-live="polite">
            <strong>Start here</strong>
            {activeFigure.reading}
          </p>

          {panels && (
            <div className={s.panelPills} role="group" aria-label="Focus a sub-panel">
              {panels.map(panel => (
                <button
                  key={panel.id}
                  type="button"
                  aria-pressed={panel.id === panelId}
                  onClick={() => setPanelId(panel.id)}
                >
                  {panel.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className={s.archivalMatteButton}
            onClick={inspectActive}
            aria-label={`Inspect ${activeFigure.source || 'figure'} at full zoom: ${title}`}
          >
            <PanelCropImage
              src={activeFigure.src}
              width={activeFigure.width}
              height={activeFigure.height}
              alt={activeFigure.alt}
              panel={activePanel}
            />
          </button>

          <figcaption className={s.figureFooterBar}>
            <span>
              {activeFigure.source ? `${activeFigure.source} · ` : ''}
              {activeFigure.caption}
            </span>
            <button type="button" className={s.inspectTrigger} onClick={inspectActive}>
              Inspect figure ⤢
            </button>
          </figcaption>
        </>
      ) : (
        <>
          {customDiagram({ onInspectOriginal: inspectActive })}
          <figcaption className={s.figureFooterBar}>
            <span>{figure.source} · {figure.caption}</span>
            <button type="button" className={s.inspectTrigger} onClick={inspectActive}>
              Original Figure 1 ⤢
            </button>
          </figcaption>
        </>
      )}
    </figure>
  );
}

function stylesForStudy() {
  return shared.researchSlideFigure;
}

export function HeroScaleCard({ data, onExploreLab, onInspect }) {
  const [scaleId, setScaleId] = useState(data.scales[0].id);
  const activeScale = data.scales.find(item => item.id === scaleId) || data.scales[0];

  const inspectHero = () => {
    onInspect?.({
      src: data.image.src,
      dimensions: [data.image.width, data.image.height],
      eyebrow: 'Conceptual opening · Continuum to molecular scale',
      title: 'From a visible droplet to individual water molecules',
      alt: data.image.alt,
      caption: data.caption,
      isPaperFigure: false,
    });
  };

  return (
    <aside className={s.heroScaleCard} aria-label="Physical scale bridge">
      <button
        type="button"
        className={s.heroVisualButton}
        onClick={inspectHero}
        aria-label="Inspect opening water droplet visual at full size"
      >
        <img
          src={data.image.src}
          width={data.image.width}
          height={data.image.height}
          alt={data.image.alt}
          fetchPriority="high"
          decoding="async"
        />
        <span className={s.heroVisualTag}>{activeScale.badge}</span>
      </button>

      <div className={s.heroScaleControls}>
        <div className={s.heroScalePills} role="group" aria-label="Zoom across length scales">
          {data.scales.map(scale => (
            <button
              key={scale.id}
              type="button"
              aria-pressed={scale.id === scaleId}
              onClick={() => setScaleId(scale.id)}
            >
              {scale.label}
            </button>
          ))}
        </div>
        <p className={s.heroScaleDetail} aria-live="polite">
          {activeScale.detail}
        </p>
        <button type="button" className={s.heroLabShortcut} onClick={onExploreLab}>
          Launch live H₂O explorer ↓
        </button>
      </div>
    </aside>
  );
}
