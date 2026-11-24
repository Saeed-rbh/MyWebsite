import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import shared from './GrapheneArticle.module.css';
import styles from './Metrology.module.css';

const FIGURE_DIMENSIONS = {
  'mos2-tem': [1430, 529],
  'mos2-xps': [1440, 542],
  'mos2-raman': [1457, 788],
  'hbn-raman': [1452, 797],
  'graphene-raman': [1438, 789],
  'hbn-tem': [1422, 523],
  'uv-vis-calibration': [750, 726],
  'graphene-tem': [1436, 528],
};

const FIGURE_PANELS = {
  'graphene-tem': [
    { id: 'full', label: 'Full strip' },
    { id: 'a', label: '(a) STEM', x0: 0, span: 0.335 },
    { id: 'b', label: '(b) TEM', x0: 0.333, span: 0.335 },
    { id: 'c', label: '(c) HRTEM', x0: 0.665, span: 0.335 },
  ],
  'hbn-tem': [
    { id: 'full', label: 'Full strip' },
    { id: 'a', label: '(a) STEM', x0: 0, span: 0.335 },
    { id: 'b', label: '(b) TEM', x0: 0.333, span: 0.335 },
    { id: 'c', label: '(c) HRTEM', x0: 0.665, span: 0.335 },
  ],
  'mos2-tem': [
    { id: 'full', label: 'Full strip' },
    { id: 'a', label: '(a) STEM', x0: 0, span: 0.335 },
    { id: 'b', label: '(b) TEM', x0: 0.333, span: 0.335 },
    { id: 'c', label: '(c) HRTEM', x0: 0.665, span: 0.335 },
  ],
  'mos2-xps': [
    { id: 'full', label: 'Full strip' },
    { id: 'a', label: '(a) Reference MoS₂', x0: 0, span: 0.336 },
    { id: 'b', label: '(b) He-CFE MoS₂', x0: 0.332, span: 0.336 },
    { id: 'c', label: '(c) Air-CFE MoS₂', x0: 0.664, span: 0.336 },
  ],
  'mos2-raman': [
    { id: 'full', label: 'Both panels' },
    { id: 'a', label: '(a) Centrifugation (Air)', x0: 0, span: 0.502 },
    { id: 'b', label: '(b) Carrier gas', x0: 0.498, span: 0.502 },
  ],
  'graphene-raman': [
    { id: 'full', label: 'Both panels' },
    { id: 'a', label: '(a) Centrifugation (Air)', x0: 0, span: 0.502 },
    { id: 'b', label: '(b) Carrier gas', x0: 0.498, span: 0.502 },
  ],
  'hbn-raman': [
    { id: 'full', label: 'Both panels' },
    { id: 'a', label: '(a) Centrifugation (Air)', x0: 0, span: 0.502 },
    { id: 'b', label: '(b) Carrier gas', x0: 0.498, span: 0.502 },
  ],
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function ArticleText({ text, highlights = [] }) {
  if (!text || !highlights.length) return text;
  const valid = highlights.filter(Boolean);
  if (!valid.length) return text;
  const pattern = new RegExp(`(${valid.map(escapeRegExp).join('|')})`, 'gi');
  const seen = new Set();
  const parts = text.split(pattern);
  return parts.map((part, index) => {
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
    <details open={open} className={`${shared.figureDetails} ${styles.smoothDetails} ${className}`}>
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
            className={styles.detailsBody}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </details>
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
  const [naturalW, naturalH] = item.dimensions || [1536, 1024];

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
      className={styles.lightboxBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect ${item.title}`}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className={styles.lightboxDialog}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.lightboxHeader}>
          <div className={styles.lightboxMeta}>
            <span>{item.eyebrow || 'Figure inspection'}</span>
            <h3>{item.title}</h3>
          </div>
          <div className={styles.lightboxToolbar}>
            <div className={styles.lightboxZoomGroup} role="group" aria-label="Zoom level">
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
              className={styles.lightboxClose}
              onClick={onClose}
              aria-label="Close figure viewer"
            >
              Close ✕
            </button>
          </div>
        </div>

        {panels && (
          <div className={styles.lightboxPanels} role="group" aria-label="Focus panel inside figure">
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
          className={`${styles.lightboxStage} ${item.isPaperFigure ? styles.lightboxPaper : ''}`}
          data-zoomed={zoom > 1 || undefined}
          data-dragging={dragging || undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className={styles.lightboxTransform}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            }}
          >
            {isCropped ? (
              <div
                className={styles.panelCropFrame}
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

        <p className={styles.lightboxCaption}>
          {item.caption} {zoom > 1 ? '· Drag image to pan' : '· Choose 2× or 3× to inspect axes and scale bars'}
        </p>
      </motion.div>
    </div>,
    document.body
  );
}

export function ThesisFigure({ name, title, reading, number, legendItems, onInspect }) {
  const panels = FIGURE_PANELS[name] || null;
  const [activePanelId, setActivePanelId] = useState(() => {
    if (
      panels &&
      panels.length > 3 &&
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 640px)').matches
    ) {
      return 'a';
    }
    return 'full';
  });

  const dims = FIGURE_DIMENSIONS[name] || [1400, 780];
  const activePanel = panels?.find(panel => panel.id === activePanelId) || null;
  const isCropped = Boolean(activePanel && activePanel.id !== 'full');
  const src = `/images/metrology/${name}.png`;

  const inspectItem = () => {
    onInspect?.({
      src,
      dimensions: dims,
      eyebrow: `My dissertation · Figure ${number}`,
      title,
      alt: `${title}. Original thesis Figure ${number}. ${reading}`,
      caption: reading,
      panels,
      initialPanel: activePanelId,
      isPaperFigure: true,
    });
  };

  return (
    <figure
      className={`${shared.literatureFigure} ${styles.thesisFigure}`}
      data-layout={dims[1] > dims[0] ? 'portrait' : 'landscape'}
    >
      <header className={styles.thesisFigureHeader}>
        <div>
          <span className={shared.eyebrow}>My dissertation / Figure {number}</span>
          <h3>{title}</h3>
          <p className={shared.figureStart}>{reading}</p>
        </div>
        <button
          type="button"
          className={styles.inspectTrigger}
          onClick={inspectItem}
          aria-label={`Inspect Figure ${number} at full zoom: ${title}`}
        >
          Inspect figure ⤢
        </button>
      </header>

      {legendItems?.length > 0 && (
        <ul className={styles.figureLegendBar} aria-label="Calibration curve material key">
          {legendItems.map(item => (
            <li key={item.id}>
              <span
                className={`${styles.legendSwatch} ${styles[`marker_${item.marker}`]}`}
                style={{ '--swatch': item.plotColor, '--ring': item.uiColor }}
                aria-hidden="true"
              />
              <strong>{item.label}</strong>
              <span>
                {item.wavelength} nm · ε = {item.epsilon} L g⁻¹ m⁻¹
              </span>
            </li>
          ))}
        </ul>
      )}

      {panels && (
        <div className={styles.panelFocusBar} role="group" aria-label={`Inspect panel of Figure ${number}`}>
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

      <div className={styles.paperMatte}>
        <button
          type="button"
          className={styles.figureSurfaceButton}
          onClick={inspectItem}
          aria-label={`Zoom into thesis Figure ${number}: ${title}`}
        >
          {isCropped ? (
            <div
              className={styles.panelCropViewport}
              style={{ aspectRatio: `${dims[0] * activePanel.span} / ${dims[1]}` }}
            >
              <img
                src={src}
                width={dims[0]}
                height={dims[1]}
                alt={`${title} (${activePanel.label}). Original thesis Figure ${number}. ${reading}`}
                loading="lazy"
                decoding="async"
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
              src={src}
              width={dims[0]}
              height={dims[1]}
              alt={`${title}. Original thesis Figure ${number}. ${reading}`}
              loading="lazy"
              decoding="async"
            />
          )}
        </button>
      </div>

      <figcaption className={shared.compactFigureCaption}>
        <p>
          <cite>Saeed Arabha · PhD dissertation, 2026</cite> · Figure {number} · Unaltered ·{' '}
          <a href={src} target="_blank" rel="noopener noreferrer">
            Open raw PNG ↗
          </a>
        </p>
        <SmoothDetails summary="Image details">
          <p>{reading}</p>
          <p>Use panel focus buttons or Inspect figure to zoom into axes, deconvoluted labels, and scale bars.</p>
        </SmoothDetails>
      </figcaption>
    </figure>
  );
}

const PRELOADED_URLS = new Set();
export function preloadImage(src) {
  if (typeof Image === 'undefined' || !src || PRELOADED_URLS.has(src)) return;
  PRELOADED_URLS.add(src);
  const img = new Image();
  img.src = src;
}

export function FigureExplorer({ kind, figureSets, note, onInspect }) {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { once: true, amount: 0.15 });
  const figures = figureSets[kind];
  const [name, title, reading, number] = figures[selected];

  useEffect(() => {
    if (!inView) return;
    figures.forEach(([figName]) => preloadImage(`/images/metrology/${figName}.png`));
  }, [inView, figures]);

  return (
    <div ref={rootRef} className={styles.fullWidth}>
      <div className={styles.materialSwitch} role="group" aria-label={`Choose material for ${kind}`}>
        {figures.map((fig, index) => {
          const isSelected = index === selected;
          return (
            <button
              type="button"
              key={fig[0]}
              aria-pressed={isSelected}
              onMouseEnter={() => preloadImage(`/images/metrology/${fig[0]}.png`)}
              onClick={() => setSelected(index)}
              className={styles.materialTab}
            >
              {isSelected && (
                <motion.span
                  layoutId={`pill-${kind}`}
                  className={styles.materialTabBg}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className={styles.materialTabLabel}>{fig[1]}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={name}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <ThesisFigure
            name={name}
            title={title}
            reading={reading}
            number={number}
            onInspect={onInspect}
          />
        </motion.div>
      </AnimatePresence>

      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}

export function CalibrationExplorer({ article, onInspect }) {
  const curves = article.calibrationCurves || [];
  const recovery = article.results?.[1];
  const [materialId, setMaterialId] = useState('graphene');
  const [dilution, setDilution] = useState(4);
  const [measuredCuvette, setMeasuredCuvette] = useState(0.08);
  const reduceMotion = useReducedMotion();

  const curve = curves.find(c => c.id === materialId) || curves[0];
  const stockConc = measuredCuvette * dilution;
  // Figure 6.7 reports A/l in m⁻¹ against g/L. For 1 cm path l = 0.01 m:
  const attenuationPerMeter = curve.epsilon * measuredCuvette;
  const absorbance = attenuationPerMeter * 0.01;
  const transmittance = Math.pow(10, -absorbance);
  const pctTransmitted = Math.max(2, Math.min(99, transmittance * 100));
  const stockOpacity = Math.min(0.95, 0.24 + stockConc * 0.48);
  const dilutedOpacity = Math.min(0.88, 0.14 + absorbance * 0.34);
  const outsideLinear = measuredCuvette > curve.linearMax;

  return (
    <div className={styles.fullWidth}>
      {recovery && (
        <aside className={styles.recoveryHighlight} aria-label="Measured graphene yield result">
          <div>
            <span className={shared.eyebrow}>Thesis quantitative payoff · {recovery.locator}</span>
            <h4>Turning calibration curves into measured yield</h4>
            <p>{recovery.interpretation}</p>
          </div>
          <div className={styles.recoveryStatBlock}>
            <div className={styles.recoveryFigures}>
              <strong>
                {recovery.value} {recovery.unit}
              </strong>
              <span>
                {recovery.recoveryPercent}% recovered of {recovery.feedMass} {recovery.feedMassUnit} feed
              </span>
            </div>
            <div className={styles.recoveryBarTrack} aria-hidden="true">
              <motion.div
                className={styles.recoveryBarFill}
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: recovery.recoveryPercent / 100 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <small>Measured across 3 compressible flow exfoliation passes with sediment recycling</small>
          </div>
        </aside>
      )}

      <ThesisFigure
        name="uv-vis-calibration"
        title="Calibrate before comparing."
        number="6.7"
        reading="Known gravimetric concentrations connect blank-corrected optical attenuation (A/l in m⁻¹) to suspended mass. Each material has its own wavelength and slope."
        legendItems={curves}
        onInspect={onInspect}
      />

      <section className={styles.calibrationWorkbench} aria-label="Interactive Beer-Lambert dilution explorer">
        <div className={styles.calibrationHeader}>
          <span className={shared.eyebrow}>Try the idea / Interactive dilution &amp; cuvette optics</span>
          <h3>Why we dilute dense batches before reading UV–Vis</h3>
          <p>
            Select a material calibration slope from Figure 6.7 and adjust dilution or cuvette concentration. Dense stocks saturate or scatter excessively; diluting into the calibrated linear window lets you back-calculate the true batch concentration.
          </p>
        </div>

        <div className={styles.calibrationGrid}>
          <div className={styles.calibrationControls}>
            <div className={styles.materialPills} role="group" aria-label="Choose calibration material">
              {curves.map(item => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === curve.id}
                  onClick={() => setMaterialId(item.id)}
                >
                  {item.label} · {item.wavelength} nm
                </button>
              ))}
            </div>

            <div className={styles.sliderField}>
              <label htmlFor="cuvette-conc">
                <span>Diluted cuvette reading</span>
                <strong>{measuredCuvette.toFixed(2)} g L⁻¹</strong>
              </label>
              <input
                id="cuvette-conc"
                type="range"
                min="0.02"
                max="0.22"
                step="0.01"
                value={measuredCuvette}
                onChange={e => setMeasuredCuvette(Number(e.target.value))}
              />
            </div>

            <div className={styles.sliderField}>
              <label htmlFor="dilution">
                <span>Dilution factor</span>
                <strong>{dilution}×</strong>
              </label>
              <input
                id="dilution"
                type="range"
                min="1"
                max="10"
                step="1"
                value={dilution}
                onChange={e => setDilution(Number(e.target.value))}
              />
            </div>

            <output htmlFor="cuvette-conc dilution" className={styles.calibrationOutput} aria-live="polite">
              <strong>{stockConc.toFixed(2)} g L⁻¹</strong>
              <small>
                Original stock ({measuredCuvette.toFixed(2)} × {dilution}×) · Teaching calculation using Figure 6.7 ε = {curve.epsilon} L g⁻¹ m⁻¹
              </small>
            </output>
          </div>

          <div className={styles.calibrationVisual}>
            <svg viewBox="0 0 430 220" className={styles.cuvetteSvg} role="img" aria-label={`Stock bottle at ${stockConc.toFixed(2)} g/L diluted ${dilution} times to ${measuredCuvette.toFixed(2)} g/L in a 1 cm cuvette transmitting ${pctTransmitted.toFixed(0)}% light`}>
              {/* Stock bottle */}
              <rect x="44" y="42" width="24" height="12" rx="2" fill="#2b2118" stroke="#d49d8166" />
              <path d="M 32 54 L 80 54 L 88 76 L 88 164 Q 88 172 80 172 L 32 172 Q 24 172 24 164 L 24 76 Z" fill="#17130f" stroke="#d49d81" strokeWidth="1.3" />
              <rect x="27" y="88" width="58" height="81" rx="3" fill={curve.uiColor} fillOpacity={stockOpacity} />
              <text x="56" y="192" textAnchor="middle" fill="#f0dccb" fontSize="11.5">Stock bottle</text>
              <text x="56" y="207" textAnchor="middle" fill="#e9b594" fontSize="10.5">{stockConc.toFixed(2)} g L⁻¹</text>

              {/* Dilution arrow */}
              <path d="M 96 118 H 164" stroke="#d49d8180" strokeDasharray="3 3" strokeWidth="1.5" />
              <polygon points="164,118 156,114 156,122" fill="#d49d81" />
              <text x="130" y="108" textAnchor="middle" fill="#b9a99b" fontSize="10.5">dilute {dilution}×</text>

              {/* Light beam I0 */}
              <line x1="178" y1="126" x2="240" y2="126" stroke="#e9b594" strokeWidth="5" strokeLinecap="round" />
              <text x="206" y="114" textAnchor="middle" fill="#e9b594" fontSize="12">I₀</text>

              {/* 1 cm cuvette */}
              <rect x="240" y="66" width="60" height="106" rx="4" fill="#17130f" stroke="#d49d81" strokeWidth="1.4" />
              <rect x="243" y="88" width="54" height="81" rx="2" fill={curve.uiColor} fillOpacity={dilutedOpacity} />
              <text x="270" y="192" textAnchor="middle" fill="#f0dccb" fontSize="11.5">1 cm cuvette</text>
              <text x="270" y="207" textAnchor="middle" fill="#8bc6bd" fontSize="10.5">{measuredCuvette.toFixed(2)} g L⁻¹</text>

              {/* Transmitted beam I */}
              <line
                x1="300"
                y1="126"
                x2="372"
                y2="126"
                stroke="#8bc6bd"
                strokeWidth={Math.max(1.2, 5 * transmittance)}
                strokeOpacity={Math.max(0.25, transmittance)}
              />
              <rect x="374" y="106" width="20" height="40" rx="4" fill="#211913" stroke="#8bc6bd" strokeWidth="1.3" />
              <text x="342" y="114" textAnchor="middle" fill="#8bc6bd" fontSize="12">
                {pctTransmitted.toFixed(0)}%
              </text>
              <text x="342" y="144" textAnchor="middle" fill="#b9a99b" fontSize="10">
                I / I₀
              </text>
            </svg>

            <div className={styles.calibrationMetrics}>
              <div>
                <span>Blank-corrected A / l</span>
                <strong>{attenuationPerMeter.toFixed(0)} m⁻¹</strong>
              </div>
              <div>
                <span>Calibration window</span>
                <strong data-warn={outsideLinear || undefined}>
                  {outsideLinear ? 'Above linear data range' : 'Inside calibrated range'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const RAMAN_PEAK_CENTERS = {
  'Bulk precursor': { e2g: 375.8, a1g: 402.01 },
  '1500 rpm fraction': { e2g: 376.0, a1g: 402.01 },
  '3000 rpm fraction': { e2g: 376.2, a1g: 400.48 },
  '4500 rpm fraction': { e2g: 376.6, a1g: 400.11 },
};

function lorentzianPath(center1, amp1, center2, amp2, width = 3.6) {
  const pts = [];
  for (let x = 355; x <= 425; x += 0.7) {
    const l1 = amp1 / (1 + Math.pow((x - center1) / width, 2));
    const l2 = amp2 / (1 + Math.pow((x - center2) / width, 2));
    const y = 132 - (l1 + l2) * 84;
    const svgX = ((x - 355) / 70) * 380 + 36;
    pts.push(`${svgX.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

export function RamanExplorer({ result }) {
  const [activeIndex, setActiveIndex] = useState(3);
  const plotRef = useRef(null);
  const inView = useInView(plotRef, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();

  const activeDatum = result.data[activeIndex] || result.data[0];
  const bulkValue = result.data[0].value;
  const activeDeltaFromBulk = activeDatum.value - bulkValue;
  const centers = RAMAN_PEAK_CENTERS[activeDatum.sample] || {
    e2g: 376.0,
    a1g: 376.0 + activeDatum.value,
  };
  const xForShift = shift => ((shift - 355) / 70) * 380 + 36;
  const bulkPct = ((bulkValue - 22) / 5) * 100;

  return (
    <figure ref={plotRef} className={styles.ramanResults}>
      <header className={styles.ramanHeader}>
        <div>
          <span className={shared.eyebrow}>Read the measurement / MoS₂ · {result.locator}</span>
          <h3>
            Two peaks move closer together.
            <br />
            <span className={shared.headingAccent}>A clue that the sheets are thinner.</span>
          </h3>
          <p>
            Hover or choose any centrifuge fraction below to inspect how the out-of-plane (A₁g) and in-plane (E₂g¹) gap Δ narrows relative to the bulk precursor.
          </p>
        </div>

        <div className={styles.ramanFractionButtons} role="group" aria-label="Inspect MoS₂ centrifuge fraction">
          {result.data.map((item, idx) => (
            <button
              key={item.sample}
              type="button"
              aria-pressed={idx === activeIndex}
              onClick={() => setActiveIndex(idx)}
            >
              {item.sample.replace(' fraction', '').replace(' precursor', '')}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.ramanSplitLayout}>
        <div
          className={styles.dotPlot}
          role="img"
          aria-label={result.data.map(d => `${d.sample}: ${d.value} reciprocal centimetres`).join('; ')}
        >
          <div className={styles.axis}>
            <span>22</span>
            <span>23</span>
            <span>24</span>
            <span>25</span>
            <span>26</span>
            <span>27 cm⁻¹</span>
          </div>
          {result.data.map((datum, index) => {
            const pct = ((datum.value - 22) / 5) * 100;
            const shiftPct = Math.max(0, bulkPct - pct);
            const isSelected = index === activeIndex;
            const isBulk = index === 0;
            return (
              <button
                key={datum.sample}
                type="button"
                className={styles.plotRowButton}
                data-selected={isSelected || undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <span className={styles.plotSampleName}>{datum.sample}</span>
                <span className={styles.plotTrack}>
                  <span
                    className={styles.bulkGuideLine}
                    style={{ left: `${bulkPct}%` }}
                    aria-hidden="true"
                  />
                  {!isBulk && (
                    <motion.span
                      className={styles.shiftSpanBar}
                      style={{ left: `${pct}%`, width: `${shiftPct}%` }}
                      initial={reduceMotion ? false : { scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <motion.i
                    data-bulk={isBulk || undefined}
                    initial={reduceMotion ? false : { left: `${bulkPct}%` }}
                    animate={{ left: inView || reduceMotion ? `${pct}%` : `${bulkPct}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <strong>{datum.value.toFixed(2)}</strong>
              </button>
            );
          })}
        </div>

        <div className={styles.ramanPeakPanel}>
          <div className={styles.ramanPeakHeader}>
            <span>{activeDatum.sample}</span>
            <strong>
              Δ = {activeDatum.value.toFixed(2)} cm⁻¹{' '}
              <small>
                ({activeIndex === 0 ? 'baseline' : `${activeDeltaFromBulk.toFixed(2)} cm⁻¹ vs bulk`})
              </small>
            </strong>
          </div>
          <svg
            viewBox="0 0 452 170"
            className={styles.ramanCurveSvg}
            role="img"
            aria-label={`Conceptual two-peak curve for ${activeDatum.sample} showing separation Δ = ${activeDatum.value.toFixed(2)} reciprocal centimetres`}
          >
            {/* Reference bulk peak markers */}
            <line x1={xForShift(375.8)} y1="18" x2={xForShift(375.8)} y2="132" stroke="#b9a99b38" strokeDasharray="3 3" />
            <line x1={xForShift(402.01)} y1="18" x2={xForShift(402.01)} y2="132" stroke="#b9a99b38" strokeDasharray="3 3" />
            {/* Baseline axis */}
            <line x1="36" y1="132" x2="416" y2="132" stroke="#d49d8140" />
            <motion.path
              fill="none"
              stroke={activeIndex === 0 ? '#c9bfb5' : '#e9b594'}
              strokeWidth="2.4"
              animate={{ d: lorentzianPath(centers.e2g, 0.56, centers.a1g, 0.94) }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Peak separation bracket */}
            <motion.g
              animate={{ x: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              <line
                x1={xForShift(centers.e2g)}
                y1="42"
                x2={xForShift(centers.a1g)}
                y2="42"
                stroke="#8bc6bd"
                strokeWidth="1.6"
              />
              <circle cx={xForShift(centers.e2g)} cy="42" r="2.5" fill="#8bc6bd" />
              <circle cx={xForShift(centers.a1g)} cy="42" r="2.5" fill="#8bc6bd" />
              <text
                x={(xForShift(centers.e2g) + xForShift(centers.a1g)) / 2}
                y="33"
                textAnchor="middle"
                fill="#8bc6bd"
                fontSize="11.5"
                fontFamily="Rubik, sans-serif"
              >
                Δ {activeDatum.value.toFixed(2)} cm⁻¹
              </text>
            </motion.g>
            <text x={xForShift(centers.e2g)} y="152" textAnchor="middle" fill="#c9bfb5" fontSize="10.5">
              E₂g¹ (~{centers.e2g.toFixed(1)})
            </text>
            <text x={xForShift(centers.a1g)} y="152" textAnchor="middle" fill="#c9bfb5" fontSize="10.5">
              A₁g (~{centers.a1g.toFixed(1)})
            </text>
          </svg>
          <p className={styles.ramanCurveNote}>
            Conceptual two-peak curve illustrating the Table 7.13 peak separation; inspect Figure 7.17 below for raw measured spectra.
          </p>
        </div>
      </div>

      <figcaption>
        Values transcribed from thesis Table 7.13; axis spans 22–27 cm⁻¹. Lower separation supports thinning enrichment with other evidence required for exact layer counts. Table 7.13 does not report measurement uncertainties.
      </figcaption>

      <SmoothDetails className={styles.dataDetails} summary="View the measured values">
        <table>
          <caption>MoS₂ Raman peak separation, Table 7.13</caption>
          <thead>
            <tr>
              <th scope="col">Sample</th>
              <th scope="col">Δ (cm⁻¹)</th>
              <th scope="col">Shift vs bulk</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((datum, idx) => (
              <tr key={datum.sample}>
                <th scope="row">{datum.sample}</th>
                <td>{datum.value.toFixed(2)}</td>
                <td>{idx === 0 ? '—' : `${(datum.value - bulkValue).toFixed(2)} cm⁻¹`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SmoothDetails>
    </figure>
  );
}

export function EvidenceMatrix({ matrix = [], onNavigate }) {
  const [filterId, setFilterId] = useState('all');
  if (!matrix.length) return null;

  const visibleRows = filterId === 'all' ? matrix : matrix.filter(row => row.id === filterId);

  return (
    <section className={styles.evidenceMatrix} aria-label="Cross-material characterization synthesis">
      <div className={styles.matrixHeader}>
        <div>
          <span className={shared.eyebrow}>Synthesis / Across all three 2D materials</span>
          <h3>What each instrument proved together</h3>
        </div>
        <div className={styles.matrixFilters} role="group" aria-label="Filter evidence matrix by material">
          <button type="button" aria-pressed={filterId === 'all'} onClick={() => setFilterId('all')}>
            All materials
          </button>
          {matrix.map(row => (
            <button
              key={row.id}
              type="button"
              aria-pressed={filterId === row.id}
              onClick={() => setFilterId(row.id)}
            >
              {row.material}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.matrixCards} data-single={visibleRows.length === 1 || undefined}>
        {visibleRows.map(row => (
          <article key={row.id} className={styles.matrixCard}>
            <header>
              <span className={styles.matrixFormula}>{row.formula}</span>
              <h4>{row.material}</h4>
            </header>
            <dl>
              <div>
                <dt>
                  <button type="button" className={styles.matrixJump} onClick={() => onNavigate('concentration')}>
                    Yield (UV–Vis) ↗
                  </button>
                </dt>
                <dd>{row.yield}</dd>
              </div>
              <div>
                <dt>
                  <button type="button" className={styles.matrixJump} onClick={() => onNavigate('see-the-sheets')}>
                    Morphology (TEM/HRTEM) ↗
                  </button>
                </dt>
                <dd>{row.morphology}</dd>
              </div>
              <div>
                <dt>
                  <button type="button" className={styles.matrixJump} onClick={() => onNavigate('check-the-chemistry')}>
                    Surface bonds (XPS) ↗
                  </button>
                </dt>
                <dd>{row.chemistry}</dd>
              </div>
              <div>
                <dt>
                  <button type="button" className={styles.matrixJump} onClick={() => onNavigate('read-the-vibrations')}>
                    Vibrations (Raman) ↗
                  </button>
                </dt>
                <dd>{row.vibrations}</dd>
              </div>
              <div className={styles.matrixOpenItem}>
                <dt>What stays open</dt>
                <dd>{row.openQuestions}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
