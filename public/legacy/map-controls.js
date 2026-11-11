/* Zoom buttons, wheel and key zooming, and drag, flick and pinch handling,
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

// Wheel zooming that doesn't trap the page. A plain scroll over `target` scrolls the page as usual and
// flashes a hint inside `hintHost`; scrolling with ⌘ or Ctrl held zooms, as does a trackpad pinch
// (which browsers report as a wheel event with ctrlKey). onZoom gets the wheel event.
function wireWheelZoom(target, hintHost, onZoom) {
    const key = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
    const hint = createEl("div", "map-scroll-hint", `Hold ${key} and scroll to zoom`);
    hint.setAttribute("aria-hidden", "true");
    hintHost.appendChild(hint);
    let hideTimer = 0;
    target.addEventListener(
        "wheel",
        (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                hint.classList.remove("is-visible");
                onZoom(e);
                return;
            }
            hint.classList.add("is-visible");
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => hint.classList.remove("is-visible"), 1200);
        },
        { passive: false }
    );
}

// + (or =, its unshifted key) zooms in by `step`, - zooms out; any other key gives 0
function keyZoomFactor(key, step) {
    if (key === "+" || key === "=") return step;
    if (key === "-") return 1 / step;
    return 0;
}

// Drag, flick and pinch on `target`. A press only becomes a drag once it moves a few pixels, so a plain
// click still reaches what's under it. Callbacks:
//   onPress()                   a pointer went down
//   onDragStart()               a drag began, or a pinch ended with one finger still down
//   onDrag(dx, dy)              pixels moved since onDragStart
//   onRelease({ velocity, click })  the press ended. velocity is [x, y] pixels a second after a drag;
//                               click is the pointer event if it never moved. Both are null if the
//                               browser took the touch over to scroll the page.
//   onPinchStart(), onPinch(factor, fx, fy)  two fingers: the zoom factor since onPinchStart, and the point
//                               between the fingers when it started, as fractions across the target
function wireDragAndPinch(target, { onPress, onDragStart, onDrag, onRelease, onPinchStart, onPinch }) {
    const pointers = new Map();
    let drag = null;
    let pinch = null;

    const startDrag = (id, { x, y }, moved) => {
        drag = { id, x, y, moved, samples: [{ time: performance.now(), x, y }] };
        if (moved) onDragStart();
    };
    const fingers = () => {
        const [a, b] = [...pointers.values()];
        const box = target.getBoundingClientRect();
        return {
            spread: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
            fx: ((a.x + b.x) / 2 - box.left) / box.width,
            fy: ((a.y + b.y) / 2 - box.top) / box.height,
        };
    };

    target.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        onPress();
        if (pointers.size === 2) {
            drag = null;
            target.classList.remove("is-dragging");
            pinch = fingers();
            onPinchStart();
        } else if (pointers.size === 1) {
            startDrag(e.pointerId, pointers.get(e.pointerId), false);
        }
    });

    target.addEventListener("pointermove", (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch) {
            if (pointers.size === 2) onPinch(fingers().spread / pinch.spread, pinch.fx, pinch.fy);
            return;
        }
        if (!drag || drag.id !== e.pointerId) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (!drag.moved) {
            if (Math.abs(dx) + Math.abs(dy) <= 4) return;
            drag.moved = true;
            target.setPointerCapture(e.pointerId);
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
        if (pinch) {
            if (pointers.size < 2) pinch = null;
            // Carry on dragging from where the remaining finger is, without a jump
            if (pointers.size === 1) {
                const [[id, point]] = pointers.entries();
                startDrag(id, point, true);
            }
            return;
        }
        if (!drag || drag.id !== e.pointerId) return;
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
