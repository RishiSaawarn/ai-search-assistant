import type { Prompt } from "../../models/prompt.model.js";

export interface LLMService {
    generateResponse(prompt: Prompt): Promise<string>;
}