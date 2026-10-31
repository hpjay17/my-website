function init() {
    renderInterests();
    renderAviation();
    renderTravel();
    renderTravelMap();
    renderGallery();
    wireSmoothScrollButtons();
    revealSectionsOnScroll();
}

function renderInterests() {
    const root = document.getElementById("interests-grid");

    beyondData.interests.forEach((item) => {
        const card = document.createElement("div");
        card.className = "interest-card" + (item.icon ? "" : " interest-card--no-icon");

        if (item.icon) {
            const iconEl = document.createElement("img");
            iconEl.className = "interest-icon";
            iconEl.src = item.icon;
            iconEl.alt = item.name;
            iconEl.loading = "lazy";
            card.appendChild(iconEl);
        }

        const nameEl = document.createElement("h3");
        nameEl.className = "interest-name";
        nameEl.textContent = item.name;

        const noteEl = document.createElement("p");
        noteEl.className = "interest-note";
        noteEl.textContent = item.note;

        card.append(nameEl, noteEl);

        if (item.link) {
            const linkEl = document.createElement("a");
            linkEl.className = "interest-link";
            linkEl.href = item.link;
            linkEl.target = "_blank";
            linkEl.rel = "noopener noreferrer";
            linkEl.textContent = "Learn more";
            card.appendChild(linkEl);
        }

        root.appendChild(card);
    });
}

function renderAviation() {
    const root = document.getElementById("aviation-content");
    const data = beyondData.aviation;

    const intro = document.createElement("div");
    intro.className = "aviation-intro";

    const badge = document.createElement("span");
    badge.className = "aviation-badge";
    badge.textContent = data.license;

    const headline = document.createElement("h3");
    headline.textContent = data.headline;

    const summary = document.createElement("p");
    summary.className = "aviation-summary";
    summary.textContent = data.summary;

    intro.append(badge, headline, summary);

    // Text goes in the left column, photos in the right column (stacked on small screens)
    const info = document.createElement("div");
    info.className = "aviation-info";
    info.appendChild(intro);
    root.appendChild(info);

    if (data.logbook.length) {
        const stats = document.createElement("div");
        stats.className = "aviation-stats";
        data.logbook.forEach((stat) => {
            const tile = document.createElement("div");
            tile.className = "aviation-stat";

            const value = document.createElement("span");
            value.className = "aviation-stat-value";
            value.textContent = typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value;

            const label = document.createElement("span");
            label.className = "aviation-stat-label";
            label.textContent = stat.label;

            tile.append(value, label);
            stats.appendChild(tile);
        });
        info.appendChild(stats);
    }

    if (data.aircraftFlown.length) {
        const aircraftSection = document.createElement("div");
        aircraftSection.className = "aviation-subsection";

        const aircraftHeading = document.createElement("h4");
        aircraftHeading.textContent = "Aircraft Flown";
        aircraftSection.appendChild(aircraftHeading);

        const row = document.createElement("div");
        row.className = "stack-row";
        data.aircraftFlown.forEach((ac) => {
            const pill = document.createElement("span");
            pill.className = "stack-pill";
            pill.textContent = ac.name;
            pill.title = ac.note;
            row.appendChild(pill);
        });
        aircraftSection.appendChild(row);
        info.appendChild(aircraftSection);
    }

    if (data.milestones.length) {
        const timelineSection = document.createElement("div");
        timelineSection.className = "aviation-subsection";

        const timelineHeading = document.createElement("h4");
        timelineHeading.textContent = "Milestones";
        timelineSection.appendChild(timelineHeading);

        const timeline = document.createElement("div");
        timeline.className = "aviation-timeline";
        data.milestones.forEach((ms) => {
            const entry = document.createElement("div");
            entry.className = "timeline-entry";

            const dot = document.createElement("span");
            dot.className = "timeline-dot";

            const label = document.createElement("span");
            label.className = "timeline-label";
            label.textContent = ms.label;

            const date = document.createElement("span");
            date.className = "timeline-date";
            date.textContent = ms.date;

            const desc = document.createElement("p");
            desc.className = "timeline-desc";
            desc.textContent = ms.description;

            entry.append(dot, label, date, desc);
            timeline.appendChild(entry);
        });
        timelineSection.appendChild(timeline);
        info.appendChild(timelineSection);
    }

    if (data.goals.length) {
        const goalsSection = document.createElement("div");
        goalsSection.className = "aviation-subsection";

        const goalsHeading = document.createElement("h4");
        goalsHeading.textContent = "Aviation Goals";
        goalsSection.appendChild(goalsHeading);

        const goalsList = document.createElement("ul");
        goalsList.className = "highlight-list";
        data.goals.forEach((g) => {
            const li = document.createElement("li");
            li.textContent = g;
            goalsList.appendChild(li);
        });
        goalsSection.appendChild(goalsList);
        info.appendChild(goalsSection);
    }

    if (data.photos.length) {
        const photosSection = document.createElement("div");
        photosSection.className = "aviation-photos";
        data.photos.forEach((photo, i) => {
            const wrap = document.createElement("div");
            wrap.className = "aviation-photo-wrap";
            wrap.addEventListener("click", () => openLightbox(data.photos, i));

            const img = document.createElement("img");
            img.src = photo.src;
            img.alt = photo.alt;
            img.loading = "lazy";

            wrap.appendChild(img);
            photosSection.appendChild(wrap);
        });
        root.appendChild(photosSection);
    }
}

