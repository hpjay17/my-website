// Career and Organizations share the same tab list + sliding detail panel
const tabGroups = {
    career: { items: portfolioData.career, listId: "career-list", detailId: "career-detail", activeIndex: 0, isAnimating: false },
    org: { items: portfolioData.organizations, listId: "org-list", detailId: "org-detail", activeIndex: 0, isAnimating: false },
};

function init() {
    applyProfile();
    renderSocialLinks();
    renderTicker();
    Object.values(tabGroups).forEach((group) => {
        renderTabList(group);
        renderTabDetail(group, 0, false);
    });
    renderSkills();
    renderProjects();
    renderCertifications();
    wireSmoothScrollButtons();
    revealSectionsOnScroll();
}

function applyProfile() {
    const profile = portfolioData.profile;

    document.getElementById("profile-image").src = profile.profileImage;
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-title").textContent = profile.title;
    document.getElementById("profile-summary").textContent = profile.summary;
    document.getElementById("profile-meta").textContent = `${profile.availability} · ${profile.location}`;
    document.getElementById("email-link").href = `mailto:${profile.email}`;
}

// Links starting with http open in a new tab; local files and mailto stay in this one
function openExternalInNewTab(link) {
    if (link.getAttribute("href").startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }
}

function renderSocialLinks() {
    const socialRoot = document.getElementById("social-links");

    portfolioData.socialLinks.forEach((item) => {
        const link = document.createElement("a");
        link.className = "social-link";
        link.href = item.href;
        link.setAttribute("aria-label", item.label);
        link.title = item.label;
        openExternalInNewTab(link);

        const icon = document.createElement("span");
        icon.className = "social-icon";
        icon.innerHTML = item.svg;

        const text = document.createElement("span");
        text.textContent = item.label;

        link.append(icon, text);
        socialRoot.appendChild(link);
    });
}

const TICKER_ARROWS = { up: "▲", down: "▼", flat: "–" };

function renderTicker() {
    const { items, colors } = portfolioData.ticker;
    const strip = document.getElementById("ticker");
    strip.style.setProperty("--ticker-up", colors.up);
    strip.style.setProperty("--ticker-down", colors.down);
    // Screen readers get one plain sentence; the moving copies are hidden from them
    strip.setAttribute("aria-label", items.map((item) => `${item.symbol} ${item.change}: ${item.text}`).join(", "));

    fillTicker();
    window.addEventListener("resize", () => {
        const group = strip.querySelector(".ticker-group");
        if (group.offsetWidth < strip.clientWidth) fillTicker();
    });

    // No point animating while it's scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
        strip.classList.toggle("is-paused", !entry.isIntersecting);
    });
    observer.observe(strip);
}

// The track holds two identical groups, each at least as wide as the strip.
// Sliding left by exactly one group and starting over looks like one endless loop.
function fillTicker() {
    const { items, speed } = portfolioData.ticker;
    const strip = document.getElementById("ticker");
    const track = document.createElement("div");
    track.className = "ticker-track";
    track.setAttribute("aria-hidden", "true");
    const group = document.createElement("div");
    group.className = "ticker-group";
    track.appendChild(group);
    strip.replaceChildren(track);

    // On wide screens one set of items is shorter than the strip, so repeat it until it isn't
    do {
        items.forEach((item) => group.appendChild(createTickerItem(item)));
    } while (group.offsetWidth < strip.clientWidth);

    track.appendChild(group.cloneNode(true));
    track.style.animationDuration = `${group.offsetWidth / speed}s`;
}

function createTickerItem(item) {
    const el = document.createElement("span");
    el.className = `ticker-item ticker-item--${item.change}`;

    const symbol = document.createElement("span");
    symbol.className = "ticker-symbol";
    symbol.textContent = item.symbol;

    const change = document.createElement("span");
    change.className = "ticker-change";
    change.textContent = `${TICKER_ARROWS[item.change]} ${item.text}`;

    el.append(symbol, change);
    return el;
}

function renderTabList(group) {
    const list = document.getElementById(group.listId);

    group.items.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "career-item";
        button.setAttribute("role", "tab");

        const company = document.createElement("span");
        company.className = "company";
        company.textContent = item.company;

        const role = document.createElement("span");
        role.className = "role";
        role.textContent = item.role;

        button.append(company, role);
        button.addEventListener("click", () => {
            if (group.isAnimating || index === group.activeIndex) return;
            renderTabDetail(group, index, true);
        });

        list.appendChild(button);
    });
}

function setActiveTab(group, index) {
    document.getElementById(group.listId).querySelectorAll(".career-item").forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });
}

function createCareerPanel(entry) {
    const panel = document.createElement("article");
    panel.className = "career-panel";

    const title = document.createElement("h3");
    title.className = "career-title";
    title.textContent = entry.company;

    const role = document.createElement("p");
    role.className = "career-role";
    role.textContent = entry.role;

    const meta = document.createElement("p");
    meta.className = "career-meta";
    meta.textContent = `${entry.period} · ${entry.location}`;

    const summary = document.createElement("p");
    summary.className = "career-summary";
    summary.textContent = entry.summary;

    const stackRow = document.createElement("div");
    stackRow.className = "stack-row";
    entry.stack.forEach((tech) => {
        const pill = document.createElement("span");
        pill.className = "stack-pill";
        pill.textContent = tech;
        stackRow.appendChild(pill);
    });

    const highlights = document.createElement("ul");
    highlights.className = "highlight-list";
    entry.highlights.forEach((point) => {
        const item = document.createElement("li");
        item.textContent = point;
        highlights.appendChild(item);
    });

    panel.append(title, role, meta, summary, stackRow, highlights);
    return panel;
}

