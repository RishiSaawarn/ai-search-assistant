import type { Request, Response } from "express";

import {
    crawlerService,
    searchService
} from "../container.js";

export async function crawl(
    req: Request,
    res: Response
) {
    const { query } = req.body;

    const searchResults =
        await searchService.search(query);

    const documents =
        await crawlerService.crawl(searchResults);

    res.json(documents);
}