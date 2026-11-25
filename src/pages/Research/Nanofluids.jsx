import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArticleText,
  ElectrostaticsRace,
  FigureLightbox,
  OpeningFigure,
  PublishedFigure,
  ShellExplorer,
  ShellQuestion,
  SurfaceExplorer,
  ThermalPulseExplorer,
  ThreeStudySynthesis,
  ViscosityContrastCard,
} from './NanofluidExperiments';
import StoryNavigation from './AtomsStoryNavigation';
import { ScrollFade } from '../Commercialization/StoryMotion';
import SEO from '../../components/SEO/SEO';
import { nanofluidsArticle as article } from '../../data/nanofluidsArticle.mjs';
import useGrapheneReveals from './useGrapheneReveals';
import useSoftScroll from './useSoftScroll';
import styles from './GrapheneArticle.module.css';
import layout from './Nanofluids.module.css';

const sectionChapters = article.sections.map((section, index) => ({
  ...section,
  number: String(index + 1).padStart(2, '0'),
}));

const chapters = [
  ...sectionChapters,
  { id: 'synthesis', number: '08', nav: 'Put it together' },
];

const chapterTitles = Object.fromEntries(chapters.map(c => [c.id, c.nav]));

export default function Nanofluids() {
  const page = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(chapters[0].id);
  const [lightboxItem, setLightboxItem] = useState(null);

  useGrapheneReveals(page, true);
  useSoftScroll(page);

  function navigate(id, focus = false) {
    const target = page.current?.querySelector(`#${id}`);
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
    window.history.replaceState(window.history.state, '', `#${id}`);
    if (focus) target.querySelector('h2')?.focus({ preventScroll: true });
  }

  useEffect(() => {
    const root = page.current;
    if (!root) return undefined;
    const nodes = chapters.map(ch => root.querySelector(`#${ch.id}`));
    let frame;

    const update = () => {
      frame = null;
      const index = Math.max(
        0,
        nodes.findLastIndex(node => node && node.getBoundingClientRect().top <= 210)
      );
      setActive(chapters[index].id);
      const progress = chapters.length > 1 ? index / (chapters.length - 1) : 0;
      root.style.setProperty('--rail-progress', progress.toFixed(4));
      root.style.setProperty(
        '--reading-progress',
        String(root.scrollTop / Math.max(1, root.scrollHeight - root.clientHeight))
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const alignHash = () => {
      const id = window.location.hash.slice(1);
      if (id) root.querySelector(`#${id}`)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    };

    const initialFrame = requestAnimationFrame(() => {
      alignHash();
      update();
    });

    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', alignHash);
    return () => {
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', alignHash);
      cancelAnimationFrame(initialFrame);
      cancelAnimationFrame(frame);
    };
  }, []);

  const inspectHeroSetup = () => {
    setLightboxItem({
      src: article.solarImage.src,
      dimensions: [article.solarImage.width, article.solarImage.height],
      eyebrow: 'Conceptual setup · Direct absorption solar collector',
      title: 'How light meets suspended particles',
      alt: article.solarImage.alt,
      caption: article.solarImage.caption,
      isPaperFigure: false,
    });
  };

  return (
    <div className={`${styles.page} ${layout.page}`} ref={page} data-site-motion-ignore="true">
      <SEO title={`${article.title} | Saeed Arabha`} description={article.intro} type="article" />
      <a
        href="#suspension"
        className={layout.skip}
        onClick={e => {
          e.preventDefault();
          navigate('suspension', true);
        }}
      >
        Skip to article
      </a>

      <main className={styles.main}>
        <article aria-label={article.title}>
          <header className={`${styles.hero} ${layout.opening}`}>
            <div className={styles.heroIdentity}>
              <span className={styles.ghostWord} data-page-entrance="atmosphere" aria-hidden="true">
                Water.
              </span>
              <span className={styles.eyebrow} data-page-entrance="eyebrow">
                A closer look at materials
              </span>
              <h1>
                <span className={styles.heroPrefix} data-page-entrance="prefix">
                  Meet
                </span>{' '}
                <em data-page-entrance="title">Nanofluids.</em>
              </h1>
              <p className={styles.heroKicker}>Silver, titanium dioxide and the water at their surfaces</p>
            </div>

            <div className={styles.heroIntro}>
              <h2>
                <span aria-hidden="true">◆</span> How can water collect more sunlight?
              </h2>
              <p>{article.intro}</p>
              <div className={styles.heroActions}>
                <a
                  href="#suspension"
                  onClick={e => {
                    e.preventDefault();
                    navigate('suspension', true);
                  }}
                >
                  Start with one particle <span aria-hidden="true">↓</span>
                </a>
                <a
                  href="#synthesis"
                  onClick={e => {
                    e.preventDefault();
                    navigate('synthesis', true);
                  }}
                >
                  Three-study summary <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <figure className={`${styles.researchSlideFigure} ${layout.interfaceFigure} ${layout.heroFigureCard}`}>
              <button
                type="button"
                className={layout.heroImageButton}
                onClick={inspectHeroSetup}
                aria-label="Inspect solar absorption collector illustration"
              >
                <img
                  src={article.solarImage.src}
                  alt={article.solarImage.alt}
                  width={article.solarImage.width}
                  height={article.solarImage.height}
                  fetchPriority="high"
                />
                <span className={styles.imageHint} aria-hidden="true">
                  Inspect setup ⤢
                </span>
              </button>
              <figcaption>{article.solarImage.caption}</figcaption>
            </figure>
          </header>

          <StoryNavigation
            chapters={chapters}
            active={active}
            navigate={id => navigate(id, true)}
            groupTitles={['Meet the suspension', 'Study silver in water', 'Compare the interface']}
          />

          {sectionChapters.map(
            ({
              id,
              nav,
              title,
              paragraphs,
              highlights,
              link,
              journalLink,
              handoff,
              figure,
              illustration,
              mechanism,
              number,
            }) => (
              <section id={id} className={styles.chapter} key={id}>
                <ScrollFade root={page} className={styles.chapterHeading}>
                  <span className={styles.chapterNumber} aria-hidden="true">
                    {number}
                  </span>
                  <span className={styles.eyebrow}>
                    Chapter {number} / {nav}
                  </span>
                  <h2 tabIndex="-1">{title}</h2>
                </ScrollFade>

                <div className={styles.prose}>
                  {paragraphs.map((paragraph, i) => (
                    <ScrollFade root={page} as="p" key={paragraph} stagger={i}>
                      <ArticleText text={paragraph} highlights={highlights} />
                    </ScrollFade>
                  ))}
                  {(link || journalLink) && (
                    <div className={layout.chapterLinks}>
                      {journalLink && <Link to={journalLink[1]}>{journalLink[0]} ↗</Link>}
                      {link && (
                        <a href={link[1]} target="_blank" rel="noopener noreferrer">
                          {link[0]} ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {id !== 'cooling' && (illustration || mechanism) && (
                  <div className={layout.visuals}>
                    {[illustration, mechanism].filter(Boolean).map(image => (
                      <figure key={image.src} className={layout.visualCard}>
                        <button
                          type="button"
                          className={layout.visualSurfaceButton}
                          onClick={() =>
                            setLightboxItem({
                              src: image.src,
                              dimensions: [image.width, image.height],
                              eyebrow: `Chapter ${number} · ${nav}`,
                              title,
                              alt: image.alt,
                              caption: image.caption,
                              isPaperFigure: false,
                            })
                          }
                          aria-label={`Inspect illustration: ${image.alt}`}
                        >
                          <img
                            className={layout.illustration}
                            src={image.src}
                            width={image.width}
                            height={image.height}
                            loading="lazy"
                            decoding="async"
                            alt={image.alt}
                          />
                          <span className={styles.imageHint} aria-hidden="true">
                            Inspect visual ⤢
                          </span>
                        </button>
                        <figcaption>{image.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                {id === 'surface' && <SurfaceExplorer />}

                {id === 'silver' && (
                  <>
                    <div className={layout.evidence}>
                      <OpeningFigure article={article} onInspect={setLightboxItem} />
                    </div>
                    <ShellExplorer />
                  </>
                )}

                {id === 'mixture' && (
                  <div className={layout.fullSpan}>
                    <ViscosityContrastCard items={article.viscosityContrast} />
                  </div>
                )}

                {id === 'cooling' && (
                  <>
                    <div className={layout.fullSpan}>
                      <ThermalPulseExplorer shells={article.thermalPulseShells} />
                    </div>
                    <div className={layout.exercise}>
                      <ShellQuestion onNavigate={nextId => navigate(nextId, true)} />
                    </div>
                  </>
                )}

                {id === 'titania' && (
                  <div className={layout.fullSpan}>
                    <ElectrostaticsRace data={article.electrostaticsComparison} />
                  </div>
                )}

                {figure && (
                  <div className={layout.evidence}>
                    <PublishedFigure
                      figure={figure}
                      paper={link}
                      journalLink={journalLink}
                      legendItems={id === 'titania' ? article.figureLegends?.tio2Legend : undefined}
                      unitNote={id === 'silver' ? article.figureLegends?.silverUnitNote : undefined}
                      onInspect={setLightboxItem}
                    />
                  </div>
                )}

                {handoff && (
                  <div className={styles.storyHandoff}>
                    <a
                      href={`#${handoff.to}`}
                      onClick={e => {
                        e.preventDefault();
                        navigate(handoff.to, true);
                      }}
                    >
                      <span className={styles.handoffLabel}>Next · {chapterTitles[handoff.to]}</span>
                      <span className={styles.handoffPrompt}>
                        <span>{handoff.text}</span>
                        <svg
                          className={styles.handoffArrow}
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
            )
          )}

          <section id="synthesis" className={styles.recap}>
            <span className={styles.eyebrow}>The journey / Put the evidence together</span>
            <h2 tabIndex="-1">Back to the water at the surface.</h2>
            <p>{article.conclusion}</p>

            <ThreeStudySynthesis
              studies={article.studiesSummary}
              onNavigate={targetId => navigate(targetId, true)}
            />

            <ol>
              {article.takeaways.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <div className={layout.related}>
              <Link to="/simulate-atoms">Explore atomistic simulation ↗</Link>
              <Link to="/metrology">Explore 2D metrology ↗</Link>
              <Link to="/Graphene">Meet graphene ↗</Link>
              <Link to="/journal/">Read my research ↗</Link>
            </div>
          </section>

          <section className={styles.sources} aria-labelledby="nanofluids-sources">
            <h2 id="nanofluids-sources">Sources &amp; further reading</h2>
            <ol>
              {article.sources.map((src, i) => (
                <li key={src.title} value={i + 1}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">
                    {src.title} ↗
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </article>
      </main>

      <AnimatePresence>
        {lightboxItem && (
          <FigureLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
