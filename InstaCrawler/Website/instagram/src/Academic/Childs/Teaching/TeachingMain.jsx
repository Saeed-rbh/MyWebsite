import React, { useMemo } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated, useSpring } from "react-spring";

const TeachingMain = ({
  ChildRefs,
  styles,
  ParentRef,
  List,
  isActive,
  stages,
}) => {
  const fontStyle = useSpring({
    fontSize: isActive ? 12 : 11,
    marginBottom: isActive ? 10 : 0,
    marginLeft: isActive ? 0 : 10,
  });
  const Main = useMemo(
    () =>
      List.map((Teaching, index) => (
        <animated.div
          style={index !== 0 ? styles.title : null}
          className="Awards-Title"
          ref={ChildRefs.current[index]}
          key={Teaching.id}
        >
          <animated.p style={fontStyle}>
            <TbCircleFilled />
            {Teaching.Teaching}
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

export default TeachingMain;
