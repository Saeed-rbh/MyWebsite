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
    // fontSize: isActive ? 12 : 11,
    marginBottom: isActive ? 10 : 0,
    // marginLeft: isActive ? 0 : 10,
  });
  const getLength = (cnf) => {
    if (cnf.Type) return `${cnf.Type}: "${cnf.Title}" at ${cnf.Location}, ${cnf.Year}.`.length;
    return cnf.Conference ? cnf.Conference.length : 0;
  };

  const Anim = useSpring({
    marginTop: isActive ? 60 : (List[0] && getLength(List[0]) > 90) ? 45 : 58,
    padding: "0 30px 60px",
    overflow: isActive ? "auto" : "hidden",
    height: isActive ? "max-content" : "100%",
  });
  const Conferences = List.map((Conferences, index) => (
    <animated.div
      style={{ marginTop: 10 }}
      className="Awards-Title"
      ref={ChildRefs.current[index]}
      key={index}
    >
      <animated.p style={fontStyle}>
        <TbCircleFilled style={{ flexShrink: 0, marginRight: 8, marginTop: 4 }} />
        <>
          {Conferences.Type ? (
            <>
              {Conferences.Type}: "{Conferences.Title}" at {Conferences.Location}, {Conferences.Year}.
            </>
          ) : (
            Conferences.Conference
          )}
        </>
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
