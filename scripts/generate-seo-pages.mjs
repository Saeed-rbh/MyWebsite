import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Give each public SPA route useful HTML before JavaScript runs. React replaces
// this snapshot on mount; the content is drawn from the same editorial data.
const site = "https://saeedarabha.com";
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const template = readFileSync(join(dist, "index.html"), "utf8");
const papers = JSON.parse(readFileSync(new URL("../src/data/journalPapers.json", import.meta.url), "utf8"));
const escape = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const paragraph = (value) => `<p>${escape(value)}</p>`;
const link = (href, label) => `<a href="${escape(href)}">${escape(label)}</a>`;
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const nav = `<nav aria-label="Main navigation">${[
  ["/", "Home"], ["/R&D-Portfolio", "R&D portfolio"], ["/AcademicCV", "Academic CV"],
  ["/journal/", "Journal"], ["/research-progress", "Research journey"],
].map(([url, label]) => link(url, label)).join("")}</nav>`;

const pages = [
  {
    path: "/",
    title: "Saeed Arabha | Materials Scientist & Researcher",
    description: "Saeed Arabha connects materials science, process development, and metrology through graphene research, experimental characterization, and computational modeling. Explore his R&D work and academic CV.",
    body: `<h1>Saeed Arabha</h1><p class="lead">Materials scientist · Process and metrology engineer</p>
      <p>I develop materials, engineer processes, and measure quality, connecting experiments with computational models.</p>
      <section><h2>Research and development</h2><p>My work focuses on graphene and other two-dimensional materials, compressible flow exfoliation, characterization, and thermal transport.</p>${link("/R&D-Portfolio", "Explore the R&D portfolio")}</section>
      <section><h2>Selected research areas</h2><ul>
      <li>Compressible flow exfoliation and scalable production of 2D nanomaterials</li>
      <li>Metrology using microscopy, spectroscopy, and Raman measurements</li>
      <li>Molecular dynamics, fluid dynamics, and machine learning models</li></ul>
      ${link("/journal/", "Read the journal and publication stories")}</section>
      <section><h2>Background</h2><p>See my education, publications, teaching, and research experience in the academic CV.</p>${link("/AcademicCV", "View the academic CV")}</section>`,
    schema: { "@context": "https://schema.org", "@type": "WebSite", name: "Saeed Arabha", url: `${site}/` },
  },
  {
    path: "/R&D-Portfolio",
    title: "R&D Portfolio | Saeed Arabha | Materials, Process & Metrology",
    description: "Explore Saeed Arabha's R&D work in graphene and 2D materials, compressible flow exfoliation, experimental characterization, modeling, and scale-up.",
    body: `<h1>Materials, process, and metrology</h1><p class="lead">Research and development portfolio</p>
      <p>My research connects how two-dimensional materials are produced with their structure, quality, and possible uses. I study graphene, hexagonal boron nitride, and molybdenum disulfide through experiments and modeling.</p>
      <section><h2>Compressible flow exfoliation</h2><p>High-pressure gas flow can separate layered feedstocks into thinner nanoplatelets. I investigate pressure, temperature, carrier gas, and flow conditions to understand material quality and production behavior.</p></section>
      <section><h2>Characterization and process feedback</h2><p>Microscopy and spectroscopy reveal morphology, chemistry, structure, and defects. These measurements help connect a change in processing conditions with the material produced.</p></section>
      <section><h2>Modeling and scale-up</h2><p>Computational fluid dynamics and molecular simulations help test mechanisms and guide experiments. I also explore industry needs and adoption barriers for scalable nanomaterial production.</p>${link("/journal/", "Read the related research papers")}</section>`,
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
    title: "Graphene Research | Saeed Arabha",
    description: "Explore Saeed Arabha's graphene research, from layered graphite to graphene and related two-dimensional materials.",
    body: `<h1>Graphene research</h1><p class="lead">From graphite to two-dimensional materials</p>
      <p>Graphene is a single layer of carbon atoms. My work investigates how gas-driven processing separates layered materials, and how structure and defects affect the resulting nanoplatelets.</p>${link("/journal/", "Read the research papers")}`,
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
      <p>${link(paper.url, "Read the original published paper")}</p></article>`,
    schema: { "@context": "https://schema.org", "@type": "Article", headline: paper.editorial.headline, description: paper.summary, author: { "@type": "Person", name: "Saeed Arabha" }, mainEntityOfPage: `${site}${path}`, about: { "@type": "ScholarlyArticle", headline: paper.title, url: paper.url, datePublished: String(paper.year) } },
  });
}

const snapshotStyle = `<style id="seo-snapshot-style">#root>.seo-snapshot{box-sizing:border-box;min-height:100vh;background:#020201;color:#f5f1e9;padding:36px max(24px,calc((100vw - 900px)/2));font:400 17px/1.7 Arial,sans-serif}#root>.seo-snapshot a{color:#edbd9d}#root>.seo-snapshot nav{display:flex;flex-wrap:wrap;gap:12px 22px;margin-bottom:70px}#root>.seo-snapshot h1{font:400 clamp(42px,7vw,76px)/1.1 Georgia,serif}#root>.seo-snapshot h2{font:400 34px/1.2 Georgia,serif;margin-top:64px}#root>.seo-snapshot h3{font-size:21px}#root>.seo-snapshot article{margin:32px 0}#root>.seo-snapshot .lead{font-size:21px;color:#dccbbd}</style>`;

for (const page of pages) {
  const canonical = `${site}${page.path}`;
  const meta = `<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="${page.type || "website"}"><meta property="og:site_name" content="Saeed Arabha"><meta property="og:url" content="${escape(canonical)}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}">${page.schema ? `<script type="application/ld+json">${json(page.schema)}</script>` : ""}`;
  const html = template
    .replace(/<meta name="description"[\s\S]*?>/, "")
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace("</head>", `${meta}${snapshotStyle}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-snapshot">${nav}<main>${page.body}</main></div></div>`)
    .replace(/^[ \t]+$/gm, "");
  const output = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  mkdirSync(join(output, ".."), { recursive: true });
  writeFileSync(output, html);
}

writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${escape(`${site}${page.path}`)}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`Generated ${pages.length} crawlable public pages and sitemap.xml`);
