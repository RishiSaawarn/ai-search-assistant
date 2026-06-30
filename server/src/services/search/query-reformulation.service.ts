import type { Chat } from "../../models/chat.model.js";
import type { LLMService } from "../llm/llm.interface.js";

/**
 * Uses the LLM to rewrite the latest user turn into a clean,
 * self-contained web search query — crucial for follow-up questions
 * like "what happened after that?" that would otherwise return garbage results.
 */
export class QueryReformulationService {
    constructor(private llmService: LLMService) {}

    async reformulate(chat: Chat): Promise<string> {
        const recentMessages = chat.messages.slice(-4);
        const context = recentMessages
            .map((m) =>
                m.role === "user"
                    ? `User: ${m.content}`
                    : `Assistant: ${m.content}`
            )
            .join("\n");

        const prompt = `Based on this conversation, generate a concise and specific web search query that will find the most relevant current information to answer the user's latest request. The query should be self-contained and not rely on pronouns or references to earlier parts of the conversation.

Conversation:
${context}

Return ONLY the search query text — no explanation, no quotes, no punctuation at the start or end.`;

        return this.llmService.generateText(prompt);
    }
}
