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
import WaterShellExplorer from './WaterShellExplorer';
import AtomicForceExplorer from './AtomicForceExplorer';
import AtomsStoryNavigation from './AtomsStoryNavigation';
import useSoftScroll from './useSoftScroll';
import { AtomisticIllustration, SimulationWorkflow } from './AtomisticFigures';
import {
  ArticleText,
  FigureLightbox,
  HeroScaleCard,
  MlipLoopDiagram,
  PublishedStudyCardFigure,
  SmoothDetails,
} from './AtomisticUi';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';

const chapters = [
  ...article.sections,
  { id: 'water-research', number: '05', nav: 'Heat from silver into water' },
  { id: 'simulation-papers', number: '06', nav: 'Sheets & interfaces' },
  { id: 'simulation-software', number: '07', nav: 'The computational toolbox' },
  { id: 'simulation-details', number: '08', nav: 'A closer look' },
];

const headings = {
  'what-is-atomistic': (
    <>
      From one molecule
      <br />
      <span className={styles.headingAccent}>to a drop of water.</span>
    </>
  ),
  'why-simulate': (
    <>
      A useful explanation starts
      <br />
      <span className={styles.headingAccent}>with a fair comparison.</span>
    </>
  ),
  'how-it-works': (
    <>
      Energy gives us forces.
      <br />
      <span className={styles.headingAccent}>Forces give us motion.</span>
    </>
  ),
  'where-it-helps': (
    <>
      The atoms moved.
      <br />
      <span className={styles.headingAccent}>What did we measure?</span>
    </>
  ),
};

const DETAIL_GROUPS = [
  { id: 'all', label: 'All topics' },
  { id: 'setup', label: 'Setup & time steps' },
  { id: 'potentials', label: 'Models & water sites' },
  { id: 'sampling', label: 'Sampling & limits' },
];

function Source({ index }) {
  return (
    <ReferenceLink
      number={index + 1}
      className={styles.citation}
      aria-label={`Reference ${index + 1}: ${article.sources[index].label}`}
    />
  );
}

