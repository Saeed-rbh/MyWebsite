import React, { useEffect, useState, useRef } from "react";
import { FiArrowRight } from "react-icons/fi"; // Assuming you're using react-icons for the arrow icon
import MoneyEntryAmount from "./MoneyEntryAmount.jsx";

const MoneyEntry = ({ type, setTotal }) => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dailyResponse = await fetch("/Data.json");
      const dailyJsonData = await dailyResponse.json();
      setData(dailyJsonData);
    };
    fetchData();
  }, []);

  const transactions = Data.filter((item) => item.Category === type);
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.Amount,
    0
  );

  useEffect(() => {
    setTotal(totalAmount);
  }, [totalAmount, setTotal]);

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
    if (container && transactions.length > 3) {
      console.log(transactions.length);
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
  }, [transactions.length, containerRef.current]);

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
          <span className={`MoneyEntry_totalTitle`}>Total: </span> $
          {totalAmount}
        </h1>
      </p>
      <div className={`MoneyEntry_Data`}>
        <div className={`MoneyEntry_Add`}>
          <span>+</span>
        </div>
        <div
          className={`MoneyEntry_AmountBase`}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {transactions.map((transaction, index) => (
            <MoneyEntryAmount type={type} transaction={transaction} />
          ))}
        </div>
        <div className={`MoneyEntry_More`}>
          <span>
            <FiArrowRight />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoneyEntry;
