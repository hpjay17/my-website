import { Fragment } from "react";
import { portfolioData } from "../data/portfolio.js";
import { newTabProps, scrollToId } from "../utils.js";

// The contact links from the data file, without the CV
const LINKS = portfolioData.socialLinks.filter((link) => link.icon !== "document");

// Bottom of both pages: copyright, contact links, back-to-top
export function Footer() {
    return (
        <footer className="site-footer">
            <p>&copy; {new Date().getFullYear()} Jay Wang &middot; Built by me with React and Claude Code</p>
            <nav className="footer-links" aria-label="Contact links">
                {LINKS.map((link, index) => (
                    <Fragment key={link.label}>
                        {index > 0 && <span aria-hidden="true">&middot;</span>}
                        <a href={link.href} {...newTabProps(link.href)}>
                            {link.label}
                        </a>
                    </Fragment>
                ))}
            </nav>
            <button className="footer-top" type="button" onClick={() => scrollToId("top")}>
                &uarr; back to top
            </button>
        </footer>
    );
}
