import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useCollection } from '../store/CollectionContext';
import { CollectionItem } from '../store/collectionStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Collection'>;

export default function CollectionScreen({navigation}: Props){
    const { collection, removeItem } = useCollection();
    const [filter, setFilter] = useState<'All'|'Yarn'|'Thread'>('All');
    const filtered = collection.filter(item => filter === 'All' ? true : item.type === filter);

    const renderItem = ({ item }: { item: CollectionItem }) => (
        <View style={styles.card}>
            {item.image ? (
                <Image source={{uri: item.image}} style={styles.image} />
            ): (
                <View style={styles.placeholder}><Text>No image</Text></View>
            )}

            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.material} -- {item.colour}</Text>
                {item.weight && <Text style={styles.meta}>Weight: {item.weight}</Text>}
                <Text style={styles.meta}>Type: {item.type}</Text>
                <Text style={styles.stock}>Owned: {item.stock}</Text>
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleRemove(item.id, item.name)}>
                    <Text style={styles.addText}>Remove</Text>
                </TouchableOpacity>
        </View>
    );

    const handleRemove = (id: string, name: string) => {
        Alert.alert('Remove Item', `Are you sure you want to remove "${name}" from your collection?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeItem(id) }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Collection ({collection.length} items)</Text>
            <View style={styles.filters}>
                {['All', 'Yarn', 'Thread'].map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterButton, filter === f && styles.filterActive]}
                        onPress={() => setFilter(f as any)}>
                            <Text style={filter === f ? styles.filterActiveText : styles.filterText}>{f}</Text>
                        </TouchableOpacity>
                ))}
            </View>

            {filtered.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        {filter === 'All' ? 'Your collection is empty. Add some yarn or thread!'
                        : `No ${filter.toLowerCase()} in your collection.`}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}/>
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CollectionAdd')}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 12,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    meta: {
        fontSize: 12,
        color: '#666',
        marginVertical: 4,
    },
    stock: {
        fontSize: 12,
        fontWeight: '500'
    },
    filters: {
        flexDirection: 'row',
        fontSize: 12,
    },
    filterButton: {
        padding: 8,
        marginRight: 8, 
        borderWidth: 1,
        borderRadius: 8,
    },
    filterActive: {
        backgroundColor: '#333'
    },
    filterText: {
        color: '#777',
    },
    filterActiveText: {
        color: 'white',
        fontWeight: '600',
    },
    list: {
        paddingBottom: 20,
    },
    placeholder: {
        width: 70,
        height: 70,
        borderRadius: 8, 
        marginRight: 12, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    },
    addButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#555'
    },
    addText: {
        color: 'white',
        fontWeight: 'bold'
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: -2,
    },
});