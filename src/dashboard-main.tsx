
import React from "react";
import ReactDOM from "react-dom/client";
import DashboardApp from "./DashboardApp.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("dashboard-root")!).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>,
);
