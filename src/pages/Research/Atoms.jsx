import ReferenceLink, { BackToText } from './ReferenceLink';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import useGrapheneReveals from './useGrapheneReveals';
import AtomisticThoughtExperiment from './AtomisticThoughtExperiment';
import SEO from '../../components/SEO/SEO';
import { atomsArticle as article } from '../../data/atomsArticle.mjs';
import { ScrollFade } from '../Commercialization/StoryMotion';
import AtomisticExplorer from './AtomisticExplorer';
import AtomicForceExplorer from './AtomicForceExplorer';
import AtomsStoryNavigation from './AtomsStoryNavigation';
import useSoftScroll from './useSoftScroll';
import { AtomisticIllustration, SimulationWorkflow } from './AtomisticFigures';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const chapters = [
  ...article.sections,
  { id: 'simulation-papers', number: '05', nav: 'Inside the research' },
  { id: 'simulation-software', number: '06', nav: 'The computational toolbox' },
  { id: 'simulation-details', number: '07', nav: 'A closer look' },
];
const headings = {
  'what-is-atomistic': <>What did we put<br /><span className={styles.headingAccent}>in the model?</span></>,
  'why-simulate': <>A useful explanation starts<br /><span className={styles.headingAccent}>with a fair comparison.</span></>,
  'how-it-works': <>Energy gives us forces.<br /><span className={styles.headingAccent}>Forces give us motion.</span></>,
  'where-it-helps': <>The atoms moved.<br /><span className={styles.headingAccent}>What did we measure?</span></>,
};

function Source({ index }) {
  return <ReferenceLink number={index + 1} className={styles.citation} aria-label={`Reference ${index + 1}: ${article.sources[index].label}`} />;
}

function ChapterText({ text }) {
  return text.split(/(individual atoms|physical model|numerical experiment|atomic mechanism|one model ingredient at a time|independent evidence|energy-and-force model|molecular dynamics|Monte Carlo|electronic structure|forces give accelerations|equilibration|uncertainty|local structure and interactions|continuum model|interface property|thermal transport|machine-learning potentials|partial charges|hydrogen-bond)/gi)
    .map((part, index) => index % 2 ? <span className={styles.headingAccent} key={index}>{part}</span> : part);
}

function ResearchCarousel({ active, setActive }) {
  const reduceMotion = useReducedMotion();
  const item = article.research[active];
  const move = direction => setActive(index => (index + direction + article.research.length) % article.research.length);
  return <section id="simulation-papers" className={styles.researchCarousel} aria-labelledby="atoms-research-title" aria-roledescription="carousel" tabIndex={0} onKeyDown={event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  }}>
    <header className={styles.researchCarouselHeader} data-graphene-reveal="0">
      <div><span className={styles.eyebrow}>Chapter 05 / Inside the research</span><h2 id="atoms-research-title">Now ask about<br /><span className={styles.headingAccent}>a real material.</span></h2></div>
      <div className={styles.researchControls}>
        <button type="button" aria-label="Previous atomistic study" onClick={() => move(-1)}>←</button>
        <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(article.research.length).padStart(2, '0')}</span>
        <button type="button" aria-label="Next atomistic study" onClick={() => move(1)}>→</button>
      </div>
    </header>
    <p className={s.intro}>The small models above introduce the reasoning. These studies use material-specific models and measurements to answer research questions. Follow the comparison, the measured result, and the limits of the conclusion.</p>
    <div className={s.studySelector} role="group" aria-label="Choose an atomistic study">{article.research.map((study, index) => <button key={study.slug} type="button" aria-pressed={index === active} onClick={() => setActive(index)}><span>0{index + 1}</span>{['Deforming a sheet', 'Gas-driven exfoliation', 'Learning the forces', 'Cooling a nanoparticle'][index]}</button>)}</div>
    <AnimatePresence initial={false} mode="wait">
    <motion.div key={item.slug} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className={`${styles.researchSlide} ${s.researchSlide}`} role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${article.research.length}: ${item.title}`}>
      <div className={styles.researchSlideCopy}>
        <p className={s.researchConnection}><strong>From the explorer</strong>{item.connection}</p>
        <p className={styles.researchMeta}>{item.category}</p>
        <h3><span className={styles.headingAccent}>{item.title}</span></h3>
        <p>{item.problem}</p>
        <p><ChapterText text={item.text} /></p>
        <details className={s.researchDetails}><summary>What can this result inform?</summary><p>{item.implication}</p></details>
        <p className={styles.researchPaperTitle}>{item.paperTitle}</p>
        <div className={styles.researchLinks}><Link to={`/journal/${item.slug}/`}>Explore the study and its limitations ↗</Link><a href={item.url} target="_blank" rel="noopener noreferrer">Original paper ↗</a></div>
      </div>
      <figure className={styles.researchSlideFigure}>
        <p className={s.figureReading}><strong>Start here</strong>{item.figure.reading}</p>
        <a className={styles.imageLink} href={item.figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${item.figure.source}: ${item.title}`}><img src={item.figure.src} width={item.figure.width} height={item.figure.height} alt={item.figure.alt} loading="lazy" /><span className={styles.imageHint} aria-hidden="true">View figure ↗</span></a>
        <figcaption>{item.figure.source} · {item.figure.caption}</figcaption>
      </figure>
    </motion.div>
    </AnimatePresence>

  </section>;
}

