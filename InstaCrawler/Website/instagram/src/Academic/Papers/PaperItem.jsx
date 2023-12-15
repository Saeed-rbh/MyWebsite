import React, { memo, useCallback } from "react";
import { RiDownloadCloudFill } from "react-icons/ri";
import { HiArrowSmRight } from "react-icons/hi";
import { SiGooglescholar } from "react-icons/si";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";

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
  return (
    <animated.div
      className="PaperAcademic"
      ref={ChildRefs}
      onClick={handleToggle}
      style={openInfoMainStyle}
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

PaperItem.propTypes = {
  paper: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    pdf: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default memo(PaperItem);
