/* Beyond Work page: interests, aviation, trip cards, gallery and lightbox.
   The travel map is in js/travel-map.js, js/replay.js and js/globe.js. */

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
        const card = createEl("div", "interest-card" + (item.icon ? "" : " interest-card--no-icon"));
        // Decorative: the name is right below it
        if (item.icon) card.appendChild(lazyImage(item.icon, "", "interest-icon"));
        card.append(createEl("h3", "interest-name", item.name), createEl("p", "interest-note", item.note));
        if (item.link) {
            const link = createEl("a", "interest-link", "Learn more");
            link.href = item.link;
            openExternalInNewTab(link);
            card.appendChild(link);
        }
        root.appendChild(card);
    });
}

// Text in the left column, photos in the right (stacked on small screens)
function renderAviation() {
    const root = document.getElementById("aviation-content");
    const data = beyondData.aviation;

    const intro = createEl("div", "aviation-intro");
    intro.append(
        createEl("span", "aviation-badge", data.license),
        createEl("h3", "", data.headline),
        createEl("p", "aviation-summary", data.summary)
    );
    const info = createEl("div", "aviation-info");
    info.appendChild(intro);
    if (data.logbook.length) info.appendChild(aviationLogbook(data.logbook));
    if (data.aircraftFlown.length) info.appendChild(aviationSubsection("Aircraft Flown", aviationAircraft(data.aircraftFlown)));
    if (data.milestones.length) info.appendChild(aviationSubsection("Milestones", aviationTimeline(data.milestones)));
    if (data.goals.length) {
        const list = createEl("ul", "highlight-list");
        data.goals.forEach((goal) => list.appendChild(createEl("li", "", goal)));
        info.appendChild(aviationSubsection("Aviation Goals", list));
    }
    root.appendChild(info);
    if (data.photos.length) root.appendChild(aviationPhotos(data.photos));
}

function aviationLogbook(logbook) {
    const stats = createEl("div", "aviation-stats");
    logbook.forEach((stat) => {
        const tile = createEl("div", "aviation-stat");
        const value = typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value;
        tile.append(createEl("span", "aviation-stat-value", value), createEl("span", "aviation-stat-label", stat.label));
        stats.appendChild(tile);
    });
    return stats;
}

function aviationAircraft(aircraft) {
    const row = createEl("div", "stack-row");
    aircraft.forEach((plane) => {
        const pill = createEl("span", "stack-pill", plane.name);
        pill.title = plane.note;
        row.appendChild(pill);
    });
    return row;
}

function aviationTimeline(milestones) {
    const timeline = createEl("div", "aviation-timeline");
    milestones.forEach((milestone) => {
        const entry = createEl("div", "timeline-entry");
        entry.append(
            createEl("span", "timeline-dot"),
            createEl("span", "timeline-label", milestone.label),
            createEl("span", "timeline-date", milestone.date),
            createEl("p", "timeline-desc", milestone.description)
        );
        timeline.appendChild(entry);
    });
    return timeline;
}

function aviationPhotos(photos) {
    const grid = createEl("div", "aviation-photos");
    photos.forEach((photo, i) => {
        const wrap = createButton("aviation-photo-wrap", "", () => openLightbox(photos, i));
        wrap.appendChild(lazyImage(photo.src, photo.alt));
        grid.appendChild(wrap);
    });
    return grid;
}

function aviationSubsection(title, content) {
    const section = createEl("div", "aviation-subsection");
    section.append(createEl("h4", "", title), content);
    return section;
}

