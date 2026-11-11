import { useState } from "react";
import { flushSync } from "react-dom";

// The current theme ("blue" or "green") and a function that switches it. The CSS takes its colors
// from <html data-theme>, which an inline script in each HTML file sets before the page draws.
export function useTheme() {
    const [theme, setThemeState] = useState(() => (localStorage.getItem("theme") === "green" ? "green" : "blue"));

    // afterApply (optional) runs once the new theme is on screen
    function setTheme(next, afterApply) {
        if (next === theme) return;
        localStorage.setItem("theme", next);
        const apply = () => {
            document.documentElement.setAttribute("data-theme", next);
            // Redraw at once, so the crossfade captures the new look
            flushSync(() => setThemeState(next));
            if (afterApply) afterApply();
        };
        // Crossfade where the browser supports View Transitions and motion is welcome
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || still) apply();
        else document.startViewTransition(apply);
    }

    return [theme, setTheme];
}
