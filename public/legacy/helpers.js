/* Small helpers the plain scripts in this folder share (the intro screen and the travel map).
   The React code in src/ doesn't use these. */

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

// label is for buttons whose text is only a symbol
function createButton(className, text, onClick, label) {
    const button = createEl("button", className, text);
    button.type = "button";
    if (label) button.setAttribute("aria-label", label);
    button.addEventListener("click", onClick);
    return button;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
