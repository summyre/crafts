import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProjectDefaultsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Project Defaults</Text>
            <Text>Default yarn, hook size, stitch type, etc.</Text>
        </View>
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