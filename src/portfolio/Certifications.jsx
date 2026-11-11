import { newTabProps } from "../shared/helpers.js";

export function Certifications({ certifications }) {
    return (
        <div className="cert-list">
            {certifications.map((cert) => {
                const text = (
                    <div>
                        <h3>{cert.name}</h3>
                        <p>{cert.issuer} · {cert.date}</p>
                    </div>
                );
                // Only rows with something to open are links
                return cert.href ? (
                    <a key={cert.name} className="cert-row" href={cert.href} {...newTabProps(cert.href)}>
                        {text}
                        <span className="arrow" aria-hidden="true">→</span>
                    </a>
                ) : (
                    <div key={cert.name} className="cert-row">{text}</div>
                );
            })}
        </div>
    );
}
