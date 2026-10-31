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
// How long a zoom takes, and how long the plane takes to fly one route, in milliseconds
const MAP_ZOOM_MS = 600;
const PLANE_FLIGHT_MS = 1800;
// Zoom buttons, as [north, west, south, east] in degrees. A button only shows once a pin falls inside it.
const MAP_REGIONS = [
    { name: "North America", bounds: [72, -170, 5, -52] },
    { name: "South America", bounds: [13, -82, -56, -34] },
    { name: "Europe", bounds: [71, -25, 35, 42] },
    { name: "Middle East", bounds: [42, 25, 12, 63] },
    { name: "Africa", bounds: [37, -18, -35, 52] },
    { name: "South Asia", bounds: [36, 60, 5, 92] },
    { name: "East Asia", bounds: [44, 106, 16, 146] },
    { name: "Southeast Asia", bounds: [21, 92, -11, 141] },
    { name: "Oceania", bounds: [0, 110, -48, 180] },
];

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
    views: [],      // World first, then each region with a pin
    buttons: [],    // view buttons, same order as views
    current: null,  // the view being shown
    zoom: 1,        // current view width / World width; pins and lines are scaled by this
    zoomFrame: 0,
    routes: [],     // { el, from, to, start, control, end }, one per line drawn
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
    const views = buildMapViews(places.map((item) => item.coords));

    const svg = svgEl("svg", {
        viewBox: views[0].box.join(" "),
        class: "travel-map-svg",
        role: "img",
        "aria-label": "World map of places I've traveled: " + trips.map((t) => t.place).join(", "),
    });
    const tooltip = document.createElement("div");
    tooltip.className = "map-tooltip";
    const planeLayer = svgEl("g", { class: "map-planes" });
    Object.assign(travelMap, { root, svg, tooltip, planeLayer, views, current: views[0] });

    // Drawn in order: land, then routes, then planes, then pins on top
    travelMap.routes = buildRoutes(places);
    svg.append(drawLand(), ...travelMap.routes.map((route) => route.el), planeLayer);

    const homePins = homes.map((item) => createPin(item, "home"));
    const stopPins = stops.map((item) => createPin(item, "stop"));
    travelMap.tripPins = beyondData.travel.map((item, i) => (item.coords ? createPin(item, "trip", i) : null));
    travelMap.pins = [...homePins, ...stopPins, ...travelMap.tripPins.filter(Boolean)];
    svg.append(...travelMap.pins.map((entry) => entry.pin));

    root.append(buildMapHeader(), svg, tooltip);
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

function inBounds([lat, lon], [north, west, south, east]) {
    return lat <= north && lat >= south && lon >= west && lon <= east;
}

// Shortest distance over the globe, which is roughly what a flight covers (haversine formula)
function distanceMiles([lat1, lon1], [lat2, lon2]) {
    const rad = Math.PI / 180;
    const a =
        Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
        Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
    return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

// Point and direction (degrees) at t (0 to 1) along a route's curve
function pointOnRoute({ start, control, end }, t) {
    const u = 1 - t;
    const x = u * u * start[0] + 2 * u * t * control[0] + t * t * end[0];
    const y = u * u * start[1] + 2 * u * t * control[1] + t * t * end[1];
    const dx = u * (control[0] - start[0]) + t * (end[0] - control[0]);
    const dy = u * (control[1] - start[1]) + t * (end[1] - control[1]);
    return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
}

/* Building the map */

// World view cropped to the pins, then a zoomed view for each region that holds a pin
function buildMapViews(coords) {
    const lats = coords.map(([lat]) => lat);
    const lons = coords.map(([, lon]) => lon);
    const pinBox = boundsToBox([
        Math.min(Math.max(...lats) + MAP_PADDING.lat, worldDots.latTop),
        Math.max(Math.min(...lons) - MAP_PADDING.lon, -180),
        Math.min(...lats) - MAP_PADDING.lat,
        Math.min(Math.max(...lons) + MAP_PADDING.lon, 180),
    ]);
    // Pins spread far east-west would make a thin strip, so add room above and below instead
    const aspect = Math.min(pinBox[2] / pinBox[3], MAP_MAX_ASPECT);
    const worldBox = fitAspect(pinBox, aspect);
    worldBox[1] = Math.max(worldBox[1], 0);

    const regions = MAP_REGIONS.map((region) => ({
        name: region.name,
        bounds: region.bounds,
        box: fitAspect(boundsToBox(region.bounds), aspect),
    })).filter((view) => view.box[2] < worldBox[2]);

    // Regions overlap (Africa's box covers part of the Middle East), so each pin only
    // counts toward its closest region, and only regions that some pin counts toward get a button
    const used = new Set(coords.map((c) => closestRegion(regions, c)));
    return [{ name: "World", box: worldBox }, ...regions.filter((view) => used.has(view))];
}

// The smallest region containing these coords, or undefined
function closestRegion(regions, coords) {
    const matches = regions.filter((view) => inBounds(coords, view.bounds));
    matches.sort((a, b) => a.box[2] - b.box[2]);
    return matches[0];
}

// Every land cell becomes a zero-length line with round caps, which draws as a dot
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
    return svgEl("path", { d: parts.join(""), class: "map-land" });
}

