import { scrollToId } from "./helpers.js";

const THEMES = [
    { id: "blue", label: "Sage" },
    { id: "green", label: "Terminal green" },
];

// The bar at the top of both pages.
// brandHref: where the name links to; without it, the name scrolls to the top.
// links: each is { label, target } to scroll to a section, or { label, href } to open the other page.
export function TopBar({ brandHref, links, theme, onThemeChange }) {
    return (
        <header className="top-bar">
            {brandHref ? (
                <a className="brand" href={brandHref}>Jay Wang</a>
            ) : (
                <button className="brand" type="button" onClick={() => scrollToId("top")}>Jay Wang</button>
            )}
            <nav className="top-nav" aria-label="Section navigation">
                {links.map((link) =>
                    link.href ? (
                        <a key={link.label} className="nav-link-page" href={link.href}>{link.label}</a>
                    ) : (
                        <button key={link.label} type="button" onClick={() => scrollToId(link.target)}>{link.label}</button>
                    )
                )}
            </nav>
            <div className="theme-switcher" role="group" aria-label="Theme">
                <span className="theme-switcher-label" aria-hidden="true">Theme</span>
                {THEMES.map(({ id, label }) => (
                    <button
                        key={id}
                        className={`theme-btn ${theme === id ? "active" : ""}`}
                        data-set-theme={id}
                        type="button"
                        title={label}
                        aria-label={`${label} theme`}
                        aria-pressed={theme === id}
                        onClick={() => onThemeChange(id)}
                    />
                ))}
            </div>
        </header>
    );
}
