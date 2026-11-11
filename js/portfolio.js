/* Portfolio page (index.html): profile, career and organization tabs, skills, projects, certifications */

// Inline SVG icons on a 24-unit grid, colored by the text around them. Brand and social icons are filled;
// the rest are 2-unit lines. Data files pick them by name (icon: "linkedin").
const filledIcon = (shapes) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${shapes}</svg>`;
const lineIcon = (shapes) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes}</svg>`;

const ICONS = {
    linkedin: filledIcon('<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'),
    github: filledIcon('<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>'),
    email: filledIcon('<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>'),
    document: filledIcon('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>'),
    chevronLeft: lineIcon('<path d="M15 18l-6-6 6-6"/>'),
    chevronRight: lineIcon('<path d="M9 18l6-6-6-6"/>'),
    externalLink: lineIcon('<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
    database: lineIcon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>'),
    code: lineIcon('<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>'),
    lineChart: lineIcon('<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 6-7"/>'),
    table: lineIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),
    barChart: lineIcon('<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V7M18 17v-8"/>'),
    pieChart: lineIcon('<path d="M21 12a9 9 0 11-9-9v9z"/><path d="M16 3.5A9 9 0 0120.5 8H16z"/>'),
};

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

    const facts = document.getElementById("profile-facts");
    profile.facts.forEach((fact) => {
        const value = createEl("dd", "", fact.value);
        if (fact.detail) value.appendChild(createEl("span", "", fact.detail));
        const item = createEl("div", "hero-fact");
        item.append(createEl("dt", "", fact.label), value);
        facts.appendChild(item);
    });
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
        icon.innerHTML = ICONS[item.icon];
        link.append(icon, createEl("span", "", item.label));
        root.appendChild(link);
    });
}

function renderTabList(group) {
    const list = document.getElementById(group.listId);
    group.items.forEach((item, index) => {
        const button = createButton("career-item", "", () => {
            if (group.isAnimating || index === group.activeIndex) return;
            renderTabDetail(group, index, true);
        });
        button.setAttribute("role", "tab");
        button.setAttribute("aria-controls", group.detailId);
        button.append(createEl("span", "company", item.company), createEl("span", "role", item.role));
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
        const pill = createEl("span", "skill-pill");
        pill.innerHTML = ICONS[skill.icon];
        pill.append(skill.name);
        root.appendChild(pill);
    });
}

function projectPlaceholder(theme) {
    return `./images/project-placeholder-${theme}.svg`;
}

// A carousel showing one project at a time
function renderProjects() {
    const root = document.getElementById("project-grid");
    const projects = portfolioData.projects;
    if (!projects.length) return;
    let current = 0;

    const card = createEl("div", "project-card");
    const dots = createEl("div", "carousel-dots");
    const goToProject = (index) => {
        current = (index + projects.length) % projects.length;
        card.replaceChildren(...projectCardParts(projects[current]));
        dots.querySelectorAll(".carousel-dot").forEach((dot, i) => dot.classList.toggle("active", i === current));
    };
    const arrow = (className, icon, label, step) => {
        const btn = createButton(`carousel-arrow ${className}`, "", () => goToProject(current + step), label);
        btn.innerHTML = icon;
        return btn;
    };
    projects.forEach((_, i) => {
        dots.appendChild(createButton("carousel-dot", "", () => goToProject(i), `Go to project ${i + 1}`));
    });

    const carousel = createEl("div", "project-carousel");
    carousel.append(
        card,
        arrow("carousel-prev", ICONS.chevronLeft, "Previous project", -1),
        arrow("carousel-next", ICONS.chevronRight, "Next project", 1),
        dots
    );
    root.appendChild(carousel);
    goToProject(0);
}

function projectCardParts(project) {
    const img = lazyImage(project.image || projectPlaceholder(currentTheme()), project.name);
    if (!project.image) {
        img.dataset.placeholder = "true";
        // The placeholder's size, so its space is held while it loads
        img.width = 960;
        img.height = 540;
    }
    const imgWrap = createEl("div", "project-image-wrap");
    imgWrap.appendChild(img);

    const info = createEl("div", "project-info");
    info.append(createEl("h3", "", project.name), createEl("p", "", project.summary));
    if (project.href) {
        const link = createEl("a", "project-source");
        link.href = project.href;
        link.innerHTML = `${ICONS.externalLink} Source`;
        openExternalInNewTab(link);
        info.appendChild(link);
    }
    return [imgWrap, info];
}

function renderCertifications() {
    const root = document.getElementById("cert-list");
    portfolioData.certifications.forEach((cert) => {
        const text = createEl("div");
        text.append(createEl("h3", "", cert.name), createEl("p", "", `${cert.issuer} · ${cert.date}`));
        // Only rows with something to open are links
        const row = createEl(cert.href ? "a" : "div", "cert-row");
        row.appendChild(text);
        if (cert.href) {
            row.href = cert.href;
            openExternalInNewTab(row);
            const arrow = createEl("span", "arrow", "→");
            arrow.setAttribute("aria-hidden", "true");
            row.appendChild(arrow);
        }
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
