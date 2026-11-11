import { scrollToId } from "./helpers.js";

// Bottom of both pages: copyright on the left, contact links in the middle, back-to-top on the right
export function Footer() {
    // The dot between links; hidden from screen readers, which would otherwise read it aloud
    const dot = <span aria-hidden="true">&middot;</span>;

    return (
        <footer className="site-footer">
            <p>&copy; {new Date().getFullYear()} Jay Wang &middot; Built by me with React and Claude Code</p>
            <nav className="footer-links" aria-label="Contact links">
                <a href="https://www.linkedin.com/in/wangjay17" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                {dot}
                <a href="https://github.com/hpjay17" target="_blank" rel="noopener noreferrer">GitHub</a>
                {dot}
                <a href="mailto:jay.wang@emory.edu">Email</a>
            </nav>
            <button className="footer-top" type="button" onClick={() => scrollToId("top")}>&uarr; back to top</button>
        </footer>
    );
}
