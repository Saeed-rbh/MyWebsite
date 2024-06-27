import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const MoreOpen = ({ isClicked, setIsClicked, feed }) => {
  const [isAnimationEnds, setIsAnimationEnds] = useState(false);
  useEffect(() => {
    isClicked && setIsAnimationEnds(true);
  }, [isClicked]);

  const [Open_TransactionList, api] = useSpring(() => ({
    scale: 0.9,
    opacity: 0,
    height: "calc(0vh - 65px)",
    zIndex: 105,
    backdropFilter: "blur(20px)",
  }));

  const isOpenRef = React.useRef(isClicked);

  React.useEffect(() => {
    isOpenRef.current = isClicked;
  }, [isClicked]);

  const handleOnRest = () => {
    !isOpenRef.current && setIsAnimationEnds(false);
  };

  useEffect(() => {
    isAnimationEnds &&
      api.start({
        scale: !!isClicked ? 1 : 0.9,
        opacity: !isClicked ? 0 : 1,
        height: !!isClicked ? "calc(100vh - 100px)" : "calc(0vh - 100px)",
        onRest: () => {
          handleOnRest();
        },
      });
  }, [isClicked, isAnimationEnds, api]);

  const bind = useDrag(
    ({
      movement: [, y],
      memo = false,
      last,
      velocity,
      event,
      initial: [, initialY],
    }) => {
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      if (!isClicked) return memo;
      if (clientY - y > 250 || y < 0) return memo;

      const newHeight = Math.max(y + 100, 100);
      const isQuickDragDown = velocity[1] > 0.01 && y > initialY;
      const isQuickDragUp = velocity[1] > 0.1 && y < initialY;

      if (y > 0) {
        if (last) {
          if (isQuickDragUp) {
            api.start({
              height: `calc(100vh - 100px)`,
              config: config.slow,
            });
          } else if (isQuickDragDown) {
            api.start({
              height: "calc(10vh  - 100px)",
              config: config.slow,
            });
            setIsClicked(false);
          } else if (
            window.innerHeight - newHeight <
            window.innerHeight / 2.2
          ) {
            api.start({
              height: "calc(10vh  - 100px)",
            });
            setIsClicked(false);
          } else {
            api.start({
              height: `calc(100vh - 100px)`,
            });
          }
        } else {
          api.start({
            height: `calc(100vh - ${newHeight}px)`,
          });
        }
      }
      return memo;
    }
  );

  return (
    <animated.div
      className="TransactionList_Main"
      style={Open_TransactionList}
      {...bind()}
    >
      <animated.div className="TransactionList_Wall">
        <div className="TransactionList_TopLine"></div>
        {feed()}
      </animated.div>
    </animated.div>
  );
};

export default MoreOpen;
