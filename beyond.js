const beyondData = {
    interests: [
        {
            name: "Duolingo",
            icon: "./images/beyond/duolingo.jpeg",
            note: "Currently learning Japanese w/ 830 days streak",
            link: "https://www.duolingo.com/",
        },
        {
            name: "GeoGuessr",
            icon: "",
            note: "Exploring the world virtually one street at a time",
            link: "https://www.geoguessr.com/",
        },
        {
            name: "Tennis & Pickleball",
            icon: "",
            note: "You only live once, but you get to serve twice",
            link: "https://www.atptour.com/en",
        },
        {
            name: "Fishing",
            icon: "",
            note: "If I'm not fishing, I'm thinking about it",
            link: "https://myfwc.com/fishing/",
        },
    ],

    aviation: {
        headline: "Private Pilot",
        license: "Private Pilot License (PPL)",
        summary:
            "Earned my Private Pilot License at 17. Flying gives me a unique perspective on the world ~ from above.",
        aircraftFlown: [
            { name: "Piper PA-28 Cherokee", note: "Primary trainer" },
            { name: "Piper PA-28 Warrior", note: "Secondary trainer" },
        ],
        milestones: [
            {
                label: "First Solo",
                date: "September 2022",
                description: "First time flying alone",
            },
            {
                label: "PPL Checkride",
                date: "March 2023",
                description: "Passed the FAA practical exam",
            },
        ],
        goals: [
            "Instrument Rating",
            "Commercial Pilot License",
            "Take my family flying"
        ],
        photos: [
            { src: "./images/beyond/aviation1.jpeg", alt: "Cockpit" },
            { src: "./images/beyond/plane.jpeg", alt: "Airplane" },
        ],
    },

    home: [
        {
            place: "Tallahassee, Florida",
            coords: [30.438, -84.281],
            date: "Hometown",
        },
        {
            place: "Atlanta, Georgia",
            coords: [33.749, -84.388],
            date: "School",
        },
    ],

    travel: [
        {
            place: "Tokyo, Japan",
            coords: [35.716, 139.800],
            date: "June 2024",
            image: "./images/beyond/tokyo_japan.jpeg",
            note: "Visited the Senso-Ji in Tokyo",
        },
        {
            place: "Nara, Japan",
            coords: [34.685, 135.843],
            date: "June 2024",
            image: "./images/beyond/nara_japan.jpeg",
            note: "Explored Nara Park with the sika deer",
        },
        {
            place: "Shanghai, China",
            coords: [31.240, 121.496],
            date: "March 2025",
            image: "./images/beyond/shanghai_china.jpeg",
            note: "Traveled to my hometown for spring break",
        },
        {
            place: "Reykjavík, Iceland",
            coords: [64.146, -21.942],
            date: "August 2025",
            image: "./images/beyond/iceland1.jpg",
            note: "Explored the nature in Iceland",
        },
        {
            place: "Ann Arbor, Michigan",
            coords: [42.277, -83.737],
            date: "December 2025",
            image: "./images/beyond/michigan.jpg",
            note: "Went for the Blockchain Conference",
        },
        {
            place: "Lisbon, Portugal",
            coords: [38.710, -9.137],
            date: "January 2026",
            image: "./images/beyond/lisbon1.jpeg",
            note: "Had fun in Lisbon for winter break",
        },
        {
            place: "Hong Kong, China",
            coords: [22.319, 114.169],
            date: "July 2026",
            image: "./images/beyond/hongkong1.jpeg",
            note: "Went to Hong Kong after summer internship",
        },
        {
            place: "Fukuoka, Japan",
            coords: [33.590, 130.401],
            date: "August 2026",
            image: "./images/beyond/fukuoka1.jpeg",
            note: "Traveled to Fukuoka after visiting Shanghai",
        },
    ],

    gallery: [
        {
            src: "./images/beyond/gallery/flying.jpg",
            alt: "Piloting",
            category: "aviation",
        },
        {
            src: "./images/beyond/gallery/iceland2.jpg",
            alt: "Iceland Cliff",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/iceland3.JPG",
            alt: "Sunset",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/lisbon3.jpg",
            alt: "Hiking",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/lisbon2.jpeg",
            alt: "Cliff",
            category: "travel",
        },
    ],
};

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
    root.textContent = "";

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
    root.textContent = "";

    const data = beyondData.aviation;

    // Intro
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
    root.appendChild(intro);

    // Aircraft flown
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
        root.appendChild(aircraftSection);
    }

    // Milestones timeline
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
        root.appendChild(timelineSection);
    }

    // Goals
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
        root.appendChild(goalsSection);
    }

    // Photos
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
    root.textContent = "";

    if (!beyondData.travel.length) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "Travel photos coming soon.";
        root.appendChild(empty);
        return;
    }

    const travelPhotos = beyondData.travel.map((item) => ({
        src: item.image,
        alt: `${item.place} \u2014 ${item.date}`,
    }));

    beyondData.travel.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "travel-card";
        card.id = `travel-card-${i}`;

        const imgWrap = document.createElement("div");
        imgWrap.className = "travel-image-wrap";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.place;
        img.loading = "lazy";
        imgWrap.appendChild(img);
        imgWrap.addEventListener("click", () => openLightbox(travelPhotos, i));

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

        card.append(imgWrap, info);
        root.appendChild(card);
    });
}

