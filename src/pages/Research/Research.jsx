import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import useGrapheneReveals from './useGrapheneReveals';
import useSoftScroll from './useSoftScroll';
import SEO from '../../components/SEO/SEO';
import { grapheneArticle as article } from '../../data/grapheneArticle.mjs';
import styles from './GrapheneArticle.module.css';
import GrapheneLab from './GrapheneLab';
import papers from '../../data/journalPapers.json';
import { ScrollFade as VentureScrollFade } from '../Commercialization/StoryMotion';

const ScrollRoot = createContext(null);
// Exclude scroll-driven content from the opening animation to avoid double movement.
const grapheneMotion = {};
function ScrollFade({ root, ...props }) {
  const pageRoot = useContext(ScrollRoot);
  return <VentureScrollFade root={root || pageRoot} {...props} />;
}
const grapheneStudies = [
  ['free-energy-mapping-', null],
  ['interactions-of-gas-particles-', '/journal-figures/graphene-sliding.jpg'],
  ['thermo-mechanical-properties-of-nitrogenated-', '/journal-figures/c2n-thermal-conductivity.jpg'],
  ['effect-of-planar-torsional-', '/journal-figures/torsion-morphology.jpg'],
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
  ...(section.id === 'graphene-discovery' ? [{ id: 'graphene-explorer', label: 'Try it / Separate a sheet in 3D' }] : []),
  ...(section.id === 'making-it-useful' ? [{ id: 'graphene-research', label: 'Inside my research' }] : []),
]).concat([{ id: 'beyond-graphene', label: 'Beyond graphene / Other 2D materials' }, { id: 'graphene-takeaways', label: 'The journey / What to take with you' }]);
const chapterTitles = {
  'what-is-graphene': 'What is graphene?',
  'graphene-discovery': 'Discovery',
  'graphene-explorer': 'Separate a sheet in 3D',
  'why-it-matters': 'Strength & flexibility',
  'electrical-and-thermal-properties': 'Electricity & heat',
  'graphene-transparency': 'Light & layers',
  'graphene-challenge': 'From promise to practice',
  'graphene-family': 'The graphene family',
  'making-it-useful': 'Making graphene',
  'graphene-research': 'My research',
  'measuring-graphene': 'Measuring graphene',
  'graphene-applications': 'Uses & limitations',
  'graphene-takeaways': 'What to take with you',
  'beyond-graphene': 'Beyond graphene',
};
const storyGroups = [
  { title: 'Discover', ids: ['what-is-graphene', 'graphene-discovery', 'graphene-explorer'] },
  { title: 'Understand', ids: ['why-it-matters', 'electrical-and-thermal-properties', 'graphene-transparency'] },
  { title: 'Apply', ids: ['graphene-challenge', 'graphene-family', 'making-it-useful', 'graphene-research', 'measuring-graphene', 'graphene-applications', 'beyond-graphene', 'graphene-takeaways'] },
];

