import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useSpring, animated } from "react-spring";
import { ScalableElement } from "./tools";
import { MdOutlineAutoAwesome } from "react-icons/md";

const List = [
  "Categoty 1",
  "Categoty 2",
  "Categoty 3",
  "Categoty 4",
  "Categoty 5",
];

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
    const numericValue = event.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    const formattedValue = new Intl.NumberFormat().format(numericValue); // Format the number with commas
    setValue(numericValue.length > 0 ? `$${formattedValue}` : "");
  };
  useEffect(() => {
    setValue("");
  }, [isAddClicked]);

  const previousValue = useRef(value.length);
  const [Animate1, setAnimate1] = useState(true);
  const [Animate2, setAnimate2] = useState(false);
  const Imidiate = useRef(false);

  const fontSize = useMemo(() => {
    return value.length > 0 ? "0.9rem" : "1.1rem";
  }, [value.length]);

  const fontColor = useMemo(() => {
    return value.length > 0 ? "var(--Fc-2)" : "var(--Gc-2)";
  }, [value.length]);

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

  const handleOnRest = () => {
    Imidiate.current = false;
  };

  useEffect(() => {
    if (
      !Imidiate.current &&
      (previousValue.current === 2 || previousValue.current === 0)
    ) {
      handleValueChange();
    }
    previousValue.current = value.length;
  }, [handleValueChange, value.length]);

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

  const style1 = useSpring(springProps(Animate1, Imidiate.current));
  const style2 = useSpring(springProps(Animate2, Imidiate.current));

  const [reason, setReason] = useState("");
  const [ReasonCount, setReasonCount] = useState(0);

  const handleReason = (event) => {
    const newValue = event.target.value.replace(/\n/g, "");
    setReason(newValue);
    setReasonCount(newValue.length);
  };

  console.log(ReasonCount);

  const handleErase = () => {
    setReason("");
    setReasonCount(0);
  };

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
    const date = now.toLocaleDateString().split("/");

    setCurrentTime({
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      year: date[2],
      month: date[1],
      day: date[0],
    });
  }, []);

  console.log(currentTime);

  return (
    <div className="AddTransactionFeed">
      <h3>
        <span style={DotStyle}>•</span>Add New <span>{isAddClicked}</span>
      </h3>

      <ul>
        <li>
          <label>Amount</label>
          <textarea
            type="text"
            maxlength="20"
            inputmode="numeric"
            placeholder="$1000"
            value={value}
            onChange={handleChange}
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
        </li>
        <li className="Add_Reason">
          <label>Reason</label>
          <textarea
            type="text"
            maxlength="50"
            placeholder="Shopping for party"
            value={reason}
            onChange={handleReason}
          />
          <h1>
            Character:<span>{ReasonCount} </span>| 50
          </h1>
          <ScalableElement as="h2" onClick={handleErase}>
            Clear All
          </ScalableElement>
          <hr />
          <hr />
        </li>
        <li className="Add_DateTime">
          <h1>
            <p>
              • Time <span></span>
            </p>
            <textarea
              type="text"
              maxlength="50"
              placeholder={currentTime.hours}
            />
            :
            <textarea
              type="text"
              maxlength="50"
              placeholder={currentTime.minutes}
            />
          </h1>
          <h1>
            <p>
              • Date <span></span>
            </p>
            <textarea
              type="text"
              maxlength="50"
              placeholder={currentTime.day}
            />
            /
            <textarea
              type="text"
              maxlength="50"
              placeholder={currentTime.month}
            />
            /
            <textarea
              type="text"
              maxlength="50"
              placeholder={currentTime.year}
            />
            {/* <ScalableElement as="h2" onClick={handleErase}>
              Now
            </ScalableElement>
            <ScalableElement as="h2" onClick={handleErase}>
              Calendar
            </ScalableElement> */}
          </h1>
        </li>
        <li className="Add_Category">
          <p>
            Category{" "}
            <h1>
              <MdOutlineAutoAwesome />
              Auto Detect
            </h1>
          </p>{" "}
          <div className="Add_Category_items">
            {List.map((item) => (
              <ScalableElement as="h2" key={item}>
                {item}
              </ScalableElement>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default AddTransactionFeed;
