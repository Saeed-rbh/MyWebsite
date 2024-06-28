import React from "react";

const MainStatestics = ({ height, netAmounts }) => {
  const netSeries = Object.entries(netAmounts);
  // console.log(netSeries);
  return (
    <div
      style={{ height: `${height - 225 - 85}px` }}
      className="MainStatestics"
    >
      <div className="MainStatestics-dash">
        <p>0</p>
      </div>
      <ul>
        {netSeries.map((Date, index) => (
          <div className="MainStatestics-batch">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li>Feb</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MainStatestics;
