import React, { useMemo } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { animated } from "react-spring";

const AwardsMain = ({ ChildRefs, styles, ParentRef, List }) => {
  const Main = useMemo(
    () =>
      List.map((Award, index) => (
        <div
          className="Awards-Title"
          ref={ChildRefs.current[index]}
          key={Award.id}
        >
          <p>
            <TbCircleFilled />
            {Award.Award}
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

export default AwardsMain;
