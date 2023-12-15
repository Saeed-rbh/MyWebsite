import React from "react";
import { animated } from "react-spring";
import OpenIcon from "./OpenIcon";
import MoreInfo from "./MoreInfo";
import useElementSize from "./Styles//useElementSize";
import QualificationList from "./Qualifications/QualificationList";
import AnimatedTextStyle from "./Qualifications/AnimatedTextStyle";
import BaseStyle from "./Qualifications/BaseStyle";
import { ListOfQualifications } from "./Qualifications/ListOfQualifications";
import { useCloseOpenStyles } from "./Qualifications/useCloseOpenStyles";
import RotatingSphere from "../Footer/RotatingSphere";

function Qualifications({
  Data,
  CloseOpen,
  setCloseOpen,
  MouseHover,
  setMouseHover,
  MainElementSize,
  Ref,
}) {
  const styles = useCloseOpenStyles(
    CloseOpen,
    Data,
    MouseHover,
    MainElementSize
  );

  const handleClickOpen = () => {
    if (!CloseOpen[0]) {
      setCloseOpen([true, Data.title]);
    }
  };
  const handleMouseEnter = () => {
    if (!CloseOpen[0]) {
      setMouseHover([true, Data.title]);
    }
  };

  const handleMouseLeave = () => setMouseHover([false, Data.title]);

  return (
    <BaseStyle
      ref={Ref}
      style={styles.base}
      onClick={handleClickOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <RotatingSphere isCross={true} /> */}
      <OpenIcon
        isOpen={true}
        Test="Close"
        CloseOpen={CloseOpen[1] === Data.title && CloseOpen[0]}
        handleClickClose={() => setCloseOpen([false, Data.title])}
        backgroundColor={Data.background}
      />
      <MoreInfo
        CloseOpen={CloseOpen[1] === Data.title && CloseOpen[0]}
        MouseHover={MouseHover[1] === Data.title && MouseHover[0]}
        show={false}
        backgroundColor={Data.background}
      />
      <AnimatedTextStyle style={styles.text}>{Data.title}</AnimatedTextStyle>
      <animated.div style={styles.quali} className="QualiMain">
        <QualificationList
          qualifications={ListOfQualifications}
          style={styles.qualiList}
        />
      </animated.div>
    </BaseStyle>
  );
}

export default Qualifications;
