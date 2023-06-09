import "./App.css";
// import MyProfile from "./MyProfile";
// import StoryLine from "./StoryLine";
// import Posts from "./Posts";
import HomePage from "./HomePage";
import Header from "./Header";
import AcademicCV from "./AcademicCV";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomCursor from "./Mouse";


function App() {
  return (
    <Router>
      <div className="App">
        {/* <CustomCursor /> */}
        <div className="MainBackground">
          <div className="BackgroundColor1"></div>
        </div>
        <Header />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/AcademicCV" element={<AcademicCV />} />
        </Routes>

        {/* <MyProfile />
      <StoryLine />
      <Posts /> */}
      </div>
    </Router>
  );
}

export default App;
