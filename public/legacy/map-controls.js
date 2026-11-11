/* Zoom buttons, hints, wheel and key zooming, and drag, flick and pinch handling,
   used by the flat map (js/travel-map.js) and the globe (js/globe.js). */

// + and − buttons for the map's corner; onZoom gets the factor to zoom by
function buildZoomButtons(step, onZoom) {
    const zoomIn = createButton("map-zoom-btn", "+", () => onZoom(step), "Zoom in");
    const zoomOut = createButton("map-zoom-btn", "−", () => onZoom(1 / step), "Zoom out");
    const bar = createEl("div", "map-zoom");
    bar.append(zoomIn, zoomOut);
    return { bar, in: zoomIn, out: zoomOut };
}

// Scrolling up zooms in. Trackpad pinches arrive as wheel events with ctrlKey and much smaller deltas.
function wheelZoomFactor(e) {
    const lines = e.deltaMode === 1 ? 16 : 1;
    const pinch = e.ctrlKey && Math.abs(e.deltaY) < 40;
    return Math.exp(-e.deltaY * lines * (pinch ? 0.01 : 0.002));
}

// A message that flashes over the map for a moment. Returns { show(text), hide() }.
function buildMapHint(host) {
    const el = createEl("div", "map-scroll-hint");
    el.setAttribute("aria-hidden", "true");
    host.appendChild(el);
    let hideTimer = 0;
    const hide = () => el.classList.remove("is-visible");
    return {
        show(text) {
            el.textContent = text;
            el.classList.add("is-visible");
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hide, 1200);
        },
        hide,
    };
}

// Wheel zooming that doesn't trap the page. A plain scroll over `target` scrolls the page as usual and
// flashes `hint` (from buildMapHint); scrolling with ⌘ or Ctrl held zooms, as does a trackpad pinch
// (which browsers report as a wheel event with ctrlKey). onZoom gets the wheel event.
function wireWheelZoom(target, hint, onZoom) {
    const key = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
    target.addEventListener(
        "wheel",
        (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                hint.hide();
                onZoom(e);
                return;
            }
            hint.show(`Hold ${key} and scroll to zoom`);
        },
        { passive: false },
    );
}

// + (or =, its unshifted key) zooms in by `step`, - zooms out; any other key gives 0
function keyZoomFactor(key, step) {
    if (key === "+" || key === "=") return step;
    if (key === "-") return 1 / step;
    return 0;
}

// Drag, flick and pinch on `target`. A mouse drags with its button held and one finger drags on a touch
// screen; two fingers move and zoom. The target needs `touch-action: none` in CSS so the browser leaves
// touches on it alone; touches anywhere else scroll the page as usual. A press only becomes a drag
// once it moves a few pixels, so a plain click or tap still reaches what's under it. Callbacks:
//   onPress()                   a pointer went down
//   onDragStart()               a drag began
//   onDrag(dx, dy)              pixels moved since onDragStart
//   onRelease({ velocity, click })  the last pointer lifted. velocity is [x, y] pixels a second after a
//                               drag; click is the pointer event if it never moved. Otherwise null.
//   onPinchStart()              two fingers are down
//   onPinch(factor, fx, fy, dx, dy)  since onPinchStart: the zoom factor, the point between the fingers
//                               when it started (as fractions across the target), and how many pixels
//                               that point has moved
function wireDragAndPinch(target, { onPress, onDragStart, onDrag, onRelease, onPinchStart, onPinch }) {
    const pointers = new Map();
    let drag = null;
    let pinch = null;

    // Keeps a pointer's events coming here even if it slides off the target
    const capture = (id) => {
        try {
            target.setPointerCapture(id);
        } catch {
            // The pointer has already gone; nothing to hold on to
        }
    };
    const fingers = () => {
        const [a, b] = [...pointers.values()];
        const box = target.getBoundingClientRect();
        const x = (a.x + b.x) / 2;
        const y = (a.y + b.y) / 2;
        return {
            spread: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
            x,
            y,
            fx: (x - box.left) / box.width,
            fy: (y - box.top) / box.height,
        };
    };

    target.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        onPress();
        if (pointers.size === 2) {
            drag = null;
            target.classList.remove("is-dragging");
            pointers.forEach((_, id) => capture(id));
            pinch = fingers();
            onPinchStart();
        } else if (pointers.size === 1) {
            const { x, y } = pointers.get(e.pointerId);
            drag = {
                id: e.pointerId,
                x,
                y,
                touch: e.pointerType === "touch",
                moved: false,
                samples: [{ time: performance.now(), x, y }],
            };
        }
    });

    target.addEventListener("pointermove", (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch) {
            if (pointers.size === 2) {
                const now = fingers();
                onPinch(now.spread / pinch.spread, pinch.fx, pinch.fy, now.x - pinch.x, now.y - pinch.y);
            }
            return;
        }
        if (!drag || drag.id !== e.pointerId) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (!drag.moved) {
            // A finger wobbles more than a mouse during a tap
            if (Math.abs(dx) + Math.abs(dy) <= (drag.touch ? 8 : 4)) return;
            drag.moved = true;
            capture(e.pointerId);
            target.classList.add("is-dragging");
            onDragStart();
        }
        onDrag(dx, dy);
        // The last tenth of a second of movement gives the flick speed
        const now = performance.now();
        drag.samples.push({ time: now, x: e.clientX, y: e.clientY });
        while (drag.samples.length > 2 && now - drag.samples[0].time > 100) drag.samples.shift();
    });

    const release = (e, cancelled) => {
        if (!pointers.delete(e.pointerId)) return;
        if (pinch || !drag || drag.id !== e.pointerId) {
            // A two-finger gesture ends when either finger lifts; the one left behind does nothing more
            if (pointers.size < 2) pinch = null;
            if (pointers.size === 0) onRelease({ velocity: null, click: null });
            return;
        }
        target.classList.remove("is-dragging");
        const { moved, samples } = drag;
        drag = null;
        const first = samples[0];
        const last = samples[samples.length - 1];
        const seconds = (last.time - first.time) / 1000;
        const flicked = moved && !cancelled && seconds > 0;
        onRelease({
            velocity: flicked ? [(last.x - first.x) / seconds, (last.y - first.y) / seconds] : null,
            click: moved || cancelled ? null : e,
        });
    };
    target.addEventListener("pointerup", (e) => release(e, false));
    target.addEventListener("pointercancel", (e) => release(e, true));
}
