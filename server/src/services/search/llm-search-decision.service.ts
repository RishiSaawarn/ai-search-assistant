import type { Chat } from "../../models/chat.model.js";
import type { SearchDecisionService } from "./search-decision.interface.js";
import type { LLMService } from "../llm/llm.interface.js";

/**
 * Replaces the brittle keyword-matching approach with an LLM classifier.
 * Makes a fast single-shot call asking "does this need a web search?"
 */
export class LLMSearchDecisionService implements SearchDecisionService {
    constructor(private llmService: LLMService) {}

    async shouldSearch(chat: Chat): Promise<boolean> {
        const recentMessages = chat.messages.slice(-3);
        const context = recentMessages
            .map((m) =>
                m.role === "user"
                    ? `User: ${m.content}`
                    : `Assistant: ${m.content}`
            )
            .join("\n");

        const prompt = `You are a routing assistant. Determine if the following conversation requires a real-time web search to answer accurately.

Search IS needed for: current events, live scores/prices, recent news, weather, product releases, match results, sports standings, anything that changes over time or happened recently, and anything the user explicitly asks you to search for.

Search is NOT needed for: general knowledge, math, coding help, explanations of concepts, creative writing, or anything answerable confidently from training data.

Conversation:
${context}

Answer with only YES or NO.`;

        const response = await this.llmService.generateText(prompt);
        return response.trim().toUpperCase().startsWith("YES");
    }
}
