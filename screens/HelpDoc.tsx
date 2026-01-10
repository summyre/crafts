import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function HelpDocScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Help and Documentation</Text>
            <Text>
                - Creating projects{"\n\n"}
                - Tracking sessions{"\n\n"}
                - Using the cost calculator{"\n\n"}
                - Managing your collection{"\n\n"}
                More documentation coming soon.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10
    }
})