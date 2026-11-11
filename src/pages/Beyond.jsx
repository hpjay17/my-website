import { useEffect, useState } from "react";
import { Aviation } from "../components/Aviation.jsx";
import { Footer } from "../components/Footer.jsx";
import { Gallery } from "../components/Gallery.jsx";
import { Lightbox } from "../components/Lightbox.jsx";
import { Section } from "../components/Section.jsx";
import { TopBar } from "../components/TopBar.jsx";
import { Travel } from "../components/Travel.jsx";
import { beyondData } from "../data/beyond.js";
import { useTheme } from "../hooks/useTheme.js";
import { useTyping } from "../hooks/useTyping.js";
import { newTabProps } from "../utils.js";

const NAV_LINKS = [
    { label: "Portfolio", href: "./index.html" },
    { label: "Interests", target: "interests" },
    { label: "Aviation", target: "aviation" },
    { label: "Travel", target: "travel" },
    { label: "Gallery", target: "gallery" },
];

const HERO_LINE = "When I'm not working with data, here's what keeps me going.";

// The Beyond Work page
export function Beyond() {
    const [theme, setTheme] = useTheme();
    // The photo viewer, shared by three sections: null when closed, or { photos, index }
    const [lightbox, setLightbox] = useState(null);
    const openLightbox = (photos, index) => setLightbox({ photos, index });

    // The green theme types the hero line; the intro screen (public/legacy/gate.js) replays it on closing
    const [typingRun, setTypingRun] = useState(0);
    const heroLine = useTyping(HERO_LINE, theme === "green", 25, typingRun);
    useEffect(() => {
        window.runHackerTyping = () => setTypingRun((run) => run + 1);
    }, []);

    // Each theme has its own intro screen, so switching theme plays the other one
    const changeTheme = (next) => setTheme(next, () => window.playGateIfThemeChanged(next));

    return (
        <div className="page" id="top">
            <main className="shell">
                <TopBar brandHref="./index.html" links={NAV_LINKS} theme={theme} onThemeChange={changeTheme} />
                <Section id="beyond-hero" className="beyond-hero" startVisible>
                    <h1>Beyond Work</h1>
                    <p className={`hero-summary ${heroLine.typing ? "typing typing-cursor" : ""}`}>{heroLine.shown}</p>
                </Section>
                <Section id="interests" title="Interests & Hobbies">
                    <Interests interests={beyondData.interests} />
                </Section>
                <Section id="aviation" title="Aviation">
                    <Aviation aviation={beyondData.aviation} onOpenPhoto={openLightbox} />
                </Section>
                <Section id="travel" title="Travel">
                    <Travel trips={beyondData.travel} onOpenPhoto={openLightbox} />
                </Section>
                <Section id="gallery" title="Photo Gallery">
                    <Gallery photos={beyondData.gallery} onOpenPhoto={openLightbox} />
                </Section>
            </main>
            <Footer />
            {lightbox && (
                <Lightbox photos={lightbox.photos} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
            )}
        </div>
    );
}

function Interests({ interests }) {
    return (
        <div className="interests-grid">
            {interests.map((item) => (
                <div key={item.name} className={`interest-card ${item.icon ? "" : "interest-card--no-icon"}`}>
                    {/* Decorative: the name is right below it */}
                    {item.icon && <img className="interest-icon" src={item.icon} alt="" loading="lazy" />}
                    <h3 className="interest-name">{item.name}</h3>
                    <p className="interest-note">{item.note}</p>
                    {item.link && (
                        <a className="interest-link" href={item.link} {...newTabProps(item.link)}>
                            Learn more
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}
