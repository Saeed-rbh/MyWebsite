import React from "react";

const MainStatestics = ({ height, netAmounts }) => {
  const netSeries = Object.entries(netAmounts);
  console.log(netSeries);
  return (
    <div
      style={{ height: `${height - 225 - 85 - 55}px` }}
      className="MainStatestics"
    >
      <ul>
        {netSeries.map((Date, index) => (
          <li>{netSeries[index][0]}</li>
        ))}
      </ul>
    </div>
  );
};

export default MainStatestics;
