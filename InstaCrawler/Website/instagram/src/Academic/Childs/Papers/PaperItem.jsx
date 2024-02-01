import React, { useCallback } from "react";
import { RiDownloadCloudFill } from "react-icons/ri";
import { HiArrowSmRight } from "react-icons/hi";
import { SiGooglescholar } from "react-icons/si";
import { useSpring, animated, easings } from "react-spring";
import { useInView } from "react-intersection-observer";

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
}) => {
  const openInfoMainStyle = useSpring({
    paddingBottom: Openclose ? "0px" : "100px",
    marginBottom: isOpen ? "40px" : "0px",
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
    threshold: 0.5,
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
        <p>{paper.title}</p>
        <div className="paper-details">
          <p>The Journal of Physical Chemistry C</p>
          <div className="read-more">
            <h2>
              Read more
              <animated.span style={paperSvgHoverStyle}>
                <HiArrowSmRight />
              </animated.span>
            </h2>
          </div>
        </div>
      </div>
      <animated.div className="MoreInfo" style={openInfoStyle}>
        <p className="ReferMoreInfo" onClick={() => openInNewTab(paper.link)}>
          Online Version <SiGooglescholar />
        </p>
        <p className="ReferMoreInfo" onClick={() => openInNewTab(paper.pdf)}>
          Download PDF <RiDownloadCloudFill />
        </p>
      </animated.div>
    </animated.div>
  );
};

export default PaperItem;
