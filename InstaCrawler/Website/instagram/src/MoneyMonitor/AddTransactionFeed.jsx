import React, { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useTransition, animated } from "react-spring";

function AddTransactionFeed({ isAddClicked }) {
  const DotStyle = {
    color:
      isAddClicked === "Income"
        ? "var(--Fc-2)"
        : isAddClicked === "Spending"
        ? "var(--Gc-2)"
        : "var(--Ac-2)",
  };

  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    setValue(newValue.length > 0 ? `$${newValue}` : "");
  };

  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef("");

  const AmountLogo = () => {
    const [showIcon, setShowIcon] = useState(false);

    console.log(showIcon);

    useEffect(() => {
      const prevValueLength = prevValueRef.current.length;
      const currentValueLength = value.length;

      if (
        (prevValueLength === 0 && currentValueLength === 2) ||
        (prevValueLength === 2 && currentValueLength === 0) ||
        (prevValueLength === 5 && currentValueLength === 6) ||
        (prevValueLength === 6 && currentValueLength === 5)
      ) {
        setShowIcon(true);
      } else {
        setShowIcon(false);
        setDisplayValue(value);
      }
      prevValueRef.current = value;
    }, [value]);

    const fontSize =
      displayValue.length > 5
        ? "1.3rem"
        : displayValue.length > 0
        ? "0.7rem"
        : "0.8rem";

    const fontColor =
      displayValue.length > 5
        ? "var(--Bc-2)"
        : displayValue.length > 0
        ? "var(--Fc-2)"
        : "var(--Gc-2)";

    const transitions = useTransition(displayValue, {
      from: { opacity: 0, transform: "scale(1.5)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(1.5)" },
      config: { duration: 500 },
    });

    const getIcon = () => {
      if (displayValue.length > 5) {
        return <MdOutlineAttachMoney fontSize={fontSize} color={fontColor} />;
      } else if (displayValue.length > 0) {
        return <FaCheck fontSize={fontSize} color={fontColor} />;
      } else {
        return <FaXmark fontSize={fontSize} color={fontColor} />;
      }
    };

    return (
      <div>
        {transitions((style, item) =>
          item ? (
            <animated.div
              className="AddTransactionFeed_AmountLogo"
              style={style}
            >
              {getIcon()}
            </animated.div>
          ) : (
            ""
          )
        )}
      </div>
    );
  };

  return (
    <div className="AddTransactionFeed">
      <h3>
        <span style={DotStyle}>•</span>Add New <span>{isAddClicked}</span>
      </h3>

      <ul>
        <li>
          <label>Amount:</label>
          <textarea
            type="text"
            maxlength="20"
            placeholder="$1000"
            value={value}
            onChange={handleChange}
          />
        </li>
        <AmountLogo value={value} />
        <li>
          <label>Reason:</label>
          <textarea
            type="text"
            maxlength="75"
            placeholder="Shopping for party"
          />
        </li>
      </ul>
    </div>
  );
}

export default AddTransactionFeed;
