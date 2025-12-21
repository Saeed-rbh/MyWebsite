import React, { useEffect, useState } from "react";
import "./Home.css";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.ui);
  const { currentPage } = useSelector((state) => state.ui);

  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  useEffect(() => {
    if (visibility && location.pathname === "/" && currentPage === "/") {
      setResumeClicked(1);
    } else if (
      visibility &&
      location.pathname === "/" &&
      currentPage === "/AcademicCV"
    ) {
      setResumeClicked(2);
    } else {
      setResumeClicked(3);
    }
  }, [location.pathname, currentPage, visibility]);

  return (
    visibility && (
      <div className="HomePage-M">
        <WelcomeMessage MenuHide={resumeClicked} delay={100} />
        <NameMessage MenuHide={resumeClicked} delay={300} />
        <MainText MenuHide={resumeClicked} delay={400} />
        <HobbyProfession
          MenuHide={resumeClicked}
          delay={resumeClicked === 1 ? 1400 : 200}
        />
      </div>
    )
  );
};
export default HomePage;
