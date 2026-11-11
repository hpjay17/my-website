export function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
}

// Other sites and PDFs open in a new tab; mailto stays in this one.
// Spread onto a link: <a href={href} {...newTabProps(href)}>
export function newTabProps(href) {
    return href.startsWith("http") || href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
