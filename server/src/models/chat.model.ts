import type { Message } from "./message.model.js";

export interface Chat {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}