import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjects } from "../store/ProjectsContext";
import { Session, ProjectPhoto } from "../store/types";

type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export default function ProjectDetailScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();

    const { projects, setProjects } = useProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found.</Text>
            </View>
        );
    };

    const renderPhoto = ({item}: {item: ProjectPhoto}) => {
        const date = new Date(item.createdAt);
        
        return (
            <TouchableOpacity
                style={styles.timelineItem}
                onPress={() =>
                    navigation.navigate('PhotoDetail', {projectId, photoId: item.id})
                }
                onLongPress={() =>
                    Alert.alert('Set cover photo', 'Use this photo as the project cover?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Set as cover', onPress: () => {
                                setProjects((prev) => prev.map((p) =>
                                    p.id === projectId ? { ...p, coverPhotoId: item.id } : p
                                ));
                            }}
                        ]
                    )
                }>
                <Image source={{uri: item.uri}} style={styles.timelineImage}/>

                <View style={styles.timelineContent}>
                    <Text style={styles.photoTitle}>{item.title || 'Progress photo'}</Text>

                    {item.notes ? (
                        <Text style={styles.notes}>{item.notes}</Text>
                    ): null}

                    <Text style={styles.timestamp}>
                        {date.toLocaleDateString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };
    
    const handleAddPhoto = async (sessionId?: string) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera access is needed.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (result.canceled) return;

        const newPhoto: ProjectPhoto = {
            id: Date.now().toString(),
            uri: result.assets[0].uri,
            createdAt: Date.now(),
        };
        
        setProjects((prev) => prev.map((p) =>
            p.id === projectId ? { ...p, photos: [newPhoto, ...(p.photos || [])] } : p
            )
        );
    };

    const handleToggleMilestone = (sessionId: string) => {
        setProjects(prev => 
            prev.map(p => {
                if (p.id !== projectId) return p;
                const updatedSessions = p.sessions.map(s =>
                    s.id === sessionId ? { ...s, isMilestone: !s.isMilestone } : s
                );
                return { ...p, sessions: updatedSessions};
            })
        );
    }

    const renderSession = ({item}: {item: Session}) => {
        const date = new Date(item.createdAt);

        return (
            <TouchableOpacity
                style={styles.timelineItem}
                onPress={() =>
                    navigation.navigate('SessionDetail', {projectId, sessionId: item.id})
                }>
                    <View style={styles.sessionBadge}>
                        <Text style={styles.sessionBadgeText}>SESSION</Text>
                    </View>

                    <View style={styles.timelineContent}>
                        <Text style={styles.photoTitle}>{date.toLocaleDateString()}</Text>
                    </View>

                    <TouchableOpacity style={styles.milestoneButton} onPress={() => handleToggleMilestone(item.id)}>
                        <Text style={{color:item.isMilestone ? 'gold': '#444'}}>{item.isMilestone ? 'Milestone' : 'Mark as Milestone'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.notes}>
                        Rows: {item.counters.rows}
                        Inc: {item.counters.increase}
                        Dec: {item.counters.decrease}
                    </Text>

                    <Text style={styles.timestamp}>
                        Time: {formatTime(item.counters.seconds)}
                    </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{project.title}</Text>

            <Text style={styles.sectionHeader}>Sessions</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('StitchSession', {projectId})}>
                    <Text style={styles.addButtonText}>+ New Session</Text>
            </TouchableOpacity>

            <FlatList
                data={project.sessions}
                keyExtractor={(item) => item.id}
                renderItem={renderSession}
                scrollEnabled={true}
                ListEmptyComponent={<Text style={styles.emptyText}>No sessions yet. Start one to track progress.</Text>}
                />

            <Text style={styles.sectionHeader}>Photos</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddPhoto()}>
                    <Text style={styles.addButtonText}>+ Add Photo</Text>
            </TouchableOpacity>

            <FlatList
                data={project.photos}
                keyExtractor={(item) => item.id}
                renderItem={renderPhoto}
                scrollEnabled={true}
                ListEmptyComponent={<Text style={styles.emptyText}>No photos yet. Add one to track progress.</Text>}
                />
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
    photoTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    notes: {
        fontSize: 14,
        marginVertical: 4,
        color: '#666',
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
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#333',
    },
    timelineImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
        flexShrink: 0,
    },
    timelineContent: {
        flex: 1,
        justifyContent: 'center'
    },
    timestamp: {
        fontSize: 11,
        color: '#777',
    },
    sessionBadge: {
        backgroundColor: '#ddd',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
        alignSelf: 'flex-start'
    },
    sessionBadgeText: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8
    },
    milestoneButton: {
        marginTop: 8,
        padding: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'gold',
        alignSelf: 'flex-start'
    }
});