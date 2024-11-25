import React, { useMemo } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated, useSpring } from "react-spring";
import useElementSize from "../../Styles/useElementSize";

const TeachingMain = ({
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
    fontSize: isActive ? 12 : 11,
    // marginBottom: isActive ? 5 : 0,
    marginLeft: isActive ? 0 : 10,
  });

  const Anim = useSpring({
    position: "absolute",
    top: 0,
    marginTop: stages[2] ? (isActive ? 35 : 20) : isActive ? 70 : 100,
    marginLeft: 30,
    opacity: isActive ? 1 : 0,
    width: stages[1]
      ? `calc(${elementSize}px - 5px)`
      : `calc(${elementSize}px - ${size[1] + 20}px)`,
    minWidth: stages[1]
      ? `calc(${elementSize}px - ${size[1] + 20}px)`
      : `${size[1]}px`,
    maxWidth: stages[1] ? `${size[1]}px` : `calc(${elementSize}px - 5px)`,
    boxSizing: "border-box",
  });

  const Main = useMemo(
    () =>
      List.map((Teaching, index) => (
        <animated.div
          style={{ marginTop: 5 }}
          // style={index !== 0 ? styles.title : null}
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
      style={{ ...Anim }}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Main}
    </animated.div>
  );
};

export default TeachingMain;
