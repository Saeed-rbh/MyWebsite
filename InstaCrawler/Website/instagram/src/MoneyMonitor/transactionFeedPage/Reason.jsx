import React, { useState } from "react";
import { animated } from "react-spring";
import { ScalableElement } from "../tools";

const Reason = ({ reason, setReason, defaultValue }) => {
  const [ReasonFocused, setReasonFocused] = useState(false);
  const handleReasonFocus = () => {
    setReasonFocused(true);
  };
  const handleReasonBlur = () => {
    setReasonFocused(false);
  };

  const [ReasonCount, setReasonCount] = useState(0);

  const handleReason = (event) => {
    const newValue = event.target.value.replace(/\n/g, "");
    setReason(newValue);
    setReasonCount(newValue.length);
  };

  const handleErase = () => {
    setReason("");
    setReasonCount(0);
  };

  return (
    <li className="Add_Reason">
      <animated.label>Reason {ReasonFocused ? ":" : "|"} </animated.label>
      <animated.textarea
        type="text"
        maxlength="50"
        placeholder="Shopping for party"
        defaultValue={defaultValue}
        value={reason}
        onChange={handleReason}
        onFocus={handleReasonFocus}
        onBlur={handleReasonBlur}
      />
      <animated.h1>
        Character:<span>{ReasonCount} </span>| 50
      </animated.h1>
      <ScalableElement as="h2" onClick={handleErase}>
        Clear All
      </ScalableElement>
      <hr />
      <hr />
    </li>
  );
};

export default Reason;
