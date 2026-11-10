/* Used by both pages: element helpers, theme switcher, scrolling, section fade-in and the typing effect */

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

function lazyImage(src, alt, className) {
    const img = createEl("img", className);
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    return img;
}

// Other sites and PDFs open in a new tab; mailto stays in this one
function openExternalInNewTab(link) {
    const href = link.getAttribute("href");
    if (href.startsWith("http") || href.endsWith(".pdf")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Buttons with class "js-scroll" scroll to the section named in data-target
function wireSmoothScrollButtons() {
    document.querySelectorAll(".js-scroll").forEach((button) => {
        button.addEventListener("click", () => {
            document.getElementById(button.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

// Fade each section in the first time it scrolls into view (the first is visible from the start)
function revealSectionsOnScroll() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    [...document.querySelectorAll(".section")].slice(1).forEach((section) => observer.observe(section));
}

// Apply the saved theme and wire the theme buttons; onChange(theme) runs after each switch
function wireThemeSwitcher(onChange) {
    const buttons = document.querySelectorAll(".theme-btn");
    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        buttons.forEach((btn) => {
            const isActive = btn.dataset.setTheme === theme;
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });
    };
    setTheme(localStorage.getItem("theme") || "blue");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const theme = btn.dataset.setTheme;
            localStorage.setItem("theme", theme);
            fadeToTheme(theme, () => {
                setTheme(theme);
                onChange(theme);
            });
        });
    });
}

// Crossfade to the new theme with View Transitions; browsers without them switch at once
function fadeToTheme(theme, update) {
    if (!document.startViewTransition || prefersReducedMotion() || theme === currentTheme()) {
        update();
        return;
    }
    document.startViewTransition(update);
}

function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "blue";
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Typing effect, used by the green theme
let typingTimers = [];

function clearTyping() {
    typingTimers.forEach(clearTimeout);
    typingTimers = [];
}

function resetTyping(element, text) {
    element.textContent = text;
    element.classList.remove("typing", "typing-cursor");
}

function typeText(element, text, speed) {
    element.textContent = "";
    element.classList.add("typing", "typing-cursor");
    let i = 0;
    const tick = () => {
        if (i < text.length) {
            element.textContent += text[i++];
            typingTimers.push(setTimeout(tick, speed));
        } else {
            element.classList.remove("typing", "typing-cursor");
        }
    };
    tick();
}
