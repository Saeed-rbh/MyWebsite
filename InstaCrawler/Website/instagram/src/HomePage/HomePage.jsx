import React from "react";
import "./HomePage.css";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import { selectVisibility } from "../visibilitySlice";
import { useSelector } from "react-redux";

const HomePage = () => {
  const MenuHide = !useSelector(selectVisibility);
  return (
    MenuHide && (
      <div className="HomePage-M">
        <WelcomeMessage MenuHide={MenuHide} delay={100} />
        <NameMessage MenuHide={MenuHide} delay={300} />
        <MainText MenuHide={MenuHide} delay={400} />
        <HobbyProfession MenuHide={MenuHide} delay={1500} />
      </div>
    )
  );
};
export default HomePage;
