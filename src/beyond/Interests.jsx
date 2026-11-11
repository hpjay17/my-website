import { newTabProps } from "../shared/helpers.js";

export function Interests({ interests }) {
    return (
        <div className="interests-grid">
            {interests.map((item) => (
                <div key={item.name} className={`interest-card ${item.icon ? "" : "interest-card--no-icon"}`}>
                    {/* Decorative, so no alt text: the name is right below it */}
                    {item.icon && <img className="interest-icon" src={item.icon} alt="" loading="lazy" />}
                    <h3 className="interest-name">{item.name}</h3>
                    <p className="interest-note">{item.note}</p>
                    {item.link && (
                        <a className="interest-link" href={item.link} {...newTabProps(item.link)}>Learn more</a>
                    )}
                </div>
            ))}
        </div>
    );
}
