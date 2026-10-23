import { atomsArticle } from '../src/data/atomsArticle.mjs';
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { commercializationSeo, schemaFor } from '../src/data/siteSeo.mjs';
import { renderCommercialization } from './render-commercialization.mjs';
import { grapheneArticle } from '../src/data/grapheneArticle.mjs';

// Give each public SPA route useful HTML before JavaScript runs. React replaces
// this snapshot on mount; the content is drawn from the same editorial data.
const site = "https://www.saeedarabha.com";
const dist = process.env.SEO_DIST_DIR
  ? resolve(process.env.SEO_DIST_DIR)
  : fileURLToPath(new URL("../dist/", import.meta.url));
// The generator can run again against an existing build. Remove the previous
// snapshot and its owned metadata before adding current route-specific content.
const template = readFileSync(join(dist, "index.html"), "utf8")
  .replace(/<(title|script)\b[^>]*data-seo-snapshot="true"[^>]*>[\s\S]*?<\/\1>/g, '')
  .replace(/<(?:meta|link)\b[^>]*data-seo-snapshot="true"[^>]*>/g, '')
  .replace(/<style id="seo-snapshot-style">[\s\S]*?<\/style>/g, '')
  .replace(/<div id="root">[\s\S]*<\/div>(?=\s*(?:<script\b|<\/body>))/g, '<div id="root"></div>');
const papers = JSON.parse(readFileSync(new URL("../src/data/journalPapers.json", import.meta.url), "utf8"));
const escape = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const paragraph = (value) => `<p>${escape(value)}</p>`;
const link = (href, label) => `<a href="${escape(href)}">${escape(label)}</a>`;
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const nav = `<nav aria-label="Main navigation">${[
  ["/", "Home"], ["/R&D-Portfolio", "R&D portfolio"], ["/AcademicCV", "Academic CV"],
  ["/venture", "Venture"], ["/journal/", "Journal"], ["/research-progress", "Research journey"],
].map(([url, label]) => link(url, label)).join("")}</nav>`;

