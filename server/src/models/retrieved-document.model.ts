export interface RetrievedDocument {
    title: string;
    url: string;
    content: string;
    score?: number;
}

/** Lightweight citation sent to the frontend */
export interface Source {
    title: string;
    url: string;
}