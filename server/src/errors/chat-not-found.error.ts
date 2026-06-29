export class ChatNotFoundError extends Error {
    constructor(chatId: string) {
        super(`Chat not found: ${chatId}`);
        this.name = "ChatNotFoundError";
    }
}