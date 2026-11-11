import { useEffect, useRef, useState } from "react";

// One section of a page: an optional heading, then whatever is placed inside it (`children`).
// It fades in the first time it scrolls into view; pass startVisible for the one at the top.
export function Section({ id, title, className = "", startVisible = false, children }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(startVisible);

    useEffect(() => {
        if (visible) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <section ref={ref} id={id} className={`section ${className} ${visible ? "is-visible" : ""}`}>
            {title && (
                <div className="section-heading">
                    <h2>{title}</h2>
                </div>
            )}
            {children}
        </section>
    );
}
