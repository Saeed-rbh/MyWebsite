import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { grapheneArticle as article } from '../../data/grapheneArticle.mjs';
import styles from './GrapheneArticle.module.css';
import { buildExtendedLattice } from './grapheneLattice.mjs';
import papers from '../../data/journalPapers.json';
import { ScrollFade } from '../Commercialization/StoryMotion';
const researchPaper = papers.find(paper => paper.figures?.some(figure => figure.src === '/journal-figures/graphene-sliding.jpg'));
const Explorer = lazy(() => import('./GrapheneExplorer'));

class ModelBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function Source({ index }) { return <a className={styles.citation} href={article.sources[index].url} aria-label={`Source: ${article.sources[index].label}`}>[{index + 1}]</a>; }

function ApplicationCard({ item, index, root }) {
  return <section id={item.id} className={styles.applicationSection}>
    <ScrollFade root={root} as="header" className={styles.applicationHeader}>
      <span className={styles.applicationIndex} aria-hidden="true">0{index + 1}</span>
      <div><span className={styles.eyebrow}>{item.tag} / In practice</span><h3>{item.title}</h3></div>
    </ScrollFade>
    <div className={styles.applicationBody}>
      <figure className={styles.applicationFigure}>
        <a className={styles.imageLink} href={item.figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge application illustration for ${item.title}`}>
          <img src={item.figure.src} width={item.figure.width} height={item.figure.height} alt={item.figure.alt} loading="lazy" decoding="async" />
          <span className={styles.imageHint} aria-hidden="true">View image ↗</span>
        </a>
        <figcaption>{item.figure.caption}<small>{item.figure.credit}</small></figcaption>
      </figure>
      <div className={styles.applicationCopy}>
        <ScrollFade root={root} as="p">{item.text} <Source index={item.source} /></ScrollFade>
        <ScrollFade root={root} as="dl" stagger={1}><div><dt>Where does it go?</dt><dd>{item.form}</dd></div><div><dt>How can it help?</dt><dd>{item.contribution}</dd></div></ScrollFade>
        <details className={styles.applicationDetails}><summary>What makes it work?</summary><p>{item.challenge}</p></details>
        <a className={styles.researchLink} href={item.figure.url}>Research behind the idea <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
function ProductionMethod({ step, index, root }) {
  return <section className={styles.productionMethod}>
    <ScrollFade root={root} as="header"><span className={styles.eyebrow}>Route 0{index + 1}</span><h4>{step.title}</h4></ScrollFade>
    <div className={styles.productionBody}>
      <figure>
        <a className={styles.imageLink} href={step.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${step.title} illustration`}><img src={step.src} width={step.width || 640} height={step.height || 240} alt={step.alt || step.title} loading="lazy" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a>
        {step.generated && <figcaption>Concept illustration · not to scale · AI-generated</figcaption>}
      </figure>
      <div><ScrollFade root={root} as="p">{step.text} <Source index={step.source} /></ScrollFade><ScrollFade root={root} as="p" stagger={1} className={styles.routeResult}><strong>What you get / what to check</strong>{step.result}</ScrollFade></div>
    </div>
    <ol className={styles.routeStages}>{step.stages.map((stage,i) => <li key={stage}><span aria-hidden="true">0{i+1}</span>{stage}</li>)}</ol>
  </section>;
}

