import { ConversationService } from "./conversation.service.js";

import type { LLMService } from "./llm/llm.interface.js";

export class OrchestratorService {
    constructor(
        private conversationService: ConversationService,
        private llmService: LLMService
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

        // Get the updated conversation
        const chat = this.conversationService.getChat(chatId);

        // Generate AI response
        const reply = await this.llmService.generateResponse(chat);

        // Store the assistant's response
        this.conversationService.addMessage(
            chatId,
            "assistant",
            reply
        );

        // Return the response
        return reply;
    }
}