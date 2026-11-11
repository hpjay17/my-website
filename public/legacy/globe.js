/* Globe view of the travel map: the same land, routes and pins as the flat map (js/travel-map.js),
   drawn on a canvas as a sphere you can drag to spin, with no 3D library. */

// Settings

// Degrees a second the globe turns by itself, until someone drags it
const GLOBE_AUTO_SPIN = 5;
// Share of a flick's speed left after one second
const GLOBE_FRICTION = 0.05;
// Highest a route rises off the surface, as a share of the radius (the longest flights reach it)
const GLOBE_ARC_HEIGHT = 0.12;
// Furthest the globe tilts north or south, in degrees
const GLOBE_MAX_TILT = 60;
// Where the globe faces when it first opens: [latitude, longitude]
const GLOBE_START = [28, -50];
// Closest zoom, as a multiple of the globe's normal size, and how much each + / − click zooms
const GLOBE_MAX_ZOOM = 5;
const GLOBE_ZOOM_STEP = 1.6;
// Pin radii in pixels
const GLOBE_PIN_SIZES = { trip: 2, stop: 2.4, home: 2 };
// Brightness steps the land fades through toward the edge. Each is one fill a frame; 8 looks smooth, not banded.
const GLOBE_LAND_SHADES = 8;

const globe = {
    canvas: null,
    ctx: null,
    active: false,
    visible: true,
    width: 0, // canvas size in CSS pixels
    height: 0,
    baseRadius: 0, // radius at which the whole globe fits the canvas
    radius: 0, // baseRadius times zoom
    zoom: 1,
    zoomTarget: 1, // zoom eases toward this
    zoomButtons: null,
    lat: GLOBE_START[0], // the point facing the viewer, in degrees
    lon: GLOBE_START[1],
    spinLat: 0, // degrees a second, from a flick or the arrow keys
    spinLon: 0,
    autoSpin: true,
    pressed: false,
    pointerInside: false,
    hover: null, // the pin entry under the pointer
    land: null, // Float32Array of x, y, z for every land dot
    pinVectors: null,
    pinScreen: [], // where each pin was drawn last frame: { entry, x, y, visible }
    colors: {},
    frame: 0,
    lastFrame: 0,
    plane: null,
};

