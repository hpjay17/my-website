/* Flat travel map on beyond.html: dot-grid land, great-circle routes, pins and stats.
   Dragging with a mouse or a finger pans round the world without end;
   pinch, ⌘/Ctrl + wheel, keys or the + / − buttons zoom. */

// Settings

// Degrees of space kept around the outermost pins in the starting view
const MAP_PADDING = { lat: 10, lon: 18 };
// Furthest north and south the map can be dragged. The dot grid covers both poles for the globe,
// but on a flat map the far north is stretched too wide to be worth showing.
const MAP_NORTH_EDGE = 80;
const MAP_SOUTH_EDGE = -60;
// Shape of the map box (width / height): the shape of the whole world between those edges, so that
// zooming all the way out shows all of it at once. Phones get a taller box.
const MAP_MAX_ASPECT = 360 / (MAP_NORTH_EDGE - MAP_SOUTH_EDGE);
const MAP_MAX_ASPECT_PHONE = 2;
// Closest zoom, as a multiple of the starting view, and how much each + / − click zooms
const MAP_MAX_ZOOM = 8;
const MAP_ZOOM_STEP = 1.6;
// How far "View on map" zooms in, and how far in the map must be before city names show
const MAP_FOCUS_ZOOM = 3;
const MAP_LABEL_ZOOM = 1.6;
// Share of a flung map's speed left after one second
const MAP_PAN_FRICTION = 0.002;
// Milliseconds for a glide to a new view, and for the hover plane to fly one route
const MAP_ZOOM_MS = 600;
const PLANE_FLIGHT_MS = 1800;

const SVG_NS = "http://www.w3.org/2000/svg";
// Map units per degree. Pin and label sizes here and in css/beyond.css are in these units.
const MAP_SCALE = 10 / 3;
const WORLD_WIDTH = 360 * MAP_SCALE;
const EARTH_RADIUS_MILES = 3959;
// Room left of the view where a pin still counts as in view, so a dot just past the edge can peek in
const MAP_EDGE_SLACK = 20;
// The map is endless, so each route path holds copies of its line a world-width apart. A line starts in
// the first world-width but can run half a world past either side, and the view can reach into the
// second, so copies run from one world-width before to two after.
const ROUTE_COPIES = [-1, 0, 1, 2];
// Each copy's share of a route path's length (pathLength is 1); dash patterns repeat at this length
const ROUTE_COPY_LENGTH = 1 / ROUTE_COPIES.length;
// The stats line counts places named "City, State" as the United States
const US_STATES = new Set([
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
]);
// Small airplane pointing right, centred on 0,0
const PLANE_SHAPE =
    "M6 0L4 -1H1.5L-2 -5.5H-3.5L-1.5 -1H-4.5L-5.5 -2.5H-6.5L-6 0L-6.5 2.5H-5.5L-4.5 1H-1.5L-3.5 5.5H-2L1.5 1H4Z";

const travelMap = {
    root: null,
    svg: null,
    flat: null, // the svg and its zoom buttons; hidden while the globe shows
    tooltip: null,
    planeLayer: null,
    home: null, // [x, y, width, height] of the starting view, which is also the furthest it zooms out
    camera: null, // [x, y, width, height] being shown; x stays within one world-width
    glideTarget: null, // where a glide is heading, while one runs
    zoom: 1, // camera width / home width; pins and lines are scaled by this to keep their size
    cameraFrame: 0,
    zoomButtons: null,
    stats: null,
    mapButton: null,
    globeButton: null,
    coordsByPlace: null,
    routes: [], // { el, key, from, to, points, lengths, vectors, angle }, one per line drawn
    totalMiles: 0, // every flight in beyondData.routes, repeats included
    pins: [], // homes, then stops, then trips, so trips draw on top
    tripPins: [], // same order as beyondData.travel; null for trips without coords
    planes: [],
    planeFrame: 0,
};

