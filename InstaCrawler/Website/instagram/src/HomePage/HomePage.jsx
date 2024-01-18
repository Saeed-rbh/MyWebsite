import React from "react";
import "./HomePage.css";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.visibility);
  return (
    visibility && (
      <div className="HomePage-M">
        <WelcomeMessage MenuHide={visibility} delay={100} />
        <NameMessage MenuHide={visibility} delay={300} />
        <MainText MenuHide={visibility} delay={400} />
        <HobbyProfession MenuHide={visibility} delay={1500} />
      </div>
    )
  );
};
export default HomePage;
