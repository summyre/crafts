import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function StitchCounterSession() {
    const [rows, setRows] = useState(0);
    const [increase, setIncrease] = useState(0);
    const [decrease, setDecrease] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Project 1 - Session 1</Text>
            </View>

            <Text style={styles.timer}>00:01:45</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Row</Text>
                <View style={styles.counterRow}>
                    <CounterButton label="-" onPress={() => setRows(rows - 1)} />
                    <Text style={styles.counterValue}>{rows}</Text>
                    <CounterButton label="+" onPress={() => setRows(rows + 1)} />
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
                    <Counter
                        value = {increase}
                        onMinus={() => setIncrease(increase - 1)}
                        onPlus={() => setIncrease(increase + 1)}/>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cardHalf}>
                    <Text style={styles.sectionTitle}>Decrease</Text>
                    <Counter
                        value = {decrease}
                        onMinus={() => setDecrease(decrease - 1)}
                        onPlus={() => setDecrease(decrease + 1)}/>
                </View>
            </View>

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

const CounterButton = ({ label, onPress }) => (
    <TouchableOpacity style={styles.counterButton} onPress={onPress}>
        <Text style={styles.counterButtonText}>{label}</Text>
    </TouchableOpacity>
);

const Counter = ({ value, onMinus, onPlus }) => (
    <View style={styles.counterRow}>
        <CounterButton label='-' onPress={onMinus}/>
        <Text style={styles.counterValue}>{value}</Text>
        <CounterButton label='+' onPress={onPlus}/>     
    </View>
);

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
})