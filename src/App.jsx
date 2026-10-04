import "./App.css";
import React, { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

import FallbackLoader from "./Loader/FallbackLoader";
const AcademicCV = lazy(() => import("./pages/Resume/Resume"));
const HomePage = lazy(() => import("./pages/Home/Home"));
const WorkStory = lazy(() => import("./pages/WorkStory/WorkStory"));
import Loader from "./Loader/Loader";
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Login = lazy(() => import("./pages/Admin/Login"));
const ResearchProgress = lazy(() => import("./pages/Research/ResearchProgress"));
const Mafia = lazy(() => import("./pages/Mafia/Mafia"));

import { HelmetProvider } from "react-helmet-async";

function AppContent() {
  useUpdateVariable();
  const { visibility, isMenuOpen } = useSelector((state) => state.ui);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const transitionDirection = useRef(0);
  const reducedMotion = useReducedMotion();
  const isAcademicCV = (path) => path.toLowerCase() === "/academiccv";
  if (previousPath.current !== location.pathname) {
    const cvTransition =
      (previousPath.current === "/" && isAcademicCV(location.pathname)) ||
      (isAcademicCV(previousPath.current) && location.pathname === "/");
    transitionDirection.current = cvTransition ? (location.pathname === "/" ? -1 : 1) : 0;
  }
  const direction = transitionDirection.current;

  useEffect(() => {
    previousPath.current = location.pathname;
  }, [location.pathname]);
  const normalizedPath = (() => {
    try {
      return decodeURIComponent(location.pathname);
    } catch {
      return location.pathname;
    }
  })();

  // Hide global elements on Admin Dashboard, Login page
  const isDashboard = normalizedPath.startsWith('/admin') || normalizedPath === '/login';
  const isWorkStoryPage = normalizedPath === '/R&D-Portfolio' || normalizedPath === '/work-story';
  const isStoryPage = normalizedPath === '/research-progress' || isWorkStoryPage;
  const isMafia = normalizedPath === '/Mafia';

  return (
    <div className="App">
      <div className="MainBackground">
        <div className="BackgroundColor1"></div>
      </div>
      {/* Floating carbon lattice — root-level so z-index works correctly */}
      {visibility && !isDashboard && !isStoryPage && !isMafia && <BackgroundLattice />}
      {/* Show Mouse everywhere except Admin/Login */}
      {visibility && !isDashboard && <Mouse />}

      {/* Show Header, Menu, Footer ONLY if NOT in dashboard AND NOT in story pages AND NOT Mafia */}
      {visibility && !isDashboard && (!isStoryPage || isWorkStoryPage) && !isMafia && <Header />}
      {visibility && !isDashboard && (!isStoryPage || isWorkStoryPage) && !isMafia && <Menu />}
      {visibility && !isDashboard && !isMafia && <Footer />}

      {visibility && (
        <ErrorBoundary>
          <SiteMotionObserver />
          <Suspense fallback={<FallbackLoader />}>
            <AnimatePresence mode="wait" initial={false} custom={{ direction, reducedMotion }}>
              <motion.div
                key={location.pathname}
                custom={{ direction, reducedMotion }}
                className="RouteMotionFrame"
                data-route-motion-root
                inert={isMenuOpen ? true : undefined}
                variants={{
                  initial: ({ direction: routeDirection, reducedMotion: reduce }) => reduce
                    ? { opacity: 1, x: 0, y: 0, filter: "none" }
                    : { opacity: 0, x: routeDirection * 36, y: routeDirection ? 0 : 18, filter: "blur(3px)" },
                  animate: ({ reducedMotion: reduce }) => ({
                    opacity: 1, x: 0, y: 0, filter: "blur(0px)",
                    transition: { duration: reduce ? 0 : 0.42, ease: [0.23, 1, 0.32, 1] },
                  }),
                  exit: ({ direction: routeDirection, reducedMotion: reduce }) => ({
                    opacity: 0, x: routeDirection * -24, y: routeDirection ? 0 : -16, filter: reduce ? "none" : "blur(2px)",
                    transition: { duration: reduce ? 0 : 0.24, ease: [0.4, 0, 0.7, 1] },
                  }),
                }}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Routes location={location}>
                  <Route exact path="/" element={<HomePage />} />
                  <Route path="/R&D-Portfolio" element={<WorkStory />} />
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
              </motion.div>
            </AnimatePresence>
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