function renderTravel() {
    const root = document.getElementById("travel-grid");

    if (!beyondData.travel.length) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "Travel photos coming soon.";
        root.appendChild(empty);
        return;
    }

    // The lightbox only steps through trips that have a photo
    const withPhotos = beyondData.travel.filter((item) => item.image);
    const travelPhotos = withPhotos.map((item) => ({
        src: item.image,
        alt: `${item.place} — ${item.date}`,
    }));

    beyondData.travel.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = item.image ? "travel-card" : "travel-card travel-card--no-image";
        card.id = `travel-card-${i}`;

        if (item.image) {
            const imgWrap = document.createElement("div");
            imgWrap.className = "travel-image-wrap";
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.place;
            img.loading = "lazy";
            imgWrap.appendChild(img);
            imgWrap.addEventListener("click", () => openLightbox(travelPhotos, withPhotos.indexOf(item)));
            card.appendChild(imgWrap);
        }

        const info = document.createElement("div");
        info.className = "travel-info";

        const place = document.createElement("h3");
        place.textContent = item.place;

        const date = document.createElement("span");
        date.className = "travel-date";
        date.textContent = item.date;

        const note = document.createElement("p");
        note.textContent = item.note;

        info.append(place, date, note);

        if (item.coords) {
            const mapBtn = document.createElement("button");
            mapBtn.type = "button";
            mapBtn.className = "travel-map-btn";
            mapBtn.textContent = "View on map";
            mapBtn.addEventListener("click", () => focusTravelPin(i));
            info.appendChild(mapBtn);
        }

        card.appendChild(info);
        root.appendChild(card);
    });
}

function highlightTravelCard(index) {
    document.querySelectorAll(".travel-card").forEach((card) =>
        card.classList.toggle("is-highlighted", card.id === `travel-card-${index}`)
    );
}

/* Travel map settings: safe to tweak */

// Degrees of space kept around the outermost pins
const MAP_PADDING = { lat: 10, lon: 18 };
// Widest the map gets (width / height) before it adds space above and below
const MAP_MAX_ASPECT = 3;
// The flat map never shows further north than this latitude. The dot grid covers the whole
// globe (for the globe view), but the far north is stretched so wide on a flat map that it's left off.
const MAP_NORTH_EDGE = 80;
// ...and can't be dragged further south than this one
const MAP_SOUTH_EDGE = -60;
// Closest zoom, as a multiple of the starting view, and how much each + / − click zooms
const MAP_MAX_ZOOM = 8;
const MAP_ZOOM_STEP = 1.6;
// How far in a trip card's "View on map" zooms, and how zoomed in the map must be before city names show
const MAP_FOCUS_ZOOM = 3;
const MAP_LABEL_ZOOM = 1.6;
// How quickly a flung map slows down: the share of its speed left after one second
const MAP_PAN_FRICTION = 0.002;
// How long the map takes to glide to a new view, and how long the plane takes to fly one route, in milliseconds
const MAP_ZOOM_MS = 600;
const PLANE_FLIGHT_MS = 1800;
// How long the replay button takes to fly every trip, in milliseconds. Longer flights take longer.
const REPLAY_MS = 24000;

/* Travel map internals */

const SVG_NS = "http://www.w3.org/2000/svg";
// Map units per degree. Pin and label sizes in this file and css/styles.css are in these units.
const MAP_SCALE = 10 / 3;
// The whole world (360 degrees) in map units
const WORLD_WIDTH = 360 * MAP_SCALE;
const EARTH_RADIUS_MILES = 3959;
// The stats line counts places named "City, State" as the United States
const US_STATES = new Set([
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
]);
// Small airplane pointing right, centred on 0,0
const PLANE_SHAPE =
    "M6 0L4 -1H1.5L-2 -5.5H-3.5L-1.5 -1H-4.5L-5.5 -2.5H-6.5L-6 0L-6.5 2.5H-5.5L-4.5 1H-1.5L-3.5 5.5H-2L1.5 1H4Z";

// Shared state, filled in by renderTravelMap
const travelMap = {
    root: null,
    svg: null,
    tooltip: null,
    planeLayer: null,
    flat: null,     // the flat map's box: the svg and its zoom buttons
    home: null,     // [x, y, width, height]: the starting view, cropped to the pins. Also the furthest it zooms out.
    camera: null,   // [x, y, width, height] being shown, in map units; x stays within one world-width
    glideTarget: null,  // where a glide is heading, while one runs
    zoom: 1,        // camera width / home width; pins and lines are scaled by this
    cameraFrame: 0,
    zoomButtons: null,
    coordsByPlace: null,
    stats: null,    // the stats line in the header
    mapButton: null,
    globeButton: null,
    routes: [],     // { el, key, from, to, points, lengths, vectors, angle }, one per line drawn
    totalMiles: 0,  // every flight in beyondData.routes, repeats included
    pins: [],       // home pins, then stops, then trips (later ones draw on top)
    tripPins: [],   // same order as beyondData.travel; null for trips without coords
    planes: [],
    planeFrame: 0,
};

function renderTravelMap() {
    const root = document.getElementById("travel-map");
    const homes = beyondData.home;
    const stops = beyondData.stops;
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
            ". Drag or use the arrow keys to move it; scroll, pinch, or use + and - to zoom.",
    });
    const tooltip = document.createElement("div");
    tooltip.className = "map-tooltip";
    const planeLayer = svgEl("g", { class: "map-planes" });
    const flat = document.createElement("div");
    flat.className = "travel-map-flat";
    Object.assign(travelMap, { root, svg, tooltip, planeLayer, flat, home });

    // Drawn in order: land, then routes, then planes, then pins on top
    travelMap.routes = buildRoutes(places);
    svg.append(...drawLand(), ...travelMap.routes.map((route) => route.el), planeLayer);

    const homePins = homes.map((item) => createPin(item, "home"));
    const stopPins = stops.map((item) => createPin(item, "stop"));
    travelMap.tripPins = beyondData.travel.map((item, i) => (item.coords ? createPin(item, "trip", i) : null));
    travelMap.pins = [...homePins, ...stopPins, ...travelMap.tripPins.filter(Boolean)];
    svg.append(...travelMap.pins.map((entry) => entry.pin));

    travelMap.zoomButtons = buildZoomButtons(MAP_ZOOM_STEP, (factor) => zoomCamera(factor, 0.5, 0.5, true));
    flat.append(svg, travelMap.zoomButtons.bar);
    root.append(buildMapHeader(), flat, buildReplay(), tooltip);
    setCamera(home);
    wireMapMoving(svg);
    drawRoutesOnScroll(svg);
}

