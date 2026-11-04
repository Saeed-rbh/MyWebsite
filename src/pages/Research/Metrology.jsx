import ReferenceLink, { BackToText } from './ReferenceLink';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import SEO from '../../components/SEO/SEO';
import { metrologyArticle as article } from '../../data/metrologyArticle.mjs';
import useGrapheneReveals from './useGrapheneReveals';
import useSoftScroll from './useSoftScroll';
import { ScrollFade } from '../Commercialization/StoryMotion';
import shared from './GrapheneArticle.module.css';
import styles from './Metrology.module.css';

const labels = { 'uv-vis': 'UV–Vis', tem: 'Electron microscopy', xps: 'XPS', raman: 'Raman', afm: 'AFM', sem: 'SEM' };
const entranceProfile = {};
const stops = [...article.sections, { id: 'takeaways', number: '09', nav: 'What to take with you' }];
const figureDimensions = {"mos2-tem": [1430, 529], "mos2-xps": [1440, 542], "mos2-raman": [1457, 788], "hbn-raman": [1452, 797], "graphene-raman": [1438, 789], "hbn-tem": [1422, 523], "uv-vis-calibration": [750, 726], "graphene-tem": [1436, 528]};
const figureSets = {
  microscopy: [
    ['graphene-tem', 'Graphene', 'Broad sheets and wrinkles, with repeating atomic structure visible in small regions.', '7.1'],
    ['hbn-tem', 'h-BN', 'Long, narrow sheets with repeating atomic structure in small regions.', '7.3'],
    ['mos2-tem', 'MoS₂', 'Compact, plate-like flakes with fine repeating lines linked to the crystal structure.', '7.2'],
  ],
  raman: [
    ['mos2-raman', 'MoS₂', 'Start with panel (a): the separation between the two marked peaks decreases in the higher-speed fractions.', '7.17'],
    ['graphene-raman', 'Graphene', 'Look for the retained G and 2D bands. The D band includes contributions from exposed edges and disorder.', '7.15'],
    ['hbn-raman', 'h-BN', 'A clear E₂g peak remains near 1366–1368 cm⁻¹ after processing.', '7.16'],
  ],
};

