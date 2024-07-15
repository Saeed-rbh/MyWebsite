import React, { useState, useEffect } from "react";
import { useNumericInput } from "./useNumericInput";
import Amount from "./Amount";
import Reason from "./Reason";
import DateTime from "./DateTime";
import Category from "./Category";
import Confirm from "./Confirm";
import {
  spending_categories,
  Income_categories,
  SaveInvest_categories,
} from "./Categories";
import { useWindowHeight } from "../tools";
import { MdOutlineAutoAwesome } from "react-icons/md";

function AddTransactionFeed({ isAddClicked, setIsClicked, setAddTransaction }) {
  const height = Math.max(Math.min(useWindowHeight(160), 500), 470);

  const OriginalList =
    isAddClicked === "Income"
      ? Income_categories
      : isAddClicked === "Spending"
      ? spending_categories
      : SaveInvest_categories;

  const AutoDetect = ["Auto Detect", <MdOutlineAutoAwesome />];
  const List = [AutoDetect, ...OriginalList];
  const [selectedCategory, setSelectedCategory] = useState(List[0]);

  const DotStyle = {
    color:
      isAddClicked === "Income"
        ? "var(--Fc-2)"
        : isAddClicked === "Spending"
        ? "var(--Gc-2)"
        : "var(--Ac-2)",
  };

  const [value, setValue] = useState("");
  const [valueError, setValueError] = useState(true);

  useEffect(() => {
    setValue("");
  }, [isAddClicked]);

  const [reason, setReason] = useState("");

  const [currentTime, setCurrentTime] = useState({
    hours: "",
    minutes: "",
    year: "",
    month: "",
    day: "",
  });

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    setCurrentTime({
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      year: year,
      month: month,
      day: day,
    });
  }, []);

  const [hour] = useNumericInput("", 0, 23);
  const [minute] = useNumericInput("", 0, 59);
  const [day] = useNumericInput("", 1, 31);
  const [month] = useNumericInput("", 1, 12);
  const [year] = useNumericInput("", 2023, currentTime.year, true);

  const [whichType, setWhichType] = useState(true);

  const handleAddClick = () => {
    value.length < 1 ? setValueError(false) : setValueError(true);
    if (value.length > 0) {
      const newTransaction = {
        Amount: Number(value.replace(/[^0-9]/g, "")),
        Reason: reason,
        Label: selectedCategory[0],
        Timestamp: `${year.value.length < 1 ? currentTime.year : year.value}-${
          month.value.length < 1 ? currentTime.month : month.value
        }-${day.value.length < 1 ? currentTime.day : day.value} ${
          hour.value.length < 1 ? currentTime.hours : hour.value
        }:${minute.value.length < 1 ? currentTime.minutes : minute.value}`,
        Type: whichType ? "Daily" : "Monthly",
        Category: isAddClicked,
      };
      setAddTransaction(newTransaction);
      setIsClicked(null);
    }
  };

  return (
    <div className="AddTransactionFeed" style={{ height: `${height}px` }}>
      <h3>
        <span style={DotStyle}>•</span>Add New <span>{isAddClicked}</span>
      </h3>

      <ul>
        <Amount
          value={value}
          setValue={setValue}
          valueError={valueError}
          setValueError={setValueError}
        />
        <Reason Reason={Reason} setReason={setReason} />
        <DateTime
          currentTime={currentTime}
          hour={hour}
          day={day}
          minute={minute}
          month={month}
          year={year}
        />
        <Category
          List={List}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <Confirm
          whichType={whichType}
          setWhichType={setWhichType}
          handleAddClick={handleAddClick}
        />
      </ul>
    </div>
  );
}

export default AddTransactionFeed;
