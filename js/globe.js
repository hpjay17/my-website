/* Globe view for the travel map on beyond.html: the same dots, routes and pins as the flat map,
   drawn on a sphere you can drag to spin. Load after data/world-dots.js and before js/beyond.js,
   which calls showGlobe and hideGlobe from its Map and Globe buttons. Drawn on a canvas with no 3D library. */

/* Globe settings: safe to tweak */

// Degrees per second the globe turns by itself, until someone drags it
const GLOBE_AUTO_SPIN = 5;
// How quickly a flick slows down: the share of its speed left after one second
const GLOBE_FRICTION = 0.05;
// Highest a route rises off the surface, as a share of the globe's radius (the longest flights reach it)
const GLOBE_ARC_HEIGHT = 0.12;
// Furthest the globe tilts north or south, in degrees
const GLOBE_MAX_TILT = 60;
// Where the globe faces when it first opens: [latitude, longitude]
const GLOBE_START = [28, -50];
// Closest zoom, as a multiple of the globe's normal size, and how much each + / − click zooms
const GLOBE_MAX_ZOOM = 5;
const GLOBE_ZOOM_STEP = 1.6;
// Pin sizes in pixels: trips, layover stops, and the two home pins
const GLOBE_PIN_SIZES = { trip: 2, stop: 2.4, home: 2 };

/* Globe internals */

const globe = {
    canvas: null,
    ctx: null,
    active: false,
    visible: true,
    width: 0,       // canvas size in CSS pixels
    height: 0,
    radius: 0,      // the globe's radius on screen right now: baseRadius times zoom
    baseRadius: 0,  // the radius at which the whole globe fits the canvas
    zoom: 1,
    zoomTarget: 1,  // zoom eases toward this
    pointers: new Map(),  // pointers down on the canvas, by id, for pinching
    pinch: null,    // { distance, zoom } when two fingers went down
    zoomButtons: null,
    lat: GLOBE_START[0],   // the point facing the viewer, in degrees
    lon: GLOBE_START[1],
    spinLat: 0,     // degrees per second, from a flick or the arrow keys
    spinLon: 0,
    autoSpin: true,
    pointerInside: false,
    drag: null,     // { x, y, lat, lon, moved, samples } while a pointer is down
    hover: null,    // the pin entry under the pointer
    land: null,     // Float32Array of x, y, z for every land dot
    pinVectors: null,
    pinScreen: [],  // where each pin landed in the last frame: { entry, x, y, visible }
    colors: {},
    frame: 0,
    lastFrame: 0,
    plane: null,    // Path2D of PLANE_SHAPE
};

