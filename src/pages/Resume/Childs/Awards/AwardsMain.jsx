import React, { useMemo } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated, useSpring } from "react-spring";
import useElementSize from "../../Styles/useElementSize";

const AwardsMain = ({
  ChildRefs,
  styles,
  ParentRef,
  List,
  isActive,
  stages,
  size,
}) => {
  const elementSize = useElementSize("MoreInfoAcademic").width - 50;

  const fontStyle = useSpring({
    fontSize: 12,
    marginTop: isActive ? 10 : 0,
    marginLeft: 0,
  });

  const Anim = useSpring({
    // position: "absolute",
    // top: 0,
    marginTop: isActive ? 60 : 100,
    width: stages[1] ? elementSize - 20 : elementSize - size[1] - 20,
    marginLeft: 30,
    paddingBottom: 60,
    height: isActive ? "max-content" : "100%",
    // width: stages[1] ? elementSize - 5 : elementSize - size[1] - 20,
    // minWidth: stages[1] ? elementSize - size[1] - 20 : size[1],
    // maxWidth: stages[1] ? size[1] : elementSize - 5,
    // boxSizing: "border-box",
  });
  const Main = useMemo(
    () =>
      List.map((Award, index) => (
        <animated.div
          // style={
          //   index !== 0
          //     ? { ...styles.title, ...styles.titlewidth }
          //     : styles.titlewidth
          // }

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
      style={{ ...Anim }}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Main}
    </animated.div>
  );
};

export default AwardsMain;
