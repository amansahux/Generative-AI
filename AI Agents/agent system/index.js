import readline from "readline";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { supervisorAgent } from "./agents/supervisor.js";
import { groqModel } from "./models/groq.js";
import { mistralModel } from "./models/mistral.js";
import { openRouterModel } from "./models/openRouter.js";

let chatHistory = [];

export async function startInteractiveTerminal() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("==========================================");
    console.log("🤖 Supervisor Agent Terminal Started");
    console.log("Type 'exit' or 'quit' to stop.");
    console.log("==========================================\n");

    const promptUser = () => {
        rl.question("You: ", async (userInput) => {
            const trimmed = userInput.trim();
            if (!trimmed) {
                return promptUser();
            }

            if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
                console.log("Goodbye!");
                rl.close();
                return;
            }

            chatHistory.push(new HumanMessage(trimmed));

            try {
                console.log("\n[Supervisor Thinking & Coordinating Specialists...]\n");
                const result = await supervisorAgent.invoke({ messages: chatHistory });
                
                // Get the final AI response from the messages state
                const lastMsg = result?.messages?.[result.messages.length - 1];
                const answerStr = typeof lastMsg?.content === "string" 
                    ? lastMsg.content 
                    : (lastMsg?.content ? JSON.stringify(lastMsg.content, null, 2) : JSON.stringify(result, null, 2));
                
                console.log(`🤖 Supervisor:\n${answerStr}\n`);
                
                if (lastMsg) {
                    chatHistory.push(lastMsg);
                } else {
                    chatHistory.push(new AIMessage(answerStr));
                }
            } catch (error) {
                console.error("\n❌ Supervisor invocation failed:", error.message || error);
            }

            promptUser();
        });
    };

    promptUser();
}

// Start the terminal loop immediately when running `node index.js`
startInteractiveTerminal();