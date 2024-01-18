import React, { useMemo } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated, useSpring } from "react-spring";

const AwardsMain = ({
  ChildRefs,
  styles,
  ParentRef,
  List,
  isActive,
  stages,
}) => {
  const fontStyle = useSpring({
    fontSize: isActive ? 12 : 11,
    marginTop: isActive ? 10 : 0,
    marginLeft: isActive ? 0 : 10,
  });
  const Main = useMemo(
    () =>
      List.map((Award, index) => (
        <animated.div
          style={index !== 0 ? styles.title : null}
          className="Awards-Title"
          ref={ChildRefs.current[index]}
          key={Award.id}
        >
          <animated.p style={fontStyle}>
            <TbCircleFilled />
            {Award.Award}
          </animated.p>
        </animated.div>
      )),
    [ChildRefs, List]
  );
  return (
    <animated.div
      style={{ ...styles.More, marginTop: 0 }}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Main}
    </animated.div>
  );
};

export default AwardsMain;
