import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const { patterns } = usePatterns();
    const project = projects.find(p => p.id === projectId);
    const timelineItem = project?.timeline.find(t => t.id === timelineItemId);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!project || !timelineItem || timelineItem.type !== 'pattern') { 
        return (
            <View style={styles.container}>
                <Text>Pattern not found.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const pattern = patterns.find(p => p.id === timelineItem.patternId);
    if (!pattern) {
        return (
            <View style={styles.container}>
                <Text>Pattern data not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const [annotations, setAnnotations] = useState<string[]>(timelineItem.annotations || []);
    const [newAnnotation, setNewAnnotation] = useState('');

    const handleSaveAnnotation = () => {
        if (!newAnnotation.trim()) return;

        const updatedAnnotations = [...annotations, newAnnotation];
        setAnnotations(updatedAnnotations);
        setNewAnnotation('');

        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;

            const updatedTimeline = p.timeline?.map(item => {
                if (item.id === timelineItemId && item.type === 'pattern') {
                    return { ...item, annotations: updatedAnnotations };
                }
                return item;
            });

            return { ...p, timeline: updatedTimeline };
        }));
    };

    const handleDeleteAnnotation = (index: number) => {
        Alert.alert('Delete Annotation', 'Are you sure you want to delete this annotation?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const updatedAnnotations = annotations.filter((_, i) => i !== index);
                        setAnnotations(updatedAnnotations);

                        setProjects(prev => prev.map(p => {
                            if (p.id !== projectId) return p;

                            const updatedTimeline = p.timeline?.map(item => {
                                if (item.id === timelineItemId && item.type === 'pattern') {
                                    return { ...item, annotations: updatedAnnotations };
                                }
                                return item;
                            });

                            return { ...p, timeline: updatedTimeline };
                        }));
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4a6fa5" />
                <Text style={styles.loadingText}>Loading pattern...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Annotate Pattern</Text>
                <View style={{width: 60}}/>
            </View>

            <View style={styles.patternInfo}>
                <Text style={styles.patternTitle}>{pattern.title}</Text>
                {pattern.notes && ( <Text style={styles.patternNotes}>{pattern.notes}</Text>)}
            </View>

            {/* simple annotation input - replace with canvas later */}
            <View style={styles.annotationSection}>
                <Text style={styles.sectionTitle}>Annotations</Text>

                <View style={styles.annotationInputContainer}>
                    <TextInput
                        style={styles.annotationInput}
                        placeholder="Add an annotation note"
                        value={newAnnotation}
                        onChangeText={setNewAnnotation}
                        multiline />
                    
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            !newAnnotation.trim() && styles.addButtonDisabled
                        ]}
                        onPress={handleSaveAnnotation}
                        disabled={!newAnnotation.trim()}>
                            <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {annotations.length === 0 ? (
                    <Text style={styles.emptyText}>No annotations yet. Add notes about your pattern</Text>
                ) : (
                    <View style={styles.annotationsList}>
                        {annotations.map((annotation, index) => (
                            <View key={index} style={styles.annotationItem}>
                                <Text style={styles.annotationText}>{annotation}</Text>
                                <TouchableOpacity
                                    onPress={() => handleDeleteAnnotation(index)}
                                    style={styles.deleteButton}>
                                        <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* add canvas drawing here */}
            <View style={styles.canvasPlaceholder}>
                <Text style={styles.placeholderText}>Pattern Canvas Area</Text>
                <Text style={styles.placeholderSubtext}>Canvas drawing feature coming soon</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    backButton: {
        fontSize: 16,
        color: '#4a6fa5',
        fontWeight: 'bold'
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderBottomColor: '#eee'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    patternInfo: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 16
    },
    patternTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8
    },
    patternNotes: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic'
    },
    annotationSection: {
        padding: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333'
    },
    annotationInputContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    annotationInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        backgroundColor: '#f9f9f9',
        fontSize: 14
    },
    addButton: {
        backgroundColor: '#4a6fa5',
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    },
    annotationsList: {
        marginTop: 8
    },
    annotationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#fff'
    },
    annotationText: {
        flex: 1,
        fontSize: 14,
        color: '#333'
    },
    deleteButton: {
        padding: 4,
        marginLeft: 8
    },
    deleteButtonText: {
        color: '#ff4444',
        fontSize: 16,
        fontWeight: 'bold'
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        marginTop: 20
    },
    canvasPlaceholder: {
        flex: 1,
        margin: 16,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600'
    },
    placeholderSubtext: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    }
})