const pages = [
  {
    path: '/simulate-atoms', title: `${atomsArticle.title} | Saeed Arabha`, description: atomsArticle.description,
    type: 'article', schema: schemaFor('/simulate-atoms'),
    body: `<h1>${escape(atomsArticle.title)}</h1>${paragraph(atomsArticle.intro)}
      ${atomsArticle.sections.map(s => `<section id="${s.id}"><h2>${escape(s.title)}</h2>${s.paragraphs.map(paragraph).join('')}${link(atomsArticle.sources[s.source].url, 'Source')}${atomsArticle.diagrams.filter(d => d.chapter === s.id).map(d => `<figure><img src="${d.src}" width="960" height="540" alt="${escape(d.alt)}"><figcaption>${escape(d.title)} ${escape(d.caption)}</figcaption></figure>`).join('')}</section>`).join('')}
      <section id="simulation-software"><h2>Which software does what?</h2>${atomsArticle.software.map(t => `<h3>${escape(t.name)}: ${escape(t.role)}</h3>${paragraph(t.text)}${paragraph(t.detail)}${link(t.url, 'Official documentation')}`).join('')}</section>
      <section id="simulation-papers"><h2>Real problems: from atomic questions to practical decisions</h2>${atomsArticle.research.map(r => `<h3>${escape(r.title)}</h3>${paragraph(r.problem)}${paragraph(r.text)}${paragraph(r.implication)}<figure><img src="${r.figure.src}" alt="${escape(r.figure.alt)}"><figcaption>${escape(r.figure.source)}. ${escape(r.paperTitle)}</figcaption></figure>${link(r.url,'Original paper')}`).join('')}</section>
      <section><h2>Key takeaways</h2>${atomsArticle.takeaways.map(paragraph).join('')}</section>
      <section><h2>Common questions</h2>${atomsArticle.faq.map(s => `<h3>${escape(s.question)}</h3>${paragraph(s.answer)}`).join('')}</section>
      <section><h2>Sources and further reading</h2>${atomsArticle.sources.map(s => link(s.url, s.label)).join('')}</section>
      ${link('/Graphene', 'Explore graphene')}${link('/journal/', 'Read the research')}`,
  },
  {
    path: "/venture",
    ...commercializationSeo,
    schema: schemaFor('/venture'),
    body: await renderCommercialization(),
    isFullPage: true,
  },
  {
    path: "/",
    title: "Saeed Arabha | Materials Scientist & Researcher",
    description: "Saeed Arabha connects materials science, process development, and metrology through graphene research, experimental characterization, and computational modeling. Explore his R&D work and academic CV.",
    body: `<h1>Saeed Arabha</h1><p class="lead">Materials scientist · Process and metrology engineer</p>
      <p>I develop materials, engineer processes, and measure quality, connecting experiments with computational models.</p>
      <section><h2>Research and development</h2><p>My work focuses on graphene and other two-dimensional materials, compressible flow exfoliation, characterization, and thermal transport.</p>${link("/R&D-Portfolio", "Explore the R&D portfolio")}${link("/venture", "Research commercialization: from materials science to market")}</section>
      <section><h2>Selected research areas</h2><ul>
      <li>Compressible flow exfoliation and scalable production of 2D nanomaterials</li>
      <li>Metrology using microscopy, spectroscopy, and Raman measurements</li>
      <li>Molecular dynamics, fluid dynamics, and machine learning models</li></ul>
      ${link("/journal/", "Read the journal and publication stories")}</section>
      <section><h2>Background</h2><p>See my education, publications, teaching, and research experience in the academic CV.</p>${link("/AcademicCV", "View the academic CV")}</section>`,
    schema: schemaFor('/'),
  },
  {
    path: "/R&D-Portfolio",
    title: "R&D Portfolio | Saeed Arabha | Materials, Process & Metrology",
    description: "Explore Saeed Arabha's R&D work in graphene and 2D materials, compressible flow exfoliation, experimental characterization, modeling, and scale-up.",
    body: `<h1>Materials, process, and metrology</h1><p class="lead">Research and development portfolio</p>
      <p>My research connects how two-dimensional materials are produced with their structure, quality, and possible uses. I study graphene, hexagonal boron nitride, and molybdenum disulfide through experiments and modeling.</p>
      <section><h2>Compressible flow exfoliation</h2><p>High-pressure gas flow can separate layered feedstocks into thinner nanoplatelets. I investigate pressure, temperature, carrier gas, and flow conditions to understand material quality and production behavior.</p></section>
      <section><h2>Characterization and process feedback</h2><p>Microscopy and spectroscopy reveal morphology, chemistry, structure, and defects. These measurements help connect a change in processing conditions with the material produced.</p></section>
      <section><h2>Modeling and scale-up</h2><p>Computational fluid dynamics and molecular simulations help test mechanisms and guide experiments. I also explore industry needs and adoption barriers for scalable nanomaterial production.</p>${link("/journal/", "Read the related research papers")}${link("/venture", "Explore customer discovery and the CFE commercialization strategy")}</section>`,
  },
  {
    path: "/AcademicCV",
    title: "Academic CV | Saeed Arabha | Materials Research",
    description: "Academic curriculum vitae of Saeed Arabha, including education, research interests, publications, teaching, qualifications, and awards.",
    body: `<h1>Academic CV</h1><p class="lead">Saeed Arabha · Materials science and engineering</p>
      <p>My academic work spans two-dimensional materials, graphene exfoliation, nanomaterial characterization, molecular simulation, and thermal transport.</p>
      <section><h2>Research interests</h2><p>Graphene and 2D nanomaterials; compressible flow exfoliation; process development; microscopy and spectroscopy; molecular dynamics and computational modeling.</p></section>
      <section><h2>Publications</h2><p>Explore peer-reviewed work and plain-language explanations in the journal.</p>${link("/journal/", "Browse publications")}</section>`,
  },
  {
    path: "/Graphene",
    title: `${grapheneArticle.title} | Saeed Arabha`,
    description: grapheneArticle.description,
    type: 'article',
    schema: schemaFor('/Graphene'),
    body: `<h1>${escape(grapheneArticle.title)}</h1>${paragraph(grapheneArticle.intro)}
      <section><h2>Explore the carbon lattice in 3D</h2><p>Rotate the model, separate its layers, and isolate one graphene sheet. The illustration uses exaggerated atom sizes and spacing for clarity.</p></section>
      <section><h2>See the bigger picture</h2>${grapheneArticle.gallery.map(item => `<figure><img src="${item.src}" width="${item.width}" height="${item.height}" alt="${escape(item.alt)}" loading="lazy"><figcaption>${escape(item.title)}. ${escape(item.caption)}</figcaption></figure>`).join('')}</section>
      <section><h2>Measured properties</h2>${grapheneArticle.measurements.map(item => `<h3>${escape(item.value)}: ${escape(item.label)}</h3>${paragraph(item.detail)}`).join('')}</section>
      <section><h2>Production routes</h2>${grapheneArticle.methods.map(row => `<h3>${escape(row[0])}</h3>${paragraph(row[1] + ' ' + row[2])}`).join('')}</section>
      ${grapheneArticle.sections.map(section => `<section id="${section.id}"><h2>${escape(section.title)}</h2>${section.paragraphs.map((text, i) => paragraph(text) + ((section.paragraphSources || i === section.paragraphs.length - 1) ? link(grapheneArticle.sources[section.paragraphSources?.[i] ?? section.source].url, 'Source') : '')).join('')}${grapheneArticle.diagrams.filter(item => item.chapter === section.id).map(item => `<figure><h3>${escape(item.title)}</h3>${item.generated ? `<img src="${item.src}" width="${item.width}" height="${item.height}" alt="${escape(item.alt)}" loading="lazy">${paragraph("AI-generated teaching illustration; atomic sizes and spacing are illustrative.")}` : ""}${item.steps.map(step => `${step.src ? `<img src="${step.src}" width="${step.width || 320}" height="${step.height || 180}" alt="${escape(step.alt || "")}" loading="lazy">` : ""}<h4>${escape(step.title)}</h4>${paragraph(step.text)}${step.generated ? paragraph("AI-generated conceptual illustration; not to scale.") : ""}${step.stages ? paragraph(step.stages.join(" → ")) : ""}${step.result ? paragraph(step.result) : ""}`).join('')}<figcaption>${escape(item.takeaway)}</figcaption></figure>`).join('')}${grapheneArticle.literatureFigures.filter(item => item.chapter === section.id).map(item => `<figure><h3>${escape(item.title)}</h3>${paragraph(item.takeaway)}${paragraph(item.startHere)}<img src="${item.src}" alt="${escape(item.alt)}" loading="lazy"><figcaption>${paragraph(item.caption)}${paragraph(item.reading)}${paragraph(item.credit)}${link(item.url, 'Original paper / DOI')}${link(item.figureUrl, 'Publisher figure')}${link(item.licenseUrl, item.license)}${paragraph(item.changes)}</figcaption></figure>`).join('')}</section>`).join('')}
      <section><h2>Graphene applications</h2>${grapheneArticle.applications.map(item => `<section id="${item.id}"><h3>${escape(item.title)}</h3>${paragraph(item.text)}<figure><img src="${item.figure.src}" alt="${escape(item.figure.alt)}" loading="lazy"><figcaption>${paragraph(item.figure.caption)}${paragraph(item.figure.credit)}${link(item.figure.url,"Research behind this idea")}</figcaption></figure><h4>Where does it go?</h4>${paragraph(item.form)}<h4>How can it help?</h4>${paragraph(item.contribution)}<h4>What must work?</h4>${paragraph(item.challenge)}${link(grapheneArticle.sources[item.source].url, 'Source')}</section>`).join('')}</section>
      <section><h2>Key takeaways</h2>${grapheneArticle.takeaways.map(paragraph).join('')}</section>
      <section><h2>Common questions about graphene</h2>${grapheneArticle.faq.map(item => `<h3>${escape(item.question)}</h3>${paragraph(item.answer)}`).join('')}</section>
      <section><h2>Continue exploring</h2>${link('/R&D-Portfolio', 'Explore my R&D work')}${link('/journal/', 'Read the research')}</section>
      <section><h2>Sources and further reading</h2>${grapheneArticle.sources.map(source => link(source.url, source.label)).join('')}</section>`,
  },
  {
    path: "/research-progress",
    title: "Research Journey | Saeed Arabha",
    description: "Follow Saeed Arabha's research from nanofluid interfaces and thermal transport to 2D materials, machine learning models, and scalable nanomanufacturing.",
    body: `<h1>Research journey</h1><p class="lead">From interfaces to scalable nanomanufacturing</p>
      <section><h2>Nanofluid interfaces</h2><p>My earlier research examined thermal resistance and molecular ordering where nanoparticles meet water.</p></section>
      <section><h2>Two-dimensional materials</h2><p>I studied how geometry, defects, and mechanical deformation affect the performance of graphene and related materials.</p></section>
      <section><h2>Machine learning and manufacturing</h2><p>More recent work uses machine learning interatomic potentials and investigates gas-driven exfoliation as a route to larger-scale production.</p>${link("/journal/", "Explore the research archive")}</section>`,
  },
];

