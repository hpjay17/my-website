/* Entry gate for beyond.html: a boarding pass in the blue theme, a terminal login in the green theme.
   Plays the first time Beyond Work opens in a browser tab, then again only after the theme changes,
   whether that happens on this page or on the portfolio.
   Add ?gate to the URL to see it again (beyond.html?gate). The wording is in src/data/beyond.js (gate). */

(function () {
    const PLANE_ICON =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';
    const BARCODE_WIDTHS = [1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1];
    // Holds the theme the gate last played for in this tab
    const SEEN_KEY = "beyondGateTheme";
    const forced = new URLSearchParams(location.search).has("gate");
    const html = document.documentElement;
    let returnFocus = null;

    function needsGate(theme) {
        return forced || sessionStorage.getItem(SEEN_KEY) !== theme;
    }

    // Fade the gate out and hand over to the page
    function closeGate(gate, onClosed) {
        if (gate.classList.contains("is-leaving")) return;
        sessionStorage.setItem(SEEN_KEY, html.getAttribute("data-theme"));
        gate.classList.add("is-leaving");
        html.classList.remove("gate-active");
        if (onClosed) onClosed();
        // Green theme: replay the hero typing now that it can be seen
        runHackerTyping();
        if (returnFocus) returnFocus.focus({ preventScroll: true });
        setTimeout(() => gate.remove(), prefersReducedMotion() ? 0 : 600);
    }

    function createGate(kind, label) {
        const gate = createEl("div", `gate gate--${kind}`);
        gate.setAttribute("role", "dialog");
        gate.setAttribute("aria-modal", "true");
        gate.setAttribute("aria-label", label);
        return gate;
    }

    // Phones have no Enter key to press
    function gateHint(text) {
        return window.matchMedia("(pointer: coarse)").matches ? text.hintTouch : text.hint;
    }

    /* Blue theme: boarding pass */

    function buildBoardingPass() {
        const text = beyondData.gate.boardingPass;
        const gate = createGate("pass", "Boarding pass to Beyond Work");
        const button = createEl("button", "pass-btn", text.button);
        button.type = "button";
        const pass = createEl("div", "pass");
        pass.append(passMain(text), passStub(text, button));
        gate.append(pass, createEl("p", "gate-hint", gateHint(text)));

        const board = () => {
            if (gate.classList.contains("is-scanning")) return;
            gate.classList.add("is-scanning");
            button.textContent = text.buttonDone;
            const wait = prefersReducedMotion() ? 300 : 900;
            setTimeout(() => closeGate(gate, () => document.removeEventListener("keydown", onKey)), wait);
        };
        const onKey = (e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                e.preventDefault();
                board();
            }
        };
        button.addEventListener("click", board);
        document.addEventListener("keydown", onKey);

        document.body.appendChild(gate);
        button.focus({ preventScroll: true });
    }

    // Airline, route and the grid of fields
    function passMain(text) {
        const header = createEl("div", "pass-header");
        header.append(createEl("span", "pass-airline", text.airline), createEl("span", "pass-kind", "BOARDING PASS"));

        const place = (className, { code, city }) => {
            const el = createEl("div", className);
            el.append(createEl("span", "pass-code", code), createEl("span", "pass-city", city));
            return el;
        };
        const path = createEl("div", "pass-path");
        path.innerHTML = PLANE_ICON;
        const route = createEl("div", "pass-route");
        route.append(place("pass-place", text.from), path, place("pass-place pass-place--to", text.to));

        const today = new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short" }).toUpperCase();
        const fields = createEl("div", "pass-fields");
        text.fields.forEach(([label, value]) => {
            const field = createEl("div", "pass-field");
            field.append(createEl("span", "pass-label", label), createEl("span", "pass-value", label === "Date" ? today : value));
            fields.appendChild(field);
        });

        const main = createEl("div", "pass-main");
        main.append(header, route, fields);
        return main;
    }

    // Tear-off stub: barcode and the button that "scans" it
    function passStub(text, button) {
        const barcode = createEl("div", "pass-barcode");
        BARCODE_WIDTHS.forEach((width) => {
            const bar = createEl("span", "pass-bar");
            bar.style.flexGrow = width;
            barcode.appendChild(bar);
        });
        barcode.appendChild(createEl("span", "pass-scan"));
        const stub = createEl("div", "pass-stub");
        stub.append(createEl("span", "pass-label", text.stub), barcode, button);
        return stub;
    }

    /* Green theme: terminal login */

    function buildTerminal() {
        const text = beyondData.gate.terminal;
        const gate = createGate("terminal", "Terminal login to Beyond Work");
        const term = createEl("div", "term");
        const body = createEl("pre", "term-body");
        body.setAttribute("aria-live", "polite");
        term.append(createEl("div", "term-bar", text.title), body);
        gate.append(term, createEl("p", "gate-hint", gateHint(text)));

        const steps = terminalSteps(text.lines);
        const timers = [];
        let finished = false;
        const later = (fn, ms) => timers.push(setTimeout(fn, ms));
        const cursor = createEl("span", "term-cursor", " ");

        const printAll = () => {
            body.textContent = "";
            steps.forEach((step) => body.append(createEl("span", step.className, step.text + (step.type || "")), "\n"));
            body.appendChild(cursor);
        };
        const finish = () => {
            if (finished) return;
            finished = true;
            timers.forEach(clearTimeout);
            printAll();
            later(() => closeGate(gate, removeSkip), 600);
        };
        const skip = (e) => {
            if (e.type === "keydown" && ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
            finish();
        };
        const removeSkip = () => {
            document.removeEventListener("keydown", skip);
            gate.removeEventListener("click", skip);
        };
        document.addEventListener("keydown", skip);
        gate.addEventListener("click", skip);

        document.body.appendChild(gate);
        gate.tabIndex = -1;
        gate.focus({ preventScroll: true });

        if (prefersReducedMotion()) {
            printAll();
            later(() => closeGate(gate, removeSkip), 1500);
            return;
        }
        body.appendChild(cursor);
        const end = typeTerminalSteps(steps, body, cursor, later);
        later(() => {
            finished = true;
            closeGate(gate, removeSkip);
        }, end + 500);
    }

    function terminalSteps(lines) {
        const stamp = new Date()
            .toLocaleString("en-US", {
                weekday: "short", month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
            })
            .replace(/,/g, "");
        return lines.map((line) => ({
            ...line,
            text: line.text.replace("{time}", stamp),
            className: line.highlight ? "term-granted" : "",
        }));
    }

    // Schedule the lines one after another, typed parts letter by letter; returns when the last one ends (ms)
    function typeTerminalSteps(steps, body, cursor, later) {
        let time = 300;
        steps.forEach((step) => {
            const line = createEl("span", step.className);
            later(() => {
                line.textContent = step.text;
                body.insertBefore(line, cursor);
            }, time);
            time += step.pause || 120;
            (step.type || "").split("").forEach((char) => {
                time += step.speed || 90;
                later(() => (line.textContent += char), time);
            });
            time += step.type ? 250 : 0;
            later(() => body.insertBefore(document.createTextNode("\n"), cursor), time);
        });
        return time;
    }

    function playGate(theme) {
        html.classList.add("gate-active");
        returnFocus = document.activeElement;
        // Wait a frame, or an Enter press that switched the theme would also skip the gate
        requestAnimationFrame(() => {
            if (theme === "green") buildTerminal();
            else buildBoardingPass();
        });
    }

    // src/beyond/App.jsx calls this when the theme is switched on this page
    window.playGateIfThemeChanged = (theme) => {
        if (needsGate(theme)) playGate(theme);
    };

    // This part runs in <head>, before the page draws, so the page stays hidden until the gate is ready
    const theme = localStorage.getItem("theme") || "blue";
    if (needsGate(theme)) {
        html.setAttribute("data-theme", theme);
        html.classList.add("gate-active");
        document.addEventListener("DOMContentLoaded", () => playGate(theme));
    }
})();
