import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjects } from "../store/ProjectsContext";
import { usePatterns } from "../store/PatternsContext";
import { Session, ProjectPhoto, TimelineItem, Pattern } from "../store/types";

type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${seconds}s`;
};

export default function ProjectDetailScreen() {
    const { projectId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();

    const { projects, setProjects } = useProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found.</Text>
            </View>
        );
    };

    const { patterns } = usePatterns();
    const linkedPatterns: Pattern[] = project?.patternIds ? patterns.filter((p) => {
        const isLinked = project.patternIds!.includes(p.id);
        console.log(`Pattern ${p.id} - ${p.title}: linked = ${isLinked}`);
        return isLinked;
    }) : [];

    console.log('Linked patterns found: ', linkedPatterns.length);
    
    const renderPhoto = ({item}: {item: ProjectPhoto}) => {
        const date = new Date(item.createdAt);
        
        return (
            <TouchableOpacity
                style={styles.timelineItem}
                onPress={() =>
                    navigation.navigate('PhotoDetail', {projectId, photoId: item.id})
                }
                onLongPress={() =>
                    Alert.alert('Set cover photo', 'Use this photo as the project cover?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Set as cover', onPress: () => {
                                setProjects((prev) => prev.map((p) =>
                                    p.id === projectId ? { ...p, coverPhotoId: item.id } : p
                                ));
                            }}
                        ]
                    )
                }>
                <Image source={{uri: item.uri}} style={styles.timelineImage}/>

                <View style={styles.timelineContent}>
                    <Text style={styles.photoTitle}>{item.title || 'Progress photo'}</Text>

                    {item.notes ? (
                        <Text style={styles.notes}>{item.notes}</Text>
                    ): null}

                    <Text style={styles.timestamp}>
                        {date.toLocaleDateString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };
    
    const handleAddPhoto = async (sessionId?: string) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera access is needed.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (result.canceled) return;

        const newPhoto: ProjectPhoto = {
            id: Date.now().toString(),
            uri: result.assets[0].uri,
            createdAt: Date.now(),
        };
        
        setProjects((prev) => prev.map((p) =>
            p.id === projectId ? { ...p, photos: [newPhoto, ...(p.photos || [])] } : p
            )
        );

        const timelineItem: TimelineItem = {
            id: Date.now().toString(),
            type: 'photo',
            photoId: newPhoto.id,
            createdAt: Date.now()
        };

        setProjects((prev) => prev.map((p) =>
            p.id === projectId ? { ...p, timeline: [timelineItem, ...(p.timeline || [])] } : p
            )
        );
    };

    const handleToggleMilestone = (sessionId: string) => {
        setProjects(prev => 
            prev.map(p => {
                if (p.id !== projectId) return p;
                const updatedSessions = p.sessions.map(s =>
                    s.id === sessionId ? { ...s, isMilestone: !s.isMilestone } : s
                );
                return { ...p, sessions: updatedSessions};
            })
        );
    };

    const importPatternToTimeline = (patternId: string) => {
        const timelineItem: TimelineItem = {
            id: Date.now().toString(),
            type: 'pattern',
            patternId,
            createdAt: Date.now(),
            annotations: []
        };

        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p, timeline: [timelineItem, ...(p.timeline || [])]
            } : p
        ));
    };

    const renderTimelineItem = ({item}: {item: TimelineItem}) => {
        if (item.type === 'session') {
            const session = project.sessions.find(s => s.id === item.sessionId);
            if (!session) {
                return (
                    <View style={styles.timelineCard}>
                        <Text style={styles.mutedText}>Session not found (may have been deleted)</Text>
                    </View>
                );
            };

            return (
                <View style={styles.timelineCard}>
                    <View style={styles.sessionBadge}>
                        <Text style={styles.sessionBadgeText}>SESSION</Text>
                    </View>
                    
                    {Object.entries(session.counters.values).map(([name, value]) => (
                        <Text key={name} style={styles.counterText}>{name}: {value}</Text>
                    ))}

                    <Text style={styles.timeText}>Time: {formatTime(session.seconds)}</Text>
                    <Text style={styles.dateText}>{new Date(session.createdAt).toLocaleString()}</Text>
                </View>
            );
        }

        if (item.type === 'photo') {
            const photo = project.photos.find(p => p.id === item.photoId);
            if (!photo) return null;

            return (
                <View style={styles.timelineCard}>
                    <View style={styles.sessionBadge}>
                        <Text style={styles.sessionBadgeText}>PHOTO</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.timelineItem}
                        onPress={() => navigation.navigate('PhotoDetail', {projectId, photoId: item.photoId})}>
                            <Image source={{uri: photo.uri}} style={styles.timelineImage} />
                            <View style={styles.timelineContent}>
                                <Text style={styles.photoTitle}>{photo.title || 'Progress photo'}</Text>
                                <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            </View>
                    </TouchableOpacity>
                </View>
            );
        }

        if (item.type === 'pattern') {
            const pattern = patterns.find(p => p.id === item.patternId);
            if (!pattern) return null;
        
            return (
                <View style={styles.timelineCard}>
                    <View style={styles.sessionBadge}>
                        <Text style={styles.sessionBadgeText}>PATTERN</Text>
                    </View>
                    <Text style={styles.patternTitle}>{pattern.title}</Text>
                    <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
                </View>
            );
        }
        return null;
    }

    const renderSession = ({item}: {item: Session}) => {
        const date = new Date(item.createdAt);

        return (
            <TouchableOpacity
                style={styles.timelineItem}
                onPress={() =>
                    navigation.navigate('SessionDetail', {projectId, sessionId: item.id})
                }>
                    <View style={styles.sessionBadge}>
                        <Text style={styles.sessionBadgeText}>SESSION</Text>
                    </View>

                    <View style={styles.timelineContent}>
                        <Text style={styles.photoTitle}>{date.toLocaleDateString()}</Text>
                    </View>

                    <TouchableOpacity style={styles.milestoneButton} onPress={() => handleToggleMilestone(item.id)}>
                        <Text style={{color:item.isMilestone ? 'gold': '#444'}}>{item.isMilestone ? 'Milestone' : 'Mark as Milestone'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.timestamp}>
                        Time: {formatTime(item.seconds)}
                    </Text>
            </TouchableOpacity>
        );
    };

    const handleLinkPattern = () => { navigation.navigate('PatternPicker', {projectId}); };

    const sortedTimeline = [...(project.timeline || [])].sort((a,b) => b.createdAt - a.createdAt);
    const sortedSessions = [...project.sessions].sort((a,b) => b.createdAt - a.createdAt);
    const sortedPhotos = [...project.photos].sort((a,b) => b.createdAt - a.createdAt);
    
    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContainer}
            showsVerticalScrollIndicator={true}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{project.title}</Text>

                    <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('StitchSession', {projectId})}>
                        <Text style={styles.startButtonText}>Start Session</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.sectionTitle}>Timeline</Text>

                    {sortedTimeline.length > 0 ? (
                        <View style={styles.listContainer}>
                            {sortedTimeline.map((item) => (
                                <View key={item.id}>
                                    {renderTimelineItem({item})}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.mutedText}>Timeline is empty. Start a session or add a photo</Text>
                    )}
                    
                    {/*<View style={styles.compactSection}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionHeader}>Linked Patterns</Text>
                            <TouchableOpacity style={styles.smallAddButton} onPress={handleLinkPattern}>
                                <Text style={styles.smallAddButtonText}>+ Link Pattern</Text>
                            </TouchableOpacity>
                        </View>
                        {linkedPatterns.length > 0 ? (
                            <View style={styles.compactPatternContainer}>
                                {linkedPatterns.map(pattern => (
                                    <TouchableOpacity
                                        key={pattern.id}
                                        style={styles.compactPatternItem}
                                        onPress={() => {
                                            const inTimeline = project.timeline?.some(item =>
                                                item.type === 'pattern' && item.patternId === pattern.id
                                            );

                                            if (!inTimeline) {
                                                importPatternToTimeline(pattern.id);
                                                Alert.alert('Success', 'Pattern added');
                                            } else {
                                                navigation.navigate('PatternAnnotate', {
                                                    projectId,
                                                    timelineItemId: project.timeline.find(item =>
                                                        item.type === 'pattern' && item.patternId === pattern.id
                                                    )?.id || ''
                                                });
                                            }
                                        }}>
                                            <Text style={styles.compactPatternTitle}>{pattern.title}</Text>
                                            {pattern.link && (
                                                <Text style={styles.compactPatternLink} numberOfLines={1}>{pattern.link}</Text>
                                            )}
                                        </TouchableOpacity>
                                ))}
                            </View>
                        ): (
                            <View>
                                <Text style={styles.emptyText}>No patterns linked</Text>
                                <Text style={styles.mutedText}>Project has {project.patternIds?.length || 0} pattern Ids</Text>
                            </View>
                        )}
                    </View>*/}

                    <Text style={styles.sectionHeader}>Sessions</Text>

                    {sortedSessions.length > 0 ? (
                        <View style={styles.listContainer}>
                            {sortedSessions.map((item) => (
                                <View key={item.id}>
                                    {renderSession({item})}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>No sessions yet. Start one to track progress.</Text>
                    )}

                    <Text style={styles.sectionHeader}>Photos</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddPhoto()}>
                            <Text style={styles.addButtonText}>+ Add Photo</Text>
                    </TouchableOpacity>

                    {sortedPhotos.length > 0 ? (
                        <View style={styles.listContainer}>
                            {sortedPhotos.map((item) => (
                                <View key={item.id}>
                                    {renderPhoto({item})}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>No photos yet. Add one to track progress.</Text>
                    )}
                    <View style={styles.bottomSpacer}/>
                </View>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 40
    },
    headerContainer: {
        paddingBottom: 20
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContainer: {
        paddingBottom: 40,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    photoCard: {
        flex: 1/3,
        aspectRatio: 1,
        margin: 4,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    photo: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8
    },
    photoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    notes: {
        fontSize: 14,
        marginVertical: 6,
        color: '#666',
        lineHeight: 20
    },
    addButton: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    smallAddButton: {
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    gallery: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        color: '#222',
        fontStyle: 'italic'
    },
    addButtonText: {
        fontWeight: 'bold',
    },
    smallAddButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555'
    },
    deleteButton: {
        marginTop: 24,
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold',
    },
    editText: {
        color: '#444',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 4
    },
    timelineImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
        flexShrink: 0,
    },
    timelineContent: {
        flex: 1,
        justifyContent: 'center'
    },
    timestamp: {
        fontSize: 12,
        color: '#777',
        marginTop: 4
    },
    sessionBadge: {
        backgroundColor: '#e0e7ff',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
        alignSelf: 'flex-start'
    },
    sessionBadgeText: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 16
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    milestoneButton: {
        marginLeft: 10,
        padding: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'gold',
        alignSelf: 'flex-start'
    },
    patternTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    patternLink: {
        fontSize: 12,
        color: '#0066cc'
    },
    patternItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#fafafa'
    },
    compactPatternTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2
    },
    compactPatternLink: {
        fontSize: 11
    },
    compactPatternItem: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 6,
    },
    compactPatternContainer: {
        marginBottom: 8
    },
    timelineList: {
        marginBottom: 8
    },
    listContainer: {
        marginBottom: 24
    },
    startButton: {
        padding: 18,
        backgroundColor: '#4f46e5',
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius:  4,
        elevation: 3
    },
    startButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    timelineCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    counterText: {
        fontSize: 14,
        marginBottom: 4
    },
    timeText: {
        marginTop: 8,
        fontStyle: 'italic'
    },
    dateText: {
        marginTop: 8,
        fontSize: 12,
        color: '#555'
    },
    mutedText: {
        color: '#777',
        fontStyle: 'italic',
        marginBottom: 24,
        paddingVertical: 12,
        textAlign: 'center'
    },
    compactSection: {
        marginBottom: 24
    },
    sectionSpacer: {
        height: 20
    },
    bottomSpacer: {
        height: 60
    }
});