import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export async function importJSON<T>(): Promise<T | null> {
    const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json'
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    const file = new FileSystem.File(asset.uri);
    const contents = await file.text();

    return JSON.parse(contents) as T;
}