import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

import type { SearchResult } from "../../models/search-result.model.js";
import type { RetrievedDocument } from "../../models/retrieved-document.model.js";
import type { CrawlerService } from "./crawler.interface.js";

export class ReadabilityCrawlerService
    implements CrawlerService
{
    async crawl(
        searchResults: SearchResult[]
    ): Promise<RetrievedDocument[]> {

        const documents: RetrievedDocument[] = [];

        for (const result of searchResults) {
            try {

                const response = await axios.get<string>(result.url, {
                timeout: 10000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 AI-Search-Assistant/1.0",
                },
            });

                const dom = new JSDOM(response.data, {
                    url: result.url
                });

                const reader =
                    new Readability(dom.window.document);

                const article =
                    reader.parse();

                if (!article?.textContent) {
                    continue;
                }

                const title: string = article.title || result.title;
                const content: string = article.textContent;

                const document: RetrievedDocument = {
                title,
                url: result.url,
                content,
            };

            if (result.score !== undefined) {
                document.score = result.score;
            }

            documents.push(document);

            } catch (error) {

                console.warn(
                    `Failed to crawl ${result.url}`
                );

            }
        }

        return documents;
    }
}