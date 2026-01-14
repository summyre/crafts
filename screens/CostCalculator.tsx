import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from "react-native";
import { CostResult } from "../store/types";
import { LOCALE_CURRENCY_MAP } from "../store/currencies";
import { useCurrency } from "../store/CurrenciesContext";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

export const getAutoCurrency = () => {
    try {
    const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    return LOCALE_CURRENCY_MAP[deviceLocale] ?? "GBP";
    } catch (error) {
        return 'GBP';
    }
};

export default function CostScreen() {
    const styles = useScreenStyles();
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

const useScreenStyles = () => {
    const { theme } = useTheme();
    
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.xl,
            backgroundColor: theme.colors.background
        },
        title: {
            fontSize: fontSizes.xxxl,
            fontWeight: '600',
            marginBottom: spacing.xl,
            textAlign: 'center'
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderRadius: borderRadius.md
        },
        button: {
            backgroundColor: theme.colors.primary,
            padding: spacing.lg,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            marginTop: spacing.md
        },
        buttonText: {
            color: '#fff',
            fontWeight: '600'
        },
        result: {
            marginTop: spacing.xxl,
            padding: spacing.lg,
            backgroundColor: theme.colors.secondary,
            borderRadius: borderRadius.md
        },
        resultText: {
            fontSize: fontSizes.lg,
            marginBottom: spacing.xs,
            color: '#fff'
        }
    });
}