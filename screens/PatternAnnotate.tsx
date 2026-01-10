import React, { useRef } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { Project, TimelineItem } from "../store/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePatterns } from "../store/PatternsContext";
import { SketchCanvas } from "@terrylinla/react-native-sketch-canvas";

type RouteProps = RouteProp<RootStackParamList, 'PatternAnnotate'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function PatternAnnotateScreen() {
    const { projectId, timelineItemId } = useRoute<RouteProps>().params;
    const { projects, setProjects } = useProjects();
    const { patterns } = usePatterns();
    const project = projects.find(p => p.id === projectId);
    const timelineItem = project?.timeline.find(t => t.id === timelineItemId);

    if (!project || !timelineItem || timelineItem.type !== 'pattern') { return <Text>Not found</Text>;}

    const pattern = patterns.find(p => p.id === timelineItem.patternId);
    if (!pattern) return <Text>Pattern missing</Text>;

    const canvasRef = useRef<SketchCanvas>(null);

    const saveDrawing = () => {
        canvasRef.current?.save('png', false, '', '', false, false, true);
    };

    const addAnnotation = (item: TimelineItem, path: string): TimelineItem => {
        if (item.type !== 'pattern') return item;
        return { ...item, annotations: [...(item.annotations || []), path] };
    };

    const onSaved = (success: boolean, path?: string) => {
        if (!success || !path) return;

        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p, timeline: p.timeline.map(t =>
                    t.id === timelineItemId ? addAnnotation(t, path) : t
                ),
            } : p
        ));
    };

    return (
        <View style={{ flex: 1 }}>
            <SketchCanvas
                ref={canvasRef}
                style={{flex: 1}}
                strokeColor="red"
                strokeWidth={4}
                onSketchSaved={onSaved}
                localSourceImage={pattern.imageUri ? ({uri: pattern.imageUri, mode: 'AspectFill'} as any): undefined} />

            <TouchableOpacity onPress={saveDrawing}>
                <Text>Save Annotations</Text>
            </TouchableOpacity>
        </View>
    );
};