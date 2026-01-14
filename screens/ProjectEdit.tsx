import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { Project } from "../store/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

type RouteProps = RouteProp<RootStackParamList, 'ProjectEdit'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function ProjectEditScreen() {
    const styles = useScreenStyles();
    const { projectId } = useRoute<RouteProps>().params ?? {};
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const existingProject = projects.find((p) => p.id === projectId);
    const [title, setTitle] = useState(existingProject?.title ?? '');
    const [craftType, setCraftType] = useState<Project['craftType']>(existingProject?.craftType ?? 'Crochet');
    const [notes, setNotes] = useState(existingProject?.notes ?? '');
    const [counterInput, setCounterInput] = useState('');
    const [counters, setCounters] = useState<string[]>(existingProject?.defaults?.counters || []);

    const handleSave = () => {
        if (!title.trim()) return;
        
        if (existingProject) {
            setProjects((prev) => prev.map((p) =>
                p.id === existingProject.id ? {
                    ...p, title, craftType, notes
                    } :p
                )
            );
        } else {
            setProjects((prev) => [
                {
                    id: Date.now().toString(),
                    title,
                    craftType,
                    notes,
                    photos: [],
                    sessions: [],
                    timeline: []
                },
                ...prev,
            ]);
        }
        navigation.goBack();
    };

    const addCounter = () => {
        if (!counterInput.trim()) return;
        if (counters.includes(counterInput)) return;

        setCounters(prev => [...prev, counterInput]);
        setCounterInput('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{existingProject ? 'Edit Project' : 'Create New Project'}</Text>
            <TextInput
                placeholder="Project Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                autoFocus={!existingProject} />

            <View style={styles.toggleRow}>
                {(['Crochet', 'Cross Stitch'] as const).map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.toggle,
                            craftType === type && styles.toggleActive,
                        ]}
                        onPress={() => setCraftType(type)}>
                            <Text
                                style={[
                                    styles.toggleText,
                                    craftType === type && styles.toggleTextActive,
                                ]}>{type}</Text>
                        </TouchableOpacity>
                ))}
            </View>

            <TextInput
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.notes]}
                multiline />

            <Text>Set Initial Counters</Text>
            {counters.map(name => (
                <View key={name} style={styles.counterRow}>
                    <Text>{name}</Text>
                    <TouchableOpacity onPress={() => setCounters(prev => prev.filter(c => c!== name))}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}
            
            <View style={styles.addRow}>
                <TextInput
                    placeholder="Counter name"
                    value={counterInput}
                    onChangeText={setCounterInput}
                    style={styles.counterInput} />
                <TouchableOpacity onPress={addCounter}>
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>
                    {existingProject ? 'Save Changes' : 'Create Project'}
                </Text>
            </TouchableOpacity>
        </View>
    );

}

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.lg,
            backgroundColor: theme.colors.background
        },
        title: {
            fontSize: fontSizes.xxxl,
            fontWeight: 'bold',
            marginBottom: spacing.xxl,
            textAlign: 'center',
            color: theme.colors.text
        },
        input: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.lg,
            backgroundColor: theme.colors.card
        },
        notes: {
            height: 100,
            textAlignVertical: 'top',
        },
        toggle: {
            flex: 1,
            padding: spacing.md,
            borderWidth: 1,
            borderRadius: borderRadius.md,
            alignContent: 'center',
            marginHorizontal: 1,
        },
        toggleRow: {
            flexDirection: 'row',
            marginBottom: spacing.lg,
        },
        toggleActive: {
            backgroundColor: theme.colors.secondary,
        },
        toggleText: {
            fontWeight: 'bold',
        },
        toggleTextActive: {
            color: '#fff',
        },
        saveButton: {
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            backgroundColor: theme.colors.primary,
        },
        saveText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        counterInput: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginTop: spacing.sm,
            marginBottom: spacing.lg,
            flex: 1,
            backgroundColor: theme.colors.card
        },
        counterRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: spacing.sm
        },
        removeText: {
            color: theme.colors.delete
        },
        addRow: {
            flexDirection: 'row',
            gap: spacing.sm,
            marginTop: spacing.sm
        },
        addText: {
            color: 'blue',
            marginTop: spacing.xl
        }
    });
}