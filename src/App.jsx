
import "./App.css";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import store from "./store/configureStore";
import useUpdateVariable from "./pages/Resume/General/useUpdateVariable";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
import Graphene from "./pages/Research/Research";
import Mouse from "./Mouse";
import ScrollToNavigate from "./Helper/ScrollToNavigate"; // Import scroll detector
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import FallbackLoader from "./Loader/FallbackLoader";
const AcademicCV = lazy(() => import("./pages/Resume/Resume"));
const HomePage = lazy(() => import("./pages/Home/Home"));
import Loader from "./Loader/Loader";
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Login = lazy(() => import("./pages/Admin/Login"));
const ResearchProgress = lazy(() => import("./pages/Research/ResearchProgress"));

import { HelmetProvider } from "react-helmet-async";

function AppContent() {
  useUpdateVariable();
  const { visibility } = useSelector((state) => state.ui);
  const location = useLocation();

  // Hide global elements on Admin Dashboard, Login page, AND Research Progress page
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/research-progress';

  return (
    <div className="App">
      <div className="MainBackground">
        <div className="BackgroundColor1"></div>
      </div>
      {/* Show Mouse, Header, Menu, Footer ONLY if NOT in dashboard */}
      {visibility && !isDashboard && <Mouse />}
      {visibility && !isDashboard && <Header />}
      {visibility && !isDashboard && <Menu />}
      {visibility && !isDashboard && <Footer />}

      {visibility && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/AcademicCV" element={<AcademicCV />} />
              <Route path="/academiccv" element={<AcademicCV />} />
              <Route exact path="/Graphene" element={<Graphene />} />
              <Route path="/research-progress" element={<ResearchProgress />} />
              <Route exact path="/admin" element={<AdminDashboard />} />
              <Route exact path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router store={store}>
        <Loader />
        {/*<ScrollToNavigate /> {/* Scroll/Drag Detector */}
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
