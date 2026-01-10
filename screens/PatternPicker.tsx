import React from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { usePatterns } from "../store/PatternsContext";
import { useProjects } from "../store/ProjectsContext";
import { TimelineItem } from "../store/types";
import { FlatList, TouchableOpacity, Text } from "react-native";

type RouteProps = RouteProp<RootStackParamList, 'PatternPicker'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function PatternPickerScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const { patterns } = usePatterns();
    const { setProjects } = useProjects();
    const navigation = useNavigation();

    const linkPattern = (patternId: string) => {
        const timelineItem: TimelineItem = {
            id: Date.now().toString(),
            type: 'pattern',
            patternId,
            createdAt: Date.now(),
            annotations: []
        }

        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p, timeline: [timelineItem, ...(p.timeline || [])],
            } : p
        ));

        navigation.goBack();
    };

    return (
        <FlatList
            data={patterns}
            keyExtractor={p => p.id}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => linkPattern(item.id)}>
                    <Text>{item.title}</Text>
                </TouchableOpacity>
            )}
        />
    )
}