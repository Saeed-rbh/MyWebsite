import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import papers from "../../data/journalPapers.json";
import styles from "./Journal.module.css";

const scholar = "https://scholar.google.ca/citations?user=mroBfIwAAAAJ&hl=en";

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Journal Publications | Saeed Arabha",
  description: "Research papers by Saeed Arabha on graphene production, two-dimensional materials, thermal transport and molecular dynamics, with plain-language explanations.",
  about: { "@type": "Person", name: "Saeed Arabha", sameAs: scholar },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: papers.map((paper, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: paper.editorial.headline,
        url: `https://www.saeedarabha.com/journal/${paper.slug}/`,
        description: paper.summary,
        about: { "@type": "ScholarlyArticle", headline: paper.title, url: paper.url },
      },
    })),
  },
};

export default function Journal() {
  return (
    <div className={styles.page}>
      <SEO
        title="Journal Publications | Saeed Arabha | Graphene & Materials Research"
        description="Explore Saeed Arabha's research papers on graphene exfoliation, two-dimensional materials, thermal transport and molecular dynamics, each explained in plain language."
        name="Saeed Arabha"
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="journal-title">
          <div>
            <div className={styles.eyebrow}>Research / Peer-reviewed publications</div>
            <h1 id="journal-title">The <em>Journal.</em></h1>
            <p className={styles.heroLead}>Research papers on how materials move heat, respond to forces, and separate into useful two-dimensional sheets.</p>
          </div>
          <div className={styles.heroAside}>
            <div className={styles.label}>From atom to application</div>
            <p>My work uses molecular dynamics, physical modeling, and machine learning methods to understand materials at small scales—and to make those insights useful for real processes.</p>
            <a className={styles.textLink} href={scholar} target="_blank" rel="noopener noreferrer">View Google Scholar <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className={styles.archive} aria-labelledby="archive-title">
          <div className={styles.archiveHeading}>
            <div><div className={styles.label}>Selected journal papers</div><h2 id="archive-title">Publication archive</h2></div>
            <span className={styles.archiveCount}>{papers.length} papers</span>
          </div>
          {papers.map((paper, index) => (
            <article className={styles.paper} key={paper.url}>
              <div className={styles.paperIndex}>{String(index + 1).padStart(2, "0")}<span className={styles.paperIndexLine} />{paper.year}</div>
              <div>
                <div className={styles.paperTopline}><span>{paper.topic}</span><span>{paper.journal} · {paper.year}</span></div>
                <h3><Link to={`/journal/${paper.slug}/`}>{paper.title}<span aria-hidden="true">↗</span></Link></h3>
                <p>{paper.summary}</p>
                <Link className={styles.paperLink} to={`/journal/${paper.slug}/`}>Read the story <span aria-hidden="true">↗</span></Link>
                {paper.pdf && <a className={styles.paperLink} href={paper.pdf} download style={{ marginLeft: 24 }}>Download PDF <span aria-hidden="true">↓</span></a>}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.closing}>
          <div><div className={styles.label}>Continue exploring</div><h2>From publication<br />to possibility.</h2></div>
          <p>See how this research connects to materials production, process design, and practical applications in the R&D portfolio. <Link className={styles.textLink} to="/R&D-Portfolio">Explore the portfolio <span aria-hidden="true">↗</span></Link></p>
        </section>
        <div className={styles.endnote}><span>© {new Date().getFullYear()} Saeed Arabha</span><a href={scholar} target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></div>
      </main>
    </div>
  );
}
