import React, { useEffect, useState } from "react";
import { useSpring, animated, easings } from "react-spring";
import "./Home.css";
import styles from "./Home.module.css";
import SEO from "../../components/SEO/SEO";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import Popup from "../../components/Popup/Popup";
import { popupsData } from "../../data/homePopupsData";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.ui);
  const { currentPage } = useSelector((state) => state.ui);

  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Now we just track the current index in the popup journey
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [originRect, setOriginRect] = useState(null);

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

  useEffect(() => {
    if (visibility && location.pathname === "/" && currentPage === "/") {
      setResumeClicked(1);
    } else if (
      visibility &&
      location.pathname === "/" &&
      currentPage === "/AcademicCV"
    ) {
      setResumeClicked(2);
    } else {
      setResumeClicked(3);
    }
  }, [location.pathname, currentPage, visibility]);

  const currentPopup = popupsData[currentPopupIndex] || { title: "", content: "" };

  const containerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 600, easing: easings.easeInOutQuad }
  });

  return (
    visibility && (
      <>
        <animated.div
          className={styles.container}
          style={containerAnimation}
        >
          <SEO
            title="Saeed Arabha | Home"
            description="Personal website of Saeed Arabha, featuring academic CV, research, and portfolio."
            name="Saeed Arabha"
            type="website"
          />
          <WelcomeMessage MenuHide={resumeClicked} delay={100} />
          <NameMessage MenuHide={resumeClicked} delay={300} />
          <MainText MenuHide={resumeClicked} delay={400} onWordClick={handleWordClick} />
          <HobbyProfession
            MenuHide={resumeClicked}
            delay={resumeClicked === 1 ? 1400 : 200}
          />
          <Popup
            isOpen={popupOpen}
            onClose={() => {
              setPopupOpen(false);
              window.history.pushState("", document.title, window.location.pathname + window.location.search);
            }}
            title={currentPopup.title}
            content={<div key={`${currentPopupIndex}-${popupOpen}`}>{currentPopup.content}</div>}
            originRect={originRect}
            onNext={handleNextPopup}
            onPrev={handlePrevPopup}
            hasNext={currentPopupIndex < popupsData.length - 1}
            hasPrev={currentPopupIndex > 0}
            nextTitle={currentPopupIndex < popupsData.length - 1 ? popupsData[currentPopupIndex + 1].shortTitle : null}
            prevTitle={currentPopupIndex > 0 ? popupsData[currentPopupIndex - 1].shortTitle : null}
          />
        </animated.div>
      </>
    )
  );
};
export default HomePage;