const storyStops = stops.map(s => ({ ...s, label: `${s.number} / ${s.nav}` }));
const chapterTitles = Object.fromEntries(stops.map(s => [s.id, s.nav]));
const storyGroups = [
 {title:'Start here',ids:['why-measure','instrument-guide','concentration']},
 {title:'See the sheets',ids:['see-the-sheets','afm-thickness','sem-morphology']},
 {title:'Read the evidence',ids:['check-the-chemistry','read-the-vibrations','takeaways']},
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
        triggerRef.current?.focus({ preventScroll:true });
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
  return <nav ref={navRef} className={`${shared.contents} ${shared.storyNavigation}`} aria-label="In this story" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <div className={shared.storyRail}>
      <div className={shared.railWindow} style={{ height: (activeIndex === 0 || activeIndex === storyStops.length - 1 ? 2 : 3) * 72 }}>
        <motion.ol className={shared.railChapters} initial={false}
          animate={{ y: -Math.max(0, Math.min(storyStops.length - 2, activeIndex - 1)) * 72 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
          {storyStops.map((stop, index) => <li key={stop.id} aria-hidden={Math.abs(index - activeIndex) > 1 || undefined} data-visited={index < activeIndex || undefined}>
            <a href={`#${stop.id}`} tabIndex={Math.abs(index - activeIndex) > 1 ? -1 : 0} aria-current={stop.id === activeChapter ? 'location' : undefined} onClick={event => {
              event.preventDefault();
              onNavigate(stop.id);
            }}><span className={shared.railMarker} aria-hidden="true" /><span className={shared.railNumber} aria-hidden="true">{article.sections.find(section => section.id === stop.id)?.number}</span><span className={shared.railLinkText}>{chapterTitles[stop.id]}</span></a>
          </li>)}
        </motion.ol>
      </div>
    </div>
    <button ref={triggerRef} type="button" className={shared.storyTrigger} aria-expanded={open} aria-controls="metrology-story-chapters" onClick={() => setOpen(value => !value)}>
      <span className={shared.storyTriggerCopy}><span className={shared.storyCurrent}>{chapterTitles[activeChapter]}</span></span>
      <span className={shared.storyPosition}>{String(activeIndex + 1).padStart(2, '0')} / {storyStops.length}</span>
      <svg className={shared.storyChevron} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>

    <div id="metrology-story-chapters" className={shared.storyPanel} hidden={!open}>
      <div className={shared.storyGroups}>{storyGroups.map(group => <section key={group.title} aria-label={group.title}>
        <h2>{group.title}</h2>
        <ol>{group.ids.map(id => {
          const stop = storyStops.find(item => item.id === id);
          const interactive = id === 'graphene-explorer';
          return <li key={id}><a href={`#${id}`} aria-current={id === activeChapter ? 'location' : undefined} onClick={event => {
            event.preventDefault();
            onNavigate(id);
            setOpen(false);
            triggerRef.current?.focus({ preventScroll:true });
          }}><span className={shared.storyItemMarker} aria-hidden="true">{interactive ? '↗' : stop.label.match(/^\d+/)?.[0] || '—'}</span><span>{chapterTitles[id]}{interactive && <small>Interactive</small>}</span>{id === activeChapter && <span className={shared.storyActiveDot} aria-hidden="true" />}</a></li>;
        })}</ol>
      </section>)}</div>
    </div>
  </nav>;
}

function ArticleText({ text }) {
  const parts = text.split(/(extremely thin sheets|exfoliation|science of measurement|No single instrument|concentrations?\b|calibration|absorb some light|scatter some|repeating arrangement of atoms|electromagnetic lenses|height map|flexible arm|secondary electrons|surface chemistry|chemical bonds|atomic vibrations|energy shifts|more exposed edges|exact layer count|same thickness|free of defects|main bonding patterns|thinner sheets|energy of those electrons|different patterns of peaks|elements near the surface|Peaks can overlap|Small amounts of a substance may go undetected|original chemical identity|oxygen-related signals|newly exposed edges|Newly exposed edges|height measurement|known quantity|known volume|typical size|single atomic layer|several layers|characteristic vibrational peak|gap between two peaks|mass extinction coefficient|a dispersion|appearance alone|tiny flakes|absorption and light scattered|measurement and the limits of peak fitting)/gi);
  let highlighted = 0;
  return parts.map((part,index)=>index % 2 && highlighted++ < 3 ? <span className={shared.headingAccent} key={index}>{part}</span> : part);
}

function DeviceIllustration({ item }) {
  const image = item.illustration;
  return <figure className={`${shared.learningVisual} ${styles.deviceIllustration}`}>
    <a className={shared.imageLink} href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${item.name} device and working principle`}><img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" /><span className={shared.imageHint} aria-hidden="true">View image ↗</span></a>
    <figcaption className={shared.compactFigureCaption}><p>Conceptual instrument illustration · AI-generated</p><details className={shared.figureDetails}><summary>Image details</summary><p>{image.caption}</p></details></figcaption>
  </figure>;
}

function MethodOverview() {
  return <div className={styles.methodOverview}>{article.instruments.map(item => {
    const section = article.sections.find(s => s.method === item.id);
    return <a key={item.id} href={`#${section.id}`}><span className={shared.eyebrow}>{labels[item.id]}</span><h3>{item.question}</h3><span>Explore the method ↗</span></a>;
  })}</div>;
}

