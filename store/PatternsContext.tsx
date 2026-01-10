import React , { createContext, useContext, useEffect, useState } from "react";
import { Pattern } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PatternsContextType = {
    patterns: Pattern[];
    setPatterns: React.Dispatch<React.SetStateAction<Pattern[]>>;
};

const STORAGE_KEY = '@patterns';
const PatternsContext = createContext<PatternsContextType | undefined>(undefined);

export function PatternsProvider({children}: {children: React.ReactNode}) {
    const [patterns, setPatterns] = useState<Pattern[]>([]);

    useEffect(() => {
        const loadPatterns = async () => {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) setPatterns(JSON.parse(data));
        };
        
        loadPatterns();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
    }, [patterns]);

    return (
        <PatternsContext.Provider value={{patterns, setPatterns}}>{children}</PatternsContext.Provider>
    );
};

export const usePatterns = () => {
    const ctx = useContext(PatternsContext);
    if (!ctx) throw new Error('usePatterns mus be used inside PatternsProvider');
    return ctx;
};