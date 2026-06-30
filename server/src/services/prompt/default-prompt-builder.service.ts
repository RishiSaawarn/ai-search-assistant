import type { Chat } from "../../models/chat.model.js";
import type { Prompt, ConversationTurn } from "../../models/prompt.model.js";
import type { RetrievedDocument } from "../../models/retrieved-document.model.js";
import type { PromptBuilder } from "./prompt-builder.interface.js";

/** Max number of recent messages to include in the context window */
const CONTEXT_WINDOW = 10;

function buildSystemPrompt(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

    return `You are a helpful AI search assistant with access to real-time web search.

Today's date is: ${dateStr}

## Core Rules

1. **Retrieved documents are ground truth.** When search results are provided, treat them as accurate and up-to-date. Do NOT contradict them with your training knowledge.

2. **Never claim you cannot search.** The system automatically performs web searches when needed. You always have access to current information through the retrieved documents.

3. **Be direct and confident.** Give clear, factual answers based on the retrieved documents. Do not hedge unnecessarily with phrases like "I cannot confirm" or "this might be hypothetical" when real documents are provided.

4. **If no documents are retrieved**, answer from your training knowledge but clearly note your knowledge cutoff may not include the latest events.

5. **Cite your sources** naturally when referencing retrieved documents (e.g., "According to [source]...").
`;
}

export class DefaultPromptBuilderService implements PromptBuilder {
    async buildPrompt(
        chat: Chat,
        documents: RetrievedDocument[]
    ): Promise<Prompt> {
        // Limit to the most recent messages to avoid token overflow
        const messages = chat.messages.slice(-CONTEXT_WINDOW);

        // All messages except the latest user message go into history
        const historyMessages = messages.slice(0, -1);
        const lastMessage = messages[messages.length - 1];

        const history: ConversationTurn[] = historyMessages.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
        }));

        const retrievedContext =
            documents.length > 0
                ? documents
                      .map(
                          (doc, index) =>
                              `Document ${index + 1}\nTitle: ${doc.title}\nURL: ${doc.url}\n\n${doc.content}`
                      )
                      .join("\n\n---\n\n")
                : "";

        return {
            system: buildSystemPrompt(),
            history,
            userQuery: lastMessage?.content ?? "",
            retrievedContext,
        };
    }
}

