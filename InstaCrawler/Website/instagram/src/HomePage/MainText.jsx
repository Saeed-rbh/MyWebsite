import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";
import SvgComponent from "./SvgComponent";
import AnimatedWord from "./AnimatedWord";

const MainText = ({ MenuHide, delay }) => {
  const [words, setWords] = useState([]);
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  const text =
    "Situated at the <PICSSL-Lab> at <York-University>, I apply my <mechanical-engineering> prowess to delve into the complexities of nanomaterials and molecular phenomena. My professional focus lies in <2D-Nanomaterials>, <Molecular-Dynamics>, and <Heat-Transfer>. The success of my research approach significantly stems from <interdisciplinary-collaborations> that amplify the potential of my innovative explorations.";
  useEffect(() => {
    let wordsArray = text.split(/( |<[^>]+>)/g).filter((w) => w.trim());
    setWords(wordsArray);
  }, []);

  return (
    <animated.div style={springProps} className="HomePage-M-3">
      <SvgComponent />
      <p>
        {words.map((word, index) => (
          <AnimatedWord
            key={index}
            word={word}
            index={index}
            animateFrom={MenuHide ? "#d49d81" : "white"}
            animateTo={MenuHide ? "white" : "#d49d81"}
          />
        ))}
      </p>
    </animated.div>
  );
};

export default MainText;
