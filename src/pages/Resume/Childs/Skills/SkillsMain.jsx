import React from "react";
import { animated, useSpring } from "react-spring";
import { getProficiencyLevel } from "./getProficiencyLevel";
import { useSelector } from "react-redux";

const SkillsMain = ({
  ChildRefs,
  styles,
  ParentRef,
  List,
  stages,
  isActive,
}) => {
  const updateVariables = useSelector((state) => state.data);
  const toggle = updateVariables.toggle;

  const getListItemHeight = (Skill, s) => {
    if (Skill.id === 1 && s === Skill.skill[1] && !toggle[0]) {
      return "40px";
    } else {
      return "25px";
    }
  };
  const Anim = useSpring({
    marginTop: isActive ? 70 : 55,
    padding: "0px 50px 60px 20px",
    overflow: isActive ? "auto" : "hidden",
    height: isActive ? "max-content" : "100%",
    flexWrap: "nowrap",
  });

  const SkillSoftwares = List.map((Skill, index) => (
    <animated.div
      ref={ChildRefs.current[index]}
      className="Skill-Title"
      key={Skill.Title}
    >
      <p>{Skill.Title}</p>
      <ul>
        {Skill.skill.map((s) => (
          <li
            key={s[0]}
            style={{
              marginBottom:
                Skill.id === 1 && s === Skill.skill[1] && !toggle[0] ? 10 : 0,
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
    <animated.div style={{ ...Anim }} ref={ParentRef} className="Skill">
      {SkillSoftwares}
    </animated.div>
  );
};
export default SkillsMain;
