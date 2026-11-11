import { useEffect, useState } from "react";
import { beyondData } from "../data/beyond.js";
import { Footer } from "../shared/Footer.jsx";
import { Section } from "../shared/Section.jsx";
import { TopBar } from "../shared/TopBar.jsx";
import { useTheme } from "../shared/useTheme.js";
import { useTyping } from "../shared/useTyping.js";
import { Aviation } from "./Aviation.jsx";
import { Gallery } from "./Gallery.jsx";
import { Interests } from "./Interests.jsx";
import { Lightbox } from "./Lightbox.jsx";
import { Travel } from "./Travel.jsx";

const NAV_LINKS = [
    { label: "Portfolio", href: "./index.html" },
    { label: "Interests", target: "interests" },
    { label: "Aviation", target: "aviation" },
    { label: "Travel", target: "travel" },
    { label: "Gallery", target: "gallery" },
];

const HERO_LINE = "When I'm not working with data, here's what keeps me going.";

// The whole Beyond Work page
export function App() {
    const [theme, setTheme] = useTheme();
    // The photo viewer: null when closed, or { photos, index } for the set being viewed.
    // It lives here because three sections below can open it.
    const [lightbox, setLightbox] = useState(null);
    const openLightbox = (photos, index) => setLightbox({ photos, index });

    // The green theme types out the hero line. The intro screen (public/legacy/gate.js) asks for it
    // to be typed again once it has closed, by calling window.runHackerTyping().
    const [typingRun, setTypingRun] = useState(0);
    const heroLine = useTyping(HERO_LINE, theme === "green", 25, typingRun);
    useEffect(() => {
        window.runHackerTyping = () => setTypingRun((run) => run + 1);
    }, []);

    // Each theme has its own intro screen, so switching theme here plays the other one
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
            {lightbox && <Lightbox photos={lightbox.photos} startIndex={lightbox.index} onClose={() => setLightbox(null)} />}
        </div>
    );
}
