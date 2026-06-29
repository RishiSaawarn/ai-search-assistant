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

        const searchKeywords = [
            "today",
            "latest",
            "current",
            "recent",
            "news",
            "yesterday",
            "price",
            "weather",
            "live"
        ];

        return searchKeywords.some(keyword =>
            text.includes(keyword)
        );
    }
}