import React from "react";
import FormatDate from "./formatDate"; // Change the import name accordingly

const MoneyEntryAmount = ({ type, transaction }) => {
  const amountStyle = {
    backgroundColor:
      type === "Income"
        ? "rgba(160, 255, 223, 0.45)"
        : "rgba(253, 123, 123, 0.49)",
  };

  const truncateReason = (reason) => {
    return reason.length > 16 ? reason.slice(0, 12) + "..." : reason;
  };

  return (
    <div className="MoneyEntry_Amount" style={amountStyle}>
      <p>{truncateReason(transaction.Reason)}</p>
      <p>
        <span></span>${transaction.Amount}{" "}
      </p>
      <FormatDate timestamp={transaction.Timestamp} type={transaction.Type} />
    </div>
  );
};

export default MoneyEntryAmount;
