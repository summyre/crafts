import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProjectPhoto = {
    id: string;
    uri: string;
    title?: string;
    notes?: string;
    createdAt: number;
};

export type Project = {
    id: string;
    title: string;
    craftType: 'Crochet' | 'Cross Stitch';
    notes?: string;
    //status: 'Planned' | 'In progress' | 'Completed';
    photos: ProjectPhoto[];
};

const STORAGE_KEY = '@projects';

export async function loadProjects(): Promise<Project[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

export async function saveProjects(projects: Project[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}