/* Geometry */

function projectToMap([lat, lon]) {
    return [(lon + 180) * MAP_SCALE, (worldDots.latTop - lat) * MAP_SCALE];
}

// Viewbox [x, y, width, height] for a [north, west, south, east] box
function boundsToBox([north, west, south, east]) {
    const [x1, y1] = projectToMap([north, west]);
    const [x2, y2] = projectToMap([south, east]);
    return [x1, y1, x2 - x1, y2 - y1];
}

// Grow a box to match `aspect` (width / height) around its centre, so zooming never changes the map's height
function fitAspect([x, y, w, h], aspect) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    if (w / h < aspect) w = h * aspect;
    else h = w / aspect;
    return [cx - w / 2, cy - h / 2, w, h];
}

// Shortest distance over the globe, which is roughly what a flight covers (haversine formula)
function distanceMiles([lat1, lon1], [lat2, lon2]) {
    const rad = Math.PI / 180;
    const a =
        Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
        Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
    return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

// Point and direction (degrees) at t (0 to 1) along a route's line on the flat map.
// t is a share of the line's length as drawn on the flat map, the same measure the line's dash uses
// as it draws in, so a plane flying along it stays right at the tip of the line. (The points are evenly
// spaced over the globe, not on the flat map, where the far north is stretched: going point by point
// would let the plane run ahead of or behind the line.)
function pointOnRoute({ points, lengths }, t) {
    const target = Math.min(Math.max(t, 0), 1) * lengths[lengths.length - 1];
    // The segment holding that distance: lengths[i] is the distance from the start to points[i]
    let lo = 0;
    let hi = lengths.length - 1;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (lengths[mid] <= target) lo = mid;
        else hi = mid;
    }
    const i = lo;
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
    return [Math.asin(Math.min(Math.max(z, -1), 1)) * deg, Math.atan2(y, x) * deg];
}

// The great circle from a to b: the shortest path over the globe, which long flights roughly follow.
// Returns the angle it spans (radians) and points along it, about one per degree.
// Points are evenly spaced, so the nth point is n/(count-1) of the way along.
function greatCircle(a, b) {
    const va = toVector(a);
    const vb = toVector(b);
    const dot = Math.min(Math.max(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2], -1), 1);
    const angle = Math.acos(dot);
    const steps = Math.max(8, Math.ceil((angle * 180) / Math.PI));
    const sin = Math.sin(angle);
    const vectors = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Spherical interpolation; for two nearly identical places, fall back to the start point
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

/* Building the map */

// The starting view: the world cropped to the pins
function buildHomeView(coords) {
    const lats = coords.map(([lat]) => lat);
    const lons = coords.map(([, lon]) => lon);
    const pinBox = boundsToBox([
        Math.min(Math.max(...lats) + MAP_PADDING.lat, MAP_NORTH_EDGE),
        Math.max(Math.min(...lons) - MAP_PADDING.lon, -180),
        Math.min(...lats) - MAP_PADDING.lat,
        Math.min(Math.max(...lons) + MAP_PADDING.lon, 180),
    ]);
    // Pins spread far east-west would make a thin strip, so add room above and below instead
    const aspect = Math.min(pinBox[2] / pinBox[3], MAP_MAX_ASPECT);
    const worldBox = fitAspect(pinBox, aspect);
    worldBox[1] = Math.max(worldBox[1], projectToMap([MAP_NORTH_EDGE, 0])[1]);
    return worldBox;
}

// Every land cell becomes a zero-length line with round caps, which draws as a dot.
// The land is defined once and shown twice, a world-width apart: the view always starts within the
// first world-width and is never wider than one, so between them the two copies fill it wherever it is.
function drawLand() {
    const cell = worldDots.step * MAP_SCALE;
    const parts = [];
    worldDots.rows.forEach((row, r) => {
        const y = ((r + 0.5) * cell).toFixed(2);
        row.split(" ").filter(Boolean).forEach((run) => {
            const [start, length] = run.split(",").map(Number);
            for (let c = start; c < start + length; c++) {
                parts.push(`M${((c + 0.5) * cell).toFixed(2)} ${y}h0`);
            }
        });
    });
    const land = svgEl("path", { d: parts.join(""), id: "map-land-dots" });
    const defs = svgEl("defs", {});
    defs.appendChild(land);
    // The copies take their look from the class on each copy (stroke, width and caps pass down to the dots)
    const copy = (x) => svgEl("use", { href: "#map-land-dots", x, class: "map-land" });
    return [defs, copy(0), copy(WORLD_WIDTH)];
}

// Each route line is drawn this many world-widths over, so the endless flat map always has it in view.
// A line starts within the first world-width but can run up to half a world past either side of it,
// and the view can reach into the second world-width, so it takes copies from one before to two after.
const ROUTE_COPIES = [-1, 0, 1, 2];
// Each copy's share of the path's length (its pathLength is 1); dash patterns repeat at this length
const ROUTE_COPY_LENGTH = 1 / ROUTE_COPIES.length;