function MethodExplanation({ item }) {
  return <div className={`${shared.learningDiagram} ${styles.methodDiagram}`}>
    <header><span className={shared.eyebrow}>Picture the idea</span><h3>{item.question}</h3></header>
    <div className={`${shared.learningIllustration} ${styles.methodLayout}`}>
      <DeviceIllustration item={item} />
      <ol className={shared.imageExplanations}>{[['How it works',item.howItWorks],['What you get',item.output],['What it cannot tell us alone',item.limitation]].map(([title,copy],index)=><li key={title}><span className={shared.eyebrow}>Understand 0{index+1}</span><h4>{title}</h4><p><ArticleText text={copy} /></p></li>)}</ol>
    </div>
    <div className={shared.figureCredit}>Method references: {item.principleSources.map((index,position)=><React.Fragment key={index}>{position>0&&' · '}<ReferenceLink number={index}>[{index}] {article.sources[index].title}</ReferenceLink></React.Fragment>)}</div>
  </div>;
}

function ThesisFigure({ name, title, reading, number }) {
  return <figure className={shared.literatureFigure} data-layout={figureDimensions[name][1] > figureDimensions[name][0] ? "portrait" : "landscape"}><header><span className={shared.eyebrow}>My dissertation / Figure {number}</span><h3>{title}</h3><p className={shared.figureStart}>{reading}</p></header><a href={`/images/metrology/${name}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge thesis Figure ${number}: ${title}`}><img src={`/images/metrology/${name}.png`} width={figureDimensions[name][0]} height={figureDimensions[name][1]} alt={`${title}. Original thesis Figure ${number}. ${reading}`} loading="lazy" decoding="async" /></a><figcaption className={shared.compactFigureCaption}><p><cite>Saeed Arabha · PhD dissertation, 2026</cite> · Figure {number} · Unaltered.</p><details className={shared.figureDetails}><summary>Image details</summary><p>{reading}</p><p>Open the figure to inspect its axes, labels and scale bars at full size.</p></details></figcaption></figure>;
}

function FigureExplorer({ kind }) {
  const [selected, setSelected] = useState(0);
  const figures = figureSets[kind];
  const [name, title, reading, number] = figures[selected];
  return <div className={styles.fullWidth}><div className={styles.materialSwitch} role="group" aria-label={`Choose material for ${kind}`}>{figures.map((f, i) => <button type="button" key={f[0]} aria-pressed={i === selected} onClick={() => setSelected(i)}>{f[1]}</button>)}</div><ThesisFigure name={name} title={title} reading={reading} number={number} />{kind === 'microscopy' && <p className={styles.note}>These images show selected flakes and local crystalline regions. They do not establish a population-wide size distribution or exact layer count.</p>}</div>;
}

function RamanResults() {
  const result = article.results[0];
  return <figure className={styles.ramanResults}><header><span className={shared.eyebrow}>Read the measurement / MoS₂</span><h3>Two peaks move closer together.<br /><span className={shared.headingAccent}>A clue that the sheets are thinner.</span></h3><p>MoS₂ processed with air, then separated by centrifugation · Δ is the gap between the two peaks</p></header>
    <div className={styles.dotPlot} role="img" aria-label={result.data.map(d => `${d.sample}: ${d.value} reciprocal centimetres`).join('; ')}><div className={styles.axis}><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27 cm⁻¹</span></div>{result.data.map((d,i) => <div className={styles.plotRow} key={d.sample}><span>{d.sample}</span><div className={styles.plotTrack}><i style={{ left: `${(d.value - 22) / 5 * 100}%` }} data-bulk={i === 0 || undefined} /></div><strong>{d.value.toFixed(2)}</strong></div>)}</div>
    <figcaption>Values transcribed from thesis Table 7.13; axis spans 22–27 cm⁻¹. A lower separation supports thinning, with other measurements needed to assign layer count. The table does not report measurement uncertainties.</figcaption>
    <details className={`${shared.figureDetails} ${styles.dataDetails}`}><summary>View the measured values</summary><table><caption>MoS₂ Raman peak separation, Table 7.13</caption><thead><tr><th scope="col">Sample</th><th scope="col">Δ (cm⁻¹)</th></tr></thead><tbody>{result.data.map(d => <tr key={d.sample}><th scope="row">{d.sample}</th><td>{d.value}</td></tr>)}</tbody></table></details>
  </figure>;
}

