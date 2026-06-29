import { GoogleGenAI } from "@google/genai";

import type { Chat } from "../../models/chat.model.js";
import type { LLMService } from "./llm.interface.js";

export class GeminiLLMService implements LLMService {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined.");
        }

        this.ai = new GoogleGenAI({
            apiKey
        });
    }

    async generateResponse(chat: Chat): Promise<string> {
        const conversation = chat.messages
            .map(message => `${message.role}: ${message.content}`)
            .join("\n");

        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: conversation
        });

        return response.text ?? "No response generated.";
    }
}