function SoftwareGuide() {
  return <section id="simulation-software" className={s.tools} aria-labelledby="atoms-software-title">
    <header><span className={styles.eyebrow}>Chapter 06 / The computational toolbox</span><h2 id="atoms-software-title">A different tool<br /><span className={styles.headingAccent}>for each part of the job.</span></h2><p className={s.intro}>Once you have a question and a measurement in mind, choose the tools to prepare the structure, calculate its behaviour, and analyse the result.</p><p className={s.sectionNote}>A guide to the field; individual studies use their own methods and software.</p></header>
    <div className={s.toolList}>{article.software.map((tool, index) => <article key={tool.name} className={s.tool} data-graphene-reveal={index % 2}>
      <div className={s.toolBrand}>{tool.logo ? <img src={tool.logo} alt={`${tool.name} logo`} width="160" height="80" loading="lazy" decoding="async"/> : <span className={s.wavefunction} role="img" aria-label="Wavefunction symbol for electronic structure">Ψ</span>}<span className={s.toolIndex} aria-hidden="true">0{index + 1}</span></div>
      <div><span className={styles.eyebrow}>{tool.role}</span><h3><a href={tool.url} target="_blank" rel="noopener noreferrer">{tool.name} <span aria-hidden="true">↗</span></a></h3><p>{tool.text}</p><details><summary>What to know</summary><p>{tool.detail}</p></details></div>
    </article>)}</div>
  </section>;
}

