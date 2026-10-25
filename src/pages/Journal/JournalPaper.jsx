import React, { useRef } from "react";
import { ScrollFade } from "../Commercialization/StoryMotion";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import usePageReveals from "../../components/SiteMotion/usePageReveals";
import SEO from "../../components/SEO/SEO";
import papers from "../../data/journalPapers.json";
import styles from "./JournalPaper.module.css";

const figureAnchor = (figure) => `paper-${figure.source.toLowerCase().replace(/\s+/g, "-")}`;

function ResearchFigure({ figure, pdf, root }) {
  return (
    <ScrollFade root={root} as="figure" className={styles.figure} id={figureAnchor(figure)}>
      <div className={styles.figureTopline}>
        <span>{figure.source} · From the paper{figure.page && pdf && <> · <a href={`${pdf}#page=${figure.page}`} target="_blank" rel="noopener noreferrer">PDF p. {figure.page}</a></>}</span>
        <a href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Open original figure: ${figure.alt}`}>
          View original <span aria-hidden="true">↗</span>
        </a>
      </div>
      <a className={`${styles.figureImage} ${figure.originalColors ? styles.sourceColors : ""}`} href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${figure.source}: ${figure.alt}`}>
        <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" />
      </a>
      <figcaption>
        <p>{figure.caption}</p>
        <p className={styles.figureReading}><strong>What to look for</strong>{figure.reading}</p>
      </figcaption>
    </ScrollFade>
  );
}

function EvidenceTable({ table, pdf, index, root }) {
  const titleId = `evidence-table-${index}`;
  return (
    <ScrollFade root={root} as="section" className={styles.evidenceTable} id={`table-${index}`} aria-labelledby={titleId}>
      <span className={styles.eyebrow}>The evidence in numbers and comparisons</span>
      <h3 id={titleId}>{table.title}</h3>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${table.title}: scroll to see all columns`}>
        <table>
          <caption className={styles.srOnly}>{table.title}</caption>
          <thead><tr>{table.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
          <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p className={styles.evidenceSource}>Source: <a href={table.url || (pdf ? `${pdf}#page=${table.source.match(/PDF pp?\. (\d+)/)?.[1] || 1}` : "#original-paper")} target={(pdf || table.url) ? "_blank" : undefined} rel="noopener noreferrer">{table.source}</a></p>
      <p className={styles.evidenceNote}>{table.note}</p>
    </ScrollFade>
  );
}

