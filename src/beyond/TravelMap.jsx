import { useEffect, useRef } from "react";

// The travel map is drawn by plain scripts in public/legacy/ (travel-map.js, replay.js, globe.js),
// not by React. This component gives them an empty box to draw in and starts them once.
// onHighlight(index) is called when the map wants a trip card lit up.
export function TravelMap({ onHighlight }) {
    const box = useRef(null);

    useEffect(() => {
        window.highlightTravelCard = onHighlight;
    }, [onHighlight]);

    useEffect(() => {
        const draw = () => {
            // Already drawn (React runs effects twice while developing, to catch mistakes)
            if (box.current.childElementCount) return;
            window.renderTravelMap();
        };
        if (window.renderTravelMap) draw();
        else window.addEventListener("load", draw, { once: true });
    }, []);

    return <div ref={box} id="travel-map" className="travel-map" />;
}
