const beyondData = {
    interests: [
        {
            name: "Duolingo",
            icon: "./images/beyond/duolingo.jpeg",
            note: "Currently learning Japanese w/ 650 days streak",
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
        dateEarned: "March 2023",
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
            note: "Explored Nara Park with the sika deers",
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
            coords: [64.411, -21.239],
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
            src: "./images/beyond/gallery/lisbon2.jpeg",
            alt: "Cliff",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/lisbon3.jpg",
            alt: "Hiking",
            category: "travel",
        },
    ],
};

function init() {
    renderInterests();
    renderAviation();
    renderTravelMap();
    renderTravel();
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
        data.photos.forEach((photo) => {
            const wrap = document.createElement("div");
            wrap.className = "aviation-photo-wrap";

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

function renderTravelMap() {
    const mapRoot = document.getElementById("travel-map");
    const placesWithCoords = beyondData.travel.filter((t) => t.coords);

    if (!placesWithCoords.length) {
        mapRoot.style.display = "none";
        return;
    }

    mapRoot.style.display = "";

    const map = L.map("travel-map", {
        scrollWheelZoom: false,
    }).setView([20, 0], 2);

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
        }
    ).addTo(map);

    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-a")
        .trim();
    const glowColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--glow-a")
        .trim();

    const markerIcon = L.divIcon({
        className: "travel-marker",
        html: `<span style="background:${accentColor};box-shadow:0 0 10px ${glowColor}"></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
    });

    const bounds = [];

    placesWithCoords.forEach((item) => {
        const marker = L.marker(item.coords, { icon: markerIcon }).addTo(map);
        marker.bindPopup(
            `<strong>${item.place}</strong><br><span style="opacity:0.7">${item.date}</span><br>${item.note}`
        );
        bounds.push(item.coords);
    });

    if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
    } else {
        map.setView(bounds[0], 5);
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

    beyondData.travel.forEach((item) => {
        const card = document.createElement("div");
        card.className = "travel-card";

        const imgWrap = document.createElement("div");
        imgWrap.className = "travel-image-wrap";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.place;
        img.loading = "lazy";
        imgWrap.appendChild(img);

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
        card.append(imgWrap, info);
        root.appendChild(card);
    });
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

    items.forEach((photo) => {
        const cell = document.createElement("div");
        cell.className = "gallery-cell";

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = "lazy";

        cell.appendChild(img);
        cell.addEventListener("click", () => openLightbox(photo.src, photo.alt));
        root.appendChild(cell);
    });
}

function openLightbox(src, alt) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;

    const closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.textContent = "\u00D7";
    closeBtn.addEventListener("click", () => overlay.remove());

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.append(img, closeBtn);
    document.body.appendChild(overlay);
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
        });
    });
}

init();
wireThemeSwitcher();
