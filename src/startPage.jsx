import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Draws a page component inside <div id="root">
export function startPage(Page) {
    createRoot(document.getElementById("root")).render(
        <StrictMode>
            <Page />
        </StrictMode>,
    );
}
