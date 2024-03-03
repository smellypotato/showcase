import "./index.css";
import "./commonCSS/root.css";
import "./commonCSS/font.css";
import "./commonCSS/color.css";
import React from "react";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);