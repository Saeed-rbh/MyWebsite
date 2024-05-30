import React, { useState } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton.jsx";
import { FiArrowRight } from "react-icons/fi";

const MoneyMonitor = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="MoneyMonitor_Main">
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
            <p>Money Monitor</p>
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
            <span>Balance: </span>
            <span>1200$</span>
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
        <div className="MoneyMonitor_Income">
          <p>
            <h1>
              <span className="IncomeDot">• </span> Income
            </h1>
            <h1 className="totalIncome">
              <span className="totalIncomeTitle">Total: </span> 12000$
            </h1>
          </p>
          <div className="MoneyMonitor_IncomeData">
            <div className="MoneyMonitor_IncomeAdd">
              <span>+</span>
            </div>
            <div className="MoneyMonitor_IncomeAmount">
              <p>My Salary</p>
              <p>
                <span></span>1000$
              </p>
              <div className="MoneyMonitor_IncomeDetail">
                <h1>25/Mar/2024</h1>{" "}
                <h1>
                  10:55 <span></span>
                </h1>
              </div>
            </div>
            <div className="MoneyMonitor_IncomeAmount">
              <p>My Salary</p>
              <p>
                <span></span>1000$
              </p>
              <div className="MoneyMonitor_IncomeDetail">
                <h1>25/Mar/2024</h1>{" "}
                <h1>
                  Monthly <span></span>
                </h1>
              </div>
            </div>
            <div className="MoneyMonitor_IncomeAmount">
              <p>My Salary</p>
              <p>
                <span></span>1000$
              </p>
              <div className="MoneyMonitor_IncomeDetail">
                <h1>25/Mar/2024</h1>{" "}
                <h1>
                  Monthly <span></span>
                </h1>
              </div>
            </div>
            <div className="MoneyMonitor_IncomeMore">
              <span>
                <FiArrowRight />
              </span>
            </div>
          </div>
        </div>
        <div className="MoneyMonitor_Income">
          <p>
            <h1>
              <span className="ExpenseDot">• </span> Expense
            </h1>
            <span></span>
            <h1 className="totalExpense">
              <span className="totalIncomeTitle">Total: </span> 10000$
            </h1>
          </p>
          <div className="MoneyMonitor_IncomeData">
            <div className="MoneyMonitor_IncomeAdd">
              <span>+</span>
            </div>
            <div className="MoneyMonitor_ExpenseAmount">
              <p>My Salary</p>
              <p>
                <span></span>1000$
              </p>
              <div className="MoneyMonitor_IncomeDetail">
                <h1>25/Mar/2024</h1>{" "}
                <h1>
                  10:55 <span></span>
                </h1>
              </div>
            </div>
            <div className="MoneyMonitor_ExpenseAmount">
              <p>My Salary</p>
              <p>
                <span></span>1000$
              </p>
              <div className="MoneyMonitor_IncomeDetail">
                <h1>25/Mar/2024</h1>{" "}
                <h1>
                  Monthly <span></span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoneyMonitor;
