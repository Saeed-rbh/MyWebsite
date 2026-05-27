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
  const [originRect, setOriginRect] = useState(null);

  const handleWordClick = (word, e) => {
    const normalizedWord = word.replace(/-/g, " ").toLowerCase();

    if (normalizedWord.includes("2d nanomaterials") || normalizedWord.includes("2d materials")) {
      if (e && e.currentTarget) {
        setOriginRect(e.currentTarget.getBoundingClientRect());
      }
      setPopupContent({
        title: "What Are 2D Materials?",
        content: (
          <div style={{ textAlign: 'left' }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                <strong>Imagine a material so thin, it is practically invisible.</strong>
              </p>
              <p className={styles.text}>
                Almost everything in our world is three-dimensional (3D): it has length, width, and height. Even a thin sheet of paper is thousands of atoms thick.
              </p>
              <p className={styles.text} style={{ marginBottom: '1.5rem' }}>
                2D materials are different. They consist of just a single layer of atoms arranged in a flat sheet. This makes them the thinnest possible materials in the universe.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay2}`}>
              <h3 className={styles.miniTitle}>The "Deck of Cards" Analogy</h3>
              <p className={styles.text}>
                Think of a normal block of material—like the graphite lead in a pencil—as a full deck of playing cards bonded together. A 2D material is what you get if you manage to peel off just a single card from that deck. It is the same basic stuff, but now in an ultra-thin form.
              </p>

            </div>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay3}`}>Why Are They Special?</h3>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay3}`}>When materials get this thin, they stop acting like "normal" matter and develop amazing new properties:</p>

            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay3}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Super Strength</span>
                <p className={styles.cardText}>Despite being thin, the atomic bonds are incredibly tight. Some are hundreds of times stronger than steel.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Extreme Flexibility</span>
                <p className={styles.cardText}>They can be bent, twisted, or folded like fabric without breaking.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Super Conductivity</span>
                <p className={styles.cardText}>Electricity and heat can zip through some of them faster than almost any other material.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Transparency</span>
                <p className={styles.cardText}>They are so thin that light passes right through them.</p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay4}`}>
              <h3 className={styles.miniTitle}>Will They Change the Future?</h3>
              <p className={styles.text}>Because of these unique "superpowers," scientists are using 2D materials to develop new technologies, including:</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>Bendable electronics (like roll-up electronic newspapers or flexible phones).</li>
                <li style={{ marginBottom: '0.5rem' }}>Ultra-fast charging batteries for electric cars and devices.</li>
                <li style={{ marginBottom: '0.5rem' }}>Advanced water filters that can easily remove salt from seawater.</li>
                <li style={{ marginBottom: '0.5rem' }}>Tiny medical sensors wearable on the skin to track health.</li>
              </ul>
            </div>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay4}`}>Famous 2D Materials</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay4}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Graphene (The Superstar)</strong>
                <span style={{ color: '#d49d81', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>The Original</span>
                <p className={styles.text} style={{ fontSize: '0.95rem' }}>
                  This is the original and most famous 2D material. It is made of carbon atoms arranged in a honeycomb pattern. It was discovered when scientists used sticky tape to peel layers off a block of graphite pencil lead until only one layer remained. It is incredibly strong and the best conductor of electricity and heat known to man.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Hexagonal Boron Nitride</strong>
                <span style={{ color: '#d49d81', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>"White Graphene"</span>
                <p className={styles.text} style={{ fontSize: '0.95rem' }}>
                  Structurally, this looks very similar to graphene, but it is made of boron and nitrogen atoms instead of carbon. Unlike conductive graphene, "white graphene" is an excellent electrical insulator. It is often used alongside graphene to build tiny electronic layers.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Molybdenum Disulfide (MoS2)</strong>
                <span style={{ color: '#d49d81', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>The Semiconductor</span>
                <p className={styles.text} style={{ fontSize: '0.95rem' }}>
                  While graphene is a great conductor, MoS2 is a "semiconductor"—the same type of material used to make computer chips. Because it is flexible and thin, it could be used to make the ultra-thin, bendable computer processors of the future.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "2DNanomaterials";
    }

    if (normalizedWord.includes("picssl lab") || normalizedWord.includes("picssl")) {
      if (e && e.currentTarget) {
        setOriginRect(e.currentTarget.getBoundingClientRect());
      }
      setPopupContent({
        title: "What Is the PICSSL Lab?",
        content: (
          <div style={{ textAlign: 'left' }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                <strong>Think of us as architects of the microscopic world.</strong>
              </p>
              <p className={styles.text}>
                "PICSSL" stands for Polymer and Inorganic Composites, Structures and Surfaces Lab. We pronounce it "Pixel", because just like pixels make up a digital image, we engineer the tiny building blocks that make up the materials of the future.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img
                  src="/images/dr_rizvi.jpg"
                  alt="Dr. Reza Rizvi"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(212, 157, 129, 0.3)',
                    flexShrink: 0
                  }}
                />
                <p className={styles.text} style={{ margin: 0 }}>
                  Led by Dr. Reza Rizvi at York University's Lassonde School of Engineering, our group focuses on materials science. We take standard materials—like plastics and ceramics—and combine them in unique ways to create "super-materials" with abilities that don't exist in nature.
                </p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay2}`}>
              <h3 className={styles.miniTitle}>The "Chef" Analogy</h3>
              <p className={styles.text}>
                Imagine baking a cake. If you just use flour, you get bread. But if you mix in chocolate chips, sugar, and baking powder in the right way, you get something completely different. Dr. Rizvi and his team do the same thing with engineering materials. By mixing soft plastics with hard inorganic materials, we can create objects that are lighter, stronger, or smarter than anything currently on the market.
              </p>
            </div>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay3}`}>Our Flagship Technology: CFE</h3>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay3}`} style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              How do you mass-produce the world's thinnest materials?
            </p>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay3}`}>
              Our lab is famous for developing a technology called Compressible Flow Exfoliation (CFE).
            </p>

            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay3}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>The Problem</span>
                <p className={styles.cardText}>We know 2D materials like Graphene are amazing, but making them is usually slow, expensive, and difficult—like trying to peel a deck of cards apart one by one with tweezers.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Our Solution (CFE)</span>
                <p className={styles.cardText}>We developed a method that uses supersonic fluid dynamics to do the heavy lifting.</p>
              </div>
              <div className={styles.glassCard} style={{ gridColumn: '1 / -1' }}>
                <span className={styles.cardTitle}>How It Works</span>
                <p className={styles.cardText}>Imagine blasting that "deck of cards" with a wind tunnel moving faster than the speed of sound. The sheer force of the shockwaves blows the layers apart instantly.</p>
              </div>
            </div>

            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: '0.5rem' }}>
              This technology allows us to produce high-quality nanomaterials cheaply, quickly, and at a massive scale—something that is critical for moving these technologies from the lab to the factory.
            </p>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay4}`}>Other Futuristic Projects</h3>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay4}`}>
              While CFE is our engine for creating raw materials, we also use those materials to build incredible devices:
            </p>

            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay4}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Transient Electronics</strong>
                <span style={{ color: '#d49d81', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>(The Vanishing Chip)</span>
                <p className={styles.text} style={{ fontSize: '0.95rem' }}>
                  We are designing electronics that work perfectly but then self-destruct when triggered. Imagine a medical sensor that dissolves safely inside the body after doing its job, or a shipping tracker that disintegrates to reduce electronic waste.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Bio-Inspired "Ice-Proof" Surfaces</strong>
                <span style={{ color: '#d49d81', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block' }}>Nature Inspired</span>
                <p className={styles.text} style={{ fontSize: '0.95rem' }}>
                  We look at nature (like lotus leaves or gecko feet) to engineer surfaces with special textures. We are currently creating materials that are "ice-phobic"—meaning ice cannot stick to them. This could lead to windshields that never frost over or shoe soles that perfectly grip icy sidewalks.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "PICSSL";
    }

    if (normalizedWord.includes("york university")) {
      if (e && e.currentTarget) {
        setOriginRect(e.currentTarget.getBoundingClientRect());
      }
      setPopupContent({
        title: "Our Home Base: York University",
        content: (
          <div style={{ textAlign: 'left' }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                <strong>Where innovation meets real-world impact.</strong>
              </p>
              <p className={styles.text}>
                Located in Toronto, Canada, York University is a powerhouse of research and education. As the third-largest university in Canada, it acts less like a traditional school and more like a bustling city of diverse thinkers, creators, and changemakers.
              </p>
              <p className={styles.text} style={{ marginBottom: '1.5rem' }}>
                York is known for a unique approach: we don't just study the world; we try to solve its problems. From space exploration to fighting climate change, the goal is always positive change.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay2}`}>
              <h3 className={styles.miniTitle}>The Lassonde School of Engineering</h3>
              <p className={styles.text}>
                The PICSSL Lab is proudly part of the Lassonde School of Engineering at York. Lassonde is not your typical engineering school. It was built on the philosophy of the "Renaissance Engineer." This means we don't just teach math and physics; we teach creativity, social responsibility, and ethics.
              </p>
            </div>

            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay3}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>The Goal</span>
                <p className={styles.cardText}>To graduate engineers who don't just build things, but understand why they are building them and how they affect people.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>The Vibe</span>
                <p className={styles.cardText}>It is a modern, hands-on environment where students and researchers (like us!) are encouraged to get their hands dirty and turn ideas into prototypes.</p>
              </div>
            </div>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay4}`}>Why We Love Being Here</h3>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay4}`}>
              Being at York gives our lab a few major advantages:
            </p>

            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay4}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Diversity</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  We work with brilliant minds from all over the world.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Interdisciplinary Research</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  It is easy for us to collaborate with chemists, biologists, and business experts right on campus.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Location</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Being in Toronto places us in the heart of Canada's tech and industry hub.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "YorkUniversity";
    }

    if (normalizedWord.includes("mechanical engineering")) {
      if (e && e.currentTarget) {
        setOriginRect(e.currentTarget.getBoundingClientRect());
      }
      setPopupContent({
        title: "What Is Mechanical Engineering?",
        content: (
          <div style={{ textAlign: 'left' }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                <strong>If it moves, it’s mechanical engineering.</strong>
              </p>
              <p className={styles.text}>
                Mechanical Engineering is one of the oldest and broadest engineering disciplines. While many people hear "mechanical" and think of car engines or gears, it is actually much more than that. It is the science of motion, energy, and force.
              </p>
              <p className={styles.text} style={{ marginBottom: '1.5rem' }}>
                Mechanical engineers figure out how to take an idea and turn it into a physical machine that works safely and efficiently.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay2}`}>
              <h3 className={styles.miniTitle}>The "Skeleton and Muscle" Analogy</h3>
              <p className={styles.text}>
                Think of a robot (or a human body).
              </p>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.8rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(212, 157, 129, 0.3)' }}>
                  <strong style={{ color: '#fff' }}>Computer Engineering</strong> is the brain (the code and logic).
                </li>
                <li style={{ marginBottom: '0.8rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(212, 157, 129, 0.3)' }}>
                  <strong style={{ color: '#fff' }}>Electrical Engineering</strong> is the nervous system (the wires and signals).
                </li>
                <li style={{ marginBottom: '0.8rem', paddingLeft: '1rem', borderLeft: '3px solid #d49d81', backgroundColor: 'rgba(212, 157, 129, 0.05)', borderRadius: '0 5px 5px 0', padding: '0.5rem 0.5rem 0.5rem 1rem' }}>
                  <strong style={{ color: '#d49d81' }}>Mechanical Engineering</strong> is the skeleton and the muscles. We design the physical structure that holds everything together and the systems that allow it to move, lift, and interact with the world.
                </li>
              </ul>
            </div>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay3}`}>It's Not Just Gears and Grease</h3>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay3}`}>
              Modern mechanical engineering is high-tech. Today, mechanical engineers work on:
            </p>

            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay3}`}>
              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Robotics & Automation</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Building machines that build other machines.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Aerospace</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Designing spacecraft and drones.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Biomedical Devices</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Creating artificial limbs or heart valves.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Energy Systems</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Designing wind turbines and batteries.
                </p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay4}`}>
              <h3 className={styles.miniTitle}>The Connection: Why Materials Matter</h3>
              <p className={styles.text}>
                Why is a Mechanical Engineering lab studying atoms? You might wonder why the PICSSL Lab (a mechanical engineering group) is messing around with chemistry and 2D materials.
              </p>
              <p className={styles.text} style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                Here is the secret: A machine is only as good as the material it is made of.
              </p>

              <div className={styles.glassGrid}>
                <div className={styles.glassCard}>
                  <span className={styles.cardTitle}>Process Materials</span>
                  <p className={styles.cardText}>We use fluid mechanics (like wind tunnels) to make nanomaterials.</p>
                </div>
                <div className={styles.glassCard}>
                  <span className={styles.cardTitle}>Test Materials</span>
                  <p className={styles.cardText}>We use mechanical stress tests to see how strong these new materials are.</p>
                </div>
                <div className={styles.glassCard} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.cardTitle}>Build the Future</span>
                  <p className={styles.cardText}>We create the "super-materials" that other mechanical engineers will use to build the cars, robots, and structures of tomorrow.</p>
                </div>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MechanicalEngineering";
    }

    if (normalizedWord.includes("molecular dynamics")) {
      if (e && e.currentTarget) {
        setOriginRect(e.currentTarget.getBoundingClientRect());
      }
      setPopupContent({
        title: "What Is Molecular Dynamics (MD)?",
        content: (
          <div style={{ textAlign: 'left' }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                <strong>Think of it as a flight simulator for atoms.</strong>
              </p>
              <p className={styles.text}>
                In the real world, we use microscopes to look at small things. But sometimes, things are too small or happen too fast for even the most powerful microscope to see.
              </p>
              <p className={styles.text} style={{ marginBottom: '1.5rem' }}>
                Molecular Dynamics (MD) is a computer simulation method. We create a "virtual universe" inside a powerful computer, define the laws of physics, and then watch how individual atoms and molecules move, crash, and interact with each other over time.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay2}`}>
              <h3 className={styles.miniTitle}>The "Billiards" Analogy</h3>
              <p className={styles.text}>
                Imagine a pool table with balls scattered across it. If you hit one ball, you can use physics to predict exactly where it will go and how it will bounce off the others.
              </p>
              <p className={styles.text} style={{ fontStyle: 'italic', borderLeft: '3px solid #d49d81', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                Molecular Dynamics is exactly like that, but instead of 15 pool balls, we are tracking thousands or millions of atoms simultaneously. The computer calculates the force on every single atom to predict exactly how a material will behave.
              </p>
            </div>

            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay3}`}>Why Do We Use It?</h3>
            <p className={`${styles.text} ${styles.animateEnter} ${styles.delay3}`}>
              Simulation is the "secret weapon" of modern materials science because it lets us:
            </p>

            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay3}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>See the Unseeable</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  We can watch how a crack forms in a material at the atomic level, something impossible to capture on camera.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Predict the Future</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  We can test if a new composite material will be strong or weak before we spend the money to build it in the lab.
                </p>
              </div>

              <div className={styles.timelineItem}>
                <strong style={{ color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '-5px' }}>Safety</strong>
                <p className={styles.text} style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  We can simulate extreme conditions—like super-high heat or pressure—without risking safety in the lab.
                </p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay4}`}>
              <h3 className={styles.miniTitle}>How PICSSL Uses MD</h3>
              <p className={styles.text} style={{ marginBottom: '1rem' }}>
                <strong>Testing our "Super-Materials" virtually.</strong> At the PICSSL Lab, we don't just mix chemicals and hope for the best; we use Molecular Dynamics to design our materials intelligently. Since we work with 2D materials (like Graphene) and nanocomposites, the arrangement of every single atom matters. Use MD to:
              </p>

              <div className={styles.glassGrid}>
                <div className={styles.glassCard}>
                  <span className={styles.cardTitle}>Simulate Exfoliation</span>
                  <p className={styles.cardText}>We model how our CFE technology (the supersonic blasts) peels layers of atoms apart.</p>
                </div>
                <div className={styles.glassCard}>
                  <span className={styles.cardTitle}>Design Interfaces</span>
                  <p className={styles.cardText}>We check how well our "hard" fillers will stick to our "soft" polymers to ensure the final product is strong.</p>
                </div>
              </div>

              <p className={styles.text} style={{ marginTop: '1rem', fontSize: '0.95rem', opacity: 0.9 }}>
                By combining these virtual experiments with our real-world experiments, we can discover new materials faster than ever before.
              </p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MolecularDynamics";
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
          originRect={originRect}
        />
      </div>
    )
  );
};
export default HomePage;
