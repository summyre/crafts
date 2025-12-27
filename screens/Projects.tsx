import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { PROJECTS, Project } from '../data/projects';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Projects'>;

export default function ProjectScreen() {
    const navigation = useNavigation<NavProp>();

    const renderItem = ({ item }: { item: Project }) => (
        <TouchableOpacity 
        style={styles.folder} 
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })
        }>
            <Text style={styles.folderTitle}>{item.title}</Text>
            <Text style={styles.status}>{item.status}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            contentContainerStyle={styles.container}
            data={PROJECTS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
        />
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
});