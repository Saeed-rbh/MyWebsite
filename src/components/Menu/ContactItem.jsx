import React from "react";
import { useSelector } from "react-redux";
import { animated, easings, useTrail, useSpring } from "react-spring";

const ContactItem = ({ isMenuOpen, props }) => {
  const { academicData } = useSelector((state) => state.data);

  const contactSection = academicData.find((s) => s.name === "ContactInfo");
  const contactItems = contactSection?.list || [];

  // Derive unique categories from items
  const uniqueCategories = [
    ...new Set(contactItems.map((item) => item.category)),
  ];
  const contactCategories = uniqueCategories.map((cat, index) => ({
    id: index + 1,
    category: cat,
  }));

  const ContactInfoTrail = useTrail(contactItems.length, {
    from: { opacity: 0, transform: "translate3d(0,0,0)" },
    to: {
      opacity: isMenuOpen ? 1 : 0,
      transform: isMenuOpen ? "translate3d(0,0,0)" : "translate3d(0,0,0)",
    },
    easing: easings.easeOutCubic,
  });

  const menuBackgroundAnimation = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    config: { duration: 200 },
    delay: isMenuOpen ? 0 : 300,
    easing: easings.easeOutCubic,
  });
  return (
    <animated.div className="MenuInsideN" style={menuBackgroundAnimation}>
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
                  if (contactItem.category !== contactCategory.category)
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
  );
};

export default ContactItem;
