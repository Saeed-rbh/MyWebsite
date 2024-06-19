import React, { useState, useEffect } from "react";
import { MdOutlineBrunchDining } from "react-icons/md";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const TransactionListItem = ({
  icon: Icon,
  description,
  time,
  amount,
  isSwiped,
  onSwipe,
  onUnSwipe,
  onClick,
  type,
}) => {
  const [showActions, setShowActions] = useState(isSwiped);
  const [showActionsAnim, setShowActionsAnim] = useState(false);

  useEffect(() => {
    if (!isSwiped) {
      setShowActions(false);
    }
  }, [isSwiped]);

  const bind = useDrag(
    ({ down, movement: [mx] }) => {
      if (!down && mx < -50) {
        onSwipe();
        setShowActions(true);
        setShowActionsAnim(true);
      } else if (!down && mx > 50) {
        onUnSwipe();
      }
    },
    { axis: "x" }
  );

  const swipeAnimation = useSpring({
    onRest: () => setShowActions(isSwiped),
  });

  const swipeAction = useSpring({
    transform: isSwiped ? "translateX(160px)" : "translateX(200px)",
    opacity: isSwiped ? 1 : 0,
    config: config.slow,
    onRest: () => !showActions && setShowActionsAnim(false),
  });

  const swipeSvg = useSpring({
    opacity: isSwiped ? 0 : 1,
  });

  const swipeAmount = useSpring({
    transform: isSwiped ? "translateX(-65px)" : "translateX(0px)",
    marginRight: isSwiped ? "100px" : "0px",
  });

  const swipeTitle = useSpring({
    transform: isSwiped ? "translateX(-40px)" : "translateX(0px)",
  });

  const swipeStyle = useSpring({
    transform: isSwiped ? "translateX(-160px)" : "translateX(0px)",
  });

  const swipeDate2 = useSpring({
    opacity: isSwiped ? 0 : 0.7,
  });

  const handleClick = (event) => {
    const { clientY } = event;
    console.log(clientY);
    // if (onClick) {
    //   onClick(clientY);
    // }
  };

  const truncateDescription = (description, maxLength = 30) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength - 3) + "...";
    } else {
      return description.padEnd(maxLength, " ");
    }
  };

  return (
    <animated.li onClick={handleClick} {...bind()} style={swipeStyle}>
      <animated.p>
        <animated.span>
          <Icon />
        </animated.span>
        {truncateDescription(description)}
      </animated.p>
      {/* <animated.p style={swipeDate1}>
        <span>{time.slice(8, 10)}</span>
        <animated.span style={swipeDate2}>
          • {type === "Monthly" ? "Monthly" : time.slice(10)}
        </animated.span>
      </animated.p> */}
      <animated.p>${amount}</animated.p>
      {showActionsAnim && (
        <animated.div style={swipeAction} className="transaction-actions">
          <div className="modify-button">Modify</div>
          <div className="delete-button">Delete</div>
        </animated.div>
      )}
    </animated.li>
  );
};

TransactionListItem.defaultProps = {
  icon: MdOutlineBrunchDining,
};

export default TransactionListItem;