function renderTravelMap() {
    const root = document.getElementById("travel-map");
    const { home: homes, stops } = beyondData;
    const trips = beyondData.travel.filter((item) => item.coords);
    if (!trips.length) {
        root.remove();
        return;
    }

    const places = [...homes, ...stops, ...trips];
    const home = buildHomeView(places.map((item) => item.coords));
    const svg = svgEl("svg", {
        viewBox: home.join(" "),
        class: "travel-map-svg",
        role: "img",
        tabindex: "0",
        "aria-label":
            "World map of places I've traveled: " +
            trips.map((t) => t.place).join(", ") +
            ". Drag or use the arrow keys to move it; pinch, scroll while holding Command or Control, or use + and - to zoom.",
    });
    const planeLayer = svgEl("g", { class: "map-planes" });
    Object.assign(travelMap, {
        root,
        svg,
        home,
        planeLayer,
        flat: createEl("div", "travel-map-flat"),
        tooltip: createEl("div", "map-tooltip"),
    });

    // Drawn in order: land, routes, planes, then pins on top
    travelMap.routes = buildRoutes(places);
    svg.append(...drawLand(), ...travelMap.routes.map((route) => route.el), planeLayer);
    const homePins = homes.map((item) => createPin(item, "home"));
    const stopPins = stops.map((item) => createPin(item, "stop"));
    travelMap.tripPins = beyondData.travel.map((item, i) => (item.coords ? createPin(item, "trip", i) : null));
    travelMap.pins = [...homePins, ...stopPins, ...travelMap.tripPins.filter(Boolean)];
    svg.append(...travelMap.pins.map((entry) => entry.pin));

    travelMap.zoomButtons = buildZoomButtons(MAP_ZOOM_STEP, (factor) => zoomCamera(factor, 0.5, 0.5, true));
    travelMap.flat.append(svg, travelMap.zoomButtons.bar);
    root.append(buildMapHeader(), travelMap.flat, buildReplay(), travelMap.tooltip);
    setCamera(home);
    wireMapMoving(svg);
    drawRoutesOnScroll(svg);
}

// Geometry

function projectToMap([lat, lon]) {
    return [(lon + 180) * MAP_SCALE, (worldDots.latTop - lat) * MAP_SCALE];
}

// Shortest distance over the globe, which is roughly what a flight covers (haversine formula)
function distanceMiles([lat1, lon1], [lat2, lon2]) {
    const rad = Math.PI / 180;
    const a =
        Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
        Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
    return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

// Point and direction (degrees) at t (0 to 1) along a route on the flat map. t is a share of the
// line's length on the flat map, the same measure its dash uses as it draws in, so a plane flying
// along it stays at the tip of the line. (The points are evenly spaced over the globe, and the flat
// map stretches the far north, so going point by point would put the plane ahead of or behind the line.)
function pointOnRoute({ points, lengths }, t) {
    const target = clamp(t, 0, 1) * lengths[lengths.length - 1];
    // Binary search for the segment holding that distance
    let i = 0;
    let hi = lengths.length - 1;
    while (hi - i > 1) {
        const mid = (i + hi) >> 1;
        if (lengths[mid] <= target) i = mid;
        else hi = mid;
    }
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const segment = lengths[i + 1] - lengths[i];
    const f = segment > 0 ? (target - lengths[i]) / segment : 0;
    return {
        x: x1 + (x2 - x1) * f,
        y: y1 + (y2 - y1) * f,
        angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
    };
}

// [lat, lon] in degrees to a point on a globe of radius 1, and back
function toVector([lat, lon]) {
    const rad = Math.PI / 180;
    const c = Math.cos(lat * rad);
    return [c * Math.cos(lon * rad), c * Math.sin(lon * rad), Math.sin(lat * rad)];
}

function toLatLon([x, y, z]) {
    const deg = 180 / Math.PI;
    return [Math.asin(clamp(z, -1, 1)) * deg, Math.atan2(y, x) * deg];
}

// Points along the great circle from a to b (the shortest path over the globe, which long flights
// roughly follow), about one per degree and evenly spaced, plus the angle it spans in radians
function greatCircle(a, b) {
    const va = toVector(a);
    const vb = toVector(b);
    const dot = clamp(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2], -1, 1);
    const angle = Math.acos(dot);
    const steps = Math.max(8, Math.ceil((angle * 180) / Math.PI));
    const sin = Math.sin(angle);
    const vectors = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Spherical interpolation, falling back to a straight blend for two nearly identical places
        const ka = sin > 1e-9 ? Math.sin((1 - t) * angle) / sin : 1 - t;
        const kb = sin > 1e-9 ? Math.sin(t * angle) / sin : t;
        vectors.push([0, 1, 2].map((k) => va[k] * ka + vb[k] * kb));
    }
    return { angle, vectors };
}

