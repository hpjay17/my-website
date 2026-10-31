/* Used by both pages: element creation, theme switcher, scrolling, section fade-in and the typing effect */

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
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
        buttons.forEach((btn) => btn.classList.toggle("active", btn.dataset.setTheme === theme));
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
