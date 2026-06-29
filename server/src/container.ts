import { ConversationService } from "./services/conversation.service.js";
import { ConversationFormatterService } from "./services/prompt/conversation-formatter.service.js";
import { DefaultPromptBuilderService } from "./services/prompt/default-prompt-builder.service.js";
import { OrchestratorService } from "./services/orchestrator.service.js";
import { GeminiLLMService } from "./services/llm/gemini-llm.service.js";

export const conversationFormatter =
    new ConversationFormatterService();

export const promptBuilder =
    new DefaultPromptBuilderService(
        conversationFormatter
    );

export const conversationService = new ConversationService();
import { RuleBasedSearchDecisionService } from "./services/search/rule-based-search-decision.service.js";

export const llmService = new GeminiLLMService();

export const searchDecisionService =
    new RuleBasedSearchDecisionService();

export const orchestratorService =
    new OrchestratorService(
        conversationService,
        llmService,
        searchDecisionService,
        promptBuilder
    );