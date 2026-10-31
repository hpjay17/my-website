/* Behavior used by both pages. Load this before js/portfolio.js or js/beyond.js. */

// Nav buttons with class "js-scroll" scroll to the section named in data-target
function wireSmoothScrollButtons() {
    document.querySelectorAll(".js-scroll").forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.target);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

// Fade each section in the first time it scrolls into view (the first section is already visible)
function revealSectionsOnScroll() {
    const sections = Array.from(document.querySelectorAll(".section"));
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

    sections.slice(1).forEach((section) => observer.observe(section));
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
            revealTheme(btn, theme, () => {
                setTheme(theme);
                if (onChange) onChange(theme);
            });
        });
    });
}

// Switch themes with a circle that grows out of the clicked button until it covers the window.
// The browser photographs the page before and after `update`, then this animates a circular
// cut-out of the new page over the old one. Browsers without View Transitions just switch at once.
function revealTheme(button, theme, update) {
    if (!document.startViewTransition || prefersReducedMotion() || theme === currentTheme()) {
        update();
        return;
    }
    const box = button.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    // Far enough to reach the window's farthest corner
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(update);
    transition.ready.then(() => {
        document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
        );
    });
}

function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "blue";
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Typewriter effect (green theme only) */
let typingTimers = [];

function clearTyping() {
    typingTimers.forEach((id) => clearTimeout(id));
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
    function tick() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            typingTimers.push(setTimeout(tick, speed));
        } else {
            element.classList.remove("typing", "typing-cursor");
        }
    }
    tick();
}
