import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import papers from "../../data/journalPapers.json";
import styles from "./Journal.module.css";

const scholar = "https://scholar.google.ca/citations?user=mroBfIwAAAAJ&hl=en";

function DirectionIcon() {
  return <svg className={styles.directionIcon} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

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
  const pageRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const easing = [0.22, 1, 0.36, 1];
  const reveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reducedMotion ? 0 : 0.85, ease: easing } },
  };
  const enterView = {
    initial: reducedMotion ? false : "hidden",
    whileInView: "visible",
    viewport: { root: pageRef, once: true, amount: 0.12, margin: "0px 0px -60px 0px" },
  };
  return (
    <div className={styles.page} ref={pageRef} data-site-motion-ignore="true">
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
            <a className={styles.textLink} href={scholar} target="_blank" rel="noopener noreferrer">View Google Scholar <DirectionIcon /></a>
          </div>
        </section>

        <section className={styles.archive} aria-labelledby="archive-title">
          <motion.div className={styles.archiveHeading} style={{ opacity: reducedMotion ? 1 : 0 }} {...enterView} variants={reveal}>
            <div><div className={styles.label}>Selected journal papers</div><h2 id="archive-title">Publication archive</h2></div>
            <span className={styles.archiveCount}>{papers.length} papers</span>
          </motion.div>
          {papers.map((paper, index) => (
            <motion.article className={styles.paper} key={paper.url} style={{ opacity: reducedMotion ? 1 : 0 }} {...enterView} variants={reveal}>
              <div className={styles.paperIndex}><span>{String(index + 1).padStart(2, "0")}</span><span className={styles.paperIndexLine} /><span>{paper.year}</span></div>
              <div className={styles.paperBody}>
                <div className={styles.paperTopline}><span>{paper.topic}</span><span>{paper.journal} · {paper.year}</span></div>
                <h3><Link to={`/journal/${paper.slug}/`}>{paper.title}</Link></h3>
                <p>{paper.summary}</p>
                <Link className={styles.paperLink} to={`/journal/${paper.slug}/`}>Read the story <DirectionIcon /></Link>
                {paper.pdf && <a className={styles.paperLink} href={paper.pdf} download style={{ marginLeft: 24 }}>Download PDF <span aria-hidden="true">↓</span></a>}
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section className={styles.closing} style={{ opacity: reducedMotion ? 1 : 0 }} {...enterView} variants={reveal}>
          <div><div className={styles.label}>Continue exploring</div><h2>From publication<br />to possibility.</h2></div>
          <p>See how this research connects to materials production, process design, and practical applications in the R&D portfolio. <Link className={styles.textLink} to="/R&D-Portfolio">Explore the portfolio <DirectionIcon /></Link></p>
        </motion.section>
        <div className={styles.endnote}><span>© {new Date().getFullYear()} Saeed Arabha</span><a href={scholar} target="_blank" rel="noopener noreferrer">Google Scholar</a></div>
      </main>
    </div>
  );
}
