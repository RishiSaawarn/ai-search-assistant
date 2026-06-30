import type { Chat } from "../../models/chat.model.js";
import type { SearchDecisionService } from "./search-decision.interface.js";

export class RuleBasedSearchDecisionService
    implements SearchDecisionService {

    async shouldSearch(chat: Chat): Promise<boolean> {

        const latestMessage =
            chat.messages[chat.messages.length - 1];

        if (!latestMessage) {
            return false;
        }

        const text = latestMessage.content.toLowerCase();

        // If the user explicitly asks to search, always do it
        const explicitSearchPhrases = [
            "search",
            "look up",
            "look it up",
            "find out",
            "find me",
            "google",
            "browse",
            "check online",
            "search for",
            "search and tell",
        ];

        if (explicitSearchPhrases.some(phrase => text.includes(phrase))) {
            return true;
        }

        // Time-sensitive or real-world data signals
        const searchKeywords = [
            "today",
            "latest",
            "current",
            "recent",
            "news",
            "yesterday",
            "price",
            "weather",
            "live",
            "score",
            "result",
            "standings",
            "match",
            "game",
            "winner",
            "who won",
            "who is",
            "what is",
            "what are",
            "how much",
            "how many",
            "when did",
            "when is",
            "where is",
            "update",
            "stock",
            "crypto",
            "election",
            "release",
            "launched",
            "announced",
            "happening",
            "schedule",
            "deadline",
            "trending",
        ];

        return searchKeywords.some(keyword =>
            text.includes(keyword)
        );
    }
}