import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";

type RouteProps = RouteProp<RootStackParamList, 'PhotoFullscreen'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function PhotoFullscreenScreen() {
    const { projectId, photoId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { projects } = useProjects();

    const project = projects.find((p) => p.id === projectId);
    const photo = project?.photos.find((p) => p.id === photoId);
    if (!photo) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={() => navigation.goBack()}>
                <Image source={{uri:photo.uri}} style={styles.image}/>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    }
})