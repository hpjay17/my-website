import { useEffect, useRef, useState } from "react";

// The map, then one card per trip
export function Travel({ trips, onOpenPhoto }) {
    // The trip card lit up by the map (-1 for none)
    const [highlighted, setHighlighted] = useState(-1);

    // The photo viewer steps through trips that have a photo
    const withPhotos = trips.filter((trip) => trip.image);
    const tripPhotos = withPhotos.map((trip) => ({ src: trip.image, alt: `${trip.place} — ${trip.date}` }));

    return (
        <>
            <TravelMap onHighlight={setHighlighted} />
            <div className="travel-grid">
                {trips.length === 0 && <p className="empty-message">Travel photos coming soon.</p>}
                {trips.map((trip, index) => (
                    <div
                        key={trip.place}
                        id={`travel-card-${index}`}
                        className={`travel-card ${trip.image ? "" : "travel-card--no-image"} ${index === highlighted ? "is-highlighted" : ""}`}
                    >
                        {trip.image && (
                            <button
                                className="travel-image-wrap"
                                type="button"
                                onClick={() => onOpenPhoto(tripPhotos, withPhotos.indexOf(trip))}
                            >
                                <img src={trip.image} alt={trip.place} loading="lazy" />
                            </button>
                        )}
                        <div className="travel-info">
                            <h3>{trip.place}</h3>
                            <span className="travel-date">{trip.date}</span>
                            <p>{trip.note}</p>
                            {trip.coords && (
                                <button
                                    className="travel-map-btn"
                                    type="button"
                                    onClick={() => window.focusTravelPin(index)}
                                >
                                    View on map
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

// The map is drawn by the plain scripts in public/legacy/, not by React: this gives them an empty box
// and starts them once. They call onHighlight(index) to light up a trip card.
function TravelMap({ onHighlight }) {
    const box = useRef(null);

    useEffect(() => {
        window.highlightTravelCard = onHighlight;
    }, [onHighlight]);

    useEffect(() => {
        const draw = () => {
            // Effects run twice in development, so skip if the map is already there
            if (!box.current.childElementCount) window.renderTravelMap();
        };
        if (window.renderTravelMap) draw();
        else window.addEventListener("load", draw, { once: true });
    }, []);

    return <div ref={box} id="travel-map" className="travel-map" />;
}
