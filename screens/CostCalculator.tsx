import React, { useCallback, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from "react-native";
import { CostResult } from "../store/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CURRENCIES, LOCALE_CURRENCY_MAP } from "../store/currencies";
import { useCurrency } from "../store/CurrenciesContext";

export const getAutoCurrency = () => {
    try {
    const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    return LOCALE_CURRENCY_MAP[deviceLocale] ?? "GBP";
    } catch (error) {
        return 'GBP';
    }
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
    const { currencyCode } = useCurrency();

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

    const resolveCurrencyCode = () => {
        if (currencyCode === 'auto') {
            const auto = getAutoCurrency();
            return typeof auto === 'string' && auto.length === 3 ? auto : 'GBP';
        }

        if (currencyCode === 'manual') {
            return 'GBP';
        }

        if (typeof currencyCode === 'string' && currencyCode.length === 3) { return currencyCode; }

        return 'GBP';
    };

    const formatCurrency = (value: number) => {
        try {
            const locale = Intl.DateTimeFormat().resolvedOptions().locale;
            const resolvedCurrency = resolveCurrencyCode();

            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: resolvedCurrency
            }).format(value);
        } catch (error) {
            console.error('Currency formatting error:', error);
            return `${currencyCode} ${value.toFixed(2)}`;
        }
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