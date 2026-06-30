import type { Prompt } from "../../models/prompt.model.js";

export interface LLMService {
    generateResponse(prompt: Prompt): Promise<string>;
    /** Lightweight single-shot text generation — no conversation history, no system prompt */
    generateText(prompt: string): Promise<string>;
}