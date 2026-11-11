import { portfolioData } from "../data/portfolio.js";
import { Footer } from "../shared/Footer.jsx";
import { Section } from "../shared/Section.jsx";
import { TopBar } from "../shared/TopBar.jsx";
import { useTheme } from "../shared/useTheme.js";
import { Certifications } from "./Certifications.jsx";
import { Hero } from "./Hero.jsx";
import { Projects } from "./Projects.jsx";
import { Skills } from "./Skills.jsx";
import { TabSection } from "./TabSection.jsx";

const NAV_LINKS = [
    { label: "Career", target: "career" },
    { label: "Orgs", target: "organizations" },
    { label: "Skills", target: "skills" },
    { label: "Projects", target: "projects" },
    { label: "Certs", target: "certifications" },
    { label: "Beyond Work", href: "./beyond.html" },
];

// The whole portfolio page. Each <Tag /> below is a component: a function in its own file that
// returns a piece of the page. The values passed in (theme={theme}) are called props.
export function App() {
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
