import type { Chat } from "../../models/chat.model.js";
import type { Prompt } from "../../models/prompt.model.js";

export interface PromptBuilder {
    buildPrompt(
        chat: Chat,
        retrievedContext: string
    ): Promise<Prompt>;
}