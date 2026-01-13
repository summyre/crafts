import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useProjects } from "../store/ProjectsContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type RouteProps = RouteProp<RootStackParamList, 'PatternEdit'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function EditWishlistPatternScreen() {
    const { projectId, patternId } = useRoute<RouteProps>().params ?? {};
    const { projects, setProjects } = useProjects();
    const navigation = useNavigation<NavProps>();

    const project = projects.find(p => p.id === projectId);
    const pattern = project?.patternWishlist?.find(p => p.id === patternId);
    
    const [title, setTitle] = useState(pattern?.title || '');
    const [notes, setNotes] = useState(pattern?.notes || '');
    //const wishlist = project?.patternWishlist ?? [];

    if (!pattern) {
        return (
            <View style={styles.container}>
                <Text>Pattern not found</Text>
            </View>
        );
    }

    const save = () => {
        if (!project) return;

        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p,
                patternWishlist: p.patternWishlist?.map(pat =>
                    pat.id === patternId ? { ...pat, title, notes } : pat
                ) ?? []
            } : p
        ));
        navigation.goBack();
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Pattern</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Pattern title" />

            <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes"
                multiline />

            <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12
    },
    textArea: {
        height: 100
    },
    saveButton: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#333',
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});