import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useCollection } from '../store/CollectionContext';
import { CollectionItem } from '../store/collectionStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useTheme } from "../theme/ThemeContext";
import { spacing, borderRadius, fontSizes, shadows } from "../theme/constants";

type Props = NativeStackScreenProps<RootStackParamList, 'Collection'>;

export default function CollectionScreen({navigation}: Props){
    const styles = useScreenStyles();
    const { collection, removeItem } = useCollection();
    const [filter, setFilter] = useState<'All'|'Yarn'|'Thread'>('All');
    const filtered = collection.filter(item => filter === 'All' ? true : item.type === filter);

    const renderItem = ({ item }: { item: CollectionItem }) => (
        <View style={styles.card}>
            {item.image ? (
                <Image source={{uri: item.image}} style={styles.image} />
            ): (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No image</Text>
                </View>
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
                    scrollEnabled={true}
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

const useScreenStyles = () => {
    const { theme } = useTheme();
    
    return StyleSheet.create({
        container:{
            flex: 1,
            padding: 16,
            backgroundColor: theme.colors.background
        },
        header: {
            fontSize: fontSizes.xl,
            fontWeight: '600',
            marginBottom: spacing.lg,
            color: theme.colors.textDark
        },
        card: {
            flexDirection: 'row',
            padding: spacing.md,
            borderWidth: 1,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.md,
            borderColor: theme.colors.border
        },
        image: {
            width: 80,
            height: 80,
            borderRadius: borderRadius.md,
            marginRight: spacing.md,
            backgroundColor: theme.colors.border
        },
        info: {
            flex: 1,
            justifyContent: 'center',
        },
        name: {
            fontSize: fontSizes.lg,
            fontWeight: '600',
            color: theme.colors.textDark
        },
        meta: {
            fontSize: fontSizes.sm,
            color: theme.colors.text,
            marginVertical: spacing.xs,
        },
        stock: {
            fontSize: fontSizes.sm,
            fontWeight: '500',
            color: theme.colors.textDark
        },
        filters: {
            flexDirection: 'row',
            fontSize: fontSizes.sm,
        },
        filterButton: {
            padding: spacing.sm,
            marginRight: spacing.sm, 
            borderWidth: 1,
            borderRadius: borderRadius.md,
            borderColor: theme.colors.border
        },
        filterActive: {
            backgroundColor: theme.colors.secondary
        },
        filterText: {
            color: theme.colors.text,
        },
        filterActiveText: {
            color: 'white',
            fontWeight: '600',
        },
        list: {
            paddingBottom: spacing.xl,
            marginTop: spacing.md
        },
        placeholder: {
            width: 70,
            height: 70,
            borderRadius: borderRadius.md, 
            marginRight: spacing.md, 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.border
        },
        placeholderText: {
            fontSize: fontSizes.sm
        },
        addButton: {
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
            borderRadius: borderRadius.sm,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            marginTop: 'auto'
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
            fontSize: fontSizes.lg,
            color: theme.colors.text,
            textAlign: 'center',
        },
        fab: {
            position: 'absolute',
            right: 20,
            top: 10,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows
        },
        fabText: {
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            marginTop: -2,
        },
    });
}