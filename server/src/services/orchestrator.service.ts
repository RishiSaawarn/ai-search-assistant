export class OrchestratorService {
    async handleChat(message: string) {
        return {
            reply: `You said: ${message}`
        };
    }
}