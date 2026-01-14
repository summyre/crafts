import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Project } from '../store/types';
import { useProjects } from '../store/ProjectsContext';
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Projects'>;

export default function ProjectScreen() {
    const navigation = useNavigation<NavProp>();
    const { projects, setProjects } = useProjects();
    const styles = useScreenStyles();

    const renderItem = ({ item }: { item: Project }) => {
        const coverPhoto = item.coverPhotoId ? item.photos.find((p) => p.id === item.coverPhotoId) : item.photos.at(-1);
        const coverUri = coverPhoto?.uri;

        return (
            <ScrollView style={styles.container}>
                <View style={styles.projectCard}>
                    <TouchableOpacity 
                    style={styles.folder} 
                    onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
                    onLongPress={() =>
                        Alert.alert('Delete project', `Are you sure you want to delete "${item.title}"?`,
                            [
                                {text: 'Cancel', style: 'cancel'},
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => handleDeleteProject(item.id)
                                }
                            ]
                        )
                    }>
                        {coverUri ? (
                            <Image source={{uri: coverUri}} style={styles.thumbnail}/>
                        ) : (
                            <View style={styles.placeholder}>
                                <Text style={styles.placeholderText}>No image</Text>
                            </View>
                        )}
                        
                        <Text style={styles.folderTitle}>{item.title}</Text>
                        {/*<Text style={styles.status}>{item.status}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.wishlistButton} onPress={() => navigation.navigate('PatternWishlist', {projectId: item.id})}>
                        <Text style={styles.wishlistButtonText}>Pattern</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const handleDeleteProject = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('ProjectEdit', undefined)}>
                <Text style={styles.createText}>+ New Project</Text>
            </TouchableOpacity>

            <FlatList
                contentContainerStyle={styles.sectionContainer}
                data={projects}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No projects yet. Create one to get started.</Text>
                }
            />
        </View>
    );
}

const useScreenStyles = () =>{
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.xs,
            backgroundColor: theme.colors.background
        },
        sectionContainer: {
            padding: spacing.md,
            backgroundColor: theme.colors.background
        },
        projectCard: {
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.xs
        },
        folder: {
            flex: 1,
            margin: spacing.sm,
            padding: spacing.lg,
            borderWidth: 1,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            borderColor: theme.colors.border
        },
        folderTitle: {
            fontWeight: 'bold',
            marginBottom: spacing.xs,
            fontSize: fontSizes.xxl
        },
        status: {
            fontSize: fontSizes.sm,
            color: theme.colors.text,
        },
        createButton: {
            padding: spacing.lg,
            margin: spacing.md,
            borderRadius: borderRadius.lg,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
        },
        createText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: fontSizes.lg,
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 40,
            color: theme.colors.text,
        },
        thumbnail: {
            width: '100%',
            height: 150,
            borderRadius: borderRadius.md,
            marginBottom: spacing.lg,
        },
        placeholder: {
            width: '100%',
            height: 60,
            borderRadius: borderRadius.md,
            marginBottom: spacing.sm,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
        },
        placeholderText:{
            color: theme.colors.text,
            fontSize: fontSizes.sm,
        },
        wishlistButton: {
            padding: spacing.md,
            margin: spacing.md,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            backgroundColor: theme.colors.secondary
        },
        wishlistButtonText: {
            fontWeight: 'bold',
            fontSize: fontSizes.lg,
            color: '#fff'
        }
    });
}