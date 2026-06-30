import axios from "axios";

import type { SearchResult } from "../../models/search-result.model.js";
import type { SearchService } from "./search.interface.js";

interface TavilyResult {
    title: string;
    url: string;
    content: string;
    score: number;
}

interface TavilyResponse {
    results: TavilyResult[];
}

export class TavilySearchService implements SearchService {
    private readonly apiKey: string;

    constructor() {
        const apiKey = process.env.TAVILY_API_KEY;

        if (!apiKey) {
            throw new Error("TAVILY_API_KEY is not defined.");
        }

        this.apiKey = apiKey;
    }

    async search(query: string): Promise<SearchResult[]> {
        const response = await axios.post<TavilyResponse>(
            "https://api.tavily.com/search",
            {
                api_key: this.apiKey,
                query,
                search_depth: "advanced",
                max_results: 5,
            }
        );

        return response.data.results.map((result) => ({
            title: result.title,
            url: result.url,
            snippet: result.content,
            score: result.score,
        }));
    }
}