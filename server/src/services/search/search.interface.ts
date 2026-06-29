export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

export interface SearchService {
    search(query: string): Promise<SearchResult[]>;
}