function buildGlobe() {
    const canvas = createEl("canvas", "travel-map-globe");
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
        "aria-label",
        "Globe of places I've traveled. Drag or use the arrow keys to turn it; pinch, scroll while holding Command or Control, or use + and - to zoom.",
    );
    globe.canvas = canvas;
    globe.ctx = canvas.getContext("2d");
    globe.land = buildGlobeLand();
    globe.pinVectors = new Map(travelMap.pins.map((entry) => [entry, toVector(entry.item.coords)]));
    globe.plane = new Path2D(PLANE_SHAPE);
    wireGlobeMoving(canvas);

    new ResizeObserver(() => {
        resizeGlobe();
        requestGlobeFrame();
    }).observe(canvas);
    new IntersectionObserver(([entry]) => {
        globe.visible = entry.isIntersecting;
        requestGlobeFrame();
    }).observe(canvas);
    // A canvas can't use CSS variables, so re-read the colors whenever the theme changes
    new MutationObserver(() => {
        readGlobeColors();
        requestGlobeFrame();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    globe.zoomButtons = buildZoomButtons(GLOBE_ZOOM_STEP, zoomGlobeBy);
    updateGlobeZoomButtons();
    const wrap = createEl("div", "travel-map-globe-wrap");
    wrap.append(canvas, globe.zoomButtons.bar);
    travelMap.flat.after(wrap);
    // A plain scroll is left to the page (see wireWheelZoom in map-controls.js)
    globe.hint = buildMapHint(wrap);
    wireWheelZoom(canvas, globe.hint, (e) => zoomGlobeBy(wheelZoomFactor(e)));
}

// The flat map's grid has as many dots near the poles as at the equator, so on a sphere they'd bunch
// up there, and thinning the rows leaves gaps that line up into stripes. Instead, dots are spread evenly
// over the sphere along a golden-angle spiral, about as far apart as the grid's dots, and each is kept
// if the grid says it's on land.
function buildGlobeLand() {
    const { step, latTop, rows } = worldDots;
    const cols = Math.round(360 / step);
    const isLand = new Uint8Array(rows.length * cols);
    rows.forEach((row, r) => {
        row.split(" ")
            .filter(Boolean)
            .forEach((run) => {
                const [start, length] = run.split(",").map(Number);
                isLand.fill(1, r * cols + start, r * cols + start + length);
            });
    });

    const deg = 180 / Math.PI;
    // The sphere's area divided by the area of one grid cell at the equator
    const count = Math.round((4 * Math.PI) / (step / deg) ** 2);
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

// Both return true if the view changed
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

// Animation

// The loop only keeps going while something moves; anything that changes the picture asks for a frame
function requestGlobeFrame() {
    if (!globe.active || !globe.visible || globe.frame) return;
    globe.lastFrame = performance.now();
    globe.frame = requestAnimationFrame(globeFrame);
}

function globeFrame(now) {
    globe.frame = 0;
    // Cap the step so the first frame after the tab was in the background doesn't fling the globe
    const dt = Math.min((now - globe.lastFrame) / 1000, 0.1);
    globe.lastFrame = now;
    const zooming = easeGlobeZoom(dt);
    const turning = turnGlobe(dt);
    globe.lon = ((globe.lon + 540) % 360) - 180;
    drawGlobe();
    if (zooming || turning) globe.frame = requestAnimationFrame(globeFrame);
}

// Returns true until the zoom reaches its target
function easeGlobeZoom(dt) {
    if (Math.abs(globe.zoomTarget - globe.zoom) < 0.002) {
        globe.zoom = globe.zoomTarget;
    } else {
        // On a log scale, so 1x to 2x feels the same as 2x to 4x
        const ease = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt * 10);
        globe.zoom = Math.exp(Math.log(globe.zoom) + (Math.log(globe.zoomTarget) - Math.log(globe.zoom)) * ease);
    }
    globe.radius = globe.baseRadius * globe.zoom;
    return globe.zoom !== globe.zoomTarget;
}

function clampZoom(zoom) {
    return clamp(zoom, 1, GLOBE_MAX_ZOOM);
}

// Zoom by `factor` from where the zoom is heading
function zoomGlobeBy(factor) {
    globe.zoomTarget = clampZoom(globe.zoomTarget * factor);
    updateGlobeZoomButtons();
    requestGlobeFrame();
}

function updateGlobeZoomButtons() {
    globe.zoomButtons.in.disabled = globe.zoomTarget >= GLOBE_MAX_ZOOM - 1e-6;
    globe.zoomButtons.out.disabled = globe.zoomTarget <= 1 + 1e-6;
}

// Returns true while the globe is still turning
function turnGlobe(dt) {
    if (globe.pressed) return false;
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
    // The slow turn pauses while the pointer is over the globe, so pins hold still to be hovered.
    // Zoomed in, it turns slower so the land passes at the same speed on screen.
    if (globe.autoSpin && !reduced && !globe.pointerInside) {
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
    return clamp(lat, -GLOBE_MAX_TILT, GLOBE_MAX_TILT);
}

// Drawing

// This frame's rotation as a function from a point on the sphere to [screen x, screen y, depth].
// Depth above 0 faces the viewer. Points above the surface (route arcs) pass a radius above 1.
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

// Keep the tooltip on its pin as the globe turns, and drop it once the pin goes round the back
function placeGlobeTooltip(entry) {
    const spot = globe.pinScreen.find((s) => s.entry === entry);
    if (!spot.visible) {
        globe.hover = null;
        globe.canvas.classList.remove("is-over-pin");
        hideMapPlace();
        return;
    }
    const canvasBox = globe.canvas.getBoundingClientRect();
    const rootBox = travelMap.root.getBoundingClientRect();
    positionMapTooltip(canvasBox.left - rootBox.left + spot.x, canvasBox.top - rootBox.top + spot.y - 4);
}

// Land dots as tiny squares, one path per brightness, fading toward the edge so it reads as round
function drawGlobeLand(project, p) {
    const { ctx, land, width, height, colors } = globe;
    // Dots grow more slowly than the globe, so zoomed-in land stays airy instead of blocky
    const size = Math.max(1, globe.baseRadius * 0.0075 * Math.sqrt(globe.zoom));
    const half = size / 2;
    const shades = Array.from({ length: GLOBE_LAND_SHADES }, () => new Path2D());
    for (let i = 0; i < land.length; i += 3) {
        project(land[i], land[i + 1], land[i + 2], p);
        // Behind the globe, or off the canvas when zoomed in
        if (p[2] <= 0 || p[0] < -half || p[0] > width + half || p[1] < -half || p[1] > height + half) continue;
        shades[Math.min(GLOBE_LAND_SHADES - 1, Math.floor(p[2] * GLOBE_LAND_SHADES))].rect(
            p[0] - half,
            p[1] - half,
            size,
            size,
        );
    }
    ctx.fillStyle = colors.land;
    shades.forEach((path, k) => {
        // 0.15 at the edge up to 0.55 in the middle, rising quickly at first
        ctx.globalAlpha = 0.15 + 0.4 * Math.sqrt((k + 0.5) / GLOBE_LAND_SHADES);
        ctx.fill(path);
    });
    ctx.globalAlpha = 1;
}

// Height above the surface at t (0 to 1) along a route: a smooth hump, higher for longer flights
function routeLift(route, t) {
    return GLOBE_ARC_HEIGHT * Math.min(1, route.angle / 1.6) * Math.sin(Math.PI * t);
}

// The point t (0 to 1) of the way along a route's great circle, on the surface
function vectorAlong({ vectors }, t) {
    const along = t * (vectors.length - 1);
    const i = Math.min(Math.floor(along), vectors.length - 2);
    const f = along - i;
    return [0, 1, 2].map((k) => vectors[i][k] + (vectors[i + 1][k] - vectors[i][k]) * f);
}

// Project the point t of the way along a route, lifted off the surface.
// Returns false if the globe hides it (behind the sphere and inside its outline).
function projectRoutePoint(project, route, t, p) {
    const [x, y, z] = vectorAlong(route, t);
    const lift = 1 + routeLift(route, t);
    project(x * lift, y * lift, z * lift, p);
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
        // During a replay, only the part flown so far (js/replay.js keeps this on each route)
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
            if (projectRoutePoint(project, route, Math.min(i, last) / steps, p)) {
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
        // Hidden behind the globe, or while a replay hasn't reached it
        const visible = p[2] > 0.02 && !entry.pin.classList.contains("is-pending");
        globe.pinScreen.push({ entry, x: p[0], y: p[1], visible });
        if (!visible) return;

        const { classList } = entry.pin;
        const kind = classList.contains("map-pin--stop")
            ? "stop"
            : classList.contains("map-pin--home")
              ? "home"
              : "trip";
        const big = entry === globe.hover || classList.contains("is-active");
        const r = GLOBE_PIN_SIZES[kind] * (big ? 1.5 : 1);
        const color = kind === "home" ? colors.home : colors.trip;
        // Fade out toward the edge
        ctx.globalAlpha = Math.min(1, p[2] * 5);

        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        if (kind === "stop") {
            ctx.fillStyle = colors.sea;
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            return;
        }
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
    });
    ctx.globalAlpha = 1;
}

// The replay plane's [lat, lon], from the same leg and progress the flat map uses
function replayPlaneLatLon() {
    const { leg, progress } = replay.current;
    return toLatLon(vectorAlong(leg.route, leg.reverse ? 1 - progress : progress));
}

function drawGlobePlane(project) {
    if (!replay.active || !replay.current || prefersReducedMotion()) return;
    const { ctx, colors } = globe;
    const { leg, progress } = replay.current;
    const t = leg.reverse ? 1 - progress : progress;
    // A point a little further along gives the heading
    const ahead = clamp(t + (leg.reverse ? -0.01 : 0.01), 0, 1);
    const here = [0, 0, 0];
    const next = [0, 0, 0];
    if (!projectRoutePoint(project, leg.route, t, here)) return;
    projectRoutePoint(project, leg.route, ahead, next);
    // At the very end the point ahead is the same point; keep the plane level rather than spinning
    const samePoint = next[0] === here[0] && next[1] === here[1];
    const angle = samePoint ? 0 : Math.atan2(next[1] - here[1], next[0] - here[0]);

    ctx.save();
    ctx.translate(here[0], here[1]);
    ctx.rotate(angle);
    ctx.scale(1.1, 1.1);
    ctx.globalAlpha = planeOpacity(progress);
    ctx.fillStyle = colors.plane;
    ctx.shadowColor = colors.route;
    ctx.shadowBlur = 4;
    ctx.fill(globe.plane);
    ctx.restore();
}

// Pointer and keyboard

function wireGlobeMoving(canvas) {
    let start = null;
    let pinchZoom = 1;
    // Pixels to degrees, so the land stays under the pointer
    const degreesPerPixel = () => 180 / Math.PI / globe.radius;
    wireDragAndPinch(canvas, {
        onPress: () => {
            globe.pressed = true;
            globe.autoSpin = false;
            globe.spinLat = globe.spinLon = 0;
        },
        onDragStart: () => {
            start = { lat: globe.lat, lon: globe.lon };
            setGlobeHover(null);
        },
        onDrag: (dx, dy) => {
            globe.lon = start.lon - dx * degreesPerPixel();
            globe.lat = clampTilt(start.lat + dy * degreesPerPixel());
            drawGlobe();
        },
        onRelease: ({ velocity, click }) => {
            globe.pressed = false;
            if (click) {
                // A trip pin opens its card, as on the flat map
                const entry = pinAt(click);
                if (entry && entry.pin.getAttribute("role") === "button")
                    entry.pin.dispatchEvent(new MouseEvent("click"));
            } else if (velocity && !prefersReducedMotion()) {
                globe.spinLon = -velocity[0] * degreesPerPixel();
                globe.spinLat = velocity[1] * degreesPerPixel();
            }
            requestGlobeFrame();
        },
        onPinchStart: () => {
            pinchZoom = globe.zoom;
            start = { lat: globe.lat, lon: globe.lon };
            setGlobeHover(null);
        },
        // Two fingers zoom and turn the globe together, following the fingers directly with no easing
        onPinch: (factor, fx, fy, dx, dy) => {
            globe.zoom = globe.zoomTarget = clampZoom(pinchZoom * factor);
            globe.radius = globe.baseRadius * globe.zoom;
            globe.lon = start.lon - dx * degreesPerPixel();
            globe.lat = clampTilt(start.lat + dy * degreesPerPixel());
            updateGlobeZoomButtons();
            drawGlobe();
        },
    });

    canvas.addEventListener("pointermove", (e) => {
        if (!globe.pressed) setGlobeHover(pinAt(e));
    });
    canvas.addEventListener("pointerenter", () => (globe.pointerInside = true));
    canvas.addEventListener("pointerleave", () => {
        globe.pointerInside = false;
        setGlobeHover(null);
        requestGlobeFrame();
    });
    canvas.addEventListener("keydown", onGlobeKey);
}

function onGlobeKey(e) {
    const zoom = keyZoomFactor(e.key, GLOBE_ZOOM_STEP);
    const turn = { ArrowLeft: [0, -90], ArrowRight: [0, 90], ArrowUp: [60, 0], ArrowDown: [-60, 0] }[e.key];
    if (!zoom && !turn) return;
    e.preventDefault();
    if (zoom) {
        zoomGlobeBy(zoom);
        return;
    }
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

// Hovering a pin brightens its routes and shows its tooltip, as on the flat map
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
    // Drawing also places the tooltip on the pin
    drawGlobe();
}
