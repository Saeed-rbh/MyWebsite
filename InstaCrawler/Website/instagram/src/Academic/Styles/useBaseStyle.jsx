import { useState, useEffect, useMemo } from "react";
import { useSpring, easings } from "react-spring"; // Or your respective import path
import elementWidthCalculator from "./elementWidthCalculator"; // Assuming this is an external utility function
import useScrollFade from "./useScrollFade";
import useElementSize from "../Styles/useElementSize";
import { useSelector } from "react-redux";

/**
 * Custom hook for calculating and returning base styles for an element.
 *
 * @param {Object} data - Data object containing various style parameters.
 * @param {boolean} isActive - Active state of the element.
 * @param {boolean} isHovered - Hover state of the element.
 * @param {Object} mainElementSize - Size of the main element.
 * @param {number} widthOffset - Width offset value.
 * @param {Object} heightVariants - Different height variants.
 * @param {Object} topVariants - Different top position variants.
 * @returns {Object} Spring-based animation styles.
 */

const useBaseStyle = (
  data,
  isActive,
  isHovered,
  otherActive,
  widthOffset,
  heights,
  tops,
  stages
) => {
  const { width, padding, iniRL } = data;
  const [elementWidth, setElementWidth] = useState(width);
  const [LeftBase, setLeftBase] = useState(0);
  const mainElementSize = useElementSize("MoreInfoAcademic");

  const { visibility } = useSelector((state) => state.visibility);
  const { toggle, hover } = useSelector((state) => state.data);

  const isTrigger = useMemo(
    () => toggle[2] && toggle[1] === data.title,
    [toggle, data.title]
  );
  const blurValue = useMemo(() => {
    if (toggle[0] && !isActive) return "blur(15px)";
    if (hover[0] && !stages[2] && !isHovered) return "blur(5px)";
    return "blur(0px)";
  }, [toggle, hover, stages, isActive, isHovered]);

  useEffect(() => {
    if (mainElementSize.width > 0) {
      const newWidth = elementWidthCalculator({
        initialRelativeLeft: LeftBase,
        elementSizeWidth: mainElementSize.width,
        widthOffset: widthOffset,
        defaultWidth: width,
        iniRL: iniRL,
        stages: stages,
      });
      setElementWidth(newWidth.width);
    }
  }, [mainElementSize, LeftBase, widthOffset, width, iniRL, stages]);

  const height = useMemo(() => {
    return isActive && !isTrigger
      ? heights.Opened
      : isHovered && !stages[2]
      ? heights.Hovered
      : heights.NoAction;
  }, [isActive, isHovered, heights, stages, isTrigger]);

  const top = useMemo(() => {
    return isActive
      ? tops.Opened
      : isHovered && !stages[2]
      ? tops.Hovered
      : tops.NoAction;
  }, [isActive, isHovered, tops, stages]);

  const opacity = useScrollFade(data, isActive, otherActive);

  useEffect(() => {
    setLeftBase(
      iniRL === 0
        ? 0
        : iniRL === 1
        ? 45
        : iniRL === 2
        ? 102
        : iniRL === 3
        ? 160
        : 220
    );
  }, [iniRL]);

  const openClose = isActive ? 2 : 1;

  const [randomStart] = useState(data.Rand);

  // const backgroundSpring = useSpring({
  //   from: { backgroundAnim: 0 },
  //   to: async (next) => {
  //     while (true) {
  //       await next({
  //         backgroundAnim: 1,
  //         config: { duration: 7000 },
  //       });
  //       await next({
  //         backgroundAnim: 0,
  //         config: { duration: 7000 },
  //       });
  //     }
  //   },
  //   delay: 1000 * randomStart,
  // });

  const baseSpring_1 = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    // backgroundImage: backgroundSpring.backgroundAnim.interpolate((value) => {
    //   const position = value * 100 * randomStart;
    //   return `radial-gradient(circle at ${
    //     openClose * (100 * randomStart - position)
    //   }% ${position}%, rgb(29 30 34 / ${
    //     38 * value * randomStart
    //   }%), transparent 70%), radial-gradient(circle at ${
    //     openClose * (100 * randomStart - position)
    //   }% ${position}%, rgba(29, 30, 34, ${
    //     0.1 * (1 - value * randomStart)
    //   }), transparent 70%), radial-gradient(circle at ${
    //     openClose * (100 * randomStart - position)
    //   }% ${position}%, rgb(212 157 129 / ${
    //     30 * value * randomStart
    //   }%), transparent 70%), radial-gradient(circle at ${
    //     openClose * (100 * randomStart - position)
    //   }% ${position}%, rgb(36 69 83 / ${
    //     30 * (1 - value * randomStart)
    //   }%), transparent 70%)`;
    // }),
    overflow: data.fixed ? "visible" : "hidden",
    cursor: isActive ? "default" : "pointer",
    scale: otherActive || isTrigger ? 0.9 : 1,
    width: `${elementWidth}px`,
    height: `${height}px`,
    top: `${top}px`,
    padding: `${padding[0]}px ${padding[1]}px ${
      isActive ? "80px" : `${padding[2]}px`
    } ${padding[3]}px`,
    left: `${LeftBase}%`,
    Filter: blurValue,
    WebkitFilter: blurValue,
  });
  const [animationFinished, setAnimationFinished] = useState(false);
  const baseSpring_2 = useSpring({
    from: { opacity: 0, scale: 1.5 },
    to: {
      opacity: visibility ? opacity : 0,
      scale: visibility ? (otherActive || isTrigger ? 0.9 : 1) : 1.5,
    },
    delay: animationFinished ? 0 : 1200 + 200 * data.seqId,
    config: {
      duration: animationFinished ? undefined : 800,
    },
    onRest: () => setAnimationFinished(true),
  });

  const baseSpring = { ...baseSpring_1, ...baseSpring_2 };

  return baseSpring;
};

export default useBaseStyle;
