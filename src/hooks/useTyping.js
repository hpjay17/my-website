import { useEffect, useState } from "react";

// Types `text` out one letter at a time while `active` is true (the green theme); otherwise shows it at once.
// Changing `replayKey` types it again. Returns the letters shown so far and whether it is still typing.
export function useTyping(text, active, speed, replayKey = 0) {
    const [shown, setShown] = useState(active ? "" : text);
    const [typing, setTyping] = useState(active);

    useEffect(() => {
        if (!active) {
            setShown(text);
            setTyping(false);
            return;
        }
        let count = 0;
        setShown("");
        setTyping(true);
        const timer = setInterval(() => {
            count += 1;
            setShown(text.slice(0, count));
            if (count >= text.length) {
                clearInterval(timer);
                setTyping(false);
            }
        }, speed);
        // React runs this cleanup before the effect runs again, and when the component goes away
        return () => clearInterval(timer);
    }, [text, active, speed, replayKey]);

    return { shown, typing };
}
