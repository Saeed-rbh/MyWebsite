import { useSpring, animated } from "react-spring";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Hook for second text style
export const useSecondTextStyle = (isActive, stages) => {
  const ACTIVE_Y = 25;
  const INACTIVE_Y = stages[2] ? 20 : 15;

  return useSpring({
    top: isActive ? ACTIVE_Y : INACTIVE_Y,
  });
};

// Static style definition for linear gradient
const gradientStyle = {
  background: "linear-gradient(to right, #d49d8194 0%, #ff550063 100%)",
  WebkitBackgroundClip: "text",
  lineHeight: "80px",
};

// Hook for text style
export const useTextStyle = (isActive, stages) => {
  const memoizedValues = useMemo(() => {
    return {
      fontSize: isActive ? 120 : 100,
      left: stages[2] ? 5 : 25,
      top: stages[2] ? -20 : 0,
    };
  }, [isActive, stages]);

  const textStyle = useSpring({
    ...gradientStyle,
    fontSize: memoizedValues.fontSize,
    opacity: stages[2] || stages[3] ? 0.05 : isActive ? 0.5 : 0.2,
    left: memoizedValues.left,
    top: memoizedValues.top,
  });

  return textStyle;
};

// Hook for title animation style
export const useTitleAnimationStyle = (seqId) => {
  const { visibility } = useSelector((state) => state.ui);
  const [animationFinished, setAnimationFinished] = useState(false);

  const CONFIG = [1800, 300, 350]; // [Initial delay, Incremental delay, Duration]

  const titleStyle = useSpring({
    from: { opacity: 0, scale: 1.2 },
    to: { opacity: visibility ? 0.8 : 0, scale: visibility ? 1 : 1.2 },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: { duration: animationFinished ? undefined : CONFIG[2] },
    onRest: () => setAnimationFinished(true),
  });

  const MainStyle = useSpring({
    from: { opacity: 0, y: 5 * seqId, scale: 1.1 },
    to: {
      opacity: visibility ? 0.8 : 0,
      y: visibility ? 0 : 5 * seqId,
      scale: visibility ? 1 : 1.1,
    },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: { duration: animationFinished ? undefined : CONFIG[2] },
    onRest: () => setAnimationFinished(true),
  });

  return { MainStyle, titleStyle };
};

// Hook for title style
export const useTitleStyle = (isActive, stages) => {
  const ACTIVE_Y = 0;
  const INACTIVE_Y = stages[2] ? 100 : 15;
  return useSpring({
    marginTop: isActive ? ACTIVE_Y : INACTIVE_Y,
  });
};

export const useTitleWidthStyle = (isActive, widths, widthSplit) => {
  return useSpring({
    width: widthSplit ? widths[1] : undefined,
    opacity: isActive || !widthSplit ? 1 : 0,
  });
};

export const useMoreStyle = (isActive, fixed, stages) => {
  const ACTIVE_Y = 50;
  const INACTIVE_Y = stages && stages[2] ? 40 : 35;
  const FIXED_Y = 0;

  const transformValue = useMemo(() => {
    let translateY = fixed ? FIXED_Y : isActive ? ACTIVE_Y : INACTIVE_Y;
    return `translate3d(0, ${translateY}px, 0)`;
  }, [isActive, fixed, INACTIVE_Y]);

  return useSpring({
    transform: transformValue,
    marginRight: !isActive ? 48 : 0,
    paddingRight: !isActive ? 0 : 15,
  });
};

// export const useClickOtherFade = (otherActive, progress) => {
//   return useSpring({
//     filter:
//       otherActive && progress !== 1 ? "blur(20px)" : `blur(${5 * progress}px)`,
//   });
// };

export const useClickOtherFade = (
  otherActive,
  progress,
  name,
  isActive,
  scrollBlur = 0,
  scrollOpacity = 1
) => {
  const [blur, setBlur] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  // Disable blur for profile-related components to keep image sharp
  const disableBlur = name === "Affiliation" || name === "PersonalInfo";

  useEffect(() => {
    const blurValue = disableBlur ? 0 : 5 * progress;
    // Combine existing blur with the new scrollBlur (taking the max)
    const finalBlur = Math.max(blurValue, scrollBlur);

    const opacityValue = otherActive ? 0 : 1;
    // Combine opacity (take the minimum so it fades out if either condition is met)
    const finalOpacity = Math.min(opacityValue, scrollOpacity);

    const scaleValue = otherActive ? 0.9 : 1;
    setBlur(finalBlur);
    setOpacity(finalOpacity);
    setScale(scaleValue);
  }, [otherActive, progress, disableBlur, scrollBlur, scrollOpacity]);

  // Determine transition speeds independently to prevent blinking/lag
  // Filter (Blur): Always fast/near-instant because it's driven by scroll.
  const filterTime = "0.05s";

  // Opacity: Instant (0s) during scroll updates to prevent lag. Smooth (0.5s) for click/hover interactions.
  // We use 0s instead of 0.1s to prevent "blinking" at the 0/1 boundary.
  const isScrolling = !otherActive && (scrollBlur > 0 || scrollOpacity < 1);
  const opacityTime = isScrolling ? "0s" : "0.5s";

  // Transform (Scale): Always smooth because it's only used for click interactions.
  const transformTime = "0.5s";

  const pointerEvents = scrollBlur > 0 || otherActive ? "none" : "auto";

  // Return the blur value and CSS styles with smooth transition
  return {
    style: {
      transform: `scale(${scale})`,
      opacity: opacity,
      filter: `blur(${blur}px)`,
      pointerEvents: pointerEvents,
      transition: `opacity ${opacityTime} ease, transform ${transformTime} ease, filter ${filterTime} linear`,
    },
  };
};

