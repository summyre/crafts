import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useProjects } from "../store/ProjectsContext";
import { Session, TimelineItem } from "../store/types";
import { useCounter } from "../hooks/useCounter";
import { useTimer } from "../hooks/useTimer";

type RouteProps = RouteProp<RootStackParamList, 'StitchSession'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

const CounterButton = ({ label, onPress, }: { label: string; onPress: () => void}) => (
    <TouchableOpacity style={styles.counterButton} onPress={onPress}>
        <Text style={styles.counterButtonText}>{label}</Text>
    </TouchableOpacity>
);

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
};

export default function StitchSessionScreen() {
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
    
    const { counters, addCounter, removeCounter, increment, decrement } = useCounter({values: {Rows: 0}});
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

            <Text style={styles.sectionTitle}>Counters</Text>
            {Object.entries(counters.values).map(([name, value]) => (
                <View key={name} style={styles.counterRow}>
                    <Text style={styles.counterName}>{name}: {value}</Text>
                    <View style={styles.counterButtons}>
                        <TouchableOpacity style={styles.counterButton} onPress={() => increment(name)}>
                            <Text>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.counterButton} onPress={() => decrement(name)}>
                            <Text>-</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.removeButton} onPress={() => Alert.alert(
                            'Remove Counter',
                            `Remove "${name}"?`,
                            [
                                {text: 'Cancel', style: 'cancel'},
                                {text: 'Remove', style: 'destructive', onPress: () => removeCounter(name)}
                            ]
                        )}>
                            <Text style={{color: 'red'}}>X</Text>
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
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSession}>
                <Text style={styles.saveButtonText}>Save session</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
    header: {
        alignItems: 'center',
        marginBottom: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timerRow: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 8,
    },
    timerButton: {
        padding: 12
    },
    timerText: {
        fontSize: 12
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
    },
    cardHalf: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 4,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
        marginTop: 16
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8
    },
    counterButtons: {
        flexDirection: 'row',
        gap: 8
    },
    counterButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    counterButtonText: {
        fontSize: 18,
    },
    counterName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8
    },
    counterValue: {
        fontSize: 18,
        marginHorizontal: 16,
    },
    reminderButton: {
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
    },
    removeButton: {
        padding: 8,
        marginLeft: 8
    },
    addCounterRow: {
     flexDirection: 'row',
     marginTop: 12,
     gap: 8   
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    },
    addButton: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8
    },
    addButtonText: {
        fontWeight: 'bold'
    },
    saveButton: {
        marginTop: 24,
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#333',
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
})