// import "./App.css";
// import React, { useState, lazy, Suspense } from "react";
// import { useSelector } from "react-redux";

// // import MyProfile from "./MyProfile";
// // import StoryLine from "./StoryLine";
// // import Posts from "./Posts";
// import Header from "./Header/Header";
// // import Footer from "./Footer/Footer";
// import Menu from "./Menu/Menu";
// import Loader from "./Loader/Loader";
// import CustomCursor from "./Mouse";
// // import Graphene from "./Graphene";
// // import CapturedMoments from "./CapturedMoments/CapturedMoments";

// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import store from "./store/configureStore";

// const HomePage = lazy(() => import("./HomePage/HomePage"));
// const AcademicCV = lazy(() => import("./Academic/AcademicCV"));

// function App() {
//   const { visibility } = useSelector((state) => state.visibility);
//   return (
//     <Router store={store}>
//       <div className="App">
//         <visibility />
//         {true ? (
//           <>
//             {/* <CustomCursor /> */}
//             <div className="MainBackground">
//               <div className="BackgroundColor1"></div>
//             </div>
//             <Header />
//             <Menu />
//             {/* <Footer /> */}
//             <Suspense fallback={<div>Loading...</div>}>
//               <Routes>
//                 <Route exact path="/" element={<HomePage />} />
//                 <Route exact path="/AcademicCV" element={<AcademicCV />} />
//                 {/* <Route exact path="/Graphene" element={<Graphene />} /> */}
//                 {/* <Route
//                 exact
//                 path="/CapturedMoments"
//                 element={<CapturedMoments />}
//               /> */}
//               </Routes>
//             </Suspense>
//           </>
//         ) : null}
//         {/* <MyProfile />
//       <StoryLine />
//       <Posts /> */}
//       </div>
//     </Router>
//   );
// }

// export default App;

import "./App.css";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./store/configureStore";
import useUpdateVariable from "./Academic/General/useUpdateVariable";
import Header from "./Header/Header";
import Menu from "./Menu/Menu";
import Footer from "./Footer/Footer";
import Graphene from "./Graphene/Graphene2";
const AcademicCV = lazy(() => import("./Academic/AcademicCV"));
const HomePage = lazy(() => import("./HomePage/HomePage"));
const Loader = lazy(() => import("./Loader/Loader"));
const MoneyMonitor = lazy(() => import("./MoneyMonitor/MoneyMonitor"));

function App() {
  useUpdateVariable();
  const { visibility } = useSelector((state) => state.visibility);
  return (
    <Router store={store}>
      <Loader />

      <div className="App">
        <div className="MainBackground">
          <div className="BackgroundColor1"></div>
        </div>
        {/* {visibility && <Header />} */}
        {visibility && <Menu />}
        {visibility && <Footer />}
        {visibility && (
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/AcademicCV" element={<AcademicCV />} />
              <Route exact path="/Graphene" element={<Graphene />} />
              <Route exact path="/MoneyMonitor" element={<MoneyMonitor />} />
            </Routes>
          </Suspense>
        )}
      </div>
    </Router>
  );
}

export default App;
