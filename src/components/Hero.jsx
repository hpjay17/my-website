import { newTabProps, scrollToId } from "../shared/helpers.js";
import { Icon } from "../shared/Icon.jsx";
import { Section } from "../shared/Section.jsx";
import { useTyping } from "../shared/useTyping.js";

// Top of the page: photo, name, intro, buttons, links and the column of short facts
export function Hero({ profile, socialLinks, theme }) {
    // The green theme types out the title; the other shows it at once
    const title = useTyping(profile.title, theme === "green", 35);

    return (
        <Section id="hero" className="hero" startVisible>
            <div className="profile-ring">
                <img className="profile-image" src={profile.profileImage} alt={profile.name} width="400" height="400" />
            </div>
            <div className="hero-content">
                <h1>{profile.name}</h1>
                <p className={`hero-title ${title.typing ? "typing typing-cursor" : ""}`}>{title.shown}</p>
                <p className="hero-summary">{profile.summary}</p>
                <div className="hero-actions">
                    <a className="btn btn-primary" href={`mailto:${profile.email}`}>Email Me</a>
                    <button className="btn btn-ghost" type="button" onClick={() => scrollToId("career")}>View Career</button>
                </div>
                <p className="meta-line">{profile.availability} · {profile.location}</p>
                <div className="social-links" aria-label="Social links">
                    {socialLinks.map((link) => (
                        <a key={link.label} className="social-link" href={link.href} aria-label={link.label} title={link.label} {...newTabProps(link.href)}>
                            <span className="social-icon"><Icon name={link.icon} /></span>
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
            <dl className="hero-facts">
                {profile.facts.map((fact) => (
                    <div key={fact.label} className="hero-fact">
                        <dt>{fact.label}</dt>
                        <dd>
                            {fact.value}
                            {fact.detail && <span>{fact.detail}</span>}
                        </dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}
