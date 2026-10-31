/* Portfolio page (index.html): profile, career and organization tabs, skills, projects, certifications */

// Career and Organizations share the same tab list and sliding detail panel
const tabGroups = {
    career: { items: portfolioData.career, listId: "career-list", detailId: "career-detail", activeIndex: 0, isAnimating: false },
    org: { items: portfolioData.organizations, listId: "org-list", detailId: "org-detail", activeIndex: 0, isAnimating: false },
};

function init() {
    applyProfile();
    renderSocialLinks();
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
    const root = document.getElementById("social-links");
    portfolioData.socialLinks.forEach((item) => {
        const link = createEl("a", "social-link");
        link.href = item.href;
        link.setAttribute("aria-label", item.label);
        link.title = item.label;
        openExternalInNewTab(link);

        const icon = createEl("span", "social-icon");
        icon.innerHTML = item.svg;
        link.append(icon, createEl("span", "", item.label));
        root.appendChild(link);
    });
}

function renderTabList(group) {
    const list = document.getElementById(group.listId);
    group.items.forEach((item, index) => {
        const button = createEl("button", "career-item");
        button.type = "button";
        button.setAttribute("role", "tab");
        button.append(createEl("span", "company", item.company), createEl("span", "role", item.role));
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
    const stack = createEl("div", "stack-row");
    entry.stack.forEach((tech) => stack.appendChild(createEl("span", "stack-pill", tech)));
    const highlights = createEl("ul", "highlight-list");
    entry.highlights.forEach((point) => highlights.appendChild(createEl("li", "", point)));

    const panel = createEl("article", "career-panel");
    panel.append(
        createEl("h3", "career-title", entry.company),
        createEl("p", "career-role", entry.role),
        createEl("p", "career-meta", `${entry.period} · ${entry.location}`),
        createEl("p", "career-summary", entry.summary),
        stack,
        highlights
    );
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
    const root = document.getElementById("skills-grid");
    portfolioData.skills.forEach((skill) => {
        const icon = createEl("img");
        icon.src = skill.icon;
        icon.alt = skill.name;
        icon.loading = "lazy";
        const pill = createEl("span", "skill-pill");
        pill.append(icon, skill.name);
        root.appendChild(pill);
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

    const card = createEl("div", "project-card");
    const arrow = (className, label, path, onClick) => {
        const btn = createEl("button", `carousel-arrow ${className}`);
        btn.type = "button";
        btn.setAttribute("aria-label", label);
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${path}"/></svg>`;
        btn.addEventListener("click", onClick);
        return btn;
    };
    const dots = createEl("div", "carousel-dots");
    projects.forEach((_, i) => {
        const dot = createEl("button", "carousel-dot");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to project ${i + 1}`);
        dot.addEventListener("click", () => goToProject(i));
        dots.appendChild(dot);
    });

    const carousel = createEl("div", "project-carousel");
    carousel.append(
        card,
        arrow("carousel-prev", "Previous project", "M15 18l-6-6 6-6", () => goToProject(current - 1)),
        arrow("carousel-next", "Next project", "M9 18l6-6-6-6", () => goToProject(current + 1)),
        dots
    );
    root.appendChild(carousel);

    function fillCard(project) {
        const img = createEl("img");
        img.src = project.image || projectPlaceholder(currentTheme());
        if (!project.image) img.dataset.placeholder = "true";
        img.alt = project.name;
        const imgWrap = createEl("div", "project-image-wrap");
        imgWrap.appendChild(img);

        const link = createEl("a", "project-source");
        link.href = project.href;
        link.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Source';
        openExternalInNewTab(link);
        const info = createEl("div", "project-info");
        info.append(createEl("h3", "", project.name), createEl("p", "", project.summary), link);

        card.replaceChildren(imgWrap, info);
    }

    function goToProject(index) {
        current = (index + projects.length) % projects.length;
        fillCard(projects[current]);
        dots.querySelectorAll(".carousel-dot").forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    goToProject(0);
}

function renderCertifications() {
    const root = document.getElementById("cert-list");
    portfolioData.certifications.forEach((cert) => {
        const row = createEl("a", "cert-row");
        row.href = cert.href;
        openExternalInNewTab(row);
        const text = createEl("div");
        text.append(createEl("h3", "", cert.name), createEl("p", "", `${cert.issuer} · ${cert.date}`));
        row.append(text, createEl("span", "arrow", "->"));
        root.appendChild(row);
    });
}

function onThemeChange(theme) {
    // Project placeholders come in a version per theme
    document.querySelectorAll('.project-image-wrap img[data-placeholder="true"]').forEach((img) => {
        img.src = projectPlaceholder(theme);
    });
    runHackerTyping();
}

// The green theme types out the title; the blue one shows it at once
function runHackerTyping() {
    clearTyping();
    const { title, summary } = portfolioData.profile;
    const titleEl = document.getElementById("profile-title");
    resetTyping(document.getElementById("profile-summary"), summary);
    if (currentTheme() === "green") typeText(titleEl, title, 35);
    else resetTyping(titleEl, title);
}

wireThemeSwitcher(onThemeChange);
init();
runHackerTyping();
