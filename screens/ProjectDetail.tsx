import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { PROJECTS, ProjectPhoto } from "../data/projects";
type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;

export default function ProjectDetailScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const project = PROJECTS.find((p) => p.id === projectId);
    // local state - replace with async later
    const [photos, setPhotos] = useState<ProjectPhoto[]>( project?.photos ?? [] );

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found.</Text>
            </View>
        );
    }

    const renderPhoto = ({item}: {item:ProjectPhoto}) => (
        <TouchableOpacity style={styles.photoCard}>
            <Image source={{ uri: item.uri }} style={styles.photo}/>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.subtitle}>{project.craftType}</Text>
            
            {project.notes && (
                <Text style={styles.notes}>{project.notes}</Text>
            )}

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Photo</Text>
            </TouchableOpacity>

            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                renderItem={renderPhoto}
                numColumns={3}
                contentContainerStyle={styles.gallery}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No photos yet. Add one to track progess</Text>
                }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    photoCard: {
        flex: 1/3,
        aspectRatio: 1,
        margin: 4,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    subtitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    notes: {
        fontSize: 14,
        marginBottom: 12,
    },
    addButton: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    gallery: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#222',
    },
    addButtonText: {
        fontWeight: 'bold',
    }
});