// One line per pair of places in beyondData.routes, following the great circle between them.
// Also totals the miles of every flight listed, repeats and return legs included.
function buildRoutes(places) {
    const coordsByPlace = new Map(places.map((item) => [item.place, item.coords]));
    travelMap.coordsByPlace = coordsByPlace;
    const routes = [];
    const drawn = new Set();
    travelMap.totalMiles = 0;

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
        const pairKey = routeKey(from, to);
        if (drawn.has(pairKey)) return;
        drawn.add(pairKey);

        const { angle, vectors } = greatCircle(coordsByPlace.get(from), coordsByPlace.get(to));
        // On the flat map, keep each point within half a world of the last, so a flight over the
        // Pacific runs straight on instead of jumping across the whole map.
        let lastX = null;
        const points = vectors.map((v) => {
            const [x, y] = projectToMap(toLatLon(v));
            let unwrapped = x;
            if (lastX !== null) unwrapped += Math.round((lastX - x) / WORLD_WIDTH) * WORLD_WIDTH;
            lastX = unwrapped;
            return [unwrapped, y];
        });
        // Distance along the line on the flat map up to each point, for pointOnRoute
        const lengths = [0];
        for (let i = 1; i < points.length; i++) {
            lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
        }
        const line = (dx) => "M" + points.map(([x, y]) => `${(x + dx).toFixed(2)} ${y.toFixed(2)}`).join("L");

        const el = svgEl("path", {
            d: ROUTE_COPIES.map((k) => line(k * WORLD_WIDTH)).join(""),
            class: "map-web",
            pathLength: 1,
        });
        // Each route draws itself in turn when the map scrolls into view
        el.style.setProperty("--route-delay", `${routes.length * 0.2}s`);

        routes.push({ el, key: pairKey, from, to, points, lengths, vectors, angle });
    });
    return routes;
}

function routeKey(from, to) {
    return [from, to].sort().join(" | ");
}

// A pin of kind "home", "stop" or "trip". Trips also pass their index in beyondData.travel, to link to their card.
function createPin(item, kind, index) {
    const isTrip = kind === "trip";
    const [x, y] = projectToMap(item.coords);

    const pin = svgEl("g", {
        class: `map-pin map-pin--${kind}`,
        transform: `translate(${x} ${y})`,
        tabindex: "0",
        "aria-label": item.date ? `${item.place}, ${item.date}` : item.place,
    });
    // Everything inside `body` is scaled against the zoom so it stays the same size on screen
    const body = svgEl("g", { class: "map-pin-body" });
    if (isTrip) body.appendChild(svgEl("circle", { r: 4, class: "map-pin-pulse" }));
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

    if (isTrip) {
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

// Map and Globe buttons on the left, stats on the right
function buildMapHeader() {
    const header = document.createElement("div");
    header.className = "travel-map-header";

    const controls = document.createElement("div");
    controls.className = "travel-map-views";
    const makeButton = (text, onClick) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-filter-btn";
        btn.textContent = text;
        btn.addEventListener("click", onClick);
        controls.appendChild(btn);
        return btn;
    };
    travelMap.mapButton = makeButton("Map", showFlatMap);
    travelMap.mapButton.classList.add("active");
    // The globe lives in js/globe.js
    travelMap.globeButton = makeButton("Globe", showGlobe);

    const stats = document.createElement("p");
    stats.className = "travel-map-stats";
    stats.textContent = travelStatsText();
    travelMap.stats = stats;

    header.append(controls, stats);
    return header;
}

// e.g. "10 places · 7 countries · 52,300 miles flown".
// Countries come from the text after the last comma in each place; miles from every flight in routes.
function travelStatsText() {
    const places = [...beyondData.home, ...beyondData.stops, ...beyondData.travel].map((item) => item.place);
    const placeCount = beyondData.travel.length + beyondData.stops.length;
    return formatTravelStats(placeCount, countryCount(places), travelMap.totalMiles);
}

function countryCount(places) {
    const countries = new Set(
        places.map((place) => {
            const last = place.split(",").pop().trim();
            return US_STATES.has(last) ? "United States" : last;
        })
    );
    return countries.size;
}

function formatTravelStats(placeCount, countries, miles) {
    return [
        `${placeCount} ${placeCount === 1 ? "place" : "places"}`,
        `${countries} ${countries === 1 ? "country" : "countries"}`,
        `${(Math.round(miles / 100) * 100).toLocaleString()} miles flown`,
    ].join(" · ");
}

/* Interaction */

function showMapPlace({ pin, item }) {
    // The replay shows only part of the map, so hovering pins is off until it's done
    if (replay.active) return;
    showMapTooltip(pin, item);
    highlightRoutes(item.place);
    flyPlanes(item.place);
}

function hideMapPlace() {
    travelMap.tooltip.classList.remove("is-visible");
    highlightRoutes(null);
    stopPlanes();
}

function showMapTooltip(pin, item) {
    fillMapTooltip(item);
    // Measure the dot alone: the whole pin also includes its label and pulse ring
    const pinBox = pin.querySelector(".map-pin-dot").getBoundingClientRect();
    const rootBox = travelMap.root.getBoundingClientRect();
    positionMapTooltip(pinBox.left + pinBox.width / 2 - rootBox.left, pinBox.top - rootBox.top);
}

function fillMapTooltip(item) {
    const { tooltip } = travelMap;
    tooltip.textContent = "";
    if (item.image) {
        const photo = document.createElement("img");
        photo.src = item.image;
        photo.alt = "";
        photo.className = "map-tooltip-photo";
        tooltip.appendChild(photo);
    }
    const place = document.createElement("strong");
    place.textContent = item.place;
    tooltip.appendChild(place);
    if (item.date) {
        const date = document.createElement("span");
        date.textContent = item.date;
        tooltip.appendChild(date);
    }
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

// Brighten routes touching `place` and fade the rest; pass null to reset
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
        travelMap.planes.forEach(({ el, route }) => {
            const { x, y, angle } = pointOnRoute(route, t);
            el.setAttribute("transform", `translate(${wrapToView(x)} ${y}) rotate(${angle}) scale(${travelMap.zoom})`);
            // Fade in at takeoff and out at landing
            el.style.opacity = Math.min(1, t * 8, (1 - t) * 8);
        });
        travelMap.planeFrame = requestAnimationFrame(step);
    };
    travelMap.planeFrame = requestAnimationFrame(step);
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

/* Moving the flat map: drag to pan round the world without end; wheel, pinch, keys or buttons to zoom */

// Show `camera` = [x, y, width, height] in map units, kept within the zoom limits and the map's top and bottom.
// x wraps round to stay within one world-width. The land and routes are drawn more than once side by side
// and pins hop to whichever copy is in view (placePins), so panning never reaches an edge.
function setCamera([x, y, w, h]) {
    const { svg, home } = travelMap;
    w = Math.min(Math.max(w, home[2] / MAP_MAX_ZOOM), home[2]);
    h = (w * home[3]) / home[2];
    const top = projectToMap([MAP_NORTH_EDGE, 0])[1];
    const bottom = projectToMap([MAP_SOUTH_EDGE, 0])[1];
    y = Math.min(Math.max(y, top), Math.max(top, bottom - h));
    x = ((x % WORLD_WIDTH) + WORLD_WIDTH) % WORLD_WIDTH;
    travelMap.camera = [x, y, w, h];
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    // Keep pins, lines and labels the same size on screen while the land zooms
    travelMap.zoom = w / home[2];
    svg.style.setProperty("--map-zoom", travelMap.zoom.toFixed(4));
    // Land dots grow with the square root of the zoom rather than the zoom itself: 8x in, they look under 3x bigger
    svg.style.setProperty("--map-dot", Math.sqrt(travelMap.zoom).toFixed(4));
    svg.classList.toggle("is-zoomed", 1 / travelMap.zoom >= MAP_LABEL_ZOOM);
    placePins();
    updateMapZoomButtons();
}

// Room left of the view where a pin still counts as in view, so a dot just past the edge can peek in
const MAP_EDGE_SLACK = 20;

// The copy of map x (any world-width) that's in view, or would be if it were
function wrapToView(x) {
    const left = travelMap.camera[0] - MAP_EDGE_SLACK;
    return x + Math.ceil((left - x) / WORLD_WIDTH) * WORLD_WIDTH;
}

// Move each pin onto the copy of the world in view. Labels sit right of their pin,
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

// Glide smoothly to `to`, panning whichever way round the world is shorter
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

// Zoom by `factor` (above 1 zooms in), keeping the point at fractions (fx, fy) across the map where it is
// on screen: the spot under the cursor for the wheel, the middle for the buttons.
// `from` is the view to zoom from (a pinch zooms from where it started). Returns false at the zoom limit.
function zoomCamera(factor, fx, fy, glide = false, from = travelMap.glideTarget || travelMap.camera) {
    const [x, y, w, h] = from;
    const { home } = travelMap;
    const nextW = Math.min(Math.max(w / factor, home[2] / MAP_MAX_ZOOM), home[2]);
    if (Math.abs(nextW - w) < 1e-6) return false;
    const nextH = (nextW * h) / w;
    const next = [x + (w - nextW) * fx, y + (h - nextH) * fy, nextW, nextH];
    if (glide) {
        glideCamera(next, MAP_ZOOM_MS / 2);
    } else {
        stopCameraMotion();
        hideMapPlace();
        setCamera(next);
    }
    return true;
}

// After a fling, keep sliding and slow down
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
        const pixels = Math.hypot(vx, vy) * (travelMap.svg.clientWidth / w);
        travelMap.cameraFrame = pixels > 10 ? requestAnimationFrame(step) : 0;
    };
    travelMap.cameraFrame = requestAnimationFrame(step);
}

