export function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
}

// Props for a link: other sites and PDFs open in a new tab, mailto stays in this one
export function newTabProps(href) {
    return href.startsWith("http") || href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