function renderTravel() {
    const root = document.getElementById("travel-grid");
    if (!beyondData.travel.length) {
        root.appendChild(createEl("p", "empty-message", "Travel photos coming soon."));
        return;
    }

    // The lightbox steps only through trips that have a photo
    const withPhotos = beyondData.travel.filter((item) => item.image);
    const travelPhotos = withPhotos.map((item) => ({ src: item.image, alt: `${item.place} — ${item.date}` }));

    beyondData.travel.forEach((item, i) => {
        const card = createEl("div", item.image ? "travel-card" : "travel-card travel-card--no-image");
        card.id = `travel-card-${i}`;
        if (item.image) {
            const imgWrap = createButton("travel-image-wrap", "", () => openLightbox(travelPhotos, withPhotos.indexOf(item)));
            imgWrap.appendChild(lazyImage(item.image, item.place));
            card.appendChild(imgWrap);
        }

        const info = createEl("div", "travel-info");
        info.append(createEl("h3", "", item.place), createEl("span", "travel-date", item.date), createEl("p", "", item.note));
        if (item.coords) {
            info.appendChild(createButton("travel-map-btn", "View on map", () => focusTravelPin(i)));
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

function renderGallery() {
    const filtersRoot = document.getElementById("gallery-filters");
    if (!beyondData.gallery.length) {
        document.getElementById("gallery-grid").appendChild(createEl("p", "empty-message", "Photos coming soon."));
        return;
    }

    const categories = ["all", ...new Set(beyondData.gallery.map((p) => p.category))];
    categories.forEach((category) => {
        const label = category.charAt(0).toUpperCase() + category.slice(1);
        const btn = createButton("gallery-filter-btn", label, () => {
            filtersRoot.querySelectorAll(".gallery-filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
            renderGalleryItems(category);
        });
        if (category === "all") btn.classList.add("active");
        filtersRoot.appendChild(btn);
    });
    renderGalleryItems("all");
}

function renderGalleryItems(category) {
    const root = document.getElementById("gallery-grid");
    root.textContent = "";
    const items = category === "all" ? beyondData.gallery : beyondData.gallery.filter((p) => p.category === category);
    items.forEach((photo, i) => {
        const cell = createButton("gallery-cell", "", () => openLightbox(items, i));
        cell.appendChild(lazyImage(photo.src, photo.alt));
        root.appendChild(cell);
    });
}

function openLightbox(photos, startIndex) {
    let index = startIndex;
    const opener = document.activeElement;
    const overlay = createEl("div", "lightbox-overlay");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo viewer");
    const figure = createEl("figure", "lightbox-figure");
    const img = createEl("img");
    const caption = createEl("figcaption", "lightbox-caption");
    figure.append(img, caption);

    const closeBtn = createButton("lightbox-close", "×", close, "Close");
    const prevBtn = createButton("lightbox-nav lightbox-prev", "‹", () => show(index - 1), "Previous photo");
    const nextBtn = createButton("lightbox-nav lightbox-next", "›", () => show(index + 1), "Next photo");

    function show(i) {
        index = (i + photos.length) % photos.length;
        const photo = photos[index];
        img.src = photo.src;
        img.alt = photo.alt;
        caption.textContent = photos.length > 1 ? `${photo.alt}  ·  ${index + 1} / ${photos.length}` : photo.alt;
    }

    function close() {
        overlay.remove();
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
        if (opener) opener.focus({ preventScroll: true });
    }

    function onKey(e) {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(index - 1);
        else if (e.key === "ArrowRight") show(index + 1);
        else if (e.key === "Tab") keepTabInside(e);
    }

    // Tab cycles through the lightbox's own buttons instead of the page behind it
    function keepTabInside(e) {
        const buttons = [...overlay.querySelectorAll("button")];
        const next = buttons.indexOf(document.activeElement) + (e.shiftKey ? -1 : 1);
        e.preventDefault();
        buttons[(next + buttons.length) % buttons.length].focus();
    }

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

// The green theme types out the hero line; the blue one shows it at once
function runHackerTyping() {
    clearTyping();
    if (currentTheme() === "green") typeText(beyondSummaryEl, beyondSummaryText, 25);
    else resetTyping(beyondSummaryEl, beyondSummaryText);
}

wireThemeSwitcher(playGateIfThemeChanged);
init();
runHackerTyping();
