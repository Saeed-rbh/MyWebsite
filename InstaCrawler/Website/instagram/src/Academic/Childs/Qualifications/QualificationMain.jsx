import React from "react";
import { useSpring, animated } from "react-spring";

const QualificationItem = ({ qualification, refStyle, style, titleStyle }) => (
  <animated.div ref={refStyle} style={style} className="Quali">
    <animated.div style={titleStyle} className="Quali-Title">
      <p>{qualification.title}</p>
      <h2>{qualification.Date}</h2>
    </animated.div>
    <h3>{qualification.Location}</h3>
    <h3>
      <span>Thesis:</span> {qualification.Thesis}
    </h3>
    <h3>
      <span>Supervisor & Advisor:</span> {qualification.Supervisor}
    </h3>
  </animated.div>
);

const QualificationMain = ({ ChildRefs, ParentRef, List, isActive }) => {
  const style = useSpring({
    display: "flex",
    marginTop: 50,
  });
  const titleStyle = useSpring({
    marginLeft: !isActive ? 0 : -5,
    width: `calc(100% + ${-30}px)`,
    backgroundColor: "rgba(250, 250, 250, 0.1)",
  });

  if (!List || List.length === 0) {
    return null;
  }

  return (
    <animated.div ref={ParentRef} className="QualiMain">
      {List.map((qualification, index) => (
        <QualificationItem
          key={index}
          qualification={qualification}
          refStyle={ChildRefs.current[index]}
          style={style}
          titleStyle={titleStyle}
        />
      ))}
    </animated.div>
  );
};

export default QualificationMain;