function Calibration() {
  const [dilution, setDilution] = useState(2);
  return <div className={styles.fullWidth}><ThesisFigure name="uv-vis-calibration" title="Calibrate before comparing." number="6.7" reading="Known concentrations establish the relationship between the optical signal and dispersed material. Each material has its own calibration." /><div className={styles.calibration}><div><span className={shared.eyebrow}>Try the idea / Teaching calculation</span><h3>Correct a measured concentration for dilution.</h3><p>Suppose the instrument gives 0.05 grams per litre (g L⁻¹) after calibration. If you diluted one part of the original liquid to two parts in total, the original was twice as concentrated. Move the slider to try other dilution factors.</p></div><div><label htmlFor="dilution">Dilution factor <strong>{dilution}×</strong></label><input id="dilution" type="range" min="1" max="10" step="1" value={dilution} onChange={e => setDilution(Number(e.target.value))} /><output htmlFor="dilution" aria-live="polite">{(0.05 * dilution).toFixed(2)} <small>g L⁻¹ in the original suspension</small></output><p>0.05 × {dilution} = {(0.05 * dilution).toFixed(2)} g L⁻¹. Each setting is a separate hypothetical sample with the same measured cuvette concentration; this is not a thesis measurement.</p></div></div></div>;
}

function KnowledgeCheck() {
  const [answer, setAnswer] = useState(null);
  return <section className={shared.quiz}><div className={shared.quizIntro}><span className={shared.eyebrow}>Pause & think</span><h2>A bottle of flakes in liquid looks darker.<br />What have we learned?</h2><p>Choose the conclusion the observation can support.</p></div><div className={shared.quizInteraction}><div className={shared.quizAnswers} role="group" aria-label="Choose an interpretation">{['The flakes are definitely only one atomic layer thick.', 'The way light passes through changed. We need more measurements to know why.', 'The material has no defects.'].map((a,i) => <button className={shared.quizAnswer} key={a} type="button" aria-pressed={answer === i} onClick={() => setAnswer(i)}><span className={shared.quizAnswerIndex} aria-hidden="true">0{i+1}</span><span>{a}</span><span className={shared.quizAnswerMark} aria-hidden="true">{answer===i ? "✓" : ""}</span></button>)}</div><div className={shared.quizResponse} data-answered={answer!==null}><h3>{answer===null ? "What do you think?" : answer===1 ? "That is what the evidence supports." : "Look a little closer."}</h3><p aria-live="polite">{answer === null ? 'Choose an interpretation to test your understanding.' : answer === 1 ? 'Yes. More solid, clumping or changes in light scattering can all affect the appearance. We need calibrated measurements and other tools to learn about thickness and quality.' : 'Appearance alone cannot tell us how many layers the sheets contain or whether they have defects. Start by measuring how much solid is in the liquid.'}</p></div><div className={shared.quizActions}><button type="button" onClick={()=>setAnswer(null)}>Try again</button><a href="#takeaways">Put the evidence together <span aria-hidden="true">↗</span></a></div></div></section>;
}

