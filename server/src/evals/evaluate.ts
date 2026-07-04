import "dotenv/config";
import { Client } from "langsmith";
import { readFileSync } from "fs";
import { orchestratorService } from "../container.js";
import { randomUUID } from "crypto";

// Initialize Langsmith Client
const client = new Client({
    apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
    apiKey: process.env.LANGSMITH_API_KEY!,
});

const PROJECT_NAME = process.env.LANGSMITH_PROJECT || "ai-search-assistant";

async function runEvals() {
    console.log("Starting Evaluation Pipeline...");
    
    // Load dataset
    const dataset = JSON.parse(readFileSync(new URL("./golden_dataset.json", import.meta.url), "utf-8"));
    
    for (const item of dataset) {
        const chatId = randomUUID();
        console.log(`\nEvaluating question: "${item.question}"`);

        // Start tracing
        const runId = randomUUID();
        await client.createRun({
            name: "QA_Pipeline",
            run_type: "chain",
            id: runId,
            inputs: { question: item.question },
            project_name: PROJECT_NAME,
        });

        let output;
        try {
            // Run the main orchestrator (which includes guardrails, search, and portkey LLM generation)
            const result = await orchestratorService.handleMessage(chatId, item.question);
            output = result.reply;
            
            console.log(`Assistant Reply: ${output}`);
            
            // Basic heuristic evaluation (In a real scenario, use LLM-as-a-judge)
            const isCorrect = output.toLowerCase().includes(item.expected_answer.toLowerCase()) || 
                              (item.question.includes("ignore") && output.includes("cannot process"));

            // Log evaluation result to langsmith
            await client.createFeedback(runId, "correctness", {
                score: isCorrect ? 1.0 : 0.0,
            });

            // End trace
            await client.updateRun(runId, {
                outputs: { reply: output, sources: result.sources },
                end_time: Date.now(),
            });

        } catch (error: any) {
            console.error(`Evaluation failed for question: ${item.question}`, error);
            await client.updateRun(runId, {
                error: error.message,
                end_time: Date.now(),
            });
        }
    }
    
    console.log("\nEvaluation Complete! Check your LangSmith dashboard.");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    import("dotenv/config").then(() => runEvals());
}
