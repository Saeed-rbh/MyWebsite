import React, { useEffect, useRef, useState } from 'react';
import { SurfaceExplorer, ShellExplorer } from './NanofluidExperiments';
import StoryNavigation from './AtomsStoryNavigation';
import { ScrollFade } from '../Commercialization/StoryMotion';
import SEO from '../../components/SEO/SEO';
import { nanofluidsArticle as article } from '../../data/nanofluidsArticle.mjs';
import useGrapheneReveals from './useGrapheneReveals';
import styles from './GrapheneArticle.module.css';
import layout from './Nanofluids.module.css';

const chapters = article.sections.map((section, index) => ({
  ...section, number: String(index + 1).padStart(2, '0'),
}));

const choices = [
  ['Average all the water together.', 'That gives the mean liquid temperature. Water far from the particle dilutes the signal from the first molecular layers.'],
  ['Track water in shells at different radii.', 'Yes. Each shell gives a local temperature as a function of time, so we can compare both the size and timing of the peaks.'],
  ['Track only the silver temperature.', 'This shows how quickly the particle loses energy. To see where that energy arrives, we also need temperatures in the water.'],
];

function ShellQuestion() {
  const [answer, setAnswer] = useState(null);
  return <div className={styles.quiz}>
    <header className={styles.quizIntro}><span className={styles.eyebrow}>Read the simulation</span>
      <h3 id="shell-question">How would you detect a brief warming near the particle?</h3>
    </header>
    <div className={styles.quizInteraction}>
      <div className={styles.quizAnswers} role="group" aria-labelledby="shell-question">
        {choices.map(([label], index) => <button key={label} type="button" className={styles.quizAnswer}
          aria-pressed={answer === index} onClick={() => setAnswer(index)}>{label}</button>)}
      </div>
      <p className={styles.quizResponse} role="status">{answer === null ? 'Choose a measurement.' : choices[answer][1]}</p>
    </div>
  </div>;
}

function OpeningFigure() {
  const [density, setDensity] = useState(false);
  const image = density ? article.densityMap : article.interfaceImage;
  return <figure className={layout.interfaceFigure}>
    <div className={layout.openingImage}><img src={image.src} alt={image.alt} /></div>
    <div className={layout.options} role="group" aria-label="Choose a view of the interface">
      <button type="button" aria-pressed={!density} onClick={() => setDensity(false)}>Molecules</button>
      <button type="button" aria-pressed={density} onClick={() => setDensity(true)}>Water density</button>
    </div>
    <figcaption aria-live="polite">{density ? <>{image.caption} <a href={image.url}>{image.source}</a></> :
      'A schematic slice through the interface. Silver is on the left. Each water molecule has one oxygen atom and two hydrogens. Switch views to see the density map from our paper.'}</figcaption>
  </figure>;
}

function PublishedFigure({ figure, paper }) {
  return (
    <figure className={styles.literatureFigure}>
      <header>
        <span className={styles.eyebrow}>Our simulation results</span>
        <h3>{figure.title}</h3>
      </header>
      <a href={figure.src} target="_blank" rel="noreferrer" aria-label={'Enlarge figure: ' + figure.title}>
        <img src={figure.src} width={figure.width} height={figure.height} loading="lazy" alt={figure.alt} />
      </a>
      <figcaption className={styles.compactFigureCaption}>
        <p>{figure.reading}</p>
        <cite><a href={paper[1]}>{figure.source}</a></cite>
      </figcaption>
    </figure>
  );
}

export default function Nanofluids() {
  const page = useRef(null);
  const [active, setActive] = useState(chapters[0].id);
  useGrapheneReveals(page, true);
  function navigate(id) {
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
    window.history.replaceState(window.history.state, '', '#' + id);
  }
  useEffect(() => {
    const root = page.current;
    const nodes = chapters.map(chapter => document.getElementById(chapter.id));
    function update() {
      const index = Math.max(0, nodes.findLastIndex(node => node.getBoundingClientRect().top <= 210));
      setActive(chapters[index].id);
      root.style.setProperty('--rail-progress', index === 0 ? '0' : index === chapters.length - 1 ? '1' : '.5');
      root.style.setProperty('--reading-progress', String(root.scrollTop / Math.max(1, root.scrollHeight - root.clientHeight)));
    }
    const initial = nodes.find(node => '#' + node.id === window.location.hash);
    initial?.scrollIntoView();
    update();
    root.addEventListener('scroll', update, { passive: true });
    return () => root.removeEventListener('scroll', update);
  }, []);
  return (
    <div className={styles.page} ref={page} data-site-motion-ignore="true">
      <SEO title={article.title + ' | Saeed Arabha'} description={article.intro} type="article" />
      <main className={styles.main}>
        <article>
          <header className={styles.hero + ' ' + layout.opening}>
            <div className={styles.heroIdentity}>
              <span className={styles.ghostWord} data-page-entrance="atmosphere" aria-hidden="true">Water.</span>
              <span className={styles.eyebrow} data-page-entrance="eyebrow">A closer look at materials</span>
              <h1><span className={styles.heroPrefix} data-page-entrance="prefix">Meet</span>{' '}<em data-page-entrance="title">Nanofluids.</em></h1>
              <p className={styles.heroKicker}>Silver, titanium dioxide and the water at their surfaces</p>
            </div>
            <div className={styles.heroIntro}>
              <h2><span aria-hidden="true">◆</span> How can water collect more sunlight?</h2>
              <p>{article.intro}</p>
              <div className={styles.heroActions}><a href="#suspension">Start with one particle ↓</a></div>
            </div>
            <figure className={layout.interfaceFigure}>
              <img src={article.solarImage.src} alt={article.solarImage.alt} width="1536" height="1024" />
              <figcaption>{article.solarImage.caption}</figcaption>
            </figure>
          </header>
          <StoryNavigation chapters={chapters} active={active} navigate={navigate}
            groupTitles={['Meet the suspension', 'Study silver in water', 'Compare the interface']} />
          {chapters.map(({ id, nav, title, paragraphs, link, figure, illustration, mechanism, number }) => (
            <section id={id} className={styles.chapter} key={id}>
              <ScrollFade root={page} className={styles.chapterHeading}>
                <span className={styles.chapterNumber} aria-hidden="true">{number}</span>
                <span className={styles.eyebrow}>Chapter {number} / {nav}</span>
                <h2>{title}</h2>
              </ScrollFade>
              <div className={styles.prose}>
                {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                {link && <a href={link[1]}>{link[0]}</a>}
              </div>
              {(illustration || mechanism) && <div className={layout.visuals}>
                {[illustration, mechanism].filter(Boolean).map(image => <figure key={image.src}>
                  <img className={layout.illustration} src={image.src} width="1536" height="1024" loading="lazy" alt={image.alt} />
                  <figcaption>{image.caption}</figcaption>
                </figure>)}
              </div>}
              {id === 'surface' && <SurfaceExplorer />}
              {id === 'silver' && <><div className={layout.evidence}><OpeningFigure /></div><ShellExplorer /></>}
              {id === 'cooling' && <div className={layout.exercise}><ShellQuestion /></div>}
              {figure && <div className={layout.evidence}><PublishedFigure figure={figure} paper={link} /></div>}
            </section>
          ))}
          <section className={styles.closing}>
            <h2>Back to the water at the surface.</h2>
            <p>{article.conclusion}</p>
          </section>
        </article>
      </main>
    </div>
  );
}
