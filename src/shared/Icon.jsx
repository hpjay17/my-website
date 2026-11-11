// Inline SVG icons on a 24-unit grid, colored by the text around them. Brand and social icons are
// filled; the rest are 2-unit lines. Data files pick them by name (icon: "linkedin").
const ICONS = {
    linkedin: { filled: true, shapes: <><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></> },
    github: { filled: true, shapes: <><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></> },
    email: { filled: true, shapes: <><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></> },
    document: { filled: true, shapes: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" /></> },
    chevronLeft: { filled: false, shapes: <><path d="M15 18l-6-6 6-6" /></> },
    chevronRight: { filled: false, shapes: <><path d="M9 18l6-6-6-6" /></> },
    externalLink: { filled: false, shapes: <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></> },
    database: { filled: false, shapes: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></> },
    code: { filled: false, shapes: <><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></> },
    lineChart: { filled: false, shapes: <><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 6-7" /></> },
    table: { filled: false, shapes: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></> },
    barChart: { filled: false, shapes: <><path d="M3 3v18h18" /><path d="M8 17v-5M13 17V7M18 17v-8" /></> },
    pieChart: { filled: false, shapes: <><path d="M21 12a9 9 0 11-9-9v9z" /><path d="M16 3.5A9 9 0 0120.5 8H16z" /></> },
};

// <Icon name="github" /> draws one icon
export function Icon({ name }) {
    const { filled, shapes } = ICONS[name];
    const look = filled
        ? { fill: "currentColor" }
        : { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...look}>
            {shapes}
        </svg>
    );
}
