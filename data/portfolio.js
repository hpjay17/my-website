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
    // icon: linkedin, github, email or document (drawn in js/portfolio.js)
    socialLinks: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/wangjay17", icon: "linkedin" },
        { label: "GitHub", href: "https://github.com/hpjay17", icon: "github" },
        { label: "Email", href: "mailto:jay.wang@emory.edu", icon: "email" },
        { label: "CV", href: "./files/Website_Resume_Oct2026.pdf", icon: "document" },
    ],
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
            company: "Hartsfield-Jackson Atlanta International Airport",
            role: "Internal Audit Intern",
            period: "May 2026 – Jul 2026",
            location: "Atlanta, GA",
            stack: ["Internal Audit", "Excel", "Financial Analysis"],
            summary: "Contract and compliance auditing for the world’s busiest airport",
            highlights: [
                "Audited an $18M airfield contract, reviewing payments, invoices, and insurance compliance; designed the audit program and interviewed the contractor",
                "Led a concourse-wide sustainability audit of food & beverage concessions, raising Sustainable Food Court Initiative compliance from 37% to 58%",
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
                "Coordinated educational campaigns and collaborated with campus facilities to implement recycling drives",
            ],
        },
    ],

    // icon: database, code, lineChart, table, barChart or pieChart (drawn in js/portfolio.js)
    skills: [
        { name: "SQL", icon: "database" },
        { name: "Python", icon: "code" },
        { name: "R", icon: "lineChart" },
        { name: "Excel", icon: "table" },
        { name: "Tableau", icon: "barChart" },
        { name: "Power BI", icon: "pieChart" },
    ],
    // href: a link to the code or write-up, or "" for none. The same goes for certifications.
    projects: [
        {
            name: "Employee Attrition Analysis",
            summary: "Analyzed the key workplace factors that influence employee turnover and provided data-driven recommendations to reduce attrition risk.",
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
            href: "",
        },
    ],
    certifications: [
        { name: "Dean's List", issuer: "Emory University", date: "Spring 2025", href: "" },
        { name: "Senatorial Nomination to the U.S. Naval Academy", issuer: "Marco Rubio", date: "Dec 2023", href: "./files/senatenomination.pdf" },
        { name: "Private Pilot License", issuer: "Federal Aviation Administration", date: "March 2023", href: "https://amsrvs.registry.faa.gov/airmeninquiry/" },
    ],
};
