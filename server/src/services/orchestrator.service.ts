import type { SearchService } from "./search/search.interface.js";
import type { RetrievedDocument, Source } from "../models/retrieved-document.model.js";
import { ConversationService } from "./conversation.service.js";

import type { LLMService } from "./llm/llm.interface.js";
import type { SearchDecisionService } from "./search/search-decision.interface.js";
import type { PromptBuilder } from "./prompt/prompt-builder.interface.js";
import type { QueryReformulationService } from "./search/query-reformulation.service.js";

export interface HandleMessageResult {
    reply: string;
    sources: Source[];
}

export class OrchestratorService {
    constructor(
        private conversationService: ConversationService,
        private llmService: LLMService,
        private searchDecisionService: SearchDecisionService,
        private promptBuilder: PromptBuilder,
        private searchService: SearchService,
        private queryReformulationService: QueryReformulationService,
    ) {}

    async handleMessage(
        chatId: string,
        message: string
    ): Promise<HandleMessageResult> {
        // Store the user's message
        this.conversationService.addMessage(chatId, "user", message);

        // Retrieve updated conversation
        const chat = this.conversationService.getChat(chatId);

        // Use LLM to decide whether a web search is required
        const shouldSearch = await this.searchDecisionService.shouldSearch(chat);
        console.log("Search required:", shouldSearch);

        let documents: RetrievedDocument[] = [];
        let sources: Source[] = [];

        if (shouldSearch) {
            // Reformulate the query into a clean, self-contained search query
            const searchQuery = await this.queryReformulationService.reformulate(chat);
            console.log("Search query:", searchQuery);

            const searchResults = await this.searchService.search(searchQuery);

            // Use Tavily's pre-extracted content directly — no slow sequential crawling
            documents = searchResults.map((result) => ({
                title: result.title,
                url: result.url,
                content: result.snippet,
                score: result.score,
            }));

            sources = documents.map((doc) => ({
                title: doc.title,
                url: doc.url,
            }));
        }

        const prompt = await this.promptBuilder.buildPrompt(chat, documents);

        // Generate AI response
        const reply = await this.llmService.generateResponse(prompt);

        // Store assistant response
        this.conversationService.addMessage(chatId, "assistant", reply);

        return { reply, sources };
    }
}

