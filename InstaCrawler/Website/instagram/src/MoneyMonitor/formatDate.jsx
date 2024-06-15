import React from "react";

const formatDate = ({ timestamp, type, colorType }) => {
  const dateObj = new Date(timestamp);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const amountStyle = {
    background:
      colorType === "Income"
        ? "linear-gradient(165deg, var(--Fc-4) 30%, var(--Fc-4) 100%)"
        : "linear-gradient(165deg, var(--Gc-4) 30%, var(--Gc-4) 100%)",
  };

  const formattedDate = `${monthNames[monthIndex]} ${day}${
    day === 1
      ? "<sup>st</sup>"
      : day === 2
      ? "<sup>nd</sup>"
      : day === 3
      ? "<sup>rd</sup>"
      : "<sup>th</sup>"
  } ${year}`;
  const formattedTime =
    type === "Daily"
      ? `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${
          hours >= 12 ? "pm" : "am"
        }`
      : "Monthly";

  return (
    <div className="MoneyEntry_Detail">
      <h1 dangerouslySetInnerHTML={{ __html: formattedDate }} />
      <h1>
        {formattedTime} <span></span>
      </h1>
    </div>
  );
};

export default formatDate;
