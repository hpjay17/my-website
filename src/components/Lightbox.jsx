import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Full-screen photo viewer. Arrows step through the photos; Escape, the close button or a click outside closes it.
export function Lightbox({ photos, startIndex, onClose }) {
    const [index, setIndex] = useState(startIndex);
    const overlay = useRef(null);
    const closeButton = useRef(null);
    const photo = photos[index];
    // Wraps around at both ends
    const show = (i) => setIndex((i + photos.length) % photos.length);

    // While open, the page behind doesn't scroll and focus stays in the viewer
    useEffect(() => {
        const opener = document.activeElement;
        document.body.style.overflow = "hidden";
        closeButton.current.focus();
        return () => {
            document.body.style.overflow = "";
            if (opener) opener.focus({ preventScroll: true });
        };
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft") show(index - 1);
            else if (e.key === "ArrowRight") show(index + 1);
            else if (e.key === "Tab") {
                // Tab cycles through the viewer's own buttons instead of the page behind it
                const buttons = [...overlay.current.querySelectorAll("button")];
                const next = buttons.indexOf(document.activeElement) + (e.shiftKey ? -1 : 1);
                e.preventDefault();
                buttons[(next + buttons.length) % buttons.length].focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    });

    // Drawn at the end of <body>, so it covers the whole page
    return createPortal(
        <div
            ref={overlay}
            className="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={(e) => {
                if (e.target === overlay.current) onClose();
            }}
        >
            <figure className="lightbox-figure">
                <img src={photo.src} alt={photo.alt} />
                <figcaption className="lightbox-caption">
                    {photos.length > 1 ? `${photo.alt}  ·  ${index + 1} / ${photos.length}` : photo.alt}
                </figcaption>
            </figure>
            <button ref={closeButton} className="lightbox-close" type="button" aria-label="Close" onClick={onClose}>
                ×
            </button>
            {photos.length > 1 && (
                <>
                    <button
                        className="lightbox-nav lightbox-prev"
                        type="button"
                        aria-label="Previous photo"
                        onClick={() => show(index - 1)}
                    >
                        ‹
                    </button>
                    <button
                        className="lightbox-nav lightbox-next"
                        type="button"
                        aria-label="Next photo"
                        onClick={() => show(index + 1)}
                    >
                        ›
                    </button>
                </>
            )}
        </div>,
        document.body,
    );
}