const SVG_NS = "http://www.w3.org/2000/svg";
const MAP_CELL = 5;
let travelPins = [];

function projectToMap([lat, lon]) {
    return [
        ((lon + 180) / worldDots.step) * MAP_CELL,
        ((worldDots.latTop - lat) / worldDots.step) * MAP_CELL,
    ];
}

function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
}

function renderTravelMap() {
    const root = document.getElementById("travel-map");
    if (!root) return;

    const trips = beyondData.travel.filter((item) => item.coords);
    if (typeof worldDots === "undefined" || !trips.length) {
        root.remove();
        return;
    }

    const width = (360 / worldDots.step) * MAP_CELL;
    const height = worldDots.rows.length * MAP_CELL;
    const svg = svgEl("svg", {
        viewBox: `0 0 ${width} ${height}`,
        class: "travel-map-svg",
        role: "img",
        "aria-label": "World map of places I've traveled: " + trips.map((t) => t.place).join(", "),
    });

    // Land dots
    let d = "";
    worldDots.rows.forEach((row, r) => {
        const y = (r + 0.5) * MAP_CELL;
        row.split(" ").filter(Boolean).forEach((run) => {
            const [start, length] = run.split(",").map(Number);
            for (let c = start; c < start + length; c++) {
                d += `M${(c + 0.5) * MAP_CELL} ${y}h0`;
            }
        });
    });
    svg.appendChild(svgEl("path", { d, class: "map-land" }));

    const homes = beyondData.home || [];

    // Arcs connecting home, then each trip in timeline order
    const points = [...homes, ...trips].map((item) => projectToMap(item.coords));
    let web = "";
    for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1];
        const [x2, y2] = points[i];
        const bend = Math.hypot(x2 - x1, y2 - y1) * 0.2;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - bend;
        web += `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`;
    }
    svg.appendChild(svgEl("path", { d: web, class: "map-web" }));
    const tooltip = document.createElement("div");
    tooltip.className = "map-tooltip";

    homes.forEach((item) => {
        const [x, y] = projectToMap(item.coords);
        const pin = svgEl("g", {
            class: "map-pin map-pin--home",
            transform: `translate(${x} ${y})`,
            tabindex: "0",
            "aria-label": `${item.place}, ${item.date}`,
        });
        pin.appendChild(svgEl("circle", { r: 3.2, class: "map-pin-dot" }));

        const show = () => showMapTooltip(tooltip, root, pin, item);
        const hide = () => tooltip.classList.remove("is-visible");
        pin.addEventListener("mouseenter", show);
        pin.addEventListener("focus", show);
        pin.addEventListener("mouseleave", hide);
        pin.addEventListener("blur", hide);
        svg.appendChild(pin);
    });

    travelPins = beyondData.travel.map((item, i) => {
        if (!item.coords) return null;
        const [x, y] = projectToMap(item.coords);

        const pin = svgEl("g", {
            class: "map-pin",
            transform: `translate(${x} ${y})`,
            tabindex: "0",
            role: "button",
            "aria-label": `${item.place}, ${item.date}`,
        });
        pin.style.animationDelay = `${i * 0.35}s`;
        pin.append(
            svgEl("circle", { r: 4, class: "map-pin-pulse" }),
            svgEl("circle", { r: 3.2, class: "map-pin-dot" })
        );

        const show = () => showMapTooltip(tooltip, root, pin, item);
        const hide = () => tooltip.classList.remove("is-visible");
        pin.addEventListener("mouseenter", show);
        pin.addEventListener("focus", show);
        pin.addEventListener("mouseleave", hide);
        pin.addEventListener("blur", hide);
        pin.addEventListener("click", () => {
            highlightTravelCard(i);
            document.getElementById(`travel-card-${i}`).scrollIntoView({ behavior: "smooth", block: "center" });
        });
        pin.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pin.dispatchEvent(new MouseEvent("click"));
            }
        });

        svg.appendChild(pin);
        return { pin, show };
    });

    root.append(svg, tooltip);
}

