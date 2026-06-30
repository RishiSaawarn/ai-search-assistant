import type { Request, Response } from "express";

import { searchService } from "../container.js";

export async function search(
    req: Request,
    res: Response
) {
    const { query } = req.body;

    const results =
        await searchService.search(query);

    res.json(results);
}