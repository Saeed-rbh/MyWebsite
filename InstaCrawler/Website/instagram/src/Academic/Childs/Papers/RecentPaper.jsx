import React from "react";
import { animated, useSpring, easings } from "react-spring";

const RecentPaper = ({ isActive, stages, list }) => {
  const CloseOpenStyleRecent = useSpring({
    opacity: isActive ? "0" : "1",
    top: stages[2] ? "20px" : isActive ? "20px" : "20px",
    marginLeft: stages[2] ? "65px" : "75px",
    marginRight: stages[2] ? "0px" : "45px",
    easing: easings.easeOutCubic,
    config: { duration: 100 },
  });
  const CloseOpenStyleRecentTitle = useSpring({
    opacity: isActive ? "0" : "1",
    top: stages[2] ? "50px" : isActive ? "45px" : "45px",
    marginLeft: stages[2] ? "5px" : "17px",
    easing: easings.easeOutCubic,
    config: { duration: 100 },
  });

  return (
    <>
      {list.map((paper, index) => {
        if (index === list.length - 1) {
          return (
            <React.Fragment key={paper.id}>
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
            </React.Fragment>
          );
        }
        return null;
      })}
    </>
  );
};
export default RecentPaper;
