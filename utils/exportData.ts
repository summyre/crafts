import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportToJSON(filename: string, data: unknown) {
    try {
        const directory = new FileSystem.Directory(FileSystem.Paths.cache, "craftfolder");
        await directory.create({intermediates: true});
        
        const json = JSON.stringify(data, null, 2);
        const file = new FileSystem.File(FileSystem.Paths.cache, "craftfolder", filename)

        await file.write(json);
        await Sharing.shareAsync(file.uri);
    } catch (error) {
        console.error('Export failed: ', error);
        throw error;
    }
}