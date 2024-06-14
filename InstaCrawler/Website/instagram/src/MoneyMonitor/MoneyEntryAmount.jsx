import React from "react";
import FormatDate from "./formatDate"; // Change the import name accordingly
import { useSpring, animated } from "react-spring";

const MoneyEntryAmount = ({ type, transaction }) => {
  const amountStyle = {
    background:
      type === "Income"
        ? "linear-gradient(165deg, var(--Fc-2) 30%, var(--Fc-4) 100%)"
        : "linear-gradient(165deg, var(--Gc-2) 30%, var(--Gc-4) 100%)",
  };
  const truncateReason = (reason) => {
    return reason.length > 16 ? reason.slice(0, 12) + "..." : reason;
  };

  const [isScaled, setIsScaled] = React.useState(false);

  const handleMouseDown = () => {
    setIsScaled(true);
  };

  const handleMouseUp = () => {
    setIsScaled(false);
  };

  const scaleStyle = useSpring({
    scale: isScaled ? 0.95 : 1,
  });

  const truncateDescription = (description, maxLength = 15) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength - 3) + "...";
    } else {
      return description;
    }
  };

  return (
    <animated.div
      className="MoneyEntry_Amount"
      style={{ ...amountStyle, ...scaleStyle }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <p>{truncateDescription(truncateReason(transaction.Reason))}</p>
      <p>
        <span></span>${transaction.Amount}{" "}
      </p>
      <FormatDate
        timestamp={transaction.Timestamp}
        type={transaction.Type}
        colorType={type}
      />
    </animated.div>
  );
};

export default MoneyEntryAmount;
