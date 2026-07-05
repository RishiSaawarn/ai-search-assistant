import { GoogleGenAI } from "@google/genai";

import type { Prompt } from "../../models/prompt.model.js";
import type { LLMService } from "./llm.interface.js";

export class GeminiLLMService implements LLMService {
    private ai: GoogleGenAI;
    private readonly model = "gemini-2.5-flash";

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined.");
        }

        this.ai = new GoogleGenAI({ apiKey });
    }

    async generateResponse(prompt: Prompt): Promise<string> {
        // Append retrieved web context to the final user message
        const userContent = prompt.retrievedContext
            ? `${prompt.userQuery}\n\n--- Retrieved Web Context ---\n${prompt.retrievedContext}`
            : prompt.userQuery;

        // Build structured multi-turn conversation for the Gemini chat API
        const contents = [
            ...prompt.history.map((turn) => ({
                role: turn.role === "assistant" ? "model" : "user",
                parts: [{ text: turn.content }],
            })),
            {
                role: "user",
                parts: [{ text: userContent }],
            },
        ];

        const response = await this.ai.models.generateContent({
            model: this.model,
            contents,
            ...(prompt.system ? { config: { systemInstruction: prompt.system } } : {}),
        });

        return response.text ?? "No response generated.";
    }

    async generateText(prompt: string): Promise<string> {
        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: prompt,
        });

        return response.text?.trim() ?? "";
    }
}