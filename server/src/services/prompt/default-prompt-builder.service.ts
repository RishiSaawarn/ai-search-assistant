import type { Chat } from "../../models/chat.model.js";
import type { Prompt } from "../../models/prompt.model.js";

import type { PromptBuilder } from "./prompt-builder.interface.js";
import { ConversationFormatterService } from "./conversation-formatter.service.js";

const SYSTEM_PROMPT =
    `You are a helpful AI assistant.
Use retrieved context when available.
If the context is insufficient,
answer using your own knowledge
and state any uncertainty.`;

export class DefaultPromptBuilderService
    implements PromptBuilder
{
    constructor(
        private formatter: ConversationFormatterService
    ) {}

    async buildPrompt(
        chat: Chat,
        retrievedContext: string
    ): Promise<Prompt> {
        const conversation =
            this.formatter.format(chat);

        const latestUserMessage =
            [...chat.messages]
                .reverse()
                .find((message) => message.role === "user");

        return {
            system: SYSTEM_PROMPT,

            userQuery: latestUserMessage?.content ?? "",

            conversation,

            retrievedContext,
        };
    }
}