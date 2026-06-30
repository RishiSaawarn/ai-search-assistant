import type { SearchResult } from "../../models/search-result.model.js";
import type { RetrievedDocument } from "../../models/retrieved-document.model.js";

export interface CrawlerService {
    crawl(
        searchResults: SearchResult[]
    ): Promise<RetrievedDocument[]>;
}