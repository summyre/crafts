import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_CURRENCY_MAP } from "./currencies";

type CurrencyContextType = {
    currencyCode: string;
    setCurrencyCode: (code: string) => Promise<void>;
    loadCurrency: () => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [currencyCode, setCurrencyCodeState] = useState<string>('GBP');

    const getAutoCurrency = () => {
        try {
            const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
            return LOCALE_CURRENCY_MAP[deviceLocale] ?? 'GBP';
        } catch (error) {
            return 'GBP';
        }
    };

    const loadCurrency = async () => {
        try {
            const pref = await AsyncStorage.getItem('preferredCurrency');
            const manual = await AsyncStorage.getItem('manualCurrencyCode');

            console.log('CurrencyContext - pref: ', pref, '\nmanual: ', manual); // debug

            let code = 'GBP';
            
            if (pref === 'manual' && manual) {
                code = JSON.parse(manual);
            } else if (pref &&  pref !== 'auto') {
                code = JSON.parse(pref);
            } else {
                code = getAutoCurrency();
            }

            console.log('CurrencyContext - setting currency to: ', code); // debug
            setCurrencyCodeState(code);

        } catch (error) {
            console.error('Error loading currency:', error);
            setCurrencyCodeState('GBP');
        }
    };

    const setCurrencyCode = async (code: string) => {
        // saving to async and updating the state
        setCurrencyCodeState(code);

        // determining how to save based on the code
        if (code === 'auto' || code === 'manual') {
            await AsyncStorage.setItem('preferredCurrency', JSON.stringify(code));
        } else {
            await AsyncStorage.setItem('preferredCurrency', JSON.stringify(code));
            await AsyncStorage.setItem('manualCurrencyCode', JSON.stringify(code));
        }
    };

    useEffect(()=> {loadCurrency();}, []);

    return (<CurrencyContext.Provider value={{currencyCode, setCurrencyCode, loadCurrency}}>{children}</CurrencyContext.Provider>);
};

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
    return ctx;
}