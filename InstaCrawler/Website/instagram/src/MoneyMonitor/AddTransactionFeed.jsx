import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDrag } from "@use-gesture/react";

import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useSpring, animated, useSprings } from "react-spring";
import { ScalableElement, useWindowHeight } from "./tools";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { VscArrowSmallLeft, VscArrowSmallRight } from "react-icons/vsc";
import { MdOutlineSsidChart } from "react-icons/md";
import { TbHomeDollar } from "react-icons/tb";
import { BiQuestionMark } from "react-icons/bi";
import { LiaPiggyBankSolid } from "react-icons/lia";
import { TbHomeBolt } from "react-icons/tb";
import { RiSubwayLine } from "react-icons/ri";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { PiPillBold } from "react-icons/pi";
import { MdOutlineSchool } from "react-icons/md";
import { BiDrink } from "react-icons/bi";
import { MdAssuredWorkload } from "react-icons/md";
import { MdOutlineWorkOutline } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { PiHandCoinsDuotone } from "react-icons/pi";

const spending_categories = [
  ["Housing & Utilities", <TbHomeBolt />],
  ["Transportation", <RiSubwayLine />],
  ["Groceries & Dining", <MdOutlineLocalGroceryStore />],
  ["Medical & Health", <PiPillBold />],
  ["Education & Training", <MdOutlineSchool />],
  ["Leisure & Recreation", <BiDrink />],
  ["Other", <BiQuestionMark />],
];

const Income_categories = [
  ["Employment Income", <MdOutlineWorkOutline />],
  ["Employee Benefits", <PiHandCoinsDuotone />],
  ["Government Benefits", <MdAssuredWorkload />],
  ["Investment Income", <TbMoneybag />],
  ["Other", <BiQuestionMark />],
];