function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
}

// Building the map

// The starting view: the world cropped to the pins, widened or heightened to an aspect between the pins'
// own and MAP_MAX_ASPECT. Zooming out from it goes as far as the whole world's width.
function buildHomeView(coords) {
    const lats = coords.map(([lat]) => lat);
    const lons = coords.map(([, lon]) => lon);
    const [x1, y1] = projectToMap([
        Math.min(Math.max(...lats) + MAP_PADDING.lat, MAP_NORTH_EDGE),
        Math.max(Math.min(...lons) - MAP_PADDING.lon, -180),
    ]);
    const [x2, y2] = projectToMap([
        Math.min(...lats) - MAP_PADDING.lat,
        Math.min(Math.max(...lons) + MAP_PADDING.lon, 180),
    ]);
    let w = x2 - x1;
    let h = y2 - y1;
    const maxAspect = window.matchMedia("(max-width: 640px)").matches ? MAP_MAX_ASPECT_PHONE : MAP_MAX_ASPECT;
    const aspect = Math.min(w / h, maxAspect);
    if (w / h < aspect) w = h * aspect;
    else h = w / aspect;
    // No taller than the map itself, from its north edge to its south
    const northY = projectToMap([MAP_NORTH_EDGE, 0])[1];
    h = Math.min(h, projectToMap([MAP_SOUTH_EDGE, 0])[1] - northY);
    const top = Math.max((y1 + y2) / 2 - h / 2, northY);
    return [(x1 + x2) / 2 - w / 2, top, w, h];
}

// Each land cell is a zero-length line with round caps, which draws as a dot. The land is defined once
// and shown twice, a world-width apart: the view starts in the first world-width and is never wider
// than one, so the two copies fill it wherever it is.
function drawLand() {
    const cell = worldDots.step * MAP_SCALE;
    const parts = [];
    worldDots.rows.forEach((row, r) => {
        const y = ((r + 0.5) * cell).toFixed(2);
        row.split(" ")
            .filter(Boolean)
            .forEach((run) => {
                const [start, length] = run.split(",").map(Number);
                for (let c = start; c < start + length; c++) {
                    parts.push(`M${((c + 0.5) * cell).toFixed(2)} ${y}h0`);
                }
            });
    });
    const defs = svgEl("defs", {});
    defs.appendChild(svgEl("path", { d: parts.join(""), id: "map-land-dots" }));
    // Stroke styles set on each copy pass down to the dots
    const copy = (x) => svgEl("use", { href: "#map-land-dots", x, class: "map-land" });
    return [defs, copy(0), copy(WORLD_WIDTH)];
}

// One line per pair of places in beyondData.routes, along the great circle between them.
// Also totals the miles of every flight listed, repeats and return legs included.
function buildRoutes(places) {
    const coordsByPlace = new Map(places.map((item) => [item.place, item.coords]));
    travelMap.coordsByPlace = coordsByPlace;
    const routes = [];
    const drawn = new Set();

    beyondData.routes.forEach((entry) => {
        // Year markers are only for the replay
        if (typeof entry === "string") return;
        const [from, to, times = 1] = entry;
        if (!coordsByPlace.has(from) || !coordsByPlace.has(to)) {
            console.warn(`Travel map route skipped, unknown place: ${from} -> ${to}`);
            return;
        }
        travelMap.totalMiles += distanceMiles(coordsByPlace.get(from), coordsByPlace.get(to)) * times;

        // A to B and B to A share one line
        const key = routeKey(from, to);
        if (drawn.has(key)) return;
        drawn.add(key);

        const { angle, vectors } = greatCircle(coordsByPlace.get(from), coordsByPlace.get(to));
        const { points, lengths } = flatRouteLine(vectors);
        const line = (dx) => "M" + points.map(([x, y]) => `${(x + dx).toFixed(2)} ${y.toFixed(2)}`).join("L");
        const el = svgEl("path", {
            d: ROUTE_COPIES.map((k) => line(k * WORLD_WIDTH)).join(""),
            class: "map-web",
            pathLength: 1,
        });
        // Routes draw in one after another when the map scrolls into view
        el.style.setProperty("--route-delay", `${routes.length * 0.2}s`);
        routes.push({ el, key, from, to, points, lengths, vectors, angle });
    });
    return routes;
}

