import { useState } from "react";

export const useCounter = (initialValue = 0) => {
    const [value, setValue] = useState<number>(initialValue);

    const increment = () => setValue(prev => prev + 1);
    const decrement = () => setValue(prev => Math.max(0, prev - 1));
    const reset = () => setValue(initialValue);

    return {
        value,
        increment,
        decrement, 
        reset,
    };
};
