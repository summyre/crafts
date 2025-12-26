import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATALOGUE_DATA } from '../data/catalogue';

export type CatalogueItem = {
    id: string;
    name: string;
    brand?: string;
    colour: string;
    material: string;
    weight?: string;
    stock: number;
    image?: string;
};

export default function CatalogueScreen(){
    const renderItem = ({ item }: { item: CatalogueItem }) => (
        <View style={styles.card}>
            {item.image && (
                <Image source={{uri: item.image}} style={styles.image} />
            )}

            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.material} -- {item.colour}</Text>
                <Text style={styles.stock}>Owned: {item.stock}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Catalogue</Text>
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
});