export const useCombinedAnimation = ({
  top,
  adjustViewport,
  size,
  scrollTop,
  toggle,
  name,
  id,
  inView,
  isActive,
  initial,
  setInitial,
  scrollBlur,
  scrollOpacity,
}) => {
  const Loaded = useRef(false);

  const startScroll = top - adjustViewport; // Where you want progress to start
  const endScroll = top - adjustViewport + size[0]; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  const [otherActive, setOtherActive] = useState(false);
  useEffect(() => {
    if (toggle[0] && toggle[1] !== name) {
      setOtherActive(true);
    } else {
      setOtherActive(false);
    }
  }, [toggle, name]);

  const { currentPage } = useSelector((state) => state.ui);
  const { visibility } = useSelector((state) => state.ui);

  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  useEffect(() => {
    if (
      visibility &&
      location.pathname.toLowerCase() === "/academiccv" &&
      currentPage === "/AcademicCV"
    ) {
      setResumeClicked(1);
    } else if (
      visibility &&
      location.pathname.toLowerCase() === "/academiccv" &&
      currentPage === "/"
    ) {
      setResumeClicked(2);
    } else {
      setResumeClicked(3);
    }
  }, [location.pathname, currentPage, visibility]);

  const initialStyleAnim = useSpring({
    // from: { opacity: 0, scale: 1.2, y: 20 },

    opacity: resumeClicked === 1 ? 1 : 0,
    scale: resumeClicked === 1 ? 1 : resumeClicked === 2 ? 0.95 : 1.2,
    y: resumeClicked === 1 ? 0 : resumeClicked === 2 ? -20 : 20,
    delay: resumeClicked === 2 ? id * 110 : 500 + id * 110,
    config: { duration: 500 },
    onRest: () => {
      if (!initial) setInitial(true);
      Loaded.current = true;
    },
  });

  const otherFadeAnim = useClickOtherFade(
    otherActive,
    progress,
    name,
    isActive,
    scrollBlur,
    scrollOpacity
  );

  const combinedStyleAnim =
    Loaded.current && resumeClicked === 1
      ? { ...otherFadeAnim.style }
      : { ...initialStyleAnim };

  return combinedStyleAnim;
};

export const usecalculateAdjustedHeight = ({ height, childRef }) => {
  let fullView = false;
  const element = document.getElementById("MoreInfoAcademic");
  let viewportHeight = window.innerHeight;
  if (element) {
    viewportHeight = element.clientHeight;
  }

  let activeHeight = height;
  if (childRef?.current && childRef.current.scrollHeight) {
    if (viewportHeight > childRef.current.scrollHeight) {
      activeHeight =
        childRef.current.scrollHeight + childRef.current.offsetTop + 25;
    } else {
      activeHeight = viewportHeight - 50;
      fullView = true;
    }
  }

  const notActiveHeight = height;

  return { activeHeight, notActiveHeight, fullView };
};

export const calculateAdjustedTop = ({
  top,
  adjustViewport,
  adjustTop,
  stages,
  isActive,
  scrollTop,
  newAdjustedHeight,
  viewportHeight,
}) => {
  const ModifyTop = 100;

  let newAdjustedTop = top + adjustViewport + (!stages[2] ? adjustTop : 0);

  const topCheck =
    scrollTop -
    top +
    adjustViewport +
    (!stages[2] ? adjustTop : 0) +
    newAdjustedHeight -
    1.5 * ModifyTop;

  if (isActive) {
    if (topCheck < 0) {
      newAdjustedTop = newAdjustedTop + topCheck;
    } else if (newAdjustedHeight > viewportHeight) {
      newAdjustedTop =
        Math.max(viewportHeight + scrollTop - newAdjustedHeight, scrollTop) +
        ModifyTop;
    }
  }

  return newAdjustedTop;
};

export const useInView = ({
  ref,
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting); // Check if the element is in view
      },
      {
        root, // Set the scrollable parent as the root
        rootMargin, // Margin around the root
        threshold, // Percentage of visibility required
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect(); // Clean up observer on unmount
    };
  }, [ref, root, rootMargin, threshold]); // Dependencies include observer options

  return isInView;
};

export const ScalableElement = ({
  as: Component = "h1",
  children,
  className,
  onClick,
  onMouseDown,
  key,
  style,
  id,
  eventHandlers,
}) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = useCallback(
    (e) => {
      setIsScaled(true);
      if (onMouseDown) onMouseDown();
    },
    [onMouseDown]
  );

  const handleMouseUp = useCallback(() => setIsScaled(false), []);

  const style_2 = useSpring({
    scale: isScaled ? 0.9 : 1,
  });

  const AnimatedComponent = animated(Component);

  return (
    <AnimatedComponent
      id={id}
      key={key}
      className={className}
      style={{ ...style, ...style_2 }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      {...eventHandlers}
    >
      {children}
    </AnimatedComponent>
  );
};
