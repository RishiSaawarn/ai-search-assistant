import type { Chat } from "../../models/chat.model.js";
import type { Prompt } from "../../models/prompt.model.js";
import type { RetrievedDocument } from "../../models/retrieved-document.model.js";

export interface PromptBuilder {
    buildPrompt(
        chat: Chat,
        documents: RetrievedDocument[]
    ): Promise<Prompt>;
}