import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, TextInput, FlatList } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { ProjectPhoto } from "../store/types";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

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
    const styles = useScreenStyles();
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

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.lg,
            backgroundColor: theme.colors.background
        },
        title: {
            fontSize: fontSizes.xl,
            fontWeight: 'bold',
            marginBottom: spacing.md
        },
        sectionTitle: {
            fontWeight: 'bold',
            marginBottom: spacing.xs
        },
        card: {
            borderWidth: 1,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.lg,
            backgroundColor: theme.colors.card
        },
        notes: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            minHeight: 80,
            textAlignVertical: 'top',
            marginBottom: spacing.lg,
            backgroundColor: theme.colors.card
        },
        image: {
            width: '100%',
            height: 250,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg
        },
        photoButton: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            alignItems: 'center',
            marginBottom: spacing.lg,
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.border
        },
        backButton: {
            alignItems: 'center',
            padding: spacing.md,
            marginBottom: spacing.xxxl,
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.border,
            borderRadius: borderRadius.lg,
            borderWidth: 1
        }
    });
}