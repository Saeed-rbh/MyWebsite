import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import useGrapheneReveals from './useGrapheneReveals';
import GrapheneThoughtExperiment from './GrapheneThoughtExperiment';
import SEO from '../../components/SEO/SEO';
import { grapheneArticle as article } from '../../data/grapheneArticle.mjs';
import styles from './GrapheneArticle.module.css';
import GrapheneLab from './GrapheneLab';
import papers from '../../data/journalPapers.json';
import { ScrollFade } from '../Commercialization/StoryMotion';
const grapheneStudies = [
  ['free-energy-mapping-', null],
  ['interactions-of-gas-particles-', '/journal-figures/graphene-sliding.jpg'],
  ['thermo-mechanical-properties-of-nitrogenated-', '/journal-figures/c2n-thermal-conductivity.jpg'],
  ['effect-of-planar-torsional-', '/journal-figures/torsional-wrinkles.jpg'],
].flatMap(([prefix, src]) => {
  const paper = papers.find(item => item.slug.startsWith(prefix));
  return paper ? [{ paper, figure: paper.figures.find(item => item.src === src) }] : [];
});
const researchQuestions = [
  ['Which separation pathway does gas flow help most?', 'Compare peeling and sliding with molecular dynamics and free-energy calculations.', 'These modeled pathways explain mechanisms; they do not measure production yield.'],
  ['Does the gas lift a sheet, or make it slide first?', 'Track a graphene bilayer under different gas identities, speeds and pressures.', 'The result describes the modeled bilayer and flow conditions.'],
  ['Can we trust the model when a sheet contains missing atoms?', 'Compare learned and classical interaction models for heat flow and stretching in C₂N.', 'Agreement with a reference for one property is only part of validating a model.'],
  ['What happens to heat flow when a 2D sheet wrinkles?', 'Twist simulated graphene, hBN and MoS₂ sheets and follow their heat transport.', 'The finite simulated structures reveal a trend, not universal material constants.'],
];
const storyStops = article.sections.flatMap(section => [
  ...(section.id === 'graphene-family' ? [{ id: 'graphene-challenge', label: 'The challenge / From promise to practice' }] : []),
  { id: section.id, label: `${section.number} / ${section.nav}` },
  ...(section.id === 'graphene-discovery' ? [{ id: 'graphene-explorer', label: 'Try it / Separate a sheet in 3D' }, { id: 'graphene-thought-experiment', label: 'Try it / What changed?' }] : []),
  ...(section.id === 'making-it-useful' ? [{ id: 'graphene-research', label: 'Inside my research' }] : []),
]).concat([{ id: 'graphene-takeaways', label: 'The journey / What to take with you' }, { id: 'beyond-graphene', label: 'Beyond graphene / Other 2D materials' }]);
function Source({ index }) { return <a className={styles.citation} href={article.sources[index].url} aria-label={`Source: ${article.sources[index].label}`}>[{index + 1}]</a>; }

function StoryHandoff({ to, children }) {
  return <div className={styles.storyHandoff}><a href={`#${to}`}><span>{children}</span><span aria-hidden="true">↓</span></a></div>;
}

function StoryChallenge() {
  return <section id="graphene-challenge" className={styles.storyChallenge} aria-labelledby="challenge-title">
    <header data-graphene-reveal="0"><span className={styles.eyebrow}>From promise to practice</span><h2 id="challenge-title">If graphene is so promising,<br /><span className={styles.textAccent}>why isn’t it everywhere?</span></h2></header>
    <div data-graphene-reveal="1"><p>We have followed one remarkable sheet. A useful product needs the right material, in enough quantity, with properties that survive processing and use.</p><p>That changes our question. <span className={styles.textAccent}>Which form do we need, how do we make it, and how do we know it will work?</span> The rest of the story follows those decisions.</p></div>
  </section>;
}

