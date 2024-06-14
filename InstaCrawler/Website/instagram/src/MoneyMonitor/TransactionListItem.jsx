import React, { useState, useEffect } from "react";
import { MdOutlineBrunchDining } from "react-icons/md";
import { useSpring, animated } from "@react-spring/web";
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
    transform: isSwiped ? "translateX(-10px)" : "translateX(50px)",
    opacity: isSwiped ? 1 : 0,
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

  const swipeDate1 = useSpring({
    transform: isSwiped ? "translateX(-25px)" : "translateX(0px)",
  });

  const swipeDate2 = useSpring({
    opacity: isSwiped ? 0 : 0.7,
  });

  const handleClick = (event) => {
    const { clientY } = event;
    if (onClick) {
      onClick(clientY);
    }
  };

  const truncateDescription = (description, maxLength = 15) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength - 3) + "...";
    } else {
      return description.padEnd(maxLength, " ");
    }
  };

  return (
    <animated.li onClick={handleClick} {...bind()} style={swipeAnimation}>
      <animated.p style={swipeTitle}>
        <animated.span style={swipeSvg}>
          <Icon />
        </animated.span>
        {truncateDescription(description)}
      </animated.p>
      <animated.p style={swipeDate1}>
        <span>{time.slice(0, 10)}</span>
        <animated.span style={swipeDate2}>
          • {type === "Monthly" ? "Monthly" : time.slice(10)}
        </animated.span>
      </animated.p>
      <animated.p style={swipeAmount}>${amount}</animated.p>
      {showActions && (
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
