import React, { useCallback, useState } from "react";
import { animated, useSpring } from "react-spring";
import { GoArrowUpRight, GoArrowDownLeft, GoPlus } from "react-icons/go";

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

const AddTransaction = () => {
  return (
    <nav className="MoneyMonitor_Menu">
      <p>
        Add <span>Transaction</span>
      </p>
      <ScalableHeading>
        <GoArrowDownLeft /> <span>Income</span>
      </ScalableHeading>
      <ScalableHeading>
        <GoArrowUpRight />
        <span>Spending</span>
      </ScalableHeading>
      <ScalableHeading>
        <GoPlus /> <span>Save & Invest</span>
      </ScalableHeading>
    </nav>
  );
};

export default AddTransaction;