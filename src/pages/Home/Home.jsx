import React, { useEffect, useState } from "react";
import "./Home.css";
import styles from "./Home.module.css";
import SEO from "../../components/SEO/SEO";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import Popup from "../../components/Popup/Popup";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.ui);
  const { currentPage } = useSelector((state) => state.ui);

  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", content: "" });

  const handleWordClick = (word) => {
    const normalizedWord = word.replace(/-/g, " ").toLowerCase();

    if (normalizedWord.includes("2d nanomaterials") || normalizedWord.includes("2d materials")) {
      setPopupContent({
        title: "What Are 2D Materials?",
        content: (
          <div style={{ textAlign: 'left' }}>
            <p style={{ marginBottom: '1rem' }}><strong>Imagine a material so thin, it is practically invisible.</strong></p>
            <p style={{ marginBottom: '1rem' }}>
              Almost everything in our world is three-dimensional (3D): it has length, width, and height. Even a thin sheet of paper is thousands of atoms thick.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              2D materials are different. They consist of just a single layer of atoms arranged in a flat sheet. This makes them the thinnest possible materials in the universe.
            </p>

            <h3 style={{
              color: 'transparent',
              marginBottom: '0',
              fontFamily: 'DM Serif Display, serif',
              fontSize: '2rem',
              textAlign: 'left',
              background: 'linear-gradient(to right, #b9603275 0%, #d4a58dad 50%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>The "Deck of Cards" Analogy</h3>
            <p style={{ marginBottom: '2rem', marginTop: '0' }}>
              Think of a normal block of material—like the graphite lead in a pencil—as a full deck of playing cards bonded together. A 2D material is what you get if you manage to peel off just a single card from that deck. It is the same basic stuff, but now in an ultra-thin form.
            </p>

            <h3 style={{
              color: 'transparent',
              marginBottom: '0',
              fontFamily: 'DM Serif Display, serif',
              fontSize: '2rem',
              textAlign: 'left',
              background: 'linear-gradient(to right, #b9603275 0%, #d4a58dad 50%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Why Are They Special?</h3>
            <p style={{ marginBottom: '1rem', marginTop: '0' }}>When materials get this thin, they stop acting like "normal" matter and develop amazing new properties:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff' }}>Super Strength:</strong> Despite being thin, the atomic bonds are incredibly tight. Some are hundreds of times stronger than steel.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff' }}>Extreme Flexibility:</strong> They can be bent, twisted, or folded like fabric without breaking.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff' }}>Super Conductivity:</strong> Electricity and heat can zip through some of them faster than almost any other material.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#fff' }}>Transparency:</strong> They are so thin that light passes right through them.</li>
            </ul>

            <h3 style={{
              color: 'transparent',
              marginBottom: '0',
              fontFamily: 'DM Serif Display, serif',
              fontSize: '2rem',
              textAlign: 'left',
              background: 'linear-gradient(to right, #b9603275 0%, #d4a58dad 50%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>How Will They Change the Future?</h3>
            <p style={{ marginBottom: '1rem', marginTop: '0' }}>Because of these unique "superpowers," scientists are using 2D materials to develop new technologies, including:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Bendable electronics (like roll-up electronic newspapers or flexible phones).</li>
              <li style={{ marginBottom: '0.5rem' }}>Ultra-fast charging batteries for electric cars and devices.</li>
              <li style={{ marginBottom: '0.5rem' }}>Advanced water filters that can easily remove salt from seawater.</li>
              <li style={{ marginBottom: '0.5rem' }}>Tiny medical sensors wearable on the skin to track health.</li>
            </ul>

            <h3 style={{
              color: 'transparent',
              marginBottom: '0',
              fontFamily: 'DM Serif Display, serif',
              fontSize: '2rem',
              textAlign: 'left',
              background: 'linear-gradient(to right, #b9603275 0%, #d4a58dad 50%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Famous 2D Materials</h3>
            <p style={{ marginBottom: '1rem', marginTop: '0' }}>While there are hundreds of different 2D materials being studied today, here are a few of the most famous ones:</p>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#fff' }}>Graphene (The Superstar)</strong><br />
                This is the original and most famous 2D material. It is made of carbon atoms arranged in a honeycomb pattern. It was discovered when scientists used sticky tape to peel layers off a block of graphite pencil lead until only one layer remained. It is incredibly strong and the best conductor of electricity and heat known to man.
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#fff' }}>Hexagonal Boron Nitride ("White Graphene")</strong><br />
                Structurally, this looks very similar to graphene, but it is made of boron and nitrogen atoms instead of carbon. Unlike conductive graphene, "white graphene" is an excellent electrical insulator. It is often used alongside graphene to build tiny electronic layers.
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#fff' }}>Molybdenum Disulfide (MoS2)</strong><br />
                While graphene is a great conductor, MoS2 is a "semiconductor"—the same type of material used to make computer chips. Because it is flexible and thin, it could be used to make the ultra-thin, bendable computer processors of the future.
              </li>
            </ol>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "2DNanomaterials";
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

  return (
    visibility && (
      <div className={styles.container}>
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
          title={popupContent.title}
          content={popupContent.content}
        />
      </div>
    )
  );
};
export default HomePage;
