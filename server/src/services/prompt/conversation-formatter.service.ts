import type { Chat } from "../../models/chat.model.js";

export class ConversationFormatterService {
    format(chat: Chat): string {
        return chat.messages
            .map((message) => {
                const role =
                    message.role.charAt(0).toUpperCase() +
                    message.role.slice(1);

                return `${role}: ${message.content}`;
            })
            .join("\n");
    }
}