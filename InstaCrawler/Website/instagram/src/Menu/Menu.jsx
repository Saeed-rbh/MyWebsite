import React from "react";
import { useTransition, easings } from "react-spring";
import { connect } from "react-redux";
import { updateMenu } from "./menuActions";
import ContactItem from "./ContactItem";

const Menu = ({ isMenuOpen }) => {
  const ContactInfoOpen = useTransition(isMenuOpen, {
    from: { opacity: 0, transform: "translate3d(0,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0)" },
    leave: { opacity: 0, transform: "translate3d(0,0,0)" },
    easing: easings.easeOutCubic,
  });

  return (
    <>
      {ContactInfoOpen(
        (props, item) =>
          item && (
            <div className="HomeAround" style={{ ...props }}>
              <ContactItem isMenuOpen={isMenuOpen} props={props} />
            </div>
          )
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isMenuOpen: state.menu.isMenuOpen,
  };
};

export default connect(mapStateToProps, { updateMenu })(Menu);
