import React from "react";

const DateTime = ({ currentTime, hour, minute, day, month, year }) => {
  const getBorderStyle = (isValid) =>
    isValid ? {} : { border: "1px solid var(--Gc-2)" };

  return (
    <li className="Add_DateTime">
      <h1>
        <p>
          • Time <span></span>
        </p>
        <textarea
          type="text"
          maxlength="2"
          inputmode="numeric"
          placeholder={currentTime.hours}
          value={hour.value}
          onChange={hour.handleChange}
          onBlur={hour.handleBlur}
          style={getBorderStyle(hour.isValid)}
        />
        :
        <textarea
          type="text"
          maxlength="2"
          inputmode="numeric"
          placeholder={currentTime.minutes}
          value={minute.value}
          onChange={minute.handleChange}
          onBlur={minute.handleBlur}
          style={getBorderStyle(minute.isValid)}
        />
      </h1>
      <h1>
        <p>
          • Date <span></span>
        </p>
        <textarea
          type="text"
          maxlength="2"
          inputmode="numeric"
          placeholder={currentTime.day}
          value={day.value}
          onChange={day.handleChange}
          onBlur={day}
          style={getBorderStyle(day.isValid)}
        />
        /
        <textarea
          type="text"
          maxlength="2"
          inputmode="numeric"
          placeholder={currentTime.month}
          value={month.value}
          onChange={month.handleChange}
          onBlur={month.handleBlur}
          style={getBorderStyle(month.isValid)}
        />
        /
        <textarea
          type="text"
          maxlength="4"
          inputmode="numeric"
          placeholder={currentTime.year}
          value={year.value}
          onChange={year.handleChange}
          onBlur={year.handleBlur}
          style={getBorderStyle(year.isValid)}
        />
      </h1>
    </li>
  );
};

export default DateTime;
