import React, { memo } from "react";
import { animated } from "react-spring";
import PropTypes from "prop-types";
import { getProficiencyLevel } from "./getProficiencyLevel";
import { useSelector } from "react-redux";

const SkillsMain = memo(
  ({ ChildRefs, styles, ParentRef, List, stages, title }) => {
    const Space = stages[0] ? 3 : stages[1] ? 0 : 1;

    const updateVariables = useSelector((state) => state.data);
    const toggle = updateVariables.toggle;
    const hover = updateVariables.hover;

    const getListItemHeight = (Skill, s) => {
      if (stages[2] && Skill.id === 1 && s === Skill.skill[1] && !toggle[0]) {
        return "40px";
      }
      if (!(Skill.id === 1 && s === Skill.skill[Space])) {
        return "25px";
      }
      if (!toggle[0] && !hover[0] && hover[1] === title) {
        return "25px";
      }
      return hover[1] === title ? "25px" : "40px";
    };

    const SkillSoftwares = List.map((Skill, index) => (
      <animated.div
        ref={ChildRefs.current[index]}
        style={index !== 0 ? styles.title : null}
        className="Skill-Title"
        key={Skill.Title}
      >
        <p>{Skill.Title}</p>
        <ul>
          {Skill.skill.map((s) => (
            <li key={s[0]} style={{ height: getListItemHeight(Skill, s) }}>
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
      <animated.div style={styles.More} ref={ParentRef} className="Skill">
        {SkillSoftwares}
      </animated.div>
    );
  }
);

export default SkillsMain;
