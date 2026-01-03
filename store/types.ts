export type SessionCounters = {
    rows: number;
    increase: number;
    decrease: number;
    seconds: number;
};

export type Session = {
    id: string;
    createdAt: number;
    title?: string;
    counters: SessionCounters;
    notes?: string;
    //photoUri?: string;
    photos?: ProjectPhoto[];
    isMilestone?: boolean;
};

export type ProjectPhoto = {
    id: string;
    uri: string;
    createdAt: number;
    title?: string;
    notes?: string;
};

export type Project = {
    id: string;
    title: string;
    craftType: 'Crochet' | 'Cross Stitch';
    notes?: string;
    photos: ProjectPhoto[];
    sessions: Session[];
    coverPhotoId?: string;
};

export type CostResult = {
    totalCost: number;
    sellingPrice: number;
};
