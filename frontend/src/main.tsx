import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // explicit extension to avoid resolver issues
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);