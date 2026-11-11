import { useState } from "react";

// A list of entries with the selected one's details beside it. Used for Career and for Clubs & Organizations.
export function TabSection({ items, label, panelId }) {
    const [selected, setSelected] = useState({ index: 0, from: "" });
    const entry = items[selected.index];

    // The panel slides in from the direction the visitor moved in the list
    function select(index) {
        if (index === selected.index) return;
        setSelected({ index, from: index > selected.index ? "from-below" : "from-above" });
    }

    return (
        <div className="career-layout">
            <div className="career-list" role="tablist" aria-label={label}>
                {items.map((item, index) => (
                    <button
                        key={item.company}
                        className={`career-item ${index === selected.index ? "active" : ""}`}
                        type="button"
                        role="tab"
                        aria-controls={panelId}
                        aria-selected={index === selected.index}
                        onClick={() => select(index)}
                    >
                        <span className="company">{item.company}</span>
                        <span className="role">{item.role}</span>
                    </button>
                ))}
            </div>
            <div id={panelId} className="career-details" role="tabpanel" aria-live="polite">
                {/* A new key rebuilds the panel, which replays its slide-in */}
                <article key={selected.index} className={`career-panel ${selected.from}`}>
                    <h3 className="career-title">{entry.company}</h3>
                    <p className="career-role">{entry.role}</p>
                    <p className="career-meta">
                        {entry.period} · {entry.location}
                    </p>
                    <p className="career-summary">{entry.summary}</p>
                    <div className="stack-row">
                        {entry.stack.map((tech) => (
                            <span key={tech} className="stack-pill">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <ul className="highlight-list">
                        {entry.highlights.map((point) => (
                            <li key={point}>{point}</li>
                        ))}
                    </ul>
                </article>
            </div>
        </div>
    );
}
