// import React, { useEffect, useState } from "react";
// import "./MoneyMonitor.css";
// import MenuButton from "../Header/MenuButton.jsx";
// import MoneyEntry from "./MoneyEntry.jsx";
// import TransactionList from "./TransactionList.jsx";
// import { animated, useSpring, easings } from "react-spring";
// import { fetchTransactions } from "./transactionService";
// import MainStatestics from "./MainStatestics.jsx";

// const ScalableHeading = ({ children }) => {
//   const [isScaled, setIsScaled] = useState(false);

//   const handleMouseDown = () => {
//     setIsScaled(true);
//   };

//   const handleMouseUp = () => {
//     setIsScaled(false);
//   };

//   const style = useSpring({
//     scale: isScaled ? 0.85 : 1,
//   });

//   return (
//     <animated.h1
//       style={style}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//       onTouchStart={handleMouseDown}
//       onTouchEnd={handleMouseUp}
//     >
//       {children}
//     </animated.h1>
//   );
// };

// const MoneyMonitor = () => {
//   const [height, setHeight] = useState(window.innerHeight - 100);

//   useEffect(() => {
//     const handleResize = () => {
//       setHeight(window.innerHeight - 500);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);
//   const [whichMonth, setWhichMonth] = useState(1);

//   const [incomeAvailability, setIncomeAvailability] = useState([]);
//   const [spendingAvailability, setSpendingAvailability] = useState([]);
//   const [savingAvailability, setSavingAvailability] = useState([]);
//   const [lastIncomeEntry, setLastIncomeEntry] = useState({});
//   const [lastSpendingEntry, setLastSpendingEntry] = useState({});
//   const [lastSavingEntry, setLastSavingEntry] = useState({});

//   useEffect(() => {
//     const processTransactions = async (whichMonth) => {
//       const {
//         selectedIncome,
//         selectedspending,
//         selectedsaving,
//         incomeAvailability,
//         spendingAvailability,
//         savingAvailability,
//       } = await fetchTransactions({ whichMonth });

//       setLastIncomeEntry(selectedIncome);
//       setLastSpendingEntry(selectedspending);
//       setLastSavingEntry(selectedsaving);
//       setIncomeAvailability(incomeAvailability);
//       setSpendingAvailability(spendingAvailability);
//       setSavingAvailability(savingAvailability);
//     };
//     processTransactions(whichMonth);
//   }, [whichMonth]);

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const [isMoreClicked, setIsMoreClicked] = useState(null);
//   const scaleStyle = useSpring({
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     width: "100%",
//     scale: !!isMoreClicked ? 0.9 : 1,
//     filter: !!isMoreClicked ? "blur(20px)" : "blur(0px)",
//     height: height,
//     config: {
//       easing: easings.easeInOutCubic,
//     },
//   });

//   return (
//     <div className="MoneyMonitor_Main">
//       <TransactionList
//         Transactions={
//           isMoreClicked === "Income"
//             ? lastIncomeEntry
//             : isMoreClicked === "Spending"
//             ? lastSpendingEntry
//             : isMoreClicked === "Saving"
//             ? lastSavingEntry
//             : []
//         }
//         isMoreClicked={isMoreClicked}
//         setIsMoreClicked={setIsMoreClicked}
//         setWhichMonth={setWhichMonth}
//         whichMonth={whichMonth}
//         dataAvailablity={
//           isMoreClicked === "Income"
//             ? incomeAvailability
//             : isMoreClicked === "Spending"
//             ? spendingAvailability
//             : isMoreClicked === "Saving"
//             ? savingAvailability
//             : []
//         }
//       />

