import ReferenceLink, { BackToText } from './ReferenceLink';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import SEO from '../../components/SEO/SEO';
import { metrologyArticle as article } from '../../data/metrologyArticle.mjs';
import useGrapheneReveals from './useGrapheneReveals';
import useSoftScroll from './useSoftScroll';
import { ScrollFade } from '../Commercialization/StoryMotion';
import { HeroDiagnosticRig, InstrumentSchematic } from './MetrologyVisuals';
import {
  ArticleText,
  CalibrationExplorer,
  EvidenceMatrix,
  FigureExplorer,
  FigureLightbox,
  preloadImage,
  RamanExplorer,
  SmoothDetails,
  ThesisFigure,
} from './MetrologyInteractive';
import shared from './GrapheneArticle.module.css';
import styles from './Metrology.module.css';

const labels = {
  'uv-vis': 'UV–Vis',
  tem: 'Electron microscopy',
  xps: 'XPS',
  raman: 'Raman',
  afm: 'AFM',
  sem: 'SEM',
};
const entranceProfile = {};
const stops = [...article.sections, { id: 'takeaways', number: '09', nav: 'What to take with you' }];
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
  { title: 'Start here', ids: ['why-measure', 'instrument-guide', 'concentration'] },
  { title: 'See the sheets', ids: ['see-the-sheets', 'afm-thickness', 'sem-morphology'] },
  { title: 'Read the evidence', ids: ['check-the-chemistry', 'read-the-vibrations', 'takeaways'] },
];

