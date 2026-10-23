import "./App.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import store from "./store/configureStore";
import useUpdateVariable from "./pages/Resume/General/useUpdateVariable";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
const Graphene = lazy(() => import("./pages/Research/Research"));
import Mouse from "./Mouse";
import ScrollToNavigate from "./Helper/ScrollToNavigate"; // Import scroll detector
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import BackgroundLattice from "./components/BackgroundLattice/BackgroundLattice";
import SiteMotionObserver from "./components/SiteMotion/SiteMotionObserver";
import PageTransition from "./components/SiteMotion/PageTransition";

const AcademicCV = lazy(() => import("./pages/Resume/Resume"));
const HomePage = lazy(() => import("./pages/Home/Home"));
const Commercialization = lazy(() => import("./pages/Commercialization/Commercialization"));
const WorkStory = lazy(() => import("./pages/WorkStory/WorkStory"));
const Journal = lazy(() => import("./pages/Journal/Journal"));
const JournalPaper = lazy(() => import("./pages/Journal/JournalPaper"));
import Loader from "./Loader/Loader";
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Login = lazy(() => import("./pages/Admin/Login"));
const ResearchProgress = lazy(() => import("./pages/Research/ResearchProgress"));
const Mafia = lazy(() => import("./pages/Mafia/Mafia"));

import { HelmetProvider } from "react-helmet-async";

function RouteReady({ onReady }) {
  useEffect(() => {
    onReady(true);
  }, [onReady]);
  return null;
}

function AppContent({ onRouteReady }) {
  useUpdateVariable();
  const { visibility, isMenuOpen } = useSelector((state) => state.ui);
  const location = useLocation();
  const normalizedPath = (() => {
    try {
      return decodeURIComponent(location.pathname);
    } catch {
      return location.pathname;
    }
  })();

  // Hide global elements on Admin Dashboard, Login page
  const isCommercialization = normalizedPath.replace(/\/$/, '') === '/venture';
  const isDashboard = normalizedPath.startsWith('/admin') || normalizedPath === '/login';
  const isWorkStoryPage = normalizedPath === '/R&D-Portfolio' || normalizedPath === '/work-story';
  const isStoryPage = normalizedPath === '/research-progress' || isWorkStoryPage;
  const isMafia = normalizedPath === '/Mafia';

  return (
    <div className="App" data-site-theme={isCommercialization ? "cfe" : "dark"}>
      <div className="MainBackground">
        <div className="BackgroundColor1"></div>
      </div>
      {/* Floating carbon lattice — root-level so z-index works correctly */}
      {visibility && !isDashboard && !isStoryPage && !isMafia && <BackgroundLattice theme={isCommercialization ? "light" : "dark"} />}
      {/* Show Mouse everywhere except Admin/Login */}
      {visibility && !isDashboard && !isCommercialization && <Mouse />}

      {/* Use one shared header and menu across the public portfolio pages. */}
      {visibility && !isDashboard && <Header />}
      {visibility && !isDashboard && <Menu />}
      {visibility && !isDashboard && <Footer accent={isCommercialization ? "#0645ee" : "#d49d81"} />}

      <ErrorBoundary key={location.pathname} onError={onRouteReady}>
          <SiteMotionObserver />
          <Suspense fallback={null}>
            <div key={location.pathname} className="RouteMotionFrame" data-route-motion-root inert={isMenuOpen ? true : undefined}>
                <Routes location={location}>
                  <Route exact path="/" element={<HomePage />} />
                  <Route path="/venture" element={<Commercialization />} />
                  <Route path="/commercialization" element={<Navigate to={`/venture${location.search}${location.hash}`} replace />} />
                  <Route path="/R&D-Portfolio" element={<WorkStory />} />
                  <Route path="/journal/:slug/" element={<JournalPaper />} />
                  <Route path="/journal/" element={<Journal />} />
                  <Route path="/journal" element={<Navigate to="/journal/" replace />} />
                  <Route path="/R%26D-Portfolio" element={<Navigate to="/R&D-Portfolio" replace />} />
                  <Route path="/work-story" element={<Navigate to="/R&D-Portfolio" replace />} />
                  <Route path="/AcademicCV" element={<AcademicCV />} />
                  <Route path="/academiccv" element={<AcademicCV />} />
                  <Route exact path="/Graphene" element={<Graphene />} />
                  <Route path="/research-progress" element={<ResearchProgress />} />
                  <Route path="/Mafia" element={<Mafia />} />
                  <Route exact path="/admin" element={<AdminDashboard />} />
                  <Route exact path="/login" element={<Login />} />
                </Routes>
                <RouteReady onReady={onRouteReady} />
            </div>
          </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  const [routeReady, setRouteReady] = useState(false);

  return (
    <HelmetProvider>
      <Router store={store}>
        <Loader routeReady={routeReady} />
        {/*<ScrollToNavigate /> {/* Scroll/Drag Detector */}
        <PageTransition onInitialReady={setRouteReady}>
          {(onReady) => <AppContent onRouteReady={onReady} />}
        </PageTransition>
      </Router>
    </HelmetProvider>
  );
}

export default App;