pages.push({
  path: "/journal/",
  title: "Journal Publications | Saeed Arabha | Graphene & Materials Research",
  description: "Explore Saeed Arabha's research papers on graphene exfoliation, two-dimensional materials, thermal transport and molecular dynamics, each explained in plain language.",
  body: `<h1>The Journal</h1><p class="lead">Research papers on materials, heat, forces, and two-dimensional sheets</p>
    <p>These publication stories explain the questions, methods, and findings behind my peer-reviewed research.</p>
    <section><h2>Publication archive</h2>${papers.map((paper) => `<article><h3>${link(`/journal/${paper.slug}/`, paper.title)}</h3><p>${escape(paper.journal)} · ${escape(paper.year)}</p>${paragraph(paper.summary)}</article>`).join("")}</section>`,
  schema: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Journal Publications | Saeed Arabha", url: `${site}/journal/`, mainEntity: { "@type": "ItemList", itemListElement: papers.map((paper, i) => ({ "@type": "ListItem", position: i + 1, url: `${site}/journal/${paper.slug}/`, name: paper.title })) } },
});

for (const paper of papers) {
  const path = `/journal/${paper.slug}/`;
  pages.push({
    path,
    title: `${paper.title} | Journal | Saeed Arabha`,
    description: paper.summary,
    type: "article",
    body: `<article><p>${link("/journal/", "← All journal papers")}</p><h1>${escape(paper.editorial.headline)}</h1>
      <p class="lead">${escape(paper.editorial.standfirst)}</p>
      <p>${escape(paper.journal)} · ${escape(paper.year)} · ${escape(paper.authors.join(", "))}</p>
      <section><h2>${escape(paper.editorial.openingTitle || "Research context")}</h2>${paragraph(paper.story.context)}${paragraph(paper.story.question)}</section>
      <section><h2>${escape(paper.editorial.methodsTitle || "Approach")}</h2>${paragraph(paper.story.approach)}${paragraph(paper.editorial.methodNote)}</section>
      <section><h2>Key findings</h2>${paper.story.results.map((result) => `<h3>${escape(result.label)}</h3>${paragraph(result.detail)}`).join("")}</section>
      <section><h2>${escape(paper.editorial.endingTitle || "What this means")}</h2>${paragraph(paper.story.takeaway)}${paragraph(paper.editorial.endingNote)}</section>
      <p>${link(paper.url, "Read the original published paper")}</p>${papers.slice(0,2).some(item=>item.slug===paper.slug) ? `<p>${link("/venture", "From this research to customer discovery: the CFE commercialization case")}</p>` : ""}</article>`,
    schema: { "@context": "https://schema.org", "@type": "Article", headline: paper.editorial.headline, description: paper.summary, author: { "@type": "Person", name: "Saeed Arabha" }, mainEntityOfPage: `${site}${path}`, about: { "@type": "ScholarlyArticle", headline: paper.title, url: paper.url, datePublished: String(paper.year) } },
  });
}

