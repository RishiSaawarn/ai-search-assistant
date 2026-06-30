import type { SearchResult } from "../../models/search-result.model.js";

export interface SearchService {
    search(query: string): Promise<SearchResult[]>;
}