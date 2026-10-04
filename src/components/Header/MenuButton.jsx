import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { useDispatch } from "react-redux";
import { updateMenuOrigin } from "../../features/ui/uiSlice";

const useMenuAnimation = (isMenuOpen, isMenuIconHovered, TB, isHomePage, reducedMotion) => {
  return useSpring({
    width: isHomePage
      ? isMenuOpen ? 22 : isMenuIconHovered ? 26 : TB ? 26 : 17
      : !isMenuOpen ? (isMenuIconHovered ? 30 : 15) : 15,
    transform: isHomePage
      ? `translate3d(-50%, ${isMenuOpen ? 0 : TB ? -5 : 5}px, 0) rotate(${isMenuOpen ? TB ? 45 : -45 : 0}deg)`
      : isMenuOpen
        ? TB ? "translateY(6.5px) rotate(45deg)" : "translateY(-6.5px) rotate(-45deg)"
        : "translateY(0px) rotate(0deg)",
    height: isHomePage ? 1.5 : !isMenuOpen ? 2 : 3,
    config: { mass: .7, tension: 230, friction: 25 },
    immediate: reducedMotion,
  });
};

const MenuButton = ({
  isMenuOpen,
  isHomePage,
  reducedMotion,
  handleButtonClick,
  MenuRef,
  MenuStyle,
  contactInfoAnimation,
}) => {
  const dispatch = useDispatch();
  const [isMenuIconHovered, setIsMenuIconHovered] = useState(false);

  const topBarAnimation = useMenuAnimation(isMenuOpen, isMenuIconHovered, true, isHomePage, reducedMotion);
  const bottomBarAnimation = useMenuAnimation(
    isMenuOpen,
    isHomePage ? isMenuIconHovered : !isMenuIconHovered,
    false,
    isHomePage,
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
      style={isHomePage ? entrance : { ...MenuStyle, ...contactInfoAnimation }}
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
