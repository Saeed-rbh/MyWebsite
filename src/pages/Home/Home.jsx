import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import styles from "./Home.module.css";
import SEO from "../../components/SEO/SEO";
import MainText from "./MainText";
import Popup from "../../components/Popup/Popup";
import { popupsData } from "../../data/homePopupsData";

import { useSelector } from "react-redux";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.ui);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Now we just track the current index in the popup journey
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [originRect, setOriginRect] = useState(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!visibility || !nameRef.current) return;

    const name = nameRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let previousX = 0;

    const drift = () => {
      if (reducedMotion.matches) return;

      let x;
      do {
        x = Math.random() * 100;
      } while (Math.abs(x - previousX) < 35);

      const duration = 8000 + Math.random() * 5000;
      name.style.transition = `background-position ${duration}ms ease-in-out`;
      name.style.backgroundPosition = `${x}% 50%`;
      previousX = x;
      timer = window.setTimeout(drift, duration);
    };

    const handleMotionChange = () => {
      window.clearTimeout(timer);
      name.style.transition = "";
      name.style.backgroundPosition = "";
      previousX = 0;
      if (!reducedMotion.matches) timer = window.setTimeout(drift, 1200);
    };

    reducedMotion.addEventListener("change", handleMotionChange);
    handleMotionChange();

    return () => {
      window.clearTimeout(timer);
      reducedMotion.removeEventListener("change", handleMotionChange);
      name.style.transition = "";
      name.style.backgroundPosition = "";
    };
  }, [visibility]);

  const handleWordClick = (word, e) => {
    const normalizedWord = word.replace(/-/g, " ").toLowerCase();

    if (e && e.currentTarget) {
      setOriginRect(e.currentTarget.getBoundingClientRect());
    }

    // Find which popup matches the clicked word
    const matchedIndex = popupsData.findIndex(p => 
      p.keywordMatches.some(kw => normalizedWord.includes(kw))
    );

    if (matchedIndex !== -1) {
      setCurrentPopupIndex(matchedIndex);
      setPopupOpen(true);
      window.location.hash = popupsData[matchedIndex].hash;
    }
  };

  const handleNextPopup = () => {
    if (currentPopupIndex < popupsData.length - 1) {
      const nextIndex = currentPopupIndex + 1;
      setCurrentPopupIndex(nextIndex);
      window.location.hash = popupsData[nextIndex].hash;
    }
  };

  const handlePrevPopup = () => {
    if (currentPopupIndex > 0) {
      const prevIndex = currentPopupIndex - 1;
      setCurrentPopupIndex(prevIndex);
      window.location.hash = popupsData[prevIndex].hash;
    }
  };

  const currentPopup = popupsData[currentPopupIndex];

  return (
    visibility && (
      <>
        <div
          className={styles.container}
          data-site-motion-ignore="true"
        >
          <SEO
            title="Saeed Arabha | Materials Scientist & Researcher"
            description="Saeed Arabha connects materials science, process development, and metrology through graphene research, experimental characterization, and computational modeling. Explore his R&D work and academic CV."
            name="Saeed Arabha"
            type="website"
          />
          <main className={styles.homeMain}>
            <div className={styles.heroGrid}>
              <div className={styles.heroTitle}>
                <div className={styles.heroMark}>
                  <span className={styles.greeting} aria-hidden="true">Hello.</span>
                  <h1><span className={styles.namePrefix}>I'm</span> <em ref={nameRef}>Saeed Arabha.</em></h1>
                </div>
                <p className={styles.heroRole}><span className={styles.desktopCopy}>Materials scientist</span><span className={`${styles.roleSeparator} ${styles.desktopCopy}`} aria-hidden="true" /><span className={styles.desktopCopy}>Process &amp; metrology engineer</span><span className={styles.mobileCopy}>Materials · Process · Metrology</span></p>
              </div>
              <div className={styles.heroAside}>
                <span className={styles.asideLabel}>MATERIALS · PROCESS · METROLOGY</span>
                <ol className={styles.asideStatement} aria-label="Materials, process, and metrology">
                  <li><span className={styles.progressCue} aria-hidden="true"><i /><i /><i /></span><span className={styles.progressWord}><span className={styles.desktopCopy}>develop materials</span><span className={styles.mobileCopy}>develop</span></span></li>
                  <li><span className={styles.progressCue} aria-hidden="true"><i /><i /><i /></span><span className={styles.progressWord}><span className={styles.desktopCopy}>engineer processes</span><span className={styles.mobileCopy}>refine</span></span></li>
                  <li><span className={styles.progressCue} aria-hidden="true"><i /><i /><i /></span><span className={styles.progressWord}><span className={styles.desktopCopy}>measure quality</span><span className={styles.mobileCopy}>measure</span></span></li>
                </ol>
              </div>
            </div>
            <div className={styles.storyGrid}>
              <span className={styles.sectionLabel}><span className={styles.sectionMarker} aria-hidden="true" />A closer look at the work</span>
              <div className={styles.storyBody}>
                <MainText onWordClick={handleWordClick} />
                <p className={styles.interactionHint}>
                  <span className={styles.hintDot} aria-hidden="true" />
                  <span className={styles.desktopCopy}>Need materials, process, or metrology expertise?</span><span className={styles.mobileCopy}>Building your R&amp;D team?</span>
                  <a href="mailto:saeedarabha@outlook.com">Let’s talk.</a>
                </p>
              </div>
            </div>
          </main>
          <Popup
            isOpen={popupOpen}
            onClose={() => {
              setPopupOpen(false);
              window.history.pushState("", document.title, window.location.pathname + window.location.search);
            }}
            topic={currentPopup}
            originRect={originRect}
            onNext={handleNextPopup}
            onPrev={handlePrevPopup}
            hasNext={currentPopupIndex < popupsData.length - 1}
            hasPrev={currentPopupIndex > 0}
            nextTitle={currentPopupIndex < popupsData.length - 1 ? popupsData[currentPopupIndex + 1].shortTitle : null}
            prevTitle={currentPopupIndex > 0 ? popupsData[currentPopupIndex - 1].shortTitle : null}
          />
        </div>
      </>
    )
  );
};
export default HomePage;
