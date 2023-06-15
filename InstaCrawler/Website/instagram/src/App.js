import "./App.css";
// import MyProfile from "./MyProfile";
// import StoryLine from "./StoryLine";
// import Posts from "./Posts";
import HomePage from "./HomePage";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
// import Intro from "./Intro";
import AcademicCV from "./AcademicCV";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import CustomCursor from "./Mouse";
import store from './store';


function App() {
  return (
    <Router store={store}>
      <div className="App">
        {/* <Intro /> */}
        {/* <CustomCursor /> */}
        <div className="MainBackground">
          <div className="BackgroundColor1"></div>
        </div>
        <Header />
        <Menu />
        <Footer />
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
