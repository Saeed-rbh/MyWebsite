import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useSpring, animated } from "react-spring";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const AmountLogo = ({ Animate1, Animate2, style1, style2, fontColor }) => {
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
    </div>
  );
};

const Amount = ({
  value,
  setValue,
  valueError,
  setValueError,
  defaultValue,
}) => {
  const [AnountFocused, setAnountFocused] = useState(false);

  const handleAnountFocus = () => {
    setAnountFocused(true);
  };
  const handleAnountBlur = () => {
    setAnountFocused(false);
  };

  const AnountStyle = useSpring({
    left: AnountFocused ? "25px" : "20px",
    color: valueError ? "var(--Bc-1)" : "var(--Gc-1)",
  });
  const AnountBorderStyle = useSpring({
    outline: valueError ? "1px solid var(--Ac-4)" : "1px solid var(--Gc-2)",
  });

  const previousValue = useRef(value.length);

  const Imidiate = useRef(false);

  const handleValueChange = useCallback(() => {
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
  }, [value.length]);

  useEffect(() => {
    if (
      !Imidiate.current &&
      (previousValue.current === 2 || previousValue.current === 0)
    ) {
      handleValueChange();
    }
    previousValue.current = value.length;
  }, [handleValueChange, value.length]);

  const fontSize = useMemo(() => {
    return value.length > 0 ? "0.9rem" : "1.1rem";
  }, [value.length]);

  const fontColor = useMemo(() => {
    return value.length > 0 ? "var(--Fc-2)" : "var(--Gc-2)";
  }, [value.length]);

  const handleOnRest = () => {
    Imidiate.current = false;
  };

  const springProps = (animate, Imidiate) => ({
    from: {
      opacity: animate ? 0 : 0.6,
      transform: animate ? "scale(1.5)" : "scale(1)",
      fontSize: fontSize,
    },
    to: {
      opacity: !animate ? 0 : 0.6,
      transform: !animate ? "scale(1.5)" : "scale(1)",
      fontSize: fontSize,
    },
    config: { duration: 500 },
    onRest: animate && Imidiate ? handleOnRest : undefined,
  });
  const [Animate1, setAnimate1] = useState(true);
  const [Animate2, setAnimate2] = useState(false);
  const style1 = useSpring(springProps(Animate1, Imidiate.current));
  const style2 = useSpring(springProps(Animate2, Imidiate.current));

  const handleChange = (event) => {
    setValueError(true);
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    const formattedValue = new Intl.NumberFormat().format(numericValue);
    setValue(numericValue.length > 0 ? `$${formattedValue}` : "");
  };

  return (
    <animated.li className="Add_Amount" style={AnountBorderStyle}>
      <animated.label style={AnountStyle}>
        Amount {AnountFocused ? ":" : "|"}{" "}
      </animated.label>
      <animated.textarea
        type="text"
        defaultValue={defaultValue}
        maxlength="20"
        inputmode="numeric"
        placeholder="$1000"
        value={value}
        onChange={handleChange}
        onFocus={handleAnountFocus}
        onBlur={handleAnountBlur}
      />
      <AmountLogo
        Animate1={Animate1}
        Animate2={Animate2}
        style1={style1}
        style2={style2}
        fontColor={fontColor}
      />
      <hr />
      <hr />
    </animated.li>
  );
};

export default Amount;
