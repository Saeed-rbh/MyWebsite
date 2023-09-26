import React, { useState, memo } from "react";
import { animated, useSpring, easings } from "react-spring";
import PropTypes from "prop-types";

const useMenuAnimation = (isMenuOpen, isMenuIconHovered, TB) => {
  console.log(isMenuOpen);
  return useSpring({
    width: !isMenuOpen ? (isMenuIconHovered ? "30px" : "15px") : "15px",
    transform: isMenuOpen
      ? TB
        ? "translateY(6.5px) rotate(45deg)"
        : "translateY(-6.5px) rotate(-45deg)"
      : "translateY(0px) rotate(0deg)",
    height: !isMenuOpen ? "2px" : "3px",
    easing: easings.easeOutCubic,
  });
};

const MenuButton = memo(({ isMenuOpen, handleButtonClick }) => {
  const [isMenuIconHovered, setIsMenuIconHovered] = useState(false);

  const topBarAnimation = useMenuAnimation(isMenuOpen, isMenuIconHovered, true);
  const bottomBarAnimation = useMenuAnimation(
    isMenuOpen,
    !isMenuIconHovered,
    false
  );

  return (
    <div
      className="HomePage-M-T-R"
      onClick={() => handleButtonClick(!isMenuOpen)}
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
    </div>
  );
});

MenuButton.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
};

export default MenuButton;