// One curved line per pair of places in beyondData.routes, bowed upward.
// Also totals the miles of every flight listed, repeats and return legs included.
function buildRoutes(places) {
    const coordsByPlace = new Map(places.map((item) => [item.place, item.coords]));
    const routes = [];
    const drawn = new Set();
    travelMap.totalMiles = 0;

    beyondData.routes.forEach(([from, to, times = 1]) => {
        if (!coordsByPlace.has(from) || !coordsByPlace.has(to)) {
            console.warn(`Travel map route skipped, unknown place: ${from} -> ${to}`);
            return;
        }
        travelMap.totalMiles += distanceMiles(coordsByPlace.get(from), coordsByPlace.get(to)) * times;

        // A to B and B to A share one line
        const pairKey = [from, to].sort().join(" | ");
        if (drawn.has(pairKey)) return;
        drawn.add(pairKey);

        const start = projectToMap(coordsByPlace.get(from));
        const end = projectToMap(coordsByPlace.get(to));
        // Go whichever way round the world is shorter. Crossing the Pacific means
        // running off one edge of the map: move the end a world-width over so the
        // curve heads that way, then draw a second copy shifted back in from the other edge.
        const gap = end[0] - start[0];
        const shift = Math.abs(gap) > WORLD_WIDTH / 2 ? -Math.sign(gap) * WORLD_WIDTH : 0;
        end[0] += shift;

        const bend = Math.hypot(end[0] - start[0], end[1] - start[1]) * 0.2;
        const control = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 - bend];
        const curve = (dx) =>
            `M${start[0] + dx} ${start[1]}Q${control[0] + dx} ${control[1]} ${end[0] + dx} ${end[1]}`;

        const el = svgEl("path", {
            d: shift ? curve(0) + curve(-shift) : curve(0),
            class: "map-web",
            pathLength: 1,
        });
        // Each route draws itself in turn when the map scrolls into view
        el.style.setProperty("--route-delay", `${routes.length * 0.2}s`);

        routes.push({ el, from, to, start, control, end });
    });
    return routes;
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

    const entry = { pin, label, item, x, show: () => showMapPlace(entry) };
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

// View buttons on the left, stats on the right
function buildMapHeader() {
    const header = document.createElement("div");
    header.className = "travel-map-header";

    const controls = document.createElement("div");
    controls.className = "travel-map-views";
    travelMap.buttons = travelMap.views.map((view, v) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-filter-btn" + (v === 0 ? " active" : "");
        btn.textContent = view.name;
        btn.addEventListener("click", () => setMapView(view.name));
        controls.appendChild(btn);
        return btn;
    });

    const stats = document.createElement("p");
    stats.className = "travel-map-stats";
    stats.textContent = travelStatsText();

    header.append(controls, stats);
    return header;
}

