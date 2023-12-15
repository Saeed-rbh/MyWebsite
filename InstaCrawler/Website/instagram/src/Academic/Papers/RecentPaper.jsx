import React from "react";
import { animated, useSpring, easings } from "react-spring";
import { List } from "./List";

const RecentPaper = ({ isActive }) => {
  const CloseOpenStyleRecent = useSpring({
    opacity: isActive ? "0" : "1",
    top: isActive ? "20px" : "20px",
    marginLeft: "75px",
    marginRight: "45px",
    easing: easings.easeOutCubic,
    config: { duration: 100 },
  });
  const CloseOpenStyleRecentTitle = useSpring({
    opacity: isActive ? "0" : "1",
    top: isActive ? "45px" : "45px",

    easing: easings.easeOutCubic,
    config: { duration: 100 },
  });
  return (
    <>
      {List.map((paper, index) => {
        if (index === List.length - 1) {
          return (
            <>
              <animated.p
                className="Recent-Paper"
                style={CloseOpenStyleRecentTitle}
              >
                Recent:
              </animated.p>
              <animated.div
                className="PaperAcademic"
                style={CloseOpenStyleRecent}
              >
                <animated.div
                  className="PaperData"
                  style={{
                    backgroundImage: "none",
                    boxShadow: "none",
                    padding: "10px 0px",
                  }}
                >
                  <p>{paper.title}</p>
                  <div className="paper-details">
                    <p>The Journal of Physical Chemistry C</p>
                    <div></div>
                  </div>
                </animated.div>
              </animated.div>
            </>
          );
        }
        return null;
      })}
    </>
  );
};
export default RecentPaper;
