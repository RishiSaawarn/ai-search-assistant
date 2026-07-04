import { ConversationService } from "./services/conversation.service.js";
import { DefaultPromptBuilderService } from "./services/prompt/default-prompt-builder.service.js";
import { OrchestratorService } from "./services/orchestrator.service.js";
import { PortkeyLLMService } from "./services/llm/portkey-llm.service.js";
import { TavilySearchService } from "./services/search/tavily-search.service.js";
import { LLMSearchDecisionService } from "./services/search/llm-search-decision.service.js";
import { QueryReformulationService } from "./services/search/query-reformulation.service.js";
import { ReadabilityCrawlerService } from "./services/crawler/readability-crawler.service.js";
import { LLMJudgeService } from "./services/guardrails/llm-judge.service.js";

// Core services (no dependencies)
export const conversationService = new ConversationService();
export const llmService = new PortkeyLLMService();
export const searchService = new TavilySearchService();
export const crawlerService = new ReadabilityCrawlerService();
export const llmJudgeService = new LLMJudgeService();

// LLM-powered routing & query services
export const searchDecisionService = new LLMSearchDecisionService(llmService);
export const queryReformulationService = new QueryReformulationService(llmService);

// Prompt builder (context window + structured history)
export const promptBuilder = new DefaultPromptBuilderService();

// Main orchestrator
export const orchestratorService = new OrchestratorService(
    conversationService,
    llmService,
    searchDecisionService,
    promptBuilder,
    searchService,
    queryReformulationService,
    llmJudgeService
);