// e.g. "10 places · 7 countries · 52,300 miles flown".
// Countries come from the text after the last comma in each place; miles from every flight in routes.
function travelStatsText() {
    const countries = new Set(
        [...beyondData.home, ...beyondData.stops, ...beyondData.travel].map((item) => {
            const last = item.place.split(",").pop().trim();
            return US_STATES.has(last) ? "United States" : last;
        })
    );
    const placeCount = beyondData.travel.length + beyondData.stops.length;

    return [
        `${placeCount} ${placeCount === 1 ? "place" : "places"}`,
        `${countries.size} ${countries.size === 1 ? "country" : "countries"}`,
        `${(Math.round(travelMap.totalMiles / 100) * 100).toLocaleString()} miles flown`,
    ].join(" · ");
}

/* Interaction */

function showMapPlace({ pin, item }) {
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
    const { root, tooltip } = travelMap;
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

    // Measure the dot alone: the whole pin also includes its label and pulse ring
    const pinBox = pin.querySelector(".map-pin-dot").getBoundingClientRect();
    const rootBox = root.getBoundingClientRect();
    tooltip.style.left = `${pinBox.left + pinBox.width / 2 - rootBox.left}px`;
    tooltip.style.top = `${pinBox.top - rootBox.top}px`;
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
            const point = pointOnRoute(route, t);
            const { y, angle } = point;
            // Routes over the Pacific run past the map's edge; wrap the plane back onto the other side
            const x = ((point.x % WORLD_WIDTH) + WORLD_WIDTH) % WORLD_WIDTH;
            el.setAttribute("transform", `translate(${x} ${y}) rotate(${angle}) scale(${travelMap.zoom})`);
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

// Zoom to the named view; returns true if the view changed
function setMapView(name) {
    const { svg, views, buttons } = travelMap;
    const next = views.find((view) => view.name === name) || views[0];
    buttons.forEach((btn, v) => btn.classList.toggle("active", views[v] === next));
    if (next === travelMap.current) return false;

    hideMapPlace();
    travelMap.current = next;
    svg.classList.toggle("is-zoomed", next !== views[0]);
    placeLabels(next.box);

    const worldViewWidth = views[0].box[2];
    const from = svg.getAttribute("viewBox").split(" ").map(Number);
    const to = next.box;
    const duration = prefersReducedMotion() ? 0 : MAP_ZOOM_MS;
    const start = performance.now();
    cancelAnimationFrame(travelMap.zoomFrame);

    const step = (now) => {
        const t = duration ? Math.min((now - start) / duration, 1) : 1;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const box = from.map((f, k) => f + (to[k] - f) * ease);
        svg.setAttribute("viewBox", box.join(" "));
        // Keep pins, lines and labels the same size on screen while the land zooms
        travelMap.zoom = box[2] / worldViewWidth;
        svg.style.setProperty("--map-zoom", travelMap.zoom.toFixed(4));
        if (t < 1) travelMap.zoomFrame = requestAnimationFrame(step);
    };
    // First frame runs now, so with reduced motion the zoom is already done when this returns
    step(start);
    return true;
}

// Labels sit right of their pin, or left of it near the right edge so they aren't cut off
function placeLabels([x, , width]) {
    travelMap.pins.forEach(({ label, x: pinX }) => {
        const nearRightEdge = pinX > x + width * 0.85;
        label.setAttribute("x", nearRightEdge ? -6 : 6);
        label.setAttribute("text-anchor", nearRightEdge ? "end" : "start");
    });
}

// The view a pin's "View on map" zooms to: its closest region, or "World"
function regionFor(coords) {
    const region = closestRegion(travelMap.views.slice(1), coords);
    return region ? region.name : "World";
}

// From a card's "View on map" button: scroll up, zoom to the pin's region, then show its tooltip
function focusTravelPin(index) {
    const entry = travelMap.tripPins[index];
    travelMap.root.scrollIntoView({ behavior: "smooth", block: "center" });
    travelMap.tripPins.forEach((p) => p && p.pin.classList.toggle("is-active", p === entry));
    highlightTravelCard(index);
    const zoomed = setMapView(regionFor(entry.item.coords));
    setTimeout(entry.show, zoomed ? MAP_ZOOM_MS + 100 : 400);
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

wireThemeSwitcher(runHackerTyping);
init();
runHackerTyping();
