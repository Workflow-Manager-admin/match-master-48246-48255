import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/gameboard.css";
import "./styles/sidebar.css";
import "./styles/animations.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