export default function JournalPaper() {
  const { slug } = useParams();
  const pageRef = useRef(null);
  usePageReveals(pageRef);
  const paper = papers.find((item) => item.slug === slug);

  React.useEffect(() => {
    if (!paper) return;
    const fragment = window.location.hash.slice(1);
    if (fragment) document.getElementById(fragment)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [paper?.slug]);

  if (!paper) {
    return (
      <div className={styles.page} ref={pageRef} data-site-motion-ignore="true">
        <SEO title="Paper not found | Saeed Arabha Journal" description="This paper page could not be found." name="Saeed Arabha" type="website" />
        <main className={styles.main}>
          <Link className={styles.backLink} to="/journal/">← All journal papers</Link>
          <section className={styles.notFound}>
            <div className={styles.eyebrow} data-page-entrance="eyebrow">Publication archive</div>
            <h1 data-page-entrance="title">Paper not found.</h1>
            <p data-page-entrance="intro">The page may have moved. Browse the full publication list to find the paper.</p>
            <Link className={styles.primaryLink} data-page-entrance="actions" to="/journal/">Go to the paper list <span aria-hidden="true">→</span></Link>
          </section>
        </main>
      </div>
    );
  }

  const { editorial, story } = paper;
  const narrative = [story.context, story.question, story.approach, story.takeaway,
    editorial.bridge, editorial.methodNote, editorial.endingNote,
    ...story.results.map((result) => result.detail),
    ...editorial.scenes.map((scene) => scene.explanation),
    ...paper.figures.map((figure) => `${figure.caption} ${figure.reading}`),
    ...(paper.tables || []).map((table) => `${table.title} ${table.note}`)].join(" ");
  const readingMinutes = Math.max(1, Math.ceil(narrative.split(/\s+/).length / 180));
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: editorial.headline,
    description: paper.summary,
    author: { "@type": "Person", name: "Saeed Arabha" },
    mainEntityOfPage: `https://www.saeedarabha.com/journal/${paper.slug}/`,
    about: {
      "@type": "ScholarlyArticle",
      headline: paper.title,
      author: paper.authors.map((name) => ({ "@type": "Person", name })),
      datePublished: String(paper.year),
      isPartOf: { "@type": "Periodical", name: paper.journal },
      url: paper.url,
    },
  };

  return (
    <div className={styles.page} key={paper.slug} ref={pageRef} data-site-motion-ignore="true">
      <SEO title={`${paper.title} | Journal | Saeed Arabha`} description={paper.summary} name="Saeed Arabha" type="article" />
      <Helmet><script type="application/ld+json">{JSON.stringify(articleSchema)}</script></Helmet>
      <main className={styles.main}>
        <Link className={styles.backLink} data-page-entrance="eyebrow" to="/journal/">← The journal</Link>
        <article>
          <header className={styles.hero}>
            <div className={styles.noteLabel} data-page-entrance="eyebrow">Research notes <span aria-hidden="true">/</span> Behind the paper</div>
            <div className={styles.topline} data-page-entrance="kicker">
              <span className={styles.eyebrow}>{paper.topic}</span>
              <span>{paper.year} <span aria-hidden="true">/</span> {paper.pdf ? readingMinutes : 1} min read</span>
            </div>
            <div className={styles.heroGrid}>
              <ScrollFade root={pageRef}>
                <h1 data-page-entrance="title">{editorial.headline}</h1>
                <p className={styles.standfirst} data-page-entrance="intro">{editorial.standfirst}</p>
              </ScrollFade>
              <ScrollFade root={pageRef} as="aside" stagger={1} className={styles.highlight} data-page-entrance="journey" aria-label="A finding from this paper">
                <span className={styles.highlightEyebrow}>{"The main finding"}</span>
                <strong>{editorial.highlight.value}</strong>
                {editorial.highlight.unit && <span className={styles.highlightUnit}>{editorial.highlight.unit}</span>}
                <p>{editorial.highlight.label}</p>
              </ScrollFade>
            </div>
            <div className={styles.publicationLine}>
              <div data-page-entrance="intro" data-entrance-order="1"><strong>{paper.journal}</strong><span>{paper.authors.join(", ")}</span></div>
              <div className={styles.heroActions} data-page-entrance="actions">
                <a href={paper.figures.length ? `#${figureAnchor(paper.figures[0])}` : "#story"}>{paper.figures.length ? "See the figures" : "Follow the story"} <span aria-hidden="true">↓</span></a>
                <a href="#original-paper">Full paper <span aria-hidden="true">↘</span></a>
              </div>
            </div>
          </header>
        {papers.slice(0,2).some(item => item.slug === paper.slug) && <p className={styles.commercializationLink}><Link to="/venture">From this research to customer discovery: explore the CFE commercialization case ↗</Link></p>}

          {!paper.pdf && <section className={styles.publisherPreview} id="story">
            <aside className={styles.sourceNotice}><strong>Publisher abstract preview</strong><ScrollFade root={pageRef} as="p">This summary uses the publisher’s abstract. The full PDF is needed for the detailed story and source figures.</ScrollFade><a href={paper.url} target="_blank" rel="noopener noreferrer">Read the publisher abstract ↗</a></aside>
            {(editorial.publisherPreview || []).map((paragraph) => <ScrollFade root={pageRef} as="p" key={paragraph}>{paragraph}</ScrollFade>)}
            {paper.tables.map((table, index) => <EvidenceTable root={pageRef} table={{ ...table, url: paper.url }} pdf={null} index={`preview-${index}`} key={table.title} />)}
          </section>}
          {paper.pdf && <div className={styles.readingLayout}>
            <aside className={styles.readingRail}>
              <nav className={styles.contents} aria-label="In this story">
                <span className={styles.eyebrow}>In this story</span>
                <span className={styles.evidenceCount}>{paper.figures.length} figures · {paper.tables.length} {paper.tables.length === 1 ? "table" : "tables"}</span>
                {paper.figures.length > 0 && <a href={`#${figureAnchor(paper.figures[0])}`}>Figures from the paper</a>}
                {paper.tables.length > 0 && <a href={`#table-${paper.tables[0].resultIndex}-0`}>Data comparisons</a>}
                <a href="#story">The starting question</a>
                <a href="#investigation">The investigation</a>
                {editorial.scenes.map((scene, index) => <a href={`#finding-${index}`} key={scene.title}>{scene.title}</a>)}
                <a href="#meaning">What it means</a>
                <a className={styles.contentsSource} href="#original-paper">Read the paper <span aria-hidden="true">↘</span></a>
              </nav>
            </aside>

            <div className={styles.narrative}>
              <section className={`${styles.chapter} ${styles.opening}`} id="story" aria-labelledby="opening-title">
                <span className={styles.eyebrow}>The starting point</span>
                <ScrollFade root={pageRef} as="h2" id="opening-title">{editorial.openingTitle}</ScrollFade>
                <ScrollFade root={pageRef} as="p" className={styles.dropCap}>{story.context}</ScrollFade>
                <ScrollFade root={pageRef} as="p">{editorial.bridge}</ScrollFade>
                <ScrollFade root={pageRef} as="blockquote" className={styles.question}>
                  <span>The question</span>
                  <p>{story.question}</p>
                </ScrollFade>
              </section>

              <section className={styles.chapter} id="investigation" aria-labelledby="investigation-title">
                <span className={styles.eyebrow}>Inside the investigation</span>
                <ScrollFade root={pageRef} as="h2" id="investigation-title">{editorial.methodsTitle}</ScrollFade>
                <ScrollFade root={pageRef} as="p">{story.approach}</ScrollFade>
                <ScrollFade root={pageRef} as="p">{editorial.methodNote}</ScrollFade>
              </section>

              {story.results.map((result, index) => (
                <section className={styles.resultChapter} id={`finding-${index}`} aria-labelledby={`finding-title-${index}`} key={result.label}>
                  {index === 0 && <span className={styles.eyebrow}>What emerged</span>}
                  <ScrollFade root={pageRef} as="h2" id={`finding-title-${index}`}>{editorial.scenes[index].title}</ScrollFade>
                  <ScrollFade root={pageRef} as="dl" className={styles.resultFact}>
                    <dt>{result.label}</dt>
                    <dd>{result.value}</dd>
                  </ScrollFade>
                  <ScrollFade root={pageRef} as="p">{result.detail}</ScrollFade>
                  <ScrollFade root={pageRef} as="p">{editorial.scenes[index].explanation.split("\n\n")[0]}</ScrollFade>
                  {paper.figures.filter((figure) => figure.resultIndex === index).map((figure) => <ResearchFigure root={pageRef} figure={figure} pdf={paper.pdf} key={figure.src} />)}
                  {(paper.tables || []).filter((table) => table.resultIndex === index).map((table, tableIndex) => <EvidenceTable root={pageRef} table={table} pdf={paper.pdf} index={`${index}-${tableIndex}`} key={table.title} />)}
                  {editorial.scenes[index].explanation.split("\n\n").slice(1).map((paragraph, paragraphIndex) => <ScrollFade root={pageRef} as="p" key={paragraphIndex}>{paragraph}</ScrollFade>)}
                </section>
              ))}

              <section className={`${styles.chapter} ${styles.ending}`} id="meaning" aria-labelledby="meaning-title">
                <span className={styles.eyebrow}>The larger picture</span>
                <ScrollFade root={pageRef} as="h2" id="meaning-title">{editorial.endingTitle}</ScrollFade>
                <ScrollFade root={pageRef} as="p" className={styles.takeaway}>{story.takeaway}</ScrollFade>
                <ScrollFade root={pageRef} as="p">{editorial.endingNote}</ScrollFade>
              </section>
            </div>
          </div>}

          <section className={styles.readPaper} id="original-paper" aria-labelledby="read-paper-title">
            <ScrollFade root={pageRef} className={styles.readPaperIntro}>
              <span className={styles.eyebrow}>Continue into the research</span>
              <h2 id="read-paper-title">The full paper.</h2>
              <p>The complete methods, all figures, and the detailed results are in the original publication.</p>
              <div className={styles.actions}>
                {paper.pdf && <a className={styles.primaryLink} href={paper.pdf} download>Download PDF <span aria-hidden="true">↓</span></a>}
                <a className={styles.secondaryLink} href={paper.url} target="_blank" rel="noopener noreferrer">Read online <span aria-hidden="true">↗</span></a>
              </div>
            </ScrollFade>
            <ScrollFade root={pageRef} className={styles.citation}>
              <span className={styles.citationLabel}>Original publication</span>
              <h3>{paper.title}</h3>
              <p>{paper.authors.join(", ")}</p>
              <span>{paper.journal} · {paper.year}</span>
            </ScrollFade>
          </section>
        </article>
        <footer className={styles.footerNav}>
          <span>There is another story to explore.</span>
          <Link to="/journal/">Back to all papers <span aria-hidden="true">→</span></Link>
        </footer>
      </main>
    </div>
  );
}
