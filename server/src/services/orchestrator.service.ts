import { ConversationService } from "./conversation.service.js";

import type { LLMService } from "./llm/llm.interface.js";
import type { SearchDecisionService } from "./search/search-decision.interface.js";
import type { PromptBuilder } from "./prompt/prompt-builder.interface.js";

export class OrchestratorService {
    constructor(
        private conversationService: ConversationService,
        private llmService: LLMService,
        private searchDecisionService: SearchDecisionService,
        private promptBuilder: PromptBuilder
    ) {}

    async handleMessage(
        chatId: string,
        message: string
    ): Promise<string> {
        // Store the user's message
        this.conversationService.addMessage(
            chatId,
            "user",
            message
        );

        // Retrieve updated conversation
        const chat = this.conversationService.getChat(chatId);

        // Decide whether search is required
        const shouldSearch =
            await this.searchDecisionService.shouldSearch(chat);

        console.log("Search required:", shouldSearch);

        // Placeholder for future retrieved web context
        let retrievedContext = "";

        if (shouldSearch) {
            // Future implementation:
            // const searchResults = await this.searchService.search(message);
            // retrievedContext = await this.crawlerService.crawl(searchResults);
        }

        // Build prompt
        const prompt =
            await this.promptBuilder.buildPrompt(
                chat,
                retrievedContext
            );

        // Generate AI response
        const reply =
            await this.llmService.generateResponse(prompt);

        // Store assistant response
        this.conversationService.addMessage(
            chatId,
            "assistant",
            reply
        );

        return reply;
    }
}