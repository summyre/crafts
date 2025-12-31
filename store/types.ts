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
    photoUri?: string;
};

export type Project = {
    id: string;
    title: string;
    craftType: 'Crochet' | 'Cross Stitch';
    notes?: string;
    sessionss: Session[];
    coverSessionId?: string;
};