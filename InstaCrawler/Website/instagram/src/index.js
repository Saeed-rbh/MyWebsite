import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import { Provider } from "react-redux";
import store from "./store/configureStore";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
