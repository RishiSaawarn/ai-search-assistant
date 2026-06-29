import type { Request, Response } from "express";

import {
    conversationService,
    orchestratorService
} from "../container.js";

type ChatParams = {
    chatId: string;
};

export function createChat(req: Request, res: Response) {
    const chat = conversationService.createChat();

    res.status(201).json({
        chatId: chat.id
    });
}

export function getChat(req: Request<ChatParams>, res: Response) {
    const { chatId } = req.params;

    const chat = conversationService.getChat(chatId);

    res.json(chat);
}

export function deleteChat(req: Request<ChatParams>, res: Response) {
    const { chatId } = req.params;

    conversationService.deleteChat(chatId);

    res.sendStatus(204);
}

export async function addMessage(req: Request<ChatParams>, res: Response) {
    const { chatId } = req.params;
    const { message } = req.body;

    const reply = await orchestratorService.handleMessage(
        chatId,
        message
    );

    res.json({
        reply
    });
}