//       <div className="MoneyMonitor_Parent">
//         <div className="MoneyMonitor_header">
//           <div className="MoneyMonitor_User">
//             <div className="MoneyMonitor_Logo">
//               {" "}
//               <img
//                 src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
//                 alt="MoneyMonitor Logo"
//               />
//             </div>
//             <p>
//               <span>Money Monitor</span>
//               <span>965896521</span>
//             </p>
//           </div>
//           <MenuButton
//             handleButtonClick={setIsMenuOpen}
//             isMenuOpen={isMenuOpen}
//           />
//         </div>
//         <animated.div style={scaleStyle}>
//           <div className="MoneyMonitor_Intro">
//             <div className="MoneyMonitor_title">
//               <span>
//                 My{" "}
//                 <img
//                   src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
//                   alt="MoneyMonitor Logo"
//                 />
//               </span>
//               <span>Dashboard</span>
//             </div>
//           </div>
//           <div className="MoneyMonitor_Menu">
//             <p>
//               Add Transaction <span></span>
//             </p>
//             <ScalableHeading>
//               <span>Income</span> Transaction
//             </ScalableHeading>
//             <ScalableHeading>
//               <span>Spending</span> Transaction
//             </ScalableHeading>
//             <ScalableHeading>
//               <span>Save & Invest</span>
//             </ScalableHeading>
//             <p>
//               <span></span>
//             </p>
//           </div>
//           <MainStatestics height={height} />
//           <MoneyEntry
//             setIsMoreClicked={setIsMoreClicked}
//             spendingTransactions={lastSpendingEntry}
//             incomeTransactions={lastIncomeEntry}
//             savingTransactions={lastSavingEntry}
//           />
//         </animated.div>
//       </div>
//     </div>
//   );
// };
// export default MoneyMonitor;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton";
import MoneyEntry from "./MoneyEntry";
import TransactionList from "./TransactionList";
import { animated, useSpring, easings } from "react-spring";
import { fetchTransactions } from "./transactionService";
import MainStatestics from "./MainStatestics";
import { useWindowHeight } from "./tools";

const ScalableHeading = ({ children }) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = useCallback(() => setIsScaled(true), []);
  const handleMouseUp = useCallback(() => setIsScaled(false), []);

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

const MoneyMonitor = () => {
  const height = useWindowHeight(100);
  const [whichMonth, setWhichMonth] = useState(1);
  const {
    income,
    spending,
    saving,
    lastIncome,
    lastSpending,
    lastSaving,
    netAmounts,
  } = useTransactionData(whichMonth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreClicked, setIsMoreClicked] = useState(null);

  const scaleStyle = useSpring({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    scale: !!isMoreClicked ? 0.9 : 1,
    filter: !!isMoreClicked ? "blur(20px)" : "blur(0px)",
    height,
    // config: { easing: easings.easeInOutCubic },
  });

  const transactions = useMemo(() => {
    switch (isMoreClicked) {
      case "Income":
        return lastIncome;
      case "Spending":
        return lastSpending;
      case "Saving":
        return lastSaving;
      default:
        return [];
    }
  }, [isMoreClicked, lastIncome, lastSpending, lastSaving]);

  const dataAvailability = useMemo(() => {
    switch (isMoreClicked) {
      case "Income":
        return income;
      case "Spending":
        return spending;
      case "Saving":
        return saving;
      default:
        return [];
    }
  }, [isMoreClicked, income, spending, saving]);

  return (
    <div className="MoneyMonitor_Main">
      <TransactionList
        Transactions={transactions}
        isMoreClicked={isMoreClicked}
        setIsMoreClicked={setIsMoreClicked}
        setWhichMonth={setWhichMonth}
        whichMonth={whichMonth}
        dataAvailability={dataAvailability}
      />
      <div className="MoneyMonitor_Parent">
        <div className="MoneyMonitor_header">
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
          <MainStatestics height={height} netAmounts={netAmounts} />
          <MoneyEntry
            setIsMoreClicked={setIsMoreClicked}
            spendingTransactions={lastSpending}
            incomeTransactions={lastIncome}
            savingTransactions={lastSaving}
          />
        </animated.div>
      </div>
    </div>
  );
};

export default MoneyMonitor;
