import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useCollection } from "../store/CollectionContext";
import { CollectionItem } from "../store/collectionStore";
import { v4 as uuidv4 } from "uuid";

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
                    placeholder="https://example.com/image.jpg" />

                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>Add to collection</Text>
                </TouchableOpacity>
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
});