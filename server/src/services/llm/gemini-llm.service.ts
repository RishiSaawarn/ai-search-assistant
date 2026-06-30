import { GoogleGenAI } from "@google/genai";

import type { Prompt } from "../../models/prompt.model.js";
import type { LLMService } from "./llm.interface.js";

export class GeminiLLMService implements LLMService {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined.");
        }

        this.ai = new GoogleGenAI({
            apiKey,
        });
    }

    async generateResponse(prompt: Prompt): Promise<string> {
        const fullPrompt = `
${prompt.system}

Conversation:
${prompt.conversation}

Retrieved Context:
${prompt.retrievedContext || "None"}

Current User Query:
${prompt.userQuery}
`;

        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });

        return response.text ?? "No response generated.";
    }
}