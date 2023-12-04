import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSpring, animated } from "react-spring";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const SPRING_CONFIG = {
  tension: 280,
  friction: 60,
};

const updateProps = (ref, setProps, mouseX, mouseY) => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const isWithinBoundaries =
      Math.abs(rect.left + rect.width / 2 - mouseX) < 40 &&
      Math.abs(rect.top + rect.height / 2 - mouseY) < 40;

    setProps({
      x: isWithinBoundaries ? mouseX - rect.left - rect.width / 2 : 0,
      y: isWithinBoundaries ? mouseY - rect.top - rect.height / 2 : 0,
    });
  }
};

const CircleComponent = ({
  handleShow,
  lohi,
  ImageSituation,
  handleClickMove,
}) => {
  const Hi = "Next Memory!";
  const Lo = "Last Memory!";
  const [NextShow, setNextShow] = useState("");
  const [isRendered, setIsRendered] = useState({ L: true, R: true, M: true });

  const generateSpringProps = useMemo(
    () => (condition, values) => ({
      opacity: condition ? 0 : 1,
      x: condition ? values[0] : values[1],
      config: SPRING_CONFIG,
      delay: condition ? 0 : 300,
    }),
    []
  );

  const LastProps = useSpring({
    ...generateSpringProps(ImageSituation === "lo", ["-130px", "-85px"]),
    onRest: () =>
      setIsRendered((prev) => ({ ...prev, L: ImageSituation !== "lo" })),
  });

  const NextProps = useSpring({
    ...generateSpringProps(ImageSituation === "hi", ["130px", "85px"]),
    onRest: () =>
      setIsRendered((prev) => ({ ...prev, R: ImageSituation !== "hi" })),
  });

  const OtherProps = useSpring({
    ...generateSpringProps(ImageSituation === "mid", [
      "0px",
      ImageSituation === "hi" ? "85px" : "-85px",
    ]),
    onRest: () =>
      setIsRendered((prev) => ({ ...prev, M: ImageSituation === "mid" })),
  });

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const midRef = useRef(null);
  const [leftProps, setLeftProps] = useSpring(() => ({ x: 0, y: 0 }));
  const [rightProps, setRightProps] = useSpring(() => ({ x: 0, y: 0 }));
  const [midProps, setMidProps] = useSpring(() => ({ x: 0, y: 0 }));

  const mouseMoveHandler = useCallback(
    (e) => {
      const { clientX: mouseX, clientY: mouseY } = e;
      updateProps(leftRef, setLeftProps, mouseX, mouseY);
      updateProps(rightRef, setRightProps, mouseX, mouseY);
      updateProps(midRef, setMidProps, mouseX, mouseY);
    },
    [setLeftProps, setRightProps, setMidProps]
  );

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [mouseMoveHandler]);

  useEffect(() => {
    setNextShow(
      ImageSituation === "lo" ? lohi[0] : ImageSituation === "hi" ? lohi[1] : ""
    );
  }, [lohi, ImageSituation]);

  return (
    <div className="LastNext">
      {(isRendered.L || ImageSituation !== "lo") && (
        <animated.div
          ref={leftRef}
          style={{ x: leftProps.x, y: leftProps.y, ...LastProps }}
          className="LastNextC"
          onClick={() => handleClickMove("right")}
        >
          <FaAngleLeft />
          <div className="Line"></div>
          <span>{Lo}</span>
        </animated.div>
      )}
      {(isRendered.R || ImageSituation !== "hi") && (
        <animated.div
          ref={rightRef}
          style={{ x: rightProps.x, y: rightProps.y, ...NextProps }}
          className="LastNextC"
          onClick={() => handleClickMove("left")}
        >
          <span>{Hi}</span>
          <div className="Line"></div>
          <FaAngleRight />
        </animated.div>
      )}
      {(isRendered.M || ImageSituation !== "mid") && (
        <animated.div
          ref={midRef}
          style={{
            x: midProps.x,
            y: midProps.y,
            ...OtherProps,
          }}
          className="NextCat"
          onClick={() =>
            handleShow(
              ImageSituation === "lo"
                ? "lo"
                : ImageSituation === "hi"
                ? "hi"
                : ""
            )
          }
        >
          <span>{NextShow}</span>
        </animated.div>
      )}
    </div>
  );
};

export default CircleComponent;
