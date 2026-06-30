import type { SearchService } from "./search/search.interface.js";
import type { CrawlerService } from "./crawler/crawler.interface.js";
import type { RetrievedDocument } from "../models/retrieved-document.model.js";
import { ConversationService } from "./conversation.service.js";

import type { LLMService } from "./llm/llm.interface.js";
import type { SearchDecisionService } from "./search/search-decision.interface.js";
import type { PromptBuilder } from "./prompt/prompt-builder.interface.js";

export class OrchestratorService {
    constructor(
    private conversationService: ConversationService,
    private llmService: LLMService,
    private searchDecisionService: SearchDecisionService,
    private promptBuilder: PromptBuilder,
    private searchService: SearchService,
    private crawlerService: CrawlerService
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
                    let documents: RetrievedDocument[] = [];

            if (shouldSearch) {
                const searchResults =
                    await this.searchService.search(message);

                documents =
                    await this.crawlerService.crawl(searchResults);
            }

            const prompt =
                await this.promptBuilder.buildPrompt(
                    chat,
                    documents
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