// Swap the detail panel, sliding up or down depending on which way the user moved in the list
function renderTabDetail(group, nextIndex, animate) {
    const detailRoot = document.getElementById(group.detailId);
    const nextPanel = createCareerPanel(group.items[nextIndex]);
    const currentPanel = detailRoot.firstElementChild;
    setActiveTab(group, nextIndex);

    const finish = () => {
        detailRoot.replaceChildren(nextPanel);
        nextPanel.classList.remove("overlay-panel");
        group.activeIndex = nextIndex;
        group.isAnimating = false;
    };

    if (!animate || !currentPanel) {
        finish();
        return;
    }

    group.isAnimating = true;
    detailRoot.appendChild(nextPanel);
    nextPanel.classList.add("overlay-panel");

    const offset = nextIndex > group.activeIndex ? 26 : -26;
    const timing = { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" };
    const outAnimation = currentPanel.animate(
        [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: `translateY(${-offset}px)` },
        ],
        timing
    );
    const inAnimation = nextPanel.animate(
        [
            { opacity: 0, transform: `translateY(${offset}px)` },
            { opacity: 1, transform: "translateY(0)" },
        ],
        timing
    );

    Promise.all([outAnimation.finished, inAnimation.finished]).then(finish, finish);
}

function renderSkills() {
    const skillsRoot = document.getElementById("skills-grid");

    portfolioData.skills.forEach((skill) => {
        const pill = document.createElement("span");
        pill.className = "skill-pill";

        const icon = document.createElement("img");
        icon.src = skill.icon;
        icon.alt = skill.name;
        icon.loading = "lazy";

        pill.append(icon, document.createTextNode(skill.name));
        skillsRoot.appendChild(pill);
    });
}

function projectPlaceholder(theme) {
    return `./images/project-placeholder-${theme}.svg`;
}

function renderProjects() {
    const root = document.getElementById("project-grid");
    const projects = portfolioData.projects;
    if (!projects.length) return;
    let current = 0;

    const carousel = document.createElement("div");
    carousel.className = "project-carousel";

    const card = document.createElement("div");
    card.className = "project-card";
    carousel.appendChild(card);

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-arrow carousel-prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous project");
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-arrow carousel-next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next project");
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';

    carousel.append(prevBtn, nextBtn);

    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    projects.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Go to project ${i + 1}`);
        dot.addEventListener("click", () => goToProject(i));
        dots.appendChild(dot);
    });
    carousel.appendChild(dots);

    root.appendChild(carousel);

    function fillCard(project) {
        card.textContent = "";

        const imgWrap = document.createElement("div");
        imgWrap.className = "project-image-wrap";
        const img = document.createElement("img");
        img.src = project.image || projectPlaceholder(currentTheme());
        if (!project.image) img.dataset.placeholder = "true";
        img.alt = project.name;
        imgWrap.appendChild(img);

        const info = document.createElement("div");
        info.className = "project-info";

        const title = document.createElement("h3");
        title.textContent = project.name;

        const summary = document.createElement("p");
        summary.textContent = project.summary;

        const link = document.createElement("a");
        link.className = "project-source";
        link.href = project.href;
        link.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Source';
        openExternalInNewTab(link);

        info.append(title, summary, link);
        card.append(imgWrap, info);
    }

    function goToProject(index) {
        current = (index + projects.length) % projects.length;
        fillCard(projects[current]);
        dots.querySelectorAll(".carousel-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
        });
    }

    prevBtn.addEventListener("click", () => goToProject(current - 1));
    nextBtn.addEventListener("click", () => goToProject(current + 1));

    goToProject(0);
}

function renderCertifications() {
    const certRoot = document.getElementById("cert-list");

    portfolioData.certifications.forEach((cert) => {
        const row = document.createElement("a");
        row.className = "cert-row";
        row.href = cert.href;
        openExternalInNewTab(row);

        const textWrap = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = cert.name;
        const subtitle = document.createElement("p");
        subtitle.textContent = `${cert.issuer} · ${cert.date}`;
        textWrap.append(title, subtitle);

        const arrow = document.createElement("span");
        arrow.className = "arrow";
        arrow.textContent = "->";

        row.append(textWrap, arrow);
        certRoot.appendChild(row);
    });
}

function onThemeChange(theme) {
    // Project placeholders come in a version per theme
    document.querySelectorAll('.project-image-wrap img[data-placeholder="true"]').forEach((img) => {
        img.src = projectPlaceholder(theme);
    });
    // The green theme's monospace font is wider, so the ticker needs re-measuring
    fillTicker();
    runHackerTyping();
}

// Green theme types out the title; other themes show it instantly
function runHackerTyping() {
    clearTyping();
    const titleEl = document.getElementById("profile-title");
    const summaryEl = document.getElementById("profile-summary");
    const { title, summary } = portfolioData.profile;

    resetTyping(summaryEl, summary);
    if (currentTheme() === "green") typeText(titleEl, title, 35);
    else resetTyping(titleEl, title);
}

wireThemeSwitcher(onThemeChange);
init();
runHackerTyping();
