import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { grapheneArticle as article } from '../../data/grapheneArticle.mjs';
import styles from './GrapheneArticle.module.css';
const Explorer = lazy(() => import('./GrapheneExplorer'));

class ModelBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function Source({ index }) { return <a className={styles.citation} href={article.sources[index].url} aria-label={`Source: ${article.sources[index].label}`}>[{index + 1}]</a>; }

export default function Graphene() {
  const [mounted, setMounted] = useState(false), [unavailable, setUnavailable] = useState(false);
  const [separation, setSeparation] = useState(0.45), [single, setSingle] = useState(false);
  const [view, setView] = useState({ name: 'perspective' }), [answer, setAnswer] = useState(null);
  useEffect(() => { setMounted(true); }, []);
  const fallback = <div className={styles.fallback}><span aria-hidden="true">⬡</span><p>{unavailable ? '3D is unavailable on this device.' : 'Preparing the carbon lattice…'}</p><p>Carbon atoms form a honeycomb. Stack the sheets to make graphite; isolate one sheet to see graphene.</p></div>;
  function reset() { setSingle(false); setSeparation(0.45); setView({ name: 'perspective' }); }
  return <div className={styles.page} data-site-motion-ignore="true">
    <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}>Science explained / 01</div>
        <h1>What is <em>graphene,</em><br />and why does it matter?</h1>
        <div className={styles.heroBottom}><p>{article.intro}</p><span>Explore in 3D<br />Then go a little deeper ↓</span></div>
      </header>
      <section className={styles.experience} aria-labelledby="explorer-title">
        <div className={styles.explorerHeading}><div><span className={styles.eyebrow}>An atomic perspective</span><h2 id="explorer-title">One layer changes the story.</h2></div><span className={styles.liveLabel}>Interactive 3D</span></div>
        <div className={styles.lab}>
          <div className={styles.viewport} role="group" aria-label="Interactive carbon lattice. Drag to rotate, or use the view buttons below.">
            <div className={styles.modelLabel}>{single ? 'GRAPHENE / ONE SHEET' : 'GRAPHITE / LAYERED STRUCTURE'}</div>
            <ModelBoundary fallback={<div className={styles.fallback}><p>The 3D model could not load. Graphene is one honeycomb sheet of carbon; graphite contains stacked sheets. You can continue reading below.</p></div>}>
              {mounted && !unavailable ? <Suspense fallback={fallback}><Explorer separation={separation} single={single} view={view} onUnavailable={() => setUnavailable(true)} /></Suspense> : fallback}
            </ModelBoundary>
            <p className={styles.dragHint}>Drag to orbit · Use view buttons for preset angles</p>
          </div>
          <div className={styles.controls}>
            <span className={styles.eyebrow}>Try it yourself</span>
            <h3>{single ? 'Meet graphene.' : 'Start with the stack.'}</h3>
            <p aria-live="polite">{single ? 'You are looking at a single carbon sheet. Every interior atom connects to three neighbours, forming the honeycomb lattice.' : 'Graphite contains many stacked sheets. Here, three representative layers let you explore how a sheet can be separated.'}</p>
            <div className={styles.modeButtons} role="group" aria-label="Material view">
              <button aria-pressed={!single} onClick={() => setSingle(false)}>Layered graphite</button>
              <button aria-pressed={single} onClick={() => setSingle(true)}>Isolate graphene</button>
            </div>
            <label className={styles.sliderLabel} htmlFor="layer-separation">Separate the layers <span>{single ? 'Single sheet' : `${Math.round(separation * 100)}%`}</span></label>
            <input id="layer-separation" type="range" min="0" max="1" step="0.01" value={separation} disabled={single} onChange={e => setSeparation(Number(e.target.value))} aria-describedby="model-note" />
            <div className={styles.viewButtons} role="group" aria-label="Camera presets">
              <button onClick={() => setView({ name: 'top' })}>Top view</button><button onClick={() => setView({ name: 'edge' })}>Edge view</button><button onClick={reset}>Reset</button>
            </div>
            <p id="model-note" className={styles.note}>Illustration, not a simulation. Atom sizes and layer spacing are adjusted for clarity. Bonds within sheets are shown; weaker attractions between sheets are not.</p>
          </div>
        </div>
      </section>
      <nav className={styles.contents} aria-label="In this article"><span>Go deeper</span>{article.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.number} / {section.id === 'what-is-graphene' ? 'The basics' : section.id === 'why-it-matters' ? 'Why it matters' : 'The challenge'}</a>)}</nav>
      <article>
        {article.sections.map(section => <section id={section.id} key={section.id} className={styles.chapter}>
          <div><span className={styles.eyebrow}>Chapter {section.number}</span><h2>{section.title}</h2></div>
          <div className={styles.prose}>{section.paragraphs.map((p, i) => <p key={p}>{p}{i === section.paragraphs.length - 1 && <> <Source index={section.source} /></>}</p>)}</div>
          {section.id === 'why-it-matters' && <div className={styles.applications}>{article.applications.map((application, i) => <div key={application.title}><span className={styles.eyebrow}>0{i + 1} / Possibilities</span><h3>{application.title}</h3><p>{application.text} <Source index={application.source} /></p></div>)}</div>}
        </section>)}
      </article>
      <section className={styles.quiz} aria-labelledby="quiz-title"><div><span className={styles.eyebrow}>A quick thought experiment</span><h2 id="quiz-title">You isolate one sheet<br />from graphite. What is it?</h2></div><div>
        <div className={styles.answers} role="group" aria-label="Choose your answer">{['Graphene', 'Diamond', 'A new element'].map(option => <button key={option} aria-pressed={answer === option} onClick={() => setAnswer(option)}>{option}</button>)}</div>
        <p className={styles.feedback} aria-live="polite">{answer === null ? 'Choose an answer to see the explanation.' : answer === 'Graphene' ? 'Exactly. Graphene is one carbon layer from the graphite stack. The element stays carbon; the structure makes the difference.' : 'Try again. The atoms are still carbon, and the isolated honeycomb sheet has its own name. Use the 3D explorer above for a clue.'}</p>
      </div></section>
      <section className={styles.closing}><span className={styles.eyebrow}>From understanding to making</span><h2>How do we make<br />these materials useful?</h2><p>My research explores how gas-driven processes separate layered materials and how their structure affects the result.</p><div><Link to="/R&D-Portfolio">Explore my R&D work ↗</Link><Link to="/journal/">Read the research ↗</Link></div></section>
      <section className={styles.sources} aria-labelledby="sources-title"><h2 id="sources-title">Sources & further reading</h2><ol>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.label} ↗</a></li>)}</ol></section>
    </main>
  </div>;
}
