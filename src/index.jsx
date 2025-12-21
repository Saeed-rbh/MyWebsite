import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import { Provider } from "react-redux";
import store from "./store/configureStore";
import "./styles/theme.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { SpeedInsights } from "@vercel/speed-insights/react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <SpeedInsights />
    <App />
  </Provider>
);

reportWebVitals();
