import { useEffect, useState } from "react";

// Types `text` out a letter at a time while `active` (the green theme); otherwise shows it all.
// Changing `replayKey` types it again.
export function useTyping(text, active, speed, replayKey = 0) {
    const [count, setCount] = useState(active ? 0 : text.length);

    useEffect(() => {
        if (!active) {
            setCount(text.length);
            return;
        }
        let typed = 0;
        setCount(0);
        const timer = setInterval(() => {
            typed += 1;
            setCount(typed);
            if (typed >= text.length) clearInterval(timer);
        }, speed);
        return () => clearInterval(timer);
    }, [text, active, speed, replayKey]);

    return { shown: text.slice(0, count), typing: count < text.length };
}