function StoryNavigation({ activeChapter, onNavigate }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const triggerRef = useRef(null);
  const activeIndex = storyStops.findIndex(stop => stop.id === activeChapter);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = event => {
      if (!navRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className={`${shared.contents} ${shared.storyNavigation}`}
      aria-label="In this story"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className={shared.storyRail}>
        <div
          className={shared.railWindow}
          style={{ height: (activeIndex === 0 || activeIndex === storyStops.length - 1 ? 2 : 3) * 72 }}
        >
          <motion.ol
            className={shared.railChapters}
            initial={false}
            animate={{ y: -Math.max(0, Math.min(storyStops.length - 2, activeIndex - 1)) * 72 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {storyStops.map((stop, index) => (
              <li
                key={stop.id}
                aria-hidden={Math.abs(index - activeIndex) > 1 || undefined}
                data-visited={index < activeIndex || undefined}
              >
                <a
                  href={`#${stop.id}`}
                  tabIndex={Math.abs(index - activeIndex) > 1 ? -1 : 0}
                  aria-current={stop.id === activeChapter ? 'location' : undefined}
                  onClick={event => {
                    event.preventDefault();
                    onNavigate(stop.id);
                  }}
                >
                  <span className={shared.railMarker} aria-hidden="true" />
                  <span className={shared.railNumber} aria-hidden="true">
                    {article.sections.find(section => section.id === stop.id)?.number}
                  </span>
                  <span className={shared.railLinkText}>{chapterTitles[stop.id]}</span>
                </a>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>

      <button
        ref={triggerRef}
        type="button"
        className={shared.storyTrigger}
        aria-expanded={open}
        aria-controls="metrology-story-chapters"
        onClick={() => setOpen(value => !value)}
      >
        <span className={shared.storyTriggerCopy}>
          <span className={shared.storyCurrent}>{chapterTitles[activeChapter]}</span>
        </span>
        <span className={shared.storyPosition}>
          {String(activeIndex + 1).padStart(2, '0')} / {storyStops.length}
        </span>
        <svg className={shared.storyChevron} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <div id="metrology-story-chapters" className={shared.storyPanel} hidden={!open}>
        <div className={shared.storyGroups}>
          {storyGroups.map(group => (
            <section key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              <ol>
                {group.ids.map(id => {
                  const stop = storyStops.find(item => item.id === id);
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        aria-current={id === activeChapter ? 'location' : undefined}
                        onClick={event => {
                          event.preventDefault();
                          onNavigate(id);
                          setOpen(false);
                          triggerRef.current?.focus({ preventScroll: true });
                        }}
                      >
                        <span className={shared.storyItemMarker} aria-hidden="true">
                          {stop?.label.match(/^\d+/)?.[0] || '09'}
                        </span>
                        <span>{chapterTitles[id]}</span>
                        {id === activeChapter && <span className={shared.storyActiveDot} aria-hidden="true" />}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </nav>
  );
}

function MethodOverview({ onNavigate }) {
  return (
    <div className={styles.methodOverview}>
      {article.instruments.map(item => {
        const section = article.sections.find(s => s.method === item.id);
        return (
          <a
            key={item.id}
            href={`#${section.id}`}
            onClick={event => {
              event.preventDefault();
              onNavigate(section.id);
            }}
          >
            <span className={shared.eyebrow}>{labels[item.id]}</span>
            <h3>{item.question}</h3>
            <span>Explore the method ↗</span>
          </a>
        );
      })}
    </div>
  );
}

function MethodExplanation({ item, onInspect }) {
  const [mode, setMode] = useState('schematic');
  const reduceMotion = useReducedMotion();
  const image = item.illustration;

  const inspectIllustration = () => {
    onInspect?.({
      src: image.src,
      dimensions: [image.width, image.height],
      eyebrow: `${item.name} · Conceptual device`,
      title: item.question,
      alt: image.alt,
      caption: image.caption,
      isPaperFigure: false,
    });
  };

  return (
    <div className={`${shared.learningDiagram} ${styles.methodDiagram}`}>
      <header className={styles.methodDiagramHeader}>
        <div>
          <span className={shared.eyebrow}>Picture the idea</span>
          <h3>{item.question}</h3>
        </div>
      </header>

      <div className={`${shared.learningIllustration} ${styles.methodLayout}`}>
        <div className={`${shared.learningVisual} ${styles.deviceIllustration}`}>
          <div className={styles.schematicToolbar}>
            <div className={styles.schematicTabs} role="group" aria-label={`${item.name} visual mode`}>
              <button
                type="button"
                aria-pressed={mode === 'schematic'}
                onClick={() => setMode('schematic')}
              >
                Schematic
              </button>
              <button
                type="button"
                aria-pressed={mode === 'instrument'}
                onMouseEnter={() => preloadImage(image.src)}
                onFocus={() => preloadImage(image.src)}
                onClick={() => setMode('instrument')}
              >
                3D instrument
              </button>
            </div>
            <button
              type="button"
              className={styles.inspectTriggerSmall}
              onClick={inspectIllustration}
              aria-label={`Inspect ${item.name} 3D illustration at full resolution`}
            >
              Inspect render ⤢
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'schematic' ? (
              <motion.div
                key="schematic"
                className={styles.schematicStage}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <InstrumentSchematic methodId={item.id} />
              </motion.div>
            ) : (
              <motion.figure
                key="instrument"
                className={styles.renderFigure}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  className={styles.renderSurfaceButton}
                  onClick={inspectIllustration}
                  aria-label={`Zoom ${item.name} 3D illustration`}
                >
                  <img
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </motion.figure>
            )}
          </AnimatePresence>

          <figcaption className={shared.compactFigureCaption}>
            <p>
              {mode === 'schematic'
                ? 'Simplified physical principle diagram'
                : 'Conceptual 3D benchtop instrument illustration'}
            </p>
            <SmoothDetails summary="Image details">
              <p>{image.caption}</p>
            </SmoothDetails>
          </figcaption>
        </div>

        <ol className={shared.imageExplanations}>
          {[
            ['Working principle', 'How it works', item.howItWorks],
            ['Measured signal', 'What you get', item.output],
            ['Blind spot alone', 'What it cannot tell us alone', item.limitation],
          ].map(([kicker, title, copy]) => (
            <li key={title}>
              <span className={shared.eyebrow}>{kicker}</span>
              <h4>{title}</h4>
              <p>
                <ArticleText text={copy} highlights={item.highlights} />
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className={shared.figureCredit}>
        Method references:{' '}
        {item.principleSources.map((index, position) => (
          <React.Fragment key={index}>
            {position > 0 && ' · '}
            <ReferenceLink number={index}>
              [{index}] {article.sources[index].title}
            </ReferenceLink>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function KnowledgeCheck({ onNavigate }) {
  const [answer, setAnswer] = useState(null);
  return (
    <section className={shared.quiz}>
      <div className={shared.quizIntro}>
        <span className={shared.eyebrow}>Pause &amp; think</span>
        <h2>
          A bottle of flakes in liquid looks darker.
          <br />
          What have we learned?
        </h2>
        <p>Choose the conclusion the observation can support.</p>
      </div>
      <div className={shared.quizInteraction}>
        <div className={shared.quizAnswers} role="group" aria-label="Choose an interpretation">
          {[
            'The flakes are definitely only one atomic layer thick.',
            'The way light passes through changed. We need more measurements to know why.',
            'The material has no defects.',
          ].map((option, idx) => (
            <button
              className={shared.quizAnswer}
              key={option}
              type="button"
              aria-pressed={answer === idx}
              onClick={() => setAnswer(idx)}
            >
              <span className={shared.quizAnswerIndex} aria-hidden="true">
                0{idx + 1}
              </span>
              <span>{option}</span>
              <span className={shared.quizAnswerMark} aria-hidden="true">
                {answer === idx ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>
        <div className={shared.quizResponse} data-answered={answer !== null}>
          <h3>
            {answer === null
              ? 'What do you think?'
              : answer === 1
                ? 'That is what the evidence supports.'
                : 'Look a little closer.'}
          </h3>
          <p aria-live="polite">
            {answer === null
              ? 'Choose an interpretation to test your understanding.'
              : answer === 1
                ? 'Yes. More solid, clumping or changes in light scattering can all affect the appearance. We need calibrated measurements and other tools to learn about thickness and quality.'
                : 'Appearance alone cannot tell us how many layers the sheets contain or whether they have defects. Start by measuring how much solid is in the liquid.'}
          </p>
        </div>
        <div className={shared.quizActions}>
          <button type="button" onClick={() => setAnswer(null)}>
            Try again
          </button>
          <a
            href="#takeaways"
            onClick={event => {
              event.preventDefault();
              onNavigate('takeaways');
            }}
          >
            Put the evidence together <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Metrology() {
  const pageRef = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(stops[0].id);
  const [lightboxItem, setLightboxItem] = useState(null);

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
      const current = [...stops]
        .reverse()
        .find(s => page.querySelector(`#${s.id}`)?.getBoundingClientRect().top <= 210);
      setActive(current?.id || stops[0].id);
      const chapterIndex = stops.findIndex(s => s.id === (current?.id || stops[0].id));
      const progress = stops.length > 1 ? Math.max(0, chapterIndex) / (stops.length - 1) : 0;
      page.style.setProperty('--rail-progress', progress.toFixed(4));
      page.style.setProperty(
        '--reading-progress',
        `${page.scrollTop / Math.max(1, page.scrollHeight - page.clientHeight)}`
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const align = () => {
      const id = window.location.hash.slice(1);
      if (stops.some(s => s.id === id)) {
        page.querySelector(`#${id}`)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    };
    const initial = requestAnimationFrame(() => {
      align();
      update();
    });
    page.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', align);
    return () => {
      page.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', align);
      cancelAnimationFrame(initial);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={pageRef} className={`${shared.page} ${styles.page}`} data-site-motion-ignore="true">
      <SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" />
      <a
        href="#why-measure"
        className={styles.skip}
        onClick={e => {
          e.preventDefault();
          navigate('why-measure', true);
        }}
      >
        Skip to article
      </a>

      <main className={shared.main}>
        <header className={shared.hero}>
          <div className={shared.heroIdentity}>
            <span className={shared.ghostWord} data-page-entrance="atmosphere" aria-hidden="true">
              Evidence.
            </span>
            <span className={shared.eyebrow} data-page-entrance="eyebrow">
              Characterization of 2D materials
            </span>
            <h1>
              <span className={shared.heroPrefix} data-page-entrance="prefix">
                Meet
              </span>{' '}
              <em data-page-entrance="title">Metrology.</em>
            </h1>
            <p className={shared.heroKicker} data-page-entrance="kicker">
              Six tools. One picture of the material.
            </p>
          </div>

          <ol className={shared.heroJourney} aria-label="The learning journey">
            {['why this method?', 'how does it work?', 'what do results show?'].map((s, i) => (
              <li key={s} data-page-entrance="journey" data-entrance-order={i}>
                <span aria-hidden="true">{['• · ·', '• • ·', '• • •'][i]}</span>
                {s}
              </li>
            ))}
          </ol>

          <div className={shared.heroIntro}>
            <h2 data-page-entrance="intro">
              <span aria-hidden="true">◆</span>How do we characterize 2D materials?
            </h2>
            <p data-page-entrance="intro">
              Making thin sheets is only the beginning. How much did we collect? How thin are they? Did their structure survive? Explore{' '}
              <a
                href="#instrument-guide"
                onClick={e => {
                  e.preventDefault();
                  navigate('instrument-guide');
                }}
              >
                six ways to find out
              </a>
              : what each instrument does, how it works and what we can learn from it. See my{' '}
              <a
                href="#see-the-sheets"
                onClick={e => {
                  e.preventDefault();
                  navigate('see-the-sheets');
                }}
              >
                microscopy
              </a>
              ,{' '}
              <a
                href="#check-the-chemistry"
                onClick={e => {
                  e.preventDefault();
                  navigate('check-the-chemistry');
                }}
              >
                XPS
              </a>
              ,{' '}
              <a
                href="#read-the-vibrations"
                onClick={e => {
                  e.preventDefault();
                  navigate('read-the-vibrations');
                }}
              >
                Raman
              </a>{' '}
              and{' '}
              <a
                href="#concentration"
                onClick={e => {
                  e.preventDefault();
                  navigate('concentration');
                }}
              >
                UV–Vis results
              </a>{' '}
              alongside the explanations.
            </p>
            <div className={shared.heroActions} data-page-entrance="actions">
              <a
                href="#instrument-guide"
                onClick={e => {
                  e.preventDefault();
                  navigate('instrument-guide');
                }}
              >
                Choose a method <span aria-hidden="true">↗</span>
              </a>
              <a
                href="#why-measure"
                onClick={e => {
                  e.preventDefault();
                  navigate('why-measure');
                }}
              >
                Start with the questions <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={shared.readingGuide} data-page-entrance="guide">
              The question → How it works → What my results show
            </p>
          </div>

          <HeroDiagnosticRig activeChapterId={active} onNavigate={id => navigate(id, true)} />
        </header>

        <StoryNavigation activeChapter={active} onNavigate={id => navigate(id, true)} />

        <article aria-label={article.title}>
          {article.sections.map(section => (
            <section key={section.id} id={section.id} className={shared.chapter}>
              <ScrollFade root={pageRef} className={shared.chapterHeading}>
                <span className={shared.chapterNumber} aria-hidden="true">
                  {section.number}
                </span>
                <span className={shared.eyebrow}>
                  Chapter {section.number} / {section.nav}
                </span>
                <h2 tabIndex="-1">
                  {section.method ? (
                    <>
                      <span className={shared.headingAccent}>{section.nav}</span>
                      <br />
                      {article.instruments.find(i => i.id === section.method).question}
                    </>
                  ) : section.id === 'instrument-guide' ? (
                    <>
                      One sample.
                      <br />
                      <span className={shared.headingAccent}>Six questions.</span>
                    </>
                  ) : (
                    <>
                      What do we need to know about a{' '}
                      <span className={shared.headingAccent}>2D material?</span>
                    </>
                  )}
                </h2>
              </ScrollFade>

              <div className={shared.prose}>
                {section.method && <span className={shared.eyebrow}>Why use this method?</span>}
                {section.paragraphs.map((p, i) => (
                  <ScrollFade root={pageRef} as="p" key={p} stagger={i}>
                    <ArticleText text={p} highlights={section.highlights} />
                    {i === section.paragraphs.length - 1 && section.source !== 0 && (
                      <>
                        {' '}
                        <ReferenceLink
                          number={section.source}
                          className={shared.citation}
                          aria-label={`Reference ${section.source}: ${article.sources[section.source].title}`}
                        />
                      </>
                    )}
                  </ScrollFade>
                ))}
              </div>

              {section.id === 'instrument-guide' && (
                <MethodOverview onNavigate={id => navigate(id, true)} />
              )}

              {section.method && (
                <MethodExplanation
                  item={article.instruments.find(i => i.id === section.method)}
                  onInspect={setLightboxItem}
                />
              )}

              {section.method &&
                (section.resultParagraphs.length > 0 ? (
                  <div className={styles.methodEvidence}>
                    <header>
                      <span className={shared.eyebrow}>My thesis results / {section.nav}</span>
                      <h3>What did this method show in my research?</h3>
                    </header>
                    {section.resultParagraphs.map(p => (
                      <p key={p}>
                        <ArticleText text={p} highlights={section.highlights} />
                      </p>
                    ))}
                  </div>
                ) : (
                  <aside className={styles.spatialCheckCard}>
                    <span className={shared.eyebrow}>
                      {section.roleBadge || 'Complementary spatial check'}
                    </span>
                    <h3>
                      {section.method === 'afm'
                        ? 'Where step-height checks fit in'
                        : 'Where wide-area imaging fits in'}
                    </h3>
                    <p>
                      <ArticleText text={section.spatialNote} highlights={section.highlights} />
                    </p>
                  </aside>
                ))}

              {section.technicalDetails?.length > 0 && (
                <SmoothDetails
                  className={styles.scientificDetails}
                  summary="Go deeper: measurements and scientific details"
                >
                  {section.technicalDetails.map(p => (
                    <p key={p}>
                      <ArticleText text={p} highlights={section.highlights} />
                    </p>
                  ))}
                </SmoothDetails>
              )}

              {section.id === 'concentration' && (
                <CalibrationExplorer article={article} onInspect={setLightboxItem} />
              )}

              {section.id === 'see-the-sheets' && (
                <FigureExplorer
                  kind="microscopy"
                  figureSets={figureSets}
                  note="These images show selected flakes and local crystalline regions. They do not establish a population-wide size distribution or exact layer count."
                  onInspect={setLightboxItem}
                />
              )}

              {section.id === 'check-the-chemistry' && (
                <div className={styles.fullWidth}>
                  <ThesisFigure
                    name="mos2-xps"
                    title="The chemical fingerprint remains."
                    number="7.13"
                    reading="Compare the main pair of peaks before and after processing. They still indicate bonding between molybdenum and sulfur, alongside smaller signals from other chemical environments."
                    onInspect={setLightboxItem}
                  />
                </div>
              )}

              {section.id === 'read-the-vibrations' && (
                <>
                  <RamanExplorer result={article.results[0]} />
                  <FigureExplorer kind="raman" figureSets={figureSets} onInspect={setLightboxItem} />
                </>
              )}

              {section.handoff && (
                <div className={shared.storyHandoff}>
                  <a
                    href={`#${section.handoff.to}`}
                    onClick={e => {
                      e.preventDefault();
                      navigate(section.handoff.to, true);
                    }}
                  >
                    <span className={shared.handoffLabel}>Next · {chapterTitles[section.handoff.to]}</span>
                    <span className={shared.handoffPrompt}>
                      <span>{section.handoff.text}</span>
                      <svg
                        className={shared.handoffArrow}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 4v15m-6-6 6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
              )}
            </section>
          ))}
        </article>

        <KnowledgeCheck onNavigate={id => navigate(id, true)} />

        <section id="takeaways" className={shared.recap}>
          <span className={shared.eyebrow}>The journey / What to take with you</span>
          <h2 tabIndex="-1">Put the evidence together.</h2>
          <p>
            <ArticleText text={article.conclusion} highlights={article.conclusionHighlights} />
          </p>

          <EvidenceMatrix
            matrix={article.evidenceMatrix}
            onNavigate={id => navigate(id, true)}
          />

          <ol>
            {article.takeaways.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ol>

          <div className={styles.related}>
            <Link to="/Graphene">Meet graphene ↗</Link>
            <Link to="/simulate-atoms">Explore atomistic simulation ↗</Link>
            <Link to="/journal/">Read my research ↗</Link>
          </div>
        </section>

        <section className={shared.sources} aria-labelledby="metrology-sources">
          <h2 id="metrology-sources">Sources &amp; further reading</h2>
          <ol>
            {article.sources.map((s, i) =>
              i === 0 ? null : (
                <li id={`reference-${i}`} tabIndex={-1} value={i} key={s.title}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.title} ↗
                    </a>
                  ) : (
                    <>
                      <cite>{s.title}</cite>
                      <p>{s.detail}</p>
                    </>
                  )}{' '}
                  <BackToText number={i} />
                </li>
              )
            )}
          </ol>
        </section>
      </main>

      <AnimatePresence>
        {lightboxItem && (
          <FigureLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