function WaterResearch({ onInspect, navigate }) {
  const { title, intro, result, check, slug, url, figure, metrics, highlights } = article.waterStudy;

  const handleHandoff = event => {
    event.preventDefault();
    navigate('simulation-papers', true);
  };

  return (
    <section id="water-research" className={styles.researchCarousel} aria-labelledby="water-research-title">
      <header className={styles.researchCarouselHeader}>
        <div>
          <span className={styles.eyebrow}>Chapter 05 / Heat from silver into water</span>
          <h2 id="water-research-title">{title}</h2>
        </div>
      </header>

      <WaterShellExplorer />

      {metrics?.length > 0 && (
        <dl className={s.studyMetrics} aria-label="Key quantitative findings from the silver–water shell study">
          {metrics.map(item => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
              <span>{item.detail}</span>
            </div>
          ))}
        </dl>
      )}

      <div className={`${styles.researchSlide} ${s.researchSlide}`}>
        <div className={styles.researchSlideCopy}>
          <p>
            <ArticleText text={intro} highlights={highlights} />
          </p>
          <p>
            <ArticleText text={result} highlights={highlights} />
          </p>
          <SmoothDetails className={s.researchDetails} summary="How did we check the explanation?">
            <p>{check}</p>
          </SmoothDetails>
          <div className={styles.researchLinks}>
            <Link to={`/journal/${slug}/`}>Explore the study ↗</Link>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Original paper ↗
            </a>
          </div>
        </div>

        <PublishedStudyCardFigure figure={figure} title={title} onInspect={onInspect} />
      </div>

      <div className={styles.storyHandoff}>
        <a href="#simulation-papers" onClick={handleHandoff}>
          <span>How do atomic forces also govern 2D sheets and interfaces?</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

function ResearchCarousel({ active, setActive, onInspect }) {
  const reduceMotion = useReducedMotion();
  const item = article.research[active];
  const move = direction => setActive(index => (index + direction + article.research.length) % article.research.length);

  return (
    <section
      id="simulation-papers"
      className={styles.researchCarousel}
      aria-labelledby="atoms-research-title"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }}
    >
      <header className={styles.researchCarouselHeader} data-graphene-reveal="0">
        <div>
          <span className={styles.eyebrow}>Chapter 06 / From water to 2D sheets &amp; interfaces</span>
          <h2 id="atoms-research-title">
            What can the same method
            <br />
            <span className={styles.headingAccent}>tell us about sheets and interfaces?</span>
          </h2>
        </div>
        <div className={styles.researchControls}>
          <button type="button" aria-label="Previous atomistic study" onClick={() => move(-1)}>
            ←
          </button>
          <span aria-live="polite" aria-atomic="true">
            {String(active + 1).padStart(2, '0')} / {String(article.research.length).padStart(2, '0')}
          </span>
          <button type="button" aria-label="Next atomistic study" onClick={() => move(1)}>
            →
          </button>
        </div>
      </header>

      <div className={s.grapheneTransition}>
        <figure>
          <img
            src="/images/atoms/graphene-wrinkles.webp"
            width="1000"
            height="667"
            alt="A carbon honeycomb sheet bending into gentle wrinkles."
            loading="lazy"
            decoding="async"
          />
          <figcaption>Conceptual illustration of a wrinkled graphene sheet.</figcaption>
        </figure>
        <p className={s.intro}>{article.grapheneBridge}</p>
      </div>

      <div className={s.studySelector} role="group" aria-label="Choose an atomistic study">
        {article.research.map((study, index) => (
          <button key={study.slug} type="button" aria-pressed={index === active} onClick={() => setActive(index)}>
            <span>0{index + 1}</span>
            {study.tabLabel || study.title}
          </button>
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={item.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          className={`${styles.researchSlide} ${s.researchSlide}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${active + 1} of ${article.research.length}: ${item.title}`}
        >
          <div className={styles.researchSlideCopy}>
            <p className={s.researchConnection}>
              <strong>Connection to the story</strong>
              {item.connection}
            </p>
            <p className={styles.researchMeta}>{item.category}</p>
            <h3>
              <span className={styles.headingAccent}>{item.title}</span>
            </h3>

            {item.metrics?.length > 0 && (
              <dl className={s.slideMetrics} aria-label="Quantitative findings">
                {item.metrics.map(metric => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                    <span>{metric.detail}</span>
                  </div>
                ))}
              </dl>
            )}

            <p>{item.problem}</p>
            <p>
              <ArticleText text={item.text} highlights={item.highlights} />
            </p>
            <SmoothDetails className={s.researchDetails} summary="What can this result inform?">
              <p>{item.implication}</p>
            </SmoothDetails>
            <p className={styles.researchPaperTitle}>{item.paperTitle}</p>
            <div className={styles.researchLinks}>
              <Link to={`/journal/${item.slug}/`}>Explore the study and its limitations ↗</Link>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Original paper ↗
              </a>
              {item.relatedRoute && <Link to={item.relatedRoute.to}>{item.relatedRoute.label}</Link>}
            </div>
          </div>

          <PublishedStudyCardFigure
            figure={item.figure}
            structureFigure={item.structureFigure}
            customDiagram={
              active === 2
                ? ({ onInspectOriginal }) => <MlipLoopDiagram onInspectOriginal={onInspectOriginal} />
                : undefined
            }
            title={item.title}
            onInspect={onInspect}
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function SoftwareGuide() {
  return (
    <section id="simulation-software" className={s.tools} aria-labelledby="atoms-software-title">
      <header>
        <span className={styles.eyebrow}>Chapter 07 / The computational toolbox</span>
        <h2 id="atoms-software-title">
          A different tool
          <br />
          <span className={styles.headingAccent}>for each part of the job.</span>
        </h2>
        <p className={s.intro}>
          Once you have a question and a measurement in mind, choose the tools to prepare the structure, calculate its behaviour, and analyse the result.
        </p>
        <p className={s.sectionNote}>A guide to the field; individual studies use their own methods and software.</p>
      </header>

      <div className={s.toolList}>
        {article.software.map((tool, index) => (
          <article key={tool.name} className={s.tool} data-graphene-reveal={index % 2}>
            <div className={s.toolBrand}>
              <div className={s.toolBrandCard}>
                {tool.logo ? (
                  <img src={tool.logo} alt={`${tool.name} logo`} width="160" height="80" loading="lazy" decoding="async" />
                ) : (
                  <span className={s.wavefunction} role="img" aria-label="Wavefunction symbol for electronic structure">
                    Ψ
                  </span>
                )}
              </div>
              <span className={s.toolIndex}>{tool.stageTag || `0${index + 1}`}</span>
            </div>
            <div>
              <span className={styles.eyebrow}>{tool.role}</span>
              <h3>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  {tool.name} <span aria-hidden="true">↗</span>
                </a>
              </h3>
              <p>{tool.text}</p>
              <SmoothDetails summary="What to know">
                <p>{tool.detail}</p>
              </SmoothDetails>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Atoms() {
  const [system, setSystem] = useState('water');
  const [researchIndex, setResearchIndex] = useState(0);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [detailGroup, setDetailGroup] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);

  const pageRef = useRef(null);
  useGrapheneReveals(pageRef);
  useSoftScroll(pageRef);
  const reduced = useReducedMotion();

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    let frame;

    const update = () => {
      frame = null;
      const threshold = page.getBoundingClientRect().top + 175;
      const current = [...chapters]
        .reverse()
        .find(chapter => document.getElementById(chapter.id)?.getBoundingClientRect().top <= threshold);
      const currentId = current?.id || chapters[0].id;
      setActiveChapter(currentId);
      const index = Math.max(
        0,
        chapters.findIndex(chapter => chapter.id === currentId)
      );
      const railProgress = chapters.length > 1 ? index / (chapters.length - 1) : 0;
      page.style.setProperty('--rail-progress', railProgress.toFixed(4));
      const distance = page.scrollHeight - page.clientHeight;
      page.style.setProperty('--reading-progress', String(distance > 0 ? Math.max(0, Math.min(1, page.scrollTop / distance)) : 0));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    page.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(onScroll);
    const main = page.querySelector('main');
    if (main) observer.observe(main);

    const hashTarget = document.getElementById(window.location.hash.slice(1));
    if (hashTarget && page.contains(hashTarget)) hashTarget.scrollIntoView({ behavior: 'instant' });
    update();

    return () => {
      page.removeEventListener('scroll', onScroll);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  function navigate(id, focus = false) {
    const target = pageRef.current?.querySelector(`#${id}`);
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
    window.history.replaceState(window.history.state, '', `#${id}`);
    setActiveChapter(id);
    if (focus) target.querySelector('h2')?.focus({ preventScroll: true });
  }

  const showWaterGeometry = detailGroup === 'all' || detailGroup === 'potentials';
  const filteredTechnical =
    detailGroup === 'all'
      ? article.technicalSections
      : article.technicalSections.filter(item => item.group === detailGroup);

  const inspectExampleDiagram = diagram => {
    setLightboxItem({
      src: diagram.src,
      dimensions: [960, 540],
      eyebrow: 'Water model geometry',
      title: diagram.title,
      alt: diagram.alt,
      caption: diagram.caption,
      isPaperFigure: false,
    });
  };

  return (
    <div ref={pageRef} className={`${styles.page} ${s.page}`} data-site-motion-ignore="true">
      <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
      <a
        href="#atoms-explorer"
        className={s.skip}
        onClick={event => {
          event.preventDefault();
          navigate('atoms-explorer', true);
        }}
      >
        Skip to live explorer
      </a>

      <main className={`${styles.main} ${s.main}`}>
        <header id="atoms-opening" className={s.hero} aria-labelledby="atoms-opening-title">
          <div className={s.heroCopy}>
            <div className={s.heroIdentity}>
              <span className={styles.ghostWord} aria-hidden="true">
                ATOMS
              </span>
              <span className={styles.eyebrow}>A closer look at materials</span>
              <h1 id="atoms-opening-title">
                <span className={styles.heroPrefix}>Matter,</span>
                <em>atom by atom.</em>
              </h1>
              <p className={s.heroKicker}>From a drop of water to 2D sheets &amp; interfaces</p>
            </div>
            <div className={s.heroIntro}>
              <h2>What’s moving inside a drop of water?</h2>
              <p>{article.intro}</p>
              <div className={s.heroActions}>
                <a
                  href="#atoms-explorer"
                  onClick={event => {
                    event.preventDefault();
                    setSystem('water');
                    navigate('atoms-explorer');
                  }}
                >
                  Explore water in motion <span aria-hidden="true">↓</span>
                </a>
                <a
                  href="#water-research"
                  onClick={event => {
                    event.preventDefault();
                    navigate('water-research');
                  }}
                >
                  See published research <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </div>

          <HeroScaleCard
            data={article.heroScaleBridge}
            onExploreLab={() => {
              setSystem('water');
              navigate('atoms-explorer');
            }}
            onInspect={setLightboxItem}
          />
        </header>

        <AtomisticExplorer system={system} setSystem={setSystem} onResearch={setResearchIndex} navigate={navigate} />

        <AtomsStoryNavigation
          chapters={chapters}
          active={activeChapter}
          navigate={navigate}
          groupTitles={['Understand the model', 'Follow the research', 'Keep exploring']}
        />

        <article>
          {chapters.slice(0, 4).map((section, idx) => {
            const nextChapter = chapters[idx + 1];
            const handoffLabel = {
              'what-is-atomistic': 'How do we make a comparison we can trust?',
              'why-simulate': 'Where do the forces come from?',
              'how-it-works': 'How do we read the trajectory?',
              'where-it-helps': 'What does this look like in published research?',
            }[section.id];

            return (
              <section
                id={section.id}
                key={section.id}
                className={`${styles.chapter} ${s.chapter}`}
                data-chapter-id={section.id}
                aria-labelledby={`${section.id}-title`}
              >
                <ScrollFade root={pageRef} className={styles.chapterHeading}>
                  <span className={styles.chapterNumber} aria-hidden="true">
                    {section.number}
                  </span>
                  <span className={styles.eyebrow}>
                    Chapter {section.number} / {section.nav}
                  </span>
                  <h2 id={`${section.id}-title`}>{headings[section.id]}</h2>
                </ScrollFade>

                <div className={styles.prose}>
                  {section.paragraphs.map((paragraph, index) => (
                    <ScrollFade root={pageRef} as="p" stagger={index} key={paragraph}>
                      <ArticleText text={paragraph} highlights={section.highlights} />
                      {index === section.paragraphs.length - 1 && (
                        <>
                          {' '}
                          <Source index={section.source} />
                        </>
                      )}
                    </ScrollFade>
                  ))}
                </div>

                <AtomisticIllustration chapter={section.id} onInspect={setLightboxItem} />

                {section.id === 'how-it-works' && (
                  <>
                    <AtomicForceExplorer />
                    <SimulationWorkflow />
                  </>
                )}

                {section.id === 'where-it-helps' && (
                  <div className={s.scaleBridge}>
                    <span className={styles.eyebrow}>Connecting the scales</span>
                    <div>
                      <p>
                        Atomic interactions<span>Structure, forces, motion</span>
                      </p>
                      <span aria-hidden="true">→</span>
                      <p>
                        Material properties<span>Transport, stress, interfaces</span>
                      </p>
                      <span aria-hidden="true">→</span>
                      <p>
                        Engineering models<span>Response at a larger scale</span>
                      </p>
                    </div>
                    <p className={s.sectionNote}>
                      Each step needs validation. The useful link may be a mechanism or a measured property, rather than every atomic coordinate.
                    </p>
                  </div>
                )}

                {nextChapter && (
                  <div className={styles.storyHandoff}>
                    <a
                      href={`#${nextChapter.id}`}
                      onClick={event => {
                        event.preventDefault();
                        navigate(nextChapter.id, true);
                      }}
                    >
                      <span>{handoffLabel}</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                )}
              </section>
            );
          })}
        </article>

        <WaterResearch onInspect={setLightboxItem} navigate={navigate} />
        <ResearchCarousel active={researchIndex} setActive={setResearchIndex} onInspect={setLightboxItem} />

        <SoftwareGuide />

        <section id="simulation-details" className={s.deeper} aria-labelledby="atoms-details-title">
          <header>
            <span className={styles.eyebrow}>Chapter 08 / A closer look</span>
            <h2 id="atoms-details-title">
              Before trusting
              <br />
              <span className={styles.headingAccent}>the answer.</span>
            </h2>
            <p className={s.intro}>Filter by topic and open a note to follow the physics behind the calculations.</p>
            <div className={s.detailCategoryBar} role="group" aria-label="Filter physics notes by topic">
              {DETAIL_GROUPS.map(group => {
                const count =
                  group.id === 'all'
                    ? article.technicalSections.length + 1
                    : article.technicalSections.filter(item => item.group === group.id).length + (group.id === 'potentials' ? 1 : 0);
                return (
                  <button
                    key={group.id}
                    type="button"
                    aria-pressed={detailGroup === group.id}
                    onClick={() => setDetailGroup(group.id)}
                  >
                    {group.label} ({count})
                  </button>
                );
              })}
            </div>
          </header>

          <div className={s.detailList}>
            {filteredTechnical.map(item => (
              <SmoothDetails key={item.id} id={item.id} summary={item.title}>
                <div>
                  {item.paragraphs.map(paragraph => (
                    <p key={paragraph}>
                      <ArticleText text={paragraph} highlights={item.highlights} />
                    </p>
                  ))}
                  <Source index={item.source} />
                </div>
              </SmoothDetails>
            ))}

            {showWaterGeometry && (
              <SmoothDetails id="water-geometry-details" summary="Water geometry, charge sites, and bonding">
                <div className={s.waterFigures}>
                  {article.exampleDiagrams.map(diagram => (
                    <figure key={diagram.src}>
                      <button
                        type="button"
                        className={s.illustrationButton}
                        onClick={() => inspectExampleDiagram(diagram)}
                        aria-label={`Inspect diagram: ${diagram.title}`}
                      >
                        <img src={diagram.src} width="960" height="540" alt={diagram.alt} loading="lazy" />
                      </button>
                      <figcaption>
                        <h3>{diagram.title}</h3>
                        <p>
                          {diagram.caption} <Source index={diagram.source} />
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </SmoothDetails>
            )}
          </div>
        </section>

        <AtomisticThoughtExperiment
          onTryInLab={targetSystem => {
            setSystem(targetSystem || 'water');
            navigate('atoms-explorer');
          }}
        />

        <section className={styles.recap} data-graphene-reveal="0">
          <span className={styles.eyebrow}>Return to the opening question</span>
          <h2>
            From moving molecules
            <br />
            <span className={styles.headingAccent}>to measurable results.</span>
          </h2>
          <ol>
            {article.takeaways.map(text => (
              <li key={text}>{text}</li>
            ))}
          </ol>
          <a
            href="#atoms-explorer"
            onClick={event => {
              event.preventDefault();
              setSystem('water');
              navigate('atoms-explorer');
            }}
          >
            Explore water again ↑
          </a>
        </section>

        <section className={styles.faq}>
          <span className={styles.eyebrow}>Questions worth asking</span>
          <h2>Common questions about atomic simulation</h2>
          {article.faq.map(item => (
            <SmoothDetails key={item.question} summary={item.question}>
              <p>{item.answer}</p>
            </SmoothDetails>
          ))}
        </section>

        <section className={styles.closing}>
          <span className={styles.eyebrow}>From a model to a material</span>
          <h2>
            Meet a material.
            <br />
            <span className={styles.headingAccent}>Follow the evidence.</span>
          </h2>
          <p>
            See how atomic structure shapes graphene’s properties, compare nanoparticles in heat-transfer fluids, or inspect how microscopy and spectroscopy test what we have made.
          </p>
          <div>
            <Link to="/Graphene">Explore graphene ↗</Link>
            <Link to="/nanofluids">Explore nanofluids ↗</Link>
            <Link to="/metrology">Explore metrology ↗</Link>
            <Link to="/journal/">Read the journal ↗</Link>
          </div>
        </section>

        <section className={styles.sources}>
          <h2>Sources &amp; further reading</h2>
          <ol>
            {article.sources.map((source, index) => (
              <li id={`reference-${index + 1}`} tabIndex={-1} key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label} ↗
                </a>{' '}
                <BackToText number={index + 1} />
              </li>
            ))}
          </ol>
        </section>
      </main>

      <AnimatePresence>
        {lightboxItem && <FigureLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
