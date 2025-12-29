import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { PROJECTS, ProjectPhoto } from "../data/projects";

type RouteProps = RouteProp<RootStackParamList, 'PhotoDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function PhotoDetailScreen() {
    const { projectId, photoId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const project = projects.find((p) => p.id === projectId);
    const photo = project?.photos.find((p) => p.id === photoId);

    const [title, setTitle] = useState( photo?.title ?? '');
    const [notes, setNotes] = useState( photo?.notes ?? '');

    if (!photo || !project) {
        return (
            <View style={styles.container}>
                <Text>Photo not found.</Text>
            </View>
        );
    }

    const handleSave = () => {
        setProjects((prev) => prev.map((p) =>
            p.id === projectId ? {
                ...p, photos: p.photos.map((ph) =>
                    ph.id === photoId ? { ...ph, title, notes }: ph),
                } :p
            )
        );
        navigation.goBack();
    }

    const handleDelete = () => {
        Alert.alert('Delete photo', 'Are you sure you want to delete this photo?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    setProjects((prev) => prev.map((p) =>
                        p.id === projectId ? {
                            ...p, photos: p.photos.filter((ph) => 
                                ph.id !== photoId),
                            } :p
                        )
                    );
                    navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Image source={{uri:photo.uri}} style={styles.image}/>
            <TextInput
                placeholder="Photo title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}/>

            <TextInput
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.notes]}
                multiline />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete photo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    notes: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#777',
        marginBottom: 12,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold',
    },
});