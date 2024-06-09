import React, { useEffect, useState } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton.jsx";
import MoneyEntry from "./MoneyEntry.jsx";
import TransactionList from "./TransactionList.jsx";
const MoneyMonitor = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  const amountStyle = {
    color:
      totalBalance > 0 ? "rgba(131, 255, 201, 0.85)" : "rgb(255 102 102 / 85%)",
  };

  return (
    <div className="MoneyMonitor_Main">
      <TransactionList />
      <div className="MoneyMonitor_Parent">
        <div className="MoneyMonitor_header">
          <div className="MoneyMonitor_User">
            <div className="MoneyMonitor_Logo">
              {" "}
              <img
                src={`${process.env.PUBLIC_URL}/MoneyMonitor.png`}
                alt="MoneyMonitor Logo"
              />
            </div>
            <p>
              <span>Money Monitor</span>
              <span>965896521</span>
            </p>
          </div>
          <MenuButton
            handleButtonClick={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
          />
        </div>
        <div className="MoneyMonitor_Intro">
          <div className="MoneyMonitor_title">
            <span>Your</span>
            <span>Transactions</span>
          </div>
          <div className="MoneyMonitor_Balance">
            <span>
              <h2>My</h2> Balance:{" "}
            </span>
            <span style={amountStyle}>${Math.abs(totalBalance)}</span>
          </div>
        </div>
        <div className="MoneyMonitor_Menu">
          <p>
            Add Transaction <span></span>
          </p>
          <h1>Daily income</h1>
          <h1>Daily Expense</h1>
          <h1>Monthly income</h1>
          <h1>Monthly Expense</h1>
          <p>
            <span></span>
          </p>
        </div>
        <MoneyEntry type="Income" setTotal={setTotalIncome} />
        <MoneyEntry type="Expense" setTotal={setTotalExpense} />
      </div>
    </div>
  );
};
export default MoneyMonitor;
