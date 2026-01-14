import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

type RouteProps = RouteProp<RootStackParamList, 'PhotoDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function PhotoDetailScreen() {
    const { projectId, photoId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const project = projects.find((p) => p.id === projectId);
    const photo = project?.photos.find((p) => p.id === photoId);
    const styles = useScreenStyles();

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
            {/*<TouchableOpacity
                onPress={() =>
                    navigation.navigate('PhotoFullscreen', { projectId, photoId })
                }>
                    <Image source={{uri:photo.uri}} style={styles.image}/>
                </TouchableOpacity>*/}
            <Image source={{uri: photo.uri}} style={styles.image}/>
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

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.lg,
            backgroundColor: theme.colors.background
        },
        image: {
            width: '100%',
            height: 250,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
        },
        input: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.sm,
            marginBottom: spacing.md,
            backgroundColor: theme.colors.card
        },
        notes: {
            height: 100,
            textAlignVertical: 'top',
            backgroundColor: theme.colors.card
        },
        saveButton: {
            padding: spacing.md,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            backgroundColor: theme.colors.primary,
            marginBottom: spacing.md,
        },
        saveText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        deleteButton: {
            padding: spacing.md,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.delete,
            backgroundColor: theme.colors.delete
        },
        deleteText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });
}