function BeyondGraphene() {
  return <section id="beyond-graphene" className={styles.beyondGraphene} aria-labelledby="beyond-title">
    <header data-graphene-reveal="0"><span className={styles.eyebrow}>Other 2D materials</span><h2 id="beyond-title">Beyond <span className={styles.textAccent}>graphene.</span></h2><p>Different atoms. Different possibilities.</p></header>
    <div className={styles.materialStories}>{article.beyondGraphene.map(material => <section key={material.id} className={styles.materialStory} aria-labelledby={`material-${material.id}`}>
      <figure data-graphene-reveal="0"><a href={material.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${material.name} structure`}><img src={material.src} width="1200" height="800" alt={material.alt} loading="lazy" decoding="async" /></a><figcaption>{material.legend}</figcaption></figure>
      <div data-graphene-reveal="1"><h3 id={`material-${material.id}`}>{material.name}</h3><p>{material.text} <Source index={material.source} /></p></div>
    </section>)}</div>
    <div className={styles.beyondClosing}><span>Ideal lattices; colours distinguish elements.</span><Link to="/simulate-atoms">Explore atomistic simulations ↗</Link></div>
  </section>;
}

function ChapterText({ text }) {
  const parts = text.split(/(single carbon sheet|repeating honeycomb|one atom thick|two-dimensional|bend and ripple|one layer at a time|electric charge|2010 Nobel Prize in Physics|Strong bonds|bend and wrinkle|elastic stiffness|breaking strength|being thin does not mean being weak|moving charge|electrons|no conventional band gap|electronic switch|vibrations transfer energy|phonons|2\.3%|97\.7% transmitted|transparent electrodes|percentages multiply|monolayer|few-layer graphene|reduced graphene oxide|graphene oxide|oxygen-containing groups|nitrogen-doped graphene|film covering a surface|small flakes|Exfoliation|Chemical vapour deposition|compressible-flow exfoliation|transfer momentum|slide and separate|Raman spectroscopy|energy changes|strain|defects|doping|grain boundaries|Combining measurements|sensor|transparent conducting surface|composite|laser processing|holographic images|finished system|right form of carbon|free-energy comparison|gas flow|edge peeling|heat transport|2% vacancies|Atomistic trajectories|Wrinkle height)/g);
  return parts.map((part, index) => index % 2 ? <span className={styles.textAccent} key={index}>{part}</span> : part);
}

function ResearchCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  if (!grapheneStudies.length) return null;
  const { paper, figure } = grapheneStudies[active];
  const [question, approach, limitation] = researchQuestions[active];
  const move = step => {
    setDirection(step);
    setActive(index => (index + step + grapheneStudies.length) % grapheneStudies.length);
  };
  const choose = index => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };
  const onKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  };
  return <section id="graphene-research" className={styles.researchCarousel} aria-labelledby="evidence-title" aria-roledescription="carousel" tabIndex={0} onKeyDown={onKeyDown}>
    <header className={styles.researchCarouselHeader} data-graphene-reveal="0">
      <div><span className={styles.eyebrow}>Inside the research</span><h2 id="evidence-title">Graphene, through <span className={styles.textAccent}>my research.</span></h2></div>
      <div className={styles.researchControls}>
        <button type="button" aria-label="Previous graphene study" onClick={() => move(-1)}>←</button>
        <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(grapheneStudies.length).padStart(2, '0')}</span>
        <button type="button" aria-label="Next graphene study" onClick={() => move(1)}>→</button>
      </div>
    </header>
    <p className={styles.researchStoryIntro}>The nozzle leaves us with a question: what makes one layer move against another? I use atomistic simulations to investigate the motion, then connect it to energy, structure and material behaviour.</p>
    <AnimatePresence initial={false} mode="wait" custom={direction}>
    <motion.div key={paper.slug} className={styles.researchSlide}
      custom={direction}
      variants={{ enter: step => ({ opacity: 0, x: reduceMotion ? 0 : step * 24 }), visible: { opacity: 1, x: 0 }, leave: step => ({ opacity: 0, x: reduceMotion ? 0 : step * -12, transition: { duration: reduceMotion ? 0 : 0.14 } }) }}
      initial="enter" animate="visible" exit="leave" transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }} role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${grapheneStudies.length}: ${paper.title}`}>
      <div className={styles.researchSlideCopy}>
        <p className={styles.researchMeta}>{paper.year} · {paper.journal}</p>
        <h3><span className={styles.textAccent}>{paper.editorial.headline}</span></h3>
        <dl className={styles.researchStorySteps}><div><dt>The question</dt><dd>{question}</dd></div><div><dt>The investigation</dt><dd>{approach}</dd></div><div><dt>The finding</dt><dd><ChapterText text={paper.summary} /></dd></div></dl>
        <p className={styles.researchLimit}>{limitation}</p>
        {figure && <p className={styles.researchReading}><strong>Start here</strong>{figure.reading}</p>}
        <p className={styles.researchPaperTitle}>{paper.title}</p>
        <div className={styles.researchLinks}><Link to={`/journal/${paper.slug}/`}>Explore the study and its limitations ↗</Link><a href={paper.url} target="_blank" rel="noopener noreferrer">Original paper ↗</a></div>
      </div>
      {figure ? <figure className={styles.researchSlideFigure}><a href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Open research figure: ${paper.editorial.headline}`}><img src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} loading="lazy" /></a><figcaption>{figure.source} · {figure.caption}</figcaption></figure> : <aside className={styles.researchFinding}><span className={styles.eyebrow}>The key idea</span><p className={styles.textAccent}>{paper.editorial.highlight.value}</p><span>{paper.editorial.highlight.label}</span><Link to={`/journal/${paper.slug}/`}>Explore the free-energy comparison ↗</Link></aside>}
    </motion.div>
    </AnimatePresence>
    <div className={styles.researchPagination} role="group" aria-label="Choose a graphene study">{grapheneStudies.map(({ paper: study }, index) => <button key={study.slug} type="button" aria-label={`Show study ${index + 1}: ${study.title}`} aria-pressed={index === active} onClick={() => choose(index)}><span /></button>)}</div>
  </section>;
}

function ApplicationCard({ item, index, root }) {
  const compositions = ['lead', 'inset', 'note', 'wide', 'portrait', 'closing'];
  return <section id={item.id} className={styles.applicationSection} data-composition={compositions[index % compositions.length]}>
    <ScrollFade root={root} as="header" className={styles.applicationHeader}>
      <span className={styles.applicationIndex} aria-hidden="true">0{index + 1}</span>
      <div><span className={styles.eyebrow}>{item.tag} / In practice</span><h3>{item.title}</h3></div>
    </ScrollFade>
    <div className={styles.applicationBody}>
      <figure className={styles.applicationFigure} data-graphene-reveal="1">
        <a className={styles.imageLink} href={item.figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge application illustration for ${item.title}`}>
          <img src={item.figure.src} width={item.figure.width} height={item.figure.height} alt={item.figure.alt} loading="lazy" decoding="async" />
          <span className={styles.imageHint} aria-hidden="true">View image ↗</span>
        </a>
        <figcaption>{item.figure.caption}</figcaption>
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
  return <section id={`graphene-production-route-${index + 1}`} className={styles.productionMethod}>
    <div className={styles.productionVisual}>
      <ScrollFade root={root} as="header"><span className={styles.eyebrow}>Route 0{index + 1}</span><h4>{step.title}</h4></ScrollFade>
      <figure data-graphene-reveal="0">
        <a className={styles.imageLink} href={step.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${step.title} illustration`}><img src={step.src} width={step.width || 640} height={step.height || 240} alt={step.alt || step.title} loading="lazy" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a>
      </figure>
    </div>
    <div className={styles.productionBody}>
      <div><ScrollFade root={root} as="p">{step.text} <Source index={step.source} /></ScrollFade><ScrollFade root={root} as="p" stagger={1} className={styles.routeResult}><strong>What you get / what to check</strong>{step.result}</ScrollFade></div>
    </div>
    <ol className={styles.routeStages}>{step.stages.map((stage,i) => <li key={stage} data-graphene-reveal={i}><span aria-hidden="true">0{i+1}</span>{stage}</li>)}</ol>
  </section>;
}

function LearningIllustration({ item }) {
  if (item.chapter === 'graphene-family') return <ol className={styles.familySteps} aria-label="Compare three forms of graphene">
    {item.steps.map((step, index) => <li key={step.title} data-graphene-reveal={index}>
      <a className={styles.familyPanel} href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${step.title} illustration`}>
        <svg viewBox={`${index * 514 + 4} 140 502 670`} role="img" aria-label={step.title + ': ' + step.text}>
          <image href={item.src} width={item.width} height={item.height} />
        </svg>
      </a>
      <div className={styles.familyDescription}><span className={styles.eyebrow}>Compare 0{index + 1}</span><h4><span className={styles.textAccent}>{step.title}</span></h4><p>{step.text}</p></div>
    </li>)}
  </ol>;
  return <div className={styles.learningIllustration} data-step-count={item.steps.length}>
    <div className={styles.learningVisual} data-graphene-reveal="0">
      <a className={styles.imageLink} href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge illustration: ${item.title}`}><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a>
    </div>
    {item.chapter === 'why-it-matters' && <p className={styles.learningCaption}>{item.takeaway} <Source index={item.source} /></p>}
    <ol className={styles.imageExplanations}>{item.steps.map((step,index) => <li key={step.title} data-graphene-reveal={index}><span className={styles.eyebrow}>{item.layout === 'sequence' ? 'Step' : 'Compare'} 0{index+1}</span><h4>{step.title}</h4><p>{step.text}</p></li>)}</ol>
  </div>;
}

export default function Graphene() {
  const [opticalLayers, setOpticalLayers] = useState(1);
  const pageRef = useRef(null);
  useGrapheneReveals(pageRef);
  const [activeChapter, setActiveChapter] = useState(storyStops[0].id);
  useEffect(() => {
    // The article mounts after the route module, so native initial hash scrolling can miss it.
    const alignHash = () => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target && pageRef.current?.contains(target)) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    const frame = requestAnimationFrame(alignHash);
    window.addEventListener('hashchange', alignHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', alignHash); };
  }, []);
  useEffect(() => {
    const page = pageRef.current;
    let frame;
    const update = () => {
      frame = null;
      const top = page.getBoundingClientRect().top + 170;
      const current = [...storyStops].reverse().find(section => document.getElementById(section.id)?.getBoundingClientRect().top <= top);
      setActiveChapter(current?.id || storyStops[0].id);
      const distance = page.scrollHeight - page.clientHeight;
      page.style.setProperty('--reading-progress', String(distance > 0 ? Math.min(1, page.scrollTop / distance) : 0));
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
  return <div ref={pageRef} className={styles.page} data-site-motion-ignore="true">
    <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroIdentity}><span className={styles.ghostWord} data-graphene-entrance="atmosphere" aria-hidden="true">Carbon.</span><span className={styles.eyebrow} data-graphene-entrance="eyebrow">A closer look at materials</span><h1><span className={styles.heroPrefix} data-graphene-entrance="prefix">Meet</span> <em data-graphene-entrance="title">Graphene.</em></h1><p className={styles.heroKicker} data-graphene-entrance="kicker">An extraordinary sheet inside an ordinary pencil.</p></div>
        <ol className={styles.heroJourney} aria-label="The learning journey"><li data-graphene-entrance="journey" data-entrance-order="0"><span aria-hidden="true">• · ·</span> start with graphite</li><li data-graphene-entrance="journey" data-entrance-order="1"><span aria-hidden="true">• • ·</span> follow one sheet</li><li data-graphene-entrance="journey" data-entrance-order="2"><span aria-hidden="true">• • •</span> make it useful</li></ol>
        <div className={styles.heroIntro}><h2 data-graphene-entrance="intro"><span aria-hidden="true">◆</span> What is hiding inside a pencil?</h2><p data-graphene-entrance="intro" data-entrance-order="1">Inside <a href="#what-is-graphene">graphite</a> are stacks of carbon sheets. Follow one through its <a href="#graphene-discovery">first separation</a>, surprising <a href="#why-it-matters">properties</a>, and the <a href="#graphene-research">research</a> that asks how to turn it into a <a href="#graphene-applications">useful material</a>.</p><div className={styles.heroActions} data-graphene-entrance="actions"><a href="#graphene-explorer">Explore the sheet in 3D <span aria-hidden="true">↗</span></a><a href="#what-is-graphene">Read the story <span aria-hidden="true">↓</span></a></div><p className={styles.readingGuide} data-graphene-entrance="guide">One sheet · A scientific journey · A wider 2D world</p></div>
      </header>
      <nav className={styles.contents} aria-label="In this article">
        <label htmlFor="graphene-chapter">In this story</label>
        <div className={styles.chapterSelect}><select id="graphene-chapter" value={activeChapter} onChange={jumpToChapter} aria-label="Jump to chapter">{storyStops.map(stop => <option key={stop.id} value={stop.id}>{stop.label}</option>)}</select><span aria-hidden="true">⌄</span></div>
        <a href="#graphene-explorer">3D explorer <span aria-hidden="true">↗</span></a>
      </nav>
      <article>
        {article.sections.map(section => <React.Fragment key={section.id}>{section.id === 'graphene-family' && <StoryChallenge />}<section id={section.id} className={styles.chapter} data-chapter-id={section.id}>
          <ScrollFade root={pageRef} className={styles.chapterHeading}><span className={styles.chapterNumber} aria-hidden="true">{section.number}</span><span className={styles.eyebrow}>Chapter {section.number} / {section.nav}</span><h2>{section.id === 'graphene-discovery' ? <>The discovery:<br /><span className={styles.textAccent}>making the invisible measurable.</span></> : section.id === 'what-is-graphene' ? <>What is graphene?<br /><span className={styles.textAccent}>A single page from graphite.</span></> : section.id === 'why-it-matters' ? <>Why is graphene <span className={styles.textAccent}>strong</span>, yet <span className={styles.textAccent}>flexible?</span></> : section.id === 'electrical-and-thermal-properties' ? <>How does graphene carry <span className={styles.textAccent}>electricity</span> and <span className={styles.textAccent}>heat?</span></> : section.id === 'graphene-transparency' ? <>Why is graphene <span className={styles.textAccent}>almost transparent?</span></> : section.id === 'graphene-family' ? <><span className={styles.textAccent}>Graphene</span>, <span className={styles.textAccent}>graphite</span> and <span className={styles.textAccent}>graphene oxide</span> are different.</> : section.id === 'making-it-useful' ? <>How is graphene made? <span className={styles.textAccent}>Choose the route for the job.</span></> : section.id === 'measuring-graphene' ? <>How do researchers know <span className={styles.textAccent}>what they have made?</span></> : section.id === 'graphene-applications' ? <>What is graphene <span className={styles.textAccent}>used for</span>, and <span className={styles.textAccent}>what still gets in the way?</span></> : section.title}</h2></ScrollFade>
          <div className={styles.prose}>{section.paragraphs.map((p, i) => <ScrollFade root={pageRef} as="p" stagger={i} key={p}>{['what-is-graphene', 'graphene-discovery', 'why-it-matters', 'electrical-and-thermal-properties', 'graphene-transparency', 'graphene-family', 'making-it-useful', 'measuring-graphene', 'graphene-applications'].includes(section.id) ? <ChapterText text={p} /> : p}{(section.paragraphSources || i === section.paragraphs.length - 1) && <> <Source index={section.paragraphSources?.[i] ?? section.source} /></>}</ScrollFade>)}</div>
          {article.diagrams.filter(item => item.chapter === section.id).map(item => <figure id={`${item.chapter}-illustration`} key={item.src} className={styles.learningDiagram} data-diagram={item.chapter}><header data-graphene-reveal="0"><span className={styles.eyebrow}>Picture the idea</span><h3>{item.title}</h3></header>{item.chapter === 'making-it-useful' && <figure className={styles.exfoliationArt} data-graphene-reveal="0"><a href="/images/graphene/exfoliation-illustration.png" target="_blank" rel="noopener noreferrer"><img src="/images/graphene/exfoliation-illustration.png" width="1536" height="1024" alt="Illustrated exfoliation sequence: a graphite stack, layers sliding and lifting apart, and separated honeycomb flakes" loading="lazy" /></a><figcaption>Exfoliation separates existing carbon layers. It shows the general idea, not a specific process or guaranteed monolayer output.</figcaption></figure>}{item.layout === 'production' ? <div className={styles.productionMethods}>{item.steps.map((step,index) => <ProductionMethod key={step.title} step={step} index={index} root={pageRef} />)}</div> : <LearningIllustration item={item} />}{item.chapter !== 'why-it-matters' && <figcaption>{item.takeaway} <Source index={item.source} /></figcaption>}</figure>)}
          {section.id === 'graphene-applications' && <div className={styles.applicationGuide}><nav className={styles.applicationNav} aria-label="Graphene applications">{article.applications.map((item,i) => <a href={`#${item.id}`} key={item.id}><span aria-hidden="true">0{i+1}</span>{item.tag}<span aria-hidden="true">↗</span></a>)}</nav><div className={styles.applicationSections}>{article.applications.map((item,i) => <ApplicationCard key={item.id} item={item} index={i} root={pageRef} />)}</div></div>}

          {article.literatureFigures.filter(item => item.chapter === section.id).map(item => <figure key={item.src} className={styles.literatureFigure}><header><span className={styles.eyebrow}>From the literature / {item.kind}</span><h3>{item.title}</h3><p className={styles.figureTakeaway}><strong>The main idea</strong>{item.takeaway}</p><p className={styles.figureStart}>{item.startHere}</p></header><a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge published figure: ${item.title}`} data-graphene-reveal="0"><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /></a><figcaption><p>{item.caption}</p><details className={styles.figureDetails}><summary>Go deeper: read the panels and technical terms</summary><p>{item.reading}</p></details><div className={styles.figureCredit}><cite>{item.credit}</cite><div><a href={item.url}>Original paper / DOI ↗</a><a href={item.figureUrl}>Publisher’s figure ↗</a><a href={item.licenseUrl}>{item.license}</a></div><span>{item.changes}</span></div></figcaption></figure>)}

          {section.id === 'what-is-graphene' && <section className={styles.visualStory} aria-labelledby="visual-title">
        <span className={styles.eyebrow}>Material / Structure / Possibility</span><h2 id="visual-title">See the bigger picture.</h2>
        <div className={styles.gallery}>{article.gallery.map((item, index) => <figure key={item.src} data-graphene-reveal={index}><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /><figcaption><h3>{item.title}</h3><p>{item.caption}</p></figcaption></figure>)}</div>
      </section>}
          {section.id === 'graphene-transparency' && <section className={styles.optics} aria-labelledby="optics-title"><div><span className={styles.eyebrow}>Try another perspective</span><h2 id="optics-title">Almost invisible.<br />Still measurable.</h2><p>One suspended layer absorbs about 2.3% of white light. Add layers to explore a simple estimate of how much light passes through. <Source index={3} /></p><label htmlFor="optical-layers">Number of layers: <strong>{opticalLayers}</strong></label><input id="optical-layers" type="range" min="1" max="10" step="1" value={opticalLayers} onChange={e => setOpticalLayers(Number(e.target.value))} /></div><div className={styles.lightChart} data-graphene-reveal="1"><div className={styles.lightBars} role="img" aria-label={`Incident light 100 percent; estimated transmitted light ${transmission.toFixed(1)} percent`}><div><span>Incident light</span><i style={{width:'100%'}} /><b>100%</b></div><div><span>After {opticalLayers} {opticalLayers === 1 ? 'layer' : 'layers'}</span><i style={{width:`${transmission}%`}} /><b aria-live="polite">{transmission.toFixed(1)}%</b></div></div><p>Simplified independent-layer estimate: 100 × 0.977ⁿ. It ignores reflection, substrates and interactions between layers; it is not a device-performance prediction.</p></div></section>}
          {section.id === 'graphene-transparency' && <section className={styles.measurements} aria-labelledby="numbers-title"><span className={styles.eyebrow}>Measured, with context</span><h2 id="numbers-title">What do the numbers actually mean?</h2><div className={styles.metrics}>{article.measurements.map((item, index) => <div key={item.label} data-graphene-reveal={index}><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.detail} <Source index={item.source} /></p></div>)}</div><p className={styles.measurementNote}>These are reference measurements on specific samples, not specifications for every material sold as graphene. N/m expresses force per width for an atom-thin sheet.</p></section>}

          <StoryHandoff to={section.handoff.to}>{section.handoff.text}</StoryHandoff>
        </section>
        {section.id === 'graphene-discovery' && <><GrapheneLab /><GrapheneThoughtExperiment /><StoryHandoff to="why-it-matters">We have one sheet. Would something so thin tear easily?</StoryHandoff></>}
        {section.id === 'making-it-useful' && <><ResearchCarousel /><StoryHandoff to="measuring-graphene">A model suggests how it happens. How do we check the material?</StoryHandoff></>}
        </React.Fragment>)}
      </article>
      <section id="graphene-takeaways" className={styles.recap} aria-labelledby="recap-title"><span className={styles.eyebrow}>What to take with you</span><h2 id="recap-title">Back to the pencil.<br /><span className={styles.textAccent}>Now we see it differently.</span></h2><p>What looked like an ordinary solid held a structure worth following. The journey from graphite to a useful material connects three decisions.</p><ol>{article.takeaways.map((text, index) => <li key={text} data-graphene-reveal={index}>{text}</li>)}</ol><a href="#graphene-explorer">Revisit the 3D model ↑</a></section>
      <section className={styles.faq} aria-labelledby="faq-title"><span className={styles.eyebrow}>Questions worth asking</span><h2 id="faq-title">Common questions about graphene</h2>{article.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer} <Source index={item.source} /></p></details>)}</section>
      <BeyondGraphene />
      <section className={styles.sources} aria-labelledby="sources-title"><h2 id="sources-title">Sources & further reading</h2><ol>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.label} ↗</a></li>)}</ol></section>
    </main>
  </div>;
}
