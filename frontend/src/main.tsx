import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // import without extension; ensure file is named exactly "App.tsx"
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);