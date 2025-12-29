import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from "../App";
//import { PROJECTS, ProjectPhoto } from "../data/projects";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjects } from "../store/ProjectsContext";
import { ProjectPhoto } from "../store/projectsStore";

type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function ProjectDetailScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();

    const { projects, setProjects } = useProjects();
    const project = projects.find((p) => p.id === projectId);

    useEffect(() => {
        if (!project) return;

        navigation.setOptions({
            title: project.title,
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('ProjectEdit', {projectId: project.id})}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            ),
        });
    }, [project?.title]);

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found.</Text>
            </View>
        );
    }

    const handleAddPhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera access is needed.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (result.canceled) return;

        const newPhoto = {
            id: Date.now().toString(),
            uri: result.assets[0].uri,
            createdAt: Date.now(),
        };
        
        setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, photos: [newPhoto, ...p.photos]}:p ));

    };

    const handleDeleteProject = () => {
        Alert.alert('Delete project', 'This will delete the project and all its photos. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setProjects((prev) => prev.filter((p) => p.id !== projectId));
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const renderPhoto = ({item}: {item:ProjectPhoto}) => (
        <TouchableOpacity 
            style={styles.photoCard} 
            onPress={() =>
                navigation.navigate('PhotoDetail', {projectId, photoId: item.id,})
            }>
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

            <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
                <Text style={styles.addButtonText}>+ Add Photo</Text>
            </TouchableOpacity>

            <FlatList
                data={project.photos}
                keyExtractor={(item) => item.id}
                renderItem={renderPhoto}
                numColumns={3}
                contentContainerStyle={styles.gallery}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No photos yet. Add one to track progess</Text>
                }/>
            
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProject}>
                <Text style={styles.deleteText}>Delete Project</Text>
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
    },
    deleteButton: {
        marginTop: 24,
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
    editText: {
        color: '#444',
        fontWeight: 'bold',
        fontSize: 16,
    },
});