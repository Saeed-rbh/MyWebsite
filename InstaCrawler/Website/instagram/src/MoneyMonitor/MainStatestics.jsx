import React from "react";

const MainStatestics = ({ height, netAmounts, mainPageMonth }) => {
  const netSeries = Object.entries(netAmounts).reverse();

  const last6MonthsData = netSeries.slice(0, 6).map((entry) => entry[1]);

  // Find the maximum values
  const maxIncome = Math.max(...last6MonthsData.map((d) => d.income));
  const maxNet = Math.max(...last6MonthsData.map((d) => d.net));
  const maxSaving = Math.max(...last6MonthsData.map((d) => d.saving));
  const maxSpending = Math.max(...last6MonthsData.map((d) => d.spending));

  const maxValue = Math.max(maxIncome, maxNet, maxSaving, maxSpending);

  // Calculate percentages
  const calculatePercentage = (value, max) => (value / max) * 40;

  const processedData = last6MonthsData.map((d) => ({
    ...d,
    incomePercentage: calculatePercentage(d.income, maxValue),
    netPercentage: calculatePercentage(d.net, maxValue),
    savingPercentage: calculatePercentage(d.saving, maxValue),
    spendingPercentage: calculatePercentage(d.spending, maxValue),
  }));

  console.log(processedData);

  return (
    <div
      style={{ height: `${height - 225 - 85}px` }}
      className="MainStatestics"
    >
      <div className="MainStatestics-dash">
        <p>0</p>
      </div>
      <ul>
        {processedData.map((Des, index) => (
          <div
            className="MainStatestics-batch"
            style={{ opacity: index + 1 === mainPageMonth ? 0.8 : 0.4 }}
          >
            <li></li>
            <li
              style={{
                height: `${Des.savingPercentage}%`,
              }}
            ></li>
            <li
              style={{
                height: `${Des.netPercentage}%`,
              }}
            ></li>
            <li
              style={{
                height: `${
                  Des.spendingPercentage === 0 ? 10 : Des.spendingPercentage
                }%`,
                background: Des.spendingPercentage === 0 ? "var(--Ac-2)" : null,
              }}
            ></li>
            <li
              style={{
                height: `${
                  Des.incomePercentage === 0 ? 10 : Des.incomePercentage
                }%`,
                background: Des.incomePercentage === 0 ? "var(--Ac-2)" : null,
              }}
            ></li>
            <li>{Des.month}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MainStatestics;
