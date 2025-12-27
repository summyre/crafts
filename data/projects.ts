export type Project = {
    id: string;
    title: string;
    craftType: 'Crochet' | 'Cross Stitch';
    createdAt: number;
    notes?: string;
    photos: ProjectPhoto[];
    status: 'Planned' | 'In progress' | 'Completed';
};

export type ProjectPhoto = {
    id: string;
    uri: string;
    title?: string;
    notes?: string;
    createdAt: number;
};

// mock data for testing project screen
export const PROJECTS: Project[] = [
    { 
        id: 'p1', 
        title: 'Winter Scarf',
        craftType: 'Crochet',
        createdAt: Date.now(),
        notes: 'using merino wool',
        photos: [], 
        status: 'In progress' },
];