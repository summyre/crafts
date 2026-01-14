import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useProjects } from "../store/ProjectsContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

type RouteProps = RouteProp<RootStackParamList, 'PatternEdit'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function EditWishlistPatternScreen() {
    const styles = useScreenStyles();
    const { projectId, patternId } = useRoute<RouteProps>().params ?? {};
    const { projects, setProjects } = useProjects();
    const navigation = useNavigation<NavProps>();

    const project = projects.find(p => p.id === projectId);
    const pattern = project?.patternWishlist?.find(p => p.id === patternId);
    
    const [title, setTitle] = useState(pattern?.title || '');
    const [notes, setNotes] = useState(pattern?.notes || '');
    const [imageUri, setImageUri] = useState(pattern?.imageUri);
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

            <Image source={{uri: pattern.imageUri}} style={styles.image}/>

            <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const useScreenStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
            backgroundColor: theme.colors.background
        },
        title: {
            fontSize: fontSizes.xxl,
            fontWeight: 'bold',
            marginBottom: spacing.md
        },
        input: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.md
        },
        textArea: {
            height: 100
        },
        saveButton: {
            padding: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: theme.colors.primary,
            alignItems: 'center'
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold'
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: borderRadius.md,
            marginBottom: spacing.md
        }
    });
}