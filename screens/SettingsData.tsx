import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useProjects } from "../store/ProjectsContext";
import { usePatterns } from "../store/PatternsContext";
import { exportToJSON } from "../utils/exportData";
import { importJSON } from "../utils/importData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCollection } from "../store/CollectionContext";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes, shadows } from "../theme/constants";

export default function SettingsData() {
    const styles = useScreenStyles();
    const { projects, setProjects } = useProjects();
    const { patterns, setPatterns } = usePatterns();

    const exportProjects = async () => {
        await exportToJSON(
            `projects-${Date.now()}.json`, projects
        );
    };

    const importProjects = async () => {
        const data = await importJSON<any[]>();
        if (!data) return;

        Alert.alert('Import projects', 'Replace or merge existing projects?',
            [
                {text: 'Replace', style: 'destructive', onPress: () => setProjects(data)},
                {text: 'Merge', onPress: () => setProjects(prev => [...prev, ...data])},
                {text: 'Cancel', style: 'cancel'}
            ]
        );
    };

    const clearCache = () => {
        Alert.alert('Clear all data?', 'This will delete all project and patterns',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Clear', style: 'destructive', onPress: async () => {
                    await AsyncStorage.clear();
                    setProjects([]),
                    setPatterns([])
                }}
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Data Management</Text>
            <TouchableOpacity style={styles.button} onPress={exportProjects}>
                <Text style={styles.text}>Export Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={importProjects}>
                <Text style={styles.text}>Import Projects</Text>
            </TouchableOpacity>

            <View style={styles.divider}/>
            <TouchableOpacity style={[styles.button, styles.danger]} onPress={clearCache}>
                <Text style={styles.text}>Clear Cache</Text>
            </TouchableOpacity>
        </View>
    )
};

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            padding: 16
        },
        header: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
            color: theme.colors.textDark
        },
        button: {
            padding: 14,
            borderRadius: 10,
            backgroundColor: theme.colors.primary,
            marginBottom: 10,
            alignItems: 'center'
        },
        danger: {
            backgroundColor: theme.colors.delete
        },
        text: {
            color: theme.colors.textDark,
            fontWeight: '600'
        },
        divider: {
            height: 1, 
            backgroundColor: '#ddd',
            marginVertical: 16
        }
    });
}