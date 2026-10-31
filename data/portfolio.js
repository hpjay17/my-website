// Content for index.html. Section headings and nav are in the HTML; everything else is here.
const portfolioData = {
    profile: {
        name: "Jay Wang",
        title: "Finance, ISOM, & Data Science · Emory University",
        summary:
            "Pursuing a Bachelor of Business Administration (BBA) in Finance & Information Systems and Operations Management (ISOM) with a Minor in Data Science at Emory University's Goizueta Business School. I work with SQL, Python, R, and Excel to analyze large datasets, uncover trends, and solve real business problems.",
        availability: "Open to opportunities",
        location: "Atlanta, GA",
        email: "jay.wang@emory.edu",
        profileImage: "./images/profile.jpeg",
    },
    socialLinks: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/wangjay17", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
        { label: "GitHub", href: "https://github.com/hpjay17", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>' },
        { label: "Email", href: "mailto:jay.wang@emory.edu", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>' },
        { label: "CV", href: "./files/Website_Resume_Oct2026.pdf", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>' },
    ],

    // speed is pixels per second (30 is calm, 80 is busy). colors are for the up and down arrows.
    ticker: {
    speed: 45,
    colors: { up: "#35e07a", down: "#ff5f5f" },
    items: [
        { symbol: "Emory", text: "Finance + ISOM · Data Science",    change: "up" },
        { symbol: "COF",   text: "Incoming Data Analyst Intern '27", change: "up" },
        { symbol: "TOOLS",  text: "SQL · Python · R · Excel",         change: "up" },
        { symbol: "DUO",   text: "830-day streak",                   change: "up" },
        { symbol: "SLEEP", text: "Exam season",                      change: "down" },
    ],
},

    career: [
        {
            company: "Capital One",
            role: "Incoming Data Analyst Intern",
            period: "Jun 2027 – Aug 2027",
            location: "Richmond, VA",
            stack: ["SQL", "Python", "Tableau", "Power BI"],
            summary: "Will work with data in the FinTech space",
            highlights: [
                "Selected through Capital One’s Analyst Summit and Power Day (case and behavioral interviews) for Summer 2027",
            ],
        },
        {
            company: "Invest Atlanta",
            role: "Student Data Analyst",
            period: "Jan 2026 – May 2026",
            location: "Atlanta, GA",
            stack: ["Excel", "Python", "Tableau", "Power BI"],
            summary: "Performed data cleaning and visualization on Atlanta geographic datasets",
            highlights: [
                "Cleaned and joined four city datasets (121 fresh food locations, USDA low-income/low-access tracts, 17K+ business licenses, tax parcels) using GeoPandas, measuring each census tract’s distance to fresh food access points",
                "Built an OLS regression on poverty, income, and density to predict food access; used residuals to flag tracts underserved beyond their socioeconomic profile",
            ],
        },
        {
            company: "Emory College",
            role: "IT Technician",
            period: "Sep 2024 – May 2026",
            location: "Atlanta, GA",
            stack: ["Excel", "Hardware", "Software Deployment"],
            summary: "Managed hardware setups, software imaging and deployment, and supported robotics operations",
            highlights: [
                "Managed hardware setups, software imaging and deployment, and supported robotics operations, ensuring minimal operational downtime",
                "Tracked and managed IT inventory and surplus equipment using Excel, improving asset utilization and operational efficiency",
            ],
        },
        {
            company: "Techbridge",
            role: "Data Research Intern",
            period: "Jan 2025 – May 2025",
            location: "Atlanta, GA",
            stack: ["Excel", "Python", "Tableau"],
            summary: "Conducted data analytics to tackle food demand issues for social impact and hunger relief",
            highlights: [
                "Utilized data analysis and statistical modeling to predict food demand at the local level by category (vegetables, meat, beverages) and quantity using historical data, supporting inventory planning and supply allocation decisions",
            ],
        },
    ],
    organizations: [
        {
            company: "Blockchain at Emory",
            role: "Chief Research Officer",
            period: "Sep 2025 – Present",
            location: "Atlanta, GA",
            stack: ["Web3", "Crypto", "Research"],
            summary: "Researched legal frameworks and crypto infrastructure",
            highlights: [
                "Researched how legal frameworks and crypto infrastructure shape cross-border digital asset transfers; produced industry reports and investment pitches",
            ],
        },
        {
            company: "Emory Impact Investing Group",
            role: "Director of Technical Research",
            period: "Jan 2026 – May 2026",
            location: "Atlanta, GA",
            stack: ["Excel", "Python", "SQL", "Tableau", "Power BI"],
            summary: "Led technical support across 10+ research teams",
            highlights: [
                "Led technical support for 10+ research teams through weekly office hours on Excel regression, Python/SQL debugging, and Tableau/Power BI dashboards; reviewed all quantitative deliverables before publication",
            ],
        },
        {
            company: "Global Research & Consulting",
            role: "Consulting Analyst",
            period: "Jan 2026 – May 2026",
            location: "Atlanta, GA",
            stack: ["Communication", "Presentation", "Problem Solving"],
            summary: "Conducted market research and data analysis to support client-facing strategy projects",
            highlights: [
                "Advised Denver nonprofit REVEL on social enterprise strategy, evaluating alternative revenue streams and building a prioritized implementation roadmap to reduce reliance on external funding",
            ],
        },
        {
            company: "Residence Hall Association",
            role: "Sustainability Chair",
            period: "Aug 2025 – May 2026",
            location: "Atlanta, GA",
            stack: ["Sustainability Strategy"],
            summary: "Led sustainability initiatives within residence halls",
            highlights: [
                "Coordinated educational campaigns and collaborate with campus facilities to implement recycling drives",
            ],
        },
    ],

    // Browse all icons at https://devicon.dev
    // URL format: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{tech}/{tech}-original.svg
    skills: [
        { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
        { name: "R", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rstudio/rstudio-original.svg" },
        { name: "Excel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" },
        { name: "Tableau", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/minitab/minitab-original.svg" },
        { name: "Power BI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" },
    ],
    projects: [
        {
            name: "Employee Attrition Analysis",
            summary: "Analyzed the key workplace factors that influence employee turnover and provides data-driven recommendations to reduce attrition risk.",
            href: "https://github.com/hpjay17/employee-attrition-analysis",
        },
        {
            name: "Food Demand Prediction",
            summary: "Built statistical models to predict local food demand by category and quantity for Techbridge, supporting nonprofit hunger relief inventory planning.",
            href: "https://github.com/emmacarr23/techbridge24",
        },
        {
            name: "Cross-Border Digital Asset Research",
            summary: "Analyzed legal frameworks and crypto infrastructure shaping cross-border digital asset transfers, producing industry reports and investment pitches.",
            href: "#",
        },
    ],
    certifications: [
        { name: "Dean's List", issuer: "Emory University", date: "Spring 2025", href: "#" },
        { name: "Senatorial Nomination to the U.S. Naval Academy", issuer: "Marco Rubio", date: "Dec 2023", href: "./files/senatenomination.pdf" },
        { name: "Private Pilot License", issuer: "Federal Aviation Administration", date: "March 2023", href: "https://amsrvs.registry.faa.gov/airmeninquiry/" },
    ],
};
