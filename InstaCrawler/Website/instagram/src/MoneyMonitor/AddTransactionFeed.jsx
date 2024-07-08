import React from "react";

function AddTransactionFeed({ isAddClicked }) {
  const DotStyle = {
    color:
      isAddClicked === "Income"
        ? "var(--Fc-2)"
        : isAddClicked === "Spending"
        ? "var(--Gc-2)"
        : "var(--Ac-2)",
  };
  return (
    <div className="AddTransactionFeed">
      <h3>
        <span style={DotStyle}>•</span>Add New <span>{isAddClicked}</span>
      </h3>

      <ul>
        <li>
          <h1>Reason:</h1>
        </li>
      </ul>
    </div>
  );
}

export default AddTransactionFeed;
