import React, { useEffect, useState } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton.jsx";
import MoneyEntry from "./MoneyEntry.jsx";
import TransactionList from "./TransactionList.jsx";
import { animated, useSpring, easings } from "react-spring";
import { fetchTransactions } from "./transactionService";
import MainStatestics from "./MainStatestics.jsx";

const ScalableHeading = ({ children }) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = () => {
    setIsScaled(true);
  };

  const handleMouseUp = () => {
    setIsScaled(false);
  };

  const style = useSpring({
    scale: isScaled ? 0.85 : 1,
  });

  return (
    <animated.h1
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </animated.h1>
  );
};

const MoneyMonitor = () => {
  const [height, setHeight] = useState(window.innerHeight - 100);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 500);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [spendingTransactions, setSpendingTransactions] = useState([]);
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [savingTransactions, setSavingTransactions] = useState([]);
  const [incomeAvailability, setIncomeAvailability] = useState([]);
  const [spendingAvailability, setSpendingAvailability] = useState([]);
  const [savingAvailability, setSavingAvailability] = useState([]);

  useEffect(() => {
    const processTransactions = async () => {
      const {
        spendingTransactions,
        incomeTransactions,
        savingTransactions,
        incomeAvailability,
        spendingAvailability,
        savingAvailability,
      } = await fetchTransactions();

      setSpendingTransactions(spendingTransactions);
      setIncomeTransactions(incomeTransactions);
      setSavingTransactions(savingTransactions);
      setIncomeAvailability(incomeAvailability);
      setSpendingAvailability(spendingAvailability);
      setSavingAvailability(savingAvailability);
    };
    processTransactions();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  const [whichMonth, setWhichMonth] = useState(1);
  const [lastIncomeEntry, setLastIncomeEntry] = useState({});
  const [lastSpendingEntry, setLastSpendingEntry] = useState({});
  const [lastSavingEntry, setLastSavingEntry] = useState({});

  useEffect(() => {
    if (Object.entries(incomeTransactions).length > 0) {
      const incomeentries = Object.entries(incomeTransactions);
      setLastIncomeEntry(incomeentries[incomeentries.length - whichMonth][1]);
    }
    if (Object.entries(spendingTransactions).length > 0) {
      const spendingentries = Object.entries(spendingTransactions);
      setLastSpendingEntry(
        spendingentries[spendingentries.length - whichMonth][1]
      );
    }
    if (Object.entries(savingTransactions).length > 0) {
      const savingentries = Object.entries(savingTransactions);
      setLastSavingEntry(savingentries[savingentries.length - whichMonth][1]);
    }
  }, [
    whichMonth,
    incomeTransactions,
    spendingTransactions,
    savingTransactions,
  ]);

  const [isMoreClicked, setIsMoreClicked] = useState(null);
  const scaleStyle = useSpring({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    scale: !!isMoreClicked ? 0.9 : 1,
    filter: !!isMoreClicked ? "blur(20px)" : "blur(0px)",
    height: height,
    config: {
      easing: easings.easeInOutCubic,
    },
  });

  return (
    <div className="MoneyMonitor_Main">
      {(Object.entries(incomeTransactions).length > 0 ||
        Object.entries(spendingTransactions).length > 0) && (
        <TransactionList
          Transactions={
            isMoreClicked === "Income"
              ? lastIncomeEntry
              : isMoreClicked === "Spending"
              ? lastSpendingEntry
              : isMoreClicked === "Saving"
              ? lastSavingEntry
              : []
          }
          isMoreClicked={isMoreClicked}
          setIsMoreClicked={setIsMoreClicked}
          setWhichMonth={setWhichMonth}
          whichMonth={whichMonth}
          dataAvailablity={
            isMoreClicked === "Income"
              ? incomeAvailability
              : isMoreClicked === "Spending"
              ? spendingAvailability
              : []
          }
        />
      )}
      <div className="MoneyMonitor_Parent">
        <div className="MoneyMonitor_header">
          <div className="MoneyMonitor_User">
            <div className="MoneyMonitor_Logo">
              {" "}
              <img
                src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
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
        <animated.div style={scaleStyle}>
          <div className="MoneyMonitor_Intro">
            <div className="MoneyMonitor_title">
              <span>
                My{" "}
                <img
                  src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
                  alt="MoneyMonitor Logo"
                />
              </span>
              <span>Dashboard</span>
            </div>
          </div>
          <div className="MoneyMonitor_Menu">
            <p>
              Add Transaction <span></span>
            </p>
            <ScalableHeading>
              <span>Income</span> Transaction
            </ScalableHeading>
            <ScalableHeading>
              <span>Spending</span> Transaction
            </ScalableHeading>
            <ScalableHeading>
              <span>Save & Invest</span>
            </ScalableHeading>
            <p>
              <span></span>
            </p>
          </div>
          <MainStatestics height={height} />
          {(Object.entries(incomeTransactions).length > 0 ||
            Object.entries(spendingTransactions).length > 0) && (
            <MoneyEntry
              setTotalExpense={setTotalExpense}
              setTotalIncome={setTotalIncome}
              setIsMoreClicked={setIsMoreClicked}
              spendingTransactions={spendingTransactions}
              incomeTransactions={incomeTransactions}
              savingTransactions={savingTransactions}
            />
          )}
        </animated.div>
      </div>
    </div>
  );
};
export default MoneyMonitor;
