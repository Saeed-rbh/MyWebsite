
import "./App.css";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./store/configureStore";
import useUpdateVariable from "./pages/Resume/General/useUpdateVariable";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
import Graphene from "./pages/Research/Research";
import Mouse from "./Mouse";
import ScrollToNavigate from "./Helper/ScrollToNavigate"; // Import scroll detector

const AcademicCV = lazy(() => import("./pages/Resume/Resume"));
const HomePage = lazy(() => import("./pages/Home/Home"));
const Loader = lazy(() => import("./Loader/Loader"));

function App() {
  useUpdateVariable();
  const { visibility } = useSelector((state) => state.ui);

  return (
    <Router store={store}>
      <Loader />
      {/*<ScrollToNavigate /> {/* Scroll/Drag Detector */}
      <div className="App">
        <div className="MainBackground">
          <div className="BackgroundColor1"></div>
        </div>
        {visibility && <Mouse />}
        {visibility && <Header />}
        {visibility && <Menu />}
        {visibility && <Footer />}
        {visibility && (
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/AcademicCV" element={<AcademicCV />} />
              <Route exact path="/Graphene" element={<Graphene />} />
            </Routes>
          </Suspense>
        )}
      </div>
    </Router>
  );
}

export default App;
