// Entry point for the portfolio page: index.html loads this file.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/shared.css";
import "../styles/portfolio.css";
import { App } from "./App.jsx";

// Draw the <App /> component inside <div id="root"> from index.html
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
