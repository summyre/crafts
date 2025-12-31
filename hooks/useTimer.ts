import { useEffect, useState } from "react";

export const useTimer = () =>{
    const [seconds, setSeconds] = useState<number>(0);
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    const start = () => setRunning(true);
    const pause = () => setRunning(false);

    const reset = () =>{
        setSeconds(0);
        setRunning(false);
    };

    return { seconds, running, start, pause, reset, };
};