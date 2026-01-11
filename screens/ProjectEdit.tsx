import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { Project } from "../store/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RouteProps = RouteProp<RootStackParamList, 'ProjectEdit'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function ProjectEditScreen() {
    const { projectId } = useRoute<RouteProps>().params ?? {};
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const existingProject = projects.find((p) => p.id === projectId);
    const [title, setTitle] = useState(existingProject?.title ?? '');
    const [craftType, setCraftType] = useState<Project['craftType']>(existingProject?.craftType ?? 'Crochet');
    const [notes, setNotes] = useState(existingProject?.notes ?? '');

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

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>
                    {existingProject ? 'Save Changes' : 'Create Project'}
                </Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    notes: {
        height: 100,
        textAlignVertical: 'top',
    },
    toggle: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        alignContent: 'center',
        marginHorizontal: 4,
    },
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    toggleActive: {
        backgroundColor: '#777',
    },
    toggleText: {
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: '#fff',
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#777',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});