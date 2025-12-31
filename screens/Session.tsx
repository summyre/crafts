import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { useCounter } from "../hooks/useCounter";
import { useTimer } from "../hooks/useTimer";

type counterType = 'rows' | 'increase' | 'decrease'
type counterButtonProps = {
    label: string;
    onPress: () => void;
};

const CounterButton: React.FC<counterButtonProps> = ({ label, onPress}) => (
    <TouchableOpacity style={styles.counterButton} onPress={onPress}>
        <Text style={styles.counterButtonText}>{label}</Text>
    </TouchableOpacity>
    );

const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    };

export default function StitchCounterSession() {
    const rows = useCounter();
    const increase = useCounter();
    const decrease = useCounter();

    const timer = useTimer();

    const handleReset = () => {
        rows.reset();
        increase.reset();
        decrease.reset();
        timer.reset();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Project 1 - Session 1</Text>
            </View>

            <Text style={styles.timer}>{formatTime(timer.seconds)}</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Row</Text>
                    <View style={styles.counterRow}>
                        <CounterButton label="-" onPress={rows.decrement} />
                        <Text style={styles.counterValue}>{rows.value}</Text>
                        <CounterButton label="+" onPress={() => rows.increment} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Reminders</Text>
                    <TouchableOpacity style={styles.reminderButton}>
                        <Text>Change colour</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <View style={styles.cardHalf}>
                        <Text style={styles.sectionTitle}>Increase</Text>
                        <CounterButton label="-" onPress={increase.decrement} />
                        <Text style={styles.counterValue}>{increase.value}</Text>
                        <CounterButton label="+" onPress={increase.increment} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.cardHalf}>
                        <Text style={styles.sectionTitle}>Decrease</Text>
                        <CounterButton label="-" onPress={decrease.decrement} />
                        <Text style={styles.counterValue}>{decrease.value}</Text>
                        <CounterButton label="+" onPress={decrease.increment} />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {['Add Progress Pic', 'Pause', 'Stop', 'Reset'].map((item) => (
                    <TouchableOpacity key={item} style={styles.footerButton}>
                        <Text style={styles.footerText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timer: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 8,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
    },
    cardHalf: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 4,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    counterButtonText: {
        fontSize: 18,
    },
    counterValue: {
        fontSize: 18,
        marginHorizontal: 16,
    },
    reminderButton: {
        alignSelf: 'center',
        paddingVertical: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    footerButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 6,
    },
    footerText: {
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
    }
})