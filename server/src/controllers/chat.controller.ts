import type { Request, Response } from "express";
import { OrchestratorService } from "../services/orchestrator.service.js";

const orchestrator = new OrchestratorService();

export async function chat(req: Request, res: Response) {
    const { message } = req.body;

    const response = await orchestrator.handleChat(message);

    res.json(response);
}