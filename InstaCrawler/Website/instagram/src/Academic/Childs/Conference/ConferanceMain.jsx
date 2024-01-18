import React from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated, useSpring } from "react-spring";

const ConferanceMain = ({
  List,
  ChildRefs,
  styles,
  ParentRef,
  isActive,
  stages,
}) => {
  const fontStyle = useSpring({
    fontSize: isActive ? 12 : 11,
    marginBottom: isActive ? 10 : 0,
    marginLeft: isActive ? 0 : 10,
  });
  const Conferences = List.map((Conferences, index) => (
    <animated.div
      style={index !== 0 ? styles.title : null}
      className="Awards-Title"
      ref={ChildRefs.current[index]}
      key={index}
    >
      <animated.p style={fontStyle}>
        <TbCircleFilled />
        {Conferences.Conference}
      </animated.p>
    </animated.div>
  ));
  return (
    <animated.div
      style={{
        ...styles.More,
        marginTop: 0,
      }}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Conferences}
    </animated.div>
  );
};

export default ConferanceMain;