function updateMapZoomButtons() {
    const { zoomButtons, home } = travelMap;
    if (!zoomButtons) return;
    const w = (travelMap.glideTarget || travelMap.camera)[2];
    zoomButtons.in.disabled = w <= home[2] / MAP_MAX_ZOOM + 1e-6;
    zoomButtons.out.disabled = w >= home[2] - 1e-6;
}

// + and − buttons for the corner of the flat map or the globe. onZoom gets the factor to zoom by.
function buildZoomButtons(step, onZoom) {
    const bar = document.createElement("div");
    bar.className = "map-zoom";
    const make = (label, text, factor) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "map-zoom-btn";
        btn.textContent = text;
        btn.setAttribute("aria-label", label);
        btn.addEventListener("click", () => onZoom(factor));
        bar.appendChild(btn);
        return btn;
    };
    return { bar, in: make("Zoom in", "+", step), out: make("Zoom out", "−", 1 / step) };
}

// Drag (or one finger) pans, a flick keeps it sliding, the wheel or a pinch zooms, arrow keys pan and + / - zoom
function wireMapMoving(svg) {
    const pointers = new Map();
    let pan = null;
    let pinch = null;

    const startPan = (id, x, y, moved) => {
        pan = { id, x, y, camera: [...travelMap.camera], moved, samples: [{ time: performance.now(), x, y }] };
    };
    const fractionAcross = (clientX, clientY) => {
        const box = svg.getBoundingClientRect();
        return [(clientX - box.left) / box.width, (clientY - box.top) / box.height];
    };

    svg.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        stopCameraMotion();
        // A second finger turns the drag into a pinch, zooming about the point between the fingers
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pan = null;
            pinch = {
                distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
                camera: [...travelMap.camera],
                at: fractionAcross((a.x + b.x) / 2, (a.y + b.y) / 2),
            };
            return;
        }
        startPan(e.pointerId, e.clientX, e.clientY, false);
    });

    svg.addEventListener("pointermove", (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch) {
            if (pointers.size === 2) {
                const [a, b] = [...pointers.values()];
                const factor = Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance;
                zoomCamera(factor, pinch.at[0], pinch.at[1], false, pinch.camera);
            }
            return;
        }
        if (!pan || pan.id !== e.pointerId) return;
        const dx = e.clientX - pan.x;
        const dy = e.clientY - pan.y;
        if (!pan.moved) {
            if (Math.abs(dx) + Math.abs(dy) <= 4) return;
            pan.moved = true;
            // Only take over the pointer once it's clearly a drag, so a plain click still reaches the pin under it
            svg.setPointerCapture(e.pointerId);
            svg.classList.add("is-panning");
            hideMapPlace();
        }
        const scale = pan.camera[2] / svg.clientWidth;
        const [x, y, w, h] = pan.camera;
        setCamera([x - dx * scale, y - dy * scale, w, h]);
        // Keep the last tenth of a second of movement to work out how fast it was flung
        const now = performance.now();
        pan.samples.push({ time: now, x: e.clientX, y: e.clientY });
        while (pan.samples.length > 2 && now - pan.samples[0].time > 100) pan.samples.shift();
    });

    const release = (e, cancelled) => {
        if (!pointers.delete(e.pointerId)) return;
        if (pinch) {
            if (pointers.size < 2) pinch = null;
            // One finger still down: carry on panning from where it is, without the map jumping
            if (pointers.size === 1) {
                const [[id, rest]] = [...pointers.entries()];
                startPan(id, rest.x, rest.y, true);
            }
            return;
        }
        if (!pan || pan.id !== e.pointerId) return;
        svg.classList.remove("is-panning");
        const { samples, moved } = pan;
        pan = null;
        if (!moved || cancelled || samples.length < 2) return;
        const first = samples[0];
        const last = samples[samples.length - 1];
        const seconds = (last.time - first.time) / 1000;
        if (seconds <= 0) return;
        const scale = travelMap.camera[2] / svg.clientWidth;
        coastCamera((-(last.x - first.x) / seconds) * scale, (-(last.y - first.y) / seconds) * scale);
    };
    svg.addEventListener("pointerup", (e) => release(e, false));
    // The browser took over the touch to scroll the page
    svg.addEventListener("pointercancel", (e) => release(e, true));

    // The wheel (or a trackpad pinch, which browsers send as a wheel with ctrlKey) zooms about the cursor.
    // The page never scrolls while the cursor is over the map, even once it can't zoom any further.
    svg.addEventListener(
        "wheel",
        (e) => {
            const lines = e.deltaMode === 1 ? 16 : 1;
            const factor = Math.exp(-e.deltaY * lines * (e.ctrlKey ? 0.01 : 0.002));
            const [fx, fy] = fractionAcross(e.clientX, e.clientY);
            e.preventDefault();
            zoomCamera(factor, fx, fy, false, travelMap.camera);
        },
        { passive: false }
    );

    svg.addEventListener("keydown", (e) => {
        if (e.key === "+" || e.key === "=" || e.key === "-") {
            e.preventDefault();
            zoomCamera(e.key === "-" ? 1 / MAP_ZOOM_STEP : MAP_ZOOM_STEP, 0.5, 0.5, true);
            return;
        }
        const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        const move = moves[e.key];
        if (!move) return;
        e.preventDefault();
        // A quarter of the view at a time
        const [x, y, w, h] = travelMap.glideTarget || travelMap.camera;
        glideCamera([x + move[0] * w * 0.25, y + move[1] * h * 0.25, w, h], MAP_ZOOM_MS / 2);
    });
}

