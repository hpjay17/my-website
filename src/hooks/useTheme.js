import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The visitor's last choice, remembered by the browser between visits
function savedTheme() {
    return localStorage.getItem("theme") === "green" ? "green" : "blue";
}

// A "hook": a function a component calls to get some state plus a way to change it.
// Returns the current theme ("blue" or "green") and a function that switches it.
export function useTheme() {
    const [theme, setThemeState] = useState(savedTheme);

    // The CSS picks its colors from <html data-theme="...">
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // afterApply (optional) runs once the new theme is on screen
    function setTheme(next, afterApply) {
        if (next === theme) return;
        localStorage.setItem("theme", next);
        const apply = () => {
            document.documentElement.setAttribute("data-theme", next);
            // flushSync redraws right now, so the crossfade below captures the new look
            flushSync(() => setThemeState(next));
            if (afterApply) afterApply();
        };
        // Crossfade with View Transitions; browsers without them switch at once
        if (!document.startViewTransition || prefersReducedMotion()) apply();
        else document.startViewTransition(apply);
    }

    return [theme, setTheme];
}
