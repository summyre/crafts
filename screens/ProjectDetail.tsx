import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjects } from "../store/ProjectsContext";
import { usePatterns } from "../store/PatternsContext";
import { Session, ProjectPhoto, TimelineItem, Pattern } from "../store/types";
import { useStyles } from "../theme/useStyles";
import { useTheme } from "../theme/ThemeContext";
import { createProjectDetailStyles } from "../theme/styles";


type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;
type ProjectTab = 'timeline' | 'sessions' | 'photos';

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${seconds}s`;
};

export default function ProjectDetailScreen() {
    const styles = useStyles();
    const { theme } = useTheme();
    const screenStyles = createProjectDetailStyles(theme);

    const { projectId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const [activeTab, setActiveTab] = useState<ProjectTab>('timeline');

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

    //console.log('Linked patterns found: ', linkedPatterns.length);
    
    const renderPhoto = ({item}: {item: ProjectPhoto}) => {
        const date = new Date(item.createdAt);
        
        return (
            <TouchableOpacity
                style={screenStyles.timelineItem}
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
                <Image source={{uri: item.uri}} style={screenStyles.timelineImage}/>

                <View style={screenStyles.timelineContent}>
                    <Text style={screenStyles.photoTitle}>{item.title || 'Progress photo'}</Text>

                    {item.notes ? (
                        <Text style={screenStyles.notes}>{item.notes}</Text>
                    ): null}

                    <Text style={screenStyles.timestamp}>
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
                    <View style={screenStyles.timelineCard}>
                        <Text style={styles.mutedText}>Session not found (may have been deleted)</Text>
                    </View>
                );
            };

            return (
                <View style={screenStyles.timelineCard}>
                    <View style={screenStyles.sessionBadge}>
                        <Text style={screenStyles.sessionBadgeText}>SESSION</Text>
                    </View>
                    
                    {Object.entries(session.counters.values).map(([name, value]) => (
                        <Text key={name} style={screenStyles.counterText}>{name}: {value}</Text>
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
                <View style={screenStyles.timelineCard}>
                    <View style={screenStyles.sessionBadge}>
                        <Text style={screenStyles.sessionBadgeText}>PHOTO</Text>
                    </View>
                    <TouchableOpacity
                        style={screenStyles.timelineItem}
                        onPress={() => navigation.navigate('PhotoDetail', {projectId, photoId: item.photoId})}>
                            <Image source={{uri: photo.uri}} style={screenStyles.timelineImage} />
                            <View style={screenStyles.timelineContent}>
                                <Text style={screenStyles.photoTitle}>{photo.title || 'Progress photo'}</Text>
                                <Text style={screenStyles.timestamp}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            </View>
                    </TouchableOpacity>
                </View>
            );
        }

        if (item.type === 'pattern') {
            const pattern = patterns.find(p => p.id === item.patternId);
            if (!pattern) return null;
        
            return (
                <View style={screenStyles.timelineCard}>
                    <View style={screenStyles.sessionBadge}>
                        <Text style={screenStyles.sessionBadgeText}>PATTERN</Text>
                    </View>
                    <Text style={screenStyles.patternTitle}>{pattern.title}</Text>
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
                style={screenStyles.timelineItem}
                onPress={() =>
                    navigation.navigate('SessionDetail', {projectId, sessionId: item.id})
                }>
                    <View style={screenStyles.timelineContent}>
                        <Text style={screenStyles.photoTitle}>{date.toLocaleDateString()}</Text>
                    </View>

                    <TouchableOpacity style={screenStyles.milestoneButton} onPress={() => handleToggleMilestone(item.id)}>
                        <Text style={{color:item.isMilestone ? theme.colors.milestone : theme.colors.secondary}}>{item.isMilestone ? 'Milestone' : 'Mark as Milestone'}</Text>
                    </TouchableOpacity>

                    <Text style={screenStyles.timestamp}>
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
                <View style={screenStyles.headerContainer}>
                    <Text style={styles.title}>{project.title}</Text>

                    <TouchableOpacity style={screenStyles.startButton} onPress={() => navigation.navigate('StitchSession', {projectId})}>
                        <Text style={screenStyles.startButtonText}>Start Session</Text>
                    </TouchableOpacity>

                    <View style={styles.tabBar}>
                        {(['timeline', 'sessions', 'photos'] as ProjectTab[]).map(tab => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                                onPress={() => setActiveTab(tab)}>
                                    <Text style={[screenStyles.startButtonText, activeTab === tab && styles.tabTextActive]}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {activeTab === 'timeline' && (
                        <>
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
                        </>
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

                    {activeTab === 'sessions' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'photos' && (
                        <>
                        <TouchableOpacity
                            style={screenStyles.addButton}
                            onPress={() => handleAddPhoto()}>
                                <Text style={screenStyles.addButtonText}>+ Add Photo</Text>
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
                        </>
                    )}
                    <View style={screenStyles.bottomSpacer}/>
                </View>
            </ScrollView>
    );
}

/*
    patternLink: {
        fontSize: 12,            
        color: '#0066cc'
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
        }
        
        compactSection: {
            marginBottom: 24
        },
        
    }); */