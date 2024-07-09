import { animate } from "framer-motion";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useSpring, animated } from "react-spring";

const AmountLogo = ({
  Animate1,
  Animate2,
  Animate3,
  style1,
  style2,
  style3,
  fontColor,
}) => {
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
  const Imidiate = useRef(false);

  const fontSize = useMemo(() => {
    return value.length > 5 ? "1.3rem" : value.length > 0 ? "0.7rem" : "0.8rem";
  }, [value.length]);

  const fontColor = useMemo(() => {
    return value.length > 5
      ? "var(--Bc-2)"
      : value.length > 0
      ? "var(--Fc-2)"
      : "var(--Gc-2)";
  }, [value.length]);

  const handleValueChange = () => {
    if (value.length === 0 && previousValue.current === 2) {
      setAnimate1(true);
      Imidiate.current = true;
    } else if (value.length === 2 && previousValue.current === 0) {
      setAnimate1(false);
    }

    if (
      (value.length === 2 && previousValue.current === 0) ||
      (value.length === 5 && previousValue.current === 6)
    ) {
      setAnimate2(true);
      Imidiate.current = true;
    } else if (
      (value.length === 0 && previousValue.current === 2) ||
      (value.length === 6 && previousValue.current === 5)
    ) {
      setAnimate2(false);
    }

    if (value.length === 6 && previousValue.current === 5) {
      setAnimate3(true);
      Imidiate.current = true;
    } else if (value.length === 5 && previousValue.current === 6) {
      setAnimate3(false);
    }
  };

  const handleOnRest = () => {
    Imidiate.current = false;
  };

  const cond1 = useMemo(() => {
    return [Animate1 && Imidiate.current, !Animate1 && Imidiate.current];
  }, [Animate1]);
  const cond2 = useMemo(() => {
    return [Animate1 && Imidiate.current, !Animate1 && Imidiate.current];
  }, [Animate1]);
  const cond3 = useMemo(() => {
    return [Animate1 && Imidiate.current, !Animate1 && Imidiate.current];
  }, [Animate1]);

  useEffect(() => {
    if (
      !Imidiate.current &&
      (previousValue.current === 2 ||
        previousValue.current === 0 ||
        previousValue.current === 5 ||
        previousValue.current === 6)
    ) {
      handleValueChange();
    }
    previousValue.current = value.length;
  }, [handleValueChange, value.length]);

  const springProps = (animate, Imidiate) => ({
    from: {
      opacity: animate ? 0 : 1,
      transform: animate ? "scale(1.5)" : "scale(1)",
      fontSize: fontSize,
    },
    to: {
      opacity: !animate ? 0 : 1,
      transform: !animate ? "scale(1.5)" : "scale(1)",
      fontSize: fontSize,
    },
    config: { duration: 500 },
    onRest: animate && Imidiate ? handleOnRest : undefined,
  });

  const style1 = useSpring(springProps(Animate1, Imidiate.current));
  const style2 = useSpring(springProps(Animate2, Imidiate.current));
  const style3 = useSpring(springProps(Animate3, Imidiate.current));

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
        <AmountLogo
          Animate1={Animate1}
          Animate2={Animate2}
          Animate3={Animate3}
          style1={style1}
          style2={style2}
          style3={style3}
          fontColor={fontColor}
        />

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
