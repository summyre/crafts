import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes } from "../theme/constants";

type MenuButtonProps = {
    title: string;
    icon: any;
    onPress?: () => void;
};

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavProp>();
    const styles = useScreenStyles();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to Crafter!</Text>

            <View style={styles.grid}>
                <MenuButton 
                    title="My Collection"
                    icon={require('../assets/yarn.png')}
                    onPress={() => navigation.navigate('Collection')}
                />
                <MenuButton 
                    title="Projects"
                    icon={require('../assets/folder.png')}
                    onPress={() => navigation.navigate('Projects')}
                />
                <MenuButton 
                    title="Cost Calculator"
                    icon={require('../assets/budget.png')}
                    onPress={() => navigation.navigate('CostCalculator')}
                />
                <MenuButton 
                    title="Settings"
                    icon={require('../assets/settings.png')}
                    onPress={() => navigation.navigate('Settings')}
                />
            </View>
        </View>
    );
}

function MenuButton({ title, icon, onPress = () => {} }: MenuButtonProps) {
    const styles = useScreenStyles();

    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
            <Image source={icon} style={styles.icon}/>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.xl,
            backgroundColor: theme.colors.background
        },
        header: {
            fontSize: fontSizes.xxxl,
            fontWeight: 'bold',
            marginBottom: 30,
            borderBottomWidth: 1,
            paddingBottom: spacing.md,
            textAlign: 'center',
            color: theme.colors.textDark,
            borderColor: theme.colors.textDark
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
        },
        button: {
            width: '45%',
            alignItems: 'center',
            marginBottom: spacing.xxxl,
        },
        icon: {
            width: 65,
            height: 65,
            marginBottom: spacing.md,
        },
        buttonText: {
            fontSize: fontSizes.lg,
            fontWeight: 'bold',
            color: theme.colors.textDark
        },
    });
}