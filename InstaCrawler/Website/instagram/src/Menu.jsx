import React from "react";
import {
  useTransition,
  animated,
  config,
  useTrail,
  useSpring,
} from "react-spring";
import { connect } from "react-redux";
import { updateMenu } from "./menuActions";

const Menu = ({ isMenuOpen }) => {
  const contactItems = [
    {
      id: 1,
      category: "Phone Numbers",
      text: "CA Cell:",
      info: "+1 (416) 836 5851",
    },
    {
      id: 2,
      category: "Phone Numbers",
      text: "IR Cell:",
      info: "+98 (919) 659 5351",
    },
    {
      id: 3,
      category: "Emails",
      text: "Email:",
      info: "Saeedarabha@outlook.com",
    },
    { id: 4, category: "Emails", text: "Email:", info: "Arabha@Yorku.ca" },
    {
      id: 5,
      category: "Social Media",
      text: "Social Media:",
      info: "@saeed_rbh",
    },
    {
      id: 6,
      category: "Research Gate",
      text: "Research Gate:",
      info: "Saeed Arabha",
    },
  ];

  const contactCategories = [
    { id: 1, category: "Phone Numbers" },
    { id: 2, category: "Emails" },
    { id: 3, category: "Social Media" },
    { id: 4, category: "Research Gate" },
  ];

  const ContactInfoOpen = useTransition(isMenuOpen, {
    from: { opacity: 0, transform: "translate3d(0,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0)" },
    leave: { opacity: 0, transform: "translate3d(0,0,0)" },
    config: config.stiff,
  });

  const ContactInfoTrail = useTrail(contactItems.length, {
    from: { opacity: 0, transform: "translate3d(0,0,0)" },
    to: {
      opacity: isMenuOpen ? 1 : 0,
      transform: isMenuOpen ? "translate3d(0,0,0)" : "translate3d(0,0,0)",
    },
    config: config.stiff,
  });

  const menuBackgroundAnimation = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    config: { duration: 200 },
    delay: isMenuOpen ? 0 : 300,
  });

  return (
    <>
      {ContactInfoOpen(
        (props, item) =>
          item && (
            <div className="HomeAround" style={{ ...props }}>
              <animated.div
                className="MenuInsideN"
                style={menuBackgroundAnimation}
              >
                <animated.div className="ContactInfo" style={props}>
                  Contact Information
                </animated.div>
                <div className="ContactInfos">
                  {contactCategories.map((contactCategory, index) => (
                    <div key={contactCategory.id}>
                      <animated.div
                        style={ContactInfoTrail[index]}
                        className="ContactCategory"
                      >
                        {contactCategory.category}
                      </animated.div>
                      {ContactInfoTrail[index] && (
                        <>
                          {contactItems.map((contactItem) => {
                            if (
                              contactItem.category !== contactCategory.category
                            )
                              return null;
                            const itemIndex = contactItems.findIndex(
                              (item) => item.id === contactItem.id
                            );
                            return (
                              <animated.a
                                key={contactItem.id}
                                style={ContactInfoTrail[itemIndex]}
                                className="ContactInfo-In"
                                href={
                                  contactItem.category === "Phone Numbers"
                                    ? "tel:+14168365851"
                                    : ""
                                }
                              >
                                <animated.b>{contactItem.info}</animated.b>
                              </animated.a>
                            );
                          })}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </animated.div>
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
