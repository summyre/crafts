// mock data for testing project screen
export type Project = {
    id: string;
    title: string;
    status: 'Planned' | 'In progress' | 'Completed';
};

export const PROJECTS: Project[] = [
    { id: 'p1', title: 'Winter Scarf', status: 'In progress' },
    { id: 'p2', title: 'Cardigan', status: 'Planned' },
    { id: 'p3', title: 'Baby Blanket', status: 'Completed' }
]