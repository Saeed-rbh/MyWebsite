import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './GrapheneArticle.module.css';

const Explorer = lazy(() => import('./GrapheneExplorer'));
const views = [['perspective', 'Angle'], ['top', 'Top view'], ['edge', 'Side view']];

class ModelBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function GrapheneLab() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [single, setSingle] = useState(false);
  const [separation, setSeparation] = useState(0.45);
  const [view, setView] = useState({ name: 'perspective' });
  const reducedMotion = useReducedMotion();
  const onReady = useCallback(() => setStatus('ready'), []);
  const onUnavailable = useCallback(() => setStatus('unavailable'), []);
  const onOrbitStart = useCallback(() => setView(current => current.name === 'custom' ? current : { name: 'custom' }), []);
  useEffect(() => { setMounted(true); }, []);

  return <section id="graphene-explorer" className={styles.experience} aria-labelledby="explorer-title">
    <header className={styles.explorerHeading} data-graphene-reveal="0">
      <div><span className={styles.eyebrow}>Explore the structure</span><h2 id="explorer-title">From graphite to <span className={styles.textAccent}>graphene.</span></h2></div>
      <span className={styles.labBadge}>Interactive 3D</span>
    </header>
    <div className={styles.lab}>
      <div className={styles.labStage}>
        <div className={styles.viewport} data-interactive={status === 'ready'} role="group" aria-label="Carbon structure explorer" aria-busy={status === 'loading'}>
          {status !== 'ready' && <div className={styles.labPlaceholder} role="status">
            {status === 'loading' ? <><span className={styles.labLoader} aria-hidden="true" /><p>Loading the structure…</p></> : <><p>The 3D model could not load.</p><button type="button" onClick={() => { setAttempt(value => value + 1); setStatus('loading'); }}>Try again</button></>}
          </div>}
          {mounted && status !== 'unavailable' && <ModelBoundary key={attempt} onUnavailable={onUnavailable}>
            <Suspense fallback={null}><Explorer separation={separation} single={single} view={view} onReady={onReady} onUnavailable={onUnavailable} onOrbitStart={onOrbitStart} /></Suspense>
          </ModelBoundary>}
        </div>
        <div className={styles.labToolbar}>
          <span className={styles.labHint}>Drag to rotate</span>
          <div className={styles.labViews} role="group" aria-label="Viewing angle">
            {views.map(([name, label]) => <button key={name} type="button" aria-pressed={view.name === name} onClick={() => setView({ name })}>{label}</button>)}
          </div>
        </div>
      </div>
      <div className={styles.labControls}>
        <span className={styles.eyebrow}>Choose the material</span>
        <div className={styles.labModes} role="group" aria-label="Material">
          <button type="button" aria-pressed={!single} onClick={() => setSingle(false)}>Graphite</button>
          <button type="button" aria-pressed={single} onClick={() => setSingle(true)}>Graphene</button>
        </div>
        <div className={styles.labExplanation} aria-live="polite" aria-atomic="true">
          <motion.div key={single ? 'sheet' : 'stack'} initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}>
            <h3>{single ? 'One carbon sheet.' : 'A stack of sheets.'}</h3>
            <p>{single ? 'Isolate one layer and you have graphene. Its carbon atoms are still joined in a honeycomb.' : 'Graphite contains many carbon layers. Move the sheets apart to see how they stack.'}</p>
          </motion.div>
        </div>
        {!single && <div className={styles.labSpacing}>
          <label htmlFor="layer-separation">Layer spacing</label>
          <input id="layer-separation" type="range" min="0" max="1" step="0.01" value={separation} onChange={event => setSeparation(Number(event.target.value))} aria-valuetext={separation < 0.33 ? 'Layers close together' : separation < 0.67 ? 'Layers partly separated' : 'Layers farther apart'} />
          <div aria-hidden="true"><span>Close</span><span>Separated</span></div>
        </div>}
        {single && <p className={styles.labTakeaway}><span aria-hidden="true">●</span> One layer. One atom thick.</p>}
      </div>
    </div>
    <p className={styles.labNote}>Atom sizes and layer spacing are illustrative.</p>
  </section>;
}
