import React, { useMemo } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated } from "react-spring";

const TeachingMain = ({ ChildRefs, styles, ParentRef, List }) => {
  const Main = useMemo(
    () =>
      List.map((Teaching, index) => (
        <div
          className="Awards-Title"
          ref={ChildRefs.current[index]}
          key={Teaching.id}
        >
          <p>
            <TbCircleFilled />
            {Teaching.Teaching}
          </p>
        </div>
      )),
    [ChildRefs, List]
  );
  return (
    <animated.div
      style={styles.title}
      className="Awards-Details"
      ref={ParentRef}
    >
      {Main}
    </animated.div>
  );
};

export default TeachingMain;
