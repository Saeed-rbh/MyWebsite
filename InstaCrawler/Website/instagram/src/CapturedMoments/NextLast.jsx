import React, { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import useMouseMove from "./useMouseMove"; // Assuming you separate this into its own file

const SPRING_CONFIG = { tension: 280, friction: 60 };
const LO = "lo";
const HI = "hi";
const MID = "mid";

const generateSpringProps = (condition, values) => ({
  opacity: condition ? 0 : 1,
  x: condition ? values[0] : values[1],
  config: SPRING_CONFIG,
  delay: condition ? 0 : 300,
});

const CircleComponent = ({
  handleShow,
  lohi,
  cartSituation,
  handleClickMove,
}) => {
  const [nextShow, setNextShow] = useState("");

  const LastProps = useSpring({
    from: { opacity: 0, x: "0px" },
    ...generateSpringProps(cartSituation === LO, [
      "0px",
      cartSituation === LO ? "-130px" : "-85px",
    ]),
  });

  const NextProps = useSpring({
    from: { opacity: 0, x: "0px" },
    ...generateSpringProps(cartSituation === HI, [
      "0px",
      cartSituation === HI ? "130px" : "85px",
    ]),
  });

  const OtherProps = useSpring({
    from: { opacity: 0, x: "0px" },
    ...generateSpringProps(cartSituation === MID, [
      "0px",
      cartSituation === HI ? "85px" : "-85px",
    ]),
  });

  const leftRef = useRef(null);
  const [leftProps, setLeftProps] = useSpring(() => ({ x: 0, y: 0 }));
  useMouseMove(leftRef, setLeftProps);

  const rightRef = useRef(null);
  const [rightProps, setRightProps] = useSpring(() => ({ x: 0, y: 0 }));
  useMouseMove(rightRef, setRightProps);

  const midRef = useRef(null);
  const [midProps, setMidProps] = useSpring(() => ({ x: 0, y: 0 }));
  useMouseMove(midRef, setMidProps);

  useEffect(() => {
    const next =
      cartSituation === LO ? lohi[0] : cartSituation === HI ? lohi[1] : "";
    setNextShow(next);
  }, [lohi, cartSituation]);

  return (
    <div className="LastNext">
      <AnimatedDiv
        ref={leftRef}
        styleProps={{ ...leftProps, ...LastProps }}
        condition={cartSituation !== LO}
        className="LastNextCL LastNextC"
        onClick={() => handleClickMove("right")}
        children={
          <>
            <FaAngleLeft />
            <div className="Line" />
            <span>Last Memory!</span>
          </>
        }
      />
      <AnimatedDiv
        ref={rightRef}
        styleProps={{ ...rightProps, ...NextProps }}
        condition={cartSituation !== HI}
        className="LastNextCR LastNextC"
        onClick={() => handleClickMove("left")}
        children={
          <>
            <span>Next Memory!</span>
            <div className="Line" />
            <FaAngleRight />
          </>
        }
      />
      <AnimatedDiv
        ref={midRef}
        styleProps={{ ...midProps, ...OtherProps }}
        condition={cartSituation !== MID}
        className="NextCat"
        onClick={() =>
          handleShow(cartSituation === LO ? LO : cartSituation === HI ? HI : "")
        }
        children={<span>{nextShow}</span>}
      />
    </div>
  );
};

const AnimatedDiv = React.forwardRef(
  ({ styleProps, condition, className, onClick, children }, ref) => {
    return condition ? (
      <animated.div
        ref={ref}
        style={styleProps}
        className={className}
        onClick={onClick}
      >
        {children}
      </animated.div>
    ) : null;
  }
);

export default CircleComponent;
