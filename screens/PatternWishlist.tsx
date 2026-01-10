import React, { useRef, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { usePatterns } from "../store/PatternsContext";
import { Pattern } from "../store/types";
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import * as ImagePicker from 'expo-image-picker';

export default function PatternWishlistScreen() {
    const { patterns, setPatterns } = usePatterns();
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [imageUri, setImageUri] = useState<string |undefined>();

    const addPattern = async () => {
        const newPattern: Pattern = {
            id: Date.now().toString(),
            title,
            notes,
            imageUri
        };

        setPatterns(prev => [newPattern, ...prev]);
        setTitle('');
        setNotes('');
        setImageUri(undefined);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({quality: 0.7});
        if (result.canceled) return;
        setImageUri(result.assets[0].uri);
    };

    const renderPattern = ({item}: {item: Pattern}) => {
        return (
            <TouchableOpacity style={styles.card}>
                {item.imageUri ? <Image source={{uri: item.imageUri}} style={styles.image}/> : <View style={styles.placeholder}><Text>No image</Text></View>}
                <Text style={styles.title}>{item.title}</Text>
                {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            </TouchableOpacity>
        )
        
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Pattern Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input} />

            <TextInput
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, {height: 60}]}
                multiline />
                    
                    <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
                        <Text style={{color: 'white'}}>{imageUri ? 'Change Image' : 'Pick Image'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={addPattern} style={styles.addButton}>
                        <Text style={{color: 'white'}}>Add Pattern</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={patterns}
                        renderItem={renderPattern}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{paddingTop: 16}} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    card: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8
    },
    title: {
        fontWeight: 'bold',
        marginTop: 8
    },
    notes: {
        color: '#555',
        marginTop: 4
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8
    },
    placeholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#eee',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1, 
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 8,
        borderRadius: 8
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8
    },
    addButton: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16
    },
    pickButton: {
        backgroundColor: '#555',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center'
    }
})