// From a card's "View on map" button: scroll up, glide to the pin and zoom in, then show its tooltip
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

// Redraw the routes each time the map comes back into view; clear them once it's fully off screen
function drawRoutesOnScroll(svg) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio >= 0.4) {
                    entry.target.classList.add("is-drawn");
                } else if (!entry.isIntersecting) {
                    entry.target.classList.remove("is-drawn");
                }
            });
        },
        { threshold: [0, 0.4] }
    );
    observer.observe(svg);
}

/* Flight replay */

// The pause at each year marker, as a share of the shortest flight
const REPLAY_YEAR_PAUSE = 2;
// The scrubber's steps from start to end
const REPLAY_STEPS = 1000;

// Shared state, filled in by buildReplay
const replay = {
    legs: [],       // one per flight in beyondData.routes, in order: { from, to, miles, route, reverse, start, duration }
    labels: [],     // { at, text, tripIndex }, in time order: year markers, then trips as they're reached
    span: "",       // date text shown when no replay is running, e.g. "2023 – 2026"
    time: 0,        // where the replay is, in ms. Everything on the map is drawn from this alone.
    active: false,  // true while the map shows a moment in the replay rather than the finished map
    playing: false,
    visible: true,
    frame: 0,
    lastFrame: 0,
    trip: -1,       // index in beyondData.travel of the trip lit up right now
    current: null,  // { leg, progress } for the flight in the air, or null; the globe reads this too
    plane: null,
    button: null,
    scrubber: null,
    dateLabel: null,
};

