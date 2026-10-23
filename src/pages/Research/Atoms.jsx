import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { atomsArticle as article } from '../../data/atomsArticle.mjs';
import styles from './GrapheneArticle.module.css';
import s from './Atoms.module.css';
import AtomisticExplorer from './AtomisticExplorer';

export default function Atoms() {
  const [answer, setAnswer] = useState(null);
  return <div className={styles.page} data-site-motion-ignore="true"><SEO title={`${article.title} | Saeed Arabha`} description={article.description} type="article" /><main className={`${styles.main} ${s.main}`}>
    <header className={s.hero}>
      <div className={s.heroIdentity}>
        <span className={s.ghostWord} aria-hidden="true">Atoms.</span>
        <span className={styles.eyebrow}>Science, at a smaller scale</span>
        <h1>Matter,<br /><em>atom by atom.</em></h1>
        <p className={s.heroKicker}>A visual guide to atomistic simulation</p>
      </div>
      <div className={s.heroAside}>
        <span className={styles.eyebrow}>From a model to an explanation</span>
        <ol className={s.heroJourney}>
          <li><span aria-hidden="true">01</span>Build the structure.</li>
          <li><span aria-hidden="true">02</span>Follow the motion.</li>
          <li><span aria-hidden="true">03</span>Understand the material.</li>
        </ol>
      </div>
      <div className={s.heroIntro}>
        <h2>How do we simulate materials on a computer?</h2>
        <p>{article.intro}</p>
        <div className={s.heroActions}><a href="#atoms-explorer">Try the simulation <span aria-hidden="true">↗</span></a><a href="#what-is-atomistic">Start with the atoms <span aria-hidden="true">↓</span></a></div>
      </div>
    </header>
    <nav className={s.storyNav} aria-label="The story"><span className={s.navLabel}>Follow the story</span><div className={s.storySteps}>{article.sections.map(section => <a key={section.id} href={`#${section.id}`}><span>{section.number}</span>{section.nav}<span aria-hidden="true">↗</span></a>)}<a href="#simulation-papers"><span>05</span>Real problems<span aria-hidden="true">↗</span></a></div><div className={s.navTools}><a href="#atoms-explorer">Interactive simulation ↗</a><a href="#simulation-software">Simulation software ↗</a></div></nav>
    <>{article.sections.map(section => <React.Fragment key={section.id}><section id={section.id} className={styles.chapter}><div className={s.chapterHeading}><span className={s.chapterNumber} aria-hidden="true">{section.number}</span><span className={styles.eyebrow}>{section.nav}</span><h2>{section.title}</h2></div><div className={styles.prose}>{section.paragraphs.map((p, i) => <p key={p}>{p}{i === section.paragraphs.length - 1 && <> <a className={styles.citation} href={article.sources[section.source].url} aria-label={article.sources[section.source].label}>[{section.source + 1}]</a></>}</p>)}</div>{article.diagrams.filter(d => d.chapter === section.id).map(d => <figure className={styles.schematic} key={d.src}><a href={d.src} target="_blank" rel="noopener noreferrer"><img src={d.src} width="960" height="540" alt={d.alt} loading="lazy" /></a><figcaption><span className={styles.eyebrow}>Visual explanation / Literature-based schematic</span><h3>{d.title}</h3><p>{d.caption} <a href={article.sources[d.source].url}>Source ↗</a></p></figcaption></figure>)}</section>{section.id === "how-it-works" && <>
    <AtomisticExplorer />
    <details className={s.exampleDetails}><summary>Optional detail: water geometry and bonding</summary>{article.exampleDiagrams.map(d => <figure key={d.src} className={styles.schematic}><img src={d.src} width="960" height="540" alt={d.alt} loading="lazy" /><figcaption><h3>{d.title}</h3><p>{d.caption} <a href={article.sources[d.source].url}>Source ↗</a></p></figcaption></figure>)}</details>
    <section id="simulation-software" className={s.tools}><span className={styles.eyebrow}>The computational toolbox</span><h2>Which software does what?</h2><p className={s.intro}>Building a system, calculating its motion, and interpreting the result are different jobs. These commonly used tools occupy different parts of that workflow; the list is a guide to the field, not a claim that every package was used in each paper below.</p><div className={s.toolGrid}>{article.software.map(tool => <div key={tool.name} className={s.tool}><span className={styles.eyebrow}>{tool.role}</span><h3>{tool.name}</h3><p>{tool.text}</p><p><strong>{tool.detail}</strong></p><a href={tool.url}>Official documentation ↗</a></div>)}</div></section>
    <details className={s.exampleDetails}><summary>Go deeper: methods, interactions, temperature, and validation</summary>{article.technicalSections.map(item => <section className={styles.chapter} key={item.id}><div><h2>{item.title}</h2></div><div className={styles.prose}>{item.paragraphs.map(p => <p key={p}>{p}</p>)}</div></section>)}</details>
</>}</React.Fragment>)}</>
    <section id="simulation-papers" className={s.papers}><span className={styles.eyebrow}>05 / Real problems</span><h2>From an atomic question to a practical problem.</h2><p className={s.intro}>These examples from my papers show the full chain: a real research problem, an atomic explanation, and what that evidence can inform. Each figure links to the original paper and a discussion of its limitations.</p>{article.research.map(item => <div key={item.slug} className={s.paper}><div><span className={styles.eyebrow}>{item.category}</span><h3>{item.title}</h3><p><strong>The problem.</strong> {item.problem}</p><p><strong>What the simulation reveals.</strong> {item.text}</p><p><strong>Why it helps.</strong> {item.implication}</p><Link to={`/journal/${item.slug}/`}>Read the study and its limitations ↗</Link></div><figure><a href={item.figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.figure.source} at full size`}><img src={item.figure.src} width={item.figure.width} height={item.figure.height} alt={item.figure.alt} loading="lazy" /></a><figcaption>{item.figure.source} · {item.paperTitle}. {item.figure.caption} <a href={item.url}>Original paper ↗</a></figcaption></figure></div>)}</section>
    <section className={styles.quiz} aria-labelledby="quiz-title"><div><span className={styles.eyebrow}>A quick thought experiment</span><h2 id="quiz-title">What tells an atom<br />how to accelerate?</h2></div><div><div className={styles.answers} role="group" aria-label="Choose your answer">{['Force and mass', 'Its display colour', 'The frame rate'].map(option => <button key={option} aria-pressed={answer === option} onClick={() => setAnswer(option)}>{option}</button>)}</div><p className={styles.feedback} aria-live="polite">{answer === null ? 'Choose an answer to see the explanation.' : answer === 'Force and mass' ? 'Exactly. Acceleration is force divided by mass. The interaction model supplies the force; the integrator advances the motion.' : 'Try again. Rendering controls what you see. Newton’s law determines the acceleration in this classical model.'}</p></div></section>
    <section className={styles.recap}><span className={styles.eyebrow}>What to take with you</span><h2>From atomic motion to material behaviour.</h2><ol>{article.takeaways.map(p => <li key={p}>{p}</li>)}</ol><a href="#atoms-explorer">Revisit the model ↑</a></section>
    <section className={styles.faq}><span className={styles.eyebrow}>Questions worth asking</span><h2>Common questions about atomic simulation</h2>{article.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
    <section className={styles.closing}><span className={styles.eyebrow}>From a model to a material</span><h2>From atomic mechanisms<br />to materials research.</h2><p>Explore a specific material in the graphene guide, or follow the questions and evidence across my research papers.</p><div><Link to="/Graphene">Explore graphene ↗</Link><Link to="/journal/">Read the research ↗</Link></div></section>
    <section className={styles.sources}><h2>Sources & further reading</h2><ol>{article.sources.map(s => <li key={s.url}><a href={s.url}>{s.label} ↗</a></li>)}</ol></section>
  </main></div>;
}
