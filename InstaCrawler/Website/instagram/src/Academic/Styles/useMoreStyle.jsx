import { useSpring } from "react-spring";
import { useMemo } from "react";

const useMoreStyle = (isActive, fixed, stages) => {
  const ACTIVE_Y = Math.round(50);
  const INACTIVE_Y = Math.round(stages && stages[2] ? 40 : 35);
  const FIXED_Y = Math.round(0);

  const transformValue = useMemo(() => {
    let translateY = fixed ? FIXED_Y : isActive ? ACTIVE_Y : INACTIVE_Y;

    return `translate3d(0, ${translateY}px, 0)`;
  }, [isActive, fixed, stages]);

  const style = useSpring({
    transform: transformValue,
    marginRight: !isActive ? 48 : 0,
    paddingRight: !isActive ? 0 : 15,
  });

  return style;
};

export default useMoreStyle;