function buildGlobe() {
    const canvas = document.createElement("canvas");
    canvas.className = "travel-map-globe";
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
        "aria-label",
        "Globe of places I've traveled. Drag, or use the arrow keys, to turn it; scroll, pinch, or use + and - to zoom."
    );
    globe.canvas = canvas;
    globe.ctx = canvas.getContext("2d");
    globe.land = buildGlobeLand();
    globe.pinVectors = new Map(travelMap.pins.map((entry) => [entry, toVector(entry.item.coords)]));
    globe.plane = new Path2D(PLANE_SHAPE);

    canvas.addEventListener("pointerdown", onGlobePointerDown);
    canvas.addEventListener("pointermove", onGlobePointerMove);
    canvas.addEventListener("pointerup", onGlobePointerUp);
    // The browser took over the touch to scroll the page: end the drag without counting a click
    canvas.addEventListener("pointercancel", (e) => {
        globe.pointers.delete(e.pointerId);
        globe.pinch = null;
        globe.drag = null;
        canvas.classList.remove("is-dragging");
    });
    canvas.addEventListener("pointerenter", () => (globe.pointerInside = true));
    canvas.addEventListener("pointerleave", () => {
        globe.pointerInside = false;
        setGlobeHover(null);
        requestGlobeFrame();
    });
    canvas.addEventListener("keydown", onGlobeKey);
    // passive: false so the page doesn't scroll while the wheel zooms
    canvas.addEventListener("wheel", onGlobeWheel, { passive: false });

    new ResizeObserver(() => {
        resizeGlobe();
        requestGlobeFrame();
    }).observe(canvas);

    // Only draw while it's on screen
    new IntersectionObserver(([entry]) => {
        globe.visible = entry.isIntersecting;
        requestGlobeFrame();
    }).observe(canvas);

    // The canvas can't use CSS variables directly, so re-read the colors whenever the theme changes
    new MutationObserver(() => {
        readGlobeColors();
        requestGlobeFrame();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const wrap = document.createElement("div");
    wrap.className = "travel-map-globe-wrap";
    // The same + / − buttons as the flat map (js/beyond.js)
    globe.zoomButtons = buildZoomButtons(GLOBE_ZOOM_STEP, zoomGlobeBy);
    updateGlobeZoomButtons();
    wrap.append(canvas, globe.zoomButtons.bar);
    travelMap.flat.after(wrap);
}

// The land dots as points on the sphere. The flat map's grid can't be used directly: its rows have as
// many dots near the poles as at the equator, so they'd bunch up there, and thinning the rows leaves
// gaps that line up into stripes. Instead, dots are spread evenly over the whole sphere along a
// golden-angle spiral (no rows, so nothing lines up), about as far apart as the grid's dots,
// and each one is kept if the grid says it's on land.
function buildGlobeLand() {
    const { step, latTop, rows } = worldDots;
    const cols = Math.round(360 / step);
    const isLand = new Uint8Array(rows.length * cols);
    rows.forEach((row, r) => {
        row.split(" ").filter(Boolean).forEach((run) => {
            const [start, length] = run.split(",").map(Number);
            isLand.fill(1, r * cols + start, r * cols + start + length);
        });
    });

    const rad = Math.PI / 180;
    const deg = 180 / Math.PI;
    // The sphere's area divided by the area each grid dot covers at the equator
    const count = Math.round((4 * Math.PI) / (step * rad) ** 2);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const coords = [];
    for (let i = 0; i < count; i++) {
        const z = 1 - (2 * i + 1) / count;
        const ring = Math.sqrt(1 - z * z);
        const x = ring * Math.cos(i * goldenAngle);
        const y = ring * Math.sin(i * goldenAngle);
        const r = Math.floor((latTop - Math.asin(z) * deg) / step);
        const c = Math.floor((Math.atan2(y, x) * deg + 180) / step) % cols;
        if (r >= 0 && r < rows.length && isLand[r * cols + c]) coords.push(x, y, z);
    }
    return new Float32Array(coords);
}

function readGlobeColors() {
    const css = getComputedStyle(document.documentElement);
    const read = (name) => css.getPropertyValue(name).trim();
    globe.colors = {
        land: read("--text-muted"),
        route: read("--accent-a"),
        trip: read("--accent-a"),
        home: read("--accent-b"),
        plane: read("--text-main"),
        sea: read("--bg-base"),
        rim: read("--line-hover"),
        glow: read("--glow-a"),
        shade: read("--glow-subtle"),
    };
}

function resizeGlobe() {
    const { canvas } = globe;
    const dpr = window.devicePixelRatio || 1;
    globe.width = canvas.clientWidth;
    globe.height = canvas.clientHeight;
    canvas.width = Math.round(globe.width * dpr);
    canvas.height = Math.round(globe.height * dpr);
    globe.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Leave room for routes rising off the edge
    globe.baseRadius = Math.max(0, Math.min(globe.width, globe.height) / 2 / (1 + GLOBE_ARC_HEIGHT) - 6);
    globe.radius = globe.baseRadius * globe.zoom;
}

// From js/beyond.js's view buttons. Returns true if the map changed.
function showGlobe() {
    if (globe.active) return false;
    if (!globe.canvas) buildGlobe();
    hideMapPlace();
    globe.active = true;
    travelMap.root.classList.add("is-globe");
    travelMap.mapButton.classList.remove("active");
    travelMap.globeButton.classList.add("active");
    globe.autoSpin = !prefersReducedMotion();
    resizeGlobe();
    readGlobeColors();
    requestGlobeFrame();
    return true;
}

// Back to the flat map. Returns true if the globe was showing.
function hideGlobe() {
    if (!globe.active) return false;
    globe.active = false;
    setGlobeHover(null);
    travelMap.root.classList.remove("is-globe");
    travelMap.globeButton.classList.remove("active");
    cancelAnimationFrame(globe.frame);
    globe.frame = 0;
    return true;
}

/* Animation */

// Ask for a frame; the loop keeps itself going only while something is moving
function requestGlobeFrame() {
    if (!globe.canvas || !globe.active || !globe.visible || globe.frame) return;
    globe.lastFrame = performance.now();
    globe.frame = requestAnimationFrame(globeFrame);
}

function globeFrame(now) {
    globe.frame = 0;
    // Cap the step so a frame after the tab was in the background doesn't fling the globe
    const dt = Math.min((now - globe.lastFrame) / 1000, 0.1);
    globe.lastFrame = now;
    const moving = updateGlobeRotation(dt);
    drawGlobe();
    if (moving) {
        globe.frame = requestAnimationFrame(globeFrame);
    }
}

// Move the globe for this frame; returns true if it should keep animating
function updateGlobeRotation(dt) {
    const zooming = easeGlobeZoom(dt);
    const moving = turnGlobe(dt);
    globe.lon = ((globe.lon + 540) % 360) - 180;
    return moving || zooming;
}

// Move the zoom part of the way to its target; returns true until it arrives
function easeGlobeZoom(dt) {
    const gap = globe.zoomTarget - globe.zoom;
    if (Math.abs(gap) < 0.002) {
        globe.zoom = globe.zoomTarget;
    } else {
        // Zoom on a log scale, so zooming 1x to 2x feels the same as 2x to 4x
        const ease = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt * 10);
        globe.zoom = Math.exp(Math.log(globe.zoom) + (Math.log(globe.zoomTarget) - Math.log(globe.zoom)) * ease);
    }
    globe.radius = globe.baseRadius * globe.zoom;
    return globe.zoom !== globe.zoomTarget;
}

