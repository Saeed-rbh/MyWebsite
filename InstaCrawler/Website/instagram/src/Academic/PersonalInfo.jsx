import React, { useEffect, useState } from "react";
import { animated, useSpring, easings } from "react-spring";
import { ExternalLink } from "./MyInfo/ExternalLink";
import { ContactInfo } from "./MyInfo/ContactInfo";
import BirthdayLink from "./BirthdayLink";

export const PersonalInfo = ({ Data, MainElementSize, Ref }) => {
  const widthoffser = Data.padding[1] + Data.padding[3];
  const [right, setRight] = useState(Data.iniRL);
  const [ElementWidth, setElementWidth] = useState(Data.width);

  useEffect(() => {
    if (MainElementSize.width > 0) {
      setElementWidth(
        ((100 - Data.iniRL) / 100) * MainElementSize.width - widthoffser
      );
      if (ElementWidth < Data.width) {
        setRight(0);
        setElementWidth(MainElementSize.width - widthoffser);
      } else if (ElementWidth > Data.width) {
        setRight(Data.iniRL);
        setElementWidth(
          ((100 - Data.iniRL) / 100) * MainElementSize.width - widthoffser
        );
      }
    }
  }, [MainElementSize]);

  const animatedStyle = useSpring({
    backgroundColor: Data.background,
    top: Data.top,
    height: Data.height,
    width: `${ElementWidth}px`,
    minWidth: Data.width,
    right: `${right}%`,
    easing: easings.easeOutCubic,
    padding: `${Data.padding[0]}px ${Data.padding[1]}px ${Data.padding[2]}px ${Data.padding[3]}px`,
  });

  return (
    <animated.div
      ref={Ref}
      id={Data.name}
      className={Data.name}
      style={animatedStyle}
    >
      <animated.p
        style={{ transform: `translateY(${-Data.size[0] / 2 - 20}px)` }}
      >
        {Data.title}
      </animated.p>
      <div>
        <h1>
          Name:{" "}
          <ExternalLink href="https://www.example.com/">
            Saeed Arabha
          </ExternalLink>
        </h1>
        <BirthdayLink />
      </div>
      <div>
        <ContactInfo label="CA Cell" phone="+14168365851" />
        <ContactInfo label="IR Cell" phone="+989196595351" />
      </div>
    </animated.div>
  );
};

export default PersonalInfo;
