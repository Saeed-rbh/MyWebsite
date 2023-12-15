import React from "react";
import { animated } from "react-spring";
import { getProficiencyLevel } from "./getProficiencyLevel";

const SkillsMain = ({
  ChildRefs,
  styles,
  ParentRef,
  List,
  Data,
  CloseOpen,
  MouseHover,
}) => {
  const SkillSoftwares = List.map((Skill, index) => (
    <animated.div
      ref={ChildRefs.current[index]}
      style={styles.title}
      className="Skill-Title"
    >
      <p>{Skill.Title}</p>
      <ul>
        {Skill.skill.map((s) => (
          <li
            key={s[0]}
            style={{
              height: !(Skill.id === 1 && s === Skill.skill[1])
                ? "25px"
                : !(!CloseOpen[0] && !MouseHover[0]) &&
                  MouseHover[1] === Data.title
                ? "25px"
                : !MouseHover[1] === Data.title
                ? "25px"
                : "40px",
            }}
          >
            <h2>{s[0]}</h2>
            <div className="Skill-Progress">
              <div
                className="Skill-Progress-Value"
                style={{ width: `${getProficiencyLevel(s[1])}%` }}
              ></div>
              <h3>{s[1]}</h3>
            </div>
          </li>
        ))}
      </ul>
    </animated.div>
  ));
  return (
    <animated.div ref={ParentRef} style={styles.titleSpring} className="Skill">
      {SkillSoftwares}
    </animated.div>
  );
};

export default SkillsMain;
