import "./AcademicCV.css";
import React, { useState, useRef, useEffect } from "react";
import { animated, easings, useSprings, useSpring } from "react-spring";
import GradientColor from "../CapturedMoments/GradientColor";
import Sections from "./Sections";

const TITLE = "Academic CV";
const CHARACTOR = TITLE.split("");

const AcademicCV = () => {
  const [springs, setSprings] = useSprings(CHARACTOR.length, (index) => ({
    color: GradientColor(index, CHARACTOR.length),
    y: "10px",
    scale: "0",
    opacity: 0,
  }));

  useEffect(() => {
    setSprings((index) => {
      return {
        y: "0px",
        opacity: 0.3,
        scale: "1",
        delay: 50 * index,
        easing: easings.easeOutCubic,
      };
    });
  }, [setSprings]);

  const scrollableDivRef = useRef(null);
  useEffect(() => {
    scrollableDivRef.current.scrollTop = -1500;
  }, []);

  const [CloseOpen, setCloseOpen] = useState([false, undefined]);
  const [MouseHover, setMouseHover] = useState([false, undefined]);
  const CloseOpenStyleBlur = useSpring({
    opacity: CloseOpen[0] ? "1" : MouseHover[0] ? "1" : "0",
    zIndex: "5",
    filter: CloseOpen[0]
      ? "blur(15px)"
      : MouseHover[0]
      ? "blur(5px)"
      : "blur(0px)",
  });
  return (
    <>
      <div ref={scrollableDivRef} id="AcademicCV-M" className="AcademicCV-M">
        {/* <p className="AcademicCV-Text">
          {springs.map((props, index) => (
            <animated.span
              key={index}
              style={{
                transform: props.y.to((y) => `translateY(${y})`),
                opacity: props.opacity,
                color: props.color,
              }}
            >
              {CHARACTOR[index]}
            </animated.span>
          ))}
        </p> */}
        <animated.div
          className="MoreInfoBlur"
          style={{
            ...CloseOpenStyleBlur,
            zIndex:
              MouseHover[1] !== undefined && CloseOpen[0]
                ? "20"
                : MouseHover[1] !== undefined && MouseHover[0]
                ? "20"
                : "10",
          }}
        ></animated.div>
        <animated.div id="MoreInfoAcademic" className="MoreInfoAcademic">
          <Sections
            CloseOpen={CloseOpen}
            setCloseOpen={setCloseOpen}
            MouseHover={MouseHover}
            setMouseHover={setMouseHover}
          />
        </animated.div>
      </div>
    </>
  );
};

export default AcademicCV;
