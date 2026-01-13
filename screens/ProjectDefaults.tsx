import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from "react-native";
import { useProjects } from "../store/ProjectsContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type RouteProps = RouteProp<RootStackParamList, 'ProjectDefaults'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function ProjectDefaultsScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const { projects, setProjects } = useProjects();
    const project = projects.find(p => p.id === projectId);
    const [craftType, setCraftType] = useState(project?.defaults?.craftType || '');
    const [counterInput, setCounterInput] = useState('');
    const [counters, setCounters] = useState<string[]>(project?.defaults?.counters || []);
    const navigation = useNavigation<NavProps>();

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found</Text>
            </View>
        )
    }

    const addCounter = () => {
        if (!counterInput.trim()) return;
        if (counters.includes(counterInput)) return;

        setCounters(prev => [...prev, counterInput]);
        setCounterInput('');
    };

    const saveDefaults = () => {
        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p,
                defaults: {
                    counters,
                    craftType
                }
            } : p
        ));
        navigation.goBack();
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Project Defaults</Text>
            {/*<Text style={styles.sectionTitle}>Default Counters</Text>
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
                    style={styles.input} />
                <TouchableOpacity onPress={addCounter}>
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveDefaults}>
                <Text style={styles.saveButtonText}>Save Defaults</Text>
            </TouchableOpacity>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        flex: 1
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6
    },
    removeText: {
        color: 'red'
    },
    addRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8
    },
    addText: {
        color: 'blue',
        marginTop: 12
    },
    saveButton: {
        marginTop: 24,
        padding: 14,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
})