import { useState } from "react";
import { TravelMap } from "./TravelMap.jsx";

// The map, then one card per trip
export function Travel({ trips, onOpenPhoto }) {
    // Index of the trip card lit up by the map (-1 for none)
    const [highlighted, setHighlighted] = useState(-1);

    // The photo viewer steps only through trips that have a photo
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
                            <button className="travel-image-wrap" type="button" onClick={() => onOpenPhoto(tripPhotos, withPhotos.indexOf(trip))}>
                                <img src={trip.image} alt={trip.place} loading="lazy" />
                            </button>
                        )}
                        <div className="travel-info">
                            <h3>{trip.place}</h3>
                            <span className="travel-date">{trip.date}</span>
                            <p>{trip.note}</p>
                            {trip.coords && (
                                <button className="travel-map-btn" type="button" onClick={() => window.focusTravelPin(index)}>
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
