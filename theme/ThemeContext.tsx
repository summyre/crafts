import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, themes } from "./themes";

type ThemeContextType = {
    theme: Theme;
    themeId: string;
    setThemeById: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}:{children: React.ReactNode}) {
    const [themeId, setThemeId] = useState('light');

    useEffect(() => {
        AsyncStorage.getItem('appTheme').then(saved => {
            if (saved) setThemeId(saved);
        });
    }, []);

    const setThemeById = async (id: string) => {
        setThemeId(id);
        await AsyncStorage.setItem('appTheme', id);
    };

    return (
        <ThemeContext.Provider value={{theme: themes[themeId], themeId, setThemeById}}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
}