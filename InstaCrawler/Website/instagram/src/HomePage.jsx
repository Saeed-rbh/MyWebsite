import "./HomePage.css";
import React from "react";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <>
      <div className="HomePage-M">
        <div className="HomePage-M-L">
          <div className="welcome">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * 1 }}
              class="b-hr"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * 1 }}
            >
              Welcome
            </motion.p>
          </div>
          <motion.b
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 2 }}
          >
            It's Saeed Arabha
          </motion.b>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 3 }}
            className="HomePage-M-L-3"
          >
            <svg>
              <g>
                <g>
                  <path d="M77.6.21C46.77,11.58-1.52,36.84,0,76.87,0,77.41,0,78,0,78.5a39.53,39.53,0,0,0,13.06,29.41,20.47,20.47,0,0,0,2.72,2.25,39.39,39.39,0,0,0,21.95,8,16.64,16.64,0,0,0,1.75,0h.18c1.2,0,2.39-.06,3.57-.16h.15l.18,0c.53,0,1-.12,1.58-.19l.41,0a41.68,41.68,0,0,0,5.92-1.35l1-.34c.3-.1.59-.19.88-.3l.56-.22A39.7,39.7,0,0,0,79,83.67a35.05,35.05,0,0,0,.34-3.75c0-.22,0-.42,0-.64s0-.52,0-.78a39.41,39.41,0,0,0-7.09-22.62l-.12-.18c-.32-.45-.65-.9-1-1.34a36.52,36.52,0,0,0-7-7.06c-.43-.34-.88-.68-1.33-1l0,0a39.62,39.62,0,0,0-5.23-3.18c-15.09-10,4.8-26.25,22.71-37.46A3,3,0,0,0,77.6.21Z"></path>
                  <path d="M178.77.21c-30.83,11.37-79.12,36.63-77.56,76.66,0,.54,0,1.08,0,1.63a39.53,39.53,0,0,0,13.06,29.41,20.47,20.47,0,0,0,2.72,2.25,39.39,39.39,0,0,0,22,8,16.64,16.64,0,0,0,1.75,0h.18c1.2,0,2.39-.06,3.57-.16h.15l.18,0c.53,0,1.05-.12,1.58-.19l.41,0a41.68,41.68,0,0,0,5.92-1.35l1-.34c.3-.1.59-.19.88-.3l.56-.22a39.7,39.7,0,0,0,25.08-31.85,35.05,35.05,0,0,0,.34-3.75c0-.22,0-.42,0-.64s0-.52,0-.78a39.41,39.41,0,0,0-7.09-22.62l-.12-.18c-.32-.45-.65-.9-1-1.34a36.52,36.52,0,0,0-7-7.06c-.43-.34-.87-.68-1.33-1l0,0a39.62,39.62,0,0,0-5.23-3.18c-15.09-10,4.8-26.25,22.71-37.46A3,3,0,0,0,178.77.21Z"></path>
                </g>
              </g>
            </svg>
            <p1>
              I am a researcher at Polymer and Inorganic Composites Structures
              and Surfaces Lab (PICSSL), York University, Toronto, Canada. As a
              mechanical engineer, I am working on nanoscale heat transfer and
              molecular phenomena. My main research interests are 2D
              Nanomaterials, Statistical physics, Molecular Dynamics and Heat
              transfe .Besides, I really enjoy having collaboration with people
              in other fields.
            </p1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 4 }}
            className="fav"
          >
            <div className="pro">
              <p1>MASTER IN</p1>
              <p2>Mechanical Engineering</p2>
            </div>
            <div className="pro">
              <p1>HOBBY</p1>
              <p2>Coding - Watching Movies</p2>
            </div>
          </motion.div>
        </div>
        <div className="HomePage-M-R"></div>
      </div>
    </>
  );
};
export default HomePage;
