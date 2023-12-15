import React from "react";
import { animated } from "react-spring";

function QualificationItem({ qualification, style }) {
  return (
    <animated.div style={style} className="Quali">
      <div className="Quali-Title">
        <p>{qualification.title}</p>
        <h2>{qualification.Date}</h2>
      </div>
      <h1>{qualification.Location}</h1>
      <h1>
        <span>Thesis:</span> {qualification.Thesis}
      </h1>
      <h1>
        <span>Supervisor & Advisor:</span> {qualification.Supervisor}
      </h1>
    </animated.div>
  );
}

export default QualificationItem;