function clampZoom(zoom) {
    return Math.min(Math.max(zoom, 1), GLOBE_MAX_ZOOM);
}

// Zoom by a factor from where it's heading; returns false if already at the limit
function zoomGlobeBy(factor) {
    const next = clampZoom(globe.zoomTarget * factor);
    if (Math.abs(next - globe.zoomTarget) < 1e-6) return false;
    globe.zoomTarget = next;
    updateGlobeZoomButtons();
    requestGlobeFrame();
    return true;
}

function updateGlobeZoomButtons() {
    globe.zoomButtons.in.disabled = globe.zoomTarget >= GLOBE_MAX_ZOOM - 1e-6;
    globe.zoomButtons.out.disabled = globe.zoomTarget <= 1 + 1e-6;
}

function turnGlobe(dt) {
    if (globe.drag) return false;
    const reduced = prefersReducedMotion();

    // During a replay, turn to keep the plane in view
    if (replay.active && replay.current) {
        const [lat, lon] = replayPlaneLatLon();
        const ease = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
        const turnLon = angleBetween(globe.lon, lon);
        const turnLat = clampTilt(lat * 0.6) - globe.lat;
        globe.lon += turnLon * ease;
        globe.lat += turnLat * ease;
        globe.spinLat = globe.spinLon = 0;
        // Paused, it still finishes turning to the plane
        return replay.playing || Math.abs(turnLon) > 0.2 || Math.abs(turnLat) > 0.2;
    }

    let moving = false;
    if (Math.abs(globe.spinLon) > 0.5 || Math.abs(globe.spinLat) > 0.5) {
        globe.lon += globe.spinLon * dt;
        globe.lat = clampTilt(globe.lat + globe.spinLat * dt);
        const keep = Math.pow(GLOBE_FRICTION, dt);
        globe.spinLon *= keep;
        globe.spinLat *= keep;
        moving = true;
    } else {
        globe.spinLon = globe.spinLat = 0;
    }
    // The slow turn pauses while the pointer is over the globe, so pins hold still to be hovered
    if (globe.autoSpin && !reduced && !globe.pointerInside) {
        // Slower when zoomed in, so the land passes by at the same speed on screen
        globe.lon += (GLOBE_AUTO_SPIN * dt) / globe.zoom;
        moving = true;
    }
    return moving;
}

