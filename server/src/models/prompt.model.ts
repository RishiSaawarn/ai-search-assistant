export interface ConversationTurn {
    role: "user" | "assistant";
    content: string;
}

export interface Prompt {
    system: string;
    /** All turns except the latest user message */
    history: ConversationTurn[];
    /** The latest user query */
    userQuery: string;
    /** Retrieved web context (empty string if no search was done) */
    retrievedContext: string;
}