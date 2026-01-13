export type SessionCounters = {
    values: Record<string, number>;
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
    seconds: number;
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
    timeline: TimelineItem[];
    patternIds?: string[];
};

export type CostResult = {
    totalCost: number;
    sellingPrice: number;
};

export type Pattern = {
    id: string;
    title: string;
    link?: string;
    projectId?: string;
    notes?: string;
    imageUri?: string;
    //annotations?: string[];
};

export type TimelineItem = 
    | {
        id: string;
        type: 'session';
        sessionId: string;
        createdAt: number;
    }
    | {
        id: string;
        type: 'photo';
        photoId: string;
        createdAt: number;
    }
    | {
        id: string;
        type: 'pattern';
        patternId: string;
        createdAt: number;
        annotations?: string[];
    };
