import { useState } from "react";
import { Icon } from "./Icon.jsx";

// Tabs, one per group of skills, showing the selected group
export function Skills({ skills }) {
    const [selected, setSelected] = useState(0);
    const { group, items } = skills[selected];

    return (
        <div className="skills">
            <div className="skill-tabs" role="tablist" aria-label="Skill groups">
                {skills.map((entry, index) => (
                    <button
                        key={entry.group}
                        className={`skill-tab ${index === selected ? "active" : ""}`}
                        type="button"
                        role="tab"
                        aria-selected={index === selected}
                        aria-controls="skills-panel"
                        onClick={() => setSelected(index)}
                    >
                        {entry.group}
                        <span className="skill-tab-count">{entry.items.length}</span>
                    </button>
                ))}
            </div>
            {/* A new key rebuilds the row, which replays its fade-in */}
            <div key={group} id="skills-panel" className="skills-grid" role="tabpanel" aria-label={`${group} skills`}>
                {items.map((skill) => (
                    <span key={skill.name} className="skill-pill">
                        <Icon name={skill.icon} />
                        {skill.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
