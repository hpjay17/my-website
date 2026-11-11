// Entry point for the Beyond Work page: beyond.html loads this file.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/shared.css";
import "../styles/beyond.css";
import { beyondData } from "../data/beyond.js";
import { App } from "./App.jsx";

// The intro screen and travel map are plain scripts (public/legacy/), not React.
// They read the page's content from this global.
window.beyondData = beyondData;

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