// A great circle's points on the flat map, and the distance along the line to each one
function flatRouteLine(vectors) {
    // Keep each point within half a world of the last, so a flight over the Pacific runs
    // straight on past the map's edge instead of jumping back across it
    let lastX = null;
    const points = vectors.map((v) => {
        const [x, y] = projectToMap(toLatLon(v));
        lastX = lastX === null ? x : x + Math.round((lastX - x) / WORLD_WIDTH) * WORLD_WIDTH;
        return [lastX, y];
    });
    const lengths = [0];
    for (let i = 1; i < points.length; i++) {
        lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    }
    return { points, lengths };
}

function routeKey(from, to) {
    return [from, to].sort().join(" | ");
}

// kind is "home", "stop" or "trip"; trips also pass their index in beyondData.travel to link to their card
function createPin(item, kind, index) {
    const [x, y] = projectToMap(item.coords);
    const pin = svgEl("g", {
        class: `map-pin map-pin--${kind}`,
        transform: `translate(${x} ${y})`,
        tabindex: "0",
        "aria-label": item.date ? `${item.place}, ${item.date}` : item.place,
    });
    // The body is scaled against the zoom so the pin keeps its size on screen
    const body = svgEl("g", { class: "map-pin-body" });
    if (kind === "trip") body.appendChild(svgEl("circle", { r: 4, class: "map-pin-pulse" }));
    const label = svgEl("text", { x: 6, y: 3, class: "map-pin-label" });
    label.textContent = item.place.split(",")[0];
    body.append(svgEl("circle", { r: kind === "stop" ? 2.4 : 3.2, class: "map-pin-dot" }), label);
    pin.appendChild(body);

    // x is the pin's place in the first world-width; shownX is the copy it sits on now (see placePins)
    const entry = { pin, label, item, x, y, shownX: x, labelLeft: false, show: () => showMapPlace(entry) };
    pin.addEventListener("mouseenter", entry.show);
    pin.addEventListener("focus", entry.show);
    pin.addEventListener("mouseleave", hideMapPlace);
    pin.addEventListener("blur", hideMapPlace);

    if (kind === "trip") {
        pin.setAttribute("role", "button");
        pin.style.animationDelay = `${index * 0.35}s`;
        pin.addEventListener("click", () => {
            highlightTravelCard(index);
            document.getElementById(`travel-card-${index}`).scrollIntoView({ behavior: "smooth", block: "center" });
        });
        pin.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pin.dispatchEvent(new MouseEvent("click"));
            }
        });
    }
    return entry;
}

function buildMapHeader() {
    travelMap.mapButton = createButton("gallery-filter-btn active", "Map", showFlatMap);
    travelMap.globeButton = createButton("gallery-filter-btn", "Globe", showGlobe);
    const controls = createEl("div", "travel-map-views");
    controls.append(travelMap.mapButton, travelMap.globeButton);
    travelMap.stats = createEl("p", "travel-map-stats", travelStatsText());

    const header = createEl("div", "travel-map-header");
    header.append(controls, travelMap.stats);
    return header;
}

// e.g. "20 places · 8 countries · 101,100 miles flown". A place's country is the text after its last comma.
function travelStatsText() {
    const places = [...beyondData.home, ...beyondData.stops, ...beyondData.travel].map((item) => item.place);
    const placeCount = beyondData.travel.length + beyondData.stops.length;
    return formatTravelStats(placeCount, countryCount(places), travelMap.totalMiles);
}

function countryCount(places) {
    const countries = places.map((place) => {
        const last = place.split(",").pop().trim();
        return US_STATES.has(last) ? "United States" : last;
    });
    return new Set(countries).size;
}

function formatTravelStats(placeCount, countries, miles) {
    return [
        `${placeCount} ${placeCount === 1 ? "place" : "places"}`,
        `${countries} ${countries === 1 ? "country" : "countries"}`,
        `${(Math.round(miles / 100) * 100).toLocaleString()} miles flown`,
    ].join(" · ");
}

// Hovering a pin

