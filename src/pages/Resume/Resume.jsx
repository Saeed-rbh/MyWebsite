import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { researchProfile } from "../../data/homeResume.mjs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import {
  TbArrowsDiagonal, TbArrowUpRight, TbBooks, TbBriefcase, TbDownload, TbFlask,
  TbLayoutDashboard, TbSchool,
} from "react-icons/tb";
import { updateCurrentPage } from "../../actions/Actions";
import { academicCV, publications } from "../../data/academicCV";
import {
  cvResearch, depositionExample, processExample, profileHeading, profileIntro,
  profileToolGroups, selectedPapers, surfaceExample,
} from "../../data/cvResearch.mjs";
import { ScrollFade } from "../Commercialization/StoryMotion";
import portrait from "../../assets/AcademicImg.jpg";
import usePageReveals from "../../components/SiteMotion/usePageReveals";
import SEO from "../../components/SEO/SEO";
import s from "./Resume.module.css";

const mobileLayout = "(max-width: 700px)";
const tabIcons = {
  Overview: TbLayoutDashboard,
  Experience: TbBriefcase,
  Methods: TbFlask,
  Publications: TbBooks,
  Education: TbSchool,
};
const tabs = Object.keys(tabIcons);
const projectTabs = new Map([
  ["process-development", "Overview"],
  ["surface-characterization", "Overview"],
  ["automated-deposition", "Experience"],
  ["selected-papers", "Publications"],
]);

const profileEntrance = {
  autoOpening: false,
  openingTimings: {
    profile: { delay: 0, duration: 540, y: 16 },
    navigation: { delay: 90, duration: 460, y: 8 },
    heading: { delay: 170, duration: 480, y: 10 },
    feature: { delay: 250, duration: 500, y: 14 },
    shortcuts: { delay: 350, duration: 480, y: 12 },
  },
};

