import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Project } from '../store/types';
import { useProjects } from '../store/ProjectsContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Projects'>;

export default function ProjectScreen() {
    const navigation = useNavigation<NavProp>();
    const { projects } = useProjects();

    const renderItem = ({ item }: { item: Project }) => {
        const coverPhoto = item.coverPhotoId ? item.photos.find((p) => p.id === item.coverPhotoId) : item.photos.at(-1);
        const coverUri = coverPhoto?.uri;

        return (
        <TouchableOpacity 
        style={styles.folder} 
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })
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

        )
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('ProjectEdit', undefined)}>
                <Text style={styles.createText}>+ New Project</Text>
            </TouchableOpacity>

            <FlatList
                contentContainerStyle={styles.container}
                data={projects}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No projects yet. Create one to get started.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    folder: {
        flex: 1,
        margin: 8,
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
    },
    folderTitle: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    status: {
        fontSize: 12,
        color: '#666',
    },
    createButton: {
        padding: 14,
        margin: 12,
        borderRadius: 12,
        backgroundColor: '#333',
        alignItems: 'center',
    },
    createText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#555',
    },
    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    placeholder: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText:{
        color: '#888',
        fontSize: 12,
    }
});