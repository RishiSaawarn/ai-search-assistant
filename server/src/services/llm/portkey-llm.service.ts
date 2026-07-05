import { Portkey } from "portkey-ai";
import type { Prompt } from "../../models/prompt.model.js";
import type { LLMService } from "./llm.interface.js";

export class PortkeyLLMService implements LLMService {
    private portkey: Portkey;
    private readonly model = "@google-gemini2/gemini-3.1-flash-lite";

    constructor() {
        const portkeyApiKey = process.env.PORTKEY_API_KEY;

        if (!portkeyApiKey) {
            throw new Error("PORTKEY_API_KEY is not defined.");
        }

        // Initialize Portkey passing only the API key
        this.portkey = new Portkey({
            apiKey: portkeyApiKey
        });
    }

    async generateResponse(prompt: Prompt): Promise<string> {
        // Append retrieved web context to the final user message
        const userContent = prompt.retrievedContext
            ? `${prompt.userQuery}\n\n--- Retrieved Web Context ---\n${prompt.retrievedContext}`
            : prompt.userQuery;

        const messages: any[] = prompt.history.map((turn) => ({
            role: turn.role === "assistant" ? "assistant" : "user",
            content: turn.content,
        }));
        
        messages.push({ role: "user", content: userContent });

        // Add system prompt as the first message
        if (prompt.system) {
            messages.unshift({ role: "system", content: prompt.system });
        }

        const response = await this.portkey.chat.completions.create({
            model: this.model,
            messages: messages,
            max_tokens: 512
        });

        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? content : "No response generated.";
    }

    async generateText(prompt: string): Promise<string> {
        const response = await this.portkey.chat.completions.create({
            model: this.model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512
        });

        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? content.trim() : "";
    }
}