// Shortest signed turn in degrees from one longitude to another
function angleBetween(from, to) {
    return ((((to - from) % 360) + 540) % 360) - 180;
}

function clampTilt(lat) {
    return Math.min(Math.max(lat, -GLOBE_MAX_TILT), GLOBE_MAX_TILT);
}

/* Drawing */

// The rotation for this frame as a function: point on the sphere to [screen x, screen y, depth].
// Depth above 0 faces the viewer. Points off the surface (route arcs) pass a radius above 1.
function globeProjector() {
    const rad = Math.PI / 180;
    const sinLon = Math.sin(globe.lon * rad);
    const cosLon = Math.cos(globe.lon * rad);
    const sinLat = Math.sin(globe.lat * rad);
    const cosLat = Math.cos(globe.lat * rad);
    const cx = globe.width / 2;
    const cy = globe.height / 2;
    const r = globe.radius;
    return (x, y, z, out) => {
        out[0] = cx + r * (-sinLon * x + cosLon * y);
        out[1] = cy - r * (-sinLat * cosLon * x - sinLat * sinLon * y + cosLat * z);
        out[2] = cosLat * cosLon * x + cosLat * sinLon * y + sinLat * z;
        return out;
    };
}

function drawGlobe() {
    const { ctx, width, height, radius, colors } = globe;
    const cx = width / 2;
    const cy = height / 2;
    const project = globeProjector();
    const p = [0, 0, 0];
    ctx.clearRect(0, 0, width, height);
    if (radius <= 0) return;

    // The sphere, with a soft glow round its edge
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = colors.sea;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();
    const shade = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, 0, cx, cy, radius);
    shade.addColorStop(0, colors.shade);
    shade.addColorStop(1, "transparent");
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.strokeStyle = colors.rim;
    ctx.lineWidth = 1;
    ctx.stroke();

    drawGlobeLand(project, p);
    drawGlobeRoutes(project, p);
    drawGlobePins(project, p);
    drawGlobePlane(project);
    if (globe.hover) placeGlobeTooltip(globe.hover);
}

// Keep the tooltip on its pin as the globe turns; drop it once the pin goes round the back
function placeGlobeTooltip(entry) {
    const spot = globe.pinScreen.find((s) => s.entry === entry);
    if (!spot || !spot.visible) {
        globe.hover = null;
        globe.canvas.classList.remove("is-over-pin");
        hideMapPlace();
        return;
    }
    const canvasBox = globe.canvas.getBoundingClientRect();
    const rootBox = travelMap.root.getBoundingClientRect();
    positionMapTooltip(canvasBox.left - rootBox.left + spot.x, canvasBox.top - rootBox.top + spot.y - 4);
}

// How many brightness steps the land fades through toward the globe's edge. Each step is one path,
// so this many fills a frame; enough steps that the fade looks smooth rather than banded.
const GLOBE_LAND_SHADES = 8;

