import AsyncStorage from "@react-native-async-storage/async-storage";

export type CollectionItem = {
    id: string;
    name: string;
    type: 'Yarn' | 'Thread';
    brand?: string;
    colour: string;
    material: string;
    weight?: string; // specific to yarn
    stock: number;
    image?: string;
};

const STORAGE_KEY = '@collection_items';

export async function loadCollection(): Promise<CollectionItem[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

export async function saveCollection(items: CollectionItem[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}