export default function Metrology() {
  const pageRef = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(stops[0].id);
  useGrapheneReveals(pageRef, true, entranceProfile);
  useSoftScroll(pageRef);
  const navigate = (id, focus = false) => {
    const target = pageRef.current?.querySelector(`#${id}`);
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
    if (focus) target.querySelector('h2')?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const page = pageRef.current;
    let frame;
    const update = () => {
      frame = null;
      const current = [...stops].reverse().find(s => page.querySelector(`#${s.id}`)?.getBoundingClientRect().top <= 210);
      setActive(current?.id || stops[0].id);
      const chapterIndex = stops.findIndex(s=>s.id === (current?.id || stops[0].id));
      page.style.setProperty('--rail-progress', chapterIndex===0 ? '0' : chapterIndex===stops.length-1 ? '1' : '.5');
      page.style.setProperty('--reading-progress', `${page.scrollTop / Math.max(1,page.scrollHeight - page.clientHeight)}`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const align = () => { const id = window.location.hash.slice(1); if (stops.some(s => s.id === id)) page.querySelector(`#${id}`)?.scrollIntoView({ block:'start', behavior:'instant' }); };
    const initial = requestAnimationFrame(() => { align(); update(); });
    page.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', align);
    return () => { page.removeEventListener('scroll',onScroll); window.removeEventListener('resize',onScroll); window.removeEventListener('hashchange',align); cancelAnimationFrame(initial); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={pageRef} className={`${shared.page} ${styles.page}`} data-site-motion-ignore="true"><SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
    <a href="#why-measure" className={styles.skip} onClick={e => {e.preventDefault();navigate('why-measure',true);}}>Skip to article</a>
    <main className={shared.main}>
      <header className={shared.hero}>
        <div className={shared.heroIdentity}><span className={shared.ghostWord} data-page-entrance="atmosphere" aria-hidden="true">Evidence.</span><span className={shared.eyebrow} data-page-entrance="eyebrow">Characterization of 2D materials</span><h1><span className={shared.heroPrefix} data-page-entrance="prefix">Meet</span> <em data-page-entrance="title">Metrology.</em></h1><p className={shared.heroKicker} data-page-entrance="kicker">Six tools. One picture of the material.</p></div>
        <ol className={shared.heroJourney} aria-label="The learning journey">{['why this method?','how does it work?','what do results show?'].map((s,i) => <li key={s} data-page-entrance="journey" data-entrance-order={i}><span aria-hidden="true">{['• · ·','• • ·','• • •'][i]}</span>{s}</li>)}</ol>
        <div className={shared.heroIntro}><h2 data-page-entrance="intro"><span aria-hidden="true">◆</span>How do we characterize 2D materials?</h2><p data-page-entrance="intro">Making thin sheets is only the beginning. How much did we collect? How thin are they? Did their structure survive? Explore <a href="#instrument-guide">six ways to find out</a>: what each instrument does, how it works and what we can learn from it. See my <a href="#see-the-sheets">microscopy</a>, <a href="#check-the-chemistry">XPS</a>, <a href="#read-the-vibrations">Raman</a> and <a href="#concentration">UV–Vis results</a> alongside the explanations.</p><div className={shared.heroActions} data-page-entrance="actions"><a href="#instrument-guide" onClick={e=>{e.preventDefault();navigate('instrument-guide');}}>Choose a method <span aria-hidden="true">↗</span></a><a href="#why-measure" onClick={e=>{e.preventDefault();navigate('why-measure');}}>Start with the questions <span aria-hidden="true">↓</span></a></div><p className={shared.readingGuide} data-page-entrance="guide">The question → How it works → What my results show</p></div>
      </header>
      <StoryNavigation activeChapter={active} onNavigate={id=>navigate(id,true)} />
      <article aria-label={article.title}>{article.sections.map(section=><section key={section.id} id={section.id} className={shared.chapter}>
        <ScrollFade root={pageRef} className={shared.chapterHeading}><span className={shared.chapterNumber} aria-hidden="true">{section.number}</span><span className={shared.eyebrow}>Chapter {section.number} / {section.nav}</span><h2 tabIndex="-1">{section.method ? <><span className={shared.headingAccent}>{section.nav}</span><br />{article.instruments.find(i=>i.id===section.method).question}</> : section.id === "instrument-guide" ? <>One sample.<br /><span className={shared.headingAccent}>Six questions.</span></> : <>What do we need to know about a <span className={shared.headingAccent}>2D material?</span></>}</h2></ScrollFade>
        <div className={shared.prose}>{section.method && <span className={shared.eyebrow}>Why use this method?</span>}{section.paragraphs.map((p,i)=><ScrollFade root={pageRef} as="p" key={p} stagger={i}><ArticleText text={p} />{i===section.paragraphs.length-1&&section.source!==0&&<> <ReferenceLink number={section.source} className={shared.citation} aria-label={`Reference ${section.source}: ${article.sources[section.source].title}`} /></>}</ScrollFade>)}</div>
        {section.id==='instrument-guide'&&<MethodOverview />}
        {section.method && <MethodExplanation item={article.instruments.find(i=>i.id===section.method)} />}
        {section.method && <div className={styles.methodEvidence}><header><span className={shared.eyebrow}>{section.resultParagraphs.length ? 'My thesis results / '+section.nav : 'Results availability'}</span><h3>{section.resultParagraphs.length ? 'What did this method show in my research?' : 'Where this method fits.'}</h3></header>{section.resultParagraphs.length ? section.resultParagraphs.map(p=><p key={p}><ArticleText text={p} /></p>) : <p>{section.method==='afm' ? 'AFM adds a direct height measurement to the picture. I include it to explain how researchers check flake thickness; I do not present an original AFM dataset from my thesis here.' : 'SEM helps show how flakes are arranged on a surface. My thesis images of the nanosheets came from TEM, STEM and HRTEM, so I explain SEM here without presenting it as one of my experimental results.'}</p>}</div>}
        {section.technicalDetails?.length > 0 && <details className={`${shared.figureDetails} ${styles.scientificDetails}`}><summary>Go deeper: measurements and scientific details</summary>{section.technicalDetails.map(p => <p key={p}><ArticleText text={p} /></p>)}</details>}
        {section.id==='concentration'&&<Calibration />}
        {section.id==='see-the-sheets'&&<FigureExplorer kind="microscopy" />}
        {section.id==='check-the-chemistry'&&<div className={styles.fullWidth}><ThesisFigure name="mos2-xps" title="The chemical fingerprint remains." number="7.13" reading="Compare the main pair of peaks before and after processing. They still indicate bonding between molybdenum and sulfur, alongside smaller signals from other chemical environments." /></div>}
        {section.id==='read-the-vibrations'&&<><RamanResults /><FigureExplorer kind="raman" /></>}
        {section.handoff&&<div className={shared.storyHandoff}><a href={`#${section.handoff.to}`} onClick={e=>{e.preventDefault();navigate(section.handoff.to,true);}}><span className={shared.handoffLabel}>Next · {chapterTitles[section.handoff.to]}</span><span className={shared.handoffPrompt}><span>{section.handoff.text}</span><svg className={shared.handoffArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg></span></a></div>}
      </section>)}</article>
      <KnowledgeCheck />
      <section id="takeaways" className={shared.recap}><span className={shared.eyebrow}>The journey / What to take with you</span><h2 tabIndex="-1">Put the evidence together.</h2><p><ArticleText text={article.conclusion} /></p><ol>{article.takeaways.map(t=><li key={t}>{t}</li>)}</ol><div className={styles.related}><Link to="/Graphene">Meet graphene ↗</Link><Link to="/simulate-atoms">Explore atomistic simulation ↗</Link><Link to="/journal/">Read my research ↗</Link></div></section>
      <section className={shared.sources} aria-labelledby="metrology-sources"><h2 id="metrology-sources">Sources & further reading</h2><ol>{article.sources.map((s,i)=>i===0?null:<li id={`reference-${i}`} tabIndex={-1} value={i} key={s.title}>{s.url?<a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a>:<><cite>{s.title}</cite><p>{s.detail}</p></>} <BackToText number={i} /></li>)}</ol></section>
    </main>
  </div>;
}
