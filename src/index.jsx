import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import { Provider } from "react-redux";
import store from "./store/configureStore";
import "./styles/theme.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Static metadata serves crawlers and link previews. Hand ownership to Helmet
// before mounting so optional tags cannot linger during client-side navigation.
document.querySelectorAll('head [data-seo-snapshot]').forEach(node => node.remove());

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <SpeedInsights />
    <App />
  </Provider>
);

// Production field measurements are collected by the existing SpeedInsights integration.
// Development diagnostics stay in the browser console and do not send telemetry.
reportWebVitals(import.meta.env.DEV ? metric => console.debug('[web-vitals]', JSON.stringify({ name: metric.name, value: metric.value, rating: metric.rating })) : undefined);
