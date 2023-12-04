import React, { useMemo } from "react";
import PropTypes from "prop-types";
import AnimatedOption from "./AnimatedOption";

const PersonalOptions = React.memo(
  ({ title, options, globalIndex, maxDelay, isCross, routes }) => {
    const delayCalculation = useMemo(() => {
      return maxDelay - globalIndex * 100;
    }, [maxDelay, globalIndex]);

    return (
      <div className={PersonalOptions}>
        <AnimatedOption
          isCross={isCross}
          text={title}
          delay={delayCalculation}
        />
        {options.map((option, index) => {
          const uniqueKey = `${option}-${index}`;
          return (
            <AnimatedOption
              isCross={isCross}
              key={uniqueKey}
              text={option}
              routes={routes[index]}
              delay={maxDelay - (globalIndex + index + 1) * 100}
            />
          );
        })}
      </div>
    );
  }
);

PersonalOptions.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  globalIndex: PropTypes.number.isRequired,
  maxDelay: PropTypes.number.isRequired,
  isCross: PropTypes.bool.isRequired,
};

export default PersonalOptions;