function StoryNavigation({ activeChapter, onNavigate }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const triggerRef = useRef(null);
  const activeIndex = storyStops.findIndex(stop => stop.id === activeChapter);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = event => {
      if (!navRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
  return <nav ref={navRef} className={`${styles.contents} ${styles.storyNavigation}`} aria-label="In this story" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <div className={styles.storyRail}>
      <div className={styles.railWindow} style={{ height: (activeIndex === 0 || activeIndex === storyStops.length - 1 ? 2 : 3) * 72 }}>
        <motion.ol className={styles.railChapters} initial={false}
          animate={{ y: -Math.max(0, Math.min(storyStops.length - 2, activeIndex - 1)) * 72 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
          {storyStops.map((stop, index) => <li key={stop.id} aria-hidden={Math.abs(index - activeIndex) > 1 || undefined} data-visited={index < activeIndex || undefined}>
            <a href={`#${stop.id}`} tabIndex={Math.abs(index - activeIndex) > 1 ? -1 : 0} aria-current={stop.id === activeChapter ? 'location' : undefined} onClick={event => {
              event.preventDefault();
              onNavigate(stop.id);
            }}><span className={styles.railMarker} aria-hidden="true" /><span className={styles.railNumber} aria-hidden="true">{article.sections.find(section => section.id === stop.id)?.number}</span><span className={styles.railLinkText}>{chapterTitles[stop.id]}</span></a>
          </li>)}
        </motion.ol>
      </div>
    </div>
    <button ref={triggerRef} type="button" className={styles.storyTrigger} aria-expanded={open} aria-controls="graphene-story-chapters" onClick={() => setOpen(value => !value)}>
      <span className={styles.storyTriggerCopy}><span className={styles.storyCurrent}>{chapterTitles[activeChapter]}</span></span>
      <span className={styles.storyPosition}>{String(activeIndex + 1).padStart(2, '0')} / {storyStops.length}</span>
      <svg className={styles.storyChevron} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>
    <a className={styles.storyExplorer} href="#graphene-explorer">3D explorer <span aria-hidden="true">↗</span></a>
    <div id="graphene-story-chapters" className={styles.storyPanel} hidden={!open}>
      <div className={styles.storyGroups}>{storyGroups.map(group => <section key={group.title} aria-label={group.title}>
        <h2>{group.title}</h2>
        <ol>{group.ids.map(id => {
          const stop = storyStops.find(item => item.id === id);
          const interactive = id === 'graphene-explorer';
          return <li key={id}><a href={`#${id}`} aria-current={id === activeChapter ? 'location' : undefined} onClick={event => {
            event.preventDefault();
            onNavigate(id);
            setOpen(false);
            triggerRef.current?.focus();
          }}><span className={styles.storyItemMarker} aria-hidden="true">{interactive ? '↗' : stop.label.match(/^\d+/)?.[0] || '—'}</span><span>{chapterTitles[id]}{interactive && <small>Interactive</small>}</span>{id === activeChapter && <span className={styles.storyActiveDot} aria-hidden="true" />}</a></li>;
        })}</ol>
      </section>)}</div>
    </div>
  </nav>;
}

function Source({ index, url }) {
  const sourceIndex = index ?? article.sources.findIndex(source => source.url === url);
  const source = article.sources[sourceIndex];
  if (!source) return null;
  return <a className={styles.citation} href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`Reference ${sourceIndex + 1}: ${source.label}`} title={source.label}>[{sourceIndex + 1}]</a>;
}

function StoryHandoff({ to, children }) {
  return <ScrollFade as="div" className={styles.storyHandoff}>
    <a href={`#${to}`}>
      <span className={styles.handoffLabel}>Next · {chapterTitles[to]}</span>
      <span className={styles.handoffPrompt}><span>{children}</span><svg className={styles.handoffArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    </a>
  </ScrollFade>;
}

function StoryChallenge() {
  return <section id="graphene-challenge" className={styles.storyChallenge} aria-labelledby="challenge-title">
    <ScrollFade as="header" stagger="0"><span className={styles.eyebrow}>From promise to practice</span><h2 id="challenge-title">If graphene is so promising,<br /><span className={styles.headingAccent}>why isn’t it everywhere?</span></h2></ScrollFade>
    <ScrollFade as="div" stagger="1"><p>We have followed one remarkable sheet. A useful product needs the right material, in enough quantity, with properties that survive processing and use.</p><p>That changes our question. <span className={styles.textAccent}>Which form do we need, how do we make it, and how do we know it will work?</span> The rest of the story follows those decisions.</p></ScrollFade>
  </section>;
}

function BeyondGraphene() {
  return <section id="beyond-graphene" className={styles.beyondGraphene} aria-labelledby="beyond-title">
    <ScrollFade as="header" stagger="0"><span className={styles.eyebrow}>Other 2D materials</span><h2 id="beyond-title">Beyond <span className={styles.headingAccent}>graphene.</span></h2><p>Graphene cannot do every job. Changing the atoms gives us other sheets with different properties. The same question remains: which material fits the task?</p></ScrollFade>
    <div className={styles.materialStories}>{article.beyondGraphene.map(material => <section key={material.id} className={styles.materialStory} aria-labelledby={`material-${material.id}`}>
      <ScrollFade as="header" className={styles.materialHeading} stagger="0"><span className={styles.materialFormula}>{material.formula}</span><h3 id={`material-${material.id}`}>{material.name}</h3></ScrollFade>
      <ScrollFade as="figure" stagger="1"><a href={material.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${material.name} structure`}><img src={material.src} width="1200" height="1000" alt={material.alt} loading="lazy" decoding="async" /></a><figcaption>{material.legend}</figcaption></ScrollFade>
      <ScrollFade as="div" className={styles.materialDescription} stagger="2"><ul className={styles.materialKey} aria-label={`${material.name} atom colors`}>{material.elements.map(element => <li key={element.symbol}><span className={styles.atomSwatch} style={{ backgroundColor:element.color }} aria-hidden="true" /><span>{element.colorName} · {element.name} <strong>({element.symbol})</strong></span></li>)}</ul><p>{material.text} <Source index={material.source} /></p></ScrollFade>
    </section>)}</div>
    <div className={styles.beyondClosing}><span>Ideal lattices; colours distinguish elements.</span><Link to="/simulate-atoms">Explore atomistic simulations ↗</Link></div>
    <StoryHandoff to="graphene-takeaways">What stays with us from this journey?</StoryHandoff>
  </section>;
}

function ChapterText({ text }) {
  const parts = text.split(/(single carbon sheet|repeating honeycomb|one atom thick|two-dimensional|bend and ripple|one layer at a time|electric charge|2010 Nobel Prize in Physics|Strong bonds|bend and wrinkle|elastic stiffness|breaking strength|being thin does not mean being weak|moving charge|electrons|no conventional band gap|electronic switch|vibrations transfer energy|phonons|2\.3%|97\.7% transmitted|transparent electrodes|percentages multiply|monolayer|few-layer graphene|reduced graphene oxide|graphene oxide|oxygen-containing groups|nitrogen-doped graphene|film covering a surface|small flakes|Exfoliation|Chemical vapour deposition|compressible-flow exfoliation|transfer momentum|slide and separate|Raman spectroscopy|energy changes|strain|defects|doping|grain boundaries|Combining measurements|sensor|transparent conducting surface|composite|laser processing|holographic images|finished system|right form of carbon|free-energy comparison|gas flow|edge peeling|heat transport|2% vacancies|Atomistic trajectories|Wrinkle height)/g);
  return parts.map((part, index) => index % 2 ? <span className={styles.textAccent} key={index}>{part}</span> : part);
}

// Keep the outgoing study out of keyboard navigation during the crossfade.
function StudyTransition({ children, direction, reduceMotion, label }) {
  const isPresent = useIsPresent();
  return <motion.div className={styles.researchSlide} custom={direction}
    inert={!isPresent ? true : undefined} aria-hidden={!isPresent || undefined}
    variants={{
      enter: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : .52, delay: reduceMotion ? 0 : .08, ease: [.22, 1, .36, 1] } },
      leave: { opacity: 0, transition: { duration: reduceMotion ? 0 : .2, ease: [.4, 0, 1, 1] } },
    }} initial="enter" animate="visible" exit="leave"
    role="group" aria-roledescription="slide" aria-label={label}>
    {children}
  </motion.div>;
}

function ResearchCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  if (!grapheneStudies.length) return null;
  const { paper, figure } = grapheneStudies[active];
  const [question, approach, limitation] = researchQuestions[active];
  const supportingFigure = figure || {
    src:'/images/graphene/exfoliation-cfe-open-outlet.png', width:1536, height:1024,
    alt:'Concept illustration of gas carrying layered particles through an open nozzle.',
    caption:'The process behind the question: gas interacts with layered particles. Concept illustration, not a simulation result.',
    reading:'Compare separation pathways in the linked study; this image only introduces the process.'
  };
  const move = step => {
    setDirection(step);
    setActive(index => (index + step + grapheneStudies.length) % grapheneStudies.length);
  };
  const choose = index => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };
  const onKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  };
  return <section id="graphene-research" className={styles.researchCarousel} aria-labelledby="evidence-title" aria-roledescription="carousel" tabIndex={0} onKeyDown={onKeyDown}>
    <ScrollFade as="header" className={styles.researchCarouselHeader} stagger="0">
      <div><span className={styles.eyebrow}>Inside the research</span><h2 id="evidence-title">Graphene, through <span className={styles.headingAccent}>my research.</span></h2></div>

    </ScrollFade>
    <ScrollFade as="p" className={styles.researchStoryIntro}>The nozzle leaves us with a question: what makes one layer move against another? My research follows that question into a wider one: how do atomic structure and processing change the way 2D materials separate, deform and carry heat? These studies use atomistic simulations to investigate those connections.</ScrollFade>
    <div className={styles.researchStage}>
      <div className={styles.researchNavigation}><div className={styles.researchControls}>
        <button type="button" aria-label="Previous graphene study" onClick={() => move(-1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(grapheneStudies.length).padStart(2, '0')}</span>
        <button type="button" aria-label="Next graphene study" onClick={() => move(1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div><div className={styles.researchPagination} role="group" aria-label="Choose a graphene study">{grapheneStudies.map(({ paper: study }, index) => <button key={study.slug} type="button" aria-label={`Show study ${index + 1}: ${study.title}`} aria-pressed={index === active} onClick={() => choose(index)}><span /></button>)}</div></div>
    <AnimatePresence initial={false} mode="sync" custom={direction}>
    <StudyTransition key={paper.slug} direction={direction} reduceMotion={reduceMotion}
      label={`${active + 1} of ${grapheneStudies.length}: ${paper.title}`}>
      <ScrollFade as="div" className={styles.researchSlideCopy}>
        <p className={styles.researchMeta}>{paper.year} · {paper.journal}</p>
        <h3><span className={styles.textAccent}>{paper.editorial.headline}</span></h3>
        <dl className={styles.researchStorySteps}><div><dt>The question</dt><dd>{question}</dd></div><div><dt>The investigation</dt><dd>{approach}</dd></div><div><dt>The finding</dt><dd><ChapterText text={paper.summary} /></dd></div></dl>
        <p className={styles.researchLimit}>{limitation}</p>
      </ScrollFade>
      <ScrollFade as="aside" className={styles.researchFinding}>
        <figure className={styles.researchSupportingFigure} data-kind={figure ? 'published' : 'concept'}>
          <a href={supportingFigure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge supporting image: ${paper.editorial.headline}`}><img src={supportingFigure.src} width={supportingFigure.width} height={supportingFigure.height} alt={supportingFigure.alt} loading="lazy" decoding="async" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a>
          <figcaption><span className={styles.researchVisualLabel}>{figure ? `From the study · ${figure.source}` : 'Process illustration'}</span>{supportingFigure.caption} <Source url={paper.url} /></figcaption>
        </figure>
        <span className={styles.eyebrow}>The key idea</span>
        <p className={styles.textAccent}>{paper.editorial.highlight.value}</p>
        <span>{paper.editorial.highlight.label}</span>
        <details className={styles.researchStudyDetails}>
          <summary>Study details</summary>
          <p className={styles.researchPaperTitle}>{paper.title} <Source url={paper.url} /></p>
          <div className={styles.researchLinks}><Link to={`/journal/${paper.slug}/`}>Explore the study and its limitations ↗</Link></div>
          <p className={styles.researchReading}><strong>Read the image</strong>{supportingFigure.reading}</p>
        </details>
      </ScrollFade>
    </StudyTransition>
    </AnimatePresence>
    </div>
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
      <ScrollFade as="figure" className={styles.applicationFigure} stagger="1">
        <a className={styles.imageLink} href={item.figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge application illustration for ${item.title}`}>
          <img src={item.figure.src} width={item.figure.width} height={item.figure.height} alt={item.figure.alt} loading="lazy" decoding="async" />
          <span className={styles.imageHint} aria-hidden="true">View image ↗</span>
        </a>
        <figcaption>{item.form} <Source url={item.figure.url} />{item.id === 'graphene-thermal-management' && <> Layers are separated for clarity; a working device needs thermal contact.</>}</figcaption>
      </ScrollFade>
      <div className={styles.applicationCopy}>
        <ScrollFade root={root} as="p">{item.text} <Source index={item.source} /></ScrollFade>
        <ScrollFade root={root} as="dl" stagger={1}><div><dt>The benefit</dt><dd>{item.contribution}</dd></div><div><dt>The practical hurdle</dt><dd>{item.challenge}</dd></div></ScrollFade>
      </div>
    </div>
  </section>;
}
function ProductionMethod({ step, index, root }) {
  return <section id={`graphene-production-route-${index + 1}`} className={styles.productionMethod}>
    <div className={styles.productionVisual}>
      <ScrollFade root={root} as="header"><span className={styles.eyebrow}>Route 0{index + 1}</span><h4>{step.title}</h4></ScrollFade>
      <ScrollFade as="figure" stagger="0">
        <a className={styles.imageLink} href={step.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${step.title} illustration`}><img src={step.src} width={step.width || 640} height={step.height || 240} alt={step.alt || step.title} loading="lazy" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a>
      </ScrollFade>
    </div>
    <div className={styles.productionBody}>
      <div><ScrollFade root={root} as="p">{step.text} <Source index={step.source} /></ScrollFade><ScrollFade root={root} as="p" stagger={1} className={styles.routeResult}><strong>What you get / what to check</strong>{step.result}</ScrollFade></div>
    </div>
    <ol className={styles.routeStages}>{step.stages.map((stage,i) => <ScrollFade as="li" key={stage} stagger={i}><span aria-hidden="true">0{i+1}</span>{stage}</ScrollFade>)}</ol>
  </section>;
}

function LearningIllustration({ item }) {
  if (item.chapter === 'graphene-family') return <ol className={styles.familySteps} aria-label="Compare three forms of graphene">
    {item.steps.map((step, index) => <ScrollFade as="li" key={step.title} stagger={index}>
      <a className={styles.familyPanel} href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${step.title} illustration`}>
        <svg viewBox={`${index * 514 + 4} 140 502 670`} role="img" aria-label={step.title + ': ' + step.text}>
          <image href={item.src} width={item.width} height={item.height} />
        </svg>
      </a>
      <div className={styles.familyDescription}><span className={styles.eyebrow}>Compare 0{index + 1}</span><h4><span className={styles.textAccent}>{step.title}</span></h4><p>{step.text}</p></div>
    </ScrollFade>)}
  </ol>;
  return <div className={styles.learningIllustration} data-step-count={item.steps.length}>
    <ScrollFade as="div" className={styles.learningVisual} stagger="0">
      <a className={styles.imageLink} href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge illustration: ${item.title}`}><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a>
    </ScrollFade>
    {item.chapter === 'why-it-matters' && <p className={styles.learningCaption}>{item.takeaway} <Source index={item.source} /></p>}
    <ol className={styles.imageExplanations}>{item.steps.map((step,index) => <ScrollFade as="li" key={step.title} stagger={index}><span className={styles.eyebrow}>{item.layout === 'sequence' ? 'Step' : 'Compare'} 0{index+1}</span><h4>{step.title}</h4><p>{step.text}</p></ScrollFade>)}</ol>
  </div>;
}

export default function Graphene() {
  const [opticalLayers, setOpticalLayers] = useState(1);
  const pageRef = useRef(null);
  useGrapheneReveals(pageRef, true, grapheneMotion);
  useSoftScroll(pageRef);
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
      const chapterIndex = Math.max(0, storyStops.findIndex(stop => stop.id === current?.id));
      page.style.setProperty('--rail-progress', String(chapterIndex === 0 ? 0 : chapterIndex === storyStops.length - 1 ? 1 : 0.5));
      const distance = page.scrollHeight - page.clientHeight;
      page.style.setProperty('--reading-progress', String(distance > 0 ? Math.min(1, page.scrollTop / distance) : 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    page.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { page.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);
  const jumpToChapter = id => {
    const page = pageRef.current;
    const target = document.getElementById(id);
    if (target) page.scrollTo({ top: page.scrollTop + target.getBoundingClientRect().top - page.getBoundingClientRect().top - 150, behavior: 'instant' });
    window.history.replaceState(null, '', `#${id}`);
    setActiveChapter(id);
  };
  const transmission = 100 * Math.pow(0.977, opticalLayers);
  const stackRight = 300 + (opticalLayers - 1) * 2.5;
  const outgoingStart = stackRight - 20;
  const transmittedBeamHeight = 64 * transmission / 100;
  return <ScrollRoot.Provider value={pageRef}><div ref={pageRef} className={styles.page} data-site-motion-ignore="true">
    <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroIdentity}><span className={styles.ghostWord} data-graphene-entrance="atmosphere" aria-hidden="true">Carbon.</span><span className={styles.eyebrow} data-graphene-entrance="eyebrow">A closer look at materials</span><h1><span className={styles.heroPrefix} data-graphene-entrance="prefix">Meet</span> <em data-graphene-entrance="title">Graphene.</em></h1><p className={styles.heroKicker} data-graphene-entrance="kicker">An extraordinary sheet inside an ordinary pencil.</p></div>
        <ol className={styles.heroJourney} aria-label="The learning journey"><li data-graphene-entrance="journey" data-entrance-order="0"><span aria-hidden="true">• · ·</span> start with graphite</li><li data-graphene-entrance="journey" data-entrance-order="1"><span aria-hidden="true">• • ·</span> follow one sheet</li><li data-graphene-entrance="journey" data-entrance-order="2"><span aria-hidden="true">• • •</span> make it useful</li></ol>
        <div className={styles.heroIntro}><h2 data-graphene-entrance="intro"><span aria-hidden="true">◆</span> What is hiding inside a pencil?</h2><p data-graphene-entrance="intro" data-entrance-order="1">Inside <a href="#what-is-graphene">graphite</a> are stacks of carbon sheets. Follow one through its <a href="#graphene-discovery">first separation</a>, surprising <a href="#why-it-matters">properties</a>, and the <a href="#graphene-research">research</a> that asks how to turn it into a <a href="#graphene-applications">useful material</a>.</p><div className={styles.heroActions} data-graphene-entrance="actions"><a href="#graphene-explorer">Explore the sheet in 3D <span aria-hidden="true">↗</span></a><a href="#what-is-graphene">Read the story <span aria-hidden="true">↓</span></a></div><p className={styles.readingGuide} data-graphene-entrance="guide">One sheet · A scientific journey · A wider 2D world</p></div>
      </header>
      <StoryNavigation activeChapter={activeChapter} onNavigate={jumpToChapter} />
      <article>
        {article.sections.map(section => <React.Fragment key={section.id}>{section.id === 'graphene-family' && <StoryChallenge />}<section id={section.id} className={styles.chapter} data-chapter-id={section.id}>
          <ScrollFade root={pageRef} className={styles.chapterHeading}><span className={styles.chapterNumber} aria-hidden="true">{section.number}</span><span className={styles.eyebrow}>Chapter {section.number} / {section.nav}</span><h2>{section.id === 'graphene-discovery' ? <>The discovery:<br />making the invisible <span className={styles.headingAccent}>measurable.</span></> : section.id === 'what-is-graphene' ? <>What is graphene?<br />A <span className={styles.headingAccent}>single page</span> from graphite.</> : section.id === 'why-it-matters' ? <>Why is graphene <span className={styles.headingAccent}>strong</span>, yet <span className={styles.headingAccent}>flexible?</span></> : section.id === 'electrical-and-thermal-properties' ? <>How does graphene carry <span className={styles.headingAccent}>electricity</span> and <span className={styles.headingAccent}>heat?</span></> : section.id === 'graphene-transparency' ? <>Why is graphene <span className={styles.headingAccent}>almost transparent?</span></> : section.id === 'graphene-family' ? <><span className={styles.headingAccent}>Graphene</span>, <span className={styles.headingAccent}>graphite</span> and <span className={styles.headingAccent}>graphene oxide</span> are different.</> : section.id === 'making-it-useful' ? <>How is graphene made? Choose the <span className={styles.headingAccent}>route for the job.</span></> : section.id === 'measuring-graphene' ? <>How do researchers know <span className={styles.headingAccent}>what they have made?</span></> : section.id === 'graphene-applications' ? <>What is graphene <span className={styles.headingAccent}>used for</span>, and <span className={styles.headingAccent}>what still gets in the way?</span></> : section.title}</h2></ScrollFade>
          <div className={styles.prose}>{section.paragraphs.map((p, i) => <ScrollFade root={pageRef} as="p" stagger={i} key={p}>{['what-is-graphene', 'graphene-discovery', 'why-it-matters', 'electrical-and-thermal-properties', 'graphene-transparency', 'graphene-family', 'making-it-useful', 'measuring-graphene', 'graphene-applications'].includes(section.id) ? <ChapterText text={p} /> : p}{(section.paragraphSources || i === section.paragraphs.length - 1) && <> <Source index={section.paragraphSources?.[i] ?? section.source} /></>}</ScrollFade>)}</div>
          {article.diagrams.filter(item => item.chapter === section.id).map(item => <figure id={`${item.chapter}-illustration`} key={item.src} className={styles.learningDiagram} data-diagram={item.chapter}><ScrollFade as="header" stagger="0"><span className={styles.eyebrow}>Picture the idea</span><h3>{item.title}</h3></ScrollFade>{item.chapter === 'making-it-useful' && <ScrollFade as="figure" className={styles.exfoliationArt} stagger="0"><a href="/images/graphene/exfoliation-illustration.png" target="_blank" rel="noopener noreferrer"><img src="/images/graphene/exfoliation-illustration.png" width="1536" height="1024" alt="Illustrated exfoliation sequence: a graphite stack, layers sliding and lifting apart, and separated honeycomb flakes" loading="lazy" /></a><figcaption>Exfoliation separates existing carbon layers. It shows the general idea, not a specific process or guaranteed monolayer output.</figcaption></ScrollFade>}{item.layout === 'production' ? <div className={styles.productionMethods}>{item.steps.map((step,index) => <ProductionMethod key={step.title} step={step} index={index} root={pageRef} />)}</div> : <LearningIllustration item={item} />}{item.chapter !== 'why-it-matters' && <figcaption>{item.takeaway} <Source index={item.source} /></figcaption>}</figure>)}
          {section.id === 'graphene-applications' && <div className={styles.applicationGuide}><nav className={styles.applicationNav} aria-label="Graphene applications">{article.applications.map((item,i) => <a href={`#${item.id}`} key={item.id}><span aria-hidden="true">0{i+1}</span>{item.tag}<span aria-hidden="true">↗</span></a>)}</nav><div className={styles.applicationSections}>{article.applications.map((item,i) => <ApplicationCard key={item.id} item={item} index={i} root={pageRef} />)}</div></div>}

          {article.literatureFigures.filter(item => item.chapter === section.id).map(item => <figure id={`${item.chapter}-literature`} key={item.src} className={styles.literatureFigure} data-layout={item.height > item.width ? "portrait" : "landscape"}><header><span className={styles.eyebrow}>From the literature / {item.kind}</span><h3>{item.title}</h3><p className={styles.figureTakeaway}><strong>The main idea</strong>{item.takeaway}</p><p className={styles.figureStart}>{item.startHere}</p></header><ScrollFade as="a" href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge published figure: ${item.title}`} stagger="0"><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /></ScrollFade><ScrollFade as="figcaption" className={styles.compactFigureCaption}>
            <p>{item.caption} <Source index={item.source} /> · <a href={item.licenseUrl}>{item.license}</a> · <span>Unaltered.</span></p>
            <details className={styles.figureDetails}><summary>Image details</summary><p>{item.reading}</p><p><cite>{item.credit}</cite> <a href={item.figureUrl}>Publisher’s figure ↗</a></p></details>
          </ScrollFade></figure>)}

          {section.id === 'what-is-graphene' && <section className={styles.visualStory} aria-labelledby="visual-title">
        <span className={styles.eyebrow}>Material / Structure / Possibility</span><h2 id="visual-title">See the bigger picture.</h2>
        <div className={styles.gallery}>{article.gallery.map((item, index) => <ScrollFade as="figure" key={item.src} stagger={index}><img src={item.src} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" /><figcaption><h3>{item.title}</h3><p>{item.caption}</p></figcaption></ScrollFade>)}</div>
      </section>}
          {section.id === 'graphene-transparency' && <section id="graphene-light-experiment" className={`${styles.optics} ${styles.opticsExperiment}`} aria-labelledby="optics-title">
            <header className={styles.opticsIntro}><span className={styles.eyebrow}>Explore the idea</span><h2 id="optics-title">Almost transparent.<br /><span className={styles.headingAccent}>Still measurable.</span></h2><p>One suspended layer of graphene absorbs about 2.3% of visible light. Add layers to explore how much light passes through in this simplified model. <Source index={3} /></p>
            <details className={styles.opticsModel}><summary>About this estimate</summary><p>Transmission ≈ 100 × 0.977ⁿ, where n is the layer count. The irregular flake edges are illustrative; the calculation assumes complete, independently absorbing layers and ignores reflection, substrates and interactions between layers. Beam height represents the calculated light fraction; glow and lattice scale are illustrative. This shows a trend, not the performance of a finished device.</p></details></header>
            <div className={styles.opticsWorkbench}>
              <figure className={styles.lightExperiment}>
                <div className={styles.beamReadings} aria-live="polite" aria-atomic="true">
                  <div><span>Incoming</span><strong>100<small>%</small></strong></div>
                  <div className={styles.absorbedReading}><span>Absorbed</span><strong>{(100 - transmission).toFixed(1)}<small>%</small></strong></div>
                  <div className={styles.outgoingReading}><span>Transmitted</span><strong>{transmission.toFixed(1)}<small>%</small></strong></div>
                </div>
                <svg className={styles.lightBeamDiagram} viewBox="0 32 560 140" role="img" aria-label={`100 percent incident light passes through ${opticalLayers} carbon ${opticalLayers === 1 ? 'layer' : 'layers'}; ${transmission.toFixed(1)} percent is transmitted in this simplified model.`}>
                  <defs>
                    <linearGradient id="graphene-light-in" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="280" y2="0"><stop stopColor="#ffce86" stopOpacity="0"/><stop offset=".3" stopColor="#ffda94" stopOpacity=".38"/><stop offset="1" stopColor="#fff7db" stopOpacity=".9"/></linearGradient>
                    <linearGradient id="graphene-light-out" gradientUnits="userSpaceOnUse" x1={outgoingStart} y1="0" x2="536" y2="0"><stop stopColor="#fffbe9" stopOpacity=".95"/><stop offset=".55" stopColor="#ffe1a4" stopOpacity=".5"/><stop offset="1" stopColor="#efb367" stopOpacity="0"/></linearGradient>
                    <radialGradient id="graphene-light-contact"><stop stopColor="#fffbe7" stopOpacity=".8"/><stop offset=".2" stopColor="#ffe5ae" stopOpacity=".4"/><stop offset="1" stopColor="#eeb96f" stopOpacity="0"/></radialGradient>
                    <linearGradient id="graphene-sheet-surface" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#342c24"/><stop offset=".5" stopColor="#171816"/><stop offset="1" stopColor="#352b21"/></linearGradient>
                    <pattern id="graphene-honeycomb" width="18" height="10.392" patternUnits="userSpaceOnUse"><path d="M0 5.196 3 0H9L12 5.196 9 10.392H3ZM12 5.196H18" fill="none" stroke="#d1ae84" strokeWidth=".7" strokeOpacity=".6"/><circle cx="3" cy="0" r=".9" fill="#e1c198"/><circle cx="12" cy="5.196" r=".9" fill="#e1c198"/></pattern>
                    <filter id="graphene-beam-glow" x="-15%" y="-100%" width="130%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
                    <filter id="graphene-ray-glow" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="1.6"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <rect x="24" y="68" width={280 - 24} height="64" fill="url(#graphene-light-in)" opacity=".6" filter="url(#graphene-beam-glow)"/>
                  {[0,1,2,3,4,5,6].map(ray => <g key={ray}>
                    <path d={`M 24 ${76 + ray * 8} H ${280}`} stroke="url(#graphene-light-in)" strokeWidth={ray === 3 ? '1.5' : '.7'}/>
                    <path className={styles.lightPhoton} style={{ animationDelay: `${ray * -.43}s` }} d={`M 24 ${76 + ray * 8} H 280`} stroke="url(#graphene-light-in)" strokeWidth="1.3"/>
                  </g>)}
                  {Array.from({ length: opticalLayers }, (_, index) => {
                    const offset = (index - (opticalLayers - 1) / 2) * 5;
                    const edge = [[5,12],[18,6],[26,8],[33,2],[50,5],[58,1],[74,9],[72,22],[79,31],[73,46],[77,60],[70,67],[75,80],[64,93],[48,97],[40,91],[25,99],[15,90],[9,77],[12,67],[2,58],[7,43],[3,32],[10,23]];
                    const widthScale = .86 + (index % 4) * .065;
                    const heightScale = .87 + ((index * 3) % 5) * .04;
                    const outline = edge.map(([x, y], vertex) => `${40 + (x - 40) * widthScale + Math.sin(index * 2.1 + vertex * 1.7) * 2},${50 + (y - 50) * heightScale + Math.cos(index * 1.3 + vertex * 1.9) * 2}`).join(' ');
                    const clipId = `graphene-flake-${index}`;
                    return <g key={index} transform={`matrix(.5 -.25 0 1 ${260 + offset} 60)`}>
                      <defs><clipPath id={clipId}><polygon points={outline}/></clipPath></defs>
                      <polygon points={outline} fill="url(#graphene-sheet-surface)" stroke="#c0a181" strokeOpacity=".7" strokeWidth="1" strokeLinejoin="round"/>
                      <g clipPath={`url(#${clipId})`}>
                        <rect x="-6" y="-6" width="92" height="112" fill="url(#graphene-honeycomb)" opacity={.7 + (index % 3) * .1}/>
                        <path d={index % 2 ? 'M72 17 59 30 62 38 M19 94 30 78 27 70' : 'M12 11 25 26 21 36 M75 79 59 73 53 80'} fill="none" stroke="#100e0c" strokeWidth="2.2" strokeLinejoin="round"/>
                        <path d={index % 2 ? 'M71 17 58 30 61 38' : 'M13 11 26 26 22 36'} fill="none" stroke="#e0b88c" strokeOpacity=".4" strokeWidth=".65"/>
                      </g>
                    </g>;
                  })}
                  <g className={styles.transmittedRay}>
                    <rect x={outgoingStart} y={100 - transmittedBeamHeight / 2} width={536 - outgoingStart} height={transmittedBeamHeight} fill="url(#graphene-light-out)" opacity=".7" filter="url(#graphene-beam-glow)"/>
                    {[0,1,2,3,4,5,6].map(ray => <g key={ray}>
                      <path d={`M ${outgoingStart} ${100 + (ray - 3) * transmittedBeamHeight / 8} H 536`} stroke="url(#graphene-light-out)" strokeWidth={ray === 3 ? '1.5' : '.7'}/>
                      <path className={styles.lightPhoton} style={{ animationDelay: `${ray * -.43}s` }} d={`M ${outgoingStart} ${100 + (ray - 3) * transmittedBeamHeight / 8} H 536`} stroke="url(#graphene-light-out)" strokeWidth="1.3"/>
                    </g>)}
                  </g>
                  <ellipse cx={outgoingStart} cy="100" rx="20" ry="32" fill="url(#graphene-light-contact)" opacity=".7"/>
                </svg>
              </figure>
              <div className={styles.layerControl}>
                <div className={styles.layerSelection}><label htmlFor="optical-layers">Carbon layers</label><div className={styles.layerCount}><output htmlFor="optical-layers">{String(opticalLayers).padStart(2, '0')}</output></div></div>
                <div className={styles.layerSlider}><input id="optical-layers" type="range" min="1" max="10" step="1" value={opticalLayers} aria-valuetext={`${opticalLayers} carbon ${opticalLayers === 1 ? 'layer' : 'layers'}`} onChange={event => setOpticalLayers(Number(event.target.value))} /><div className={styles.layerScale} aria-hidden="true"><span>1</span><span>10</span></div></div>
              </div>
            </div>
          </section>}
          {section.id === 'graphene-transparency' && <section className={styles.measurements} aria-labelledby="numbers-title"><span className={styles.eyebrow}>Measured, with context</span><h2 id="numbers-title">What do the numbers actually mean?</h2><div className={styles.metrics}>{article.measurements.map((item, index) => <ScrollFade as="div" key={item.label} stagger={index}><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.detail} <Source index={item.source} /></p></ScrollFade>)}</div><p className={styles.measurementNote}>These are reference measurements on specific samples, not specifications for every material sold as graphene. N/m expresses force per width for an atom-thin sheet.</p></section>}

          <StoryHandoff to={section.handoff.to}>{section.handoff.text}</StoryHandoff>
        </section>
        {section.id === 'graphene-discovery' && <><GrapheneLab /><StoryHandoff to="why-it-matters">We have one sheet. Would something so thin tear easily?</StoryHandoff></>}
        {section.id === 'making-it-useful' && <><ResearchCarousel /><StoryHandoff to="measuring-graphene">A model suggests how it happens. How do we check the material?</StoryHandoff></>}
        </React.Fragment>)}
      </article>
      <BeyondGraphene />
      <section id="graphene-takeaways" className={styles.recap} aria-labelledby="recap-title"><span className={styles.eyebrow}>What to take with you</span><h2 id="recap-title">Back to the pencil.<br />Now we <span className={styles.headingAccent}>see it differently.</span></h2><p>What looked like an ordinary solid held a structure worth following. The journey from graphite to a useful material connects three decisions.</p><ol>{article.takeaways.map((text, index) => <ScrollFade as="li" key={text} stagger={index}>{text}</ScrollFade>)}</ol><a href="#graphene-explorer">Revisit the 3D model ↑</a></section>
      <section className={styles.faq} aria-labelledby="faq-title"><span className={styles.eyebrow}>Questions worth asking</span><h2 id="faq-title">Common questions about graphene</h2>{article.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer} <Source index={item.source} /></p></details>)}</section>
      <section className={styles.sources} aria-labelledby="sources-title"><h2 id="sources-title">Sources & further reading</h2><ol>{article.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ol></section>
    </main>
  </div></ScrollRoot.Provider>;
}
