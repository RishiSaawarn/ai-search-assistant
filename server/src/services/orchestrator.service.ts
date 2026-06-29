import { ConversationService } from "./conversation.service.js";
import type { LLMService } from "./llm/llm.interface.js";
import type { SearchDecisionService } from "../services/search/search-decision.interface.js";

export class OrchestratorService {
    constructor(
    private conversationService: ConversationService,
    private llmService: LLMService,
    private searchDecisionService: SearchDecisionService
) {}

    async handleMessage(
    chatId: string,
    message: string
): Promise<string> {
    // Store user message
    this.conversationService.addMessage(
        chatId,
        "user",
        message
    );

    // Get updated conversation
    const chat = this.conversationService.getChat(chatId);

    // Decide whether web search is needed
    const shouldSearch =
        await this.searchDecisionService.shouldSearch(chat);

    console.log("Search required:", shouldSearch);

    // For now, we ignore the decision and always use the LLM
    const reply = await this.llmService.generateResponse(chat);

    // Store assistant response
    this.conversationService.addMessage(
        chatId,
        "assistant",
        reply
    );

    return reply;
}
}