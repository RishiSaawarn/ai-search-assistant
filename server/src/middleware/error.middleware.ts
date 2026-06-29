import type { NextFunction, Request, Response } from "express";
import { ChatNotFoundError } from "../errors/chat-not-found.error.js";

export function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof ChatNotFoundError) {
        return res.status(404).json({
            error: error.message,
        });
    }

    console.error(error);

    return res.status(500).json({
        error: "Internal Server Error",
    });
}