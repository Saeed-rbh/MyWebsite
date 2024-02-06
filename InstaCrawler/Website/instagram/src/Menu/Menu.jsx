import React, { useEffect, useRef, useState } from "react";
import { useTransition, easings } from "react-spring";
import { connect } from "react-redux";
import { updateMenu } from "../actions/Actions";
import ContactItem from "./ContactItem";
import { useSelector } from "react-redux";

const Menu = () => {
  const { isMenuOpen } = useSelector((state) => state.isMenuOpen);
  const ContactInfoOpen = useTransition(isMenuOpen, {
    from: { opacity: 0, transform: "translate3d(0,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0)" },
    leave: { opacity: 0, transform: "translate3d(0,0,0)" },
    easing: easings.easeOutCubic,
  });

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const adjustElementHeight = () => {
    // Calculate the viewport height without the browser's UI elements
    const viewportHeight = window.innerHeight;
    setViewportHeight(viewportHeight);
  };

  // Ref for the element
  const HomeAround = useRef(null);

  useEffect(() => {
    // Run the adjustment function on mount and window resize
    adjustElementHeight();
    window.addEventListener("resize", adjustElementHeight);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", adjustElementHeight);
  }, []);

  return (
    <>
      {ContactInfoOpen(
        (props, item) =>
          item && (
            <div
              ref={HomeAround}
              className="HomeAround"
              style={{ ...props, height: `calc(${viewportHeight}px - 40px)` }}
            >
              <ContactItem isMenuOpen={isMenuOpen} props={props} />
            </div>
          )
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isMenuOpen: state.isMenuOpen,
  };
};

export default connect(mapStateToProps, { updateMenu })(Menu);