function showMapPlace({ pin, item }) {
    // The replay shows only part of the map, so hovering is off until it's done
    if (replay.active) return;
    fillMapTooltip(item);
    // Measure the dot alone: the whole pin also includes its label and pulse ring
    const dot = pin.querySelector(".map-pin-dot").getBoundingClientRect();
    const rootBox = travelMap.root.getBoundingClientRect();
    positionMapTooltip(dot.left + dot.width / 2 - rootBox.left, dot.top - rootBox.top);
    highlightRoutes(item.place);
    flyPlanes(item.place);
}

function hideMapPlace() {
    travelMap.tooltip.classList.remove("is-visible");
    highlightRoutes(null);
    stopPlanes();
}

function fillMapTooltip(item) {
    const { tooltip } = travelMap;
    tooltip.textContent = "";
    if (item.image) {
        const photo = createEl("img", "map-tooltip-photo");
        photo.src = item.image;
        photo.alt = "";
        tooltip.appendChild(photo);
    }
    tooltip.appendChild(createEl("strong", "", item.place));
    if (item.date) tooltip.appendChild(createEl("span", "", item.date));
}

// Show the tooltip above a point, in pixels from the map's top-left corner
function positionMapTooltip(left, top) {
    const { tooltip } = travelMap;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add("is-visible");
}

function routeTouches(route, place) {
    return route.from === place || route.to === place;
}

// Brighten routes touching `place` and fade the rest; null resets them
function highlightRoutes(place) {
    travelMap.svg.classList.toggle("is-focusing", place !== null);
    travelMap.routes.forEach((route) => {
        route.el.classList.toggle("is-highlighted", place !== null && routeTouches(route, place));
    });
    requestGlobeFrame();
}

// Loop a small plane along each route touching `place`, in the direction the route is listed
function flyPlanes(place) {
    stopPlanes();
    if (prefersReducedMotion()) return;

    travelMap.planes = travelMap.routes
        .filter((route) => routeTouches(route, place))
        .map((route) => {
            const el = svgEl("path", { d: PLANE_SHAPE, class: "map-plane" });
            travelMap.planeLayer.appendChild(el);
            return { el, route };
        });
    if (!travelMap.planes.length) return;

    const start = performance.now();
    const step = (now) => {
        const t = ((now - start) % PLANE_FLIGHT_MS) / PLANE_FLIGHT_MS;
        travelMap.planes.forEach(({ el, route }) => placePlane(el, pointOnRoute(route, t), 0, t));
        travelMap.planeFrame = requestAnimationFrame(step);
    };
    travelMap.planeFrame = requestAnimationFrame(step);
}

// Put a plane at a point from pointOnRoute, turned a further `turn` degrees, `progress` (0 to 1) into its flight
function placePlane(el, { x, y, angle }, turn, progress) {
    el.setAttribute("transform", `translate(${wrapToView(x)} ${y}) rotate(${angle + turn}) scale(${travelMap.zoom})`);
    el.style.opacity = planeOpacity(progress);
}

// Planes fade in at takeoff and out at landing; t runs from 0 to 1 over the flight
function planeOpacity(t) {
    return Math.min(1, t * 8, (1 - t) * 8);
}

function stopPlanes() {
    cancelAnimationFrame(travelMap.planeFrame);
    travelMap.planes.forEach(({ el }) => el.remove());
    travelMap.planes = [];
}

// Back to the flat map from the globe; returns true if the globe was showing
function showFlatMap() {
    const leftGlobe = hideGlobe();
    travelMap.mapButton.classList.add("active");
    return leftGlobe;
}

// Moving the flat map

// Show `camera` = [x, y, width, height] in map units, kept within the zoom limits and the map's top and
// bottom. x wraps to stay within one world-width; the land and routes are drawn more than once side by
// side and pins hop to whichever copy is in view, so panning never reaches an edge.
function setCamera([x, y, w, h]) {
    const { svg, home } = travelMap;
    w = clamp(w, home[2] / MAP_MAX_ZOOM, WORLD_WIDTH);
    h = (w * home[3]) / home[2];
    const top = projectToMap([MAP_NORTH_EDGE, 0])[1];
    const bottom = projectToMap([MAP_SOUTH_EDGE, 0])[1];
    y = Math.min(Math.max(y, top), Math.max(top, bottom - h));
    x = ((x % WORLD_WIDTH) + WORLD_WIDTH) % WORLD_WIDTH;
    travelMap.camera = [x, y, w, h];
    travelMap.zoom = w / home[2];
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    svg.style.setProperty("--map-zoom", travelMap.zoom.toFixed(4));
    // Land dots grow with the square root of the zoom, so 8x in they look under 3x bigger
    svg.style.setProperty("--map-dot", Math.sqrt(travelMap.zoom).toFixed(4));
    svg.classList.toggle("is-zoomed", 1 / travelMap.zoom >= MAP_LABEL_ZOOM);
    placePins();
    updateMapZoomButtons();
}

