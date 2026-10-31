/* Entry gate for beyond.html: a boarding pass in the blue theme, a terminal login in the green theme.
   Shows once per browser tab (sessionStorage), so moving around the site doesn't show it again.
   Add ?gate to the URL to see it again (beyond.html?gate). */

// Blue theme: boarding pass
const BOARDING_PASS = {
    airline: "JAY AIR",
    from: { code: "DSK", city: "Desk" },
    to: { code: "BYD", city: "Beyond Work" },
    // Shown in a 3-column grid; "Date" is filled in with today's date automatically
    fields: [
        ["Passenger", "GUEST"],
        ["Flight", "JW 017"],
        ["Date", "TODAY"],
        ["Gate", "B12"],
        ["Seat", "27A"],
        ["Boards", "NOW"],
    ],
    stub: "Seat 27A · Gate B12",
    button: "Scan boarding pass",
    buttonDone: "Boarding ✓",
    hint: "Press Enter to board",
};

// Green theme: terminal login
const TERMINAL = {
    title: "guest@jaywang: ~",
    // Each line: `text` appears at once, then `type` is typed out after it.
    // Optional: speed (ms per typed letter), pause (ms before the line), highlight: true (green block).
    // {time} becomes the current date and time.
    lines: [
        { text: "Last login: {time} on ttys001" },
        { text: "jaywang.dev :: restricted area /beyond" },
        { text: "" },
        { text: "login: ", type: "guest" },
        { text: "password: ", type: "********" },
        { text: "Verifying credentials", type: "...", speed: 250 },
        { text: "ACCESS GRANTED", highlight: true, pause: 500 },
        { text: "Welcome, guest. Loading /beyond", type: " ...", speed: 120 },
    ],
    hint: "Press any key or click to skip",
};

(function () {
    const SEEN_KEY = "beyondGateSeen";
    const forced = new URLSearchParams(location.search).has("gate");
    if (sessionStorage.getItem(SEEN_KEY) && !forced) return;

    // Runs in <head>, before the page draws, so the page stays hidden until the gate is ready
    const html = document.documentElement;
    const theme = localStorage.getItem("theme") || "blue";
    html.setAttribute("data-theme", theme);
    html.classList.add("gate-active");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const now = new Date();

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // Fade the gate out and hand over to the page
    function closeGate(gate, onClosed) {
        if (gate.classList.contains("is-leaving")) return;
        sessionStorage.setItem(SEEN_KEY, "1");
        gate.classList.add("is-leaving");
        html.classList.remove("gate-active");
        if (onClosed) onClosed();
        // Green theme: replay the hero typing now that it can be seen
        runHackerTyping();
        setTimeout(() => gate.remove(), reducedMotion ? 0 : 600);
    }

    /* Blue theme: boarding pass */

    function buildBoardingPass() {
        const gate = el("div", "gate gate--pass");
        gate.setAttribute("role", "dialog");
        gate.setAttribute("aria-modal", "true");
        gate.setAttribute("aria-label", "Boarding pass to Beyond Work");

        const pass = el("div", "pass");
        const main = el("div", "pass-main");

        const header = el("div", "pass-header");
        header.append(el("span", "pass-airline", BOARDING_PASS.airline), el("span", "pass-kind", "BOARDING PASS"));

        const route = el("div", "pass-route");
        const from = el("div", "pass-place");
        from.append(el("span", "pass-code", BOARDING_PASS.from.code), el("span", "pass-city", BOARDING_PASS.from.city));
        const to = el("div", "pass-place pass-place--to");
        to.append(el("span", "pass-code", BOARDING_PASS.to.code), el("span", "pass-city", BOARDING_PASS.to.city));
        const path = el("div", "pass-path");
        path.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';
        route.append(from, path, to);

        const date = now.toLocaleDateString("en-US", { day: "2-digit", month: "short" }).toUpperCase();
        const fields = el("div", "pass-fields");
        BOARDING_PASS.fields.forEach(([label, value]) => {
            const field = el("div", "pass-field");
            field.append(el("span", "pass-label", label), el("span", "pass-value", label === "Date" ? date : value));
            fields.appendChild(field);
        });

        main.append(header, route, fields);

        // Stub: barcode and the button that "scans" it
        const stub = el("div", "pass-stub");
        const barcode = el("div", "pass-barcode");
        const widths = [1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1];
        widths.forEach((w) => {
            const bar = el("span", "pass-bar");
            bar.style.flexGrow = w;
            barcode.appendChild(bar);
        });
        barcode.appendChild(el("span", "pass-scan"));
        const button = el("button", "pass-btn", BOARDING_PASS.button);
        button.type = "button";
        stub.append(el("span", "pass-label", BOARDING_PASS.stub), barcode, button);

        pass.append(main, stub);
        gate.append(pass, el("p", "gate-hint", BOARDING_PASS.hint));

        const board = () => {
            if (gate.classList.contains("is-scanning")) return;
            gate.classList.add("is-scanning");
            button.textContent = BOARDING_PASS.buttonDone;
            setTimeout(() => closeGate(gate, () => document.removeEventListener("keydown", onKey)), reducedMotion ? 300 : 900);
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

    /* Green theme: terminal login */

    function buildTerminal() {
        const gate = el("div", "gate gate--terminal");
        gate.setAttribute("role", "dialog");
        gate.setAttribute("aria-modal", "true");
        gate.setAttribute("aria-label", "Terminal login to Beyond Work");

        const term = el("div", "term");
        const bar = el("div", "term-bar", TERMINAL.title);
        const body = el("pre", "term-body");
        body.setAttribute("aria-live", "polite");
        term.append(bar, body);
        gate.append(term, el("p", "gate-hint", TERMINAL.hint));

        const stamp = now.toLocaleString("en-US", {
            weekday: "short", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        }).replace(/,/g, "");

        const steps = TERMINAL.lines.map((line) => ({
            ...line,
            text: line.text.replace("{time}", stamp),
            className: line.highlight ? "term-granted" : "",
        }));

        const timers = [];
        let finished = false;
        const later = (fn, ms) => timers.push(setTimeout(fn, ms));
        const cursor = el("span", "term-cursor", " ");

        const printAll = () => {
            body.textContent = "";
            steps.forEach((step) => {
                const line = el("span", step.className || "", step.text + (step.type || ""));
                body.append(line, "\n");
            });
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

        if (reducedMotion) {
            printAll();
            later(() => closeGate(gate, removeSkip), 1500);
            return;
        }

        // Play the steps one after another
        let time = 300;
        body.appendChild(cursor);
        steps.forEach((step) => {
            const line = el("span", step.className || "");
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
        later(() => {
            finished = true;
            closeGate(gate, removeSkip);
        }, time + 500);
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (theme === "green") buildTerminal();
        else buildBoardingPass();
    });
})();