function TabContent({ reducedMotion, hash, children }) {
  const isPresent = useIsPresent();
  const content = useRef(null);

  useLayoutEffect(() => {
    const panel = content.current?.closest('[role="tabpanel"]');
    if (!panel) return;

    // Reset after the previous panel has faded, before the incoming panel paints.
    panel.scrollTo({ top: 0, behavior: "instant" });
    const target = projectTabs.has(hash) ? content.current.querySelector(`#${hash}`) : null;
    if (window.matchMedia(mobileLayout).matches && hash) {
      const page = panel.closest("main");
      const dossier = panel.parentElement;
      const offset = target ? parseFloat(getComputedStyle(page).paddingTop) + dossier.firstElementChild.offsetHeight + 16 : 70;
      const top = page.scrollTop + (target || dossier).getBoundingClientRect().top - page.getBoundingClientRect().top - offset;
      page.scrollTo({ top, behavior: "instant" });
    } else if (target) {
      const top = target.getBoundingClientRect().top - panel.getBoundingClientRect().top - 16;
      panel.scrollTo({ top, behavior: "instant" });
    }
  }, [hash]);

  return (
    <motion.div
      ref={content}
      className={s.panelContent}
      aria-hidden={isPresent ? undefined : true}
      inert={!isPresent}
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.12, ease: "easeOut" } }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Resume() {
  const dispatch = useDispatch();
  const cms = useSelector(state => state.data.academicData);
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const page = useRef(null);
  const panel = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(mobileLayout).matches);
  const scrollRoot = isMobile ? page : panel;
  usePageReveals(page, true, profileEntrance);

  useEffect(() => {
    const media = window.matchMedia(mobileLayout);
    const update = () => setIsMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const hash = location.hash === "#academic-record" ? "education" : location.hash.slice(1);
  const active = projectTabs.get(hash) || tabs.find(label => label.toLowerCase().replaceAll(" ", "-") === hash) || "Overview";

  function setActive(label) {
    if (label === active && !projectTabs.has(hash) && location.hash !== "#academic-record") return;
    navigate({ pathname: location.pathname, search: location.search, hash: label.toLowerCase().replaceAll(" ", "-") });
  }
  const [downloadState, setDownloadState] = useState("idle");
  const list = name => cms.find(item => item.name === name)?.list ?? academicCV.find(item => item.name === name)?.list ?? [];
  useEffect(() => { dispatch(updateCurrentPage("/AcademicCV")); }, [dispatch]);

  async function downloadCV() {
    setDownloadState("loading");
    try {
      const [{ pdf }, { default: Document }, { saveAs }] = await Promise.all([
        import("@react-pdf/renderer"), import("./PDF/ResumePDF"), import("file-saver"),
      ]);
      saveAs(await pdf(<Document cvData={academicCV} />).toBlob(), "Saeed_Arabha_CV.pdf");
      setDownloadState("idle");
    } catch { setDownloadState("error"); }
  }

  function navigateTabs(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(tabs[next]);
    document.getElementById(`cv-tab-${next}`)?.focus({ preventScroll: true });
  }

  return (
    <main ref={page} id="AcademicCV-M" className={s.page} data-site-motion-ignore="true">
      <SEO title={`Saeed Arabha | ${researchProfile.label}`} description="Materials process development, characterization and computational research. Explore Saeed Arabha’s experience and download his résumé." />
      <div className={s.workspace}>
        <aside className={s.identity} data-page-entrance="profile">
          <img className={s.portrait} src={portrait} alt="" />
          <div className={s.identityText}>
            <p className={s.kicker}>Materials R&amp;D · Process Development</p>
            <h1 className={s.name}>Saeed Arabha</h1>
            <p className={s.degree}>PhD in Mechanical Engineering · Toronto, ON</p>
          </div>
          <div className={s.contact}>
            <a className={s.primary} href="/materials-rd-resume.pdf" download>Download résumé <TbDownload aria-hidden="true" /></a>
            <button onClick={downloadCV} disabled={downloadState === "loading"}>{downloadState === "loading" ? "Preparing PDF…" : "Academic CV (PDF)"} <TbDownload aria-hidden="true" /></button>
            <a className={s.email} href="mailto:saeedarabha@outlook.com">Email me</a>
            {downloadState === "error" && <p role="status">Download failed. Please try again.</p>}
          </div>
        </aside>

        <section className={s.dossier} aria-label="Professional profile">
          <motion.div className={s.tabs} data-page-entrance="navigation" layoutScroll role="tablist" aria-label="CV sections">
            {tabs.map((label, index) => {
              const Icon = tabIcons[label];
              return (
                <button
                  key={label}
                  id={`cv-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={active === label}
                  aria-controls="cv-panel"
                  tabIndex={active === label ? 0 : -1}
                  onClick={() => setActive(label)}
                  onKeyDown={event => navigateTabs(event, index)}
                >
                  {active === label && (
                    <motion.span
                      aria-hidden="true"
                      className={s.tabHighlight}
                      layoutId={reducedMotion ? undefined : "cv-active-tab"}
                      transition={{ layout: { type: "spring", stiffness: 450, damping: 42 } }}
                    />
                  )}
                  <span className={s.tabLabel}><Icon aria-hidden="true" />{label}</span>
                </button>
              );
            })}
          </motion.div>
          <div ref={panel} className={s.panel} id="cv-panel" role="tabpanel" aria-labelledby={`cv-tab-${tabs.indexOf(active)}`} tabIndex={0}>
            <div className={s.panelStage}>
              <AnimatePresence initial={false} mode="wait">
                <TabContent key={active} reducedMotion={reducedMotion} hash={hash}>
                  {active === "Overview" && <>
                    <div className={s.heading} data-page-entrance="heading">
                      <h2>{profileHeading}</h2>
                      <p className={s.intro}>{profileIntro}</p>
                    </div>
                    <div className={s.overviewGrid} data-page-entrance="feature">
                      <article className={s.feature} id="process-development">
                        <h3>{processExample.title}</h3>
                        <p>{processExample.summary}</p>
                        <Link to="/R&D-Portfolio" className={s.featureLink}>See the apparatus <TbArrowUpRight aria-hidden="true" /></Link>
                        <div className={s.result}>
                          <strong>{processExample.recovery}<span>%</span></strong>
                          <p>cumulative recovery</p>
                          <img className={s.vial} src="/rnd-materials/graphene-vial.png" alt="Graphene dispersion illuminated by a red laser" width="329" height="837" />
                        </div>
                      </article>
                      <article className={s.surface} id="surface-characterization">
                        <h3>{surfaceExample.title}</h3>
                        <p>{surfaceExample.summary}</p>
                        <Link to="/metrology#check-the-chemistry" className={s.featureLink}>See the XPS analysis <TbArrowUpRight aria-hidden="true" /></Link>
                        <figure className={s.plot}>
                          <a href={surfaceExample.figure} target="_blank" rel="noreferrer" aria-label="Open the full-size MoS₂ XPS plot">
                            <img src={surfaceExample.figure} width="1440" height="542" alt="Fitted MoS₂ XPS spectra for reference, helium-processed, and air-processed samples" />
                            <span className={s.plotExpand} aria-hidden="true"><TbArrowsDiagonal /></span>
                          </a>
                          <figcaption>{surfaceExample.caption}</figcaption>
                        </figure>
                      </article>
                    </div>
                    <div className={s.projectLink} data-page-entrance="shortcuts">
                      <Link to="#automated-deposition">Automated deposition setup <TbArrowUpRight aria-hidden="true" /></Link>
                    </div>
                  </>}

                  {active === "Experience" && <>
                    <div className={s.heading}><h2>Research and engineering experience</h2></div>
                    {[
                      ["Sep 2021 to Sep 2026", "Doctoral Researcher", "York University", "I rebuilt and tested the exfoliation apparatus, varied gas and feed conditions, and measured how those changes affected nanosheet recovery and quality. I also led the molecular simulation study of how graphene layers separate.", "/R&D-Portfolio", "See the exfoliation apparatus"],
                      ["Summer 2025", "Visiting Researcher", "University of Kassel", "I compared protocols for characterizing exfoliated materials during a three-month Mitacs Globalink placement with Claudia Backes’ group.", null],
                      ["2025 – 2026", "Lab2Market Fellow", "Validate and Launch", "Our team drew on more than 40 interviews to identify graphite processing and concrete additives as markets to investigate.", "/venture", "See the Lab2Market project"],
                    ].map(([date, title, org, text, href, linkLabel]) => <ScrollFade root={scrollRoot} subtle as="article" className={s.entry} key={title}><p className={s.kicker}>{date}</p><h3>{title}</h3><p className={s.organization}>{org}</p><p>{text}</p>{href && <Link to={href}>{linkLabel} <TbArrowUpRight aria-hidden="true" /></Link>}</ScrollFade>)}
                    <h3 className={s.subheading}>Selected engineering projects</h3>
                    <ScrollFade root={scrollRoot} subtle as="article" className={s.entry} id="automated-deposition">
                      <h3>{depositionExample.title}</h3>
                      <p>{depositionExample.summary}</p>
                    </ScrollFade>
                    <ScrollFade root={scrollRoot} subtle as="article" className={s.entry}>
                      <h3>PICSSL Equipment</h3>
                      <p>I contributed code to a laboratory web app for instrument reservations, training and analysis requests, and instrument access checks.</p>
                    </ScrollFade>
                  </>}

                  {active === "Methods" && <>
                    <div className={s.heading}><h2>Methods in practice</h2></div>
                    {cvResearch.map(item => <ScrollFade root={scrollRoot} subtle as="article" className={s.entry} key={item.title}><h3>{item.title}</h3><p>{item.text}</p>{item.url && <a href={item.url}>{item.source} <TbArrowUpRight aria-hidden="true" /></a>}</ScrollFade>)}
                    <h3 className={s.subheading}>Tools and techniques</h3>
                    <ScrollFade root={scrollRoot} subtle as="ul" className={s.methodGrid} aria-label="Tools and techniques">
                      {profileToolGroups(list("Skills")).map(group => (
                        <li key={group.title}>
                          <h4>{group.title}</h4>
                          <p>{group.tools.join(" · ")}</p>
                          {group.certification && <p className={s.qualification}>{group.certification}</p>}
                        </li>
                      ))}
                    </ScrollFade>
                  </>}

                  {active === "Publications" && <>
                    <div className={s.heading}><h2>Publications</h2></div>
                    <section id="selected-papers" aria-labelledby="cv-selected-papers">
                      <h3 id="cv-selected-papers" className={s.subheading}>Selected papers</h3>
                      <ul className={s.selectedPapers}>
                        {selectedPapers.map(paper => {
                          const citation = publications.find(item => item.id === paper.slug);
                          return (
                            <li key={paper.slug}>
                              <h4><Link to={`/journal/${paper.slug}/`}>{paper.title} <TbArrowUpRight aria-hidden="true" /></Link></h4>
                              {citation && <p className={s.paperJournal}>{citation.Journal} · {citation.Year}</p>}
                              <p>{paper.contribution}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                    <h3 className={s.subheading}>Full publication list</h3>
                    {publications.map(paper => <ScrollFade root={scrollRoot} subtle as="article" className={`${s.entry} ${s.citation}`} key={paper.id}><p className={s.kicker}>{paper.Year} · {paper.Journal}</p><h4><Link to={`/journal/${paper.id}/`}>{paper.Title} <TbArrowUpRight aria-hidden="true" /></Link></h4><p>{paper.Authors}</p></ScrollFade>)}
                  </>}

                  {active === "Education" && <>
                    <div className={s.heading}><h2>Education</h2></div>
                    {list("Qualifications").map(item => {
                      const isDoctorate = /^PhD\b/i.test(item.title);
                      return (
                        <article className={s.entry} key={item.id}>
                          <h3>{item.title}</h3>
                          <p className={s.organization}>{item.Location}{item.Date && <> · {item.Date}</>}</p>
                          {isDoctorate && item.Thesis && <p><strong>Thesis</strong> · {item.Thesis}</p>}
                          {(item.Supervisor || (!isDoctorate && item.Thesis)) && (
                            <details className={s.degreeDetails}>
                              <summary>Degree details</summary>
                              {!isDoctorate && item.Thesis && <p><strong>Thesis</strong> · {item.Thesis}</p>}
                              {item.Supervisor && <p>Supervised by {item.Supervisor}</p>}
                            </details>
                          )}
                        </article>
                      );
                    })}
                    <details className={s.details}>
                      <summary>Research interests</summary>
                      <p>{list("ResearchInterests").map(item => item.label).join(" · ")}</p>
                    </details>
                    {[["Awards", "Awards and certifications", item => item.Award], ["Teaching", "Teaching", item => item.Teaching], ["Conference", "Conferences and workshops", item => [item.Title, item.Type, item.Location, item.Year].filter(Boolean).join(" · ")]].map(([name, title, render]) => <details className={s.details} key={name}><summary>{title}</summary>{list(name).map((item, index) => <p key={item.id ?? index}>{render(item)}</p>)}</details>)}
                  </>}
                </TabContent>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
