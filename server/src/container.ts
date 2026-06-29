import { ConversationService } from "./services/conversation.service.js";
import { DummyLLMService } from "./services/llm/dummy-llm.service.js";
import { OrchestratorService } from "./services/orchestrator.service.js";
export const conversationService = new ConversationService();

export const llmService = new DummyLLMService();

export const orchestratorService =
new OrchestratorService(
    conversationService,
    llmService
);