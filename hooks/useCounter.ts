import { useState } from "react";
import { SessionCounters } from "../store/types";

export const useCounter = (initialCounters?: any) => {
    const [counters, setCounters] = useState<SessionCounters>(() => normaliseCounters(initialCounters = 0));

    const addCounter = (name: string) => {
        if (!name.trim()) return;

        setCounters(prev => {
            if (prev.values[name] !== undefined) return prev;
            return {
                ...prev,
                values: {
                    ...prev.values,
                    [name]: 0
                }
            };
        });
    };

    const removeCounter = (name: string) => {
        setCounters(prev => {
            const updated = { ...prev.values };
            delete updated[name];

            return {
                ...prev,
                values: updated
            };
        });
    };

    const increment = (name: string, amount = 1) => {
        setCounters(prev => ({
            ...prev,
            values: {
                ...prev.values,
                [name]: ((prev.values[name] ?? 0 ) + amount)
            }
        }));
    };
    
    const decrement = (name: string, amount = 1) => {
        setCounters(prev => ({
            ...prev,
            values: {
                ...prev.values,
                [name]: Math.max(0, ((prev.values[name] ?? 0) - amount))
            }
        }));
    };

    const resetCounter = (name: string) => {
        setCounters(prev => ({
            ...prev,
            values: {
                ...prev.values,
                [name]: 0
            }
        }));
    };

    const resetAll = () => {
        setCounters(prev => ({
            ...prev,
            values: Object.fromEntries(
                Object.keys(prev.values).map(key => [key, 0])
            )
        }));
    };

    return {
        counters,
        addCounter,
        removeCounter,
        increment,
        decrement,
        resetCounter,
        resetAll
    };
};

const normaliseCounters = (initial: any): SessionCounters => {
    if (!initial) {
        return { values: {}};
    };

    if (initial.values) {
        return {
            values: { ...initial.values }
        };
    };

    return {
        values: {
            Rows: initial.rows ?? 0,
            Increase: initial.increase ?? 0,
            Decrease: initial.decrease ?? 0
        }
    };
};