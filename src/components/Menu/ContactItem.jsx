import React from "react";
import { useSelector } from "react-redux";
import { animated, easings, useTrail, useSpring } from "react-spring";

const ContactItem = ({ isMenuOpen, props }) => {
  const { contactData } = useSelector((state) => state.data);

  // Parse contactSection similar to how it was before but from dedicated state
  // contactData is the section object itself
  const contactItems = contactData?.list || [];

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
                  let href = contactItem.link || "";
                  let target = "_blank";
                  let rel = "noopener noreferrer";

                  if (contactItem.category === "Phone Numbers") {
                    // Strip non-digits for tel link if using info, but we expect link to be clean or use logic
                    // If link is provided, use it directly with prefix if missing
                    const number = contactItem.link || contactItem.info || "";
                    href = `tel:${number.replace(/\s+/g, '')}`;
                    target = "_self";
                    rel = undefined;
                  } else if (contactItem.category === "Emails") {
                    href = `mailto:${contactItem.link || contactItem.info}`;
                    target = "_self";
                    rel = undefined;
                  }

                  return (
                    <animated.a
                      key={contactItem.id}
                      style={ContactInfoTrail[itemIndex]}
                      className="ContactInfo-In"
                      href={href}
                      target={target}
                      rel={rel}
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