// Land dots as tiny squares, one path per brightness. Dots fade toward the edge, which reads as roundness.
function drawGlobeLand(project, p) {
    const { ctx, land, width, height, colors } = globe;
    // Dots grow more slowly than the globe when zooming, so zoomed-in land stays airy instead of blocky
    const size = Math.max(1, globe.baseRadius * 0.0075 * Math.sqrt(globe.zoom));
    const half = size / 2;
    const shades = Array.from({ length: GLOBE_LAND_SHADES }, () => new Path2D());
    for (let i = 0; i < land.length; i += 3) {
        project(land[i], land[i + 1], land[i + 2], p);
        // Behind the globe, or (when zoomed in) off the canvas
        if (p[2] <= 0 || p[0] < -half || p[0] > width + half || p[1] < -half || p[1] > height + half) continue;
        // Depth runs from 0 at the edge to 1 facing the viewer
        shades[Math.min(GLOBE_LAND_SHADES - 1, Math.floor(p[2] * GLOBE_LAND_SHADES))].rect(p[0] - half, p[1] - half, size, size);
    }
    ctx.fillStyle = colors.land;
    shades.forEach((path, k) => {
        // From 0.15 at the edge up to 0.55 in the middle, rising quickly at first
        ctx.globalAlpha = 0.15 + 0.4 * Math.sqrt((k + 0.5) / GLOBE_LAND_SHADES);
        ctx.fill(path);
    });
    ctx.globalAlpha = 1;
}

// How high a route is above the surface at t (0 to 1): a smooth hump, higher for longer flights
function routeLift(route, t) {
    return GLOBE_ARC_HEIGHT * Math.min(1, route.angle / 1.6) * Math.sin(Math.PI * t);
}

// Project the point t of the way along a route, lifted off the surface.
// Returns false if the globe hides it (behind the sphere and inside its outline).
function projectRoutePoint(project, route, t, p) {
    const { vectors } = route;
    const along = t * (vectors.length - 1);
    const i = Math.min(Math.floor(along), vectors.length - 2);
    const f = along - i;
    const a = vectors[i];
    const b = vectors[i + 1];
    const lift = 1 + routeLift(route, t);
    project((a[0] + (b[0] - a[0]) * f) * lift, (a[1] + (b[1] - a[1]) * f) * lift, (a[2] + (b[2] - a[2]) * f) * lift, p);
    const dx = p[0] - globe.width / 2;
    const dy = p[1] - globe.height / 2;
    return p[2] > 0 || dx * dx + dy * dy > globe.radius * globe.radius;
}

function drawGlobeRoutes(project, p) {
    const { ctx, colors } = globe;
    const focusing = travelMap.svg.classList.contains("is-focusing");
    ctx.strokeStyle = colors.route;
    ctx.lineJoin = "round";

    travelMap.routes.forEach((route) => {
        // During a replay, only the part flown so far; js/beyond.js keeps this on each route
        const amount = replay.active ? route.drawnAmount || 0 : 1;
        if (amount <= 0) return;
        const bright = route.el.classList.contains("is-highlighted");
        ctx.globalAlpha = bright ? 1 : focusing ? 0.12 : 0.5;
        ctx.lineWidth = bright ? 1.6 : 1;

        const steps = route.vectors.length - 1;
        const last = amount * steps;
        ctx.beginPath();
        let drawing = false;
        for (let i = 0; i <= Math.ceil(last); i++) {
            const t = Math.min(i, last) / steps;
            if (projectRoutePoint(project, route, t, p)) {
                if (drawing) ctx.lineTo(p[0], p[1]);
                else ctx.moveTo(p[0], p[1]);
                drawing = true;
            } else {
                drawing = false;
            }
        }
        ctx.stroke();
    });
    ctx.globalAlpha = 1;
}

