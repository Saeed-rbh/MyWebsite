import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { InterviewCount, ScrollFade } from './StoryMotion';
import SEO from '../../components/SEO/SEO';
import { commercializationSeo } from '../../data/siteSeo.mjs';
import papers from '../../data/journalPapers.json';
import s from './Commercialization.module.css';

const assets = '/images/commercialization/';
const chapters = [['my-role', 'My role'], ['discovery', 'Discovery'], ['solution', 'Technology'], ['market', 'Market fit'], ['pilot-plan', 'Validation'], ['capabilities', 'Status']];
const markets = [
  { short: 'TAM', label: 'The wider opportunity', value: '$5.6B+', year: 'by 2030', title: 'The global market for 2D materials.', text: 'A platform opportunity across energy storage, electronics, aerospace, automotive, construction, and industrial applications.', tags: ['Energy storage', 'Electronics', 'Aerospace', 'Automotive'] },
  { short: 'SAM', label: 'The addressable market', value: '$2.1B+', year: 'by 2030', title: 'Where material performance matters.', text: 'High-performance 2D materials enabled by scalable, cost-effective production, with applications in composites, coatings, thermal management, and energy storage.', tags: ['Advanced composites', 'Coatings', 'Thermal management', 'Batteries'] },
  { short: 'SOM', label: 'Pitch entry-market estimate', value: '$50M+', year: 'by 2027', title: 'Start with composites and industrial additives.', text: 'Composites and industrial additives represent an estimated initial opportunity. Graphite/mining and concrete are candidate entry markets identified through customer discovery.', tags: ['Advanced composites', 'Industrial additives', 'Early partners'] },
];
const evidence = { reported: ['Reported progress', 'Progress reported by the project team.'], insight: ['Customer insight', 'Requirements and interpretations from discovery.'], target: ['Future target', 'Proposed work or an assumption to validate.'] };
function Evidence({ type }) { return <span className={s.evidence} data-kind={type} title={evidence[type][1]}><i aria-hidden="true"/>{evidence[type][0]}</span>; }
const slides = ['The CFE proposition', 'Graphene and batteries', 'The adoption question', 'The production bottleneck', 'The CFE solution', 'Market opportunity', 'Industry validation', 'Scale-up and investment', 'The vision'];
function Arrow() { return <span aria-hidden="true">↗</span>; }
export default function Commercialization() {
  const [market, setMarket] = useState(2);
  const [slide, setSlide] = useState(0);
  const page = useRef(null);
  const [chapter, setChapter] = useState('my-role');
  const [processStage, setProcessStage] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll({ container: page });
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const imageDrift = useTransform(scrollY, [0, 800], [0, reducedMotion ? 0 : 48]);
  useEffect(() => {
    const root = page.current;
    if (!root) return;
    let frame;
    const ids = chapters.map(([id]) => id);
    const update = () => {
      frame = null;
      const marker = root.getBoundingClientRect().top + root.clientHeight * 0.3;
      let current = ids[0];
      for (const id of ids) {
        const section = root.querySelector(`#${id}`);
        if (section && section.getBoundingClientRect().top <= marker) current = id;
      }
      setChapter(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    root.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const current = markets[market];
  return <div className={s.page} ref={page} data-site-motion-ignore="true" data-footer-surface="light">
    <SEO {...commercializationSeo} />
    <a className={s.skip} href="#cfe-main">Skip to content</a>
    <motion.div className={s.scrollProgress} style={{ scaleX: reducedMotion ? scrollYProgress : progress }} aria-hidden="true"/>
    <main id="cfe-main">
      <section className={s.hero}>
        <div className={s.heroTop}>
          <ScrollFade root={page}><motion.div className={s.heroTitle} initial={reducedMotion ? false : { opacity: 1, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <span className={s.ghostWord} aria-hidden="true">From lab.</span>
            <p className={s.eyebrow}>VENTURE / SAEED ARABHA</p>
            <h1>Research.<br/><em>Meet the market.</em></h1>
            <p className={s.heroRole}>MATERIALS COMMERCIALIZATION <span/> CUSTOMER DISCOVERY <span/> SCALE-UP</p>
          </motion.div></ScrollFade>

        </div>
        <div className={s.heroVisual}>
          <ScrollFade root={page}><motion.figure className={s.heroObject} style={{ y: imageDrift }} initial={reducedMotion?false:{opacity:1,scale:0.94,rotate:-2}} animate={{opacity:1,scale:1,rotate:0}} transition={{delay:0.2,type:'spring',stiffness:80,damping:22}}>
            <img className={s.heroArt} src={`${assets}cfe-hero-lettering.webp`} alt="Blue CFE lettering on stacked graphite layers, with a lifting graphene sheet and blue gas flow." fetchPriority="high" width="1672" height="940" />
          </motion.figure></ScrollFade>

        </div>
        <ScrollFade root={page} as="aside" className={s.heroCombined}>
          <div className={s.heroAside}>
            <p className={s.eyebrow}>FROM INVENTOR TO FOUNDER</p>
            <p>CFE uses compressed gas to separate layered materials into thinner sheets. As entrepreneurial lead, I turn customer discovery into market choices and a pilot plan.</p>
            <a className={s.textLink} href="#discovery">Explore the CFE case <Arrow/></a>
          </div>
          <div className={s.heroProof}>
            <span className={s.materialTag}><i/> COMPRESSIBLE FLOW EXFOLIATION</span>
            <h2>A production idea.<br/><em>A customer-led direction.</em></h2>
            <p>From a materials platform to specific customers, business models, and the next proof points.</p>
            <a href="#market">Explore the market choices <Arrow/></a>
          </div>
        </ScrollFade>
        <ScrollFade root={page} className={s.credits}><div className={s.heroLeads}><div><small>ENTREPRENEURIAL LEAD</small><strong>Saeed Arabha</strong></div><div><small>TECHNICAL LEAD</small><strong>Reza Rizvi</strong></div></div><div><small>THE JOURNEY</small><strong>Lab2Market / Inventor to Founder</strong></div></ScrollFade>
      </section>
      <ul className={s.evidenceRow} aria-label="Project at a glance">
        <li><a href="#discovery"><strong>40+</strong><span>Customer interviews<small>Across the project</small></span></a></li>
        <li><a href="#market"><strong>2</strong><span>Candidate markets<small>Graphite/mining &amp; concrete</small></span></a></li>
        <li><a href="#pilot-plan"><strong>Next</strong><span>Pilot validation<small>Proposed six-month plan</small></span></a></li>
      </ul>
      <nav className={s.chapterNav} aria-label="Case study chapters">{chapters.map(([id,title],i)=><a href={`#${id}`} key={id} aria-current={chapter===id?'location':undefined}><span>0{i+1}</span>{title}</a>)}</nav>
      <section className={`${s.section} ${s.contribution}`} id="my-role">
        <ScrollFade root={page} className={s.sectionHead}><div><p className={s.eyebrow}>MY ROLE / ENTREPRENEURIAL LEAD</p><h2>From discovery.<br/><em>To decisions.</em></h2></div><p>I translate the team’s discovery findings into adoption requirements, candidate business models, and a validation plan. Reza Rizvi leads the technical work.</p></ScrollFade>
        <div className={s.contributionGrid}>{[
          ['Listen', 'Define adoption requirements', 'Customers need scale, affordability, quality, and volume.', 'Frame the opportunity around a usable product specification.', 'Benchmark samples against application requirements.', 'discovery', 'See the discovery'],
          ['Choose', 'Match the business model', 'Producers and additive buyers occupy different places in the value chain.', 'Explore licensing/advisory for graphite and mining, and material sales for concrete.', 'Test process economics and willingness to adopt.', 'market', 'Explore the choices'],
          ['Advance', 'Build a validation plan', 'Lab-scale output leaves customer and scale-up questions open.', 'Sequence partner selection, sample testing, specifications, and IP planning.', 'Secure a lead partner and agree on test conditions.', 'pilot-plan', 'View the pilot plan'],
        ].map(([verb,title,insight,decision,next,id,link],i)=><ScrollFade root={page} as="article" key={verb} stagger={i}><span className={s.roleVerb}>{verb}.</span><h3>{title}</h3><dl className={s.contributionReasoning}><div><dt>INSIGHT</dt><dd>{insight}</dd></div><div><dt>MY RESPONSE</dt><dd>{decision}</dd></div><div><dt>NEXT PROOF</dt><dd>{next}</dd></div></dl><a className={s.textLink} href={`#${id}`}>{link}<Arrow/></a></ScrollFade>)}</div>
      </section>
      <details className={s.evidenceGuide}><summary><span>How to read this case</span><small>Reported progress · Customer insights · Future targets</small><span aria-hidden="true">+</span></summary><div className={s.evidenceKey} aria-label="How to read the evidence">{Object.entries(evidence).map(([type,[label,description]])=><div key={type}><span className={s.evidence} data-kind={type}><i aria-hidden="true"/>{label}</span><p>{description}</p></div>)}</div></details>
      <section className={`${s.section} ${s.intro}`} id="opportunity">
        <ScrollFade root={page}><p className={s.eyebrow}>THE STARTING POINT</p><h2>Better materials.<br/><em>A harder adoption problem.</em></h2><p>From battery thermal management to stronger concrete, 2D materials offer useful properties. Adoption depends on delivering those properties at a specification, price, and volume a customer can use.</p></ScrollFade>
        <ScrollFade root={page} as="figure"><img src={`${assets}battery-transparent.webp`} alt="Battery concept illustrating a potential application of graphene" loading="lazy" decoding="async" width="1536" height="1024"/><figcaption>Application potential motivates the work. Customer requirements guide the product.</figcaption></ScrollFade>
      </section>
      <section className={s.problem} data-footer-surface="dark">
        <ScrollFade root={page} className={s.section}><p className={s.eyebrow}>THE PRODUCTION BOTTLENECK</p><h2>Why isn’t <em>graphene</em><br/>everywhere?</h2><p className={s.problemLead}>Production constraints become<br/>customer performance risks.</p><div className={s.barriers}>{['Batch-based production', 'Production cost', 'Variable quality', 'Scale-up uncertainty'].map((x,i)=><div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></ScrollFade>
      </section>
      <section className={s.discoverySection} id="discovery"><div className={s.section}>
        <Evidence type="reported"/><ScrollFade root={page} className={s.discoveryHead}><div><p className={s.eyebrow}>CUSTOMER DISCOVERY</p><h2>The market helped<br/><em>define the problem.</em></h2></div><div className={s.interviewCount}><InterviewCount root={page}/><span>customer interviews<br/>across the project</span></div></ScrollFade>
        <ScrollFade root={page} as="p" className={s.discoveryLead}>Four requirements kept returning across the interviews:</ScrollFade>
        <div className={s.requirements}>{[
          ['Scalable production', 'A process that can grow with demand.'],
          ['Affordable cost', 'Economics that fit the intended application.'],
          ['Consistent quality', 'Material specifications customers can rely on.'],
          ['Industrial volume', 'Enough usable material for production.'],
        ].map(([title,text],i)=><ScrollFade root={page} as="article" stagger={i} key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></ScrollFade>)}</div>
        <ScrollFade root={page} className={s.learning}><span>THE COMMERCIAL INSIGHT</span><p>Material performance creates interest. Reliable production gives a customer a reason to adopt.</p></ScrollFade>
      </div></section>
      <section className={s.section} id="solution">
        <p className={s.eyebrow}>A TECHNOLOGY RESPONSE TO THOSE NEEDS</p>
        <ScrollFade root={page} className={s.sectionHead}><h2>Powerful flow.<br/><em>Thinner materials.</em></h2><p>High-pressure gas generates shear to separate layered feedstock into thinner sheets. Continuous processing and consistent output are development goals.</p></ScrollFade>
        <ScrollFade root={page} as="figure" className={s.processFigure}>
          <div className={s.processLabel}><span>CFE / PROCESS CONCEPT</span><AnimatePresence mode="wait" initial={false}><motion.strong key={processStage} initial={reducedMotion?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={reducedMotion?{opacity:1,y:0}:{opacity:0,y:-6}} transition={{duration:reducedMotion?0:0.2}}>{['Layered feedstock','High-pressure gas flow','Separated 2D material'][processStage]}</motion.strong></AnimatePresence></div>
          <img src={`${assets}cfe-process-concept-v2.webp`} srcSet={`${assets}cfe-process-concept-v2-600.webp 600w, ${assets}cfe-process-concept-v2-1000.webp 1000w, ${assets}cfe-process-concept-v2.webp 1672w`} sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 760px) 90vw, 650px" alt="Illustrative cutaway of a CFE nozzle: gas flow separates a layered feedstock into thinner sheets" loading="lazy" decoding="async" width="1672" height="941"/>
          <figcaption>Illustrative mechanism, not a measured flow simulation. Select a stage below to explore.</figcaption>
        </ScrollFade>
        <ol className={s.steps}>{[
          ['INPUT','Bulk layered material','Start with a layered feedstock such as graphite.'],
          ['PROCESS','High-pressure flow','Use compressed gas to generate intense shear.'],
          ['OUTPUT','Exfoliated 2D material','Thinner sheets for application testing and qualification.'],
        ].map(([label,title,text],i)=><ScrollFade root={page} as="li" stagger={i} key={label}><motion.button aria-pressed={processStage===i} onClick={()=>setProcessStage(i)} whileHover={reducedMotion?{}:{y:-3}} whileTap={{scale:0.99}}><span>0{i+1} / {label}</span><h3>{title}</h3><p>{text}</p></motion.button></ScrollFade>)}</ol>
      </section>
      <section className={s.section} id="market">
        <Evidence type="insight"/><p className={s.eyebrow}>ENTRY-MARKET CHOICES</p><ScrollFade root={page} className={s.sectionHead}><h2>One platform.<br/><em>Two routes to adoption.</em></h2><p>Customer discovery points to two candidate markets, each with a different route to revenue.</p></ScrollFade>
        <div className={s.entryMarkets}>
          <ScrollFade root={page} as="article"><img src={`${assets}graphite-market.webp`} alt="Layered graphite specimens with a mineral processing facility in the background" loading="lazy" decoding="async" width="1536" height="1024"/><div><span className={s.marketLabel}>GRAPHITE &amp; MINING</span><h3>Move up the<br/>materials value chain.</h3><p>Help producers turn layered feedstock into higher-value 2D materials through a gas-driven process.</p><dl><dt>Candidate business model</dt><dd>Licensing and advisory</dd><dt>What needs validation</dt><dd>Feedstock compatibility, process economics, throughput, and integration.</dd></dl></div></ScrollFade>
          <ScrollFade root={page} as="article"><img src={`${assets}concrete-market.webp`} alt="Concrete test cubes and a core sample in front of a batching plant and aggregate bins" loading="lazy" decoding="async" width="1536" height="1024"/><div><span className={s.marketLabel}>CONCRETE &amp; RELATED ADDITIVES</span><h3>Match the material<br/>to the application.</h3><p>Supply consistent additives for strength, durability, or lower cement use. These applications may not require perfect monolayers.</p><dl><dt>Candidate business model</dt><dd>Direct sales of 2D materials</dd><dt>What needs validation</dt><dd>Customer specifications, dispersion, dosage, performance, and price.</dd></dl></div></ScrollFade>
        </div>
        <div className={s.applicationBranch}><div><p className={s.eyebrow}>AN APPLICATION BRANCH</p><h3>Thermal management adds another test of market fit.</h3><p>2D-filled polymer composites offer another application to explore: thermal-management components qualified against a user’s performance targets.</p><p className={s.note}>Application exploration / technical and supplier qualification still to be established.</p></div><img src={`${assets}thermal-transparent.webp`} alt="Concept of a thermally managed electronic component from the application exploration" loading="lazy" decoding="async" width="1254" height="1254"/></div>
      </section>
      <section className={s.marketSection} id="market-context"><div className={s.section}>
        <p className={s.eyebrow}>THE WIDER OPPORTUNITY</p><ScrollFade root={page} className={s.sectionHead}><h2>Market size gives context.<br/><em>Discovery gives direction.</em></h2><p>Market estimates provide context. A specific customer need determines where to start.</p></ScrollFade>
        <details className={s.marketContext}><summary>Explore the pitch market estimates <span aria-hidden="true">+</span></summary>
        <div className={s.marketTabs} role="tablist" aria-label="Market scope">{markets.map((m,i)=><button id={`market-tab-${i}`} role="tab" aria-selected={market===i} aria-controls="market-panel" tabIndex={market===i?0:-1} key={m.short} onClick={()=>setMarket(i)} onKeyDown={e=>{let n;if(e.key==='ArrowRight')n=(i+1)%3;if(e.key==='ArrowLeft')n=(i+2)%3;if(e.key==='Home')n=0;if(e.key==='End')n=2;if(n!==undefined){e.preventDefault();setMarket(n);document.getElementById(`market-tab-${n}`)?.focus();}}}><strong>{m.short}</strong><span>{m.label}</span></button>)}</div>
        <AnimatePresence mode="wait" initial={false}><motion.div key={market} initial={reducedMotion?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reducedMotion?{opacity:1,y:0}:{opacity:0,y:-10}} transition={{duration:reducedMotion?0:0.28}} className={s.marketPanel} id="market-panel" role="tabpanel" aria-labelledby={`market-tab-${market}`} tabIndex="0"><div className={s.marketNumber}><strong>{current.value}</strong><span>{current.year}</span><small>Pitch market estimate</small></div><div><h3>{current.title}</h3><p>{current.text}</p><div className={s.tags}>{current.tags.map(t=><span key={t}>{t}</span>)}</div></div></motion.div></AnimatePresence>
        <p className={s.note}>Market sizes and target years are planning estimates, not current market measurements or realized revenue.</p>
        </details>
      </div></section>
      <section className={`${s.section} ${s.validation}`} id="validation"><ScrollFade root={page}><p className={s.eyebrow}>INDUSTRY VALIDATION</p><h2>Beyond<br/><em>the laboratory.</em></h2><p>Early partnership work with a public advanced-materials company explores a pilot using industry-relevant graphite.</p><ul><li>Industry-relevant feedstock</li><li>Application-driven quality requirements</li><li>Pilot testing toward commercial readiness</li></ul><p className={s.note}>Customer qualification is the next proof point.</p></ScrollFade><ScrollFade root={page} as="figure"><img src={`${assets}pilot-concept-v2.webp`} srcSet={`${assets}pilot-concept-v2-600.webp 600w, ${assets}pilot-concept-v2-1000.webp 1000w, ${assets}pilot-concept-v2.webp 1672w`} sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1260px) 52vw, 650px" alt="Illustrative pilot processing skid with graphite feedstock, a pressure vessel, piping, and separated material sheets" loading="lazy" decoding="async" width="1672" height="941"/><figcaption>Industrial validation pathway / illustrative concept</figcaption></ScrollFade></section>
      <section className={s.pilotPlan} id="pilot-plan"><div className={s.section}>
        <Evidence type="target"/><p className={s.eyebrow}>THE NEXT VALIDATION GATE</p><ScrollFade root={page} className={s.sectionHead}><h2>A pilot that tests<br/><em>the business case.</em></h2><p>A proposed six-month plan turns the remaining assumptions into five practical tests.</p></ScrollFade>
        <ol className={s.validationPlan}>{[
          ['Confirm the need', 'Use follow-up interviews to test performance, pricing, volume, and adoption assumptions.'],
          ['Choose a pilot partner', 'Identify a lead concrete or composites partner with a relevant application.'],
          ['Deliver material samples', 'Provide CFE output for customer testing under agreed conditions.'],
          ['Define and benchmark', 'Set product specifications and compare performance with alternatives.'],
          ['Plan IP and the pilot', 'Begin the IP process and formalize the path to a structured pilot.'],
        ].map(([title,text],i)=><ScrollFade root={page} as="li" stagger={i} key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></ScrollFade>)}</ol>
      </div></section>
      <section className={s.roadmap} id="roadmap"><div className={s.section}>
        <Evidence type="target"/><p className={s.eyebrow}>THE LONGER-TERM SCALE-UP CASE</p><ScrollFade root={page} className={s.sectionHead}><h2>From lab-scale.<br/><em>To continuous production.</em></h2><p>Scale-up would move from manual lab work to an automated platform, with continuous operation as the longer-term goal.</p></ScrollFade>
        <ScrollFade root={page} as="img" className={s.scaleArt} src={`${assets}scale-transparent.webp`} alt="Conceptual transition from a small laboratory unit to an automated industrial platform" loading="lazy" decoding="async" width="1739" height="904"/>
        <div className={s.milestones}><div><small>BASELINE IN THE PITCH</small><h3>Lab-scale + manual</h3></div><div><small>NEXT DEVELOPMENT STEP</small><h3>Automated platform</h3></div><div><small>LONG-TERM GOAL</small><h3>24/7 production</h3></div></div>
        <div className={s.investment} data-footer-surface="dark"><div><span>PROPOSED IN THE SCALE-UP PITCH</span><strong>$2.5M</strong><small>Investment ask in the I2F pitch</small></div><div><h3>Capital tied to the next technical milestones.</h3><p>Proposed funding for automation, capacity expansion, and pilot testing.</p><a href="mailto:Arabha@Yorku.ca?subject=CFE%20commercialization">Discuss the scale-up pathway <Arrow/></a></div></div>
      </div></section>
      <section className={`${s.section} ${s.takeaways}`} id="capabilities">
        <ScrollFade root={page} className={s.sectionHead}><div><p className={s.eyebrow}>WHERE THE PROJECT STANDS</p><h2>A clearer direction.<br/><em>A defined next test.</em></h2></div><p>Discovery has narrowed the commercial questions. Pilot work must now test the answers.</p></ScrollFade>
        <div className={s.projectStatus}>
          <ScrollFade root={page} as="article"><Evidence type="insight"/><h3>Commercial direction</h3><p>Four adoption requirements, two candidate markets, and a business-model hypothesis for each.</p><a className={s.textLink} href="#market">Review the market choices <Arrow/></a></ScrollFade>
          <ScrollFade root={page} as="article" stagger={1}><Evidence type="target"/><h3>Proof still needed</h3><p>Customer-qualified samples, benchmark performance, viable process economics, and a committed pilot partner.</p><a className={s.textLink} href="#pilot-plan">See the validation plan <Arrow/></a></ScrollFade>
        </div>
      </section>
      <section className={`${s.section} ${s.pitchArchive}`} id="pitch"><details><summary><div className={s.pitchSummary}><div><p className={s.eyebrow}>SUPPORTING MATERIAL / I2F PITCH</p><h2>Explore the <em>investment story.</em></h2></div><p>Review the material, market, and scale-up proposal in the original pitch.</p><span className={s.pitchToggle} aria-hidden="true">+</span></div></summary>
        <div className={s.slideViewer}><div className={s.slideCanvas}><AnimatePresence mode="wait" initial={false}><motion.img key={slide} initial={reducedMotion?false:{opacity:0,scale:0.985}} animate={{opacity:1,scale:1}} exit={reducedMotion?{opacity:1,scale:1}:{opacity:0,scale:1.015}} transition={{duration:reducedMotion?0:0.32}} src={`${assets}slide-${slide+1}.webp`} alt={`Original pitch slide ${slide+1}: ${slides[slide]}`} loading="lazy" decoding="async" width="1672" height="941"/></AnimatePresence></div><div className={s.slideControls}><button onClick={()=>setSlide(x=>(x+8)%9)} aria-label="Previous slide">←</button><p aria-live="polite"><span>{String(slide+1).padStart(2,'0')} / 09</span> {slides[slide]}</p><button onClick={()=>setSlide(x=>(x+1)%9)} aria-label="Next slide">→</button></div></div>
      </details></section>
      <section className={`${s.section} ${s.relatedWork}`} aria-labelledby="related-work-title"><p className={s.eyebrow}>THE RESEARCH BEHIND THE COMMERCIAL CASE</p><h2 id="related-work-title">Explore the <em>underlying work.</em></h2><nav aria-label="Related research"><a href="/R&D-Portfolio">Materials research and process development <Arrow/></a><a href="/AcademicCV">Saeed Arabha’s academic CV <Arrow/></a>{papers.slice(0,2).map(paper=><a href={`/journal/${paper.slug}/`} key={paper.slug}>{paper.title}<Arrow/></a>)}</nav></section>
      <section className={`${s.section} ${s.teamSection}`}>
        <ScrollFade root={page} as="section" className={s.teamPanel} id="project-team" aria-labelledby="project-team-title">
          <figure className={s.teamFigure}><svg className={s.teamFilter} width="0" height="0" aria-hidden="true" focusable="false"><defs><clipPath id="cfe-team-silhouette" clipPathUnits="objectBoundingBox"><path transform="scale(0.0010449321 0.0018691589)" d="M 89 242 C 87 229 89 210 93 199 C 99 180 115 174 128 174 C 148 175 161 186 168 201 C 173 212 172 230 172 243 L 174 246 L 170 263 L 164 286 L 169 295 C 183 299 216 304 230 314 C 237 322 239 332 242 344 L 258 332 L 253 314 C 249 306 247 288 251 276 L 256 269 C 254 247 257 228 266 217 C 283 198 309 193 331 201 C 353 207 364 225 368 246 L 368 266 L 365 288 C 362 311 351 336 340 350 C 356 359 393 374 405 383 C 415 390 416 404 417 422 L 423 535 L 0 535 L 0 504 L 4 482 C 2 470 2 461 7 451 L 11 438 L 15 427 L 19 416 L 20 405 L 26 394 L 30 378 L 36 359 C 42 341 45 329 53 319 L 96 303 L 104 294 L 101 281 L 95 265 L 91 256 Z"/></clipPath><filter id="cfe-team-background" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -8 0 8 0 1"/></filter></defs></svg><div className={s.teamPortrait}>
            <svg className={s.teamSketch} viewBox="0 0 444 375" fill="none" aria-hidden="true" focusable="false">
              <path className={s.teamSketchWash} d="M0 24H444V117L340 190L269 147H0Z"/>
              <g className={s.teamSketchLines}>
                <path d="M0 24H444V117L340 190L269 147H0"/>
                <path d="M0 29L439 27V114L340 184L271 143H0" opacity=".36"/>
                <path d="M9 15V36M0 24H21M424 24H444M434 14V35M434 107L444 117M334 180L346 198"/>
                <path d="M21 47H82M21 53H58M389 48H424M403 54H424" opacity=".4"/>
                <path d="M359 148L411 111M365 151L415 115M371 154L419 119" opacity=".3"/>
              </g>
              <circle cx="340" cy="190" r="3" className={s.teamSketchPoint}/>
            </svg>
            <img src={`${assets}cfe-team.webp`} alt="Paired CFE team portrait from the opening slide of the final Lab2Market presentation" width="957" height="535" loading="lazy" decoding="async"/></div><figcaption>CFE project team · Lab2Market</figcaption></figure>
          <div className={s.teamCopy}><p className={s.eyebrow}>RESEARCH &amp; COMMERCIALIZATION</p><h2 id="project-team-title">The people<br/><em>behind CFE.</em></h2><p>Materials research and customer discovery, brought together through Lab2Market.</p><dl className={s.teamRoles}><div><dt>Saeed Arabha</dt><dd>Entrepreneurial lead</dd></div><div><dt>Reza Rizvi</dt><dd>Research supervisor · Technical lead</dd></div></dl></div>
        </ScrollFade>
      </section>
      <section className={s.closing} id="connect"><p className={s.eyebrow}>LET’S FIND THE NEXT USEFUL STEP</p><h2>Research with<br/><em>a route to impact.</em></h2><p>Have a feedstock, an application, or a testing capability that could help move CFE forward?</p>
        <a className={s.primary} href="mailto:Arabha@Yorku.ca?subject=CFE%20pilot%20or%20collaboration">Discuss a pilot or collaboration <Arrow/></a>
      </section>
    </main>
  </div>;
}
