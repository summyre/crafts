import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
//import CatalogueScreen from './Catalogue';

type MenuButtonProps = {
    title: string;
    onPress?: () => void;
};

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavProp>();

    return (
        <View style={styles.container}>
            {/*header*/}
            <Text style={styles.header}>Welcome to the app</Text>

            <View style={styles.grid}>
                <MenuButton 
                    title="Catalogue"
                    onPress={() => navigation.navigate('Catalogue')}
                />
                <MenuButton 
                    title="Projects"
                    onPress={() => navigation.navigate('Projects')}
                />
                <MenuButton title="Cost Calculator"/>
                <MenuButton title="Settings"/>
            </View>
        </View>
    );
}

function MenuButton({ title, onPress = () => {} }: MenuButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconPlaceholder}/>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    button: {
        width: '45%',
        alignItems: 'center',
        marginBottom: 30,
    },
    iconPlaceholder: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
})