function showMapTooltip(tooltip, root, pin, item) {
    tooltip.textContent = "";
    const place = document.createElement("strong");
    place.textContent = item.place;
    const date = document.createElement("span");
    date.textContent = item.date;
    tooltip.append(place, date);

    const pinBox = pin.getBoundingClientRect();
    const rootBox = root.getBoundingClientRect();
    tooltip.style.left = `${pinBox.left + pinBox.width / 2 - rootBox.left}px`;
    tooltip.style.top = `${pinBox.top - rootBox.top}px`;
    tooltip.classList.add("is-visible");
}

function focusTravelPin(index) {
    const entry = travelPins[index];
    if (!entry) return;

    document.getElementById("travel-map").scrollIntoView({ behavior: "smooth", block: "center" });
    travelPins.forEach((p) => p && p.pin.classList.toggle("is-active", p === entry));
    highlightTravelCard(index);
    setTimeout(entry.show, 400);
}

function highlightTravelCard(index) {
    document.querySelectorAll(".travel-card").forEach((card) =>
        card.classList.toggle("is-highlighted", card.id === `travel-card-${index}`)
    );
}

function renderGallery() {
    const filtersRoot = document.getElementById("gallery-filters");
    const gridRoot = document.getElementById("gallery-grid");
    filtersRoot.textContent = "";
    gridRoot.textContent = "";

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
    closeBtn.textContent = "\u00D7";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "lightbox-nav lightbox-prev";
    prevBtn.setAttribute("aria-label", "Previous photo");
    prevBtn.textContent = "\u2039";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "lightbox-nav lightbox-next";
    nextBtn.setAttribute("aria-label", "Next photo");
    nextBtn.textContent = "\u203A";

    function show(i) {
        index = (i + photos.length) % photos.length;
        const photo = photos[index];
        img.src = photo.src;
        img.alt = photo.alt;
        caption.textContent =
            photos.length > 1 ? `${photo.alt}  \u00B7  ${index + 1} / ${photos.length}` : photo.alt;
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

function wireSmoothScrollButtons() {
    const buttons = document.querySelectorAll(".js-scroll");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

function revealSectionsOnScroll() {
    const sections = Array.from(document.querySelectorAll(".section"));
    if (!("IntersectionObserver" in window)) {
        sections.forEach((section) => section.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    sections.forEach((section, index) => {
        if (index === 0) return;
        observer.observe(section);
    });
}

function wireThemeSwitcher() {
    const buttons = document.querySelectorAll(".theme-btn");
    const saved = localStorage.getItem("theme") || "blue";
    document.documentElement.setAttribute("data-theme", saved);
    buttons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.setTheme === saved);
    });

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const theme = btn.dataset.setTheme;
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            buttons.forEach((b) => b.classList.toggle("active", b === btn));
            runHackerTyping();
        });
    });
}

/* typewriter effect (note to self: this is only for green theme) */
let typingTimers = [];
const beyondSummaryEl = document.querySelector(".beyond-hero .hero-summary");
const beyondSummaryText = beyondSummaryEl ? beyondSummaryEl.textContent.trim() : "";

function clearTyping() {
    typingTimers.forEach(id => clearTimeout(id));
    typingTimers = [];
}

function typeText(element, text, speed, callback) {
    element.textContent = "";
    element.classList.add("typing", "typing-cursor");
    let i = 0;
    function tick() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            const id = setTimeout(tick, speed);
            typingTimers.push(id);
        } else {
            element.classList.remove("typing-cursor");
            element.classList.remove("typing");
            if (callback) callback();
        }
    }
    tick();
}

function runHackerTyping() {
    clearTyping();
    const theme = document.documentElement.getAttribute("data-theme");
    const summaryEl = document.querySelector(".beyond-hero .hero-summary");
    if (!summaryEl) return;

    if (theme !== "green") {
        summaryEl.textContent = beyondSummaryText;
        summaryEl.classList.remove("typing", "typing-cursor");
        return;
    }

    typeText(summaryEl, beyondSummaryText, 25);
}

wireThemeSwitcher();
init();
runHackerTyping();
