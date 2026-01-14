import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { useCollection } from "../store/CollectionContext";
import { CollectionItem } from "../store/collectionStore";
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes, shadows } from "../theme/constants";

export default function AddItemScreen({navigation}: any) {
    const styles = useScreenStyles();
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

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

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
            id: generateId(), // generate unique id
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

const useScreenStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.lg,
            backgroundColor: theme.colors.background,
        },
        header: {
            fontSize: fontSizes.xxxl,
            fontWeight: 'bold',
            marginBottom: spacing.xxl,
            color: theme.colors.text,
        },
        form: {
            backgroundColor: theme.colors.card,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
        },
        imageSection: {
            marginBottom: spacing.xl,
        },
        imagePreviewContainer: {
            alignItems: 'center',
        },
        imagePreview: {
            width: 150,
            height: 150,
            borderRadius: borderRadius.md,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        imageButtonRow: {
            flexDirection: 'row',
            gap: 10,
            marginTop: 5,
        },
        imageButton: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.sm,
        },
        removeButton: {
            backgroundColor: theme.colors.primary
        },
        changeButton: {
            backgroundColor: theme.colors.primary
        },
        imageButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: fontSizes.md,
        },
        imagePlaceholder: {
            width: '100%',
            height: 150,
            borderRadius: borderRadius.md,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderStyle: 'dashed',
        },
        imagePlaceholderText: {
            fontSize: fontSizes.lg,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: spacing.xs,
        },
        imagePlaceholderIcon: {
            fontSize: fontSizes.lg,
            marginBottom: spacing.xs,
        },
        imagePlaceholderSubtext: {
            fontSize: fontSizes.sm,
            color: theme.colors.text,
            textAlign: 'center',
            paddingHorizontal: spacing.xl,
        },
        label: {
            fontSize: fontSizes.md,
            fontWeight: '600',
            marginBottom: spacing.xs,
            color: theme.colors.text,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.lg,
            fontSize: fontSizes.lg,
        },
        typeButtons: {
            flexDirection: 'row',
            marginBottom: spacing.lg,
        },
        typeButton: {
            flex: 1,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            marginRight: spacing.sm,
        },
        typeButtonActive: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.border,
        },
        typeButtonText: {
            color: theme.colors.text,
        },
        typeButtonActiveText: {
            color: '#fff',
            fontWeight: '600',
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing.xxl,
            gap: spacing.md,
            marginBottom: spacing.xxxl
        },
        addButton: {
            backgroundColor: theme.colors.primary,
            padding: spacing.lg,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            marginTop: spacing.xl,
        },
        addButtonText: {
            color: '#fff',
            fontSize: fontSizes.lg,
            fontWeight: 'bold',
        },
        cancelButton: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            padding: spacing.lg,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            marginTop: spacing.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        cancelButtonText: {
            color: '#fff',
            fontSize: fontSizes.lg,
            fontWeight: 'bold',
        },
    });
}