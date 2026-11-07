import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { applyTheme } from "./components/theme-provider";
import "@/styles/globals.css";

// Run before first paint to prevent theme flash
const savedTheme = (typeof window !== "undefined" && localStorage.getItem("cadre.theme")) || "dark";
applyTheme(savedTheme as "dark" | "light" | "system");

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
