import React from "react";
import { useSpring, animated } from "react-spring";
import { ScalableElement } from "../tools";

const Confirm = ({ handleAddClick, whichType, setWhichType }) => {
  const ConfirmStyle = useSpring({
    left: whichType ? "0%" : "43%",
    width: whichType ? "40%" : "57%",
    marginLeft: whichType ? 2 : -2,
  });

  const ConfirmStyleDay = useSpring({
    x: whichType ? 0 : 3,
  });
  const ConfirmStyleMonth = useSpring({
    x: whichType ? -4 : 0,
  });

  return (
    <li className="Add_Confirm">
      <h1>
        <ScalableElement
          as="span"
          onClick={() => setWhichType(true)}
          style={ConfirmStyleDay}
        >
          Daily
        </ScalableElement>
        <ScalableElement
          as="span"
          onClick={() => setWhichType(false)}
          style={ConfirmStyleMonth}
        >
          Monthly
        </ScalableElement>
        <animated.span style={ConfirmStyle}></animated.span>
      </h1>
      <ScalableElement as="h2" onClick={() => handleAddClick()}>
        Add Transaction
      </ScalableElement>
    </li>
  );
};

export default Confirm;