const SaveInvest_categories = [
  ["Savings Account", <LiaPiggyBankSolid />],
  ["Stocks", <MdOutlineSsidChart />],
  ["Real Estate", <TbHomeDollar />],
  ["Other", <BiQuestionMark />],
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
  const height = Math.min(useWindowHeight(160), 500);

  const OriginalList =
    isAddClicked === "Income"
      ? Income_categories
      : isAddClicked === "Spending"
      ? spending_categories
      : SaveInvest_categories;

  const AutoDetect = ["Auto Detect", <MdOutlineAutoAwesome />];
  const List = [AutoDetect, ...OriginalList];

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

  const [AnountFocused, setAnountFocused] = useState(false);
  const handleAnountFocus = () => {
    setAnountFocused(true);
  };
  const handleAnountBlur = () => {
    setAnountFocused(false);
  };

  const [ReasonFocused, setReasonFocused] = useState(false);
  const handleReasonFocus = () => {
    setReasonFocused(true);
  };
  const handleReasonBlur = () => {
    setReasonFocused(false);
  };

  const AnountStyle = useSpring({
    // opacity: AnountFocused ? 0.8 : 1,
    left: AnountFocused ? "25px" : "20px",
  });
  const textareaStyle = useSpring({
    // paddingLeft: AnountFocused ? "95px" : "90px",
  });

  const ReasonStyle = useSpring({
    // opacity: ReasonFocused ? 0.8 : 1,
    left: ReasonFocused ? "25px" : "20px",
  });
  const ReasontextareaStyle = useSpring({
    // paddingLeft: ReasonFocused ? "95px" : "90px",
  });
  const ReasonCharareaStyle = useSpring({
    // opacity: ReasonFocused ? 1 : 0.8,
    // left: ReasonFocused ? "35px" : "25px",
  });

  const [whichType, setWhichType] = useState(true);
  const ConfirmStyle = useSpring({
    left: whichType ? "0%" : "43%",
    width: whichType ? "40%" : "57%",
    marginLeft: whichType ? 2 : -2,
    // right: whichType ? "60%" : "10%",
  });

  const ConfirmStyleDay = useSpring({
    x: whichType ? 0 : 3,
  });
  const ConfirmStyleMonth = useSpring({
    x: whichType ? -4 : 0,
  });

  const [selectedCategory, setSelectedCategory] = useState(List[0]);
  const [newCategory, setNewCategory] = useState(List[0]);
  const [fading, setFading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChangeCategory = (newCategory) => {
    if (newCategory === selectedCategory) return;
    setFading(true);
    setNewCategory(newCategory);
  };

  const fadeOutRight = useSpring({
    opacity: fading ? 0 : 1,
    transform: fading ? "translateX(10px)" : "translateX(0px)",
    config: { duration: 500 },
    onRest: () => {
      setSelectedCategory(newCategory);
      setTimeout(() => setFading(false), 200);
    },
  });

  const fadeInLeft = useSpring({
    opacity: !fading ? 1 : 0,
    transform: !fading ? "translateX(0px)" : "translateX(-10px)",
    config: { duration: 400 },
  });

  const [draggedX, setDraggedX] = useState(0);

  const listSprings = useSprings(
    List.length,
    List.map((item) => ({
      transform: `translateX(-${draggedX}px)`,
      backgroundColor:
        item[0] === selectedCategory[0] ? `var(--Bc-3)` : `var(--Ec-4)`,
    }))
  );

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setContentWidth(containerRef.current.scrollWidth);
    }
  }, []);

  const bind = useDrag(({ movement: [mx], dragging }) => {
    const maxDrag = contentWidth - containerWidth;
    const newDraggedX = draggedX - mx / 15;
    const constrainedX = Math.max(0, Math.min(maxDrag, newDraggedX));
    setDraggedX(constrainedX);
    isDragging && setIsDragging(mx !== 0 ? false : true);
  });

  const handleMouseDown = () => {
    console.log(isDragging);
    setIsDragging(true);
  };

  const handleClick = (item) => {
    if (isDragging) {
      handleChangeCategory(List[item]);
    }
  };

  return (
    <div className="AddTransactionFeed" style={{ height: `${height}px` }}>
      <h3>
        <span style={DotStyle}>•</span>Add New <span>{isAddClicked}</span>
      </h3>

      <ul>
        <li className="Add_Amount">
          <animated.label style={AnountStyle}>
            Amount {AnountFocused ? ":" : "|"}{" "}
          </animated.label>
          <animated.textarea
            type="text"
            maxlength="20"
            inputmode="numeric"
            placeholder="$1000"
            value={value}
            onChange={handleChange}
            onFocus={handleAnountFocus}
            onBlur={handleAnountBlur}
            style={textareaStyle}
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
          <animated.label style={ReasonStyle}>
            Reason {ReasonFocused ? ":" : "|"}{" "}
          </animated.label>
          <animated.textarea
            type="text"
            maxlength="50"
            placeholder="Shopping for party"
            value={reason}
            onChange={handleReason}
            onFocus={handleReasonFocus}
            onBlur={handleReasonBlur}
            style={ReasontextareaStyle}
          />
          <animated.h1 style={ReasonCharareaStyle}>
            Character:<span>{ReasonCount} </span>| 50
          </animated.h1>
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
              maxlength="2"
              inputmode="numeric"
              placeholder={currentTime.hours}
            />
            :
            <textarea
              type="text"
              maxlength="2"
              inputmode="numeric"
              placeholder={currentTime.minutes}
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
            />
            /
            <textarea
              type="text"
              maxlength="2"
              inputmode="numeric"
              placeholder={currentTime.month}
            />
            /
            <textarea
              type="text"
              maxlength="4"
              inputmode="numeric"
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
            Category |{" "}
            <animated.span style={fading ? fadeOutRight : fadeInLeft}>
              {selectedCategory[1]}
              {selectedCategory[0]}
            </animated.span>
          </p>{" "}
          <div className="Add_Category_items" ref={containerRef} {...bind()}>
            {listSprings.map((animation, index) => (
              <ScalableElement
                style={animation}
                as="h2"
                key={index}
                onMouseDown={() => handleMouseDown(index)}
                onClick={() => handleClick(index)}
              >
                {List[index][1]}
                {List[index][0]}
              </ScalableElement>
            ))}
          </div>
          <div className="Add_Category_guid">
            <VscArrowSmallLeft />

            <span>Drag Left & Right</span>
            <VscArrowSmallRight />
          </div>
        </li>
        <li className="Add_Confirm">
          <h1>
            <ScalableElement
              as="span"
              onClick={() => setWhichType(true)}
              style={ConfirmStyleDay}
            >
              Daily
            </ScalableElement>
            <ScalableElement
              as="span"
              onClick={() => setWhichType(false)}
              style={ConfirmStyleMonth}
            >
              Monthly
            </ScalableElement>
            <animated.span style={ConfirmStyle}></animated.span>
          </h1>
          <ScalableElement as="h2">Add Transaction</ScalableElement>
        </li>
      </ul>
    </div>
  );
}

export default AddTransactionFeed;
