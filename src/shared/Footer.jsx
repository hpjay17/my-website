import { scrollToId } from "./helpers.js";

// Copyright line and contact links at the bottom of both pages
export function Footer() {
    return (
        <footer className="site-footer">
            <p>&copy; {new Date().getFullYear()} Jay Wang &middot; Built by me with React and Claude Code</p>
            <nav className="footer-links" aria-label="Contact links">
                <a href="https://www.linkedin.com/in/wangjay17" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/hpjay17" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="mailto:jay.wang@emory.edu">Email</a>
                <button type="button" onClick={() => scrollToId("top")}>Back to top &uarr;</button>
            </nav>
        </footer>
    );
}
