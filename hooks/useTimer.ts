import { useEffect, useState } from "react";

export const useTimer = (initialSeconds = 0) =>{
    const [seconds, setSeconds] = useState(initialSeconds);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (running) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [running]);

    const start = () => setRunning(true);
    const pause = () => setRunning(false);

    const reset = () =>{
        setSeconds(0);
        setRunning(false);
    };

    return { seconds, running, start, pause, reset, };
};