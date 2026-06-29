import type { Chat } from "../../models/chat.model.js";

export interface SearchDecisionService {
    shouldSearch(chat: Chat): Promise<boolean>;
}