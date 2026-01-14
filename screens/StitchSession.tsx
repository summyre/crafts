import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { Session, TimelineItem } from "../store/types";
import { useCounter } from "../hooks/useCounter";
import { useTimer } from "../hooks/useTimer";
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

type RouteProps = RouteProp<RootStackParamList, 'StitchSession'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
};

export default function StitchSessionScreen() {
    const styles = useScreenStyles();
    const { projectId } = useRoute<RouteProps>().params;
    const navigation = useNavigation<NavProps>();
    const { projects, setProjects } = useProjects();
    const project = projects.find(p => p.id === projectId)

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found</Text>
            </View>
        );
    }

    const defaultCounters = project.defaults?.counters?.length ? Object.fromEntries(project.defaults.counters.map(name => [name, 0])) : {Rows: 0};
    
    const { counters, addCounter, removeCounter, increment, decrement } = useCounter({values: defaultCounters});
    const [newCounterName, setNewCounterName] = useState('');
    const { seconds, start, pause, reset, running } = useTimer(0);

    const handleSaveSession = () => {
        if (Object.keys(counters.values).length === 0) {
            Alert.alert('No counters', 'Add at least one before saving');
            return;
        }

        const newSession: Session = {
            id: Date.now().toString(),
            createdAt: Date.now(),
            counters,
            isMilestone: false,
            seconds
        };
        
        const timelineItem: TimelineItem = {
            id: `${newSession.id}-session`,
            type: 'session',
            sessionId: newSession.id,
            createdAt: newSession.createdAt
        };

        setProjects(prev => prev.map(p =>
            p.id === projectId ? {
                ...p,
                sessions: [newSession, ...p.sessions],
                timeline: [timelineItem, ...(p.timeline || [])]
            } : p
        ));
        navigation.goBack();
    };
    
    {/*const finishSession = () => {
        const newSession: Session = {
            id: Date.now().toString(),
            createdAt: Date.now(),
            counters: { 
                rows: rows.value, 
                increase: increase.value, 
                decrease: decrease.value, 
                seconds: timer.seconds
            }
        };

        const timelineItem: TimelineItem = {
            id: Date.now().toString() + '-session',
            type: 'session',
            sessionId: newSession.id,
            createdAt: newSession.createdAt
        };

        setProjects((prev) => prev.map(p =>
            p.id === projectId ? {
                ...p, 
                sessions: [newSession, ...p.sessions],
                timeline: [timelineItem, ...(p.timeline || [])]
            } : p
        ));
    
        navigation.replace('SessionDetail', { projectId, sessionId: newSession.id });
    };*/}

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stitch Session</Text>
            
            <View style={styles.timerRow}>
                <Text style={styles.timerText}>
                    Time: {formatTime(seconds)}
                </Text>

                <TouchableOpacity style={styles.timerButton} onPress={running ? pause: start}>
                    <Text style={styles.timerButton}>{running ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timerButton} onPress={reset}>
                    <Text style={styles.timerButton}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <Text style={styles.sectionTitle}>Counters</Text>
                {Object.entries(counters.values).map(([name, value]) => (
                    <View key={name} style={styles.counterRow}>
                        <View style={styles.counterButtons}>
                            <TouchableOpacity style={styles.counterButton} onPress={() => increment(name)}>
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterName}>{name}: {value}</Text>
                            <TouchableOpacity style={styles.counterButton} onPress={() => decrement(name)}>
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.removeButton} onPress={() => Alert.alert(
                                'Remove Counter',
                                `Remove "${name}"?`,
                                [
                                    {text: 'Cancel', style: 'cancel'},
                                    {text: 'Remove', style: 'destructive', onPress: () => removeCounter(name)}
                                ]
                            )}>
                                <Text style={styles.delete}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.addCounterRow}>
                    <TextInput
                        placeholder='New counter name'
                        value={newCounterName}
                        onChangeText={setNewCounterName}
                        style={styles.input} />
                    
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            addCounter(newCounterName);
                            setNewCounterName('');
                        }}>
                            <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSession}>
                <Text style={styles.saveButtonText}>Save session</Text>
            </TouchableOpacity>
        </View>
    );
};

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.lg,
            backgroundColor: theme.colors.background
        },
        title: {
            fontSize: fontSizes.xxl,
            fontWeight: 'bold',
            marginBottom: spacing.lg,
            color: theme.colors.text
        },
        header: {
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        headerText: {
            fontSize: fontSizes.xl,
            fontWeight: 'bold',
        },
        timerRow: {
            textAlign: 'center',
            fontSize: fontSizes.lg,
            marginVertical: spacing.sm,
        },
        timerButton: {
            padding: spacing.md,
            fontSize: fontSizes.lg
        },
        timerText: {
            fontSize: fontSizes.md
        },
        card: {
            borderWidth: 1,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginVertical: spacing.sm,
        },
        cardHalf: {
            flex: 1,
            borderWidth: 1,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginHorizontal: spacing.xs,
        },
        sectionTitle: {
            textAlign: 'center',
            marginBottom: spacing.md,
            fontWeight: 'bold',
            marginTop: spacing.lg,
            fontSize: fontSizes.xxl
        },
        counterRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.md,
            marginBottom: spacing.xs
        },
        counterButtons: {
            flexDirection: 'row',
            gap: spacing.md
        },
        counterButton: {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            backgroundColor: theme.colors.primary
        },
        counterButtonText: {
            fontSize: fontSizes.xl,
            color: '#fff'
        },
        counterName: {
            fontSize: fontSizes.lg,
            fontWeight: '600',
            marginHorizontal: spacing.md,
            marginRight: spacing.lg,
            marginTop: spacing.sm
            //color: theme.colors.secondary
        },
        counterValue: {
            fontSize: fontSizes.xl,
            marginHorizontal: spacing.lg,
        },
        /*reminderButton: {
            alignSelf: 'center',
            paddingVertical: 6,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 'auto',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 'auto',
        },
        footerButton: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 6,
        },
        footerText: {
            fontSize: 12,
        },
        scrollContent: {
            padding: 16,
        },*/
        removeButton: {
            padding: spacing.sm,
            marginLeft: spacing.sm
        },
        addCounterRow: {
            flexDirection: 'row',
            marginTop: spacing.md,
            gap: spacing.xs
        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.sm
        },
        addButton: {
            paddingHorizontal: spacing.lg,
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: borderRadius.md,
            backgroundColor: theme.colors.primary
        },
        addButtonText: {
            fontWeight: 'bold'
        },
        saveButton: {
            marginTop: spacing.xxl,
            padding: spacing.lg,
            borderRadius: borderRadius.md,
            backgroundColor: theme.colors.secondary,
            alignItems: 'center',
            marginBottom: spacing.xxl
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: fontSizes.lg
        },
        delete: {
            color: theme.colors.delete,
            fontWeight: 'bold',
            fontSize: fontSizes.lg
        }
    });
}