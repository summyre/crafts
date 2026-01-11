import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, Modal, TextInput, Linking } from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useTheme } from "../theme/ThemeContext";

type RouteProps = RouteProp<RootStackParamList, 'Settings'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [currency, setCurrency] = useState('auto');
    const [shakeToReturn, setShakeToReturn] = useState(false);
    const [tutorialEnabled, setTutorialEnabled] = useState(true);
    const [manualCurrencyCode, setManualCurrencyCode] = useState('GBP');
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [showTutorialModal, setShowTutorialModal] = useState(false);
    const navigation = useNavigation<NavProps>();
    const { theme, themeId, setThemeById } = useTheme();

    // available themes
    const themes = [
        {id: 'light', name: 'Light', colors: {primary: '#4A6572', background: '#FFFFFF'}},
        {id: 'dark', name: 'Dark', colors: {primary: '#F9AA33', background: '#232F34'}},
        {id: 'pastel', name: 'Pastel', colors: {primary: '#D4A5A5', background: '#F9F0F0'}},
        {id: 'nature', name: 'Nature', colors: {primary: '#4CAF50', background: '#E8F5E9'}}
    ];

    // currencies
    const commonCurrencies = [
        {code: 'GBP', name: 'British Pound', symbol: '£'},
        {code: 'EUR', name: 'Euro', symbol: '€'},
        {code: 'USD', name: 'US Dollar', symbol: '$'},
        {code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$'},
        {code: 'AUD', name: 'Australian Dollar', symbol: 'A$'},
        {code: 'JPY', name: 'Japanese Yen', symbol: '¥'},
    ]

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings =  async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            const savedCurrency = await AsyncStorage.getItem('preferredCurrency');
            const savedNotifications = await AsyncStorage.getItem('notificationsEnabled');
            const savedShake = await AsyncStorage.getItem('shakeToReturn');
            const savedTutorial = await AsyncStorage.getItem('tutorialEnabled');

            if (savedTheme) setThemeById(savedTheme);
            if (savedCurrency) setCurrency(savedCurrency);
            if (savedNotifications !== null) setNotificationsEnabled(JSON.parse(savedNotifications));
            if (savedShake !== null) setShakeToReturn(JSON.parse(savedShake));
            if (savedTutorial !== null) setTutorialEnabled(JSON.parse(savedTutorial));
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSetting = async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    };

    const toggleNotification = async (value: boolean) => {
        setNotificationsEnabled(value);
        saveSetting('notificationsEnabled', value);

        if (value) {
            // requesting notification permissions
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
                setNotificationsEnabled(false);
                saveSetting('notificationsEnabled', false);
            }
        }
    };

    const handleThemeChange = (id: string) => {
        setThemeById(id);
    };

    const handleCurrencyChange = async (value: string) => {
        setCurrency(value);
        await saveSetting('preferredCurrency', value);

        if (value !== 'manual') {
            await saveSetting('manualCurrencyCode', manualCurrencyCode);
        }
    };

    const handleManualCurrecySelect = async (code: string) => {
        setManualCurrencyCode(code);
        await saveSetting('manualCurrencyCode', code);
        setShowCurrencyModal(false);
    };

    const getCurrencyDisplay = () => {
        if (currency === 'auto') {
            const locale = Intl.DateTimeFormat().resolvedOptions().locale;
            return `Auto (${locale})`;
        } else if (currency === 'manual') {
            return `Manual (${manualCurrencyCode})`;
        }
        return currency;
    };

    const renderAdditionalSettings = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Settings</Text>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ProjectDefaults')}>
                <Text style={styles.optionText}>Project Defaults</Text>
                <Text style={styles.optionSubtext}>Set default yarn type, hook size, etc.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => Alert.alert(
                'Data Management',
                'Export projects as PDF/CSV\nImport patterns\nClear cache',
                [{text: 'OK'}]
            )}>
                <Text style={styles.optionText}>Data Management</Text>
                <Text style={styles.optionSubtext}>Export, import, backup</Text>
            </TouchableOpacity>

            <View style={styles.option}>
                <Text style={styles.optionText}>Measurement Units</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.unitButton, styles.unitButtonActive]} onPress={() => saveSetting('units', 'metric')}>
                        <Text style={styles.unitButtonText}>Metric (cm)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.unitButton} onPress={() => saveSetting('units', 'imperial')}>
                        <Text style={styles.unitButtonText}>Imperial (inches)</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.option} onPress={() => Linking.openURL('https://github.com/summyre/crafts')}>
                <Text style={styles.optionText}>Privacy and Security</Text>
                <Text style={styles.optionSubtext}>Privacy policy, lock app with PIN</Text>
            </TouchableOpacity>

            <View style={styles.option}>
                <View style={styles.rowBetween}>
                    <Text style={styles.optionText}>Cloud Sync</Text>
                    <Switch value={false} onValueChange={(value) => saveSetting('cloudSync', value)}/>
                </View>
                <Text style={styles.optionSubtext}>Backup projects to cloud</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
                <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Notifications</Text>
                <View style={styles.option}>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.optionText, {color: theme.colors.text}]}>Enable Notification</Text>
                        <Switch 
                            value={notificationsEnabled} 
                            onValueChange={toggleNotification}
                            trackColor={{false: '#767577', true: theme.colors.primary}}
                            thumbColor={notificationsEnabled ? theme.colors.primary: '#f4f3f4'}/>
                    </View>
                    <Text style={[styles.optionSubtext, {color: theme.colors.text}]}>Get reminders for project deadlines</Text>
                </View>
            </View>

            <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
                <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Appearance</Text>

                <View style={styles.option}>
                    <Text style={[styles.optionText, {color: theme.colors.text}]}>Theme</Text>
                    <View style={styles.themeContainer}>
                        {themes.map((t) => (
                            <TouchableOpacity
                                key={t.id}
                                style={[styles.themeButton, themeId === t.id && styles.themeButtonActive, {backgroundColor: t.colors.primary}]}
                                onPress={() => handleThemeChange(t.id)}>
                                    <Text style={styles.themeButtonText}>{t.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
                <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Currency</Text>
                <View style={styles.option}>
                    <Text style={[styles.optionText, {color: theme.colors.text}]}>Cost Calculator Currency</Text>
                    <Picker selectedValue={currency} onValueChange={handleCurrencyChange} style={{backgroundColor: theme.colors.card, color: theme.colors.text}}>
                        <Picker.Item label="Auto-detect (device locale)" value="auto" />
                        <Picker.Item label="Set manually" value="manual" />
                        {/*{commonCurrencies.map((curr) => (
                            <Picker.Item key={curr.code} label={`${curr.name} (${curr.symbol})`} value={curr.code} />
                        ))}*/}
                    </Picker>

                    {currency === 'manual' && (
                        <TouchableOpacity 
                            style={[styles.manualCurrencyButton, {backgroundColor: theme.colors.primary + '20'}]} 
                            onPress={() => setShowCurrencyModal(true)}>
                            <Text style={[styles.manualCurrencyText, {color: theme.colors.primary}]}>Select currency: {manualCurrencyCode}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Navigation</Text>
                <View style={styles.option}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.optionText}>Shake to Return to Menu</Text>
                        <Switch
                            value={shakeToReturn}
                            onValueChange={(value) => {
                                setShakeToReturn(value);
                                saveSetting('shakeToReturn', value);
                            }} />
                    </View>
                    <Text style={styles.optionSubtext}>Shake device to return to main menu from any screen</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tutorial</Text>
                <View style={styles.option}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.optionText}>Show tutorial</Text>
                        <Switch
                            value={tutorialEnabled}
                            onValueChange={(value) => {
                                setTutorialEnabled(value);
                                saveSetting('tutorialEnabled', value);
                            }} />
                    </View>
                    <Text style={styles.optionSubtext}>Display tutorial tips for new features</Text>
                    <TouchableOpacity style={styles.tutorialButton} onPress={() => setShowTutorialModal(true)}>
                        <Text style={styles.tutorialButtonText}>View tutorial</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity style={styles.supportOption} onPress={() => Linking.openURL('https://github.com/summyre/crafts')}>
                    <Text style={styles.supportOptionText}>Contact support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportOption} onPress={() => navigation.navigate('HelpDoc')}>
                    <Text style={styles.supportOptionText}>Help and Documentation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportOption} onPress={() => Linking.openURL('https://github.com/summyre/crafts')}>
                    <Text style={styles.supportOptionText}>FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportOption} onPress={() => Alert.alert(
                    'About',
                    `Craft Project Manager v1.0.0\n\nA tool for crochet and cross stitch enthusiasts to organise their projects, track progress and calcualte costs`,
                    [{text: 'OK'}]
                    )}>
                        <Text style={styles.supportOptionText}>About</Text>
                </TouchableOpacity>
            </View>

            {renderAdditionalSettings()}

            <Modal
                visible={showCurrencyModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCurrencyModal(false)}>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, {backgroundColor: theme.colors.card}]}>
                            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>Select Currency</Text>
                            <ScrollView>
                                {commonCurrencies.map((curr) => (
                                    <TouchableOpacity key={curr.code} style={styles.currencyItem} onPress={() => handleManualCurrecySelect(curr.code)}>
                                        <Text style={[styles.currencyText, {color: theme.colors.text}]}>{curr.code} - {curr.name} ({curr.symbol})</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCurrencyModal(false)}>
                                <Text style={styles.modalCloseButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </Modal>

            <Modal
                visible={showTutorialModal}
                animationType="slide"
                onRequestClose={() => setShowTutorialModal(false)}>
                    <View style={[styles.tutorialModal, {backgroundColor: theme.colors.background}]}>
                        <Text style={[styles.tutorialTitle, {color: theme.colors.text}]}>App Tutorial</Text>
                        <Text style={[styles.tutorialText, {color: theme.colors.text}]}>
                            This tutorial will guide you through:
                            {"\n\n"}1. Creating your first project
                            {"\n\n"}2. Adding patterns and materials
                            {"\n\n"}3. Tracking your progress
                            {"\n\n"}4. Using the cost calculator
                            {"\n\n"}5. Setting reminders
                            {"\n\n"}Full tutorial coming soon!
                        </Text>
                        <TouchableOpacity style={[styles.tutorialCloseButton, {backgroundColor: theme.colors.primary}]} onPress={() => setShowTutorialModal(false)}>
                            <Text style={styles.tutorialCloseButtonText}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333'
    },
    option: {
        marginBottom: 16
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4
    },
    optionSubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    themeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8
    },
    themeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        minWidth: 80,
        alignItems: 'center'
    },
    themeButtonActive: {
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4
    },
    themeButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    manualCurrencyButton: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center'
    },
    manualCurrencyText: {
        color: '#1976d2',
        fontWeight: 'bold'
    },
    tutorialButton: {
        backgroundColor: '#4a6572',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center'
    },
    tutorialButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    supportOption: {
        paddingVertical: 14,
        borderWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    supportOptionText: {
        fontSize: 16,
        color: '#1976d2'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '70%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    currencyItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    currencyText: {
        fontSize: 16
    },
    modalCloseButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center'
    },
    modalCloseButtonText: {
        fontSize: 16,
        color: '#666'
    },
    tutorialModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    tutorialTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    tutorialText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        marginBottom: 30
    },
    tutorialCloseButton: {
        backgroundColor: '#4a6572',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8
    },
    tutorialCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        marginTop: 8
    },
    fontOption: {
        padding: 8,
        marginRight: 8,
        color: '#666'
    },
    fontOptionActive: {
        color: '#4a6572',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    unitButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8
    },
    unitButtonActive: {
        backgroundColor: '#4a6572',
        borderColor: '#4a6572'
    },
    unitButtonText: {
        color: '#333'
    }
});