// Lays out every flight on one timeline and builds the play button, scrubber and date counter
function buildReplay() {
    const routesByKey = new Map(travelMap.routes.map((route) => [route.key, route]));
    const tripIndexByPlace = new Map(beyondData.travel.map((item, i) => [item.place, i]));
    const reached = new Set();
    const legs = [];
    const labels = [];
    let time = 0;
    let year = "";

    // A trip lights up only in its own year: Shanghai is flown to in 2023 too, but that trip is March 2025
    const reachTrip = (place, at) => {
        const i = tripIndexByPlace.get(place);
        if (i === undefined || reached.has(i)) return;
        const { date } = beyondData.travel[i];
        if (year && !date.includes(year)) return;
        reached.add(i);
        labels.push({ at, text: date, tripIndex: i });
    };

    beyondData.routes.forEach((entry) => {
        if (typeof entry === "string") {
            year = (entry.match(/\d{4}/) || [""])[0];
            labels.push({ at: time, text: entry });
            time += REPLAY_YEAR_PAUSE;
            return;
        }
        const [from, to, times = 1] = entry;
        const route = routesByKey.get(routeKey(from, to));
        if (!route) return;
        const miles = distanceMiles(travelMap.coordsByPlace.get(from), travelMap.coordsByPlace.get(to));
        // Long flights take longer, but not so much longer that short hops flash by
        const duration = 1 + Math.sqrt(miles / 1000);
        // Leaving a trip counts too: Nara is only ever flown out of
        reachTrip(from, time);
        legs.push({ from, to, miles: miles * times, route, reverse: route.from !== from, start: time, duration });
        time += duration;
        reachTrip(to, time);
    });

    // Stretch the timeline to REPLAY_MS
    const scale = time ? REPLAY_MS / time : 0;
    legs.forEach((leg) => {
        leg.start *= scale;
        leg.duration *= scale;
        // A line draws itself during its first flight, which always runs in the line's own direction
        if (!leg.route.firstLeg) leg.route.firstLeg = leg;
    });
    labels.forEach((label) => (label.at *= scale));

    const years = labels.filter((label) => label.tripIndex === undefined).map((label) => label.text);
    const span = years.length > 1 ? `${years[0]} – ${years[years.length - 1]}` : years[0] || "";
    Object.assign(replay, { legs, labels, span });

    const bar = document.createElement("div");
    bar.className = "travel-map-replay";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-filter-btn travel-map-replay-btn";
    button.addEventListener("click", () => (replay.playing ? pauseReplay() : playReplay()));

    const scrubber = document.createElement("input");
    scrubber.type = "range";
    scrubber.className = "travel-map-scrubber";
    scrubber.min = 0;
    scrubber.max = REPLAY_STEPS;
    scrubber.value = REPLAY_STEPS;
    scrubber.setAttribute("aria-label", "Replay timeline");
    scrubber.addEventListener("input", () => {
        pauseReplay();
        const step = Number(scrubber.value);
        if (step >= REPLAY_STEPS) {
            exitReplay();
            return;
        }
        enterReplay();
        renderReplay((step / REPLAY_STEPS) * REPLAY_MS);
    });

    const dateLabel = document.createElement("span");
    dateLabel.className = "travel-map-date";
    dateLabel.textContent = span;

    bar.append(button, scrubber, dateLabel);
    Object.assign(replay, { button, scrubber, dateLabel });
    updateReplayButton();

    // Pause while the map is scrolled off screen, and carry on when it's back
    const observer = new IntersectionObserver(([entry]) => {
        replay.visible = entry.isIntersecting;
        runReplayLoop();
    });
    observer.observe(travelMap.root);

    if (!legs.length) bar.hidden = true;
    return bar;
}

function updateReplayButton() {
    // ︎ keeps the symbols as plain text instead of emoji on phones
    replay.button.textContent = replay.playing ? "❚❚︎ Pause" : "▶︎ Replay";
}

function playReplay() {
    // Start over unless a paused replay is waiting to carry on
    if (!replay.active || replay.time >= REPLAY_MS) replay.time = 0;
    enterReplay();
    replay.playing = true;
    updateReplayButton();
    renderReplay(replay.time);
    runReplayLoop();
}

function pauseReplay() {
    replay.playing = false;
    cancelAnimationFrame(replay.frame);
    updateReplayButton();
}

function stopReplay() {
    pauseReplay();
    exitReplay();
}

// One animation loop moves the time forward; renderReplay draws everything from it
function runReplayLoop() {
    cancelAnimationFrame(replay.frame);
    if (!replay.playing || !replay.visible) return;
    replay.lastFrame = performance.now();
    const step = (now) => {
        const time = replay.time + (now - replay.lastFrame);
        replay.lastFrame = now;
        if (time >= REPLAY_MS) {
            // The last flight has landed: hand back the finished map, which looks the same
            stopReplay();
            return;
        }
        renderReplay(time);
        replay.frame = requestAnimationFrame(step);
    };
    replay.frame = requestAnimationFrame(step);
}

// Switch the map from the finished picture to replay mode
function enterReplay() {
    if (replay.active) return;
    hideMapPlace();
    // The globe shows the whole world already; the flat map zooms back out to its starting view
    if (!globe.active) glideCamera(travelMap.home);
    replay.active = true;
    replay.trip = -1;
    travelMap.svg.classList.add("is-replaying");
    replay.plane = svgEl("path", { d: PLANE_SHAPE, class: "map-plane" });
    travelMap.planeLayer.appendChild(replay.plane);
}

// Back to the finished map, exactly as it was before the replay
function exitReplay() {
    if (!replay.active) return;
    replay.active = false;
    travelMap.routes.forEach((route) => {
        route.el.style.strokeDasharray = "";
        route.el.style.strokeDashoffset = "";
        route.el.classList.remove("is-highlighted");
        route.dash = null;
        route.drawnAmount = null;
    });
    // Let the browser apply the fully drawn lines while the replay's no-animation rule still holds,
    // and only then drop it, so half-drawn lines snap back instead of slowly drawing in again
    getComputedStyle(travelMap.routes[0].el).strokeDasharray;
    travelMap.svg.classList.remove("is-replaying");
    travelMap.pins.forEach(({ pin }) => pin.classList.remove("is-pending", "is-active"));
    replay.plane.remove();
    replay.current = null;
    highlightTravelCard(-1);
    travelMap.stats.textContent = travelStatsText();
    replay.dateLabel.textContent = replay.span;
    replay.scrubber.value = REPLAY_STEPS;
    replay.scrubber.removeAttribute("aria-valuetext");
    requestGlobeFrame();
}

