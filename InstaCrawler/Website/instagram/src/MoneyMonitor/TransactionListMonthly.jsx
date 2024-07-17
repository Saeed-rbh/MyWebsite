import React from "react";
import TransactionListItem from "./TransactionListItem";
import { useSpring, animated, config } from "react-spring";

const TransactionListMonthly = ({
  MainIndex,
  swipedIndex,
  handleUnSwipe,
  handleSwipe,
  handleTransactionClick,
  isMoreClicked,
  transactions,
  sortby,
  stationary,
}) => {
  const filteredTransactions =
    sortby === "All"
      ? transactions
      : transactions.filter((transaction) => transaction.Type === sortby);

  // const delay = 300 + 20 * MainIndex;
  // const style = useSpring({
  //   from: {
  //     opacity: !isMoreClicked ? 1 : 0,
  //     y: !isMoreClicked ? 0 : 50,
  //   },
  //   to: {
  //     opacity: isMoreClicked ? 1 : 0,
  //     y: isMoreClicked ? 0 : 50,
  //   },
  //   delay: isMoreClicked ? delay : 1000,
  //   config: config.slow,
  // });

  return (
    <animated.div className="TransactionList_Monthly">
      <ul className="TransactionList_TransactionList">
        {filteredTransactions.map((transaction, index) => (
          <TransactionListItem
            key={index}
            index={index}
            icon={transaction.icon}
            description={transaction.Reason}
            type={transaction.Type}
            time={transaction.Timestamp}
            amount={transaction.Amount}
            isSwiped={swipedIndex[1] === index && swipedIndex[0] === MainIndex}
            onSwipe={() => handleSwipe(MainIndex, index)}
            onUnSwipe={handleUnSwipe}
            onClick={(y) => handleTransactionClick(MainIndex, index, y)}
          />
        ))}
      </ul>
    </animated.div>
  );
};

export default TransactionListMonthly;