// The copy of map x (in any world-width) that's in view, or would be if it were
function wrapToView(x) {
    const left = travelMap.camera[0] - MAP_EDGE_SLACK;
    return x + Math.ceil((left - x) / WORLD_WIDTH) * WORLD_WIDTH;
}

// Put each pin on the copy of the world in view. Labels sit right of their pin,
// or left of it near the right edge so they aren't cut off.
function placePins() {
    const [x, , w] = travelMap.camera;
    travelMap.pins.forEach((entry) => {
        const shownX = wrapToView(entry.x);
        if (shownX !== entry.shownX) {
            entry.shownX = shownX;
            entry.pin.setAttribute("transform", `translate(${shownX} ${entry.y})`);
        }
        const labelLeft = shownX > x + w * 0.85;
        if (labelLeft !== entry.labelLeft) {
            entry.labelLeft = labelLeft;
            entry.label.setAttribute("x", labelLeft ? -6 : 6);
            entry.label.setAttribute("text-anchor", labelLeft ? "end" : "start");
        }
    });
}

function stopCameraMotion() {
    cancelAnimationFrame(travelMap.cameraFrame);
    travelMap.cameraFrame = 0;
    travelMap.glideTarget = null;
}

// Glide to `to`, panning whichever way round the world is shorter
function glideCamera(to, duration = MAP_ZOOM_MS) {
    stopCameraMotion();
    hideMapPlace();
    const from = [...travelMap.camera];
    const half = WORLD_WIDTH / 2;
    const dx = ((((to[0] - from[0]) % WORLD_WIDTH) + WORLD_WIDTH + half) % WORLD_WIDTH) - half;
    const target = [from[0] + dx, to[1], to[2], to[3]];
    if (prefersReducedMotion() || !duration) {
        setCamera(target);
        return;
    }
    travelMap.glideTarget = target;
    updateMapZoomButtons();
    const start = performance.now();
    const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setCamera(from.map((f, k) => f + (target[k] - f) * ease));
        if (t < 1) {
            travelMap.cameraFrame = requestAnimationFrame(step);
        } else {
            travelMap.cameraFrame = 0;
            travelMap.glideTarget = null;
        }
    };
    travelMap.cameraFrame = requestAnimationFrame(step);
}

// Zoom by `factor` (above 1 zooms in), keeping the point at fractions (fx, fy) across the map in place
// on screen. `from` is the view to zoom from: a pinch zooms from where it started, the buttons from
// where a running glide is heading.
function zoomCamera(factor, fx, fy, glide = false, from = travelMap.glideTarget || travelMap.camera) {
    const [x, y, w, h] = from;
    const { home } = travelMap;
    const nextW = clamp(w / factor, home[2] / MAP_MAX_ZOOM, WORLD_WIDTH);
    if (Math.abs(nextW - w) < 1e-6) return;
    const nextH = (nextW * h) / w;
    const next = [x + (w - nextW) * fx, y + (h - nextH) * fy, nextW, nextH];
    if (glide) {
        glideCamera(next, MAP_ZOOM_MS / 2);
    } else {
        stopCameraMotion();
        hideMapPlace();
        setCamera(next);
    }
}

// After a flick, keep sliding at `vx`, `vy` map units a second and slow down
function coastCamera(vx, vy) {
    stopCameraMotion();
    if (prefersReducedMotion()) return;
    let last = performance.now();
    const step = (now) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        const [x, y, w, h] = travelMap.camera;
        setCamera([x + vx * dt, y + vy * dt, w, h]);
        const keep = Math.pow(MAP_PAN_FRICTION, dt);
        vx *= keep;
        vy *= keep;
        // Stop once it's creeping along at under 10 screen pixels a second
        const pixelsPerSecond = Math.hypot(vx, vy) * (travelMap.svg.clientWidth / w);
        travelMap.cameraFrame = pixelsPerSecond > 10 ? requestAnimationFrame(step) : 0;
    };
    travelMap.cameraFrame = requestAnimationFrame(step);
}

