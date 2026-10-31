/* Flight replay on the travel map: flies every flight in beyondData.routes in order, with a scrubber
   and a date counter. Everything on screen is drawn from one time value (renderReplay), so playing,
   pausing and scrubbing always agree. */

// Milliseconds the whole replay takes; longer flights take longer
const REPLAY_MS = 24000;
// The pause at each year marker, as a share of the shortest flight
const REPLAY_YEAR_PAUSE = 2;
const REPLAY_STEPS = 1000;

const replay = {
    legs: [],       // one per flight, in order: { from, to, miles, route, reverse, start, duration }
    labels: [],     // { at, text, tripIndex } in time order: year markers, and trips as they're reached
    span: "",       // date text shown when no replay is running, e.g. "2023 – 2026"
    time: 0,
    active: false,  // the map shows a moment in the replay rather than the finished map
    playing: false,
    visible: true,
    frame: 0,
    lastFrame: 0,
    trip: -1,       // index in beyondData.travel of the trip lit up now
    current: null,  // { leg, progress } of the flight in the air, or null; the globe reads this too
    plane: null,
    button: null,
    scrubber: null,
    dateLabel: null,
};

function buildReplay() {
    buildReplayTimeline();
    const bar = buildReplayControls();
    // Pause while the map is scrolled off screen, and carry on when it's back
    new IntersectionObserver(([entry]) => {
        replay.visible = entry.isIntersecting;
        runReplayLoop();
    }).observe(travelMap.root);
    return bar;
}

// Lay every flight out on one timeline, REPLAY_MS long
function buildReplayTimeline() {
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
}

// Play button, scrubber and date counter
function buildReplayControls() {
    const button = createEl("button", "gallery-filter-btn travel-map-replay-btn");
    button.type = "button";
    button.addEventListener("click", () => (replay.playing ? pauseReplay() : playReplay()));

    const scrubber = createEl("input", "travel-map-scrubber");
    scrubber.type = "range";
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

    const dateLabel = createEl("span", "travel-map-date", replay.span);
    Object.assign(replay, { button, scrubber, dateLabel });
    updateReplayButton();

    const bar = createEl("div", "travel-map-replay");
    bar.append(button, scrubber, dateLabel);
    bar.hidden = !replay.legs.length;
    return bar;
}

function updateReplayButton() {
    // \uFE0E keeps the symbols as plain text instead of emoji on phones
    replay.button.textContent = replay.playing ? "\u275A\u275A\uFE0E Pause" : "\u25B6\uFE0E Replay";
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

function runReplayLoop() {
    cancelAnimationFrame(replay.frame);
    if (!replay.playing || !replay.visible) return;
    replay.lastFrame = performance.now();
    const step = (now) => {
        const time = replay.time + (now - replay.lastFrame);
        replay.lastFrame = now;
        if (time >= REPLAY_MS) {
            // The last flight has landed; the finished map looks the same
            stopReplay();
            return;
        }
        renderReplay(time);
        replay.frame = requestAnimationFrame(step);
    };
    replay.frame = requestAnimationFrame(step);
}

function enterReplay() {
    if (replay.active) return;
    hideMapPlace();
    // The globe already shows the whole world; the flat map zooms back out to its starting view
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
        route.el.classList.remove("is-highlighted");
        route.dash = null;
        route.drawnAmount = null;
    });
    // Apply the fully drawn lines while the replay's no-transition rule still holds, then drop it,
    // so half-drawn lines snap back instead of slowly drawing in again
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
        setRouteDrawn(route, first ? Math.min(Math.max((time - first.start) / first.duration, 0), 1) : 1);
        route.el.classList.toggle("is-highlighted", current !== null && current.leg.route === route);
    });
    travelMap.pins.forEach(({ pin, item }) => pin.classList.toggle("is-pending", !seen.has(item.place)));
    replay.current = current;
    moveReplayPlane(current);
    requestGlobeFrame();

    const passed = replay.labels.filter((label) => label.at <= time);
    const latestTrip = passed.filter((label) => label.tripIndex !== undefined).pop();
    setReplayTrip(latestTrip ? latestTrip.tripIndex : -1);
    replay.dateLabel.textContent = passed.length ? passed[passed.length - 1].text : "";

    const places = [...seen].filter((place) => !homes.has(place));
    travelMap.stats.textContent = formatTravelStats(places.length, countryCount([...seen]), miles);
    replay.scrubber.value = Math.round((time / REPLAY_MS) * REPLAY_STEPS);
    replay.scrubber.setAttribute("aria-valuetext", replay.dateLabel.textContent);
}

// Show the first `amount` (0 to 1) of a line. The dash pattern repeats once per copy of the line
// in the path (ROUTE_COPIES), so every copy draws together.
function setRouteDrawn(route, amount) {
    const drawn = amount * ROUTE_COPY_LENGTH;
    const dash = `${drawn} ${ROUTE_COPY_LENGTH - drawn}`;
    route.drawnAmount = amount;
    if (route.dash === dash) return;
    route.dash = dash;
    route.el.style.strokeDasharray = dash;
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
    plane.style.opacity = planeOpacity(progress);
}

// Light up the latest trip's pin and card
function setReplayTrip(index) {
    if (replay.trip === index) return;
    replay.trip = index;
    highlightTravelCard(index);
    travelMap.tripPins.forEach((entry, i) => entry && entry.pin.classList.toggle("is-active", i === index));
}
