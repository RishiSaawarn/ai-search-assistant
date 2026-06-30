import type { Chat } from "../../models/chat.model.js";
import type { Prompt } from "../../models/prompt.model.js";
import type { RetrievedDocument } from "../../models/retrieved-document.model.js";

import type { PromptBuilder } from "./prompt-builder.interface.js";
import { ConversationFormatterService } from "./conversation-formatter.service.js";

const SYSTEM_PROMPT = `
You are a helpful AI assistant.

If retrieved documents are available, prioritize them.

If they are insufficient, answer using your own knowledge and clearly state any uncertainty.
`;

export class DefaultPromptBuilderService
    implements PromptBuilder
{
    constructor(
        private formatter: ConversationFormatterService
    ) {}

    async buildPrompt(
        chat: Chat,
        documents: RetrievedDocument[]
    ): Promise<Prompt> {

        const conversation =
            this.formatter.format(chat);

        const latestUserMessage =
            chat.messages.findLast(
                message => message.role === "user"
            );

        const retrievedContext =
            documents
                .map((document, index) => {

                    return `
Document ${index + 1}

Title:
${document.title}

URL:
${document.url}

Content:
${document.content}
`;
                })
                .join("\n------------------------\n");

        return {

            system: SYSTEM_PROMPT,

            userQuery: latestUserMessage?.content ?? "",

            conversation,

            retrievedContext

        };
    }
}