function updateMapZoomButtons() {
    const { zoomButtons, home } = travelMap;
    const w = (travelMap.glideTarget || travelMap.camera)[2];
    zoomButtons.in.disabled = w <= home[2] / MAP_MAX_ZOOM + 1e-6;
    zoomButtons.out.disabled = w >= WORLD_WIDTH - 1e-6;
}

function wireMapMoving(svg) {
    let start = null;
    const hint = buildMapHint(travelMap.flat);
    const scale = () => travelMap.camera[2] / svg.clientWidth;
    wireDragAndPinch(svg, {
        onPress: stopCameraMotion,
        onDragStart: () => {
            start = [...travelMap.camera];
            hideMapPlace();
        },
        onDrag: (dx, dy) => {
            const [x, y, w, h] = start;
            setCamera([x - dx * scale(), y - dy * scale(), w, h]);
        },
        onRelease: ({ velocity }) => {
            if (velocity) coastCamera(-velocity[0] * scale(), -velocity[1] * scale());
        },
        onPinchStart: () => {
            start = [...travelMap.camera];
            stopCameraMotion();
            hideMapPlace();
        },
        // Two fingers zoom about the point between them and carry the map along as they move
        onPinch: (factor, fx, fy, dx, dy) => {
            const [x, y, w, h] = start;
            const nextW = clamp(w / factor, travelMap.home[2] / MAP_MAX_ZOOM, WORLD_WIDTH);
            const nextH = (nextW * h) / w;
            const unitsPerPixel = nextW / svg.clientWidth;
            setCamera([
                x + (w - nextW) * fx - dx * unitsPerPixel,
                y + (h - nextH) * fy - dy * unitsPerPixel,
                nextW,
                nextH,
            ]);
        },
    });

    // Zooms toward the cursor; a plain scroll is left to the page (see wireWheelZoom)
    wireWheelZoom(svg, hint, (e) => {
        const box = svg.getBoundingClientRect();
        const fx = (e.clientX - box.left) / box.width;
        const fy = (e.clientY - box.top) / box.height;
        zoomCamera(wheelZoomFactor(e), fx, fy, false, travelMap.camera);
    });

    svg.addEventListener("keydown", (e) => {
        const zoom = keyZoomFactor(e.key, MAP_ZOOM_STEP);
        const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!zoom && !move) return;
        e.preventDefault();
        if (zoom) {
            zoomCamera(zoom, 0.5, 0.5, true);
            return;
        }
        const [x, y, w, h] = travelMap.glideTarget || travelMap.camera;
        glideCamera([x + move[0] * w * 0.25, y + move[1] * h * 0.25, w, h], MAP_ZOOM_MS / 2);
    });
}

// From a trip card's "View on map": scroll up, glide to the pin and zoom in, then show its tooltip
function focusTravelPin(index) {
    const entry = travelMap.tripPins[index];
    stopReplay();
    travelMap.root.scrollIntoView({ behavior: "smooth", block: "center" });
    travelMap.tripPins.forEach((p) => p && p.pin.classList.toggle("is-active", p === entry));
    highlightTravelCard(index);
    showFlatMap();
    const w = travelMap.home[2] / MAP_FOCUS_ZOOM;
    const h = travelMap.home[3] / MAP_FOCUS_ZOOM;
    glideCamera([entry.x - w / 2, entry.y - h / 2, w, h]);
    setTimeout(entry.show, prefersReducedMotion() ? 400 : MAP_ZOOM_MS + 100);
}

// Draw the routes in each time the map comes into view, and clear them once it's fully off screen
function drawRoutesOnScroll(svg) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio >= 0.4) entry.target.classList.add("is-drawn");
                else if (!entry.isIntersecting) entry.target.classList.remove("is-drawn");
            });
        },
        { threshold: [0, 0.4] },
    );
    observer.observe(svg);
}
