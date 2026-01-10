import React, { useCallback, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from "react-native";
import { CostResult } from "../store/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const localeCurrencyMap: Record<string, string> = {
    "en-GB": "GBP",
    "en-US": "USD",
    "de-DE": "EUR",
    "fr-FR": "EUR",
    "it-IT": "EUR",
    "es-ES": "EUR",
    "ja-JP": "JPY",
    "en-AU": "AUD",
    "en-CA": "CAD",
    "ms-MY": "MYR"
}

const getAutoCurrency = () => {
    const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    return localeCurrencyMap[deviceLocale] ?? "GBP";
};

export default function CostScreen() {
    const [skeinPrice, setSkeinPrice] = useState('');
    const [skeinSize, setSkeinSize] = useState('');
    const [yarnUsed, setYarnUsed] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [extraCosts, setExtraCosts] = useState('');
    const [profitMargin, setProfitMargin] = useState('');
    const [result, setResult] = useState<CostResult | null>();
    const [currencyCode, setCurrencyCode] = useState<string>('GBP');

    const loadCurrency = async () => {
        try {
            const pref = await AsyncStorage.getItem('preferredCurrency');
            const manual = await AsyncStorage.getItem('manualCurrencyCode');

            if (pref === 'manual' && manual) {
                setCurrencyCode(JSON.parse(manual));
            } else if (pref && pref !== 'auto') {
                setCurrencyCode(JSON.parse(pref));
            } else {
                setCurrencyCode(getAutoCurrency());
            }
        } catch (error) {
            console.error('Error loading currency:', error);
            setCurrencyCode(getAutoCurrency());
        }
    };

    useFocusEffect(useCallback(() => {loadCurrency();}, []));

    const calculateCost = () => {
        const yarnCost = (Number(yarnUsed) / Number(skeinSize)) * Number(skeinPrice);
        const labourCost = Number(hoursWorked) * Number(hourlyRate);
        const totalCost = yarnCost + labourCost + Number(extraCosts || 0);
        const sellingPrice = totalCost + (totalCost * Number(profitMargin || 0)) / 100;

        setResult({
            totalCost: Number(totalCost.toFixed(2)),
            sellingPrice: Number(sellingPrice.toFixed(2))
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
        }).format(value);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cost Calculator</Text>
            <TextInput 
                style={styles.input}
                placeholder="Skein Price"
                keyboardType="numeric"
                value={skeinPrice}
                onChangeText={setSkeinPrice}
            />
            <TextInput 
                style={styles.input}
                placeholder="Skein Size (grams)"
                keyboardType="numeric"
                value={skeinSize}
                onChangeText={setSkeinSize}
            />
            <TextInput 
                style={styles.input}
                placeholder="Yarn used (grams)"
                keyboardType="numeric"
                value={yarnUsed}
                onChangeText={setYarnUsed}
            />
            <TextInput 
                style={styles.input}
                placeholder="Hours Worked"
                keyboardType="numeric"
                value={hoursWorked}
                onChangeText={setHoursWorked}
            />
            <TextInput 
                style={styles.input}
                placeholder="Hourly Rate"
                keyboardType="numeric"
                value={hourlyRate}
                onChangeText={setHourlyRate}
            />
            <TextInput 
                style={styles.input}
                placeholder="Extra Costs"
                keyboardType="numeric"
                value={extraCosts}
                onChangeText={setExtraCosts}
            />
            <TextInput 
                style={styles.input}
                placeholder="Profit Margin (%)"
                keyboardType="numeric"
                value={profitMargin}
                onChangeText={setProfitMargin}
            />

            <Pressable style={styles.button} onPress={calculateCost}>
                <Text style={styles.buttonText}>Calculate</Text>
            </Pressable>

            {result && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Total Cost: {formatCurrency(result.totalCost)}</Text>
                    <Text style={styles.resultText}>Selling Price: {formatCurrency(result.sellingPrice)}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8
    },
    button: {
        backgroundColor: '#445',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '600'
    },
    result: {
        marginTop: 25,
        padding: 15,
        backgroundColor: '#777',
        borderRadius: 8
    },
    resultText: {
        fontSize: 16,
        marginBottom: 5
    }
})