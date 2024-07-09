import React, { useEffect, useState, useMemo } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton";
import MoneyEntry from "./MoneyEntry";
import TransactionList from "./TransactionList";
import { animated, useSpring } from "react-spring";
import { fetchTransactions } from "./transactionService";
import MainStatestics from "./MainStatestics";
import { useWindowHeight } from "./tools";
import AddTransaction from "./AddTransaction";
import MoreOpen from "./MoreOpen";
import AddTransactionFeed from "./AddTransactionFeed";

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
  const [isAddClicked, setIsAddClicked] = useState(true);

  useEffect(() => {
    !isMoreClicked && setWhichMonth(1);
  }, [isMoreClicked]);

  const scaleStyle = useSpring({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    scale: isMoreClicked || isAddClicked !== null ? 0.9 : 1,
    opacity: isMoreClicked || isAddClicked !== null ? 0.5 : 1,
    filter: isAddClicked !== null ? "blur(10px)" : "blur(0px)",
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

  console.log(isAddClicked);

  const AddFeed = () => {
    return <AddTransactionFeed isAddClicked={isAddClicked} />;
  };

  return (
    <div className="MoneyMonitor_Main">
      <MoreOpen
        isClicked={isAddClicked}
        setIsClicked={setIsAddClicked}
        feed={AddFeed}
        MoreOpenHeight={100}
      />
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
          <AddTransaction setIsAddClicked={setIsAddClicked} />
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
                  Object.keys(mainNetAmounts).length - mainPageMonth - 1
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
