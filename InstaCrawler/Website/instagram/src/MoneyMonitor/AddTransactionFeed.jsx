import React, { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useSpring, animated } from "react-spring";

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

  const previousValue = useRef(value.length);
  const [Animate1, setAnimate1] = useState(true);
  const [Animate2, setAnimate2] = useState(false);
  const [Animate3, setAnimate3] = useState(false);
  const [Imidiate, setImidiate] = useState(false);

  const AmountLogo = ({ value }) => {
    const fontSize =
      value.length > 5 ? "1.3rem" : value.length > 0 ? "0.7rem" : "0.8rem";

    const fontColor =
      value.length > 5
        ? "var(--Bc-2)"
        : value.length > 0
        ? "var(--Fc-2)"
        : "var(--Gc-2)";

    useEffect(() => {
      if (Imidiate) return;
      if (value.length === 0 && previousValue.current === 2) {
        setAnimate1(true);
        setImidiate(true);
      } else if (value.length === 2 && previousValue.current === 0) {
        setAnimate1(false);
      }

      if (
        (value.length === 2 && previousValue.current === 0) ||
        (value.length === 5 && previousValue.current === 6)
      ) {
        setAnimate2(true);
        setImidiate(true);
      } else if (
        (value.length === 0 && previousValue.current === 2) ||
        (value.length === 6 && previousValue.current === 5)
      ) {
        setAnimate2(false);
      }

      if (value.length === 6 && previousValue.current === 5) {
        setAnimate3(true);
        setImidiate(true);
      } else if (value.length === 5 && previousValue.current === 6) {
        setAnimate3(false);
      }

      previousValue.current = value.length;
    }, [value]);

    const style1 = useSpring({
      from: {
        opacity: Animate1 ? 0 : 1,
        transform: Animate1 ? "scale(2)" : "scale(1)",
        fontSize: fontSize,
      },
      to: {
        opacity: !Animate1 ? 0 : 1,
        transform: !Animate1 ? "scale(2)" : "scale(1)",
        fontSize: fontSize,
      },
      immediate: !Imidiate,
      config: { duration: 500 },
      onRest: () => {
        if (Imidiate) {
          setImidiate(false);
        }
      },
    });
    const style2 = useSpring({
      from: {
        opacity: Animate2 ? 0 : 1,
        transform: Animate2 ? "scale(2)" : "scale(1)",
        fontSize: fontSize,
      },
      to: {
        opacity: !Animate2 ? 0 : 1,
        transform: !Animate2 ? "scale(2)" : "scale(1)",
        fontSize: fontSize,
      },
      immediate: !Imidiate,
      config: { duration: 500 },
      onRest: () => {
        if (Imidiate) {
          setImidiate(false);
        }
      },
    });
    const style3 = useSpring({
      from: {
        opacity: Animate3 ? 0 : 1,
        transform: Animate3 ? "scale(2)" : "scale(1)",
        fontSize: fontSize,
      },
      to: {
        opacity: !Animate3 ? 0 : 1,
        transform: !Animate3 ? "scale(2)" : "scale(1)",
        fontSize: fontSize,
      },
      immediate: !Imidiate,
      config: { duration: 500 },
      onRest: () => {
        if (Imidiate) {
          setImidiate(false);
        }
      },
    });

    return (
      <div className="AddTransactionFeed_AmountLogo">
        {Animate1 && (
          <animated.div style={style1} className="AddTransactionFeed_Logo">
            <FaXmark color={fontColor} />
          </animated.div>
        )}
        {Animate2 && (
          <animated.div style={style2} className="AddTransactionFeed_Logo">
            <FaCheck color={fontColor} />
          </animated.div>
        )}
        {Animate3 && (
          <animated.div style={style3} className="AddTransactionFeed_Logo">
            <MdOutlineAttachMoney color={fontColor} />
          </animated.div>
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
