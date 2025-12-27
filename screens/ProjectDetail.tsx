import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";

type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;

export default function ProjectDetailScreen() {
    const { projectId } = useRoute<RouteProps>().params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Project ID: {projectId}</Text>
            <Text>Progress notes</Text>
            <Text>Images, linked pattern</Text>
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
});