
import "./App.css";
import React, { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
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
import BackgroundLattice from "./components/BackgroundLattice/BackgroundLattice";

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
  const { visibility } = useSelector((state) => state.ui);
  const location = useLocation();

  // Hide global elements on Admin Dashboard, Login page
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const isStoryPage = location.pathname === '/research-progress' || location.pathname === '/work-story';
  const isMafia = location.pathname === '/Mafia';

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
      {visibility && !isDashboard && !isStoryPage && !isMafia && <Header />}
      {visibility && !isDashboard && !isStoryPage && !isMafia && <Menu />}
      {visibility && !isDashboard && !isStoryPage && !isMafia && <Footer />}

      {visibility && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/work-story" element={<WorkStory />} />
                <Route path="/AcademicCV" element={<AcademicCV />} />
                <Route path="/academiccv" element={<AcademicCV />} />
                <Route exact path="/Graphene" element={<Graphene />} />
                <Route path="/research-progress" element={<ResearchProgress />} />
                <Route path="/Mafia" element={<Mafia />} />
                <Route exact path="/admin" element={<AdminDashboard />} />
                <Route exact path="/login" element={<Login />} />
              </Routes>
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
