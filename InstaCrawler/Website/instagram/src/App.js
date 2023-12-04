import "./App.css";
import React, { useState } from "react";
// import MyProfile from "./MyProfile";
// import StoryLine from "./StoryLine";
// import Posts from "./Posts";
import HomePage from "./HomePage/HomePage";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Menu from "./Menu/Menu";
import Loader from "./Loader/Loader";
import CustomCursor from "./Mouse";
import AcademicCV from "./AcademicCV";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./store";
import Graphene from "./Graphene";
import CapturedMoments from "./CapturedMoments/CapturedMoments";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoad = () => {
    setIsLoaded(true);
  };
  return (
    <Router store={store}>
      <div className="App">
        <Loader onLoad={handleLoad} />
        {isLoaded ? (
          <>
            <CustomCursor />
            <div className="MainBackground">
              <div className="BackgroundColor1"></div>
            </div>
            <Header />
            <Menu />
            <Footer />
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/AcademicCV" element={<AcademicCV />} />
              <Route exact path="/Graphene" element={<Graphene />} />
              <Route
                exact
                path="/CapturedMoments"
                element={<CapturedMoments />}
              />
            </Routes>
          </>
        ) : null}
        {/* <MyProfile />
      <StoryLine />
      <Posts /> */}
      </div>
    </Router>
  );
}

export default App;
