import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { useDispatch } from "react-redux";
import { updateMenuOrigin } from "../../features/ui/uiSlice";

const useMenuAnimation = (isMenuOpen, isMenuIconHovered, topBar, reducedMotion) => {
  return useSpring({
    width: isMenuOpen ? 22 : isMenuIconHovered ? 26 : topBar ? 26 : 17,
    transform: `translate3d(-50%, ${isMenuOpen ? 0 : topBar ? -5 : 5}px, 0) rotate(${isMenuOpen ? topBar ? 45 : -45 : 0}deg)`,
    height: 1.5,
    config: { mass: .7, tension: 230, friction: 25 },
    immediate: reducedMotion,
  });
};

const MenuButton = ({
  isMenuOpen,
  reducedMotion,
  handleButtonClick,
  MenuRef,
  MenuStyle,
}) => {
  const dispatch = useDispatch();
  const [isMenuIconHovered, setIsMenuIconHovered] = useState(false);

  const topBarAnimation = useMenuAnimation(isMenuOpen, isMenuIconHovered, true, reducedMotion);
  const bottomBarAnimation = useMenuAnimation(
    isMenuOpen,
    isMenuIconHovered,
    false,
    reducedMotion
  );

  const entrance = useSpring({
    from: { opacity: 0 },
    opacity: 1,
    delay: reducedMotion ? 0 : 350,
    config: { tension: 190, friction: 26 },
    immediate: reducedMotion,
  });

  return (
    <animated.button
      type="button"
      aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isMenuOpen}
      ref={MenuRef}
      style={{ ...MenuStyle, ...entrance }}
      className="HomePage-M-T-R"
      onClick={(event) => {
        if (!isMenuOpen) {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
          const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;
          dispatch(updateMenuOrigin({ x: x / window.innerWidth, y: y / window.innerHeight }));
        }
        handleButtonClick(!isMenuOpen);
      }}
      onMouseEnter={() => setIsMenuIconHovered(true)}
      onMouseLeave={() => setIsMenuIconHovered(false)}
    >
      <animated.div
        className="MenuIcon-T"
        style={topBarAnimation}
      ></animated.div>
      <animated.div
        className="MenuIcon-B"
        style={bottomBarAnimation}
      ></animated.div>
    </animated.button>
  );
};

export default MenuButton;
