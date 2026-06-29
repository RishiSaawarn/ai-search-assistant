export type MessageRole = "system" | "user" | "assistant";

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: Date;
}