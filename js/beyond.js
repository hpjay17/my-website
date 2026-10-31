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
        if (item.icon) {
            const icon = createEl("img", "interest-icon");
            icon.src = item.icon;
            icon.alt = item.name;
            icon.loading = "lazy";
            card.appendChild(icon);
        }
        card.append(createEl("h3", "interest-name", item.name), createEl("p", "interest-note", item.note));
        if (item.link) {
            const link = createEl("a", "interest-link", "Learn more");
            link.href = item.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            card.appendChild(link);
        }
        root.appendChild(card);
    });
}

function renderAviation() {
    const root = document.getElementById("aviation-content");
    const data = beyondData.aviation;

    const intro = createEl("div", "aviation-intro");
    intro.append(
        createEl("span", "aviation-badge", data.license),
        createEl("h3", "", data.headline),
        createEl("p", "aviation-summary", data.summary)
    );
    // Text in the left column, photos in the right (stacked on small screens)
    const info = createEl("div", "aviation-info");
    info.appendChild(intro);
    root.appendChild(info);

    if (data.logbook.length) {
        const stats = createEl("div", "aviation-stats");
        data.logbook.forEach((stat) => {
            const tile = createEl("div", "aviation-stat");
            const value = typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value;
            tile.append(createEl("span", "aviation-stat-value", value), createEl("span", "aviation-stat-label", stat.label));
            stats.appendChild(tile);
        });
        info.appendChild(stats);
    }

    if (data.aircraftFlown.length) {
        const row = createEl("div", "stack-row");
        data.aircraftFlown.forEach((plane) => {
            const pill = createEl("span", "stack-pill", plane.name);
            pill.title = plane.note;
            row.appendChild(pill);
        });
        info.appendChild(aviationSubsection("Aircraft Flown", row));
    }

    if (data.milestones.length) {
        const timeline = createEl("div", "aviation-timeline");
        data.milestones.forEach((milestone) => {
            const entry = createEl("div", "timeline-entry");
            entry.append(
                createEl("span", "timeline-dot"),
                createEl("span", "timeline-label", milestone.label),
                createEl("span", "timeline-date", milestone.date),
                createEl("p", "timeline-desc", milestone.description)
            );
            timeline.appendChild(entry);
        });
        info.appendChild(aviationSubsection("Milestones", timeline));
    }

    if (data.goals.length) {
        const list = createEl("ul", "highlight-list");
        data.goals.forEach((goal) => list.appendChild(createEl("li", "", goal)));
        info.appendChild(aviationSubsection("Aviation Goals", list));
    }

    if (data.photos.length) {
        const photos = createEl("div", "aviation-photos");
        data.photos.forEach((photo, i) => {
            const wrap = createEl("div", "aviation-photo-wrap");
            wrap.addEventListener("click", () => openLightbox(data.photos, i));
            wrap.appendChild(lazyImage(photo.src, photo.alt));
            photos.appendChild(wrap);
        });
        root.appendChild(photos);
    }
}

function aviationSubsection(title, content) {
    const section = createEl("div", "aviation-subsection");
    section.append(createEl("h4", "", title), content);
    return section;
}

function lazyImage(src, alt) {
    const img = createEl("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    return img;
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
            const imgWrap = createEl("div", "travel-image-wrap");
            imgWrap.appendChild(lazyImage(item.image, item.place));
            imgWrap.addEventListener("click", () => openLightbox(travelPhotos, withPhotos.indexOf(item)));
            card.appendChild(imgWrap);
        }

        const info = createEl("div", "travel-info");
        info.append(createEl("h3", "", item.place), createEl("span", "travel-date", item.date), createEl("p", "", item.note));
        if (item.coords) {
            const mapBtn = createEl("button", "travel-map-btn", "View on map");
            mapBtn.type = "button";
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

function renderGallery() {
    const filtersRoot = document.getElementById("gallery-filters");
    if (!beyondData.gallery.length) {
        document.getElementById("gallery-grid").appendChild(createEl("p", "empty-message", "Photos coming soon."));
        return;
    }

    const categories = ["all", ...new Set(beyondData.gallery.map((p) => p.category))];
    categories.forEach((category) => {
        const btn = createEl("button", "gallery-filter-btn", category.charAt(0).toUpperCase() + category.slice(1));
        btn.type = "button";
        if (category === "all") btn.classList.add("active");
        btn.addEventListener("click", () => {
            filtersRoot.querySelectorAll(".gallery-filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
            renderGalleryItems(category);
        });
        filtersRoot.appendChild(btn);
    });
    renderGalleryItems("all");
}

function renderGalleryItems(category) {
    const root = document.getElementById("gallery-grid");
    root.textContent = "";
    const items = category === "all" ? beyondData.gallery : beyondData.gallery.filter((p) => p.category === category);
    items.forEach((photo, i) => {
        const cell = createEl("div", "gallery-cell");
        cell.appendChild(lazyImage(photo.src, photo.alt));
        cell.addEventListener("click", () => openLightbox(items, i));
        root.appendChild(cell);
    });
}

function openLightbox(photos, startIndex) {
    let index = startIndex;
    const overlay = createEl("div", "lightbox-overlay");
    const figure = createEl("figure", "lightbox-figure");
    const img = createEl("img");
    const caption = createEl("figcaption", "lightbox-caption");
    figure.append(img, caption);

    const button = (className, label, text, onClick) => {
        const btn = createEl("button", className, text);
        btn.type = "button";
        btn.setAttribute("aria-label", label);
        btn.addEventListener("click", onClick);
        return btn;
    };
    const closeBtn = button("lightbox-close", "Close", "×", close);
    const prevBtn = button("lightbox-nav lightbox-prev", "Previous photo", "‹", () => show(index - 1));
    const nextBtn = button("lightbox-nav lightbox-next", "Next photo", "›", () => show(index + 1));

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
    }

    function onKey(e) {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(index - 1);
        else if (e.key === "ArrowRight") show(index + 1);
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
