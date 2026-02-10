const templateData = {
    profile: {
        name: "Jay Wang",
        title: "Finance & Data Science · Emory University",
        summary:
            "Bachelor of Business Administration (BBA) student at Emory's Goizueta Business School studying Finance and Data Science. I'm passionate about financial data analysis, exploring large datasets, and developing solutions that turn insights into real business impact.",
        availability: "Open to opportunities",
        location: "Atlanta, GA",
        email: "jay.wang@emory.edu",
        profileImage: "./images/profile.jpeg",
    },
    socialLinks: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/wangjay17", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
        { label: "GitHub", href: "https://github.com/hpjay17", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>' },
        { label: "Email", href: "mailto:jay.wang@emory.edu", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>' },
        { label: "CV", href: "#", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>' },
        //remember to replace # with ./files/Website_Resume_Feb2026.pdf
    ],
    career: [
        {
            company: "Invest Atlanta",
            role: "Student Data Analyst",
            period: "Jan 2026 – May 2026",
            location: "Atlanta, GA",
            stack: ["Excel", "Python", "Tableau", "Power BI"],
            summary: "Performed data cleaning and visualization on Atlanta geographic datasets",
            highlights: [
                "Handled missing values and creating interactive maps and statistical charts to reveal patterns in urban development.",
                "Conducted geospatial analysis using Python (GeoPandas, Matplotlib) to analyze economic/development patterns, identifying key investment zones based on demographic trends",
            ],
        },
        {
            company: "Emory College IT Business Operations",
            role: "IT Technician",
            period: "Sep 2024 – Present",
            location: "Atlanta, GA",
            stack: ["Excel", "Hardware", "Software Deployment"],
            summary: "Managed hardware setups, software imaging and deployment, and supported robotics operations.",
            highlights: [
                "Managed hardware setups, software imaging and deployment, and supported robotics operations, ensuring minimal operational downtime.",
                "Tracked and managed IT inventory and surplus equipment using Excel, improving asset utilization and operational efficiency.",
            ],
        },
        {
            company: "Techbridge",
            role: "Student Data Analyst",
            period: "Jan 2025 – May 2025",
            location: "Atlanta, GA",
            stack: ["Excel", "Python", "Tableau", "Power BI"],
            summary: "Conducted data analytics to tackle food demand issues for a nonprofit focused on technology for social impact and hunger relief.",
            highlights: [
                "Utilized data analysis and statistical modeling to predict food demand at the local level by category (vegetables, meat, beverages) and quantity using historical data.",
                "Supported inventory planning and supply allocation decisions through predictive analytics.",
            ],
        },
    ],
    organizations: [
        {
            company: "Emory Impact Investing Group",
            role: "Director of Technical Research",
            period: "Jan 2026 – Present",
            location: "Atlanta, GA",
            stack: ["Excel", "Python", "SQL", "Tableau", "Power BI"],
            summary: "Led technical support across 10+ research teams, ensuring quantitative deliverables meet professional standards.",
            highlights: [
                "Held technical office hours to help teams with Excel regression models, debug Python and SQL workflows, and refine Tableau and Power BI dashboards.",
                "Graded teams' quantitative deliverables, ensuring data collection, regression analysis, and final visualizations meet professional standards.",
            ],
        },
        {
            company: "Global Research & Consulting",
            role: "Consulting Analyst",
            period: "Jan 2026 – Present",
            location: "Atlanta, GA",
            stack: ["Communication", "Presentation", "Problem Solving"],
            summary: "...",
            highlights: [
                "...",
                "...",
            ],
        },
        {
            company: "Blockchain at Emory",
            role: "Research & Investment Analyst",
            period: "Sep 2025 – Present",
            location: "Atlanta, GA",
            stack: ["Research"],
            summary: "Researched legal frameworks and crypto infrastructure shaping cross-border digital asset transfers.",
            highlights: [
                "Researched how legal frameworks and crypto infrastructure shape cross-border digital asset transfers.",
                "Conducted both qualitative and quantitative analysis developing industry reports and investment pitches.",
            ],
        },
        {
            company: "Residence Hall Association",
            role: "Sustainability Chair",
            period: "Aug 2025 – Present",
            location: "Atlanta, GA",
            stack: ["Sustainability Strategy"],
            summary: "Led sustainability initiatives within residence halls, promoting energy efficiency and waste reduction.",
            highlights: [
                "Coordinated educational campaigns and collaborate with campus facilities to implement recycling drives.",
            ],
        },
    ],

    // Add your skills. Each needs a name and a Devicon SVG URL.
    // Browse all icons at https://devicon.dev
    // URL format: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{tech}/{tech}-original.svg
    skills: [
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
        { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
        { name: "R", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rstudio/rstudio-original.svg" },
        { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
        { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
        { name: "Tableau", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/minitab/minitab-original.svg" },
        { name: "Excel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" },
        { name: "Power BI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" },
        { name: "Photoshop", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg" },
        { name: "Illustrator", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-original.svg" },
    ],
    projects: [
        {
            name: "Employee Attrition Analysis",
            summary: "Analyzed the key workplace factors that influence employee turnover and provides data-driven recommendations to reduce attrition risk.",
            image: "./images/project-placeholder.svg",
            href: "https://github.com/hpjay17/employee-attrition-analysis",
        },
        {
            name: "Food Demand Prediction",
            summary: "Built statistical models to predict local food demand by category and quantity for Techbridge, supporting nonprofit hunger relief inventory planning.",
            image: "./images/project-placeholder.svg",
            href: "https://github.com/emmacarr23/techbridge24",
        },
        {
            name: "Cross-Border Digital Asset Research",
            summary: "Analyzed legal frameworks and crypto infrastructure shaping cross-border digital asset transfers, producing industry reports and investment pitches.",
            image: "./images/project-placeholder.svg",
            href: "#",
        },
    ],
    certifications: [
        { name: "Dean's List", issuer: "Emory University", date: "Spring 2025", href: "#" },
        { name: "Senatorial Nomination to the U.S. Naval Academy", issuer: "Marco Rubio", date: "Dec 2023", href: "./files/senatenomination.pdf" },
        { name: "Private Pilot License", issuer: "Federal Aviation Administration", date: "March 2023", href: "https://amsrvs.registry.faa.gov/airmeninquiry/" },
    ],
};

const state = {
    activeCareerIndex: 0,
    isAnimatingCareer: false,
    activeOrgIndex: 0,
    isAnimatingOrg: false,
    activeProjectIndex: 0,
};

function init() {
    applyProfile();
    renderSocialLinks();
    renderCareerList();
    renderCareerDetail(0, false);
    renderOrgList();
    renderOrgDetail(0, false);
    renderSkills();
    renderProjects();
    renderCertifications();
    wireSmoothScrollButtons();
    revealSectionsOnScroll();
}

function applyProfile() {
    const profile = templateData.profile;

    const profileImage = document.getElementById("profile-image");
    profileImage.src = profile.profileImage || "./images/profile.jpeg";
    profileImage.addEventListener("error", () => {
        profileImage.src = "./images/profile.jpeg";
    });

    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-title").textContent = profile.title;
    document.getElementById("profile-summary").textContent = profile.summary;
    document.getElementById("profile-meta").textContent = `${profile.availability} · ${profile.location}`;

    const emailLink = document.getElementById("email-link");
    emailLink.href = `mailto:${profile.email}`;
}

function renderSocialLinks() {
    const socialRoot = document.getElementById("social-links");
    socialRoot.textContent = "";

    templateData.socialLinks.forEach((item) => {
        const link = document.createElement("a");
        link.className = "social-link";
        link.href = item.href;
        link.setAttribute("aria-label", item.label);
        link.title = item.label;

        if (item.href.startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }

        const icon = document.createElement("span");
        icon.className = "social-icon";
        icon.innerHTML = item.svg;

        const text = document.createElement("span");
        text.textContent = item.label;

        link.append(icon, text);
        socialRoot.appendChild(link);
    });
}

function renderCareerList() {
    const careerList = document.getElementById("career-list");
    careerList.textContent = "";

    templateData.career.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `career-item${index === state.activeCareerIndex ? " active" : ""}`;
        button.dataset.index = String(index);
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", index === state.activeCareerIndex ? "true" : "false");

        const company = document.createElement("span");
        company.className = "company";
        company.textContent = item.company;

        const role = document.createElement("span");
        role.className = "role";
        role.textContent = item.role;

        button.append(company, role);
        button.addEventListener("click", () => {
            if (state.isAnimatingCareer || index === state.activeCareerIndex) return;
            setActiveCareerButton(index);
            renderCareerDetail(index, true);
        });

        careerList.appendChild(button);
    });
}

function setActiveCareerButton(index) {
    const buttons = document.querySelectorAll(".career-item");
    buttons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
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

function renderCareerDetail(nextIndex, animate = true) {
    const detailRoot = document.getElementById("career-detail");
    const nextPanel = createCareerPanel(templateData.career[nextIndex]);
    const currentPanel = detailRoot.firstElementChild;

    if (!animate || !currentPanel) {
        detailRoot.replaceChildren(nextPanel);
        state.activeCareerIndex = nextIndex;
        return;
    }

    state.isAnimatingCareer = true;
    detailRoot.appendChild(nextPanel);
    nextPanel.classList.add("overlay-panel");

    const direction = nextIndex > state.activeCareerIndex ? 1 : -1;
    const offset = direction > 0 ? 26 : -26;

    if (typeof currentPanel.animate !== "function" || typeof nextPanel.animate !== "function") {
        detailRoot.replaceChildren(nextPanel);
        nextPanel.classList.remove("overlay-panel");
        state.activeCareerIndex = nextIndex;
        state.isAnimatingCareer = false;
        return;
    }

    const outAnimation = currentPanel.animate(
        [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: `translateY(${-offset}px)` },
        ],
        {
            duration: 280,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
        }
    );

    const inAnimation = nextPanel.animate(
        [
            { opacity: 0, transform: `translateY(${offset}px)` },
            { opacity: 1, transform: "translateY(0)" },
        ],
        {
            duration: 280,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
        }
    );

    Promise.all([outAnimation.finished, inAnimation.finished])
        .then(() => {
            currentPanel.remove();
            nextPanel.classList.remove("overlay-panel");
            state.activeCareerIndex = nextIndex;
            state.isAnimatingCareer = false;
        })
        .catch(() => {
            detailRoot.replaceChildren(nextPanel);
            nextPanel.classList.remove("overlay-panel");
            state.activeCareerIndex = nextIndex;
            state.isAnimatingCareer = false;
        });
}

function renderOrgList() {
    const orgList = document.getElementById("org-list");
    orgList.textContent = "";

    templateData.organizations.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `career-item${index === state.activeOrgIndex ? " active" : ""}`;
        button.dataset.index = String(index);
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", index === state.activeOrgIndex ? "true" : "false");

        const company = document.createElement("span");
        company.className = "company";
        company.textContent = item.company;

        const role = document.createElement("span");
        role.className = "role";
        role.textContent = item.role;

        button.append(company, role);
        button.addEventListener("click", () => {
            if (state.isAnimatingOrg || index === state.activeOrgIndex) return;
            setActiveOrgButton(index);
            renderOrgDetail(index, true);
        });

        orgList.appendChild(button);
    });
}

function setActiveOrgButton(index) {
    const buttons = document.querySelectorAll("#org-list .career-item");
    buttons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
}

function renderOrgDetail(nextIndex, animate = true) {
    const detailRoot = document.getElementById("org-detail");
    const nextPanel = createCareerPanel(templateData.organizations[nextIndex]);
    const currentPanel = detailRoot.firstElementChild;

    if (!animate || !currentPanel) {
        detailRoot.replaceChildren(nextPanel);
        state.activeOrgIndex = nextIndex;
        return;
    }

    state.isAnimatingOrg = true;
    detailRoot.appendChild(nextPanel);
    nextPanel.classList.add("overlay-panel");

    const direction = nextIndex > state.activeOrgIndex ? 1 : -1;
    const offset = direction > 0 ? 26 : -26;

    if (typeof currentPanel.animate !== "function" || typeof nextPanel.animate !== "function") {
        detailRoot.replaceChildren(nextPanel);
        nextPanel.classList.remove("overlay-panel");
        state.activeOrgIndex = nextIndex;
        state.isAnimatingOrg = false;
        return;
    }

    const outAnimation = currentPanel.animate(
        [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: `translateY(${-offset}px)` },
        ],
        {
            duration: 280,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
        }
    );

    const inAnimation = nextPanel.animate(
        [
            { opacity: 0, transform: `translateY(${offset}px)` },
            { opacity: 1, transform: "translateY(0)" },
        ],
        {
            duration: 280,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
        }
    );

    Promise.all([outAnimation.finished, inAnimation.finished])
        .then(() => {
            currentPanel.remove();
            nextPanel.classList.remove("overlay-panel");
            state.activeOrgIndex = nextIndex;
            state.isAnimatingOrg = false;
        })
        .catch(() => {
            detailRoot.replaceChildren(nextPanel);
            nextPanel.classList.remove("overlay-panel");
            state.activeOrgIndex = nextIndex;
            state.isAnimatingOrg = false;
        });
}

function renderSkills() {
    const skillsRoot = document.getElementById("skills-grid");
    skillsRoot.textContent = "";

    templateData.skills.forEach((skill) => {
        const pill = document.createElement("span");
        pill.className = "skill-pill";

        const icon = document.createElement("img");
        icon.src = skill.icon;
        icon.alt = skill.name;
        icon.loading = "lazy";

        const label = document.createTextNode(skill.name);

        pill.append(icon, label);
        skillsRoot.appendChild(pill);
    });
}

function renderProjects() {
    const root = document.getElementById("project-grid");
    root.textContent = "";

    const projects = templateData.projects;
    if (!projects.length) return;

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
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to project ${i + 1}`);
        dot.addEventListener("click", () => goToProject(i));
        dots.appendChild(dot);
    });
    carousel.appendChild(dots);

    const showAll = document.createElement("button");
    showAll.type = "button";
    showAll.className = "btn btn-ghost carousel-show-all";
    showAll.textContent = "Show All Projects";
    carousel.appendChild(showAll);

    root.appendChild(carousel);

    function fillCard(index) {
        const project = projects[index];
        card.innerHTML = "";

        const imgWrap = document.createElement("div");
        imgWrap.className = "project-image-wrap";
        const img = document.createElement("img");
        const currentTheme = document.documentElement.getAttribute("data-theme") || "blue";
        img.src = project.image === "./images/project-placeholder.svg"
            ? `./images/project-placeholder-${currentTheme}.svg`
            : project.image;
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
        if (project.href.startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }

        info.append(title, summary, link);
        card.append(imgWrap, info);
    }

    function goToProject(index) {
        state.activeProjectIndex = index;
        fillCard(index);
        dots.querySelectorAll(".carousel-dot").forEach((d, i) => {
            d.classList.toggle("active", i === index);
        });
    }

    prevBtn.addEventListener("click", () => {
        const next = (state.activeProjectIndex - 1 + projects.length) % projects.length;
        goToProject(next);
    });

    nextBtn.addEventListener("click", () => {
        const next = (state.activeProjectIndex + 1) % projects.length;
        goToProject(next);
    });

    fillCard(0);
}

function renderCertifications() {
    const certRoot = document.getElementById("cert-list");
    certRoot.textContent = "";

    templateData.certifications.forEach((cert) => {
        const row = document.createElement("a");
        row.className = "cert-row";
        row.href = cert.href;
        if (cert.href.startsWith("http")) {
            row.target = "_blank";
            row.rel = "noopener noreferrer";
        }

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
            document.querySelectorAll(".project-image-wrap img").forEach((img) => {
                if (img.src.includes("project-placeholder")) {
                    img.src = `./images/project-placeholder-${theme}.svg`;
                }
            });
        });
    });
}

init();
wireThemeSwitcher();
