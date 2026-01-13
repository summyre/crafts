import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, TextInput, FlatList } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { ProjectPhoto } from "../store/types";

type RouteProps = RouteProp<RootStackParamList, 'SessionDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
}

export default function SessionDetailScreen() {
    const { projectId, sessionId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const project = projects.find((p) => p.id === projectId);
    const session = project?.sessions.find((s) => s.id === sessionId);
    const [notes, setNotes] = useState(session?.notes ?? "");

    if (!project || !session) {
        return (
            <View style={styles.container}>
                <Text>Session not found.</Text>
            </View>
        );
    }

    const saveNotes = () => {
        setProjects((prev) => prev.map((p) =>
            p.id === projectId ? {
                ...p, sessions: p.sessions.map((s) =>
                    s.id === sessionId ? { ...s, notes } : s
                ),
            } : p
        ));
    };

    const handleAddPhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera access is needed.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({quality: 0.7});
        if (result.canceled) return;

        const newPhoto: ProjectPhoto = {
            id: Date.now().toString(),
            uri: result.assets[0].uri,
            createdAt: Date.now(),
        };

        setProjects((prev) => prev.map((p) =>
            p.id === projectId ? {
                ...p,
                photos: [newPhoto, ...(p.photos || [])],
                sessions: p.sessions.map((s) =>
                    s.id === sessionId ? { ...s, photos: [newPhoto, ...(s.photos || [])] } : s
                ),
            } : p
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Session Summary</Text>
            
            <View style={styles.card}>
                <Text>Time: {formatTime(session.seconds)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
                style={styles.notes}
                placeholder="What did you work on this session?"
                multiline
                value={notes}
                onChangeText={setNotes}
                onBlur={saveNotes} />

            <TouchableOpacity style={styles.photoButton} onPress={() => handleAddPhoto()}>
                <Text>Add Progress Photo</Text>
            </TouchableOpacity>
            <FlatList
                data={session.photos}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Image source={{uri: item.uri}} style={{width: 120, height: 120}} />
                )}
                horizontal />
                
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text>Back to Project</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 4
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16
    },
    notes: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 16
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 16
    },
    photoButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16
    },
    backButton: {
        alignItems: 'center',
        padding: 12
    }
});