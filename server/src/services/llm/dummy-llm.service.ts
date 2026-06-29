import type { Chat } from "../../models/chat.model.js";
import type { LLMService } from "./llm.interface.js";

export class DummyLLMService implements LLMService {
    async generateResponse(chat: Chat): Promise<string> {
        return "Dummy AI Response";
    }
}