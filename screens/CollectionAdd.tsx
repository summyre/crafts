import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { useCollection } from "../store/CollectionContext";
import { CollectionItem } from "../store/collectionStore";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from 'expo-image-picker';

export default function AddItemScreen({navigation}: any) {
    const { addItem } = useCollection();
    const [form, setForm] = useState<Omit<CollectionItem, 'id'>>({
        name: '',
        type: 'Yarn',
        brand: '',
        colour: '',
        material: '',
        weight: '',
        stock: 1,
        image: '',
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleAddPhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera access is needed.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (result.canceled) return;

        setSelectedImage(result.assets[0].uri);
        setForm({ ...form, image: result.assets[0].uri });
    };

    const handlePickFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission required', 'Gallery access is needed.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setForm({ ...form, image: result.assets[0].uri });
        }
    };

    const handleImageOption = () => {
        Alert.alert('Add Image', 'Choose an option',
            [
                { text: 'Take Photo', onPress: handleAddPhoto },
                { text: 'Choose from Gallery', onPress: handlePickFromGallery},
                { text: 'Cancel', style: 'cancel'}
            ]
        );
    };

    const handleAdd = () => {
        if (!form.name.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }

        const newItem: CollectionItem = {
            ...form,
            id: uuidv4(), // generate unique id
            stock: Number(form.stock) || 1,
        };

        addItem(newItem);
        Alert.alert('Success', 'Item added to collection', 
            [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Add New Item</Text>

            <View style={styles.form}>
                <View style={styles.imageSection}>
                    <Text style={styles.label}>Image (optional)</Text>

                    {selectedImage ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{uri: selectedImage}} style={styles.imagePreview}/>
                            <View style={styles.imageButtonRow}>
                                <TouchableOpacity
                                    style={[styles.imageButton, styles.changeButton]}
                                    onPress={handleImageOption}>
                                    <Text style={styles.imageButtonText}>Change</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.imageButton, styles.removeButton]}
                                    onPress={ () => {
                                        setSelectedImage(null);
                                        setForm({ ...form, image: '' });
                                    }}>
                                    <Text style={styles.imageButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.imagePlaceholder}
                            onPress={handleImageOption}>
                                <Text style={styles.imagePlaceholderText}>Add photo</Text>
                                <Text style={styles.imagePlaceholderSubtext}>Tap to take a photo or choose from gallery</Text>
                            </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.label}>Name *</Text>
                <TextInput
                    style={styles.input}
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                    placeholder="e.g., Merino Wool" />

                <Text style={styles.label}>Type</Text>
                <View style={styles.typeButtons}>
                    <TouchableOpacity
                        style={[styles.typeButton, form.type === 'Yarn' && styles.typeButtonActive]}
                        onPress={() => setForm({ ...form, type: 'Yarn' })}>
                        <Text style={form.type === 'Yarn' ? styles.typeButtonActiveText : styles.typeButtonText}>
                            Yarn
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, form.type === 'Thread' && styles.typeButtonActive]}
                        onPress={() => setForm({ ...form, type: 'Thread' })}>
                        <Text style={form.type === 'Thread' ? styles.typeButtonActiveText : styles.typeButtonText}>
                            Thread
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Brand</Text>
                <TextInput
                    style={styles.input}
                    value={form.brand}
                    onChangeText={(text) => setForm({ ...form, brand: text })}
                    placeholder="e.g., Malabrigo" />
                
                <Text style={styles.label}>Colour</Text>
                <TextInput
                    style={styles.input}
                    value={form.colour}
                    onChangeText={(text) => setForm({ ...form, colour: text })}
                    placeholder="e.g., Navy Blue" />

                <Text style={styles.label}>Material</Text>
                <TextInput
                    style={styles.input}
                    value={form.material}
                    onChangeText={(text) => setForm({ ...form, material: text })}
                    placeholder="e.g., Wool, Cotton, Acrylic" />

                {form.type === 'Yarn' && (
                    <>
                        <Text style={styles.label}>Weight</Text>
                        <TextInput
                            style={styles.input}
                            value={form.weight}
                            onChangeText={(text) => setForm({ ...form, weight: text })}
                            placeholder="e.g., DK, Worsted, Aran" />
                    </>
                )}

                <Text style={styles.label}>Owned Quantity</Text>
                <TextInput
                    style={styles.input}
                    value={form.stock.toString()}
                    onChangeText={(text) => setForm({ ...form, stock: Number(text) || 1 })}
                    placeholder="1"
                    keyboardType="numeric" />

                <Text style={styles.label}>Image URL (optional)</Text>
                <TextInput
                    style={styles.input}
                    value={form.image}
                    onChangeText={(text) => setForm({ ...form, image: text })}
                    placeholder="Or enter image URL here"
                    editable={!selectedImage} />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.addButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                        <Text style={styles.addButtonText}>Add to collection</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#444',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    imageSection: {
        marginBottom: 20,
    },
    imagePreviewContainer: {
        alignItems: 'center',
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    imageButtonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    imageButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    removeButton: {
        backgroundColor: '#333'
    },
    changeButton: {
        backgroundColor: '#333'
    },
    imageButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    imagePlaceholderIcon: {
        fontSize: 16,
        marginBottom: 4,
    },
    imagePlaceholderSubtext: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    typeButtons: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    typeButtonActive: {
        backgroundColor: '#4a6fa5',
        borderColor: '#4a6fa5',
    },
    typeButtonText: {
        color: '#666',
    },
    typeButtonActiveText: {
        color: 'white',
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    addButton: {
        backgroundColor: '#444',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#444',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});