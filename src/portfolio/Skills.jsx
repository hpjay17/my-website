import { Icon } from "../shared/Icon.jsx";

export function Skills({ skills }) {
    return (
        <div className="skills-grid">
            {skills.map((skill) => (
                <span key={skill.name} className="skill-pill">
                    <Icon name={skill.icon} />
                    {skill.name}
                </span>
            ))}
        </div>
    );
}
