import React, { useEffect, useState, useRef } from "react";
import { FiArrowRight } from "react-icons/fi"; // Assuming you're using react-icons for the arrow icon
import MoneyEntryAmount from "./MoneyEntryAmount.jsx";
import { useSpring, animated } from "react-spring";

const ScalableElement = ({ children, className, onClick }) => {
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
    <animated.div
      className={className}
      style={style}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </animated.div>
  );
};

const MoneyEntry = ({ type, setTotal, setIsMoreClicked, Transactions }) => {
  const entries = Object.entries(Transactions);
  const lastEntry = entries[entries.length - 1];

  const totalAmount =
    type === "Income" ? lastEntry[1].totalIncome : lastEntry[1].totalSpending;
  useEffect(() => {
    setTotal(totalAmount.toFixed(2));
  }, [setTotal, lastEntry, totalAmount]);

  const totalStyle = {
    color:
      type === "Income"
        ? "rgba(131, 255, 201, 0.85)"
        : "rgb(255 102 102 / 85%)",
  };
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 0.9;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && Transactions.length > 3) {
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [Transactions.length, containerRef.current]);

  return (
    <div className={`MoneyEntry`}>
      <p>
        <h1>
          <span className={`MoneyEntry_Dot`} style={totalStyle}>
            •{" "}
          </span>
          <h2>My</h2> {type}
        </h1>
        <h1 className={`MoneyEntry_total`} style={totalStyle}>
          {" "}
          <span className={`MoneyEntry_totalTitleMonth`}>
            {lastEntry[1].month}
          </span>
          <span className={`MoneyEntry_totalTitle`}>Total: </span> $
          {totalAmount.toFixed(2)}
        </h1>
      </p>
      <div className={`MoneyEntry_Data`}>
        <ScalableElement className="MoneyEntry_Add">
          <span>+</span>
        </ScalableElement>

        <div
          className={`MoneyEntry_AmountBase`}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {lastEntry[1].transactions.slice(0, 3).map((transaction, index) => (
            <MoneyEntryAmount type={type} transaction={transaction} />
          ))}
        </div>
        <ScalableElement
          className="MoneyEntry_More"
          onClick={() => setIsMoreClicked(type)}
        >
          <span>
            <FiArrowRight />
          </span>
        </ScalableElement>
      </div>
    </div>
  );
};

export default MoneyEntry;
