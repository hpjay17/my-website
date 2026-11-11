import { useState } from "react";

// A grid of photos with a filter button per category
export function Gallery({ photos, onOpenPhoto }) {
    const [category, setCategory] = useState("all");
    if (!photos.length) return <p className="empty-message">Photos coming soon.</p>;

    const categories = ["all", ...new Set(photos.map((photo) => photo.category))];
    const shown = category === "all" ? photos : photos.filter((photo) => photo.category === category);

    return (
        <>
            <div className="gallery-filters">
                {categories.map((name) => (
                    <button
                        key={name}
                        className={`gallery-filter-btn ${name === category ? "active" : ""}`}
                        type="button"
                        onClick={() => setCategory(name)}
                    >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </button>
                ))}
            </div>
            <div className="gallery-grid">
                {shown.map((photo, index) => (
                    <button key={photo.src} className="gallery-cell" type="button" onClick={() => onOpenPhoto(shown, index)}>
                        <img src={photo.src} alt={photo.alt} loading="lazy" />
                    </button>
                ))}
            </div>
        </>
    );
}
