import type { Chat } from "../../models/chat.model.js";

export interface LLMService {
    generateResponse(chat: Chat): Promise<string>;
}