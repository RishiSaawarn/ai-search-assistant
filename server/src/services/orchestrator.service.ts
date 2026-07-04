import type { SearchService } from "./search/search.interface.js";
import type { RetrievedDocument, Source } from "../models/retrieved-document.model.js";
import { ConversationService } from "./conversation.service.js";

import type { LLMService } from "./llm/llm.interface.js";
import type { SearchDecisionService } from "./search/search-decision.interface.js";
import type { PromptBuilder } from "./prompt/prompt-builder.interface.js";
import type { QueryReformulationService } from "./search/query-reformulation.service.js";
import type { LLMJudgeService } from "./guardrails/llm-judge.service.js";

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
        private llmJudgeService: LLMJudgeService,
    ) {}

    async handleMessage(
        chatId: string,
        message: string
    ): Promise<HandleMessageResult> {
        // 1. Input Guardrails & Intent Transformation (Groq)
        console.log("Running Input Judge...");
        const inputCheck = await this.llmJudgeService.evaluateAndTransformInput(message);
        
        if (!inputCheck.isValid) {
            const reply = inputCheck.reason || "I'm sorry, but I cannot process this request due to safety policies.";
            this.conversationService.addMessage(chatId, "user", message);
            this.conversationService.addMessage(chatId, "assistant", reply);
            return { reply, sources: [] };
        }

        // Store the user's raw message
        this.conversationService.addMessage(chatId, "user", message);

        // Retrieve updated conversation
        const chat = this.conversationService.getChat(chatId);

        // Use LLM to decide whether a web search is required
        const shouldSearch = await this.searchDecisionService.shouldSearch(chat);
        console.log("Search required:", shouldSearch);

        let documents: RetrievedDocument[] = [];
        let sources: Source[] = [];

        if (shouldSearch) {
            const searchQuery = await this.queryReformulationService.reformulate(chat);
            console.log("Search query:", searchQuery);

            const searchResults = await this.searchService.search(searchQuery);

            documents = searchResults.map((result) => ({
                title: result.title,
                url: result.url,
                content: result.snippet,
                score: result.score ?? 0,
            }));

            sources = documents.map((doc) => ({
                title: doc.title,
                url: doc.url,
            }));
        }

        const prompt = await this.promptBuilder.buildPrompt(chat, documents);
        
        // Inject the Judge's clear instructions along with the raw input to guide the main LLM
        if (inputCheck.transformedIntent) {
            prompt.userQuery = `Original Input: ${prompt.userQuery}\n\nClear Instructions (Follow these): ${inputCheck.transformedIntent}`;
        }

        // Generate AI response
        const reply = await this.llmService.generateResponse(prompt);

        // 2. Output Guardrails Check (Groq)
        console.log("Running Output Judge...");
        const outputCheck = await this.llmJudgeService.evaluateOutput(reply);
        if (!outputCheck.isValid) {
            const safeReply = outputCheck.reason || "I generated a response, but it was blocked by safety filters.";
            this.conversationService.addMessage(chatId, "assistant", safeReply);
            return { reply: safeReply, sources: [] };
        }

        // Store assistant response
        this.conversationService.addMessage(chatId, "assistant", reply);

        return { reply, sources };
    }
}
