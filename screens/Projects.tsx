import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Project } from '../store/projectsStore';
import { useProjects } from '../store/ProjectsContext';
//import { PROJECTS, Project } from '../data/projects';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Projects'>;

export default function ProjectScreen() {
    const navigation = useNavigation<NavProp>();
    const { projects } = useProjects();

    const renderItem = ({ item }: { item: Project }) => (
        <TouchableOpacity 
        style={styles.folder} 
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })
        }>
            <Text style={styles.folderTitle}>{item.title}</Text>
            {/*<Text style={styles.status}>{item.status}</Text>*/}
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('ProjectEdit')}>
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
    }
});