import { Footer } from "../components/Footer.jsx";
import { Hero } from "../components/Hero.jsx";
import { Projects } from "../components/Projects.jsx";
import { Section } from "../components/Section.jsx";
import { Skills } from "../components/Skills.jsx";
import { TabSection } from "../components/TabSection.jsx";
import { TopBar } from "../components/TopBar.jsx";
import { portfolioData } from "../data/portfolio.js";
import { useTheme } from "../hooks/useTheme.js";
import { newTabProps } from "../utils.js";

const NAV_LINKS = [
    { label: "Career", target: "career" },
    { label: "Orgs", target: "organizations" },
    { label: "Skills", target: "skills" },
    { label: "Projects", target: "projects" },
    { label: "Certs", target: "certifications" },
    { label: "Beyond Work", href: "./beyond.html" },
];

// The portfolio page
export function Portfolio() {
    const [theme, setTheme] = useTheme();

    return (
        <div className="page" id="top">
            <main className="shell">
                <TopBar links={NAV_LINKS} theme={theme} onThemeChange={setTheme} />
                <Hero profile={portfolioData.profile} socialLinks={portfolioData.socialLinks} theme={theme} />
                <Section id="career" title="Career">
                    <TabSection items={portfolioData.career} label="Career timeline" panelId="career-detail" />
                </Section>
                <Section id="organizations" title="Clubs & Organizations">
                    <TabSection items={portfolioData.organizations} label="Organizations" panelId="org-detail" />
                </Section>
                <Section id="skills" title="Skills">
                    <Skills skills={portfolioData.skills} />
                </Section>
                <Section id="projects" title="Projects">
                    <Projects projects={portfolioData.projects} theme={theme} />
                </Section>
                <Section id="certifications" title="Awards & Certifications">
                    <Certifications certifications={portfolioData.certifications} />
                </Section>
            </main>
            <Footer />
        </div>
    );
}

// Only rows with something to open are links
function Certifications({ certifications }) {
    return (
        <div className="cert-list">
            {certifications.map((cert) => {
                const text = (
                    <div>
                        <h3>{cert.name}</h3>
                        <p>
                            {cert.issuer} · {cert.date}
                        </p>
                    </div>
                );
                return cert.href ? (
                    <a key={cert.name} className="cert-row" href={cert.href} {...newTabProps(cert.href)}>
                        {text}
                        <span className="arrow" aria-hidden="true">
                            →
                        </span>
                    </a>
                ) : (
                    <div key={cert.name} className="cert-row">
                        {text}
                    </div>
                );
            })}
        </div>
    );
}
