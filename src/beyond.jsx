// Entry point for beyond.html
import "./styles/shared.css";
import "./styles/beyond.css";
import { beyondData } from "./data/beyond.js";
import { Beyond } from "./pages/Beyond.jsx";
import { startPage } from "./startPage.jsx";

// The intro screen and travel map (public/legacy/) are plain scripts that read the content from this global
window.beyondData = beyondData;

startPage(Beyond);
