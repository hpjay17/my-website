// Pilot details beside photos (stacked on small screens)
export function Aviation({ aviation, onOpenPhoto }) {
    const { logbook, aircraftFlown, milestones, goals, photos } = aviation;

    return (
        <div className="aviation-content">
            <div className="aviation-info">
                <div className="aviation-intro">
                    <span className="aviation-badge">{aviation.license}</span>
                    <h3>{aviation.headline}</h3>
                    <p className="aviation-summary">{aviation.summary}</p>
                </div>

                {logbook.length > 0 && (
                    <div className="aviation-stats">
                        {logbook.map((stat) => (
                            <div key={stat.label} className="aviation-stat">
                                <span className="aviation-stat-value">
                                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                                </span>
                                <span className="aviation-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {aircraftFlown.length > 0 && (
                    <Subsection title="Aircraft Flown">
                        <div className="stack-row">
                            {aircraftFlown.map((plane) => (
                                <span key={plane.name} className="stack-pill" title={plane.note}>
                                    {plane.name}
                                </span>
                            ))}
                        </div>
                    </Subsection>
                )}

                {milestones.length > 0 && (
                    <Subsection title="Milestones">
                        <div className="aviation-timeline">
                            {milestones.map((milestone) => (
                                <div key={milestone.label} className="timeline-entry">
                                    <span className="timeline-dot" />
                                    <span className="timeline-label">{milestone.label}</span>
                                    <span className="timeline-date">{milestone.date}</span>
                                    <p className="timeline-desc">{milestone.description}</p>
                                </div>
                            ))}
                        </div>
                    </Subsection>
                )}

                {goals.length > 0 && (
                    <Subsection title="Aviation Goals">
                        <ul className="highlight-list">
                            {goals.map((goal) => (
                                <li key={goal}>{goal}</li>
                            ))}
                        </ul>
                    </Subsection>
                )}
            </div>

            {photos.length > 0 && (
                <div className="aviation-photos">
                    {photos.map((photo, index) => (
                        <button
                            key={photo.src}
                            className="aviation-photo-wrap"
                            type="button"
                            onClick={() => onOpenPhoto(photos, index)}
                        >
                            <img src={photo.src} alt={photo.alt} loading="lazy" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Subsection({ title, children }) {
    return (
        <div className="aviation-subsection">
            <h4>{title}</h4>
            {children}
        </div>
    );
}
