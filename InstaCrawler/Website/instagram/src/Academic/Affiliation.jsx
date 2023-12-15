// Affiliation.js
import React, { useEffect, useState } from "react";
import { animated, useSpring, easings } from "react-spring";
import { ExternalLink } from "./MyInfo/ExternalLink";
import useElementSize from "./Styles//useElementSize";
import myImage from "../../src/Image/AcademicImg.jpeg";

export const Affiliation = ({ Data, MainElementSize, Ref }) => {
  const widthoffser = Data.height + 55 + Data.padding[1] + Data.padding[3];
  const [right, setRight] = useState(Data.iniRL);
  const [ElementWidth, setElementWidth] = useState(Data.width);

  useEffect(() => {
    if (MainElementSize.width > 0) {
      setElementWidth(
        ((100 - Data.iniRL) / 100) * MainElementSize.width - widthoffser
      );
      if (ElementWidth < Data.width) {
        setRight(0);
        setElementWidth(MainElementSize.width - widthoffser);
      } else if (ElementWidth > Data.width) {
        setRight(Data.iniRL);
        setElementWidth(
          ((100 - Data.iniRL) / 100) * MainElementSize.width - widthoffser
        );
      }
    }
  }, [MainElementSize]);

  const animatedStyle = useSpring({
    backgroundColor: Data.background,
    top: Data.top,
    height: Data.height,
    width: `${ElementWidth}px`,
    minWidth: Data.width,
    right: `${right}%`,
    easing: easings.easeOutCubic,
    padding: `${Data.padding[0]}px ${Data.padding[1]}px ${Data.padding[2]}px ${Data.padding[3]}px`,
  });
  const animatedImgDiv = useSpring({
    position: "absolute",
    display: "flex",
    borderRadius: "40px",
    backgroundColor: Data.background,
    top: Data.top,
    height: Data.height,
    width: `${Data.height}px`,
    minWidth: Data.height,
    left: `0%`,
    easing: easings.easeOutCubic,
    padding: `${Data.padding[0]}px ${Data.padding[1]}px ${Data.padding[2]}px ${Data.padding[3]}px`,
  });

  const animatedImg = useSpring({
    margin: "3px",
    borderRadius: "100%",
    opacity: 0.7,
  });

  return (
    <>
      <animated.div ref={Ref} id={Data.name} style={animatedImgDiv}>
        <animated.img src={myImage} style={animatedImg}></animated.img>
      </animated.div>
      <animated.div className={Data.name} style={animatedStyle}>
        <animated.p
          style={{ transform: `translateY(${-Data.size[0] / 2 - 20}px)` }}
        >
          {Data.title}
        </animated.p>
        <h1>
          PhD,{" "}
          <ExternalLink href="https://www.picssl.ca/">PICSSL Lab</ExternalLink>
        </h1>
        <h1>Lassonde School of Engineering</h1>
        <h1>
          <ExternalLink href="https://www.yorku.ca/">
            York University
          </ExternalLink>{" "}
          Toronto, Canada
        </h1>
      </animated.div>
    </>
  );
};

export default Affiliation;
