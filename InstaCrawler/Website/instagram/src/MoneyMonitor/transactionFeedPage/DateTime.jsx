import React from "react";

const DateTime = ({
  currentTime,
  hour,
  minute,
  day,
  month,
  year,
  defaultValue,
}) => {
  const Modify = defaultValue.length > 0;
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
          defaultValue={Modify ? defaultValue.split(" ")[1].split(":")[0] : ""}
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
          defaultValue={Modify ? defaultValue.split(" ")[1].split(":")[1] : ""}
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
          defaultValue={Modify ? defaultValue.split(" ")[0].split("-")[2] : ""}
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
          defaultValue={Modify ? defaultValue.split(" ")[0].split("-")[1] : ""}
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
          defaultValue={Modify ? defaultValue.split(" ")[0].split("-")[0] : ""}
        />
      </h1>
    </li>
  );
};

export default DateTime;
