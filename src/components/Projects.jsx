import { useState } from "react";
import { newTabProps } from "../utils.js";
import { Icon } from "./Icon.jsx";

// A carousel showing one project at a time
export function Projects({ projects, theme }) {
    const [current, setCurrent] = useState(0);
    if (!projects.length) return null;
    const project = projects[current];
    // Wraps around at both ends
    const goTo = (index) => setCurrent((index + projects.length) % projects.length);

    return (
        <div className="project-carousel">
            <div className="project-card">
                <div className="project-image-wrap">
                    {project.image ? (
                        <img src={project.image} alt={project.name} loading="lazy" />
                    ) : (
                        // One placeholder per theme; the size holds its space while it loads
                        <img
                            src={`./images/project-placeholder-${theme}.svg`}
                            alt={project.name}
                            width="960"
                            height="540"
                            loading="lazy"
                        />
                    )}
                </div>
                <div className="project-info">
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                    {project.href && (
                        <a className="project-source" href={project.href} {...newTabProps(project.href)}>
                            <Icon name="externalLink" /> Source
                        </a>
                    )}
                </div>
            </div>
            <button
                className="carousel-arrow carousel-prev"
                type="button"
                aria-label="Previous project"
                onClick={() => goTo(current - 1)}
            >
                <Icon name="chevronLeft" />
            </button>
            <button
                className="carousel-arrow carousel-next"
                type="button"
                aria-label="Next project"
                onClick={() => goTo(current + 1)}
            >
                <Icon name="chevronRight" />
            </button>
            <div className="carousel-dots">
                {projects.map((item, index) => (
                    <button
                        key={item.name}
                        className={`carousel-dot ${index === current ? "active" : ""}`}
                        type="button"
                        aria-label={`Go to project ${index + 1}`}
                        onClick={() => goTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}
