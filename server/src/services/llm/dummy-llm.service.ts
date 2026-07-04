import type { Prompt } from "../../models/prompt.model.js";
import type { LLMService } from "./llm.interface.js";

export class DummyLLMService implements LLMService {
    async generateResponse(prompt: Prompt): Promise<string> {
        return "This is a dummy response. I am a placeholder LLM service.";
    }

    async generateText(prompt: string): Promise<string> {
        return "Dummy text";
    }
}