// Draw the map as it was at `time`: lines flown so far, places reached, the plane in the air, and the counters
function renderReplay(time) {
    replay.time = time;
    const homes = new Set(beyondData.home.map((item) => item.place));
    const seen = new Set(homes);
    let miles = 0;
    let current = null;

    replay.legs.forEach((leg) => {
        if (time < leg.start) return;
        seen.add(leg.from);
        const progress = Math.min((time - leg.start) / leg.duration, 1);
        miles += leg.miles * progress;
        if (progress < 1) current = { leg, progress };
        else seen.add(leg.to);
    });

    travelMap.routes.forEach((route) => {
        const first = route.firstLeg;
        const drawn = first ? Math.min(Math.max((time - first.start) / first.duration, 0), 1) : 1;
        setRouteDrawn(route, drawn);
        route.el.classList.toggle("is-highlighted", current !== null && current.leg.route === route);
    });
    travelMap.pins.forEach(({ pin, item }) => pin.classList.toggle("is-pending", !seen.has(item.place)));
    replay.current = current;
    moveReplayPlane(current);
    requestGlobeFrame();

    const passed = replay.labels.filter((label) => label.at <= time);
    const latest = passed[passed.length - 1];
    const latestTrip = passed.filter((label) => label.tripIndex !== undefined).pop();
    setReplayTrip(latestTrip ? latestTrip.tripIndex : -1);
    replay.dateLabel.textContent = latest ? latest.text : "";

    const places = [...seen].filter((place) => !homes.has(place));
    travelMap.stats.textContent = formatTravelStats(places.length, countryCount([...seen]), miles);
    replay.scrubber.value = Math.round((time / REPLAY_MS) * REPLAY_STEPS);
    replay.scrubber.setAttribute("aria-valuetext", replay.dateLabel.textContent);
}

// Show the first `amount` (0 to 1) of a line. Each line is several copies in one path (ROUTE_COPIES),
// so the dash pattern repeats once per copy and every copy draws together.
function setRouteDrawn(route, amount) {
    const copy = ROUTE_COPY_LENGTH;
    const dash = `${amount * copy} ${copy - amount * copy}`;
    route.drawnAmount = amount;
    if (route.dash === dash) return;
    route.dash = dash;
    route.el.style.strokeDasharray = dash;
    route.el.style.strokeDashoffset = "0";
}

function moveReplayPlane(current) {
    const { plane } = replay;
    if (!current || prefersReducedMotion()) {
        plane.style.opacity = 0;
        return;
    }
    const { leg, progress } = current;
    const point = pointOnRoute(leg.route, leg.reverse ? 1 - progress : progress);
    const angle = point.angle + (leg.reverse ? 180 : 0);
    plane.setAttribute("transform", `translate(${wrapToView(point.x)} ${point.y}) rotate(${angle}) scale(${travelMap.zoom})`);
    // Fade in at takeoff and out at landing
    plane.style.opacity = Math.min(1, progress * 8, (1 - progress) * 8);
}

// Light up the latest trip's pin and card
function setReplayTrip(index) {
    if (replay.trip === index) return;
    replay.trip = index;
    highlightTravelCard(index);
    travelMap.tripPins.forEach((entry, i) => entry && entry.pin.classList.toggle("is-active", i === index));
}

/* Gallery and lightbox */

function renderGallery() {
    const filtersRoot = document.getElementById("gallery-filters");
    const gridRoot = document.getElementById("gallery-grid");

    if (!beyondData.gallery.length) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "Photos coming soon.";
        gridRoot.appendChild(empty);
        return;
    }

    const categories = ["all", ...new Set(beyondData.gallery.map((p) => p.category))];

    categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-filter-btn" + (cat === "all" ? " active" : "");
        btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.addEventListener("click", () => {
            filtersRoot.querySelectorAll(".gallery-filter-btn").forEach((b) =>
                b.classList.toggle("active", b === btn)
            );
            renderGalleryItems(cat);
        });
        filtersRoot.appendChild(btn);
    });

    renderGalleryItems("all");
}

function renderGalleryItems(filter) {
    const root = document.getElementById("gallery-grid");
    root.textContent = "";

    const items =
        filter === "all"
            ? beyondData.gallery
            : beyondData.gallery.filter((p) => p.category === filter);

    items.forEach((photo, i) => {
        const cell = document.createElement("div");
        cell.className = "gallery-cell";

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = "lazy";

        cell.appendChild(img);
        cell.addEventListener("click", () => openLightbox(items, i));
        root.appendChild(cell);
    });
}

function openLightbox(photos, startIndex) {
    let index = startIndex;

    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    const figure = document.createElement("figure");
    figure.className = "lightbox-figure";

    const img = document.createElement("img");
    const caption = document.createElement("figcaption");
    caption.className = "lightbox-caption";
    figure.append(img, caption);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "lightbox-nav lightbox-prev";
    prevBtn.setAttribute("aria-label", "Previous photo");
    prevBtn.textContent = "‹";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "lightbox-nav lightbox-next";
    nextBtn.setAttribute("aria-label", "Next photo");
    nextBtn.textContent = "›";

    function show(i) {
        index = (i + photos.length) % photos.length;
        const photo = photos[index];
        img.src = photo.src;
        img.alt = photo.alt;
        caption.textContent =
            photos.length > 1 ? `${photo.alt}  ·  ${index + 1} / ${photos.length}` : photo.alt;
    }

    function close() {
        overlay.remove();
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
    }

    function onKey(e) {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(index - 1);
        else if (e.key === "ArrowRight") show(index + 1);
    }

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(index - 1));
    nextBtn.addEventListener("click", () => show(index + 1));
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener("keydown", onKey);

    overlay.append(figure, closeBtn);
    if (photos.length > 1) overlay.append(prevBtn, nextBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    show(index);
    closeBtn.focus();
}

const beyondSummaryEl = document.querySelector(".beyond-hero .hero-summary");
const beyondSummaryText = beyondSummaryEl.textContent.trim();

// Green theme types out the hero line; other themes show it instantly
function runHackerTyping() {
    clearTyping();
    if (currentTheme() === "green") typeText(beyondSummaryEl, beyondSummaryText, 25);
    else resetTyping(beyondSummaryEl, beyondSummaryText);
}

wireThemeSwitcher(playGateIfThemeChanged);
init();
runHackerTyping();
