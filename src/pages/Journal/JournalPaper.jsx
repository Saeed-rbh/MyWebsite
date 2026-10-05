import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import papers from "../../data/journalPapers.json";
import styles from "./JournalPaper.module.css";

const figureAnchor = (figure) => `paper-${figure.source.toLowerCase().replace(/\s+/g, "-")}`;

function ResearchFigure({ figure, pdf }) {
  return (
    <figure className={styles.figure} id={figureAnchor(figure)}>
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
    </figure>
  );
}

function EvidenceTable({ table, pdf, index }) {
  const titleId = `evidence-table-${index}`;
  return (
    <section className={styles.evidenceTable} id={`table-${index}`} aria-labelledby={titleId}>
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
    </section>
  );
}

export default function JournalPaper() {
  const { slug } = useParams();
  const paper = papers.find((item) => item.slug === slug);

  React.useEffect(() => {
    if (!paper) return;
    const fragment = window.location.hash.slice(1);
    if (fragment) document.getElementById(fragment)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [paper?.slug]);

  if (!paper) {
    return (
      <div className={styles.page}>
        <SEO title="Paper not found | Saeed Arabha Journal" description="This paper page could not be found." name="Saeed Arabha" type="website" />
        <main className={styles.main}>
          <Link className={styles.backLink} to="/journal/">← All journal papers</Link>
          <section className={styles.notFound}>
            <div className={styles.eyebrow}>Publication archive</div>
            <h1>Paper not found.</h1>
            <p>The page may have moved. Browse the full publication list to find the paper.</p>
            <Link className={styles.primaryLink} to="/journal/">Go to the paper list <span aria-hidden="true">→</span></Link>
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
    "@type": "ScholarlyArticle",
    headline: paper.title,
    author: paper.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: String(paper.year),
    isPartOf: { "@type": "Periodical", name: paper.journal },
    url: paper.url,
    abstract: paper.summary,
  };

  return (
    <div className={styles.page} key={paper.slug}>
      <SEO title={`${paper.title} | Journal | Saeed Arabha`} description={paper.summary} name="Saeed Arabha" type="article" />
      <Helmet><script type="application/ld+json">{JSON.stringify(articleSchema)}</script></Helmet>
      <main className={styles.main}>
        <Link className={styles.backLink} to="/journal/">← The journal</Link>
        <article>
          <header className={styles.hero}>
            <div className={styles.topline}>
              <span className={styles.eyebrow}>{paper.topic}</span>
              <span>{paper.year} <span aria-hidden="true">/</span> {paper.pdf ? readingMinutes : 1} min read</span>
            </div>
            <div className={styles.heroGrid}>
              <div>
                <h1>{editorial.headline}</h1>
                <p className={styles.standfirst}>{editorial.standfirst}</p>
              </div>
              <aside className={styles.highlight} aria-label="A finding from this paper">
                <span className={styles.highlightEyebrow}>{"The main finding"}</span>
                <strong>{editorial.highlight.value}</strong>
                {editorial.highlight.unit && <span className={styles.highlightUnit}>{editorial.highlight.unit}</span>}
                <p>{editorial.highlight.label}</p>
              </aside>
            </div>
            <div className={styles.publicationLine}>
              <div><strong>{paper.journal}</strong><span>{paper.authors.join(", ")}</span></div>
              <div className={styles.heroActions}>
                <a href={paper.figures.length ? "#result-figures" : "#story"}>{paper.figures.length ? "See the figures" : "Follow the story"} <span aria-hidden="true">↓</span></a>
                <a href="#original-paper">Full paper <span aria-hidden="true">↘</span></a>
              </div>
            </div>
          </header>

          {paper.figures.length > 0 && (
            <section className={styles.figurePreview} id="result-figures" aria-labelledby="figure-preview-title">
              <div className={styles.figurePreviewHeading}>
                <span className={styles.eyebrow}>Figures from the paper</span>
                <h2 id="figure-preview-title">See the results.</h2>
                <p>{paper.figures.length} selected figures{paper.tables.length > 0 ? ` and ${paper.tables.length} evidence ${paper.tables.length === 1 ? "table" : "tables"}` : ""}. Follow the comparisons through the story.</p>
              </div>
              <div>
              <div className={styles.figurePreviewGrid}>
                {paper.figures.slice(0, 2).map((figure) => (
                  <a className={styles.figurePreviewLink} href={`#${figureAnchor(figure)}`} key={figure.src} aria-label={`See ${figure.source} in the story: ${paper.story.results[figure.resultIndex].label}`}>
                    <div className={`${styles.figurePreviewImage} ${figure.originalColors ? styles.sourceColors : ""}`}>
                      <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} />
                    </div>
                    <div className={styles.figurePreviewCaption}>
                      <span>{figure.source}</span>
                      <strong>{paper.story.results[figure.resultIndex].label}</strong>
                      <span className={styles.figurePreviewArrow} aria-hidden="true">↘</span>
                    </div>
                  </a>
                ))}
              </div>
              <nav className={styles.figureIndex} aria-label="All figures in this story">{paper.figures.map((figure) => <a href={`#${figureAnchor(figure)}`} key={figure.src}>{figure.source} <span aria-hidden="true">↘</span></a>)}</nav>
              </div>
            </section>
          )}

          {!paper.pdf && <section className={styles.publisherPreview} id="story">
            <aside className={styles.sourceNotice}><strong>Publisher abstract preview</strong><p>This summary uses the publisher’s abstract. The full PDF is needed for the detailed story and source figures.</p><a href={paper.url} target="_blank" rel="noopener noreferrer">Read the publisher abstract ↗</a></aside>
            {(editorial.publisherPreview || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {paper.tables.map((table, index) => <EvidenceTable table={{ ...table, url: paper.url }} pdf={null} index={`preview-${index}`} key={table.title} />)}
          </section>}
          {paper.pdf && <div className={styles.readingLayout}>
            <aside className={styles.readingRail}>
              <nav className={styles.contents} aria-label="In this story">
                <span className={styles.eyebrow}>In this story</span>
                <span className={styles.evidenceCount}>{paper.figures.length} figures · {paper.tables.length} {paper.tables.length === 1 ? "table" : "tables"}</span>
                {paper.figures.length > 0 && <a href="#result-figures">Figures from the paper</a>}
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
                <h2 id="opening-title">{editorial.openingTitle}</h2>
                <p className={styles.dropCap}>{story.context}</p>
                <p>{editorial.bridge}</p>
                <blockquote className={styles.question}>
                  <span>The question</span>
                  <p>{story.question}</p>
                </blockquote>
              </section>

              <section className={styles.chapter} id="investigation" aria-labelledby="investigation-title">
                <span className={styles.eyebrow}>Inside the investigation</span>
                <h2 id="investigation-title">{editorial.methodsTitle}</h2>
                <p>{story.approach}</p>
                <p>{editorial.methodNote}</p>
              </section>

              {story.results.map((result, index) => (
                <section className={styles.resultChapter} id={`finding-${index}`} aria-labelledby={`finding-title-${index}`} key={result.label}>
                  {index === 0 && <span className={styles.eyebrow}>What emerged</span>}
                  <h2 id={`finding-title-${index}`}>{editorial.scenes[index].title}</h2>
                  <dl className={styles.resultFact}>
                    <dt>{result.label}</dt>
                    <dd>{result.value}</dd>
                  </dl>
                  <p>{result.detail}</p>
                  <p>{editorial.scenes[index].explanation.split("\n\n")[0]}</p>
                  {paper.figures.filter((figure) => figure.resultIndex === index).map((figure) => <ResearchFigure figure={figure} pdf={paper.pdf} key={figure.src} />)}
                  {(paper.tables || []).filter((table) => table.resultIndex === index).map((table, tableIndex) => <EvidenceTable table={table} pdf={paper.pdf} index={`${index}-${tableIndex}`} key={table.title} />)}
                  {editorial.scenes[index].explanation.split("\n\n").slice(1).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                </section>
              ))}

              <section className={`${styles.chapter} ${styles.ending}`} id="meaning" aria-labelledby="meaning-title">
                <span className={styles.eyebrow}>The larger picture</span>
                <h2 id="meaning-title">{editorial.endingTitle}</h2>
                <p className={styles.takeaway}>{story.takeaway}</p>
                <p>{editorial.endingNote}</p>
              </section>
            </div>
          </div>}

          <section className={styles.readPaper} id="original-paper" aria-labelledby="read-paper-title">
            <div className={styles.readPaperIntro}>
              <span className={styles.eyebrow}>Continue into the research</span>
              <h2 id="read-paper-title">The full paper.</h2>
              <p>The complete methods, all figures, and the detailed results are in the original publication.</p>
              <div className={styles.actions}>
                {paper.pdf && <a className={styles.primaryLink} href={paper.pdf} download>Download PDF <span aria-hidden="true">↓</span></a>}
                <a className={styles.secondaryLink} href={paper.url} target="_blank" rel="noopener noreferrer">Read online <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <div className={styles.citation}>
              <span className={styles.citationLabel}>Original publication</span>
              <h3>{paper.title}</h3>
              <p>{paper.authors.join(", ")}</p>
              <span>{paper.journal} · {paper.year}</span>
            </div>
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
