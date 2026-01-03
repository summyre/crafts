import React from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, Text } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";

type RouteProps = RouteProp<RootStackParamList, 'Camera'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function CameraScreen() {
    const { projectId, sessionId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { setProjects } = useProjects();

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync();
        if (result.canceled) return;

        const uri = result.assets[0].uri;

        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p, sessions: p.sessions.map(s =>
                    s.id === sessionId ? { ...s, photoUri: uri } : s
                ),
            } : p
        ));
        navigation.goBack();
    };

    takePhoto();
    return <View><Text>Opening camera...</Text></View>;
}