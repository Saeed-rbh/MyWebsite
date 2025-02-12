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
  console.log(List[0].Conference.length);

  const fontStyle = useSpring({
    // fontSize: isActive ? 12 : 11,
    marginBottom: isActive ? 10 : 0,
    // marginLeft: isActive ? 0 : 10,
  });
  const Anim = useSpring({
    marginTop: isActive ? 60 : List[0].Conference.length > 90 ? 45 : 58,
    padding: "0 30px",
  });
  const Conferences = List.map((Conferences, index) => (
    <animated.div
      style={{ marginTop: 10 }}
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
        ...Anim,
      }}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Conferences}
    </animated.div>
  );
};

export default ConferanceMain;