function drawGlobePins(project, p) {
    const { ctx, colors } = globe;
    globe.pinScreen = [];
    travelMap.pins.forEach((entry) => {
        const v = globe.pinVectors.get(entry);
        project(v[0], v[1], v[2], p);
        // Hidden while a replay hasn't reached it yet
        const visible = p[2] > 0.02 && !entry.pin.classList.contains("is-pending");
        globe.pinScreen.push({ entry, x: p[0], y: p[1], visible });
        if (!visible) return;

        const kind = entry.pin.classList.contains("map-pin--stop") ? "stop" : entry.pin.classList.contains("map-pin--home") ? "home" : "trip";
        const big = entry === globe.hover || entry.pin.classList.contains("is-active");
        const r = GLOBE_PIN_SIZES[kind] * (big ? 1.5 : 1);
        const color = kind === "home" ? colors.home : colors.trip;
        // Fade pins out as they turn toward the edge
        ctx.globalAlpha = Math.min(1, p[2] * 5);

        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        if (kind === "stop") {
            ctx.fillStyle = colors.sea;
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        } else {
            // A wider faint circle behind stands in for the flat map's glow
            ctx.save();
            ctx.globalAlpha *= 0.25;
            ctx.beginPath();
            ctx.arc(p[0], p[1], r * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = colors.sea;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
    ctx.globalAlpha = 1;
}

// Where the replay's plane is, as [lat, lon], from the same leg and progress js/beyond.js uses
function replayPlaneLatLon() {
    const { leg, progress } = replay.current;
    const { vectors } = leg.route;
    const t = leg.reverse ? 1 - progress : progress;
    const along = t * (vectors.length - 1);
    const i = Math.min(Math.floor(along), vectors.length - 2);
    const f = along - i;
    const v = [0, 1, 2].map((k) => vectors[i][k] + (vectors[i + 1][k] - vectors[i][k]) * f);
    return toLatLon(v);
}

function drawGlobePlane(project) {
    if (!replay.active || !replay.current || prefersReducedMotion()) return;
    const { ctx, colors } = globe;
    const { leg, progress } = replay.current;
    const t = leg.reverse ? 1 - progress : progress;
    // A point a little further along gives the heading
    const ahead = Math.min(Math.max(t + (leg.reverse ? -0.01 : 0.01), 0), 1);
    const here = [0, 0, 0];
    const next = [0, 0, 0];
    if (!projectRoutePoint(project, leg.route, t, here)) return;
    projectRoutePoint(project, leg.route, ahead, next);
    let angle = Math.atan2(next[1] - here[1], next[0] - here[0]);
    // Right at either end the point ahead can be the same point; keep the plane level rather than spinning
    if (next[0] === here[0] && next[1] === here[1]) angle = 0;

    ctx.save();
    ctx.translate(here[0], here[1]);
    ctx.rotate(angle);
    ctx.scale(1.1, 1.1);
    ctx.globalAlpha = Math.min(1, progress * 8, (1 - progress) * 8);
    ctx.fillStyle = colors.plane;
    ctx.shadowColor = colors.route;
    ctx.shadowBlur = 4;
    ctx.fill(globe.plane);
    ctx.restore();
}

/* Pointer and keyboard */

function onGlobePointerDown(e) {
    if (e.button !== 0) return;
    globe.canvas.setPointerCapture(e.pointerId);
    globe.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // A second finger turns the drag into a pinch
    if (globe.pointers.size === 2) {
        globe.drag = null;
        globe.pinch = { distance: pointerSpread(), zoom: globe.zoom };
        return;
    }
    startGlobeDrag(e.clientX, e.clientY);
}

function startGlobeDrag(x, y) {
    globe.drag = { x, y, lat: globe.lat, lon: globe.lon, moved: false, samples: [] };
    globe.autoSpin = false;
    globe.spinLat = globe.spinLon = 0;
    globe.canvas.classList.add("is-dragging");
}

// Distance between the two fingers of a pinch
function pointerSpread() {
    const [a, b] = [...globe.pointers.values()];
    return Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
}

function onGlobePointerMove(e) {
    if (globe.pointers.has(e.pointerId)) globe.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (globe.pinch) {
        if (globe.pointers.size === 2) {
            // Follows the fingers directly, with no easing
            globe.zoom = globe.zoomTarget = clampZoom((globe.pinch.zoom * pointerSpread()) / globe.pinch.distance);
            globe.radius = globe.baseRadius * globe.zoom;
            updateGlobeZoomButtons();
            drawGlobe();
        }
        return;
    }
    const { drag } = globe;
    if (!drag) {
        setGlobeHover(pinAt(e));
        return;
    }
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    setGlobeHover(null);

    // A drag across the globe's full width turns it about 115 degrees, so the land stays under the finger
    const deg = 180 / Math.PI / globe.radius;
    globe.lon = drag.lon - dx * deg;
    globe.lat = clampTilt(drag.lat + dy * deg);
    // Keep the last tenth of a second of movement to work out how fast it was flicked
    const now = performance.now();
    drag.samples.push({ time: now, lat: globe.lat, lon: globe.lon });
    while (drag.samples.length > 2 && now - drag.samples[0].time > 100) drag.samples.shift();
    drawGlobe();
}

function onGlobePointerUp(e) {
    globe.pointers.delete(e.pointerId);
    if (globe.pinch) {
        if (globe.pointers.size < 2) globe.pinch = null;
        // One finger still down: carry on as a drag from where it is, without the globe jumping
        if (globe.pointers.size === 1) {
            const [rest] = globe.pointers.values();
            startGlobeDrag(rest.x, rest.y);
            globe.drag.moved = true;
        }
        return;
    }
    const { drag } = globe;
    if (!drag) return;
    globe.drag = null;
    globe.canvas.classList.remove("is-dragging");

    if (!drag.moved) {
        // A click without a drag: a trip pin opens its card, as on the flat map
        const entry = pinAt(e);
        if (entry && entry.pin.getAttribute("role") === "button") entry.pin.dispatchEvent(new MouseEvent("click"));
    } else if (!prefersReducedMotion() && drag.samples.length > 1) {
        const first = drag.samples[0];
        const last = drag.samples[drag.samples.length - 1];
        const seconds = (last.time - first.time) / 1000;
        if (seconds > 0) {
            globe.spinLon = angleBetween(first.lon, last.lon) / seconds;
            globe.spinLat = (last.lat - first.lat) / seconds;
        }
    }
    requestGlobeFrame();
}

// The wheel (or a two-finger trackpad pinch, which browsers send as a wheel with ctrlKey) zooms.
// The page never scrolls while the cursor is over the globe, even once it can't zoom any further.
function onGlobeWheel(e) {
    const lines = e.deltaMode === 1 ? 16 : 1;
    const factor = Math.exp(-e.deltaY * lines * (e.ctrlKey ? 0.01 : 0.002));
    e.preventDefault();
    zoomGlobeBy(factor);
}

function onGlobeKey(e) {
    if (e.key === "+" || e.key === "=" || e.key === "-") {
        e.preventDefault();
        zoomGlobeBy(e.key === "-" ? 1 / GLOBE_ZOOM_STEP : GLOBE_ZOOM_STEP);
        return;
    }
    const turns = { ArrowLeft: [0, -90], ArrowRight: [0, 90], ArrowUp: [60, 0], ArrowDown: [-60, 0] };
    const turn = turns[e.key];
    if (!turn) return;
    e.preventDefault();
    globe.autoSpin = false;
    if (prefersReducedMotion()) {
        globe.lat = clampTilt(globe.lat + turn[0] / 4);
        globe.lon += turn[1] / 4;
    } else {
        globe.spinLat = turn[0];
        globe.spinLon = turn[1];
    }
    requestGlobeFrame();
}

// The visible pin nearest the pointer, within a finger's reach
function pinAt(e) {
    if (replay.active) return null;
    const box = globe.canvas.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const reach = e.pointerType === "touch" ? 18 : 10;
    let best = null;
    let bestDistance = reach * reach;
    globe.pinScreen.forEach(({ entry, x: px, y: py, visible }) => {
        const d = (px - x) ** 2 + (py - y) ** 2;
        if (visible && d < bestDistance) {
            best = entry;
            bestDistance = d;
        }
    });
    return best;
}

// Hovering a pin brightens its routes and shows its tooltip, like on the flat map
function setGlobeHover(entry) {
    if (globe.hover === entry) return;
    globe.hover = entry;
    globe.canvas.classList.toggle("is-over-pin", entry !== null && entry.pin.getAttribute("role") === "button");
    if (entry) {
        fillMapTooltip(entry.item);
        highlightRoutes(entry.item.place);
    } else {
        hideMapPlace();
    }
    // Drawing also puts the tooltip on the pin
    drawGlobe();
}
