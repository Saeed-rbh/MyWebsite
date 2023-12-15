import React, { useState, useEffect } from "react";
import { animated, useSpring, easings } from "react-spring";
import { List } from "./ResearchInterests/List";

const ResearchInterests = ({
  Data,
  CloseOpen,
  setCloseOpen,
  MouseHover,
  setMouseHover,
  MainElementSize,
}) => {
  const widthoffser = Data.padding[1] + Data.padding[3] - 50;
  const [left, setLeft] = useState(Data.iniRL);
  const [ElementWidth, setElementWidth] = useState(Data.width);

  useEffect(() => {
    if (MainElementSize.width > 0) {
      setElementWidth((Data.iniRL / 100) * MainElementSize.width - widthoffser);
      if (ElementWidth < Data.width) {
        setLeft(0);
        setElementWidth(MainElementSize.width - widthoffser);
      } else if (ElementWidth > Data.width) {
        setLeft(Data.iniRL);
        setElementWidth(
          (Data.iniRL / 100) * MainElementSize.width - widthoffser
        );
      }
    }
  }, [Data]);

  const isPageTitleActive = CloseOpen[1] === Data.title && CloseOpen[0];
  const isMouseHoverActive = MouseHover[1] === Data.title && MouseHover[0];

  const baseStyle = {
    backgroundColor: Data.background,
    width: `${ElementWidth}px`,
    minWidth: Data.width,
    padding: `${Data.padding[0]}px ${Data.padding[1]}px ${
      isPageTitleActive ? 40 : Data.padding[2]
    }px ${Data.padding[3]}px`,
    height: isPageTitleActive || isMouseHoverActive ? "120px" : "30px",
    top: Data.top,
    left: `${left}%`,
    easing: easings.easeOutCubic,
  };

  const CloseOpenStyleBase = useSpring(baseStyle);
  const CloseOpenStyleQualiList = useSpring({
    marginTop: isPageTitleActive ? "60px" : "-10px",
    easing: easings.easeOutCubic,
  });

  return (
    <>
      <animated.div
        ref={Data.ref}
        style={{
          ...CloseOpenStyleBase,
          zIndex: isPageTitleActive || isMouseHoverActive ? "21" : "11",
        }}
        className={Data.name}
      >
        <animated.h1 style={{ marginTop: "-10px", marginLeft: "10px" }}>
          {Data.title}
        </animated.h1>
        <animated.div style={CloseOpenStyleQualiList} className="RInterests">
          {List.map((topic) => (
            <a key={topic.label} href={topic.href}>
              {topic.label}
            </a>
          ))}
        </animated.div>
      </animated.div>
    </>
  );
};

export default ResearchInterests;