export default function Atoms() {
  const [system, setSystem] = useState('solid');
  const [researchIndex, setResearchIndex] = useState(0);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const pageRef = useRef(null);
  useGrapheneReveals(pageRef);
  useSoftScroll(pageRef);
  const reduced = useReducedMotion();
  useEffect(() => {
    const page = pageRef.current;
    let frame;
    const update = () => {
      frame = null;
      const threshold = page.getBoundingClientRect().top + 175;
      const current = [...chapters].reverse().find(chapter => document.getElementById(chapter.id)?.getBoundingClientRect().top <= threshold);
      const currentId = current?.id || chapters[0].id;
      setActiveChapter(currentId);
      const index = chapters.findIndex(chapter => chapter.id === currentId);
      page.style.setProperty('--rail-progress', index === 0 ? '0' : index === chapters.length - 1 ? '1' : '.5');
      const distance = page.scrollHeight - page.clientHeight;
      page.style.setProperty('--reading-progress', String(distance > 0 ? Math.max(0, Math.min(1, page.scrollTop / distance)) : 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    page.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(onScroll);
    observer.observe(page.querySelector('main'));
    const hashTarget = document.getElementById(window.location.hash.slice(1));
    if (hashTarget && page.contains(hashTarget)) hashTarget.scrollIntoView();
    update();
    return () => { page.removeEventListener('scroll', onScroll); observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  function navigate(id) {
    const target = pageRef.current?.querySelector(`#${id}`);
    if (target) target.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
    window.history.replaceState(window.history.state, '', `#${id}`);
    setActiveChapter(id);
  }

  return <div ref={pageRef} className={`${styles.page} ${s.page}`} data-site-motion-ignore="true">
    <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
    <main className={`${styles.main} ${s.main}`}>
      <header className={s.hero}>
        <div className={s.heroIdentity}><span className={s.ghostWord} data-graphene-entrance="atmosphere" aria-hidden="true">Atoms.</span><span className={styles.eyebrow} data-graphene-entrance="eyebrow">A closer look at materials</span><h1 data-graphene-entrance="title">Matter,<br /><em>atom by atom.</em></h1><p className={s.heroKicker} data-graphene-entrance="kicker">A visual guide to atomistic simulation</p></div>
        <div className={s.heroVisual} data-graphene-entrance="journey"><figure><img src="/images/atoms/crystal-vacancy.jpg" width="1536" height="1024" alt="A complete crystal beside the same arrangement with one vacant site, marked in teal." fetchPriority="high"/><figcaption><span>Complete lattice</span><span>One vacant site</span></figcaption></figure><ol className={styles.heroJourney} aria-label="The learning journey"><li><span aria-hidden="true">• · ·</span> ask a question</li><li><span aria-hidden="true">• • ·</span> change one ingredient</li><li><span aria-hidden="true">• • •</span> follow the evidence</li></ol></div>
        <div className={styles.heroIntro}><h2 data-graphene-entrance="intro"><span aria-hidden="true">◆</span> What can one missing atom change?</h2><p data-graphene-entrance="intro" data-entrance-order="1">A solid keeps its shape. A gas spreads out. Water flows. How do interactions between atoms produce such different behaviour? Start with a small experiment: <a href="#atoms-explorer" onClick={() => setSystem('solid')}>remove one atom</a> and watch its neighbours. Follow the explanation from <a href="#why-simulate">controlled comparison</a> to forces, motion and a <a href="#simulation-papers">published result</a>.</p><div className={styles.heroActions} data-graphene-entrance="actions"><a href="#atoms-explorer" onClick={() => setSystem('solid')}>Try the missing-atom experiment <span aria-hidden="true">↗</span></a><a href="#what-is-atomistic">Follow the explanation <span aria-hidden="true">↓</span></a></div><p className={styles.readingGuide} data-graphene-entrance="guide">Seven chapters · Three live systems · Explore forces and read a trajectory</p></div>
      </header>

      <AtomisticExplorer system={system} setSystem={setSystem} onResearch={setResearchIndex} />
      <AtomsStoryNavigation chapters={chapters} active={activeChapter} navigate={navigate} />

      <article>
        {chapters.slice(0, 4).map(section => <section id={section.id} key={section.id} className={`${styles.chapter} ${s.chapter}`} data-chapter-id={section.id} aria-labelledby={`${section.id}-title`}>
          <ScrollFade root={pageRef} className={styles.chapterHeading}><span className={styles.chapterNumber} aria-hidden="true">{section.number}</span><span className={styles.eyebrow}>Chapter {section.number} / {section.nav}</span><h2 id={`${section.id}-title`}>{headings[section.id]}</h2></ScrollFade>
          <div className={styles.prose}>{section.paragraphs.map((paragraph, index) => <ScrollFade root={pageRef} as="p" stagger={index} key={paragraph}><ChapterText text={paragraph} />{index === section.paragraphs.length - 1 && <> <Source index={section.source} /></>}</ScrollFade>)}</div>
          <AtomisticIllustration chapter={section.id} />
          {section.id === 'how-it-works' && <><AtomicForceExplorer /><SimulationWorkflow /></>}
          {section.id === 'where-it-helps' && <div className={s.scaleBridge}><span className={styles.eyebrow}>Connecting the scales</span><div><p>Atomic interactions<span>Structure, forces, motion</span></p><span aria-hidden="true">→</span><p>Material properties<span>Transport, stress, interfaces</span></p><span aria-hidden="true">→</span><p>Engineering models<span>Response at a larger scale</span></p></div><p className={s.sectionNote}>Each step needs validation. The useful link may be a mechanism or a measured property, rather than every atomic coordinate.</p></div>}
          <div className={styles.storyHandoff}><a href={`#${chapters[chapters.findIndex(chapter => chapter.id === section.id) + 1].id}`}><span>{({ 'what-is-atomistic': 'How do we make a comparison we can trust?', 'why-simulate': 'Where do the forces come from?', 'how-it-works': 'How do we read the trajectory?', 'where-it-helps': 'What does this look like in published research?' })[section.id]}</span><span aria-hidden="true">↓</span></a></div>
        </section>)}
      </article>

      <AtomisticThoughtExperiment onReturn={() => setSystem('solid')} />
      <ResearchCarousel active={researchIndex} setActive={setResearchIndex} />

      <SoftwareGuide />
      <section id="simulation-details" className={s.deeper} aria-labelledby="atoms-details-title">
        <header><span className={styles.eyebrow}>Chapter 07 / A closer look</span><h2 id="atoms-details-title">Before trusting<br /><span className={styles.headingAccent}>the answer.</span></h2><p className={s.intro}>Open a topic to follow the physics behind the pictures.</p></header>
        <div className={s.detailList}>{article.technicalSections.map(item => <details key={item.id} id={item.id}><summary>{item.title}</summary><div>{item.paragraphs.map(paragraph => <p key={paragraph}><ChapterText text={paragraph} /></p>)}<Source index={item.source} /></div></details>)}
          <details><summary>Water geometry, charge sites, and bonding</summary><div className={s.waterFigures}>{article.exampleDiagrams.map(diagram => <figure key={diagram.src}><a className={styles.imageLink} href={diagram.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge: ${diagram.title}`}><img src={diagram.src} width="960" height="540" alt={diagram.alt} loading="lazy" /><span className={styles.imageHint} aria-hidden="true">View image ↗</span></a><figcaption><h3>{diagram.title}</h3><p>{diagram.caption} <Source index={diagram.source} /></p></figcaption></figure>)}</div></details>
        </div>
      </section>
      <section className={styles.recap} data-graphene-reveal="0"><span className={styles.eyebrow}>Return to the opening question</span><h2>One missing atom.<br /><span className={styles.headingAccent}>A question we can test.</span></h2><ol>{article.takeaways.map(text => <li key={text}>{text}</li>)}</ol><a href="#atoms-explorer" onClick={() => setSystem('solid')}>Try the comparison again ↑</a></section>
      <section className={styles.faq}><span className={styles.eyebrow}>Questions worth asking</span><h2>Common questions about atomic simulation</h2>{article.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
      <section className={styles.closing}><span className={styles.eyebrow}>From a model to a material</span><h2>Meet a material.<br /><span className={styles.headingAccent}>Follow the evidence.</span></h2><p>See how atomic structure shapes graphene’s properties, or explore how microscopy and spectroscopy test what we have made.</p><div><Link to="/Graphene">Explore graphene ↗</Link><Link to="/metrology">Explore metrology ↗</Link></div></section>
      <section className={styles.sources}><h2>Sources & further reading</h2><ol>{article.sources.map((source, index) => <li id={`reference-${index + 1}`} tabIndex={-1} key={source.url}><a href={source.url}>{source.label} ↗</a> <BackToText number={index + 1} /></li>)}</ol></section>
    </main>
  </div>;
}