export default function Graphene() {
  const [mounted, setMounted] = useState(false), [unavailable, setUnavailable] = useState(false);
  const [separation, setSeparation] = useState(0.45), [single, setSingle] = useState(false);
  const [view, setView] = useState({ name: 'perspective' }), [answer, setAnswer] = useState(null);
  const [extraColumns, setExtraColumns] = useState(0);
  const extraRows = extraColumns;
  const atomCount = buildExtendedLattice(extraColumns, extraRows).points.length;
  const [opticalLayers, setOpticalLayers] = useState(1);
  const pageRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(article.sections[0].id);
  useEffect(() => {
    const page = pageRef.current;
    let frame;
    const update = () => {
      frame = null;
      const top = page.getBoundingClientRect().top + 170;
      const current = [...article.sections].reverse().find(section => document.getElementById(section.id)?.getBoundingClientRect().top <= top);
      setActiveChapter(current?.id || article.sections[0].id);
      const distance = page.scrollHeight - page.clientHeight;
      page.style.setProperty('--reading-progress', `${distance > 0 ? page.scrollTop / distance * 100 : 0}%`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    page.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { page.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  const jumpToChapter = event => {
    const id = event.target.value;
    const page = pageRef.current;
    const target = document.getElementById(id);
    if (target) page.scrollTo({ top: page.scrollTop + target.getBoundingClientRect().top - page.getBoundingClientRect().top - 150, behavior: 'instant' });
    window.history.replaceState(null, '', `#${id}`);
    setActiveChapter(id);
  };
  const transmission = 100 * Math.pow(0.977, opticalLayers);
  useEffect(() => { setMounted(true); }, []);
  const fallback = <div className={styles.fallback}><span aria-hidden="true">⬡</span><p>{unavailable ? '3D is unavailable on this device.' : 'Preparing the carbon lattice…'}</p><p>Carbon atoms form a honeycomb. Stack the sheets to make graphite; isolate one sheet to see graphene.</p></div>;
  function reset() { setSingle(false); setSeparation(0.45); setExtraColumns(0); setView({ name: 'perspective' }); }
  return <div ref={pageRef} className={styles.page} data-site-motion-ignore="true">
    <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroIdentity}><span className={styles.ghostWord} aria-hidden="true">Carbon.</span><span className={styles.eyebrow}>A closer look at materials</span><h1><span className={styles.heroPrefix}>Meet</span> <em>Graphene.</em></h1><p className={styles.heroKicker}>One atom thick. A world of possibilities.</p></div>
        <ol className={styles.heroJourney} aria-label="The learning journey"><li><span aria-hidden="true">• · ·</span> discover the structure</li><li><span aria-hidden="true">• • ·</span> understand the properties</li><li><span aria-hidden="true">• • •</span> explore the possibilities</li></ol>
        <div className={styles.heroIntro}><h2><span aria-hidden="true">◆</span> What is graphene, and why does it matter?</h2><p>Start with the <a href="#what-is-graphene">graphite in a pencil</a>. Follow one carbon sheet through its <a href="#graphene-discovery">discovery</a>, remarkable <a href="#why-it-matters">properties</a>, and the work of turning a scientific idea into a <a href="#graphene-applications">useful material</a>.</p><div className={styles.heroActions}><a href="#graphene-explorer">Explore the sheet in 3D <span aria-hidden="true">↗</span></a><a href="#what-is-graphene">Read the story <span aria-hidden="true">↓</span></a></div><p className={styles.readingGuide}>Nine chapters · Interactive experiments · Published research</p></div>
      </header>
      <section id="graphene-explorer" className={styles.experience} aria-labelledby="explorer-title">
        <div className={styles.explorerHeading}><div><span className={styles.eyebrow}>An atomic perspective</span><h2 id="explorer-title">One layer changes the story.</h2></div><span className={styles.liveLabel}>Interactive 3D</span></div>
        <div className={styles.lab}>
          <div className={styles.viewport} role="group" aria-label="Interactive carbon lattice. Drag to rotate, or use the view buttons below.">
            <div className={styles.modelLabel}>{single ? 'GRAPHENE / ONE SHEET' : 'GRAPHITE / LAYERED STRUCTURE'}</div>
            <ModelBoundary fallback={<div className={styles.fallback}><p>The 3D model could not load. Graphene is one honeycomb sheet of carbon; graphite contains stacked sheets. You can continue reading below.</p></div>}>
              {mounted && !unavailable ? <Suspense fallback={fallback}><Explorer extraRows={extraRows} extraColumns={extraColumns} separation={separation} single={single} view={view} onUnavailable={() => setUnavailable(true)} /></Suspense> : fallback}
            </ModelBoundary>
            <p className={styles.dragHint}>Drag to orbit · Use view buttons for preset angles</p>
          </div>
          <div className={styles.controls}>
            <span className={styles.eyebrow}>Try it yourself</span>
            <h3>{single ? 'Meet graphene.' : 'Start with the stack.'}</h3>
            <p aria-live="polite">{single ? 'You are looking at a single carbon sheet. The original model reveals the atom and bond structure of the sheet. Drag to inspect it from another angle.' : 'Graphite contains many stacked sheets. Here, three representative layers let you explore how a sheet can be separated.'}</p>
            <div className={styles.modeButtons} role="group" aria-label="Material view">
              <button aria-pressed={!single} onClick={() => setSingle(false)}>Layered graphite</button>
              <button aria-pressed={single} onClick={() => setSingle(true)}>Isolate graphene</button>
            </div>
            <label className={styles.sliderLabel} htmlFor="layer-separation">Separate the layers <span>{single ? 'Single sheet' : `${Math.round(separation * 100)}%`}</span></label>
            <input id="layer-separation" type="range" min="0" max="1" step="0.01" value={separation} disabled={single} onChange={e => setSeparation(Number(e.target.value))} aria-describedby="model-note" />
            <label className={styles.sliderLabel} htmlFor="sheet-length">Extend length & width <span>{atomCount} atoms / layer</span></label>
            <input id="sheet-length" type="range" min="0" max="6" step="1" value={extraColumns} onChange={e => setExtraColumns(Number(e.target.value))} aria-valuetext={`${extraColumns} added row pairs in both directions, ${atomCount} atoms per layer`} aria-describedby="model-note" />
            <div className={styles.viewButtons} role="group" aria-label="Camera presets">
              <button onClick={() => setView({ name: 'top' })}>Top view</button><button onClick={() => setView({ name: 'edge' })}>Edge view</button><button onClick={reset}>Reset</button>
            </div>
            <p id="model-note" className={styles.note}>Original 3D model. Atom sizes, outer detail and layer spacing are stylised for clarity. One control extends length and width together, adding the same number of row pairs along both axes. New rows fade in smoothly; atom size and bond spacing stay fixed. Layer separation is illustrative too.</p>
          </div>
        </div>
      </section>
      <nav className={styles.contents} aria-label="In this article">
        <label htmlFor="graphene-chapter">In this story</label>
        <div className={styles.chapterSelect}><select id="graphene-chapter" value={activeChapter} onChange={jumpToChapter} aria-label="Jump to chapter">{article.sections.map(section => <option key={section.id} value={section.id}>{section.number} / {section.nav}</option>)}</select><span aria-hidden="true">⌄</span></div>
        <a href="#graphene-explorer">3D explorer <span aria-hidden="true">↗</span></a>
      </nav>
      <article>
        {article.sections.map(section => <section id={section.id} key={section.id} className={styles.chapter}>
          <ScrollFade root={pageRef} className={styles.chapterHeading}><span className={styles.chapterNumber} aria-hidden="true">{section.number}</span><span className={styles.eyebrow}>Chapter {section.number} / {section.nav}</span><h2>{section.title}</h2></ScrollFade>
          <div className={styles.prose}>{section.paragraphs.map((p, i) => <ScrollFade root={pageRef} as="p" stagger={i} key={p}>{p}{(section.paragraphSources || i === section.paragraphs.length - 1) && <> <Source index={section.paragraphSources?.[i] ?? section.source} /></>}</ScrollFade>)}</div>
          {article.diagrams.filter(item => item.chapter === section.id).map(item => <figure key={item.src} className={styles.learningDiagram}><header><span className={styles.eyebrow}>Picture the idea</span><h3>{item.title}</h3></header>{item.chapter === 'making-it-useful' && <figure className={styles.exfoliationArt}><a href="/images/graphene/exfoliation-illustration.png" target="_blank" rel="noopener noreferrer"><img src="/images/graphene/exfoliation-illustration.png" width="1536" height="1024" alt="Illustrated exfoliation sequence: a graphite stack, layers sliding and lifting apart, and separated honeycomb flakes" loading="lazy" /></a><figcaption>Exfoliation separates existing carbon layers. AI-generated teaching illustration; atom sizes and spacing are stylised. It shows the general idea, not a specific process or guaranteed monolayer output.</figcaption></figure>}{item.layout === 'production' ? <div className={styles.productionMethods}>{item.steps.map((step,index) => <ProductionMethod key={step.title} step={step} index={index} root={pageRef} />)}</div> : <div className={styles.diagramSteps} data-layout={item.layout}>{item.steps.map((step, index) => <div className={styles.diagramStep} key={step.title}><span className={styles.stepNumber}>{item.layout === 'sequence' ? `STEP ${index + 1}` : `COMPARE ${index + 1}`}</span><a href={step.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${step.title} illustration`}><img src={step.src} width={step.width || (step.stages ? 640 : 320)} height={step.height || (step.stages ? 240 : 180)} alt={step.alt || ""} loading="lazy" /></a>{step.generated && <p className={styles.illustrationNote}>AI-generated conceptual illustration · not to scale</p>}{step.stages && <ol className={styles.routeStages}>{step.stages.map(stage => <li key={stage}>{stage}</li>)}</ol>}<h4>{step.title}</h4><p>{step.text}{step.source !== undefined && <> <Source index={step.source} /></>}</p>{step.result && <p className={styles.routeResult}><strong>What you get / what to check</strong>{step.result}</p>}</div>)}</div>}<figcaption>{item.takeaway} <Source index={item.source} /></figcaption></figure>)}
          {section.id === 'graphene-applications' && <div className={styles.applicationGuide}><nav className={styles.applicationNav} aria-label="Graphene applications">{article.applications.map((item,i) => <a href={`#${item.id}`} key={item.id}><span aria-hidden="true">0{i+1}</span>{item.tag}<span aria-hidden="true">↗</span></a>)}</nav><div className={styles.applicationSections}>{article.applications.map((item,i) => <ApplicationCard key={item.id} item={item} index={i} root={pageRef} />)}</div></div>}

          {article.literatureFigures.filter(item => item.chapter === section.id).map(item => <figure key={item.src} className={styles.literatureFigure}><header><span className={styles.eyebrow}>From the literature / {item.kind}</span><h3>{item.title}</h3><p className={styles.figureTakeaway}><strong>The main idea</strong>{item.takeaway}</p><p className={styles.figureStart}>{item.startHere}</p></header><a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge published figure: ${item.title}`}><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /></a><figcaption><p>{item.caption}</p><details className={styles.figureDetails}><summary>Go deeper: read the panels and technical terms</summary><p>{item.reading}</p></details><div className={styles.figureCredit}><cite>{item.credit}</cite><div><a href={item.url}>Original paper / DOI ↗</a><a href={item.figureUrl}>Publisher’s figure ↗</a><a href={item.licenseUrl}>{item.license}</a></div><span>{item.changes}</span></div></figcaption></figure>)}

          {section.id === 'what-is-graphene' && <section className={styles.visualStory} aria-labelledby="visual-title">
        <span className={styles.eyebrow}>Material / Structure / Possibility</span><h2 id="visual-title">See the bigger picture.</h2>
        <div className={styles.gallery}>{article.gallery.map(item => <figure key={item.src}><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /><figcaption><h3>{item.title}</h3><p>{item.caption}</p></figcaption></figure>)}</div>
      </section>}
          {section.id === 'why-it-matters' && <section className={styles.measurements} aria-labelledby="numbers-title"><span className={styles.eyebrow}>Measured, with context</span><h2 id="numbers-title">What do the numbers actually mean?</h2><div className={styles.metrics}>{article.measurements.map(item => <div key={item.label}><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.detail} <Source index={item.source} /></p></div>)}</div><p className={styles.measurementNote}>These are reference measurements on specific samples, not specifications for every material sold as graphene. N/m expresses force per width for an atom-thin sheet.</p></section>}
          {section.id === 'graphene-transparency' && <section className={styles.optics} aria-labelledby="optics-title"><div><span className={styles.eyebrow}>Try another perspective</span><h2 id="optics-title">Almost invisible.<br />Still measurable.</h2><p>One suspended layer absorbs about 2.3% of white light. Add layers to explore a simple estimate of how much light passes through. <Source index={3} /></p><label htmlFor="optical-layers">Number of layers: <strong>{opticalLayers}</strong></label><input id="optical-layers" type="range" min="1" max="10" step="1" value={opticalLayers} onChange={e => setOpticalLayers(Number(e.target.value))} /></div><div className={styles.lightChart}><div className={styles.lightBars} role="img" aria-label={`Incident light 100 percent; estimated transmitted light ${transmission.toFixed(1)} percent`}><div><span>Incident light</span><i style={{width:'100%'}} /><b>100%</b></div><div><span>After {opticalLayers} {opticalLayers === 1 ? 'layer' : 'layers'}</span><i style={{width:`${transmission}%`}} /><b aria-live="polite">{transmission.toFixed(1)}%</b></div></div><p>Simplified independent-layer estimate: 100 × 0.977ⁿ. It ignores reflection, substrates and interactions between layers; it is not a device-performance prediction.</p></div></section>}

        </section>)}
      </article>
      {researchPaper && <section className={styles.researchEvidence} aria-labelledby="evidence-title"><div><span className={styles.eyebrow}>Inside the research</span><h2 id="evidence-title">Separating layers involves more than pulling upward.</h2><p>Our sheet does not have to lift straight upward to leave a stack. In this computer simulation, flowing gas makes layers slide sideways as well as move apart. Molecular dynamics means calculating how atoms move over time.</p><p><strong>Start here:</strong> compare sideways sliding with vertical movement. Read the horizontal scales before comparing the widths of the curves.</p><details className={styles.figureDetails}><summary>Go deeper: what the axes mean</summary><p>The curves show distributions: how often different distances occur. Distances are in ångströms (Å); 10 Å equals 1 nanometre. The panels use different scales. These results describe simulated conditions.</p></details><Link to={`/journal/${researchPaper.slug}/`}>Explore the study and its limitations ↗</Link></div><figure><a href="/journal-figures/graphene-sliding.jpg" target="_blank" rel="noopener noreferrer" aria-label="Open research figure at full size"><img src="/journal-figures/graphene-sliding.jpg" width="741" height="489" alt="Research figure showing sliding and vertical-distance distributions for graphene under gas flow at three velocities" loading="lazy" /></a><figcaption>Figure 6 · {researchPaper.title}. Select the figure to view it at full size. <a href={researchPaper.url}>Original paper ↗</a></figcaption></figure></section>}
      <section className={styles.quiz} aria-labelledby="quiz-title"><div><span className={styles.eyebrow}>A quick thought experiment</span><h2 id="quiz-title">You isolate one sheet<br />from graphite. What is it?</h2></div><div>
        <div className={styles.answers} role="group" aria-label="Choose your answer">{['Graphene', 'Diamond', 'A new element'].map(option => <button key={option} aria-pressed={answer === option} onClick={() => setAnswer(option)}>{option}</button>)}</div>
        <p className={styles.feedback} aria-live="polite">{answer === null ? 'Choose an answer to see the explanation.' : answer === 'Graphene' ? 'Exactly. Graphene is one carbon layer from the graphite stack. The element stays carbon; the structure makes the difference.' : 'Try again. The atoms are still carbon, and the isolated honeycomb sheet has its own name. Use the 3D explorer above for a clue.'}</p>
      </div></section>
      <section className={styles.recap} aria-labelledby="recap-title"><span className={styles.eyebrow}>What to take with you</span><h2 id="recap-title">From a carbon sheet to a useful material.</h2><ol>{article.takeaways.map(text => <li key={text}>{text}</li>)}</ol><a href="#graphene-explorer">Revisit the 3D model ↑</a></section>
      <section className={styles.faq} aria-labelledby="faq-title"><span className={styles.eyebrow}>Questions worth asking</span><h2 id="faq-title">Common questions about graphene</h2>{article.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer} <Source index={item.source} /></p></details>)}</section>
      <section className={styles.closing}><span className={styles.eyebrow}>From understanding to making</span><h2>How do we make<br />these materials useful?</h2><p>My research explores how gas-driven processes separate layered materials and how their structure affects the result.</p><div><Link to="/simulate-atoms">How do we simulate atoms on a computer? ↗</Link><Link to="/R&D-Portfolio">Explore my R&D work ↗</Link><Link to="/journal/">Read the research ↗</Link></div></section>
      <section className={styles.sources} aria-labelledby="sources-title"><h2 id="sources-title">Sources & further reading</h2><ol>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.label} ↗</a></li>)}</ol></section>
    </main>
  </div>;
}
