import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton";
import MoneyEntry from "./MoneyEntry";
import TransactionList from "./TransactionList";
import { animated, useSpring } from "react-spring";
import { fetchTransactions } from "./transactionService";
import MainStatestics from "./MainStatestics";
import { useWindowHeight } from "./tools";

const ScalableHeading = ({ children }) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = useCallback(() => setIsScaled(true), []);
  const handleMouseUp = useCallback(() => setIsScaled(false), []);

  const style = useSpring({ scale: isScaled ? 0.85 : 1 });

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

const useTransactionData = (whichMonth) => {
  const [data, setData] = useState({
    income: [],
    spending: [],
    saving: [],
    lastIncome: {},
    lastSpending: {},
    lastSaving: {},
    netAmounts: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      const {
        selectedIncome,
        selectedspending,
        selectedsaving,
        incomeAvailability,
        spendingAvailability,
        savingAvailability,
        netAmounts,
      } = await fetchTransactions({ whichMonth });

      setData({
        income: incomeAvailability,
        spending: spendingAvailability,
        saving: savingAvailability,
        lastIncome: selectedIncome,
        lastSpending: selectedspending,
        lastSaving: selectedsaving,
        netAmounts: netAmounts,
      });
    };
    fetchData();
  }, [whichMonth]);

  return data;
};

const useMainPageMonth = () => {
  const [mainPageMonth, setMainPageMonth] = useState(1);
  return { mainPageMonth, setMainPageMonth };
};

const MoneyMonitor = () => {
  const height = useWindowHeight(100);
  const [whichMonth, setWhichMonth] = useState(1);
  const {
    income: incomeData,
    spending: spendingData,
    saving: savingData,
    lastIncome: lastIncomeData,
    lastSpending: lastSpendingData,
    lastSaving: lastSavingData,
    netAmounts: netAmountsData,
  } = useTransactionData(whichMonth);

  const { mainPageMonth, setMainPageMonth } = useMainPageMonth();
  const {
    lastIncome: mainLastIncome,
    lastSpending: mainLastSpending,
    lastSaving: mainLastSaving,
    netAmounts: mainNetAmounts,
  } = useTransactionData(mainPageMonth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreClicked, setIsMoreClicked] = useState(null);

  useEffect(() => {
    !isMoreClicked && setWhichMonth(1);
  }, [isMoreClicked]);

  const scaleStyle = useSpring({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    scale: isMoreClicked ? 0.9 : 1,
    opacity: isMoreClicked ? 0.5 : 1,
    height,
  });

  const BlurStyle = useSpring({
    opacity: !isMoreClicked ? 0 : 1,
    zIndex: !isMoreClicked ? 10 : 100,
  });

  const transactions = useMemo(() => {
    if (isMoreClicked === "Income") return lastIncomeData;
    if (isMoreClicked === "Spending") return lastSpendingData;
    if (isMoreClicked === "Saving") return lastSavingData;
    return [];
  }, [isMoreClicked, lastIncomeData, lastSpendingData, lastSavingData]);

  const dataAvailability = useMemo(() => {
    if (isMoreClicked === "Income") return incomeData;
    if (isMoreClicked === "Spending") return spendingData;
    if (isMoreClicked === "Saving") return savingData;
    return [];
  }, [isMoreClicked, incomeData, spendingData, savingData]);

  return (
    <div className="MoneyMonitor_Main">
      <animated.div
        className="MoneyMonitor_MainBlur"
        style={BlurStyle}
      ></animated.div>
      <TransactionList
        Transactions={transactions}
        isMoreClicked={isMoreClicked}
        setIsMoreClicked={setIsMoreClicked}
        setWhichMonth={setWhichMonth}
        whichMonth={whichMonth}
        dataAvailability={dataAvailability}
      />
      <div className="MoneyMonitor_Parent">
        <header className="MoneyMonitor_header">
          <div className="MoneyMonitor_User">
            <div className="MoneyMonitor_Logo">
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
        </header>
        <animated.div style={scaleStyle}>
          {/* <section className="MoneyMonitor_Intro">
            <h1 className="MoneyMonitor_title">
              <span>
                My{" "}
                <img
                  src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
                  alt="MoneyMonitor Logo"
                />
              </span>
              <span>Dashboard</span>
            </h1>
          </section> */}
          <nav className="MoneyMonitor_Menu">
            <p>
              Add <span>Transaction</span>
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
          </nav>
          <MainStatestics
            height={height}
            netAmounts={netAmountsData}
            mainPageMonth={mainPageMonth}
            setMainPageMonth={setMainPageMonth}
          />
          {Object.keys(mainNetAmounts).length > 0 && (
            <MoneyEntry
              setIsMoreClicked={setIsMoreClicked}
              spendingTransactions={mainLastSpending}
              incomeTransactions={mainLastIncome}
              savingTransactions={mainLastSaving}
              mainNetAmounts={
                Object.entries(mainNetAmounts)[
                  Object.keys(mainNetAmounts).length - mainPageMonth
                ][1]
              }
            />
          )}
        </animated.div>
      </div>
    </div>
  );
};

export default MoneyMonitor;
