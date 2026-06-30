import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

import type { SearchResult } from "../../models/search-result.model.js";
import type { RetrievedDocument } from "../../models/retrieved-document.model.js";
import type { CrawlerService } from "./crawler.interface.js";

export class ReadabilityCrawlerService implements CrawlerService {
    async crawl(searchResults: SearchResult[]): Promise<RetrievedDocument[]> {
        const tasks = searchResults.map((result) =>
            this.fetchDocument(result)
        );

        // Fetch all pages in parallel — failed pages are skipped
        const settled = await Promise.allSettled(tasks);

        return settled
            .filter(
                (r): r is PromiseFulfilledResult<RetrievedDocument> =>
                    r.status === "fulfilled"
            )
            .map((r) => r.value);
    }

    private async fetchDocument(result: SearchResult): Promise<RetrievedDocument> {
        const response = await axios.get<string>(result.url, {
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/5.0 AI-Search-Assistant/1.0",
            },
        });

        const dom = new JSDOM(response.data, { url: result.url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article?.textContent) {
            throw new Error(`No content extracted from ${result.url}`);
        }

        const doc: RetrievedDocument = {
            title: article.title || result.title,
            url: result.url,
            content: article.textContent,
        };

        if (result.score !== undefined) {
            doc.score = result.score;
        }

        return doc;
    }
}

