
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
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const AcademicCV = lazy(() => import("./pages/Resume/Resume"));
const HomePage = lazy(() => import("./pages/Home/Home"));
const Loader = lazy(() => import("./Loader/Loader"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Login = lazy(() => import("./pages/Admin/Login"));

import { HelmetProvider } from "react-helmet-async";

function App() {
  useUpdateVariable();
  const { visibility } = useSelector((state) => state.ui);

  return (
    <HelmetProvider>
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
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route exact path="/" element={<HomePage />} />
                  <Route exact path="/AcademicCV" element={<AcademicCV />} />
                  <Route exact path="/Graphene" element={<Graphene />} />
                  <Route exact path="/admin" element={<AdminDashboard />} />
                  <Route exact path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