const snapshotStyle = `<style id="seo-snapshot-style">#root>.seo-snapshot{box-sizing:border-box;min-height:100vh;background:#020201;color:#f5f1e9;padding:36px max(24px,calc((100vw - 900px)/2));font:400 17px/1.7 Arial,sans-serif}#root>.seo-snapshot img{max-width:100%;height:auto}#root>.seo-snapshot svg{max-width:100%;height:auto}#root>.seo-snapshot section{margin:48px 0}#root>.seo-snapshot button{padding:10px;margin:5px}#root>.seo-snapshot details{margin:18px 0}#root>.seo-snapshot a{color:#edbd9d}#root>.seo-snapshot nav{display:flex;flex-wrap:wrap;gap:12px 22px;margin-bottom:70px}#root>.seo-snapshot h1{font:400 clamp(42px,7vw,76px)/1.1 Georgia,serif}#root>.seo-snapshot h2{font:400 34px/1.2 Georgia,serif;margin-top:64px}#root>.seo-snapshot h3{font-size:21px}#root>.seo-snapshot article{margin:32px 0}#root>.seo-snapshot .lead{font-size:21px;color:#dccbbd}</style>`;

for (const page of pages) {
  const canonical = `${site}${page.path}`;
  const imageUrl = page.image ? new URL(page.image, site).href : null;
  const meta = `<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="${page.type || "website"}"><meta property="og:site_name" content="Saeed Arabha"><meta property="og:url" content="${escape(canonical)}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:locale" content="en_US"><meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}">${imageUrl ? `<meta property="og:image" content="${escape(imageUrl)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(page.imageAlt)}"><meta name="twitter:image" content="${escape(imageUrl)}"><meta name="twitter:image:alt" content="${escape(page.imageAlt)}">` : ''}${page.schema ? `<script id="site-structured-data" type="application/ld+json">${json(page.schema)}</script>` : ""}`;
  const html = template
    .replace(/<meta name="description"[\s\S]*?>/, "")
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace("</head>", `${meta.replace(/<(title|meta|link|script)\b/g, '<$1 data-rh="true" data-seo-snapshot="true"')}${snapshotStyle}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-snapshot">${nav}${page.isFullPage ? page.body : `<main>${page.body}</main>`}</div></div>`)
    .replace(/^[ \t]+$/gm, "");
  const output = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  mkdirSync(join(output, ".."), { recursive: true });
  writeFileSync(output, html);
}

writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${escape(`${site}${page.path}`)}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`Generated ${pages.length} crawlable public pages and sitemap.xml`);
