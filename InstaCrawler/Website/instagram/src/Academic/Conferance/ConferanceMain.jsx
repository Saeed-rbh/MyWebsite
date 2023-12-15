import React from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated } from "react-spring";

const ConferanceMain = ({ List, ChildRefs, styles, ParentRef }) => {
  const Conferences = List.map((Conferences, index) => (
    <div className="Awards-Title" ref={ChildRefs.current[index]} key={index}>
      <p>
        <TbCircleFilled />
        {Conferences.Conference}
      </p>
    </div>
  ));
  return (
    <animated.div
      style={styles.title}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Conferences}
    </animated.div>
  );
};

export default ConferanceMain;
