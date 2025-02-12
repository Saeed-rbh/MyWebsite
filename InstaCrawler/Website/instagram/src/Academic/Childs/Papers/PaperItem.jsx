import React, { useCallback } from "react";
import { RiDownloadCloudFill } from "react-icons/ri";
import { HiArrowSmRight } from "react-icons/hi";
import { SiGooglescholar } from "react-icons/si";
import { useSpring, animated, easings } from "react-spring";
import { useInView } from "react-intersection-observer";
import { Stage } from "@react-three/drei";

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const PaperItem = ({
  key,
  paper,
  ChildRefs,
  isOpen,
  handleToggle,
  loadPaper,
  Openclose,
  stages,
}) => {
  const openInfoMainStyle = useSpring({
    paddingBottom: Openclose ? "0px" : "100px",
    marginBottom: isOpen ? "60px" : "0px",
    zIndex: 100,
  });

  const openInfoStyle = useSpring({
    transform: isOpen ? "translateY(0px)" : "translateY(-40px)",
    opacity: isOpen ? 1 : 0,
  });

  const [paperSvgHoverStyle, setPaperSvgHover] = useSpring(() => ({
    marginLeft: "0px",
    marginRight: "0px",
    backgroundColor: "transparent",
    color: "#fff",
  }));

  const handleMouseOver = useCallback(() => {
    setPaperSvgHover({
      marginLeft: "4px",
      marginRight: "-10px",
      backgroundColor: "#d49d818c",
      color: "#000000c7",
    });
  }, [setPaperSvgHover]);

  const handleMouseLeave = useCallback(() => {
    setPaperSvgHover({
      marginLeft: "0px",
      marginRight: "0px",
      backgroundColor: "transparent",
      color: "#fff",
    });
  }, [setPaperSvgHover]);

  const [inViewRef, inView] = useInView({
    threshold: 0.3,
  });

  const fadeStyle = useSpring({
    opacity: inView ? 1 : 0,
    easing: easings.easingeaseOutCubic,
  });

  const setRefs = useCallback(
    (node) => {
      inViewRef(node);
      if (ChildRefs) ChildRefs.current = node;
    },
    [inViewRef, ChildRefs]
  );

  return (
    <animated.div
      className="PaperAcademic"
      ref={setRefs}
      onClick={handleToggle}
      style={{ ...openInfoMainStyle, ...fadeStyle }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div className="PaperData">
        <p>{paper.Title}</p>
        <div className="paper-details">
          <p
            style={{
              display: "flex",
              alignItems: "center",
              transform: "translateY(-5px)",
              opacity: "1",
              width: "max-content",
            }}
          >
            <p
              style={{
                marginRight: "5px",
                opacity: "1",
                fontWeight: "300",
                color: "#fff",
              }}
            >
              Journal:
            </p>
            {paper.Journal}
          </p>
          <div
            className="read-more"
            style={{ position: "absolute", right: "15px", bottom: "15px" }}
          >
            <h2 style={{ width: "max-content" }}>
              Read more
              <animated.span style={paperSvgHoverStyle}>
                <HiArrowSmRight />
              </animated.span>
            </h2>
          </div>
        </div>
        <div
          className="paper-details"
          style={{ width: stages[1] ? "50%" : "35%" }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              transform: "translateY(-15px)",
              // color: "#fff",
              fontWeight: "400",
              opacity: "1",
            }}
          >
            <p
              style={{
                marginRight: "5px",
                opacity: "1",
                fontWeight: "300",
                color: "#fff",
              }}
            >
              Year:
            </p>
            {paper.Year}
          </p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              transform: "translateY(-15px)",
              fontWeight: "400",
              opacity: "1",
            }}
          >
            <p
              style={{
                marginRight: "5px",
                opacity: "1",
                fontWeight: "300",
                color: "#fff",
              }}
            >
              Citations:
            </p>
            {paper.Citations}
          </p>
        </div>
      </div>
      <div className="MoreInfo">
        <animated.p
          className="ReferMoreInfo"
          style={openInfoStyle}
          onClick={() => openInNewTab(paper.Link)}
        >
          Online Version <SiGooglescholar />
        </animated.p>
        <animated.p
          className="ReferMoreInfo"
          style={openInfoStyle}
          onClick={() => openInNewTab(paper.pdf)}
        >
          Download PDF <RiDownloadCloudFill />
        </animated.p>
      </div>
    </animated.div>
  );
};

export default PaperItem;
